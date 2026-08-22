-- Allow media messages to have an empty text body.
alter table public.chat_messages drop constraint if exists chat_messages_body_check;
alter table public.chat_messages add constraint chat_messages_body_check check (
  (message_type = 'text' and char_length(body) between 1 and 1000)
  or (message_type <> 'text' and char_length(coalesce(body,'')) <= 1000)
);

-- Temporarily disable automatic close-contact presence pushes.
drop trigger if exists trg_close_contact_watching_push on public.live_status;

-- Browsing/no-program discussions are visible only for the current day.
-- Program discussions remain visible only until their expires_at.
create or replace function public.my_chat_rooms_v2()
returns table(room_id uuid, program_id uuid, program_title text, created_at timestamptz, expires_at timestamptz, member_ids uuid[], last_message text, last_message_at timestamptz, unread_count integer)
language sql
security definer
set search_path='public'
as $$
 select r.id,r.program_id,r.program_title,r.created_at,r.expires_at,
  array(select m.user_id from public.chat_room_members m where m.room_id=r.id order by m.joined_at),
  (select case when cm.message_type='image' then '📷 Photo' when cm.message_type='video' then '🎥 Vidéo' when cm.message_type='audio' then '🎙️ Audio' else cm.body end from public.chat_messages cm where cm.room_id=r.id order by cm.created_at desc limit 1),
  (select cm.created_at from public.chat_messages cm where cm.room_id=r.id order by cm.created_at desc limit 1),
  (select count(*)::int from public.chat_messages cm where cm.room_id=r.id and cm.sender_id<>auth.uid() and cm.created_at>me.last_read_at)
 from public.chat_rooms r
 join public.chat_room_members me on me.room_id=r.id and me.user_id=auth.uid()
 where ((r.program_id is null and r.created_at >= date_trunc('day',now()) and r.created_at < date_trunc('day',now()) + interval '1 day')
     or (r.program_id is not null and r.expires_at > now()))
 order by coalesce((select max(cm.created_at) from public.chat_messages cm where cm.room_id=r.id),r.created_at) desc;
$$;

create or replace function public.start_chat_with(target_user uuid, p_program_id uuid, p_program_title text)
returns uuid
language plpgsql
security definer
set search_path='public'
as $$
declare
 me uuid:=auth.uid(); rid uuid; my_mode text; their_mode text; my_program uuid; their_program uuid;
 context_program uuid; context_title text; expiry timestamptz; program_start timestamptz;
begin
 if me is null or target_user is null or target_user=me then raise exception 'invalid participants'; end if;
 select case when presence_mode='browsing' and coalesce(last_seen_at,updated_at)<now()-interval '2 hours' then 'off' else presence_mode end,program_id into my_mode,my_program from public.live_status where user_id=me;
 select case when presence_mode='browsing' and coalesce(last_seen_at,updated_at)<now()-interval '2 hours' then 'off' else presence_mode end,program_id into their_mode,their_program from public.live_status where user_id=target_user;
 if coalesce(my_mode,'off')='off' or coalesce(their_mode,'off')='off' then raise exception 'Un des participants est Offlive'; end if;
 if my_mode='watching' and their_mode='watching' and my_program is distinct from their_program then raise exception 'Vous devez regarder le même programme pour démarrer la discussion'; end if;
 context_program:=case when my_mode='watching' then my_program when their_mode='watching' then their_program else p_program_id end;
 context_title:=coalesce(nullif(p_program_title,''),(select title from public.tv_programs where id=context_program),'Discussion Onlive');
 select r.id into rid from public.chat_rooms r
 where r.program_id is not distinct from context_program
   and ((context_program is null and r.created_at>=date_trunc('day',now())) or (context_program is not null and r.expires_at>now()))
   and exists(select 1 from public.chat_room_members a where a.room_id=r.id and a.user_id=me)
   and exists(select 1 from public.chat_room_members b where b.room_id=r.id and b.user_id=target_user)
   and (select count(*) from public.chat_room_members c where c.room_id=r.id)=2
 order by r.created_at desc limit 1;
 if rid is null then
   if context_program is null then expiry:=date_trunc('day',now())+interval '1 day';
   else
     select (tp.program_date + tp.start_time) at time zone 'Europe/Paris' into program_start from public.tv_programs tp where tp.id=context_program;
     expiry:=greatest(now()+interval '4 hours',coalesce(program_start+interval '6 hours',now()+interval '8 hours'));
   end if;
   insert into public.chat_rooms(program_id,program_title,created_by,expires_at) values(context_program,context_title,me,expiry) returning id into rid;
   insert into public.chat_room_members(room_id,user_id,invited_by) values(rid,me,me),(rid,target_user,me) on conflict do nothing;
 end if;
 return rid;
end
$$;

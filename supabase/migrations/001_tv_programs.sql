create extension if not exists pgcrypto;

create table if not exists public.tv_programs (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  channel text not null,
  title text not null,
  category text not null check (category in ('Divertissement','Film','Série','Sport','Foot')),
  start_time time not null,
  image_url text not null,
  is_live boolean not null default false,
  source text,
  source_id text,
  updated_at timestamptz not null default now(),
  unique (date, channel, title, start_time)
);

create index if not exists tv_programs_date_idx on public.tv_programs(date);

alter table public.tv_programs enable row level security;

drop policy if exists "tv_programs are publicly readable" on public.tv_programs;
create policy "tv_programs are publicly readable"
on public.tv_programs for select
to anon, authenticated
using (true);

comment on table public.tv_programs is 'Programmes TV quotidiens affichés dans Onlive.';

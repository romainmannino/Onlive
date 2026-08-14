import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type FeedProgram = {
  date: string;
  channel: string;
  title: string;
  category: 'Divertissement' | 'Film' | 'Série' | 'Sport' | 'Foot';
  start_time: string;
  image_url: string;
  is_live?: boolean;
  source?: string;
  source_id?: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const feedUrl = Deno.env.get('ONLIVE_TV_FEED_URL');
    const feedToken = Deno.env.get('ONLIVE_TV_FEED_TOKEN');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let programs: FeedProgram[] = [];
    let body: any = null;
    try { body = await req.json(); } catch { body = null; }

    if (Array.isArray(body?.programs)) {
      programs = body.programs;
    } else if (feedUrl) {
      const response = await fetch(feedUrl, {
        headers: feedToken ? { Authorization: `Bearer ${feedToken}` } : {},
      });
      if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
      const json = await response.json();
      programs = Array.isArray(json) ? json : json.programs;
    } else {
      return new Response(JSON.stringify({ ok:false, error:'ONLIVE_TV_FEED_URL non configurée' }), { status:500, headers:{...corsHeaders,'Content-Type':'application/json'} });
    }

    if (!Array.isArray(programs) || programs.length === 0) {
      throw new Error('Aucun programme reçu');
    }

    const clean = programs.filter((p) => p.date && p.channel && p.title && p.category && p.start_time && p.image_url)
      .map((p) => ({ ...p, is_live: Boolean(p.is_live), updated_at: new Date().toISOString() }));

    const { error } = await supabase.from('tv_programs').upsert(clean, {
      onConflict: 'date,channel,title,start_time',
      ignoreDuplicates: false,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok:true, imported:clean.length }), { headers:{...corsHeaders,'Content-Type':'application/json'} });
  } catch (error) {
    return new Response(JSON.stringify({ ok:false, error:String(error) }), { status:500, headers:{...corsHeaders,'Content-Type':'application/json'} });
  }
});

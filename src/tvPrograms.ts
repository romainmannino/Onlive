export type ProgramCategory = 'Divertissement' | 'Film' | 'Série' | 'Sport' | 'Foot';

export type Program = {
  id: string;
  title: string;
  channel: string;
  category: ProgramCategory;
  time: string;
  image: string;
  isLive?: boolean;
};

export const FALLBACK_PROGRAMS: Program[] = [
  { id:'tf1-1', title:'Une famille en or', channel:'TF1', category:'Divertissement', time:'21:10', image:'https://tf1pro.com/sites/default/files/styles/fiches/public/media-import/Famille%20en%20or%20Ruquier%20Bernier.jpg?itok=AMIwCdSl' },
  { id:'f2-1', title:'Capitaine Marleau', channel:'France 2', category:'Série', time:'21:10', image:'https://www.serie-news.com/app/uploads/2026/08/capitaine-marleau-france2-corinne-masiero-14-aout-1-1280x640.webp' },
  { id:'m6-1', title:'La Chambre des merveilles', channel:'M6', category:'Film', time:'21:10', image:'https://www.serie-news.com/app/uploads/2026/08/la-chambre-des-merveilles-m6-alexandra-lamy-14-aout-1280x640.webp' },
  { id:'arte-1', title:'Meurtres à Sandhamn', channel:'Arte', category:'Série', time:'20:55', image:'https://www.serie-news.com/app/uploads/2026/08/meurtres-a-sandhamn-arte-14-aout-1280x640.webp' },
  { id:'bein-1', title:'Saint-Étienne – Clermont', channel:'beIN Sports 1', category:'Foot', time:'20:40', image:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80', isLive:true },
  { id:'euro-1', title:'Masters 1000 de Cincinnati', channel:'Eurosport', category:'Sport', time:'19:00', image:'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?auto=format&fit=crop&w=900&q=80', isLive:true },
];

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const parisDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());

export async function fetchTvPrograms(date = parisDate()): Promise<Program[]> {
  if (!url || !anonKey) return [];
  const endpoint = `${url}/rest/v1/tv_programs?date=eq.${encodeURIComponent(date)}&select=id,title,channel,category,start_time,image_url,is_live&order=start_time.asc`;
  const response = await fetch(endpoint, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
  if (!response.ok) throw new Error(`tv_programs HTTP ${response.status}`);
  const rows = await response.json();
  return rows.map((row:any) => ({
    id: String(row.id),
    title: row.title,
    channel: row.channel,
    category: row.category as ProgramCategory,
    time: String(row.start_time).slice(0,5),
    image: row.image_url,
    isLive: Boolean(row.is_live),
  }));
}

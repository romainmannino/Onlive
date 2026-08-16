import { supabase } from './supabase';

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

const CATEGORY_FALLBACKS: Record<ProgramCategory,string> = {
  Divertissement:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85',
  Film:'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85',
  Série:'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=85',
  Sport:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85',
  Foot:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=85',
};

// Only keep URLs here that have proven stable in the native app.
// More artwork is now resolved/cached server-side by resolve-program-images.
const PROGRAM_IMAGE_RULES: Array<{match:RegExp,image:string}> = [
  {match:/\bune famille en or\b/i,image:'https://tf1pro.com/sites/default/files/styles/fiches/public/media-import/Famille%20en%20or%20Ruquier%20Bernier.jpg?itok=AMIwCdSl'},
];

const GENERIC_IMAGE_MARKERS = [
  'images.unsplash.com/photo-1579952363873-27f3bade9f55',
  'images.unsplash.com/photo-1461896836934-ffe607ba8211',
  'images.unsplash.com/photo-1530137073520-4ea6e2f10a48',
  'images.unsplash.com/photo-1485846234645-a62644f84728',
  'images.unsplash.com/photo-1522869635100-9f4c5e86aa37',
  'images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'images.unsplash.com/photo-1489599849927-2ee91cede3ba',
];

function cleanTitle(value=''){
  return value
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’']/g,"'")
    .replace(/\s+/g,' ')
    .trim();
}

function isGenericImage(image?:string|null){
  return !image || GENERIC_IMAGE_MARKERS.some(marker=>image.includes(marker));
}

export function resolveProgramImage(title:string,category:ProgramCategory,image?:string|null){
  const normalized=cleanTitle(title);
  const known=PROGRAM_IMAGE_RULES.find(rule=>rule.match.test(normalized));
  if(known)return known.image;
  if(image&&image.trim())return image.trim();
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.Divertissement;
}

export const FALLBACK_PROGRAMS: Program[] = [
  { id:'tf1-1', title:'Une famille en or', channel:'TF1', category:'Divertissement', time:'21:10', image:resolveProgramImage('Une famille en or','Divertissement') },
  { id:'f2-1', title:'Capitaine Marleau', channel:'France 2', category:'Série', time:'21:10', image:resolveProgramImage('Capitaine Marleau','Série','https://www.serie-news.com/app/uploads/2026/08/capitaine-marleau-france2-corinne-masiero-14-aout-1-1280x640.webp') },
  { id:'m6-1', title:'La Chambre des merveilles', channel:'M6', category:'Film', time:'21:10', image:resolveProgramImage('La Chambre des merveilles','Film','https://www.serie-news.com/app/uploads/2026/08/la-chambre-des-merveilles-m6-alexandra-lamy-14-aout-1280x640.webp') },
  { id:'arte-1', title:'Meurtres à Sandhamn', channel:'Arte', category:'Série', time:'20:55', image:resolveProgramImage('Meurtres à Sandhamn','Série','https://www.serie-news.com/app/uploads/2026/08/meurtres-a-sandhamn-arte-14-aout-1280x640.webp') },
  { id:'bein-1', title:'Saint-Étienne – Clermont', channel:'beIN Sports 1', category:'Foot', time:'20:40', image:resolveProgramImage('Saint-Étienne – Clermont','Foot'), isLive:true },
  { id:'euro-1', title:'Masters 1000 de Cincinnati', channel:'Eurosport', category:'Sport', time:'19:00', image:resolveProgramImage('Masters 1000 de Cincinnati','Sport','https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?auto=format&fit=crop&w=900&q=80'), isLive:true },
];

export const parisDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Paris', year:'numeric', month:'2-digit', day:'2-digit'
}).format(new Date());

export async function fetchTvPrograms(date = parisDate()): Promise<Program[]> {
  const { data, error } = await supabase
    .from('tv_programs')
    .select('id,title,channel,category,start_time,image_url,is_live')
    .eq('program_date', date)
    .order('start_time', { ascending: true });

  if (error) throw error;
  const rows:any[] = data || [];

  // Ask the server-side resolver only for missing/generic artwork. It caches the
  // result and also writes it back to tv_programs, so subsequent loads are fast.
  const needsArtwork = rows.filter(row=>isGenericImage(row.image_url));
  const resolvedById = new Map<string,string>();
  if (needsArtwork.length) {
    try {
      const { data: resolved } = await supabase.functions.invoke('resolve-program-images', {
        body: { programs: needsArtwork.map(row=>({
          id:String(row.id), title:row.title, channel:row.channel,
          category:row.category, image_url:row.image_url,
        })) }
      });
      for (const item of resolved?.results || []) {
        if (item?.id && item?.image_url) resolvedById.set(String(item.id), item.image_url);
      }
    } catch (e) {
      console.warn('Program image resolver unavailable, using local fallback', e);
    }
  }

  return rows.map((row:any) => {
    const category=row.category as ProgramCategory;
    const serverImage=resolvedById.get(String(row.id));
    return {
      id: String(row.id),
      title: row.title,
      channel: row.channel,
      category,
      time: String(row.start_time).slice(0,5),
      image: resolveProgramImage(row.title,category,serverImage || row.image_url),
      isLive: Boolean(row.is_live),
    };
  });
}

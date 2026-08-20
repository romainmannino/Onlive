import { supabase } from './supabase';

export type ProgramCategory =
  | 'Divertissement' | 'Documentaire' | 'Film' | 'Série'
  | 'Sport' | 'Foot' | 'Tennis' | 'Rugby' | 'Basket' | 'Handball'
  | 'MMA' | 'Boxe' | 'Athlétisme' | 'Cyclisme' | 'Golf' | 'F1 / Auto' | 'Natation';

export type Program = {
  id: string;
  title: string;
  channel: string;
  category: ProgramCategory;
  time: string;
  image: string;
  isLive?: boolean;
  source?: string;
  date?: string;
  channelLogo?: string;
  featured?: boolean;
};

const CATEGORY_FALLBACKS: Record<ProgramCategory,string> = {
  Divertissement:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85',
  Documentaire:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
  Film:'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85',
  Série:'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=85',
  Sport:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85',
  Foot:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=85',
  Tennis:'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?auto=format&fit=crop&w=900&q=85',
  Rugby:'https://images.unsplash.com/photo-1515808266237-4d3d3f384788?auto=format&fit=crop&w=900&q=85',
  Basket:'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85',
  Handball:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85',
  MMA:'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=85',
  Boxe:'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=85',
  Athlétisme:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85',
  Cyclisme:'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85',
  Golf:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=900&q=85',
  'F1 / Auto':'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=85',
  Natation:'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=85',
};

// Curated Onlive library. These entries have priority over feed/API artwork so
// recurring flagship programmes always keep a recognisable, stable visual.
const PROGRAM_IMAGE_RULES: Array<{match:RegExp,image:string}> = [
  {match:/^capital\b/i,image:'https://fusion.molotov.tv/arts/i/446x588/Ch8SHQoUbyTZGQah98A_jJCPkVDZbvKxongSA2pwZxgBCh8IARIbChRu-JiZgm8Kj2R4YcqCHzqhL_f5jhIDcG5n/jpg'},
  {match:/\bune famille en or\b/i,image:'https://tf1pro.com/sites/default/files/styles/fiches/public/media-import/Famille%20en%20or%20Ruquier%20Bernier.jpg?itok=AMIwCdSl'},
];

const GENERIC_IMAGE_MARKERS = [
  'commons.wikimedia.org/wiki/Special:Redirect/file/',
  'images.unsplash.com/photo-1579952363873-27f3bade9f55',
  'images.unsplash.com/photo-1461896836934-ffe607ba8211',
  'images.unsplash.com/photo-1595435742656-5272d0b3fa82',
  'images.unsplash.com/photo-1595435934249-5df7ed86e1c0',
  'images.unsplash.com/photo-1546519638-68e109498ffc',
  'images.unsplash.com/photo-1515808266237-4d3d3f384788',
  'images.unsplash.com/photo-1549719386-74dfcbf7dbed',
  'images.unsplash.com/photo-1517649763962-0c623066013b',
  'images.unsplash.com/photo-1535131749006-b7f58c99034b',
  'images.unsplash.com/photo-1503736334956-4c8f8e92946d',
  'images.unsplash.com/photo-1530549387789-4c1017266635',
  'images.unsplash.com/photo-1570498839593-e565b39455fc',
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

function artworkPath(title:string,category:ProgramCategory){
  const t=cleanTitle(title).toLowerCase();
  if(category==='Foot'||/football|ligue 1|champions league|europa league|premier league|bundesliga|psg|marseille|lens|auxerre/.test(t))return'programs/football.PNG';
  if(category==='Tennis'||/tennis|wta|atp|roland|wimbledon|cincinnati/.test(t))return'programs/tennis.PNG';
  if(category==='Basket'||/basket|nba|euroleague/.test(t))return'programs/basket.PNG';
  if(category==='Rugby'||/rugby|top 14|six nations|champions cup|challenge cup|leinster|bordeaux[- ]begles/.test(t))return'programs/rugby.PNG';
  if(category==='Cyclisme'||/cycl|tour de france|giro|vuelta/.test(t))return'programs/cyclisme.PNG';
  if(category==='F1 / Auto'||/formule 1|formula 1|\bf1\b|grand prix/.test(t))return'programs/formule 1.PNG';
  if(category==='Natation'||/natation|swim/.test(t))return'programs/natation.PNG';
  if(category==='MMA'||/\bmma\b|ufc/.test(t))return'programs/mma.PNG';
  if(category==='Boxe'||/boxe|boxing/.test(t))return'programs/boxe.PNG';
  if(category==='Athlétisme'||/athlet|diamond league|meeting/.test(t))return'programs/athletisme.PNG';
  if(category==='Handball'||/handball/.test(t))return'programs/handball.PNG';
  if(category==='Golf'||/golf/.test(t))return'programs/golf (6).PNG';
  if(category==='Documentaire')return'programs/documentaire.PNG';
  if(category==='Film')return'programs/film.PNG';
  if(category==='Série')return'programs/serie.PNG';
  return'programs/divertissement.PNG';
}
export function resolveProgramImage(title:string,category:ProgramCategory,image?:string|null){
  const curated=PROGRAM_IMAGE_RULES.find(rule=>rule.match.test(title));
  if(curated)return curated.image;
  if(image&&!isGenericImage(image))return image;
  return supabase.storage.from('program-artworks').getPublicUrl(artworkPath(title,category)).data.publicUrl;
}

function channelLogoFallback(channel='') {
  const c=channel.toLowerCase();
  const domain = c.includes('france 2') ? 'france.tv' : c.includes('m6') ? 'm6.fr' : c.includes('tmc') ? 'tf1.fr' : c.includes('équipe') || c.includes('equipe') ? 'lequipe.fr' : c.includes('bein') ? 'bein.com' : c.includes('canal+') ? 'canalplus.com' : c.includes('rmc sport') ? 'rmcsport.bfmtv.com' : c.includes('6ter') ? '6play.fr' : c.includes('ligue 1+') ? 'ligue1.com' : '';
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : undefined;
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
  try {
    const { count } = await supabase.from('tv_programs').select('id',{count:'exact',head:true}).eq('program_date',date).eq('source','xmltvfr');
    if(!count) await supabase.functions.invoke('import-xmltv',{body:{date}});
  } catch(e) { console.warn('XMLTV import unavailable',e); }
  const { data, error } = await supabase
    .from('tv_programs')
    .select('id,title,channel,category,start_time,image_url,is_live,source,program_date,channel_logo_url,featured')
    .eq('program_date', date)
    .order('start_time', { ascending: true });

  if (error) throw error;
  const rows:any[] = data || [];

  // Generic/placeholder artwork is enriched server-side. The resolver prefers
  // curated artwork, then sports/event databases or TV metadata, and caches it.
  const needsArtwork = rows.filter(row=>row.source!=='xmltvfr'||isGenericImage(row.image_url)).slice(0,40);
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
      source: row.source || '',
      date: row.program_date || date,
      channelLogo: row.channel_logo_url || channelLogoFallback(row.channel),
      featured: Boolean(row.featured),
    };
  });
}

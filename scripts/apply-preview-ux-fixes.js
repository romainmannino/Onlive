const fs=require('fs');

function replaceOrFail(text,search,replacement,label){
  const next=typeof search==='string'?text.replace(search,replacement):text.replace(search,replacement);
  if(next===text)throw new Error(`Patch not applied: ${label}`);
  return next;
}

let main=fs.readFileSync('src/MainApp.tsx','utf8');
let root=fs.readFileSync('src/Root.tsx','utf8');

// --- MainApp: richer hierarchical favorites catalogue ---
main=replaceOrFail(main,/const FAVORITE_CATALOG=\[[\s\S]*?\] as const;/,`const FAVORITE_CATALOG=[
 {id:'football',label:'Football',group:'Sports',sport:'football',icon:'football-outline'},
 {id:'tennis',label:'Tennis',group:'Sports',sport:'tennis',icon:'tennisball-outline'},
 {id:'rugby',label:'Rugby',group:'Sports',sport:'rugby',icon:'american-football-outline'},
 {id:'basket',label:'Basket',group:'Sports',sport:'basket',icon:'basketball-outline'},
 {id:'handball',label:'Handball',group:'Sports',sport:'handball',icon:'hand-left-outline'},
 {id:'cycling',label:'Cyclisme',group:'Sports',sport:'cycling',icon:'bicycle-outline'},
 {id:'f1',label:'F1 / Auto',group:'Sports',sport:'f1',icon:'speedometer-outline'},
 {id:'moto',label:'Moto',group:'Sports',sport:'moto',icon:'speedometer-outline'},
 {id:'golf',label:'Golf',group:'Sports',sport:'golf',icon:'golf-outline'},
 {id:'swimming',label:'Natation',group:'Sports',sport:'swimming',icon:'water-outline'},
 {id:'athletics',label:'Athlétisme',group:'Sports',sport:'athletics',icon:'walk-outline'},
 {id:'combat',label:'Sports de combat',group:'Sports',sport:'combat',icon:'fitness-outline'},
 {id:'volleyball',label:'Volley',group:'Sports',sport:'volleyball',icon:'ellipse-outline'},

 {id:'psg',label:'Paris Saint-Germain',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'om',label:'Olympique de Marseille',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'ol',label:'Olympique Lyonnais',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'monaco-foot',label:'AS Monaco',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'lille-foot',label:'LOSC Lille',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'lens-foot',label:'RC Lens',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'real-madrid',label:'Real Madrid',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'barcelona',label:'FC Barcelone',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'liverpool',label:'Liverpool',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'arsenal',label:'Arsenal',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'man-city',label:'Manchester City',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'bayern',label:'Bayern Munich',group:'Clubs',sport:'football',icon:'football-outline'},
 {id:'france-foot',label:'Équipe de France',group:'Équipes',sport:'football',icon:'flag-outline'},
 {id:'champions-league',label:'Ligue des champions',group:'Compétitions',sport:'football',icon:'trophy-outline'},
 {id:'ligue1',label:'Ligue 1',group:'Compétitions',sport:'football',icon:'trophy-outline'},
 {id:'coupe-france',label:'Coupe de France',group:'Compétitions',sport:'football',icon:'trophy-outline'},
 {id:'premier-league',label:'Premier League',group:'Compétitions',sport:'football',icon:'trophy-outline'},
 {id:'liga',label:'Liga',group:'Compétitions',sport:'football',icon:'trophy-outline'},
 {id:'europa-league',label:'Europa League',group:'Compétitions',sport:'football',icon:'trophy-outline'},

 {id:'roland-garros',label:'Roland-Garros',group:'Compétitions',sport:'tennis',icon:'tennisball-outline'},
 {id:'wimbledon',label:'Wimbledon',group:'Compétitions',sport:'tennis',icon:'tennisball-outline'},
 {id:'us-open-tennis',label:'US Open',group:'Compétitions',sport:'tennis',icon:'tennisball-outline'},
 {id:'australian-open',label:'Open d’Australie',group:'Compétitions',sport:'tennis',icon:'tennisball-outline'},
 {id:'masters1000',label:'Masters 1000',group:'Compétitions',sport:'tennis',icon:'tennisball-outline'},
 {id:'top14',label:'Top 14',group:'Compétitions',sport:'rugby',icon:'trophy-outline'},
 {id:'six-nations',label:'Tournoi des Six Nations',group:'Compétitions',sport:'rugby',icon:'trophy-outline'},
 {id:'stade-toulousain',label:'Stade Toulousain',group:'Clubs',sport:'rugby',icon:'american-football-outline'},
 {id:'la-rochelle',label:'Stade Rochelais',group:'Clubs',sport:'rugby',icon:'american-football-outline'},
 {id:'ubb',label:'Union Bordeaux Bègles',group:'Clubs',sport:'rugby',icon:'american-football-outline'},
 {id:'nba',label:'NBA',group:'Compétitions',sport:'basket',icon:'basketball-outline'},
 {id:'euroleague',label:'EuroLeague',group:'Compétitions',sport:'basket',icon:'basketball-outline'},
 {id:'asvel',label:'ASVEL',group:'Clubs',sport:'basket',icon:'basketball-outline'},
 {id:'monaco-basket',label:'AS Monaco Basket',group:'Clubs',sport:'basket',icon:'basketball-outline'},
 {id:'tour-france',label:'Tour de France',group:'Compétitions',sport:'cycling',icon:'bicycle-outline'},
 {id:'giro',label:'Giro',group:'Compétitions',sport:'cycling',icon:'bicycle-outline'},
 {id:'vuelta',label:'Vuelta',group:'Compétitions',sport:'cycling',icon:'bicycle-outline'},
 {id:'f1-championship',label:'Championnat du monde de F1',group:'Compétitions',sport:'f1',icon:'speedometer-outline'},
 {id:'motogp',label:'MotoGP',group:'Compétitions',sport:'moto',icon:'speedometer-outline'},
 {id:'pga-tour',label:'PGA Tour',group:'Compétitions',sport:'golf',icon:'golf-outline'},
 {id:'ryder-cup',label:'Ryder Cup',group:'Compétitions',sport:'golf',icon:'golf-outline'},

 {id:'koh-lanta',label:'Koh-Lanta',group:'Émissions',icon:'tv-outline'},
 {id:'the-voice',label:'The Voice',group:'Émissions',icon:'mic-outline'},
 {id:'star-academy',label:'Star Academy',group:'Émissions',icon:'star-outline'},
 {id:'dals',label:'Danse avec les stars',group:'Émissions',icon:'musical-notes-outline'},
 {id:'mask-singer',label:'Mask Singer',group:'Émissions',icon:'mic-outline'},
 {id:'top-chef',label:'Top Chef',group:'Émissions',icon:'restaurant-outline'},
 {id:'adp',label:"L'Amour est dans le pré",group:'Émissions',icon:'heart-outline'},
 {id:'pekin-express',label:'Pékin Express',group:'Émissions',icon:'airplane-outline'},
 {id:'maries',label:'Mariés au premier regard',group:'Émissions',icon:'heart-outline'},
 {id:'incroyable-talent',label:'La France a un incroyable talent',group:'Émissions',icon:'star-outline'},
 {id:'fort-boyard',label:'Fort Boyard',group:'Émissions',icon:'key-outline'},
 {id:'capital',label:'Capital',group:'Émissions',icon:'briefcase-outline'},
 {id:'zone-interdite',label:'Zone interdite',group:'Émissions',icon:'newspaper-outline'},
 {id:'enquete-exclusive',label:'Enquête exclusive',group:'Émissions',icon:'search-outline'},
 {id:'90-enquetes',label:"90' Enquêtes",group:'Émissions',icon:'search-outline'},
 {id:'rdv-terre-inconnue',label:'Rendez-vous en terre inconnue',group:'Émissions',icon:'earth-outline'},
 {id:'quotidien',label:'Quotidien',group:'Émissions',icon:'tv-outline'},
 {id:'c-a-vous',label:'C à vous',group:'Émissions',icon:'tv-outline'},
 {id:'quelle-epoque',label:'Quelle époque !',group:'Émissions',icon:'chatbubbles-outline'},

 {id:'action',label:'Films d’action',group:'Films & séries',icon:'film-outline'},
 {id:'comedy',label:'Comédies',group:'Films & séries',icon:'happy-outline'},
 {id:'thriller',label:'Thrillers',group:'Films & séries',icon:'flash-outline'},
 {id:'documentary',label:'Documentaires',group:'Films & séries',icon:'earth-outline'},
 {id:'policier',label:'Policier',group:'Films & séries',icon:'search-outline'},
 {id:'science-fiction',label:'Science-fiction',group:'Films & séries',icon:'planet-outline'},
 {id:'fantastique',label:'Fantastique',group:'Films & séries',icon:'sparkles-outline'},
 {id:'animation',label:'Animation',group:'Films & séries',icon:'color-palette-outline'},
 {id:'romance',label:'Romance',group:'Films & séries',icon:'heart-outline'},
 {id:'series-policiere',label:'Séries policières',group:'Films & séries',icon:'tv-outline'},
 {id:'series-comedie',label:'Séries comiques',group:'Films & séries',icon:'tv-outline'}
] as const;`,'favorites catalogue');

main=replaceOrFail(main,"const[notifyOpen,setNotifyOpen]=useState(false);const[notifySelected,setNotifySelected]=useState<string[]>([]);const[liveSearchOpen,setLiveSearchOpen]=useState(false);const[liveSearch,setLiveSearch]=useState('');const[attentionFlash,setAttentionFlash]=useState(false);const[favoritesOpen,setFavoritesOpen]=useState(false);const[favoriteSearch,setFavoriteSearch]=useState('');const[favoriteGroup,setFavoriteGroup]=useState('Tous');const[favorites,setFavorites]=useState<string[]>([]);","const[notifyOpen,setNotifyOpen]=useState(false);const[notifySelected,setNotifySelected]=useState<string[]>([]);const[liveSearchOpen,setLiveSearchOpen]=useState(false);const[liveSearch,setLiveSearch]=useState('');const[attentionFlash,setAttentionFlash]=useState(false);const[favoritesOpen,setFavoritesOpen]=useState(false);const[favoriteSearch,setFavoriteSearch]=useState('');const[favoriteSection,setFavoriteSection]=useState<'Sports'|'Émissions'|'Films & séries'>('Sports');const[favorites,setFavorites]=useState<string[]>([]);",'favorites state');

main=replaceOrFail(main,/  const favoriteGroups=\['Tous',[\s\S]*?async function toggleFavorite\(id:string\)\{const next=favorites\.includes\(id\)\?favorites\.filter\(x=>x!==id\):\[\.\.\.favorites,id\];setFavorites\(next\);await AsyncStorage\.setItem\(FAVORITES_KEY,JSON\.stringify\(next\)\)\}/,`  const favoriteSections=['Sports','Émissions','Films & séries'] as const;
  const dynamicFavoritePrograms=useMemo(()=>programs.filter(p=>p.category==='Divertissement'||p.category==='Série').filter((p,i,a)=>a.findIndex(x=>x.title.toLowerCase()===p.title.toLowerCase())===i).slice(0,30).map(p=>({id:\`today-\${p.id}\`,label:p.title,group:'Émissions',icon:p.category==='Série'?'tv-outline':'sparkles-outline'})),[programs]);
  const favoriteCatalog=useMemo(()=>[...FAVORITE_CATALOG,...dynamicFavoritePrograms] as any[],[dynamicFavoritePrograms]);
  const sportFavorites=favoriteCatalog.filter((x:any)=>x.group==='Sports');
  const selectedSports=sportFavorites.filter((x:any)=>favorites.includes(x.id));
  const searchFavorites=favoriteSearch.trim()?favoriteCatalog.filter((x:any)=>\`\${x.label} \${x.group}\`.toLowerCase().includes(favoriteSearch.trim().toLowerCase())):[];
  const sectionFavorites=favoriteSection==='Sports'?sportFavorites:favoriteCatalog.filter((x:any)=>x.group===favoriteSection);
  const relatedForSport=(sportId:string)=>favoriteCatalog.filter((x:any)=>x.sport===sportId&&x.group!=='Sports');
  async function toggleFavorite(id:string){const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];setFavorites(next);await AsyncStorage.setItem(FAVORITES_KEY,JSON.stringify(next))}`,'favorites derived logic');

// Use real programme date when deciding whether a contact status has expired.
main=replaceOrFail(main,"const{data,error}=await supabase.from('live_status').select('user_id,program_id,is_live,started_at,tv_programs(title,channel,start_time)').in('user_id',list.map(x=>x.userId)).eq('is_live',true);if(error)return;setLiveFriends((data||[]).flatMap((r:any)=>{const m=list.find(x=>x.userId===r.user_id);if(!m)return[];const mins=r.started_at?Math.max(0,Math.floor((Date.now()-new Date(r.started_at).getTime())/60000)):0;if(mins>=240)return[];return[{...m,programId:r.program_id||null,program:r.tv_programs?.title||'Programme',channel:r.tv_programs?.channel||'',since:`depuis ${mins} min`,startTime:r.tv_programs?.start_time?String(r.tv_programs.start_time).slice(0,5):undefined}]}))","const{data,error}=await supabase.from('live_status').select('user_id,program_id,is_live,started_at,tv_programs(title,channel,start_time,program_date)').in('user_id',list.map(x=>x.userId)).eq('is_live',true);if(error)return;setLiveFriends((data||[]).flatMap((r:any)=>{const m=list.find(x=>x.userId===r.user_id);if(!m)return[];const mins=r.started_at?Math.max(0,Math.floor((Date.now()-new Date(r.started_at).getTime())/60000)):0;const pd=r.tv_programs?.program_date,pt=r.tv_programs?.start_time;if(pd&&pt){const start=new Date(`${pd}T${String(pt).slice(0,8)}`).getTime();if(Number.isFinite(start)&&Date.now()>start+4*60*60*1000)return[]}else if(mins>=240)return[];return[{...m,programId:r.program_id||null,program:r.tv_programs?.title||'Programme',channel:r.tv_programs?.channel||'',since:`depuis ${mins} min`,startTime:pt?String(pt).slice(0,5):undefined}]}))",'live friend expiry');

main=replaceOrFail(main,"const{data}=await supabase.from('live_status').select('is_live,tv_programs(id,title,channel,category,start_time,image_url,is_live)').eq('user_id',uid).maybeSingle();","const{data}=await supabase.from('live_status').select('is_live,tv_programs(id,title,channel,category,start_time,program_date,image_url,is_live)').eq('user_id',uid).maybeSingle();",'restore status date select');
main=replaceOrFail(main,"if(data?.is_live&&p){const restored={id:p.id,title:p.title,channel:p.channel,category:p.category,time:String(p.start_time).slice(0,5),image:p.image_url||'',isLive:Boolean(p.is_live)} as Program;if(programState(restored)!=='expired')setSelectedProgram(restored);else await supabase.from('live_status').update({is_live:false,program_id:null,started_at:null,updated_at:new Date().toISOString()}).eq('user_id',uid)}","if(data?.is_live&&p){const restored={id:p.id,title:p.title,channel:p.channel,category:p.category,time:String(p.start_time).slice(0,5),image:p.image_url||'',isLive:Boolean(p.is_live)} as Program;const start=p.program_date&&p.start_time?new Date(`${p.program_date}T${String(p.start_time).slice(0,8)}`).getTime():NaN;const expired=Number.isFinite(start)?Date.now()>start+4*60*60*1000:programState(restored)==='expired';if(!expired)setSelectedProgram(restored);else await supabase.from('live_status').update({is_live:false,program_id:null,started_at:null,updated_at:new Date().toISOString()}).eq('user_id',uid)}",'restore status expiry');

// White top bar + simple stateful star. Do not touch programme cards.
main=replaceOrFail(main,'return<SafeAreaView style={s.screen}><StatusBar style="light"/><View style={s.onliveTopBar}><Image source={LOGO_ON} resizeMode="contain" style={s.onLogo}/><TouchableOpacity accessibilityLabel="Mes favoris" onPress={()=>setFavoritesOpen(true)} style={s.favoriteTopButton}><LinearGradient colors={[\'#315CFF\',\'#F000B8\']} style={s.favoriteTopRing}><View style={s.favoriteTopInner}><Ionicons name={favorites.length?\'star\':\'star-outline\'} size={23} color={favorites.length?\'#FFD84D\':\'#f3d95b\'}/></View></LinearGradient></TouchableOpacity></View>','return<SafeAreaView style={s.screen}><StatusBar style="dark"/><View style={s.onliveTopBar}><Image source={LOGO_ON} resizeMode="contain" style={s.onLogo}/><TouchableOpacity accessibilityLabel="Mes favoris" onPress={()=>setFavoritesOpen(true)} style={s.favoriteTopButton}><Ionicons name={favorites.length?\'star\':\'star-outline\'} size={30} color={favorites.length?\'#FFD43B\':\'#111111\'}/></TouchableOpacity></View>','top bar');

// Replace favorites modal with compact hierarchical UX.
main=replaceOrFail(main,/  <Modal visible=\{favoritesOpen\}[\s\S]*?<\/SafeAreaView><\/Modal>\n\n  <Modal visible=\{profileOpen\}/,`  <Modal visible={favoritesOpen} animationType="slide" onRequestClose={()=>setFavoritesOpen(false)}><SafeAreaView style={s.favoritesScreen}><View style={s.favoritesHeader}><TouchableOpacity onPress={()=>setFavoritesOpen(false)} style={s.roundButton}><Ionicons name="chevron-back" size={23}/></TouchableOpacity><View style={{flex:1}}><Text style={s.favoritesTitle}>Mes favoris</Text><Text style={s.favoritesSubtitle}>Onlive te prévient quand ça commence</Text></View><View style={{width:42}}/></View><View style={s.favoriteSearchBox}><Ionicons name="search" size={19} color="#888"/><TextInput value={favoriteSearch} onChangeText={setFavoriteSearch} placeholder="Rechercher un sport, club, compétition, émission…" placeholderTextColor="#aaa" style={s.favoriteSearchInput}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.favoriteSectionTabs}>{favoriteSections.map(section=><TouchableOpacity key={section} onPress={()=>{setFavoriteSection(section);setFavoriteSearch('')}} style={[s.favoriteSectionTab,favoriteSection===section&&s.favoriteSectionTabActive]}><Text style={[s.favoriteSectionText,favoriteSection===section&&s.favoriteSectionTextActive]}>{section}</Text></TouchableOpacity>)}</ScrollView><ScrollView contentContainerStyle={s.favoriteList}>{favoriteSearch.trim()?<>{searchFavorites.length?<><Text style={s.favoriteBlockTitle}>Résultats</Text>{searchFavorites.map((item:any)=><FavoriteRow key={item.id} item={item} active={favorites.includes(item.id)} onPress={()=>toggleFavorite(item.id)}/>)}</>:<Text style={s.favoriteEmpty}>Aucun résultat</Text>}</>:favoriteSection==='Sports'?<><Text style={s.favoriteBlockTitle}>Choisis tes sports</Text><Text style={s.favoriteBlockHint}>Tu recevras les alertes importantes liées aux sports sélectionnés.</Text>{sportFavorites.map((item:any)=><FavoriteRow key={item.id} item={item} active={favorites.includes(item.id)} onPress={()=>toggleFavorite(item.id)}/>)}{selectedSports.length>0&&<><Text style={[s.favoriteBlockTitle,{marginTop:18}]}>Affiner tes sports <Text style={s.favoriteOptional}>(facultatif)</Text></Text><Text style={s.favoriteBlockHint}>Ajoute seulement les clubs, équipes ou compétitions qui t’intéressent particulièrement.</Text>{selectedSports.map((sport:any)=>{const related=relatedForSport(sport.id);if(!related.length)return null;return<View key={sport.id} style={s.favoriteRelatedCard}><View style={s.favoriteRelatedHead}><Ionicons name={sport.icon as any} size={19} color="#111"/><Text style={s.favoriteRelatedTitle}>{sport.label}</Text></View><View style={s.favoriteRelatedChips}>{related.map((item:any)=>{const active=favorites.includes(item.id);return<TouchableOpacity key={item.id} onPress={()=>toggleFavorite(item.id)} style={[s.favoriteRelatedChip,active&&s.favoriteRelatedChipActive]}><Text style={[s.favoriteRelatedChipText,active&&s.favoriteRelatedChipTextActive]}>{item.label}</Text></TouchableOpacity>})}</View></View>})}</>}</>:<><Text style={s.favoriteBlockTitle}>{favoriteSection}</Text>{sectionFavorites.map((item:any)=><FavoriteRow key={item.id} item={item} active={favorites.includes(item.id)} onPress={()=>toggleFavorite(item.id)}/>)}</>}</ScrollView></SafeAreaView></Modal>

  <Modal visible={profileOpen}`,'favorites modal');

// Style fixes for header/favorites only.
main=replaceOrFail(main,"onliveTopBar:{height:54,backgroundColor:'#09090c',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},onLogo:{width:42,height:42,borderRadius:10},favoriteTopButton:{width:38,height:38},favoriteTopRing:{flex:1,borderRadius:19,padding:2},favoriteTopInner:{flex:1,borderRadius:17,backgroundColor:'#09090c',alignItems:'center',justifyContent:'center'},","onliveTopBar:{height:54,backgroundColor:'#fff',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#eeeeF3'},onLogo:{width:42,height:42,borderRadius:10},favoriteTopButton:{width:42,height:42,alignItems:'center',justifyContent:'center'},",'top styles');
main=replaceOrFail(main,/favoritesScreen:\{flex:1,backgroundColor:'#f6f6f8'\}[\s\S]*?favoriteMeta:\{fontSize:12,color:'#888',marginTop:2\},/,`favoritesScreen:{flex:1,backgroundColor:'#f6f6f8'},favoritesHeader:{paddingHorizontal:14,paddingTop:10,paddingBottom:8,flexDirection:'row',alignItems:'center',gap:8},favoritesTitle:{fontSize:23,fontWeight:'900',textAlign:'center'},favoritesSubtitle:{fontSize:12,color:'#777',textAlign:'center',marginTop:2},favoriteSearchBox:{height:50,marginHorizontal:14,borderRadius:16,backgroundColor:'#fff',paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:8,borderWidth:1,borderColor:'#eeeef3'},favoriteSearchInput:{flex:1,fontSize:15,color:'#111'},favoriteSectionTabs:{gap:8,paddingHorizontal:14,paddingTop:12,paddingBottom:10},favoriteSectionTab:{height:38,paddingHorizontal:16,borderRadius:19,backgroundColor:'#e9e9ee',alignItems:'center',justifyContent:'center'},favoriteSectionTabActive:{backgroundColor:'#16161c'},favoriteSectionText:{fontSize:13,fontWeight:'800',color:'#666'},favoriteSectionTextActive:{color:'#fff'},favoriteList:{paddingHorizontal:14,paddingBottom:36},favoriteBlockTitle:{fontSize:18,fontWeight:'900',color:'#111',marginTop:4,marginBottom:3},favoriteBlockHint:{fontSize:12,color:'#777',lineHeight:17,marginBottom:12},favoriteOptional:{fontSize:13,fontWeight:'700',color:'#888'},favoriteEmpty:{fontSize:14,color:'#888',textAlign:'center',marginTop:30},favoriteRow:{backgroundColor:'#fff',borderRadius:18,padding:12,marginBottom:8,flexDirection:'row',alignItems:'center',gap:12},favoriteIcon:{width:46,height:46,borderRadius:15,alignItems:'center',justifyContent:'center'},favoriteLabel:{fontSize:15,fontWeight:'800',color:'#111'},favoriteMeta:{fontSize:12,color:'#888',marginTop:2},favoriteRelatedCard:{backgroundColor:'#fff',borderRadius:18,padding:13,marginBottom:10},favoriteRelatedHead:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:10},favoriteRelatedTitle:{fontSize:15,fontWeight:'900',color:'#111'},favoriteRelatedChips:{flexDirection:'row',flexWrap:'wrap',gap:7},favoriteRelatedChip:{paddingHorizontal:11,paddingVertical:8,borderRadius:14,backgroundColor:'#eeeeF3'},favoriteRelatedChipActive:{backgroundColor:'#16161c'},favoriteRelatedChipText:{fontSize:12,fontWeight:'700',color:'#555'},favoriteRelatedChipTextActive:{color:'#fff'},`,'favorites styles');

// Add reusable favorite row component before BottomNav.
main=replaceOrFail(main,'function BottomNav({active,unreadCount,onHome,onDiscussions,onContacts}',`function FavoriteRow({item,active,onPress}:{item:any;active:boolean;onPress:()=>void}){return<TouchableOpacity onPress={onPress} style={s.favoriteRow}><View style={[s.favoriteIcon,{backgroundColor:active?'#17171c':'#ececf2'}]}><Ionicons name={item.icon as any} size={23} color={active?'#fff':'#666'}/></View><View style={{flex:1}}><Text style={s.favoriteLabel}>{item.label}</Text><Text style={s.favoriteMeta}>{item.group}</Text></View><Ionicons name={active?'star':'star-outline'} size={25} color={active?'#FFD43B':'#aaa'}/></TouchableOpacity>}

function BottomNav({active,unreadCount,onHome,onDiscussions,onContacts}`,'favorite row component');

// --- Root: notification preferences in account ---
root=replaceOrFail(root," const[deleteLoading,setDeleteLoading]=useState(false);"," const[deleteLoading,setDeleteLoading]=useState(false);\n const[notificationPrefs,setNotificationPrefs]=useState({chat_messages:true,chat_invites:true,favorite_alerts:true});",'notification prefs state');

root=replaceOrFail(root," useEffect(()=>{if(!userId)return;registerPushNotifications(userId)},[userId]);",` useEffect(()=>{if(!userId)return;registerPushNotifications(userId)},[userId]);
 useEffect(()=>{if(!userId)return;supabase.from('notification_preferences').select('chat_messages,chat_invites,favorite_alerts').eq('user_id',userId).maybeSingle().then(({data})=>{if(data)setNotificationPrefs({chat_messages:data.chat_messages!==false,chat_invites:data.chat_invites!==false,favorite_alerts:data.favorite_alerts!==false})})},[userId]);`,'load notification prefs');

root=replaceOrFail(root," const performSignOut=async()=>{if(deleteLoading)return;try{await supabase.auth.signOut();}catch{}setAccountOpen(false);setOnboardingOpen(false);setUserId(null);setUnreadCount(0);setChatTarget(null);setNotificationRoomId(null);setAppSection('home');setMode('app');setAppBadge(0)};",` const performSignOut=async()=>{if(deleteLoading)return;try{await supabase.auth.signOut();}catch{}setAccountOpen(false);setOnboardingOpen(false);setUserId(null);setUnreadCount(0);setChatTarget(null);setNotificationRoomId(null);setAppSection('home');setMode('app');setAppBadge(0)};
 const toggleNotificationPref=async(key:'chat_messages'|'chat_invites'|'favorite_alerts')=>{if(!userId)return;const next={...notificationPrefs,[key]:!notificationPrefs[key]};setNotificationPrefs(next);const{error}=await supabase.from('notification_preferences').upsert({user_id:userId,...next,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error){setNotificationPrefs(notificationPrefs);Alert.alert('Réglage impossible',error.message)}};`,'toggle notification prefs');

root=replaceOrFail(root,"<Text style={s.modalText}>Gère ici les informations essentielles liées à ton compte Onlive.</Text><TouchableOpacity onPress={()=>Linking.openURL('https://onlive-app.com/privacy')}",`<Text style={s.modalText}>Gère ici les informations essentielles liées à ton compte Onlive.</Text><Text style={s.accountSectionTitle}>Notifications</Text><NotificationToggle icon="chatbubble-ellipses-outline" title="Messages" subtitle="Nouveaux messages dans tes discussions" active={notificationPrefs.chat_messages} onPress={()=>toggleNotificationPref('chat_messages')}/><NotificationToggle icon="person-add-outline" title="Invitations" subtitle="Invitations à rejoindre une discussion" active={notificationPrefs.chat_invites} onPress={()=>toggleNotificationPref('chat_invites')}/><NotificationToggle icon="star-outline" title="Favoris" subtitle="Quand un programme correspondant à tes favoris commence" active={notificationPrefs.favorite_alerts} onPress={()=>toggleNotificationPref('favorite_alerts')}/><View style={s.accountDivider}/><TouchableOpacity onPress={()=>Linking.openURL('https://onlive-app.com/privacy')}`,'account notification UI');

root=replaceOrFail(root,'function TabletNavItem({active,icon,label,onPress,badge=0}',`function NotificationToggle({icon,title,subtitle,active,onPress}:{icon:any;title:string;subtitle:string;active:boolean;onPress:()=>void}){return<TouchableOpacity onPress={onPress} style={s.notificationRow}><View style={s.accountRowIcon}><Ionicons name={icon} size={20} color="#6b2cff"/></View><View style={{flex:1}}><Text style={s.accountRowTitle}>{title}</Text><Text style={s.accountRowText}>{subtitle}</Text></View><View style={[s.prefToggle,active&&s.prefToggleActive]}><View style={[s.prefKnob,active&&s.prefKnobActive]}/></View></TouchableOpacity>}

function TabletNavItem({active,icon,label,onPress,badge=0}`,'notification toggle component');

root=replaceOrFail(root,"accountRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:12},accountRowIcon:{width:38,height:38,borderRadius:19,backgroundColor:'#f2edff',alignItems:'center',justifyContent:'center'},","accountSectionTitle:{fontSize:16,fontWeight:'900',color:'#111',marginTop:2,marginBottom:5},notificationRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:10},prefToggle:{width:44,height:26,borderRadius:13,backgroundColor:'#d8d8df',padding:3,justifyContent:'center'},prefToggleActive:{backgroundColor:'#6b2cff'},prefKnob:{width:20,height:20,borderRadius:10,backgroundColor:'#fff',alignSelf:'flex-start'},prefKnobActive:{alignSelf:'flex-end'},accountRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:12},accountRowIcon:{width:38,height:38,borderRadius:19,backgroundColor:'#f2edff',alignItems:'center',justifyContent:'center'},",'notification styles');

fs.writeFileSync('src/MainApp.tsx',main);
fs.writeFileSync('src/Root.tsx',root);
console.log('Preview UX fixes applied successfully');

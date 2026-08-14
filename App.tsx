import React,{useEffect,useMemo,useState}from'react';
import{Alert,FlatList,Image,SafeAreaView,ScrollView,Share,StyleSheet,Text,TextInput,TouchableOpacity,View}from'react-native';
import{StatusBar}from'expo-status-bar';
import{LinearGradient}from'expo-linear-gradient';
import*as Contacts from'expo-contacts';
import{Ionicons}from'@expo/vector-icons';
import{FALLBACK_PROGRAMS,fetchTvPrograms,Program}from'./src/tvPrograms';
import{supabase}from'./src/supabase';

type Screen='auth'|'home'|'contacts';
type Match={userId:string;name:string;phone:string;image?:string};
type LiveFriend=Match&{program:string;channel:string;since:string};
const FILTERS=['Tous','Divertissement','Film','Série','Sport','Foot']as const;
const INVITE_URL='https://github.com/romainmannino/Onlive';
const LOGO=require('./public/logo horiz.png');

function normalizePhone(value=''){
  let p=value.replace(/[^\d+]/g,'');
  if(p.startsWith('0033'))p='+33'+p.slice(4);
  if(p.startsWith('0'))p='+33'+p.slice(1);
  if(!p.startsWith('+')&&p.length===9)p='+33'+p;
  return p;
}

function Brand({compact=false}:{compact?:boolean}){
  return <Image source={LOGO} resizeMode="contain" style={compact?s.brandCompact:s.brand}/>;
}

export default function App(){
  const[screen,setScreen]=useState<Screen>('auth');
  const[authMode,setAuthMode]=useState<'login'|'register'>('register');
  const[email,setEmail]=useState('');const[phone,setPhone]=useState('');const[password,setPassword]=useState('');
  const[loading,setLoading]=useState(false);const[userId,setUserId]=useState<string|null>(null);
  const[filter,setFilter]=useState<(typeof FILTERS)[number]>('Tous');
  const[programs,setPrograms]=useState<Program[]>(FALLBACK_PROGRAMS);const[programSource,setProgramSource]=useState<'fallback'|'supabase'>('fallback');
  const[selectedProgram,setSelectedProgram]=useState<Program|null>(null);
  const[deviceContacts,setDeviceContacts]=useState<Contacts.Contact[]>([]);const[contactsPermission,setContactsPermission]=useState<'idle'|'granted'|'denied'>('idle');
  const[matches,setMatches]=useState<Match[]>([]);const[liveFriends,setLiveFriends]=useState<LiveFriend[]>([]);

  useEffect(()=>{supabase.auth.getSession().then(({data})=>{const u=data.session?.user;if(u){setUserId(u.id);setScreen('home');loadPrograms();}})},[]);
  const visiblePrograms=useMemo(()=>filter==='Tous'?programs:programs.filter(p=>p.category===filter),[filter,programs]);

  async function loadPrograms(){
    try{const data=await fetchTvPrograms();if(data.length){setPrograms(data);setProgramSource('supabase')}}catch(e){setPrograms(FALLBACK_PROGRAMS);setProgramSource('fallback')}
  }

  async function submitAuth(){
    if(!email.trim()||!password.trim()||(authMode==='register'&&!phone.trim()))return Alert.alert('Informations manquantes',authMode==='register'?'Entre ton e-mail, ton numéro et ton mot de passe.':'Entre ton e-mail et ton mot de passe.');
    setLoading(true);
    try{
      if(authMode==='register'){
        const phoneE164=normalizePhone(phone);
        const{data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{phone_e164:phoneE164}}});
        if(error)throw error;
        if(data.session){setUserId(data.user?.id||null);setScreen('home');await loadPrograms();}
        else Alert.alert('Compte créé','Vérifie ton e-mail pour confirmer ton compte, puis reviens dans Connexion.');
      }else{
        const{data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(error)throw error;setUserId(data.user.id);setScreen('home');await loadPrograms();
      }
    }catch(e:any){Alert.alert('Connexion impossible',e?.message||'Une erreur est survenue.')}finally{setLoading(false)}
  }

  async function signOut(){await supabase.auth.signOut();setUserId(null);setSelectedProgram(null);setMatches([]);setLiveFriends([]);setScreen('auth')}

  async function loadContacts(){
    const{status}=await Contacts.requestPermissionsAsync();
    if(status!=='granted'){setContactsPermission('denied');return Alert.alert('Accès refusé','Autorise les contacts dans les réglages pour retrouver tes proches.');}
    setContactsPermission('granted');
    const{data}=await Contacts.getContactsAsync({fields:[Contacts.Fields.PhoneNumbers,Contacts.Fields.Image,Contacts.Fields.ImageAvailable],pageSize:1000});
    setDeviceContacts(data);
    const local=new Map<string,Contacts.Contact>();
    data.forEach(c=>c.phoneNumbers?.forEach(n=>{const p=normalizePhone(n.number||'');if(p)local.set(p,c)}));
    const{data:profiles,error}=await supabase.from('profiles').select('id,phone_e164');
    if(error)return Alert.alert('Erreur contacts',error.message);
    const found:Match[]=(profiles||[]).flatMap((p:any)=>{const c=local.get(normalizePhone(p.phone_e164||''));if(!c||p.id===userId)return[];return[{userId:p.id,name:c.name||'Contact',phone:normalizePhone(p.phone_e164),image:(c as any).image?.uri}]});
    setMatches(found);
    await refreshLiveFriends(found);
  }

  async function refreshLiveFriends(list=matches){
    if(!list.length){setLiveFriends([]);return;}
    const ids=list.map(x=>x.userId);
    const{data,error}=await supabase.from('live_status').select('user_id,is_live,started_at,tv_programs(title,channel)').in('user_id',ids).eq('is_live',true);
    if(error)return;
    const rows:LiveFriend[]=(data||[]).flatMap((r:any)=>{const m=list.find(x=>x.userId===r.user_id);if(!m)return[];const mins=r.started_at?Math.max(0,Math.round((Date.now()-new Date(r.started_at).getTime())/60000)):0;return[{...m,program:r.tv_programs?.title||'Programme',channel:r.tv_programs?.channel||'',since:`depuis ${mins} min`}]} );
    setLiveFriends(rows);
  }

  async function chooseProgram(program:Program){
    if(!userId)return;
    if(selectedProgram?.id===program.id){await goOfflive();return;}
    if(programSource!=='supabase')return Alert.alert('Programme de démonstration','Reconnecte-toi avec internet pour publier un vrai statut Onlive.');
    const{error}=await supabase.from('live_status').upsert({user_id:userId,program_id:program.id,is_live:true,started_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:'user_id'});
    if(error)return Alert.alert('Impossible de passer Onlive',error.message);
    setSelectedProgram(program);
  }

  async function goOfflive(){
    if(userId)await supabase.from('live_status').upsert({user_id:userId,program_id:null,is_live:false,started_at:null,updated_at:new Date().toISOString()},{onConflict:'user_id'});
    setSelectedProgram(null);
  }

  async function inviteContact(name:string){await Share.share({message:`Salut ${name} ! Rejoins-moi sur Onlive pour voir ce que regardent tes proches et te mettre Onlive sur un programme 📺✨ ${INVITE_URL}`,url:INVITE_URL})}

  if(screen==='auth')return <SafeAreaView style={s.authScreen}><StatusBar style="light"/><LinearGradient colors={['#07070a','#171020','#07070a']} style={s.authGradient}><View style={s.authTop}><Brand/><Text style={s.authTitle}>La télé devient sociale.</Text><Text style={s.authSubtitle}>Dis ce que tu regardes. Vois ce que regardent tes proches.</Text></View><View style={s.authCard}><View style={s.authTabs}><TouchableOpacity onPress={()=>setAuthMode('register')} style={[s.authTab,authMode==='register'&&s.authTabActive]}><Text style={[s.authTabText,authMode==='register'&&s.authTabTextActive]}>Créer un compte</Text></TouchableOpacity><TouchableOpacity onPress={()=>setAuthMode('login')} style={[s.authTab,authMode==='login'&&s.authTabActive]}><Text style={[s.authTabText,authMode==='login'&&s.authTabTextActive]}>Connexion</Text></TouchableOpacity></View><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Adresse e-mail" placeholderTextColor="#999" style={s.input}/>{authMode==='register'&&<TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Numéro de téléphone" placeholderTextColor="#999" style={s.input}/>}<TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe" placeholderTextColor="#999" style={s.input}/><TouchableOpacity onPress={submitAuth} disabled={loading}><LinearGradient colors={['#4932ff','#ed00b3']} style={s.primaryButton}><Text style={s.primaryButtonText}>{loading?'Patiente…':authMode==='register'?'Créer mon compte':'Me connecter'}</Text></LinearGradient></TouchableOpacity><View style={s.separatorRow}><View style={s.separator}/><Text style={s.separatorText}>ou</Text><View style={s.separator}/></View><TouchableOpacity style={s.socialButton} onPress={()=>Alert.alert('Apple','On branche Apple après validation du flux e-mail/téléphone.')}><Ionicons name="logo-apple" size={22}/><Text style={s.socialButtonText}>Continuer avec Apple</Text></TouchableOpacity><TouchableOpacity style={s.socialButton} onPress={()=>Alert.alert('Google','On branche Google après validation du flux e-mail/téléphone.')}><Ionicons name="logo-google" size={21}/><Text style={s.socialButtonText}>Continuer avec Google</Text></TouchableOpacity></View></LinearGradient></SafeAreaView>;

  if(screen==='contacts')return <SafeAreaView style={s.screen}><StatusBar style="dark"/><View style={s.contactsHeader}><TouchableOpacity onPress={()=>setScreen('home')} style={s.roundButton}><Ionicons name="chevron-back" size={23}/></TouchableOpacity><Text style={s.pageTitle}>Mes contacts</Text><View style={{width:42}}/></View><ScrollView contentContainerStyle={s.contactsContent}><View style={s.contactsHero}><LinearGradient colors={['#4932ff','#ed00b3']} style={s.contactIcon}><Ionicons name="people" size={30} color="white"/></LinearGradient><Text style={s.contactsHeroTitle}>Retrouve tes proches sur Onlive</Text><Text style={s.contactsHeroText}>On compare les numéros de ton téléphone aux comptes Onlive. Le nom et la photo affichés restent ceux de ton répertoire.</Text><TouchableOpacity onPress={loadContacts} style={s.contactsButton}><Text style={s.contactsButtonText}>{contactsPermission==='granted'?'Actualiser mes contacts':'Autoriser mes contacts'}</Text></TouchableOpacity></View>{contactsPermission==='granted'&&<><Text style={s.sectionTitle}>{matches.length} proche{matches.length>1?'s':''} déjà sur Onlive</Text>{deviceContacts.slice(0,80).map(c=>{const uri=(c as any).image?.uri;const phone0=normalizePhone(c.phoneNumbers?.[0]?.number||'');const match=matches.find(m=>m.phone===phone0);return <View key={c.id} style={s.contactRow}>{uri?<Image source={{uri}} style={s.avatarImage}/>:<View style={s.avatarSmall}><Text style={s.avatarSmallText}>{(c.name||'?').slice(0,2).toUpperCase()}</Text></View>}<View style={{flex:1}}><Text style={s.contactName}>{c.name||'Sans nom'}</Text><Text style={s.contactMeta}>{match?'Déjà sur Onlive':c.phoneNumbers?.[0]?.number||'Aucun numéro'}</Text></View>{match?<View style={s.onliveTag}><Text style={s.onliveTagText}>ONLIVE</Text></View>:<TouchableOpacity onPress={()=>inviteContact(c.name||'toi')} style={s.inviteButton}><Text style={s.inviteButtonText}>Inviter</Text></TouchableOpacity>}</View>})}</>}</ScrollView><BottomNav active="contacts" onHome={()=>setScreen('home')} onContacts={()=>setScreen('contacts')}/></SafeAreaView>;

  return <SafeAreaView style={s.screen}><StatusBar style="dark"/><ScrollView contentContainerStyle={s.homeContent}><View style={s.headerCard}><Brand compact/><View style={s.headerActions}><View style={s.statusPill}><View style={[s.statusDot,selectedProgram?s.statusDotOn:s.statusDotOff]}/><Text style={s.statusText}>{selectedProgram?'ONLIVE':'OFFLIVE'}</Text></View><TouchableOpacity onPress={signOut} style={s.logout}><Ionicons name="log-out-outline" size={19} color="#fff"/></TouchableOpacity></View></View><Text style={s.introTitle}>Informe tes proches de ce que tu regardes</Text><Text style={s.introText}>{selectedProgram?`${selectedProgram.channel} · ${selectedProgram.title}`:'Clique sur un programme pour passer Onlive. Tu peux aussi juste parcourir l’app.'}</Text><Text style={s.sourceText}>{programSource==='supabase'?'Programmes chargés depuis Onlive':'Aperçu local — programmes de secours'}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>{FILTERS.map(item=><TouchableOpacity key={item} onPress={()=>setFilter(item)} style={[s.filterChip,filter===item&&s.filterChipActive]}><Text style={[s.filterText,filter===item&&s.filterTextActive]}>{item}</Text></TouchableOpacity>)}</ScrollView><FlatList data={visiblePrograms} horizontal showsHorizontalScrollIndicator={false} keyExtractor={i=>i.id} contentContainerStyle={s.programList} renderItem={({item})=>{const selected=selectedProgram?.id===item.id;return <TouchableOpacity onPress={()=>chooseProgram(item)} style={[s.programCard,selected&&s.programCardSelected]}><Image source={{uri:item.image}} style={s.programImage}/><LinearGradient colors={['transparent','rgba(0,0,0,.82)']} style={s.programOverlay}/><View style={s.programTopRow}><View style={s.timeBadge}><Text style={s.timeBadgeText}>{item.time}</Text></View>{item.isLive&&<View style={s.liveBadge}><Text style={s.liveBadgeText}>DIRECT</Text></View>}</View><View style={s.programInfo}><Text style={s.programChannel}>{item.channel}</Text><Text style={s.programTitle} numberOfLines={2}>{item.title}</Text></View></TouchableOpacity>}}/>{selectedProgram&&<TouchableOpacity onPress={goOfflive} style={s.offliveButton}><Ionicons name="power" size={18} color="#555"/><Text style={s.offliveText}>Me mettre Offlive</Text></TouchableOpacity>}<View style={s.sectionHead}><Text style={s.sectionTitle}>Tes proches Onlive</Text>{matches.length>0&&<TouchableOpacity onPress={()=>refreshLiveFriends()}><Ionicons name="refresh" size={19} color="#5a2cff"/></TouchableOpacity>}</View>{liveFriends.length?<View style={s.friendsCard}>{liveFriends.map((f,i)=><View key={f.userId} style={[s.friendRow,i<liveFriends.length-1&&s.friendDivider]}>{f.image?<Image source={{uri:f.image}} style={s.friendAvatarImage}/>:<View style={s.friendAvatar}><Text style={s.friendAvatarText}>{f.name.slice(0,2).toUpperCase()}</Text></View>}<View style={{flex:1}}><Text style={s.friendName}>{f.name}</Text><Text style={s.friendProgram}>{f.program}</Text><Text style={s.friendMeta}>{f.channel} · {f.since}</Text></View><View style={s.onlineDot}/></View>)}</View>:<TouchableOpacity onPress={()=>setScreen('contacts')} style={s.emptyFriends}><Ionicons name="people-outline" size={25} color="#6b2cff"/><Text style={s.emptyTitle}>Aucun proche Onlive pour l'instant</Text><Text style={s.emptyText}>Importe tes contacts pour voir ceux qui utilisent déjà l'app.</Text></TouchableOpacity>}</ScrollView><BottomNav active="home" onHome={()=>setScreen('home')} onContacts={()=>setScreen('contacts')}/></SafeAreaView>;
}

function BottomNav({active,onHome,onContacts}:{active:'home'|'contacts';onHome:()=>void;onContacts:()=>void}){return <View style={s.bottomNav}><TouchableOpacity onPress={onHome} style={s.navItem}><Ionicons name={active==='home'?'home':'home-outline'} size={25} color={active==='home'?'#5a2cff':'#777'}/><Text style={[s.navText,active==='home'&&s.navTextActive]}>Accueil</Text></TouchableOpacity><TouchableOpacity onPress={onContacts} style={s.navItem}><Ionicons name={active==='contacts'?'people':'people-outline'} size={27} color={active==='contacts'?'#e400ad':'#777'}/><Text style={[s.navText,active==='contacts'&&s.navTextActive]}>Contacts</Text></TouchableOpacity></View>}

const s=StyleSheet.create({authScreen:{flex:1,backgroundColor:'#09090b'},authGradient:{flex:1,padding:20,paddingTop:34},authTop:{alignItems:'center',paddingBottom:20},brand:{width:270,height:82},brandCompact:{width:170,height:54},authTitle:{fontSize:30,fontWeight:'800',color:'#fff',marginTop:18},authSubtitle:{fontSize:17,color:'#bbb',textAlign:'center',lineHeight:24,marginTop:10},authCard:{backgroundColor:'#fff',borderRadius:28,padding:18},authTabs:{flexDirection:'row',backgroundColor:'#f0f0f3',borderRadius:20,padding:5,marginBottom:16},authTab:{flex:1,paddingVertical:13,alignItems:'center',borderRadius:16},authTabActive:{backgroundColor:'#fff'},authTabText:{fontSize:16,fontWeight:'700',color:'#777'},authTabTextActive:{color:'#111'},input:{height:55,borderWidth:1,borderColor:'#e2e2e7',borderRadius:16,paddingHorizontal:16,fontSize:17,marginBottom:12,color:'#111'},primaryButton:{height:55,borderRadius:18,alignItems:'center',justifyContent:'center'},primaryButtonText:{color:'#fff',fontSize:17,fontWeight:'800'},separatorRow:{flexDirection:'row',alignItems:'center',marginVertical:15},separator:{flex:1,height:1,backgroundColor:'#e5e5e8'},separatorText:{marginHorizontal:12,color:'#999'},socialButton:{height:52,borderWidth:1,borderColor:'#ddd',borderRadius:17,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,marginBottom:10},socialButtonText:{fontWeight:'700',fontSize:16},screen:{flex:1,backgroundColor:'#f6f6f8'},homeContent:{padding:14,paddingBottom:100},headerCard:{backgroundColor:'#111118',borderRadius:26,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},headerActions:{flexDirection:'row',alignItems:'center',gap:8},statusPill:{backgroundColor:'#fff',borderRadius:16,padding:9,flexDirection:'row',alignItems:'center',gap:7},statusDot:{width:8,height:8,borderRadius:4},statusDotOn:{backgroundColor:'#27c46b'},statusDotOff:{backgroundColor:'#aaa'},statusText:{fontWeight:'900',fontSize:12},logout:{width:34,height:34,borderRadius:17,backgroundColor:'#292934',alignItems:'center',justifyContent:'center'},introTitle:{fontSize:21,fontWeight:'800',marginTop:20},introText:{fontSize:15,color:'#666',lineHeight:21,marginTop:5},sourceText:{fontSize:12,color:'#9a9aa3',marginTop:6},filtersRow:{gap:8,paddingVertical:14},filterChip:{backgroundColor:'#fff',paddingHorizontal:14,paddingVertical:9,borderRadius:18},filterChipActive:{backgroundColor:'#16161c'},filterText:{fontWeight:'700',color:'#666'},filterTextActive:{color:'#fff'},programList:{gap:12,paddingBottom:12},programCard:{width:170,height:215,borderRadius:20,overflow:'hidden',backgroundColor:'#222'},programCardSelected:{borderWidth:3,borderColor:'#ed00b3'},programImage:{width:'100%',height:'100%'},programOverlay:{...StyleSheet.absoluteFillObject},programTopRow:{position:'absolute',top:10,left:10,right:10,flexDirection:'row',justifyContent:'space-between'},timeBadge:{backgroundColor:'rgba(0,0,0,.7)',paddingHorizontal:8,paddingVertical:5,borderRadius:10},timeBadgeText:{color:'#fff',fontWeight:'800'},liveBadge:{backgroundColor:'#e5003f',paddingHorizontal:7,paddingVertical:5,borderRadius:10},liveBadgeText:{color:'#fff',fontSize:10,fontWeight:'900'},programInfo:{position:'absolute',left:12,right:12,bottom:12},programChannel:{color:'#ddd',fontSize:12,fontWeight:'700'},programTitle:{color:'#fff',fontSize:17,fontWeight:'800',marginTop:3},offliveButton:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:7,backgroundColor:'#fff',padding:10,borderRadius:14,marginBottom:14},offliveText:{fontWeight:'700',color:'#555'},sectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{fontSize:20,fontWeight:'800',marginVertical:12},friendsCard:{backgroundColor:'#fff',borderRadius:22,paddingHorizontal:14},friendRow:{flexDirection:'row',alignItems:'center',paddingVertical:14,gap:12},friendDivider:{borderBottomWidth:1,borderBottomColor:'#eee'},friendAvatar:{width:46,height:46,borderRadius:23,backgroundColor:'#eee',alignItems:'center',justifyContent:'center'},friendAvatarImage:{width:46,height:46,borderRadius:23},friendAvatarText:{fontWeight:'900'},friendName:{fontWeight:'800',fontSize:16},friendProgram:{fontWeight:'700',color:'#4c2cff',marginTop:2},friendMeta:{color:'#888',fontSize:12,marginTop:2},onlineDot:{width:10,height:10,borderRadius:5,backgroundColor:'#25c66a'},emptyFriends:{backgroundColor:'#fff',borderRadius:22,padding:22,alignItems:'center'},emptyTitle:{fontWeight:'800',fontSize:16,marginTop:8},emptyText:{color:'#777',fontSize:13,textAlign:'center',marginTop:5},bottomNav:{position:'absolute',left:0,right:0,bottom:0,height:76,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#eee',flexDirection:'row'},navItem:{flex:1,alignItems:'center',justifyContent:'center'},navText:{fontSize:12,color:'#777',marginTop:2},navTextActive:{fontWeight:'800',color:'#5a2cff'},contactsHeader:{padding:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},roundButton:{width:42,height:42,borderRadius:21,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pageTitle:{fontSize:20,fontWeight:'800'},contactsContent:{padding:14,paddingBottom:100},contactsHero:{backgroundColor:'#fff',borderRadius:24,padding:18,alignItems:'center'},contactIcon:{width:58,height:58,borderRadius:20,alignItems:'center',justifyContent:'center'},contactsHeroTitle:{fontSize:20,fontWeight:'800',marginTop:12,textAlign:'center'},contactsHeroText:{textAlign:'center',color:'#666',lineHeight:20,marginTop:8},contactsButton:{backgroundColor:'#17171c',paddingHorizontal:18,paddingVertical:12,borderRadius:15,marginTop:14},contactsButtonText:{color:'#fff',fontWeight:'800'},contactRow:{backgroundColor:'#fff',borderRadius:18,padding:12,marginTop:10,flexDirection:'row',alignItems:'center',gap:10},avatarSmall:{width:46,height:46,borderRadius:23,backgroundColor:'#ececf2',alignItems:'center',justifyContent:'center'},avatarSmallText:{fontWeight:'800'},avatarImage:{width:46,height:46,borderRadius:23},contactName:{fontWeight:'800'},contactMeta:{color:'#888',fontSize:12,marginTop:2},inviteButton:{backgroundColor:'#f0eaff',paddingHorizontal:12,paddingVertical:8,borderRadius:12},inviteButtonText:{color:'#5a2cff',fontWeight:'800'},onliveTag:{backgroundColor:'#e9fff2',paddingHorizontal:11,paddingVertical:8,borderRadius:12},onliveTagText:{color:'#149653',fontWeight:'900',fontSize:11}});

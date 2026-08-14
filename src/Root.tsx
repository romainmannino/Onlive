import React,{useEffect,useState}from'react';
import{StyleSheet,Text,TouchableOpacity,View}from'react-native';
import{Ionicons}from'@expo/vector-icons';
import{LinearGradient}from'expo-linear-gradient';
import MainApp from'./MainApp';
import ChatScreen from'./ChatScreen';
import{supabase}from'./supabase';

type ChatTarget={userId:string;name:string;programId:string|null;programTitle:string;channel:string};

export default function Root(){
 const[mode,setMode]=useState<'app'|'chat'>('app');
 const[appSection,setAppSection]=useState<'home'|'contacts'>('home');
 const[userId,setUserId]=useState<string|null>(null);
 const[chatTarget,setChatTarget]=useState<ChatTarget|null>(null);
 const[unreadCount,setUnreadCount]=useState(0);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setUserId(data.session?.user.id||null));const{data:l}=supabase.auth.onAuthStateChange((_e,s)=>setUserId(s?.user.id||null));return()=>l.subscription.unsubscribe()},[]);
 useEffect(()=>{if(!userId){setUnreadCount(0);return}let alive=true;const refresh=async()=>{const{data}=await supabase.rpc('chat_unread_count');if(alive)setUnreadCount(Number(data)||0)};refresh();const t=setInterval(refresh,2000);return()=>{alive=false;clearInterval(t)}},[userId]);
 const openDiscussions=()=>{setChatTarget(null);setMode('chat')};
 const startChat=(target:ChatTarget)=>{setChatTarget(target);setMode('chat')};
 const goHome=()=>{setChatTarget(null);setAppSection('home');setMode('app')};
 const goContacts=()=>{setChatTarget(null);setAppSection('contacts');setMode('app')};
 if(mode==='chat'&&userId)return<ChatScreen userId={userId} initialTarget={chatTarget} unreadCount={unreadCount} onUnreadChange={setUnreadCount} onBack={goHome} onHome={goHome} onContacts={goContacts}/>;
 return<View style={s.root}><MainApp initialScreen={appSection} onOpenDiscussions={openDiscussions} onStartChat={startChat} unreadCount={unreadCount}/>{userId&&<View style={s.navCover}><View style={s.compactNav}><NavItem active={appSection==='home'} icon="home" label="Accueil" onPress={goHome}/><TouchableOpacity onPress={openDiscussions} style={s.navItem}><View style={s.inactive}><View><Ionicons name="chatbubbles-outline" size={21} color="#9728df"/>{unreadCount>0&&<View style={s.badge}><Text style={s.badgeText}>{unreadCount>99?'99+':unreadCount}</Text></View>}</View><Text style={[s.inactiveText,{color:'#9728df'}]}>Discussions</Text></View></TouchableOpacity><NavItem active={appSection==='contacts'} icon="people" label="Contacts" onPress={goContacts}/></View></View>}</View>;
}
function NavItem({active,icon,label,onPress}:{active:boolean;icon:'home'|'people';label:string;onPress:()=>void}){return<TouchableOpacity onPress={onPress} style={s.navItem}>{active?<LinearGradient colors={['#4932ff','#ed00b3']} style={s.active}><Ionicons name={icon} size={21} color="#fff"/><Text style={s.activeText}>{label}</Text></LinearGradient>:<View style={s.inactive}><Ionicons name={`${icon}-outline` as any} size={21} color={icon==='people'?'#d700b0':'#6b2cff'}/><Text style={[s.inactiveText,{color:icon==='people'?'#d700b0':'#6b2cff'}]}>{label}</Text></View>}</TouchableOpacity>}
const s=StyleSheet.create({root:{flex:1},navCover:{position:'absolute',left:0,right:0,bottom:0,height:78,backgroundColor:'#f6f6f8',alignItems:'center',justifyContent:'flex-start',paddingTop:6},compactNav:{width:'92%',height:58,backgroundColor:'#fff',borderRadius:29,padding:4,flexDirection:'row',shadowColor:'#000',shadowOpacity:.12,shadowRadius:10,shadowOffset:{width:0,height:3},elevation:7},navItem:{flex:1},active:{flex:1,borderRadius:24,alignItems:'center',justifyContent:'center'},inactive:{flex:1,borderRadius:24,alignItems:'center',justifyContent:'center'},activeText:{fontSize:10,color:'#fff',fontWeight:'800',marginTop:1},inactiveText:{fontSize:10,fontWeight:'800',marginTop:1},badge:{position:'absolute',right:-11,top:-7,minWidth:17,height:17,borderRadius:9,backgroundColor:'#ff1744',alignItems:'center',justifyContent:'center',paddingHorizontal:4},badgeText:{color:'#fff',fontSize:9,fontWeight:'900'}});
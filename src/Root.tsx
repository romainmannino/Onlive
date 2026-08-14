import React,{useEffect,useState}from'react';
import{StyleSheet,TouchableOpacity,View}from'react-native';
import{Ionicons}from'@expo/vector-icons';
import MainApp from'./MainApp';
import ChatScreen from'./ChatScreen';
import{supabase}from'./supabase';

export default function Root(){
 const[mode,setMode]=useState<'app'|'chat'>('app');const[userId,setUserId]=useState<string|null>(null);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setUserId(data.session?.user.id||null));const{data:l}=supabase.auth.onAuthStateChange((_e,s)=>setUserId(s?.user.id||null));return()=>l.subscription.unsubscribe()},[]);
 if(mode==='chat'&&userId)return<ChatScreen userId={userId} onBack={()=>setMode('app')} onHome={()=>setMode('app')} onContacts={()=>setMode('app')}/>;
 return<View style={{flex:1}}><MainApp/>{userId&&<TouchableOpacity onPress={()=>setMode('chat')} style={s.chatFab}><Ionicons name="chatbubbles" size={23} color="#fff"/></TouchableOpacity>}</View>
}
const s=StyleSheet.create({chatFab:{position:'absolute',right:18,bottom:91,width:52,height:52,borderRadius:26,backgroundColor:'#6b2cff',alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.18,shadowRadius:8,shadowOffset:{width:0,height:3},elevation:5}});
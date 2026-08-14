import React,{useEffect,useState}from'react';
import MainApp from'./MainApp';
import ChatScreen from'./ChatScreen';
import{supabase}from'./supabase';

type ChatTarget={userId:string;name:string;programId:string|null;programTitle:string;channel:string};

export default function Root(){
 const[mode,setMode]=useState<'app'|'chat'>('app');
 const[userId,setUserId]=useState<string|null>(null);
 const[chatTarget,setChatTarget]=useState<ChatTarget|null>(null);
 const[unreadCount,setUnreadCount]=useState(0);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setUserId(data.session?.user.id||null));const{data:l}=supabase.auth.onAuthStateChange((_e,s)=>setUserId(s?.user.id||null));return()=>l.subscription.unsubscribe()},[]);
 useEffect(()=>{if(!userId){setUnreadCount(0);return}let alive=true;const refresh=async()=>{const{data}=await supabase.rpc('chat_unread_count');if(alive)setUnreadCount(Number(data)||0)};refresh();const t=setInterval(refresh,2000);return()=>{alive=false;clearInterval(t)}},[userId]);
 const openDiscussions=()=>{setChatTarget(null);setMode('chat')};
 const startChat=(target:ChatTarget)=>{setChatTarget(target);setMode('chat')};
 if(mode==='chat'&&userId)return<ChatScreen userId={userId} initialTarget={chatTarget} unreadCount={unreadCount} onUnreadChange={setUnreadCount} onBack={()=>{setChatTarget(null);setMode('app')}} onHome={()=>{setChatTarget(null);setMode('app')}} onContacts={()=>{setChatTarget(null);setMode('app')}}/>;
 return<MainApp onOpenDiscussions={openDiscussions} onStartChat={startChat} unreadCount={unreadCount}/>;
}

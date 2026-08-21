import{Platform}from'react-native';
import*as Notifications from'expo-notifications';
import*as Contacts from'expo-contacts';
import Constants from'expo-constants';
import{supabase}from'./supabase';

Notifications.setNotificationHandler({
  handleNotification:async()=>({
    shouldShowBanner:true,
    shouldShowList:true,
    shouldPlaySound:true,
    shouldSetBadge:false,
  }),
});

function normalizePhone(value=''){
  let p=value.replace(/[^\d+]/g,'');
  if(p.startsWith('0033'))p='+33'+p.slice(4);
  if(p.startsWith('0'))p='+33'+p.slice(1);
  if(!p.startsWith('+')&&p.length===9)p='+33'+p;
  return p;
}

async function syncContactAliases(userId:string){
  try{
    const permission=await Contacts.getPermissionsAsync();
    if(permission.status!=='granted')return;
    const{data}=await Contacts.getContactsAsync({fields:[Contacts.Fields.PhoneNumbers],pageSize:0});
    const local=new Map<string,string>();
    for(const c of data){
      const name=(c.name||'').trim();
      if(!name)continue;
      for(const n of c.phoneNumbers||[]){
        const phone=normalizePhone(n.number||'');
        if(phone)local.set(phone,name);
      }
    }
    const phones=[...local.keys()];
    if(!phones.length)return;
    const matched:any[]=[];
    for(let i=0;i<phones.length;i+=300){
      const{data:rows,error}=await supabase.rpc('match_contact_phones',{phone_list:phones.slice(i,i+300)});
      if(error)throw error;
      matched.push(...(rows||[]));
    }
    const aliases=new Map<string,string>();
    for(const row of matched){
      const phone=normalizePhone(row.phone_e164||'');
      const name=local.get(phone);
      if(row.user_id&&name)aliases.set(row.user_id,name);
    }
    if(!aliases.size)return;
    const rows=[...aliases.entries()].map(([contact_user_id,local_name])=>({
      owner_user_id:userId,
      contact_user_id,
      local_name,
      updated_at:new Date().toISOString(),
    }));
    const{error}=await supabase.from('contact_aliases').upsert(rows,{onConflict:'owner_user_id,contact_user_id'});
    if(error)throw error;
  }catch(e){console.warn('Contact alias sync failed',e)}
}

export async function registerPushNotifications(userId:string){
  try{
    if(Platform.OS==='android'){
      await Notifications.setNotificationChannelAsync('onlive',{
        name:'Onlive',
        importance:Notifications.AndroidImportance.MAX,
        vibrationPattern:[0,250,180,250],
        sound:'default',
      });
    }
    const current=await Notifications.getPermissionsAsync();
    let status=current.status;
    if(status!=='granted')status=(await Notifications.requestPermissionsAsync()).status;
    if(status!=='granted')return null;
    const projectId=Constants.expoConfig?.extra?.eas?.projectId??Constants.easConfig?.projectId;
    if(!projectId)throw new Error('EAS projectId introuvable');
    const token=(await Notifications.getExpoPushTokenAsync({projectId})).data;
    await supabase.from('push_tokens').upsert({
      user_id:userId,
      expo_push_token:token,
      platform:Platform.OS==='ios'?'ios':'android',
      device_name:Constants.deviceName||null,
      enabled:true,
      updated_at:new Date().toISOString(),
    },{onConflict:'expo_push_token'});
    await supabase.from('notification_preferences').upsert({user_id:userId},{onConflict:'user_id',ignoreDuplicates:true});
    await syncContactAliases(userId);
    return token;
  }catch(e){console.warn('Push registration failed',e);return null}
}

export async function syncFavoriteReminderSchedule(userId:string,hasFavorites:boolean){
  try{
    const scheduled=await Notifications.getAllScheduledNotificationsAsync();
    for(const req of scheduled){
      if((req.content.data as any)?.type==='favorite_reminder')await Notifications.cancelScheduledNotificationAsync(req.identifier);
    }
    if(hasFavorites)return;
    const{data,error}=await supabase.auth.getUser();
    if(error||!data.user)return;
    const createdAt=new Date(data.user.created_at||Date.now()).getTime();
    const now=Date.now();
    const week=7*24*60*60*1000;
    let due=createdAt+48*60*60*1000;
    while(due<=now+60*1000)due+=week;
    for(let i=0;i<12;i++){
      const date=new Date(due+i*week);
      await Notifications.scheduleNotificationAsync({
        content:{
          title:'Personnalise Onlive ⭐',
          body:'Choisis tes clubs, sports, émissions et séries préférés pour recevoir les bons rappels.',
          sound:'default',
          data:{type:'favorite_reminder',userId},
        },
        trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date,channelId:'onlive'},
      });
    }
  }catch(e){console.warn('Favorite reminder scheduling failed',e)}
}

export async function setAppBadge(count:number){
  try{await Notifications.setBadgeCountAsync(Math.max(0,count))}catch{}
}

export async function pushChatMessage(roomId:string,body:string){
  return supabase.functions.invoke('send-onlive-push',{body:{type:'chat_message',room_id:roomId,body}});
}

export async function pushChatInvite(roomId:string,recipientUserId:string){
  return supabase.functions.invoke('send-onlive-push',{body:{type:'chat_invite',room_id:roomId,recipient_user_id:recipientUserId}});
}

export async function pushWatching(recipientUserIds:string[],programId:string,programTitle:string){
  return supabase.functions.invoke('send-onlive-push',{body:{type:'watching',recipient_user_ids:recipientUserIds,program_id:programId,program_title:programTitle}});
}

export{Notifications};

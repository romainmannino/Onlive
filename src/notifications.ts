import{Platform}from'react-native';
import*as Notifications from'expo-notifications';
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
    return token;
  }catch(e){console.warn('Push registration failed',e);return null}
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

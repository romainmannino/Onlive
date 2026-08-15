import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const client=createClient(
  'https://cixheqmufmvkolljbbqc.supabase.co',
  'sb_publishable_Ze5BdjJw9m213sjyTtbuqw_IxnXzz6J',
  {
    auth:{
      storage:AsyncStorage,
      autoRefreshToken:true,
      persistSession:true,
      detectSessionInUrl:false,
      flowType:'pkce',
    },
  }
);

const CONFIRM_CALLBACK='onlive://email-confirmed';

const originalSignUp=client.auth.signUp.bind(client.auth);
client.auth.signUp=((credentials:any)=>{
  if(credentials?.email){
    return originalSignUp({
      ...credentials,
      options:{
        ...(credentials.options||{}),
        emailRedirectTo:credentials.options?.emailRedirectTo||CONFIRM_CALLBACK,
      },
    });
  }
  return originalSignUp(credentials);
}) as typeof client.auth.signUp;

export const supabase=client;

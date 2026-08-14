import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://cixheqmufmvkolljbbqc.supabase.co',
  'sb_publishable_Ze5BdjJw9m213sjyTtbuqw_IxnXzz6J',
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
);

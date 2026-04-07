import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ohizoropuetrrymkviah.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_SdlxDJiUNcaL-4B4Lu8pbQ_3rmOAdsM';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl === 'https://placeholder-url.supabase.co') {
  console.warn('VITE_SUPABASE_URL is not configured in env variables. Using placeholder client.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

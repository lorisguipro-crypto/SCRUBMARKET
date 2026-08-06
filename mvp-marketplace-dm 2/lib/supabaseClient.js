import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Message clair si .env.local est oublié
  console.warn('Supabase : variables NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY manquantes.');
}

export const supabase = createClient(url, anonKey);

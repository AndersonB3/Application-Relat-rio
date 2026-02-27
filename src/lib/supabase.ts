import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const isConfigured =
  supabaseUrl !== '' &&
  supabaseUrl !== 'COLE_SUA_URL_AQUI' &&
  supabaseAnonKey !== '' &&
  supabaseAnonKey !== 'COLE_SUA_ANON_KEY_AQUI' &&
  supabaseUrl.startsWith('https://');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,   // Não armazenar sessão — app público, somente leitura
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'isiba-relatorio', // Identificação limpa nos logs
        },
      },
    })
  : null;

export const isSupabaseConfigured = isConfigured;

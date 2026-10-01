import { createClient } from '@supabase/supabase-js'

// Single Supabase browser client. Null when the env isn't configured (e.g. local
// dev without the vars) — every caller guards on it, so the app runs fine without
// Supabase (local-first), and gains cloud auth/sync when configured.
const url = import.meta.env?.VITE_SUPABASE_URL
const anon = import.meta.env?.VITE_SUPABASE_ANON_KEY

export const supabase =
  url && anon
    ? createClient(url, anon, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null

export function hasSupabase() {
  return Boolean(supabase)
}

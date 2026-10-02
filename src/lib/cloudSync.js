import { supabase } from './supabase.js'

// Cloud backup & restore — an OPT-IN, manual way to keep a copy of everything the
// app stores on this device (profile, reports, reminders, tool entries, chat) in
// the signed-in user's own private row, so she can move to a new phone without
// losing her record. We deliberately do NOT auto-sync in the background: silent
// two-way merge risks overwriting the wrong side. Instead she presses "Back up"
// or "Restore" and we tell her exactly what happened. Her row is protected by
// row-level security (auth.uid() = id) — only she can read or write it.
//
// We store the whole app state as one JSON blob in profiles.data. Simple, robust,
// and future-proof as new local keys are added. Nothing happens unless Supabase is
// configured AND she is signed in.

// Collect every poshanmitra_* key currently in localStorage into a plain object.
function collectLocal() {
  const out = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('poshanmitra')) out[k] = localStorage.getItem(k)
    }
  } catch {
    /* storage unavailable */
  }
  return out
}

// Write a backed-up key/value map back into localStorage (values are raw strings).
function restoreLocal(keys) {
  if (!keys || typeof keys !== 'object') return 0
  let n = 0
  try {
    for (const [k, v] of Object.entries(keys)) {
      if (k.startsWith('poshanmitra') && typeof v === 'string') {
        localStorage.setItem(k, v)
        n++
      }
    }
  } catch {
    /* storage unavailable */
  }
  return n
}

export function cloudAvailable() {
  return Boolean(supabase)
}

// Push this device's data to the user's cloud row. `user` is the normalised auth
// user ({ id, ... }). Returns { ok, error, savedAt }.
export async function backupToCloud(user) {
  if (!supabase) return { ok: false, error: 'not-configured' }
  if (!user?.id) return { ok: false, error: 'not-signed-in' }
  const savedAt = new Date().toISOString()
  const payload = { keys: collectLocal(), savedAt, version: 1 }
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, data: payload, updated_at: savedAt }, { onConflict: 'id' })
    if (error) return { ok: false, error: error.message }
    return { ok: true, error: null, savedAt }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

// Pull the user's cloud row and write it over local data. Returns
// { ok, error, restored (count), savedAt }. `ok:true, restored:0` means no backup yet.
export async function restoreFromCloud(user) {
  if (!supabase) return { ok: false, error: 'not-configured' }
  if (!user?.id) return { ok: false, error: 'not-signed-in' }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('data, updated_at')
      .eq('id', user.id)
      .maybeSingle()
    if (error) return { ok: false, error: error.message }
    if (!data?.data?.keys) return { ok: true, error: null, restored: 0, savedAt: null }
    const restored = restoreLocal(data.data.keys)
    return { ok: true, error: null, restored, savedAt: data.data.savedAt || data.updated_at || null }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

// When was the last cloud backup saved? Returns an ISO string or null.
export async function lastBackupAt(user) {
  if (!supabase || !user?.id) return null
  try {
    const { data } = await supabase.from('profiles').select('data, updated_at').eq('id', user.id).maybeSingle()
    return data?.data?.savedAt || data?.updated_at || null
  } catch {
    return null
  }
}

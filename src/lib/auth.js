import { supabase } from './supabase.js'

// Thin auth helpers over Supabase Auth. All free: Google OAuth and email OTP use
// Supabase's built-in services. Every function degrades to a clear "not-configured"
// result when Supabase isn't set up, so the UI can fall back to the phone quick-start.

export function authAvailable() {
  return Boolean(supabase)
}

export async function getSession() {
  if (!supabase) return null
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session || null
  } catch {
    return null
  }
}

// Subscribe to sign-in / sign-out. Returns an unsubscribe function.
export function onAuthChange(cb) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session))
  return () => data?.subscription?.unsubscribe?.()
}

// Google OAuth. Redirects away and back to /welcome, where the session is picked up.
export async function signInWithGoogle() {
  if (!supabase) return { error: 'not-configured' }
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    return { error: error?.message || null }
  } catch (e) {
    return { error: String(e) }
  }
}

// Send a 6-digit email OTP (also creates the account on first use).
export async function sendEmailOtp(email) {
  if (!supabase) return { error: 'not-configured' }
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    return { error: error?.message || null }
  } catch (e) {
    return { error: String(e) }
  }
}

export async function verifyEmailOtp(email, token) {
  if (!supabase) return { error: 'not-configured', session: null }
  try {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return { error: error?.message || null, session: data?.session || null }
  } catch (e) {
    return { error: String(e), session: null }
  }
}

export async function signOutSupabase() {
  if (!supabase) return
  try {
    await supabase.auth.signOut()
  } catch {
    /* no-op */
  }
}

// Normalise a Supabase session user into the fields the UI shows.
export function userFromSession(session) {
  const u = session?.user
  if (!u) return null
  const meta = u.user_metadata || {}
  return {
    id: u.id,
    email: u.email || null,
    name: meta.full_name || meta.name || null,
    avatar: meta.avatar_url || meta.picture || null,
    provider: u.app_metadata?.provider || 'email',
  }
}

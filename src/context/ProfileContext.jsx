import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../lib/storage.js'
import { getSession, onAuthChange, signOutSupabase, userFromSession } from '../lib/auth.js'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => storage.getProfile())
  const [loggedIn, setLoggedInState] = useState(() => storage.isLoggedIn())
  const [lang, setLangState] = useState(() => storage.getLang())
  // The signed-in Supabase user (Google / email OTP), if any. null for the
  // phone quick-start path, which stays purely local.
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    // Keep <html lang> in sync so :lang() font fallback and screen readers work.
    document.documentElement.lang = lang
  }, [lang])

  // Adopt a Supabase auth session (Google / email OTP) as a logged-in state, and
  // keep it in sync. Additive to the local phone flow; harmless if Supabase isn't
  // configured (getSession returns null and the subscription is a no-op).
  useEffect(() => {
    let active = true
    getSession().then((session) => {
      if (!active || !session) return
      setAuthUser(userFromSession(session))
      storage.setLoggedIn(true)
      setLoggedInState(true)
    })
    const unsub = onAuthChange((session) => {
      if (session) {
        setAuthUser(userFromSession(session))
        storage.setLoggedIn(true)
        setLoggedInState(true)
      } else {
        setAuthUser(null)
      }
    })
    return () => {
      active = false
      unsub()
    }
  }, [])

  const setProfile = (next) => {
    setProfileState(next)
    if (next) storage.setProfile(next)
  }

  const updateProfile = (patch) => {
    setProfileState((prev) => {
      const next = { ...(prev || {}), ...patch }
      storage.setProfile(next)
      return next
    })
  }

  const login = () => {
    storage.setLoggedIn(true)
    setLoggedInState(true)
  }

  const logout = () => {
    signOutSupabase()
    setAuthUser(null)
    storage.setLoggedIn(false)
    setLoggedInState(false)
  }

  const setLang = (next) => {
    storage.setLang(next)
    setLangState(next)
  }

  // Delete all my data — SAFETY.md §6.
  const deleteAllData = () => {
    signOutSupabase()
    storage.deleteAll()
    setProfileState(null)
    setAuthUser(null)
    setLoggedInState(false)
    setLangState('en')
  }

  const value = useMemo(
    () => ({
      profile,
      loggedIn,
      authUser,
      lang,
      setProfile,
      updateProfile,
      login,
      logout,
      setLang,
      deleteAllData,
    }),
    [profile, loggedIn, authUser, lang]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}

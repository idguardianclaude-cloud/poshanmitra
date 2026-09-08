import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../lib/storage.js'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => storage.getProfile())
  const [loggedIn, setLoggedInState] = useState(() => storage.isLoggedIn())
  const [lang, setLangState] = useState(() => storage.getLang())

  useEffect(() => {
    // Keep <html lang> in sync so :lang() font fallback and screen readers work.
    document.documentElement.lang = lang
  }, [lang])

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
    storage.setLoggedIn(false)
    setLoggedInState(false)
  }

  const setLang = (next) => {
    storage.setLang(next)
    setLangState(next)
  }

  // Delete all my data — SAFETY.md §6.
  const deleteAllData = () => {
    storage.deleteAll()
    setProfileState(null)
    setLoggedInState(false)
    setLangState('en')
  }

  const value = useMemo(
    () => ({
      profile,
      loggedIn,
      lang,
      setProfile,
      updateProfile,
      login,
      logout,
      setLang,
      deleteAllData,
    }),
    [profile, loggedIn, lang]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}

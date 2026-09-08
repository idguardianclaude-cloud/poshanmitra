// localStorage helpers. Everything in PoshanMitra lives on the device; nothing
// is sent anywhere except chat messages to Gemini. Keep these wrapped in
// try/catch so private-mode / disabled-storage browsers degrade instead of
// throwing on load.

const PROFILE_KEY = 'poshanmitra_profile'
const LOGIN_KEY = 'poshanmitra_logged_in'
const CHAT_KEY = 'poshanmitra_chat'
const ONBOARD_KEY = 'poshanmitra_onboarding'
const LANG_KEY = 'poshanmitra_lang'

function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* no-op */
  }
}

export const storage = {
  getProfile: () => read(PROFILE_KEY, null),
  setProfile: (profile) => write(PROFILE_KEY, profile),

  isLoggedIn: () => read(LOGIN_KEY, false) === true,
  setLoggedIn: (v) => write(LOGIN_KEY, v),

  getChat: () => read(CHAT_KEY, []),
  setChat: (messages) => write(CHAT_KEY, messages),
  clearChat: () => remove(CHAT_KEY),

  getOnboarding: () => read(ONBOARD_KEY, null),
  setOnboarding: (state) => write(ONBOARD_KEY, state),
  clearOnboarding: () => remove(ONBOARD_KEY),

  getLang: () => read(LANG_KEY, 'en'),
  setLang: (lang) => write(LANG_KEY, lang),

  // Delete all my data — SAFETY.md §6. Must actually clear EVERYTHING, including
  // keys written outside this module (dashboard plan, eligibility wizard). Sweep
  // every poshanmitra_* key so nothing is left behind as new keys get added.
  deleteAll: () => {
    try {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('poshanmitra')) keys.push(k)
      }
      keys.forEach(remove)
    } catch {
      // Fallback to the known set if enumeration fails.
      ;[PROFILE_KEY, LOGIN_KEY, CHAT_KEY, ONBOARD_KEY, LANG_KEY].forEach(remove)
    }
  },
}

export { PROFILE_KEY }

// localStorage helpers. Everything in PoshanMitra lives on the device; nothing
// is sent anywhere except chat messages to Gemini. Keep these wrapped in
// try/catch so private-mode / disabled-storage browsers degrade instead of
// throwing on load.

const PROFILE_KEY = 'poshanmitra_profile'
const LOGIN_KEY = 'poshanmitra_logged_in'
const CHAT_KEY = 'poshanmitra_chat'
const ONBOARD_KEY = 'poshanmitra_onboarding'
const LANG_KEY = 'poshanmitra_lang'
const REPORTS_KEY = 'poshanmitra_reports'
const REMINDERS_KEY = 'poshanmitra_reminders'

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

  // Health reports — a personal on-device log (Hb, BP, blood sugar, weight).
  // A flat array of readings; the Reports page groups and trends them. This is
  // her own record, never a clinical result and never interpreted as diagnosis.
  getReports: () => read(REPORTS_KEY, []),
  setReports: (list) => write(REPORTS_KEY, list),

  // Local reminders (ANC visits, tablets). On-device schedule only — no backend.
  getReminders: () => read(REMINDERS_KEY, []),
  setReminders: (list) => write(REMINDERS_KEY, list),

  getNotifications: () => read('poshanmitra_notifications', true) !== false,
  setNotifications: (v) => write('poshanmitra_notifications', v),

  // Campaign slot bookings (on-device appointment records). Not an official govt
  // booking — a personal reminder the woman can share/add to her calendar.
  getBookings: () => read('poshanmitra_bookings', []),
  setBookings: (list) => write('poshanmitra_bookings', list),

  // Her chosen location (city + optional coords) for "near me" relevance.
  getLocation: () => read('poshanmitra_location', null),
  setLocation: (loc) => write('poshanmitra_location', loc),

  // Weekly ANC check-up log — lives ONLY in the Weekly Check-up section (kept
  // separate from the general hospital-report uploads on the Reports page).
  getCheckups: () => read('poshanmitra_checkups', []),
  setCheckups: (list) => write('poshanmitra_checkups', list),

  // Health-tool records (kick counter, contraction timer, etc.).
  getKicks: () => read('poshanmitra_kicks', []),
  setKicks: (list) => write('poshanmitra_kicks', list),
  getContractions: () => read('poshanmitra_contractions', []),
  setContractions: (list) => write('poshanmitra_contractions', list),

  // Emergency contacts (name + number) for the SOS feature.
  getEmergencyContacts: () => read('poshanmitra_emergency', []),
  setEmergencyContacts: (list) => write('poshanmitra_emergency', list),

  // Water intake — a small map of { 'YYYY-MM-DD': glasses } for recent days.
  getWater: () => read('poshanmitra_water', {}),
  setWater: (map) => write('poshanmitra_water', map),

  // Shopping cart — { [productId]: qty }. Checkout is a demo (no payment).
  getCart: () => read('poshanmitra_cart', {}),
  setCart: (map) => write('poshanmitra_cart', map),

  // Daily mood check-ins — [{ date, mood 1-5, note }]. Wellbeing, never a diagnosis.
  getMoods: () => read('poshanmitra_moods', []),
  setMoods: (list) => write('poshanmitra_moods', list),

  // Birth-plan preferences (an object of choices). Non-medical wishes to discuss.
  getBirthPlan: () => read('poshanmitra_birthplan', {}),
  setBirthPlan: (obj) => write('poshanmitra_birthplan', obj),

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

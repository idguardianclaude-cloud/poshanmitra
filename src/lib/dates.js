// Dynamic dates so the app never shows a stale hardcoded calendar date.
// Everything here is computed relative to "today" at render time.

const LOCALE = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' }

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// "12 May 2026"
export function formatIN(date, lang = 'en') {
  return new Date(date).toLocaleDateString(LOCALE[lang] || 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// "Mon" / short weekday
export function weekdayShort(date, lang = 'en') {
  return new Date(date).toLocaleDateString(LOCALE[lang] || 'en-IN', { weekday: 'short' })
}
export function weekdayLong(date, lang = 'en') {
  return new Date(date).toLocaleDateString(LOCALE[lang] || 'en-IN', { weekday: 'long' })
}

// Monday of the current week (weeks start Monday).
export function mondayOfThisWeek(base = new Date()) {
  const d = startOfDay(base)
  const dow = (d.getDay() + 6) % 7 // 0 = Monday
  return addDays(d, -dow)
}

// The current week's seven days as { key, label, date, iso, isToday }.
const KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export function weekDays(lang = 'en') {
  const monday = mondayOfThisWeek()
  const todayIso = startOfDay().toISOString().slice(0, 10)
  return KEYS.map((key, i) => {
    const date = addDays(monday, i)
    const iso = date.toISOString().slice(0, 10)
    return {
      key,
      label: weekdayShort(date, lang),
      date: date.toLocaleDateString(LOCALE[lang] || 'en-IN', { day: 'numeric', month: 'short' }),
      iso,
      isToday: iso === todayIso,
    }
  })
}

export function todayKey() {
  return KEYS[(new Date().getDay() + 6) % 7]
}

// A plausible upcoming appointment: next week, same-ish day.
export function nextCheckupDate() {
  return addDays(startOfDay(), 12)
}

// Next Monday (used for "next review").
export function nextMonday() {
  return addDays(mondayOfThisWeek(), 7)
}

// "5 days ago" style relative label for the last check-up.
export function daysAgoDate(n = 5) {
  return addDays(startOfDay(), -n)
}

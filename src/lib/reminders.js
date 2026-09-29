// =============================================================================
// reminders.js — local, on-device reminders for ANC visits and tablets.
//
// No backend and no push server: the schedule lives in localStorage and fires
// through the browser Notification API while the app is open (a small poller in
// AppShell checks once a minute). This is honest about its limits — it is a
// personal nudge, not a guaranteed alarm — and it needs no account or key.
//
// SAFETY: a reminder never names a medicine or a dose (SAFETY.md §3). The
// "tablet" kind is a neutral nudge ("time for your tablet as advised by your
// doctor"); the woman writes her own label. We only remind — we never instruct
// what or how much to take.
//
// The core scheduling functions are pure and take an explicit `now`, so they are
// unit-tested without timers.
// =============================================================================

export const REMINDER_KINDS = ['anc', 'tablet', 'custom']
export const REPEATS = ['once', 'daily', 'weekly']

let seq = 0
function makeId() {
  return `rem-${Date.now()}-${seq++}`
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toHM(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Validate + normalise a reminder from raw form input. Returns null if invalid.
export function makeReminder({ kind, title, time, repeat, date, days } = {}) {
  if (!REMINDER_KINDS.includes(kind)) return null
  if (!REPEATS.includes(repeat)) return null
  if (!/^\d{2}:\d{2}$/.test(time || '')) return null
  const clean = {
    id: makeId(),
    kind,
    title: (title || '').trim().slice(0, 80),
    time,
    repeat,
    enabled: true,
    lastFired: null,
  }
  if (repeat === 'once') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return null
    clean.date = date
  }
  if (repeat === 'weekly') {
    const list = Array.isArray(days) ? days.filter((d) => d >= 0 && d <= 6) : []
    if (list.length === 0) return null
    clean.days = [...new Set(list)].sort()
  }
  return clean
}

export function updateReminder(list, id, patch) {
  return list.map((r) => (r.id === id ? { ...r, ...patch } : r))
}

export function removeReminder(list, id) {
  return list.filter((r) => r.id !== id)
}

// The occurrence key for a given day — a reminder fires at most once per day, so
// this is enough to avoid re-firing the same slot.
export function occurrenceKey(reminder, now) {
  return `${reminder.id}:${toISODate(now)}`
}

// Does this reminder apply on `now`'s calendar day at all (before time-of-day)?
export function appliesToday(reminder, now) {
  if (!reminder.enabled) return false
  if (reminder.repeat === 'daily') return true
  if (reminder.repeat === 'once') return reminder.date === toISODate(now)
  if (reminder.repeat === 'weekly') return (reminder.days || []).includes(now.getDay())
  return false
}

// Is the reminder due to fire right now (applies today, its time has passed, and
// it hasn't already fired for today's occurrence)?
export function isDue(reminder, now) {
  if (!appliesToday(reminder, now)) return false
  if (reminder.lastFired === occurrenceKey(reminder, now)) return false
  return toHM(now) >= reminder.time
}

// All reminders currently due, for the poller to fire.
export function dueReminders(list, now = new Date()) {
  return list.filter((r) => isDue(r, now))
}

// Mark a set of reminder ids as fired for today (immutably). A `once` reminder
// that has fired is also disabled so it never nags again.
export function markFired(list, ids, now = new Date()) {
  const set = new Set(ids)
  return list.map((r) => {
    if (!set.has(r.id)) return r
    const key = occurrenceKey(r, now)
    return { ...r, lastFired: key, enabled: r.repeat === 'once' ? false : r.enabled }
  })
}

// Upcoming enabled reminders, soonest first — for the dashboard card. Computes
// each reminder's next fire time from `now`.
export function upcoming(list, now = new Date(), limit = 3) {
  return list
    .filter((r) => r.enabled)
    .map((r) => ({ reminder: r, at: nextOccurrence(r, now) }))
    .filter((x) => x.at != null)
    .sort((a, b) => a.at - b.at)
    .slice(0, limit)
    .map((x) => x.reminder)
}

// The next Date this reminder will fire at or after `now`, or null if it never
// will again (a past one-off). Looks ahead up to 8 days for weekly reminders.
export function nextOccurrence(reminder, now = new Date()) {
  const [h, m] = reminder.time.split(':').map(Number)
  for (let i = 0; i <= 8; i++) {
    const day = new Date(now)
    day.setDate(now.getDate() + i)
    day.setHours(h, m, 0, 0)
    const applies =
      reminder.repeat === 'daily' ||
      (reminder.repeat === 'once' && reminder.date === toISODate(day)) ||
      (reminder.repeat === 'weekly' && (reminder.days || []).includes(day.getDay()))
    if (applies && day >= now) return day
  }
  return null
}

// --- Notification API (guarded; degrades cleanly where unsupported) ---------

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function notificationPermission() {
  return notificationsSupported() ? Notification.permission : 'unsupported'
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    return notificationPermission()
  }
}

export function fireNotification(title, body) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return false
  try {
    // eslint-disable-next-line no-new
    new Notification(title, { body, icon: '/icon-192.png', tag: 'poshanmitra-reminder' })
    return true
  } catch {
    return false
  }
}

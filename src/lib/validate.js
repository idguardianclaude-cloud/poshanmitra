// Shared input validation. Pure functions, unit-tested. Every user-entered
// value in the app goes through one of these before it is saved or sent.

const DAY = 86400000

// Keep only digits, cap the length (generic — used for any numeric-only field).
export function digitsOnly(v, max = 10) {
  return String(v ?? '').replace(/\D/g, '').slice(0, max)
}

// Normalise a phone entry to the 10 national digits: drop a +91 country code or a
// leading 0 if present, then keep 10 digits. Handles pasted full numbers.
export function normalizeMobile(v) {
  let d = String(v ?? '').replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return d.slice(0, 10)
}

// Indian mobile: 10 digits, first digit 6–9.
export function isValidMobile(v) {
  return /^[6-9]\d{9}$/.test(normalizeMobile(v))
}

// Optional email — empty is allowed; if present it must look like an address.
export function isValidEmail(v) {
  const s = String(v ?? '').trim()
  if (!s) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)
}
export function isNonEmptyEmail(v) {
  return String(v ?? '').trim().length > 0
}

// Names: collapse whitespace, trim, cap at 40 chars. Reject empty / digits-only.
export function cleanName(v) {
  return String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
}
export function isValidName(v) {
  const n = cleanName(v)
  return n.length >= 1 && n.length <= 40 && /[^\d\s]/.test(n)
}

// Age in years: whole number, 14–60 (pregnancy-plausible bounds).
export function isValidAge(n) {
  const x = Number(n)
  return Number.isInteger(x) && x >= 14 && x <= 60
}

// Due date / last-period date sanity. Returns an error code (string) or null.
//   basis 'lmp' → must be in the past, within ~43 weeks.
//   basis 'due' → within ~43 weeks ahead, and not more than a month overdue.
export function validatePregnancyDate(dateStr, basis) {
  if (!dateStr) return 'required'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return 'invalid'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = (d - today) / DAY // +ve = future
  if (basis === 'lmp') {
    if (diff > 0) return 'future'
    if (-diff > 300) return 'toofar'
    return null
  }
  // due date
  if (diff > 300) return 'toofar'
  if (-diff > 30) return 'past'
  return null
}

// Cap free-text messages so a huge paste can't be sent to the model.
export const MAX_MESSAGE = 1000
export function cleanMessage(v) {
  return String(v ?? '').slice(0, MAX_MESSAGE)
}

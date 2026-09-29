// Pregnancy date math. A term pregnancy is 280 days (40 weeks) from the last
// menstrual period (LMP); the due date (EDD) is LMP + 280 days. If we know the
// due date instead, LMP = dueDate - 280 days.

const MS_PER_DAY = 86400000
const TERM_DAYS = 280

// Accepts a due date OR an LMP date (ISO string or Date), returns derived fields.
// `basis` is 'due' or 'lmp'. Returns null-ish fields when input is missing.
export function derivePregnancy(dateStr, basis = 'due') {
  if (!dateStr) return { weeks: null, days: null, trimester: null, month: null, dueDate: null }
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) {
    return { weeks: null, days: null, trimester: null, month: null, dueDate: null }
  }

  let lmp
  let dueDate
  if (basis === 'lmp') {
    lmp = d
    dueDate = new Date(d.getTime() + TERM_DAYS * MS_PER_DAY)
  } else {
    dueDate = d
    lmp = new Date(d.getTime() - TERM_DAYS * MS_PER_DAY)
  }

  const now = new Date()
  const elapsedDays = Math.floor((now - lmp) / MS_PER_DAY)
  const clamped = Math.max(0, Math.min(elapsedDays, TERM_DAYS + 14))
  const weeks = Math.floor(clamped / 7)
  const days = clamped % 7

  let trimester = 1
  if (weeks >= 28) trimester = 3
  else if (weeks >= 13) trimester = 2

  // Gestational month, roughly 4.34 weeks per month, capped at 9.
  const month = Math.min(9, Math.max(1, Math.floor(weeks / 4.34) + 1))

  return {
    weeks,
    days,
    trimester,
    month,
    dueDate: dueDate.toISOString().slice(0, 10),
  }
}

// Language-aware ordinals. महीना/महिना is masculine (…वाँ / …वा); तिमाही is
// feminine (…ली / …री) — so month and trimester use different endings.
const MONTH_ORD = {
  en: ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'],
  hi: ['', 'पहला', 'दूसरा', 'तीसरा', 'चौथा', 'पाँचवाँ', 'छठा', 'सातवाँ', 'आठवाँ', 'नौवाँ'],
  mr: ['', 'पहिला', 'दुसरा', 'तिसरा', 'चौथा', 'पाचवा', 'सहावा', 'सातवा', 'आठवा', 'नववा'],
}
const TRIMESTER_ORD = {
  en: ['', '1st', '2nd', '3rd'],
  hi: ['', 'पहली', 'दूसरी', 'तीसरी'],
  mr: ['', 'पहिली', 'दुसरी', 'तिसरी'],
}
export function ordinalMonth(m, lang = 'en') {
  if (!m || m < 1) return '—'
  return (MONTH_ORD[lang] || MONTH_ORD.en)[m] || `${m}`
}
export function ordinalTrimester(t, lang = 'en') {
  if (!t) return '—'
  return (TRIMESTER_ORD[lang] || TRIMESTER_ORD.en)[t] || `${t}`
}

// 12 May 2025 — Indian long-date formatting.
export function formatDateIN(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

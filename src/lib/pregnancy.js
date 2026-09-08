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

const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']
export function ordinalMonth(m) {
  if (!m || m < 1) return '—'
  return ORDINAL[m] || `${m}th`
}
export function ordinalTrimester(t) {
  if (!t) return '—'
  return ['', '1st', '2nd', '3rd'][t] || `${t}th`
}

// 12 May 2025 — Indian long-date formatting.
export function formatDateIN(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

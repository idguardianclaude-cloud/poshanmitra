// =============================================================================
// reports.js — pure logic for the on-device health log (Reports page).
//
// SAFETY NOTE. This is her own PERSONAL RECORD of numbers she chooses to write
// down — it is NOT a clinical test and it is NEVER interpreted as a diagnosis.
// We deliberately do not colour a reading "high/low", do not say what a value
// "should" be, and do not compute any clinical verdict (SAFETY.md §3 / §4:
// never state a clinical number as advice, never diagnose). The page shows the
// numbers she entered and their trend over time, and always points her to her
// doctor. The bounds below are only loose SANITY limits to catch typos (e.g. a
// weight of 900 kg), not medical thresholds.
// =============================================================================

// Each metric: how it's entered and shown. `fields` drives the form; a metric
// with two fields (BP) stores both. Units are display-only.
export const METRICS = [
  {
    key: 'hb',
    unit: 'g/dL',
    fields: [{ name: 'value', min: 2, max: 25, step: 0.1 }],
    tint: '#FEF2F2',
    color: '#DC2626',
  },
  {
    key: 'bp',
    unit: 'mmHg',
    // Blood pressure is systolic/diastolic — two numbers, shown as "120/80".
    fields: [
      { name: 'systolic', min: 50, max: 300, step: 1 },
      { name: 'diastolic', min: 30, max: 200, step: 1 },
    ],
    tint: '#EFF6FF',
    color: '#2563EB',
  },
  {
    key: 'sugar',
    unit: 'mg/dL',
    fields: [{ name: 'value', min: 20, max: 600, step: 1 }],
    tint: '#FFFBEB',
    color: '#D97706',
  },
  {
    key: 'weight',
    unit: 'kg',
    fields: [{ name: 'value', min: 25, max: 250, step: 0.1 }],
    tint: '#ECFDF5',
    color: '#059669',
  },
]

export const METRIC_KEYS = METRICS.map((m) => m.key)

export function getMetric(key) {
  return METRICS.find((m) => m.key === key) || null
}

let seq = 0
function makeId() {
  return `r-${Date.now()}-${seq++}`
}

// Loose sanity check only (catches typos, not medical judgement). Returns true
// when every field of the reading is a finite number inside its metric bounds.
export function isValidReading(metricKey, values) {
  const metric = getMetric(metricKey)
  if (!metric) return false
  return metric.fields.every((f) => {
    const n = Number(values?.[f.name])
    return Number.isFinite(n) && n >= f.min && n <= f.max
  })
}

// Build a normalised reading from raw form values. Returns null if invalid.
// `date` is an ISO 'YYYY-MM-DD' string; defaults to today.
export function makeReading(metricKey, values, { date, note } = {}) {
  if (!isValidReading(metricKey, values)) return null
  const metric = getMetric(metricKey)
  const reading = {
    id: makeId(),
    metric: metricKey,
    date: date || todayISO(),
    note: (note || '').slice(0, 140),
  }
  for (const f of metric.fields) reading[f.name] = Number(values[f.name])
  return reading
}

export function todayISO() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// Add a reading to the list (immutably), newest kept sortable by date.
export function addReading(list, reading) {
  if (!reading) return list
  return [...list, reading]
}

export function removeReading(list, id) {
  return list.filter((r) => r.id !== id)
}

// All readings for a metric, sorted oldest → newest (for trend lines).
export function seriesFor(list, metricKey) {
  return list
    .filter((r) => r.metric === metricKey)
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

// A short display string for a reading's value ("11.5", "120/80").
export function displayValue(reading) {
  if (!reading) return ''
  if (reading.metric === 'bp') return `${reading.systolic}/${reading.diastolic}`
  return String(reading.value)
}

// The numeric value to plot for a reading. For BP we plot systolic (the diastolic
// rides along in the tooltip/label); a single line keeps the chart honest and
// readable without implying a clinical rule.
export function plotValue(reading) {
  if (!reading) return null
  if (reading.metric === 'bp') return reading.systolic
  return reading.value
}

// Latest reading for a metric, or null.
export function latestFor(list, metricKey) {
  const s = seriesFor(list, metricKey)
  return s.length ? s[s.length - 1] : null
}

// Simple trend direction between the last two readings: 'up' | 'down' | 'flat'
// | null. Purely descriptive of HER OWN numbers — not a judgement about health.
export function trendFor(list, metricKey) {
  const s = seriesFor(list, metricKey)
  if (s.length < 2) return null
  const a = plotValue(s[s.length - 2])
  const b = plotValue(s[s.length - 1])
  if (b > a) return 'up'
  if (b < a) return 'down'
  return 'flat'
}

// Map the JSON that Gemini extracted from a report photo into valid readings for
// the four tracked metrics. Each reading still passes the same sanity bounds, so
// a misread value is dropped rather than stored. The report's own printed date is
// used when present. "other" results aren't stored as metrics (we have no chart
// for them) — the UI shows them for the woman to note.
export function readingsFromExtract(data, opts = {}) {
  if (!data || typeof data !== 'object') return []
  const date =
    typeof data.report_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.report_date)
      ? data.report_date
      : opts.date || todayISO()
  const out = []
  const push = (metric, values) => {
    const r = makeReading(metric, values, { date })
    if (r) out.push(r)
  }
  if (data.hb != null) push('hb', { value: data.hb })
  if (data.bp_systolic != null && data.bp_diastolic != null)
    push('bp', { systolic: data.bp_systolic, diastolic: data.bp_diastolic })
  const sugar = data.sugar_fasting ?? data.sugar_pp ?? data.sugar_random
  if (sugar != null) push('sugar', { value: sugar })
  if (data.weight_kg != null) push('weight', { value: data.weight_kg })
  return out
}

// A one-line summary of her latest readings, so Mitra can gently refer to them.
// Her own record — never a diagnosis (the system prompt keeps that boundary).
export function summariseForMitra(list) {
  if (!Array.isArray(list) || list.length === 0) return ''
  const parts = []
  for (const key of METRIC_KEYS) {
    const latest = latestFor(list, key)
    if (latest) parts.push(`${key} ${displayValue(latest)} (${latest.date})`)
  }
  return parts.join(', ')
}

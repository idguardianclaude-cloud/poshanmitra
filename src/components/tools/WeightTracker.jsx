import { useState } from 'react'
import { Scale, Plus, TrendingUp } from 'lucide-react'
import { storage } from '../../lib/storage.js'
import { seriesFor, makeReading, addReading, todayISO } from '../../lib/reports.js'
import { formatIN } from '../../lib/dates.js'

// Weight-gain tracker. Reuses the SAME on-device record as the Reports page
// (metric 'weight'), so a weight added here also shows up there and vice-versa —
// one source of truth, no duplicate store. Purely descriptive of HER OWN numbers:
// we show the trend and the change since her first entry, but never say what the
// gain "should" be. Healthy pregnancy weight gain depends on her starting BMI and
// is her doctor's call — we say exactly that and nothing more (SAFETY.md §3/§4).
export function WeightTracker() {
  const [reports, setReports] = useState(() => storage.getReports())
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  const series = seriesFor(reports, 'weight')
  const first = series[0] || null
  const latest = series.length ? series[series.length - 1] : null
  const gain = first && latest ? Math.round((latest.value - first.value) * 10) / 10 : null

  function add(e) {
    e.preventDefault()
    const reading = makeReading('weight', { value: val }, { date: todayISO() })
    if (!reading) {
      setErr(true)
      return
    }
    const next = addReading(reports, reading)
    setReports(next)
    storage.setReports(next)
    setVal('')
    setErr(false)
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ECFDF5' }}>
          <Scale size={18} className="text-emerald-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Weight tracker</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">
        Note your weight over time. Healthy gain varies for every woman — your doctor guides what's right for you.
      </p>

      {latest ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-canvas border border-line px-3 py-2.5">
            <p className="text-[11px] text-ink-faint">Latest</p>
            <p className="text-2xl font-bold text-emerald-600 tabular-nums">{latest.value} <span className="text-sm font-medium text-ink-muted">kg</span></p>
            <p className="text-[11px] text-ink-faint mt-0.5">{formatIN(latest.date)}</p>
          </div>
          <div className="rounded-xl bg-canvas border border-line px-3 py-2.5">
            <p className="text-[11px] text-ink-faint flex items-center gap-1"><TrendingUp size={11} /> Since first entry</p>
            <p className="text-2xl font-bold text-ink tabular-nums">
              {gain === null ? '—' : `${gain > 0 ? '+' : ''}${gain}`} <span className="text-sm font-medium text-ink-muted">kg</span>
            </p>
            <p className="text-[11px] text-ink-faint mt-0.5">{series.length} entr{series.length === 1 ? 'y' : 'ies'}</p>
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-ink-muted rounded-xl bg-canvas border border-line px-3 py-3 text-center">
          No weight noted yet. Add your first reading below.
        </p>
      )}

      <form onSubmit={add} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="25"
            max="250"
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(false) }}
            placeholder="Today's weight"
            aria-label="Today's weight in kilograms"
            className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${err ? 'border-red-300' : 'border-line'}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-faint">kg</span>
        </div>
        <button type="submit" className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 text-white px-4 py-2.5 text-sm font-medium hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
          <Plus size={16} /> Add
        </button>
      </form>
      {err && <p className="mt-1.5 text-xs text-red-600">Please enter a weight between 25 and 250 kg.</p>}

      {series.length > 1 && (
        <ul className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
          {series.slice().reverse().map((r) => (
            <li key={r.id} className="flex items-center justify-between text-sm rounded-lg bg-canvas px-3 py-1.5">
              <span className="text-ink-muted">{formatIN(r.date)}</span>
              <span className="font-semibold text-ink tabular-nums">{r.value} kg</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-ink-faint">This is your own note, shared with the Reports page — not a medical assessment.</p>
    </div>
  )
}

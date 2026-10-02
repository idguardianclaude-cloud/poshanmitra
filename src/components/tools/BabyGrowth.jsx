import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ruler, Plus, Baby } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { storage } from '../../lib/storage.js'
import { todayISO } from '../../lib/reports.js'
import { formatIN } from '../../lib/dates.js'

// Baby growth log (postpartum). A simple, private record of weight and length over
// time — HER OWN notes, deliberately descriptive only. We don't plot percentiles or
// say whether growth is "normal": that's the ANM/doctor's job on the MCP card, and a
// scary-looking chart could mislead. We just keep her numbers and show the latest.
// Appears once she's added her baby's birth date (shared profile.babyDob).
export function BabyGrowth() {
  const { profile } = useProfile()
  const hasBaby = Boolean(profile?.babyDob)
  const [list, setList] = useState(() => storage.getBabyGrowth())
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

  const sorted = useMemo(
    () => list.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [list]
  )
  const latest = sorted[0] || null

  function add(e) {
    e.preventDefault()
    const w = Number(weight)
    const h = Number(height)
    const validW = Number.isFinite(w) && w > 0 && w <= 40
    const validH = Number.isFinite(h) && h > 0 && h <= 150
    if (!validW && !validH) return
    const entry = {
      date: todayISO(),
      weightKg: validW ? Math.round(w * 100) / 100 : null,
      heightCm: validH ? Math.round(h * 10) / 10 : null,
    }
    const next = [...list, entry]
    setList(next)
    storage.setBabyGrowth(next)
    setWeight('')
    setHeight('')
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FFF1F2' }}>
          <Ruler size={18} className="text-rose-500" />
        </span>
        <h2 className="text-base font-semibold text-ink">Baby growth</h2>
      </div>

      {!hasBaby ? (
        <>
          <p className="text-xs text-ink-muted mb-4">Once your baby arrives, add their birth date to start a growth log.</p>
          <Link to="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-rose-600">
            <Baby size={15} /> Add birth date in the vaccination tool above
          </Link>
        </>
      ) : (
        <>
          <p className="text-xs text-ink-muted mb-4">Note your baby’s weight and length over time. Your record — the doctor tracks growth officially.</p>

          {latest && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-canvas border border-line px-3 py-2.5">
                <p className="text-[11px] text-ink-faint">Latest weight</p>
                <p className="text-2xl font-bold text-rose-500 tabular-nums">{latest.weightKg ?? '—'} <span className="text-sm font-medium text-ink-muted">kg</span></p>
              </div>
              <div className="rounded-xl bg-canvas border border-line px-3 py-2.5">
                <p className="text-[11px] text-ink-faint">Latest length</p>
                <p className="text-2xl font-bold text-ink tabular-nums">{latest.heightCm ?? '—'} <span className="text-sm font-medium text-ink-muted">cm</span></p>
              </div>
            </div>
          )}

          <form onSubmit={add} className="flex items-end gap-2">
            <label className="flex-1 text-xs text-ink-muted">
              Weight (kg)
              <input type="number" inputMode="decimal" step="0.01" min="0" max="40" value={weight} onChange={(e) => setWeight(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </label>
            <label className="flex-1 text-xs text-ink-muted">
              Length (cm)
              <input type="number" inputMode="decimal" step="0.1" min="0" max="150" value={height} onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            </label>
            <button type="submit" className="rounded-xl bg-rose-500 text-white px-3 py-2 text-sm font-medium hover:brightness-95 shrink-0">
              <Plus size={16} />
            </button>
          </form>

          {sorted.length > 0 && (
            <ul className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
              {sorted.map((e, i) => (
                <li key={i} className="flex items-center justify-between text-sm rounded-lg bg-canvas px-3 py-1.5">
                  <span className="text-ink-muted">{formatIN(e.date)}</span>
                  <span className="font-medium text-ink tabular-nums">
                    {e.weightKg != null ? `${e.weightKg} kg` : ''}{e.weightKg != null && e.heightCm != null ? ' · ' : ''}{e.heightCm != null ? `${e.heightCm} cm` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <p className="mt-3 text-[11px] text-ink-faint">Your own notes, not a medical assessment. Your ANM/doctor tracks growth on the MCP card.</p>
    </div>
  )
}

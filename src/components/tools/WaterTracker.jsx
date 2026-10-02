import { useState } from 'react'
import { Droplet, Plus, Minus } from 'lucide-react'
import { storage } from '../../lib/storage.js'
import { todayISO } from '../../lib/reports.js'

// Daily water intake. A gentle hydration habit — ~8 glasses a day is a common
// general guide in pregnancy (her doctor may suggest more or less). Not medical
// advice. Keeps a small per-day map so recent days persist.
const GOAL = 8

export function WaterTracker() {
  const today = todayISO()
  const [map, setMap] = useState(() => storage.getWater())
  const glasses = map[today] || 0

  function set(n) {
    const next = { ...map, [today]: Math.max(0, Math.min(20, n)) }
    // keep only the last ~14 days to stay tiny
    const days = Object.keys(next).sort().slice(-14)
    const trimmed = {}
    for (const d of days) trimmed[d] = next[d]
    setMap(trimmed)
    storage.setWater(trimmed)
  }

  const pct = Math.min(100, Math.round((glasses / GOAL) * 100))

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
          <Droplet size={18} className="text-blue-500" />
        </span>
        <h2 className="text-base font-semibold text-ink">Water intake</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">Aim for about {GOAL} glasses today. Your doctor may advise a different amount.</p>

      <div className="flex items-center justify-center gap-5">
        <button onClick={() => set(glasses - 1)} aria-label="Remove a glass" disabled={glasses === 0} className="w-11 h-11 rounded-full border border-line text-ink-muted flex items-center justify-center hover:bg-canvas disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <Minus size={18} />
        </button>
        <div className="text-center">
          <p className="text-4xl font-bold text-blue-500 tabular-nums">{glasses}</p>
          <p className="text-xs text-ink-faint">of {GOAL} glasses</p>
        </div>
        <button onClick={() => set(glasses + 1)} aria-label="Add a glass" className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          <Plus size={18} />
        </button>
      </div>

      {/* Glass row */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: GOAL }).map((_, i) => (
          <Droplet key={i} size={20} className={i < glasses ? 'text-blue-500' : 'text-blue-100'} fill={i < glasses ? '#3B82F6' : 'none'} />
        ))}
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-canvas overflow-hidden">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      {glasses >= GOAL && <p className="mt-2 text-center text-sm font-medium text-blue-600">Well done — you reached your goal today! 💧</p>}
    </div>
  )
}

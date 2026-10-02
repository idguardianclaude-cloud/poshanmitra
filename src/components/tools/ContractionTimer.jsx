import { useEffect, useState } from 'react'
import { Timer, Play, Square, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button.jsx'
import { storage } from '../../lib/storage.js'

// Contraction timer. Press start when a contraction begins and stop when it ends;
// it records each one's length and the gap since the last. General "5-1-1" guidance
// is shown (≈5 min apart, ≈1 min long, for ≈1 hour → time to head in) but the final
// word is always her doctor/hospital — this is a guide, not medical instruction.
function mmss(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function ContractionTimer() {
  const [list, setList] = useState(() => storage.getContractions())
  const [active, setActive] = useState(false)
  const [startedAt, setStartedAt] = useState(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [active])

  function persist(next) {
    setList(next)
    storage.setContractions(next)
  }
  function startContraction() {
    setActive(true)
    setStartedAt(Date.now())
    setNow(Date.now())
  }
  function stopContraction() {
    const end = Date.now()
    const prev = list[0]
    const entry = {
      id: `ct-${end}`,
      start: startedAt,
      duration: end - startedAt,
      interval: prev?.start ? startedAt - prev.start : null, // gap since previous start
    }
    persist([entry, ...list].slice(0, 50))
    setActive(false)
    setStartedAt(null)
  }

  // Pattern over the last hour → gentle "consider heading in" prompt.
  const hourAgo = Date.now() - 60 * 60 * 1000
  const recent = list.filter((c) => c.start >= hourAgo)
  const withGap = recent.filter((c) => c.interval != null)
  const avgGap = withGap.length ? withGap.reduce((a, c) => a + c.interval, 0) / withGap.length : null
  const avgDur = recent.length ? recent.reduce((a, c) => a + c.duration, 0) / recent.length : null
  const regularClose =
    recent.length >= 6 && avgGap != null && avgGap <= 5.5 * 60 * 1000 && avgDur != null && avgDur >= 45 * 1000

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EEF0FF' }}>
          <Timer size={18} className="text-indigo-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Contraction timer</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">Start when a contraction begins, stop when it ends. We'll track how long and how far apart.</p>

      <div className="text-center">
        {!active ? (
          <Button onClick={startContraction} className="w-full"><Play size={16} /> Start a contraction</Button>
        ) : (
          <button onClick={stopContraction} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emergency text-white px-4 py-3 text-base font-semibold hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
            <Square size={18} /> Stop · {mmss(now - startedAt)}
          </button>
        )}
      </div>

      {/* Summary (last hour) */}
      {recent.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Last hour" value={recent.length} />
          <Stat label="Avg length" value={avgDur ? mmss(avgDur) : '—'} />
          <Stat label="Avg apart" value={avgGap ? mmss(avgGap) : '—'} />
        </div>
      )}

      {regularClose && (
        <p className="mt-3 text-sm font-medium text-ink bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          Your contractions look regular and close together. It may be time to head in — call your hospital or doctor now.
        </p>
      )}

      <p className="mt-4 text-[11px] text-ink-faint">
        General guide (the “5-1-1” pattern): contractions about 5 minutes apart, each lasting about 1 minute, for 1 hour. Always follow your doctor's advice on when to go in — and go sooner if your water breaks, you bleed, or you're worried.
      </p>

      {list.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-ink-muted">Recent contractions</p>
            <button onClick={() => persist([])} className="text-[11px] text-ink-faint hover:text-red-600">Clear all</button>
          </div>
          <ul className="space-y-1.5">
            {list.slice(0, 8).map((c, i) => (
              <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-ink">Lasted {mmss(c.duration)}{c.interval != null && <span className="text-ink-faint"> · {mmss(c.interval)} apart</span>}</span>
                <span className="flex items-center gap-2 text-xs text-ink-faint">
                  {new Date(c.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <button onClick={() => persist(list.filter((x) => x.id !== c.id))} aria-label="Remove" className="p-1 rounded text-ink-faint hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-canvas border border-line py-2">
      <p className="text-lg font-bold text-indigo-600 tabular-nums">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  )
}

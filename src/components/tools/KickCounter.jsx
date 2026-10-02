import { useEffect, useState } from 'react'
import { Baby, Play, RotateCcw, Check, Trash2, Hand } from 'lucide-react'
import { Button } from '../ui/Button.jsx'
import { storage } from '../../lib/storage.js'
import { formatIN } from '../../lib/dates.js'

// Fetal-movement (kick) counter. General guidance only: many clinicians suggest
// noting ~10 movements over up to 2 hours once a day in the third trimester.
// This is NOT a diagnosis — if movements feel much fewer than usual, she should
// contact her doctor. That nudge is always shown.
const GOAL = 10

function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  return `${m}m ${String(s % 60).padStart(2, '0')}s`
}

export function KickCounter({ lang = 'en' }) {
  const [sessions, setSessions] = useState(() => storage.getKicks())
  const [active, setActive] = useState(false)
  const [count, setCount] = useState(0)
  const [startTs, setStartTs] = useState(null)
  const [lastTs, setLastTs] = useState(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [active])

  function persist(next) {
    setSessions(next)
    storage.setKicks(next)
  }
  function start() {
    setActive(true)
    setCount(0)
    setStartTs(Date.now())
    setLastTs(null)
    setNow(Date.now())
  }
  function kick() {
    setCount((c) => c + 1)
    setLastTs(Date.now())
  }
  function save() {
    if (count > 0 && startTs) {
      const entry = {
        id: `k-${Date.now()}`,
        date: new Date().toISOString(),
        count,
        durationMs: Date.now() - startTs,
      }
      persist([entry, ...sessions].slice(0, 30))
    }
    setActive(false)
    setCount(0)
    setStartTs(null)
    setLastTs(null)
  }

  const elapsed = startTs ? now - startTs : 0
  const sinceLast = lastTs ? now - lastTs : 0
  const reached = count >= GOAL

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FDF2F8' }}>
          <Baby size={18} className="text-pink-500" />
        </span>
        <h2 className="text-base font-semibold text-ink">Kick counter</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">Note your baby's movements — aim for about {GOAL} in up to 2 hours, once a day.</p>

      {!active ? (
        <Button onClick={start} className="w-full"><Play size={16} /> Start counting</Button>
      ) : (
        <div className="text-center">
          <button
            onClick={kick}
            className="group relative mx-auto flex flex-col items-center justify-center w-40 h-40 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
          >
            <Hand size={26} className="mb-1 opacity-90" />
            <span className="text-4xl font-bold tabular-nums">{count}</span>
            <span className="text-[11px] text-indigo-100">of {GOAL} · tap on a movement</span>
          </button>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-ink-muted">
            <span>Elapsed {fmt(elapsed)}</span>
            {lastTs && <span>Last {fmt(sinceLast)} ago</span>}
          </div>
          {reached && (
            <p className="mt-3 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">
              Lovely — you felt {GOAL} movements! 🎉
            </p>
          )}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button onClick={save}><Check size={16} /> Save session</Button>
            <Button variant="ghost" onClick={() => { setCount(0); setStartTs(Date.now()); setLastTs(null) }}><RotateCcw size={15} /> Reset</Button>
          </div>
        </div>
      )}

      {/* Always-on safety nudge */}
      <p className="mt-4 text-[11px] text-ink-faint">
        If your baby's movements feel much fewer or slower than usual, don't wait — contact your doctor or go to the hospital. This counter is a guide, not a diagnosis.
      </p>

      {sessions.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="text-xs font-semibold text-ink-muted mb-2">Recent sessions</p>
          <ul className="space-y-1.5">
            {sessions.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-ink">{s.count} movements <span className="text-ink-faint">· {fmt(s.durationMs)}</span></span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-ink-faint">{formatIN(s.date.slice(0, 10), lang)}</span>
                  <button onClick={() => persist(sessions.filter((x) => x.id !== s.id))} aria-label="Remove" className="p-1 rounded text-ink-faint hover:text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

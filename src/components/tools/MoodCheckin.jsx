import { useMemo, useState } from 'react'
import { Smile, Phone } from 'lucide-react'
import { storage } from '../../lib/storage.js'
import { todayISO } from '../../lib/reports.js'
import { formatIN } from '../../lib/dates.js'

// Daily mood check-in. This is a WELLBEING habit, NOT a screening or a diagnosis
// (SAFETY.md §3). We never score, label, or infer a condition like "depression"
// from these taps. When she marks a low day we respond with warmth and a real,
// free helpline — pointing her toward support, never away from it. One entry per
// day (re-tapping updates today). Mood emotions are deliberately simple so they
// work across literacy levels and languages.
const MOODS = [
  { v: 1, emoji: '😢', label: 'Very low' },
  { v: 2, emoji: '😕', label: 'Low' },
  { v: 3, emoji: '😐', label: 'Okay' },
  { v: 4, emoji: '🙂', label: 'Good' },
  { v: 5, emoji: '😄', label: 'Great' },
]

// KIRAN is the Government of India's free, 24×7 mental-health helpline (toll-free,
// multiple languages). A real, safe place to talk — not a claim that anything is wrong.
const HELPLINE = { name: 'KIRAN mental-health helpline', number: '1800-599-0019' }

export function MoodCheckin() {
  const today = todayISO()
  const [list, setList] = useState(() => storage.getMoods())
  const [note, setNote] = useState('')

  const todayEntry = useMemo(() => list.find((m) => m.date === today) || null, [list, today])
  const recent = useMemo(
    () => list.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7),
    [list]
  )

  function pick(v) {
    const others = list.filter((m) => m.date !== today)
    const next = [...others, { date: today, mood: v, note: note.trim().slice(0, 140) }]
    setList(next)
    storage.setMoods(next)
  }
  function saveNote(text) {
    setNote(text)
    if (todayEntry) {
      const next = list.map((m) => (m.date === today ? { ...m, note: text.trim().slice(0, 140) } : m))
      setList(next)
      storage.setMoods(next)
    }
  }

  const low = todayEntry && todayEntry.mood <= 2

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FDF4FF' }}>
          <Smile size={18} className="text-fuchsia-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">How are you feeling?</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">A quick check-in for your own wellbeing. There are no wrong answers.</p>

      <div className="flex items-center justify-between gap-1">
        {MOODS.map((m) => {
          const active = todayEntry?.mood === m.v
          return (
            <button
              key={m.v}
              onClick={() => pick(m.v)}
              aria-label={m.label}
              aria-pressed={active}
              className={`flex-1 flex flex-col items-center gap-1 rounded-xl py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
                active ? 'bg-fuchsia-50 ring-1 ring-fuchsia-200 scale-105' : 'hover:bg-canvas'
              }`}
            >
              <span className={`text-2xl transition-transform ${active ? '' : 'grayscale opacity-70'}`}>{m.emoji}</span>
              <span className={`text-[10px] ${active ? 'font-semibold text-fuchsia-700' : 'text-ink-faint'}`}>{m.label}</span>
            </button>
          )
        })}
      </div>

      {todayEntry && (
        <div className="mt-4">
          <textarea
            rows={2}
            value={note || todayEntry.note || ''}
            onChange={(e) => saveNote(e.target.value)}
            maxLength={140}
            placeholder="Anything on your mind today? (optional)"
            className="w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-300 resize-none"
          />
        </div>
      )}

      {low && (
        <div className="mt-3 rounded-xl bg-fuchsia-50 border border-fuchsia-100 px-4 py-3">
          <p className="text-sm text-ink">
            It's okay to have hard days — you're not alone. Low mood is common in pregnancy. Please talk to someone you
            trust, and if it helps, your doctor can support you too.
          </p>
          <a
            href={`tel:${HELPLINE.number.replace(/[^0-9]/g, '')}`}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 text-white px-3 py-2 text-sm font-medium hover:brightness-95"
          >
            <Phone size={15} /> Call {HELPLINE.name} · {HELPLINE.number}
          </a>
          <p className="mt-1.5 text-[11px] text-ink-faint">Free · 24×7 · many languages. If you ever feel unsafe, call 112 right away.</p>
        </div>
      )}

      {recent.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] text-ink-faint mb-1.5">Recent days</p>
          <div className="flex items-end gap-2">
            {recent.slice().reverse().map((m) => {
              const mood = MOODS.find((x) => x.v === m.mood)
              return (
                <div key={m.date} className="flex flex-col items-center gap-1" title={`${formatIN(m.date)} · ${mood?.label}`}>
                  <span className="text-lg">{mood?.emoji}</span>
                  <span className="text-[9px] text-ink-faint">{formatIN(m.date).split(' ').slice(0, 2).join(' ')}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] text-ink-faint">This check-in is for you alone. It is not a medical test or a diagnosis.</p>
    </div>
  )
}

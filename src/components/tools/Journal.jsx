import { useMemo, useState } from 'react'
import { BookHeart, Check } from 'lucide-react'
import { storage } from '../../lib/storage.js'
import { todayISO } from '../../lib/reports.js'
import { formatIN } from '../../lib/dates.js'

// A tiny, private daily journal — one gentle line a day about how she's feeling or
// something she's grateful for. Purely for her wellbeing; it lives on her device and
// goes nowhere. A small, kind ritual, not a medical tool.
const PROMPTS = [
  'One thing I’m grateful for today…',
  'How am I feeling right now?',
  'A little hope for my baby…',
  'Something kind I did for myself today…',
]

export function Journal() {
  const today = todayISO()
  const [list, setList] = useState(() => storage.getJournal())
  const todayEntry = useMemo(() => list.find((e) => e.date === today), [list, today])
  const [text, setText] = useState(todayEntry?.text || '')
  const [saved, setSaved] = useState(false)
  const prompt = useMemo(() => PROMPTS[new Date().getDate() % PROMPTS.length], [])

  function save() {
    const clean = text.trim().slice(0, 300)
    const others = list.filter((e) => e.date !== today)
    const next = clean ? [...others, { date: today, text: clean }] : others
    next.sort((a, b) => (a.date < b.date ? 1 : -1))
    setList(next)
    storage.setJournal(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const recent = list.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5)

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FDF2F8' }}>
          <BookHeart size={18} className="text-pink-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">My journal</h2>
        {saved && <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600 font-medium"><Check size={13} /> Saved</span>}
      </div>
      <p className="text-xs text-ink-muted mb-3">{prompt}</p>

      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={300}
        placeholder="Write a few words for yourself…"
        className="w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-ink-faint">{text.length}/300</span>
        <button onClick={save} className="rounded-xl bg-pink-600 text-white px-4 py-1.5 text-sm font-medium hover:brightness-95">
          {todayEntry ? 'Update' : 'Save'}
        </button>
      </div>

      {recent.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {recent.map((e) => (
            <li key={e.date} className="rounded-xl bg-canvas px-3 py-2">
              <p className="text-[11px] text-ink-faint">{formatIN(e.date)}</p>
              <p className="text-sm text-ink mt-0.5 whitespace-pre-wrap">{e.text}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-ink-faint">Private to you, saved only on this device.</p>
    </div>
  )
}

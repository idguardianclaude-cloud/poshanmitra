import { useMemo, useState } from 'react'
import { Luggage, Check, RotateCcw } from 'lucide-react'
import { storage } from '../../lib/storage.js'

// Hospital-bag checklist. A practical, reassuring packing list for labour and the
// first days — general preparation, not medical advice. Items are grouped for the
// mother, the baby, and documents (Indian context: MCP card, Aadhaar, ANC file).
// Checked state persists per item. No medicines are listed — the hospital provides
// and prescribes those.
const GROUPS = [
  {
    key: 'mother',
    title: 'For you (Mother)',
    items: [
      'Loose, comfortable nightwear (2–3 sets)',
      'Nursing bras & cotton underwear',
      'Sanitary pads (maternity size)',
      'Toiletries, towel & slippers',
      'Dupatta / shawl for warmth',
      'Water bottle & light snacks',
      'Phone charger (long cable)',
    ],
  },
  {
    key: 'baby',
    title: 'For your baby',
    items: [
      'Soft cotton clothes (4–5 sets)',
      'Soft blankets / swaddle cloth',
      'Cotton nappies or newborn diapers',
      'Baby cap, mittens & socks',
      'Soft wipes & cotton',
      'Baby towel',
    ],
  },
  {
    key: 'docs',
    title: 'Documents & essentials',
    items: [
      'Mother & Child Protection (MCP) card',
      'All ANC reports & scan files',
      'Aadhaar card & ID proof',
      'Hospital / insurance / scheme papers',
      'Some cash & your doctor’s number',
      'List of emergency contacts',
    ],
  },
]

// Stable id per item so checked state survives text-order changes within reason.
const idFor = (groupKey, i) => `${groupKey}-${i}`
const ALL_IDS = GROUPS.flatMap((g) => g.items.map((_, i) => idFor(g.key, i)))

export function HospitalBag() {
  const [checked, setChecked] = useState(() => storage.getChecklist())

  function persist(next) {
    setChecked(next)
    storage.setChecklist(next)
  }
  function toggle(id) {
    const next = { ...checked, [id]: !checked[id] }
    if (!next[id]) delete next[id]
    persist(next)
  }
  function reset() {
    persist({})
  }

  const done = useMemo(() => ALL_IDS.filter((id) => checked[id]).length, [checked])
  const total = ALL_IDS.length
  const pct = Math.round((done / total) * 100)

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FEFCE8' }}>
          <Luggage size={18} className="text-amber-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Hospital-bag checklist</h2>
        {done > 0 && (
          <button onClick={reset} className="ml-auto inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ink">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>
      <p className="text-xs text-ink-muted mb-3">Pack a little early — around month 8. Tick items as you go.</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-2 flex-1 rounded-full bg-canvas overflow-hidden">
          <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-semibold text-ink tabular-nums">{done}/{total}</span>
      </div>

      <div className="space-y-4">
        {GROUPS.map((g) => (
          <div key={g.key}>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">{g.title}</p>
            <ul className="space-y-1">
              {g.items.map((item, i) => {
                const id = idFor(g.key, i)
                const on = !!checked[id]
                return (
                  <li key={id}>
                    <button
                      onClick={() => toggle(id)}
                      aria-pressed={on}
                      className="w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${on ? 'bg-amber-500 border-amber-500 text-white' : 'border-line bg-white'}`}>
                        {on && <Check size={13} strokeWidth={3} />}
                      </span>
                      <span className={`text-sm ${on ? 'text-ink-faint line-through' : 'text-ink'}`}>{item}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {done === total && (
        <p className="mt-4 text-center text-sm font-medium text-amber-600">Your bag is ready — well prepared! 🎒</p>
      )}
      <p className="mt-3 text-[11px] text-ink-faint">A general packing guide. Your hospital will provide and prescribe any medicines.</p>
    </div>
  )
}

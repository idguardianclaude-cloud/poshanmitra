import { useMemo, useState } from 'react'
import { HeartHandshake, Check, AlertTriangle, Phone, RotateCcw } from 'lucide-react'
import { storage } from '../../lib/storage.js'
import { POSTPARTUM, POSTPARTUM_DANGER } from '../../data/newborn.js'

// Postpartum recovery checklist for the mother — gentle, tickable reminders for her
// own healing, plus the warning signs that mean "get help". General self-care, never
// a diagnosis or a medicine. Her recovery matters as much as the baby's.
const idFor = (g, i) => `${g}-${i}`
const ALL = POSTPARTUM.flatMap((g) => g.items.map((_, i) => idFor(g.key, i)))

export function PostpartumChecklist() {
  const [checked, setChecked] = useState(() => storage.getPostpartum())

  function persist(next) {
    setChecked(next)
    storage.setPostpartum(next)
  }
  function toggle(id) {
    const next = { ...checked, [id]: !checked[id] }
    if (!next[id]) delete next[id]
    persist(next)
  }
  const done = useMemo(() => ALL.filter((id) => checked[id]).length, [checked])
  const pct = Math.round((done / ALL.length) * 100)

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ECFDF5' }}>
          <HeartHandshake size={18} className="text-emerald-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">After-birth care (for you)</h2>
        {done > 0 && (
          <button onClick={() => persist({})} className="ml-auto inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ink">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>
      <p className="text-xs text-ink-muted mb-3">Your recovery matters too. Gentle reminders for the weeks after birth.</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-2 flex-1 rounded-full bg-canvas overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-semibold text-ink tabular-nums">{done}/{ALL.length}</span>
      </div>

      <div className="space-y-4">
        {POSTPARTUM.map((g) => (
          <div key={g.key}>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">{g.title}</p>
            <ul className="space-y-1">
              {g.items.map((item, i) => {
                const id = idFor(g.key, i)
                const on = !!checked[id]
                return (
                  <li key={id}>
                    <button onClick={() => toggle(id)} aria-pressed={on} className="w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-canvas">
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-line bg-white'}`}>
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

      <div className="mt-4 rounded-xl border border-red-100 bg-red-50/70 p-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <p className="text-sm font-semibold text-red-700">See a doctor urgently if you have:</p>
        </div>
        <ul className="mt-1.5 ml-1 space-y-0.5">
          {POSTPARTUM_DANGER.map((d) => (
            <li key={d} className="text-xs text-ink-muted flex gap-1.5"><span className="text-red-500">•</span>{d}</li>
          ))}
        </ul>
        <a href="tel:108" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-red-600 text-white px-3 py-1.5 text-xs font-semibold hover:brightness-95">
          <Phone size={13} /> Call 108
        </a>
      </div>
      <p className="mt-3 text-[11px] text-ink-faint">General self-care, not a diagnosis. If something worries you, contact your doctor.</p>
    </div>
  )
}

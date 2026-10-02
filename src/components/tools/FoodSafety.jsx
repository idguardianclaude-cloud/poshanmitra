import { useMemo, useState } from 'react'
import { Apple, Search } from 'lucide-react'
import { FOODS, FOOD_STATUS } from '../../data/foodSafety.js'
import { SourceNote } from '../ui/SourceNote.jsx'

// Food-safety checker — a searchable quick reference for everyday foods. General
// information only; it says so plainly and always points to her doctor, because her
// own condition (diabetes, anaemia, allergies) changes what's right. No medicines.
const FILTERS = [
  { key: '', label: 'All' },
  { key: 'enjoy', label: 'Good' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'cook', label: 'Cook well' },
  { key: 'avoid', label: 'Avoid' },
]

export function FoodSafety() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return FOODS.filter((f) => {
      if (filter && f.status !== filter) return false
      if (needle && !f.name.toLowerCase().includes(needle) && !f.why.toLowerCase().includes(needle)) return false
      return true
    })
  }, [q, filter])

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ECFDF5' }}>
          <Apple size={18} className="text-emerald-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Is this food okay?</h2>
      </div>
      <p className="text-xs text-ink-muted mb-3">A quick guide to common foods in pregnancy. General info — your doctor’s advice comes first.</p>

      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a food, e.g. papaya"
          aria-label="Search a food"
          className="w-full rounded-xl border border-line bg-canvas pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              filter === f.key ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-line text-ink-muted hover:bg-canvas'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {results.length === 0 ? (
          <li className="text-sm text-ink-muted text-center py-6">
            No match. You can ask Mitra about this food in the chat.
          </li>
        ) : (
          results.map((f) => {
            const s = FOOD_STATUS[f.status]
            return (
              <li key={f.name} className="rounded-xl border border-line px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{f.name}</p>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: s.tint, color: s.color }}>
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-muted">{f.why}</p>
              </li>
            )
          })
        )}
      </ul>

      <p className="mt-3 text-[11px] text-ink-faint">
        General guidance, not medical advice. If you have diabetes, anaemia, allergies or any concern, follow your doctor.
      </p>
      <SourceNote className="mt-1.5" sources={['MoHFW', 'ICMR', 'WHO']} />
    </div>
  )
}

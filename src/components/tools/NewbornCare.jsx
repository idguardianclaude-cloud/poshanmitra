import { useState } from 'react'
import { Baby, ChevronDown, AlertTriangle, Phone, Check } from 'lucide-react'
import { NEWBORN_CARE, NEWBORN_DANGER } from '../../data/newborn.js'
import { SourceNote } from '../ui/SourceNote.jsx'

// Newborn care basics for the first weeks + newborn danger signs. General care
// education (MoHFW/WHO), never a diagnosis or a medicine. Danger signs sit up top
// with a one-tap 108; care topics are a calm accordion.
export function NewbornCare() {
  const [open, setOpen] = useState(NEWBORN_CARE[0].title)

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FFF1F2' }}>
          <Baby size={18} className="text-rose-500" />
        </span>
        <h2 className="text-base font-semibold text-ink">Caring for your newborn</h2>
      </div>
      <p className="text-xs text-ink-muted mb-3">Simple basics for the first weeks. General guidance — your ANM/doctor guides your baby’s care.</p>

      <div className="rounded-xl border border-red-100 bg-red-50/70 p-3 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <p className="text-sm font-semibold text-red-700">Take baby to hospital now if:</p>
        </div>
        <ul className="mt-1.5 ml-1 space-y-0.5">
          {NEWBORN_DANGER.map((d) => (
            <li key={d} className="text-xs text-ink-muted flex gap-1.5"><span className="text-red-500">•</span>{d}</li>
          ))}
        </ul>
        <a href="tel:108" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-red-600 text-white px-3 py-1.5 text-xs font-semibold hover:brightness-95">
          <Phone size={13} /> Call 108
        </a>
      </div>

      <ul className="space-y-2">
        {NEWBORN_CARE.map((c) => {
          const isOpen = open === c.title
          return (
            <li key={c.title} className="rounded-xl border border-line overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : c.title)} aria-expanded={isOpen} className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-canvas">
                <span className="text-lg" aria-hidden>{c.emoji}</span>
                <span className="flex-1 text-sm font-medium text-ink">{c.title}</span>
                <ChevronDown size={16} className={`text-ink-faint transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <ul className="px-3 pb-3 space-y-1">
                  {c.tips.map((tip) => (
                    <li key={tip} className="text-xs text-ink-muted flex gap-1.5"><Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />{tip}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] text-ink-faint">General newborn-care information, not a diagnosis. Always follow your ANM/doctor.</p>
      <SourceNote className="mt-1.5" sources={['MoHFW', 'WHO']} />
    </div>
  )
}

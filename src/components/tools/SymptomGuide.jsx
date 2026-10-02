import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, ChevronDown, AlertTriangle, Check, Phone } from 'lucide-react'
import { SYMPTOMS, DANGER_SIGNS } from '../../data/symptoms.js'
import { SourceNote } from '../ui/SourceNote.jsx'

// Common discomforts & when to seek help. SAFETY-SENSITIVE: general comfort tips
// plus clear escalation — never a diagnosis, never a medicine. The emergency danger
// signs sit at the top with a one-tap 108 call, and each symptom spells out when to
// see a doctor. Collapsed by default so it stays calm, not alarming.
export function SymptomGuide() {
  const [open, setOpen] = useState(null)

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
          <Stethoscope size={18} className="text-indigo-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Common discomforts & when to seek help</h2>
      </div>
      <p className="text-xs text-ink-muted mb-3">Simple comfort tips for everyday pregnancy niggles. Not a diagnosis — your doctor always knows best.</p>

      {/* Danger signs — always visible, up top */}
      <div className="rounded-xl border border-red-100 bg-red-50/70 p-3 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <p className="text-sm font-semibold text-red-700">Don’t wait — get help now if you have:</p>
        </div>
        <ul className="mt-1.5 ml-1 space-y-0.5">
          {DANGER_SIGNS.map((d) => (
            <li key={d} className="text-xs text-ink-muted flex gap-1.5"><span className="text-red-500">•</span>{d}</li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-2">
          <a href="tel:108" className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 text-white px-3 py-1.5 text-xs font-semibold hover:brightness-95">
            <Phone size={13} /> Call 108
          </a>
          <Link to="/tools" className="inline-flex items-center gap-1 rounded-lg border border-red-200 text-red-700 px-3 py-1.5 text-xs font-medium hover:bg-red-50">
            Emergency tools
          </Link>
        </div>
      </div>

      {/* Symptom accordion */}
      <ul className="space-y-2">
        {SYMPTOMS.map((s) => {
          const isOpen = open === s.key
          return (
            <li key={s.key} className="rounded-xl border border-line overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : s.key)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-canvas"
              >
                <span className="text-lg" aria-hidden>{s.emoji}</span>
                <span className="flex-1 text-sm font-medium text-ink">{s.name}</span>
                <ChevronDown size={16} className={`text-ink-faint transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-3 pb-3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 mb-1">Comfort tips</p>
                    <ul className="space-y-1">
                      {s.selfCare.map((c) => (
                        <li key={c} className="text-xs text-ink-muted flex gap-1.5"><Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-2.5">
                    <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> See your doctor if
                    </p>
                    <ul className="space-y-1">
                      {s.seekCare.map((c) => (
                        <li key={c} className="text-xs text-ink-muted flex gap-1.5"><span className="text-amber-500">•</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <Link to={`/chat?q=${encodeURIComponent('I have ' + s.name.toLowerCase() + ' in pregnancy. What can help?')}`} className="inline-block text-xs font-medium text-indigo-600 hover:underline">
                    Ask Mitra about this →
                  </Link>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-[11px] text-ink-faint">General comfort guidance, not a diagnosis or treatment. When in doubt, always check with your doctor.</p>
      <SourceNote className="mt-1.5" sources={['MoHFW', 'WHO']} />
    </div>
  )
}

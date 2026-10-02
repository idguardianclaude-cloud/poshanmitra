import { useMemo, useState } from 'react'
import { ClipboardList, Share2, Printer, Check } from 'lucide-react'
import { storage } from '../../lib/storage.js'
import { shareOnWhatsApp } from '../../lib/whatsapp.js'

// Birth-plan builder. These are her PREFERENCES and wishes for labour and birth —
// not medical instructions. Plans can and do change for safety on the day, and
// everything here is meant to be discussed with her doctor and birth team. We only
// capture choices and help her share/print them; we never advise a clinical option
// (e.g. we don't recommend for/against any pain relief). SAFETY.md §3/§4.
const QUESTIONS = [
  {
    key: 'companion',
    q: 'Who would you like with you during labour?',
    options: ['My husband', 'My mother', 'A sister / friend', 'Not sure yet'],
  },
  {
    key: 'position',
    q: 'How would you prefer to move during labour?',
    options: ['Free to walk & change position', 'Mostly on the bed', 'I will decide on the day'],
  },
  {
    key: 'painRelief',
    q: 'Your openness to pain relief (your doctor will guide what is safe)',
    options: ['Prefer natural / breathing first', 'Open to pain relief if needed', 'Would like to discuss options', 'Not sure yet'],
  },
  {
    key: 'feeding',
    q: 'How do you plan to feed your baby?',
    options: ['Breastfeeding', 'Formula', 'Both', 'Will decide later'],
  },
  {
    key: 'skinToSkin',
    q: 'Skin-to-skin contact right after birth?',
    options: ['Yes, if possible', 'No preference', 'Will decide on the day'],
  },
  {
    key: 'language',
    q: 'Language you are most comfortable with for the staff',
    options: ['Hindi', 'Marathi', 'English', 'Other'],
  },
  {
    key: 'environment',
    q: 'Anything that helps you feel calm?',
    options: ['Quiet & dim lights', 'Music / prayer', 'Minimal people in the room', 'No special preference'],
  },
]

export function BirthPlan() {
  const [plan, setPlan] = useState(() => storage.getBirthPlan())
  const [saved, setSaved] = useState(false)

  function choose(key, value) {
    const next = { ...plan, [key]: value }
    setPlan(next)
    storage.setBirthPlan(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const answered = useMemo(() => QUESTIONS.filter((q) => plan[q.key]).length, [plan])

  function asText() {
    const lines = QUESTIONS.filter((q) => plan[q.key]).map((q) => `• ${q.q}\n   → ${plan[q.key]}`)
    return `My birth-plan wishes (PoshanMitra)\n\n${lines.join('\n')}\n\nNote: these are my preferences to discuss with my doctor. Plans may change for safety.`
  }
  function share() {
    if (!answered) return
    shareOnWhatsApp(asText())
  }
  function print() {
    if (!answered) return
    const w = window.open('', '_blank')
    if (!w) return
    const body = QUESTIONS.filter((q) => plan[q.key])
      .map((q) => `<li><strong>${q.q}</strong><br/>${plan[q.key]}</li>`)
      .join('')
    w.document.write(
      `<html><head><title>My Birth Plan</title><style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 24px;color:#1f2937;line-height:1.6}h1{color:#4F46E5}li{margin-bottom:14px}small{color:#6b7280}</style></head><body><h1>My Birth Plan</h1><ul>${body}</ul><p><small>These are my preferences to discuss with my doctor and birth team. Plans may change for safety on the day. — PoshanMitra</small></p></body></html>`
    )
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
          <ClipboardList size={18} className="text-indigo-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Birth-plan builder</h2>
        {saved && <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600 font-medium"><Check size={13} /> Saved</span>}
      </div>
      <p className="text-xs text-ink-muted mb-4">
        Note your wishes for labour and birth, then share them with your doctor. These are preferences — your care team may
        adjust them for your and your baby's safety.
      </p>

      <div className="space-y-4">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="text-sm font-medium text-ink mb-1.5">{q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const active = plan[q.key] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => choose(q.key, opt)}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink-muted hover:bg-canvas'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-stretch gap-2">
        <button
          onClick={share}
          disabled={!answered}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-medium hover:brightness-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Share2 size={15} /> Share on WhatsApp
        </button>
        <button
          onClick={print}
          disabled={!answered}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line text-ink px-4 py-2.5 text-sm font-medium hover:bg-canvas disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Printer size={15} /> Print / Save PDF
        </button>
      </div>
      <p className="mt-3 text-[11px] text-ink-faint">{answered} of {QUESTIONS.length} noted. Always discuss your plan with your doctor — it may change for safety.</p>
    </div>
  )
}

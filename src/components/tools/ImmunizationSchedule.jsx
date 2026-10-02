import { useMemo, useState } from 'react'
import { Syringe, Check, BellPlus, Baby } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { storage } from '../../lib/storage.js'
import { makeReminder, toISODate } from '../../lib/reminders.js'
import { formatIN } from '../../lib/dates.js'
import { IMMUNIZATION } from '../../data/immunization.js'
import { SourceNote } from '../ui/SourceNote.jsx'

const MS_DAY = 86400000

// Baby immunization schedule (India NIS). Before birth it shows the plan with
// "age" labels; once the mother enters the baby's birth date we compute real dates
// and offer a reminder per milestone. General info confirmed by her ANM/doctor —
// we never advise for/against a vaccine. Birth date is saved on her profile so the
// baby growth tracker can reuse it.
export function ImmunizationSchedule() {
  const { profile, updateProfile, lang } = useProfile()
  const dob = profile?.babyDob || ''
  const [reminders, setReminders] = useState(() => storage.getReminders())
  const [draft, setDraft] = useState(dob)

  const schedule = useMemo(() => {
    if (!dob) return null
    const birth = new Date(dob)
    if (Number.isNaN(birth.getTime())) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return IMMUNIZATION.map((m) => {
      const date = new Date(birth.getTime() + m.offsetDays * MS_DAY)
      const iso = toISODate(date)
      return { ...m, iso, past: date < today }
    })
  }, [dob])

  function saveDob() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft)) return
    updateProfile({ babyDob: draft })
  }
  function hasReminderFor(iso) {
    return reminders.some((r) => r.kind === 'custom' && r.date === iso && (r.title || '').startsWith('Vaccination'))
  }
  function remind(m) {
    if (hasReminderFor(m.iso)) return
    const reminder = makeReminder({
      kind: 'custom',
      title: `Vaccination: ${m.label}`,
      time: '09:00',
      repeat: 'once',
      date: m.iso,
    })
    if (!reminder) return
    const next = [...reminders, reminder]
    setReminders(next)
    storage.setReminders(next)
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
          <Syringe size={18} className="text-blue-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Baby vaccination schedule</h2>
      </div>
      <p className="text-xs text-ink-muted mb-3">
        India’s routine immunizations, free at government centres. Your ANM or doctor confirms the exact vaccines and timing.
      </p>

      {/* Birth-date entry (optional until baby arrives) */}
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-canvas border border-line px-3 py-2">
        <Baby size={16} className="text-blue-600 shrink-0" />
        <label className="text-xs text-ink-muted whitespace-nowrap">Baby’s birth date</label>
        <input
          type="date"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="ml-auto rounded-lg border border-line bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {draft && draft !== dob && (
          <button onClick={saveDob} className="rounded-lg bg-blue-600 text-white px-2.5 py-1 text-xs font-medium hover:brightness-95">
            Save
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {(schedule || IMMUNIZATION.map((m) => ({ ...m, iso: null, past: false }))).map((m) => {
          const set = m.iso && hasReminderFor(m.iso)
          return (
            <li key={m.key} className={`rounded-xl border border-line px-3 py-2.5 ${m.past ? 'bg-canvas' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${m.past ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {m.past ? <Check size={14} /> : <Syringe size={13} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{m.label}</p>
                  {m.iso && <p className="text-xs text-ink-faint">{formatIN(m.iso, lang)}</p>}
                </div>
                {m.iso && !m.past && (
                  <button
                    onClick={() => remind(m)}
                    disabled={set}
                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      set ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-600 text-white hover:brightness-95'
                    }`}
                  >
                    {set ? <><Check size={13} /> Set</> : <><BellPlus size={13} /> Remind</>}
                  </button>
                )}
              </div>
              <div className="mt-1.5 ml-9 flex flex-wrap gap-1">
                {m.vaccines.map((v) => (
                  <span key={v} className="rounded-full bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5">{v}</span>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] text-ink-faint">
        General schedule, not medical advice. Some vaccines (like JE) are only given in certain districts — your health worker will guide you.
      </p>
      <SourceNote className="mt-1.5" sources={['India NIS', 'MoHFW']} />
    </div>
  )
}

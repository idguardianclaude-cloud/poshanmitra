import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Check, BellPlus, Circle } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { storage } from '../../lib/storage.js'
import { makeReminder, toISODate } from '../../lib/reminders.js'
import { formatIN } from '../../lib/dates.js'

// Antenatal check-up (ANC) scheduler. Computes the recommended visit windows from
// her due date and lets her set a one-tap reminder for each. These are the commonly
// recommended contacts (India MoHFW / WHO); her own doctor may advise more or fewer,
// and we say so. We never replace a clinical plan — we only help her remember to go.
const MS_DAY = 86400000
// Target gestational weeks for each recommended contact. Balanced 6-visit view.
const VISITS = [
  { n: 1, week: 12, when: 'First trimester', note: 'Registration, first scan, blood & urine tests.' },
  { n: 2, week: 20, when: 'Around the anomaly scan', note: 'Detailed scan to check baby’s growth.' },
  { n: 3, week: 28, when: 'Start of third trimester', note: 'Growth check, blood pressure, sugar.' },
  { n: 4, week: 32, when: 'Eighth month', note: 'Position check and wellbeing.' },
  { n: 5, week: 36, when: 'Ninth month begins', note: 'Getting ready for birth.' },
  { n: 6, week: 40, when: 'Around your due date', note: 'Final checks before delivery.' },
]

export function ANCVisits() {
  const { profile, lang } = useProfile()
  const dueDate = profile?.dueDate || null
  const [reminders, setReminders] = useState(() => storage.getReminders())

  // LMP = due date − 280 days; each visit date = LMP + week×7 days.
  const schedule = useMemo(() => {
    if (!dueDate) return null
    const due = new Date(dueDate)
    if (Number.isNaN(due.getTime())) return null
    const lmp = new Date(due.getTime() - 280 * MS_DAY)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return VISITS.map((v) => {
      const date = new Date(lmp.getTime() + v.week * 7 * MS_DAY)
      const iso = toISODate(date)
      return { ...v, iso, past: date < today }
    })
  }, [dueDate])

  function hasReminderFor(iso) {
    return reminders.some((r) => r.kind === 'anc' && r.date === iso)
  }
  function remind(v) {
    if (hasReminderFor(v.iso)) return
    const reminder = makeReminder({
      kind: 'anc',
      title: `ANC visit ${v.n} (around week ${v.week})`,
      time: '09:00',
      repeat: 'once',
      date: v.iso,
    })
    if (!reminder) return
    const next = [...reminders, reminder]
    setReminders(next)
    storage.setReminders(next)
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
          <CalendarCheck size={18} className="text-violet-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Check-up schedule</h2>
      </div>

      {!schedule ? (
        <>
          <p className="text-xs text-ink-muted mb-4">Add your due date to see your recommended check-up dates.</p>
          <Link to="/settings" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-4 py-2.5 text-sm font-medium hover:brightness-95">
            Add due date
          </Link>
        </>
      ) : (
        <>
          <p className="text-xs text-ink-muted mb-4">
            Recommended antenatal visits for your dates. Your doctor may advise more or fewer — this is a reminder, not a rule.
          </p>
          <ul className="space-y-2">
            {schedule.map((v) => {
              const set = hasReminderFor(v.iso)
              return (
                <li key={v.n} className={`rounded-xl border px-3 py-2.5 ${v.past ? 'border-line bg-canvas' : 'border-line'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${v.past ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'}`}>
                      {v.past ? <Check size={14} /> : v.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">
                        Visit {v.n} · <span className="text-ink-muted font-normal">week {v.week}</span>
                      </p>
                      <p className="text-xs text-ink-faint">{formatIN(v.iso, lang)} · {v.when}</p>
                    </div>
                    {!v.past && (
                      <button
                        onClick={() => remind(v)}
                        disabled={set}
                        className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                          set ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-600 text-white hover:brightness-95'
                        }`}
                      >
                        {set ? <><Check size={13} /> Reminder set</> : <><BellPlus size={13} /> Remind me</>}
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 ml-10 text-xs text-ink-muted">{v.note}</p>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-[11px] text-ink-faint">
            Reminders run on this device while the app is open. Manage them in Settings → Reminders.
          </p>
        </>
      )}
    </div>
  )
}

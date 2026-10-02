import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Sparkles } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { storage } from '../lib/storage.js'

// A gentle "complete your profile" meter. The more she fills in, the more the app can
// help her (accurate week-by-week, check-up dates, quick calls). Encouraging, never
// nagging — fully optional. Hidden once everything is done.
export function ProfileCompleteness() {
  const { profile } = useProfile()

  const items = useMemo(() => {
    const careTeam = profile?.careTeam || {}
    const hasCareTeam = ['asha', 'doctor', 'hospital'].some((k) => careTeam[k]?.name || careTeam[k]?.phone)
    const hasReport = (storage.getReports() || []).length > 0
    return [
      { key: 'name', label: 'Add your name', done: Boolean(profile?.name), to: '/settings' },
      { key: 'due', label: 'Add your due date', done: profile?.dueDate != null || profile?.weeks != null, to: '/settings' },
      { key: 'food', label: 'Set your food preference', done: Boolean(profile?.food), to: '/settings' },
      { key: 'care', label: 'Save your care team', done: hasCareTeam, to: '/settings' },
      { key: 'report', label: 'Note your first health reading', done: hasReport, to: '/reports' },
    ]
  }, [profile])

  const done = items.filter((i) => i.done).length
  const pct = Math.round((done / items.length) * 100)
  if (pct === 100) return null

  return (
    <section className="rounded-2xl border border-indigo-100 shadow-card p-5" style={{ backgroundColor: '#F5F3FF' }}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={18} className="text-indigo-600" />
        <h2 className="text-base font-semibold text-ink">Complete your profile</h2>
        <span className="ml-auto text-sm font-bold text-indigo-700 tabular-nums">{pct}%</span>
      </div>
      <p className="text-xs text-ink-muted mb-3">The more PoshanMitra knows, the better it can help you.</p>

      <div className="h-2 w-full rounded-full bg-white overflow-hidden mb-4">
        <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i.key}>
            {i.done ? (
              <span className="flex items-center gap-2 text-sm text-ink-faint">
                <CheckCircle2 size={16} className="text-emerald-500" /> <span className="line-through">{i.label}</span>
              </span>
            ) : (
              <Link to={i.to} className="flex items-center gap-2 text-sm text-ink hover:text-indigo-700">
                <Circle size={16} className="text-indigo-300" /> {i.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

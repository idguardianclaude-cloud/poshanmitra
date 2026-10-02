import { useMemo } from 'react'
import { Baby, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfile } from '../../context/ProfileContext.jsx'
import { babyForWeek } from '../../data/babyWeekly.js'

// "Your baby this week" — a warm, motivating glimpse of typical development with a
// familiar size comparison. General educational info, NOT a measurement of her own
// baby and NOT medical advice; growth varies for every pregnancy. Reads the week we
// already derived at onboarding (profile.weeks). If we don't know the week, we invite
// her to add her due date rather than guessing.
export function BabyThisWeek() {
  const { profile } = useProfile()
  const weeks = profile?.weeks
  const entry = useMemo(() => babyForWeek(weeks), [weeks])

  const hasWeek = weeks != null
  const pct = hasWeek ? Math.min(100, Math.round((weeks / 40) * 100)) : 0

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FFF1F2' }}>
          <Baby size={18} className="text-rose-500" />
        </span>
        <h2 className="text-base font-semibold text-ink">Your baby this week</h2>
      </div>

      {hasWeek ? (
        <>
          <p className="text-xs text-ink-muted mb-4">
            Around week {weeks} of your pregnancy. Every baby grows at its own pace — this is a general guide.
          </p>
          <div className="flex items-center gap-4 rounded-2xl bg-rose-50 border border-rose-100 p-4">
            <span className="text-4xl shrink-0" aria-hidden>{entry.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm text-ink">
                Your baby is about the size of <span className="font-semibold text-rose-600">{entry.size}</span>.
              </p>
              <p className="text-xs text-ink-muted mt-1">{entry.note}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-ink-faint mb-1">
              <span>Week {weeks}</span>
              <span>40 weeks</span>
            </div>
            <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
              <div className="h-full rounded-full bg-rose-400 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <Link
            to="/chat"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-canvas"
          >
            <MessageSquare size={15} /> Ask Mitra about this week
          </Link>
        </>
      ) : (
        <>
          <p className="text-xs text-ink-muted mb-4">Add your due date to see your baby’s week-by-week journey.</p>
          <Link to="/settings" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 text-white px-4 py-2.5 text-sm font-medium hover:brightness-95">
            Add due date
          </Link>
        </>
      )}

      <p className="mt-3 text-[11px] text-ink-faint">General information for a typical pregnancy — not a measurement of your baby or medical advice.</p>
    </div>
  )
}

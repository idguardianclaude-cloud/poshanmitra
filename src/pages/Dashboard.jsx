import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Baby,
  HeartPulse,
  ListChecks,
  CalendarCheck,
  Check,
  Circle,
  Salad,
  PlaySquare,
  Landmark,
  Megaphone,
  Building2,
  BarChart3,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { StatCard } from '../components/ui/StatCard.jsx'
import { IconTile } from '../components/ui/IconTile.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Chip } from '../components/ui/Chip.jsx'
import {
  todaysPlan,
  chatChips,
  recentVideo,
  nextCheckup,
  tipOfTheDay,
} from '../data/dashboard.js'
import { ordinalMonth, ordinalTrimester } from '../lib/pregnancy.js'
import { formatIN, nextCheckupDate } from '../lib/dates.js'
import { Illustration } from '../components/Illustration.jsx'
import { useT } from '../lib/i18n.js'
import { storage } from '../lib/storage.js'
import { upcoming, nextOccurrence } from '../lib/reminders.js'
import { Bell, Clock } from 'lucide-react'

const PLAN_KEY = 'poshanmitra_plan'
function loadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAN_KEY) || 'null')
    if (Array.isArray(saved)) {
      return todaysPlan.map((r) => ({ ...r, done: saved.includes(r.id) }))
    }
  } catch {
    /* ignore */
  }
  return todaysPlan
}
function savePlan(rows) {
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify(rows.filter((r) => r.done).map((r) => r.id)))
  } catch {
    /* ignore */
  }
}

function greetingKey() {
  const h = new Date().getHours()
  if (h < 12) return 'greetMorning'
  if (h < 17) return 'greetAfternoon'
  return 'greetEvening'
}

const QUICK = [
  { label: 'Diet Plan', icon: Salad, fill: '#ECFDF5', color: '#10B981', to: '/diet' },
  { label: 'Videos', icon: PlaySquare, fill: '#FDF2F8', color: '#EC4899', to: '/videos' },
  { label: 'Schemes', icon: Landmark, fill: '#FFFBEB', color: '#F59E0B', to: '/schemes' },
  { label: 'Campaigns', icon: Megaphone, fill: '#F5F3FF', color: '#8B5CF6', to: '/campaigns' },
  { label: 'Hospitals', icon: Building2, fill: '#EFF6FF', color: '#3B82F6', to: '/hospitals' },
  { label: 'Reports', icon: BarChart3, fill: '#F0FDFA', color: '#14B8A6', to: '/reports' },
]

export function Dashboard() {
  const { profile, lang } = useProfile()
  const t = useT()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(loadPlan)

  const name = profile?.name?.split(' ')[0] || 'Priya'
  // Only show pregnancy figures we actually derived (she may have skipped the due
  // date in onboarding) — never fabricate weeks/month.
  const hasPregData = profile?.month != null && profile?.weeks != null
  const month = profile?.month
  const trimester = profile?.trimester
  const weeks = profile?.weeks
  const days = profile?.days ?? 0
  const score = profile?.poshanScore ?? 78
  const doneCount = plan.filter((r) => r.done).length

  function toggle(id) {
    setPlan((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
      savePlan(next)
      return next
    })
  }

  return (
    <>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-ink leading-tight">
          {t(`dash.${greetingKey()}`)}, {name}! 👋
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{t('dash.sub')}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {hasPregData ? (
          <StatCard
            icon={Baby}
            fill="#FDF2F8"
            color="#EC4899"
            label={t('dash.pregnancyMonth')}
            value={t('dash.monthValue', { month: ordinalMonth(month, lang) })}
            sub={t('dash.trimesterSub', {
              trimester: ordinalTrimester(trimester, lang),
              weeks,
              days,
            })}
            progress={Math.round((weeks / 40) * 100)}
          />
        ) : (
          <button
            onClick={() => navigate('/settings')}
            className="rounded-2xl bg-white border border-dashed border-indigo-200 shadow-card p-5 text-left hover:bg-indigo-50/40 transition-colors"
          >
            <p className="text-[13px] font-medium text-ink-muted">{t('dash.pregnancyMonth')}</p>
            <p className="mt-1 text-base font-semibold text-indigo-600">{t('settings.addDueDate')}</p>
            <p className="mt-2 text-xs text-ink-muted">{t('settings.addDueDateSub')}</p>
          </button>
        )}
        <StatCard
          icon={HeartPulse}
          fill="#ECFDF5"
          color="#10B981"
          label={t('dash.poshanScore')}
          value={
            <>
              {score}
              <span className="text-lg text-ink-faint font-semibold">/100</span>
            </>
          }
          sub={t('dash.scoreSub')}
        />
        <StatCard
          icon={ListChecks}
          fill="#FFFBEB"
          color="#F59E0B"
          label={t('dash.tasks')}
          value={`${doneCount}/${plan.length}`}
          sub={t('dash.tasksSub', { remaining: plan.length - doneCount })}
        />
        <StatCard
          icon={CalendarCheck}
          fill="#F5F3FF"
          color="#8B5CF6"
          label={t('dash.nextCheckup')}
          value={formatIN(nextCheckupDate(), lang)}
          sub={`${nextCheckup.time} · ${nextCheckup.hospital}`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Today's Plan */}
          <section className="rounded-2xl bg-white border border-line shadow-card">
            <header className="flex items-center justify-between px-5 pt-5 pb-2">
              <h2 className="text-base font-semibold text-ink">{t('dash.todaysPlan')}</h2>
              <Link to="/checkup" className="text-sm text-indigo-600 hover:text-indigo-700">
                {t('common.viewAll')}
              </Link>
            </header>
            <ul className="px-5 pb-4">
              {plan.map((row, i) => (
                <li key={row.id}>
                  <button
                    onClick={() => toggle(row.id)}
                    className="w-full flex items-center gap-3 py-2.5 text-left group focus-visible:outline-none"
                    aria-pressed={row.done}
                  >
                    <span className="relative flex flex-col items-center">
                      {row.done ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check size={14} />
                        </span>
                      ) : (
                        <Circle size={24} className="text-ink-faint group-hover:text-indigo-400" />
                      )}
                      {i < plan.length - 1 && (
                        <span className="absolute top-6 w-px h-6 bg-line" aria-hidden="true" />
                      )}
                    </span>
                    <span className="flex-1">
                      <span className={`text-sm font-medium ${row.done ? 'text-ink-faint line-through' : 'text-ink'}`}>
                        {t(`dash.plan.${row.label}`)}
                      </span>
                      <span className="block text-xs text-ink-faint">{row.time}</span>
                    </span>
                    <span className={`text-xs font-medium ${row.done ? 'text-emerald-600' : 'text-ink-faint'}`}>
                      {row.done ? t('dash.completed') : t('dash.pending')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Chatbot preview */}
          <section className="rounded-2xl bg-white border border-line shadow-card p-5">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Heart size={20} fill="#EEF0FF" stroke="#EEF0FF" />
              </span>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-ink">{t('dash.chatTitle')}</h2>
                <p className="text-sm text-ink-muted mt-0.5">
                  {t('dash.chatGreeting', { name })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {chatChips.map((c) => (
                <Chip key={c} onClick={() => navigate(`/chat?q=${encodeURIComponent(t(`chat.chips.${c}`))}`)}>
                  {t(`chat.chips.${c}`)}
                </Chip>
              ))}
            </div>
            <Button className="mt-4" onClick={() => navigate('/chat')}>
              {t('dash.chatNow')} <ArrowRight size={16} />
            </Button>
          </section>

          {/* Quick Access */}
          <section className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-4">{t('dash.quickAccess')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-line p-4 hover:bg-canvas transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <IconTile icon={q.icon} fill={q.fill} color={q.color} size={44} />
                  <span className="text-[13px] font-medium text-ink">{t(`quick.${q.label}`)}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Videos */}
          <section className="rounded-2xl bg-white border border-line shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-ink">{t('dash.recentVideos')}</h2>
              <Link to="/videos" className="text-sm text-indigo-600 hover:text-indigo-700">
                {t('common.viewAll')}
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden border border-line">
              <div
                className="h-32 flex items-center justify-center"
                style={{ backgroundColor: recentVideo.thumbTint }}
              >
                <span className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                  <PlaySquare size={22} className="text-indigo-600" />
                </span>
              </div>
              <div className="p-3">
                <Badge tone="danger">{recentVideo.tag}</Badge>
                <p className="mt-2 text-sm font-medium text-ink">{recentVideo.title}</p>
                <Button as={Link} to="/videos" variant="secondary" size="sm" className="mt-3 w-full">
                  {t('dash.watchNow')}
                </Button>
              </div>
            </div>
          </section>

          {/* Upcoming reminders */}
          <RemindersCard />

          {/* Health Tip */}
          <HealthTip />
        </div>
      </div>
    </>
  )
}

function RemindersCard() {
  const t = useT()
  const { lang } = useProfile()
  const list = upcoming(storage.getReminders())

  return (
    <section className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-ink flex items-center gap-2">
          <Bell size={17} className="text-indigo-600" /> {t('reminders.upcoming')}
        </h2>
        <Link to="/settings" className="text-sm text-indigo-600 hover:text-indigo-700">
          {t('reminders.manage')}
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-ink-faint">{t('reminders.noneDash')}</p>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => {
            const next = nextOccurrence(r)
            return (
              <li key={r.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                <span className="w-8 h-8 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {r.title || t(`reminders.kind.${r.kind}`)}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {r.time} · {next ? formatIN(next, lang) : t(`reminders.repeat.${r.repeat}`)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function HealthTip() {
  const t = useT()
  const tip = tipOfTheDay()
  return (
    <section className="rounded-2xl border border-emerald-100 shadow-card p-5" style={{ backgroundColor: '#ECFDF5' }}>
      <div className="flex items-start gap-3">
        <Illustration name="water-glass" size={56} />
        <div>
          <h2 className="text-base font-semibold text-ink">{t('dash.healthTip')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{tip.text}</p>
        </div>
      </div>
    </section>
  )
}

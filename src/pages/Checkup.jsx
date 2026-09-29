import { Link } from 'react-router-dom'
import { Baby, Heart, CheckCircle2, Lightbulb, Briefcase, MessageSquare } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Illustration } from '../components/Illustration.jsx'
import { useT } from '../lib/i18n.js'
import { weeklyMilestones, hospitalBag, milestoneForWeek } from '../data/checkup.js'

export function Checkup() {
  const { profile } = useProfile()
  const t = useT()
  const week = profile?.weeks

  // No due date yet → gentle prompt to set it up.
  if (!week) {
    return (
      <>
        <PageHeader title={t('checkup.title')} subtitle={t('checkup.sub')} />
        <div className="rounded-2xl bg-white border border-line shadow-card">
          <div className="flex flex-col items-center text-center py-16 px-6">
            <Illustration name="pregnant-seated" size={110} />
            <p className="mt-4 text-sm text-ink-muted max-w-sm">{t('checkup.setup')}</p>
            <Button as={Link} to="/settings" className="mt-5">
              {t('settings.addDueDate')}
            </Button>
          </div>
        </div>
      </>
    )
  }

  const m = milestoneForWeek(week)
  const progress = Math.min(100, Math.round((week / 40) * 100))
  const isLate = week >= 33

  return (
    <>
      <PageHeader title={t('checkup.title')} subtitle={t('checkup.sub')} />

      {/* Current week hero */}
      <section className="rounded-2xl p-6 mb-6 text-white bg-gradient-to-br from-indigo-600 to-indigo-700">
        <p className="text-sm text-indigo-100">{t('checkup.weekLabel', { week })}</p>
        <div className="mt-2 flex items-center gap-3">
          <Baby size={26} />
          <p className="text-lg font-semibold">
            {t('checkup.babyIs')} <span className="font-bold">{m.size}</span>
          </p>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-white/20 overflow-hidden">
          <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          {/* Baby + You */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={Baby} tint="#FDF2F8" color="#EC4899" title={t('checkup.forBaby')} text={m.baby} />
            <InfoCard icon={Heart} tint="#EEF0FF" color="#4F46E5" title={t('checkup.forYou')} text={m.mom} />
          </div>

          {/* Tips */}
          <Card icon={Lightbulb} title={t('checkup.tips')}>
            <ul className="space-y-2">
              {m.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          {/* Hospital bag (late pregnancy) */}
          {isLate && (
            <Card icon={Briefcase} title={t('checkup.bag')}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {hospitalBag.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink">
                    <span className="w-4 h-4 rounded border border-line inline-block shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* This week's checklist + ask Mitra */}
        <aside className="space-y-6">
          <Card icon={CheckCircle2} title={t('checkup.thisWeek')}>
            <ul className="space-y-2.5">
              {m.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                  <CheckCircle2 size={17} className="text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div className="rounded-2xl border border-indigo-100 shadow-card p-5" style={{ backgroundColor: '#EEF0FF' }}>
            <p className="text-sm text-ink-muted">
              {t('checkup.forBaby')} · {t('checkup.weekLabel', { week })}
            </p>
            <Button
              as={Link}
              to={`/chat?q=${encodeURIComponent(`What should I expect in week ${week} of my pregnancy?`)}`}
              className="mt-3 w-full"
            >
              <MessageSquare size={16} /> {t('checkup.askMitra')}
            </Button>
          </div>
        </aside>
      </div>

      {/* Upcoming milestones timeline */}
      <section className="mt-8 rounded-2xl bg-white border border-line shadow-card p-5">
        <h2 className="text-base font-semibold text-ink mb-4">{t('checkup.title')}</h2>
        <ol className="space-y-3">
          {weeklyMilestones.map((entry) => {
            const active = entry.from === m.from
            const done = week >= entry.from
            return (
              <li key={entry.from} className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : done
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-canvas text-ink-faint'
                  }`}
                >
                  {entry.from}
                </span>
                <span className={`text-sm ${active ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                  {t('checkup.babyIs')} {entry.size}
                </span>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}

function InfoCard({ icon: Icon, tint, color, title, text }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: tint }}>
          <Icon size={18} color={color} />
        </span>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <p className="text-sm text-ink-muted">{text}</p>
    </div>
  )
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-indigo-600" />
        <h2 className="text-base font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </div>
  )
}

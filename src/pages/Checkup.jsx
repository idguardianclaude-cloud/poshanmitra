import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Baby, Heart, CheckCircle2, Lightbulb, Briefcase, MessageSquare, ClipboardList, Plus, Trash2, Check } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Illustration } from '../components/Illustration.jsx'
import { useT } from '../lib/i18n.js'
import { storage } from '../lib/storage.js'
import { formatIN } from '../lib/dates.js'
import { todayISO } from '../lib/reports.js'
import { weeklyMilestones, hospitalBag, milestoneForWeek } from '../data/checkup.js'

export function Checkup() {
  const { profile, lang } = useProfile()
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

          {/* Weekly check-up log — lives only here, separate from Reports uploads */}
          <WeeklyCheckupLog week={week} lang={lang} />

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

// A log of the woman's weekly antenatal check-ups. Stored separately from the
// Reports page (which is for uploaded hospital/lab reports). Her own record.
function WeeklyCheckupLog({ week, lang }) {
  const [list, setList] = useState(() => storage.getCheckups())
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(todayISO())
  const [weight, setWeight] = useState('')
  const [sys, setSys] = useState('')
  const [dia, setDia] = useState('')
  const [note, setNote] = useState('')

  function persist(next) {
    setList(next)
    storage.setCheckups(next)
  }
  function add(e) {
    e.preventDefault()
    const entry = {
      id: `c-${Date.now()}`,
      date: date || todayISO(),
      week,
      weight: weight ? Number(weight) : null,
      bp: sys && dia ? `${Number(sys)}/${Number(dia)}` : null,
      note: note.slice(0, 160),
    }
    persist([entry, ...list])
    setWeight(''); setSys(''); setDia(''); setNote(''); setDate(todayISO()); setOpen(false)
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-indigo-600" />
          <h2 className="text-base font-semibold text-ink">This week's check-up</h2>
        </div>
        {!open && (
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
            <Plus size={13} /> Log visit
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={add} className="space-y-2.5 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" inputMode="numeric" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="BP systolic" className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            <input type="number" inputMode="numeric" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="BP diastolic" className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
          </div>
          <input value={note} maxLength={160} onChange={(e) => setNote(e.target.value)} placeholder="Notes from the visit (optional)" className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm"><Check size={15} /> Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {list.length === 0 ? (
        <p className="text-xs text-ink-faint">No check-ups logged yet. Add one after each ANC visit.</p>
      ) : (
        <ul className="divide-y divide-line">
          {list.slice(0, 8).map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-2 py-2">
              <div className="min-w-0">
                <p className="text-sm text-ink">
                  {formatIN(c.date, lang)}{c.week ? ` · wk ${c.week}` : ''}
                  {c.weight ? ` · ${c.weight} kg` : ''}{c.bp ? ` · BP ${c.bp}` : ''}
                </p>
                {c.note && <p className="text-xs text-ink-faint">{c.note}</p>}
              </div>
              <button onClick={() => persist(list.filter((x) => x.id !== c.id))} aria-label="Remove" className="p-1 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50 shrink-0"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[11px] text-ink-faint">Your own record of each visit — not a diagnosis. Upload full lab reports in Reports.</p>
    </div>
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

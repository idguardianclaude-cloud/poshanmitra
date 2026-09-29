import { useState } from 'react'
import { Bell, BellOff, Plus, Trash2, Clock, CheckCircle2, Share2 } from 'lucide-react'
import { Button } from './ui/Button.jsx'
import { storage } from '../lib/storage.js'
import { useT } from '../lib/i18n.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { formatIN } from '../lib/dates.js'
import { shareOnWhatsApp } from '../lib/whatsapp.js'
import {
  makeReminder,
  removeReminder,
  updateReminder,
  nextOccurrence,
  notificationsSupported,
  notificationPermission,
  requestNotificationPermission,
} from '../lib/reminders.js'

const KINDS = ['anc', 'tablet', 'custom']
const REPEATS = ['once', 'daily', 'weekly']
const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] // Sun..Sat

export function RemindersManager() {
  const t = useT()
  const { lang } = useProfile()
  const [reminders, setReminders] = useState(() => storage.getReminders())
  const [perm, setPerm] = useState(() => notificationPermission())
  const [adding, setAdding] = useState(false)

  function persist(next) {
    setReminders(next)
    storage.setReminders(next)
  }

  async function enableNotifications() {
    const result = await requestNotificationPermission()
    setPerm(result)
  }

  function add(reminder) {
    persist([...reminders, reminder])
    setAdding(false)
  }
  function toggle(id, enabled) {
    persist(updateReminder(reminders, id, { enabled }))
  }
  function del(id) {
    persist(removeReminder(reminders, id))
  }

  const supported = notificationsSupported()

  return (
    <section className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-600" />
          <h2 className="text-base font-semibold text-ink">{t('reminders.title')}</h2>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Plus size={13} /> {t('reminders.add')}
          </button>
        )}
      </div>
      <p className="text-sm text-ink-muted">{t('reminders.sub')}</p>
      <p className="text-xs text-ink-faint mt-1">{t('reminders.whatsappNote')}</p>

      {/* Permission banner */}
      {supported && perm !== 'granted' && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-canvas border border-line px-3 py-2.5">
          <span className="text-sm text-ink-muted">{t('reminders.permBody')}</span>
          <Button size="sm" onClick={enableNotifications}>
            {t('reminders.enable')}
          </Button>
        </div>
      )}
      {!supported && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-canvas border border-line px-3 py-2.5 text-sm text-ink-muted">
          <BellOff size={15} /> {t('reminders.unsupported')}
        </div>
      )}
      {supported && perm === 'granted' && (
        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle2 size={15} /> {t('reminders.enabled')}
        </div>
      )}

      {adding && <ReminderForm onCancel={() => setAdding(false)} onSave={add} />}

      {/* List */}
      <ul className="mt-4 space-y-2">
        {reminders.length === 0 && !adding && (
          <li className="text-sm text-ink-faint py-2">{t('reminders.empty')}</li>
        )}
        {reminders.map((r) => {
          const next = nextOccurrence(r)
          return (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {r.title || t(`reminders.kind.${r.kind}`)}
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-ink-faint">
                  <Clock size={12} /> {r.time} · {t(`reminders.repeat.${r.repeat}`)}
                  {r.enabled && next ? ` · ${t('reminders.next')}: ${formatIN(next, lang)}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() =>
                    shareOnWhatsApp(
                      `${t('reminders.notifTitle')}: ${r.title || t(`reminders.kind.${r.kind}`)} — ${r.time} (${t(`reminders.repeat.${r.repeat}`)})`
                    )
                  }
                  aria-label={t('common.whatsapp')}
                  title={t('common.whatsapp')}
                  className="p-1.5 rounded-lg text-ink-faint hover:text-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <Share2 size={15} />
                </button>
                <button
                  role="switch"
                  aria-checked={r.enabled}
                  aria-label={t('reminders.toggle')}
                  onClick={() => toggle(r.id, !r.enabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    r.enabled ? 'bg-indigo-600' : 'bg-line'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      r.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => del(r.id)}
                  aria-label={t('reminders.delete')}
                  className="p-1.5 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ReminderForm({ onCancel, onSave }) {
  const t = useT()
  const [kind, setKind] = useState('anc')
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('09:00')
  const [repeat, setRepeat] = useState('once')
  const [date, setDate] = useState('')
  const [days, setDays] = useState([])

  function toggleDay(d) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  function submit(e) {
    e.preventDefault()
    const reminder = makeReminder({ kind, title, time, repeat, date, days })
    if (!reminder) return
    onSave(reminder)
  }

  const valid =
    !!time &&
    (repeat !== 'once' || !!date) &&
    (repeat !== 'weekly' || days.length > 0)

  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-line bg-canvas p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[13px] font-medium text-ink mb-1 block">{t('reminders.kindLabel')}</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`reminders.kind.${k}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-ink mb-1 block">{t('reminders.time')}</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[13px] font-medium text-ink mb-1 block">
          {t('reminders.label')} <span className="text-ink-faint">({t('reminders.optional')})</span>
        </span>
        <input
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(`reminders.placeholder.${kind}`)}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        />
      </label>

      <div>
        <span className="text-[13px] font-medium text-ink mb-1 block">{t('reminders.repeatLabel')}</span>
        <div className="inline-flex rounded-full border border-line p-0.5 bg-white">
          {REPEATS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRepeat(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                repeat === r ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {t(`reminders.repeat.${r}`)}
            </button>
          ))}
        </div>
      </div>

      {repeat === 'once' && (
        <label className="block">
          <span className="text-[13px] font-medium text-ink mb-1 block">{t('reminders.date')}</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </label>
      )}

      {repeat === 'weekly' && (
        <div>
          <span className="text-[13px] font-medium text-ink mb-1 block">{t('reminders.days')}</span>
          <div className="flex flex-wrap gap-1.5">
            {WEEKDAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                aria-pressed={days.includes(d)}
                className={`w-9 h-9 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  days.includes(d) ? 'bg-indigo-600 text-white' : 'border border-line text-ink-muted hover:bg-white'
                }`}
              >
                {t(`reminders.weekday.${d}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="sm" disabled={!valid}>
          {t('reminders.save')}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          {t('reminders.cancel')}
        </Button>
      </div>
    </form>
  )
}

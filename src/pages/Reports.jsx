import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, TrendingUp, TrendingDown, Minus, Activity, MessageSquare, Info, Share2 } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { TrendChart } from '../components/TrendChart.jsx'
import { storage } from '../lib/storage.js'
import { useT } from '../lib/i18n.js'
import { formatIN } from '../lib/dates.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { shareOnWhatsApp } from '../lib/whatsapp.js'
import {
  METRICS,
  getMetric,
  seriesFor,
  latestFor,
  trendFor,
  displayValue,
  plotValue,
  makeReading,
  addReading,
  removeReading,
  isValidReading,
  todayISO,
} from '../lib/reports.js'

export function Reports() {
  const t = useT()
  const { lang } = useProfile()
  const [reports, setReports] = useState(() => storage.getReports())
  const [adding, setAdding] = useState(null) // metric key or null

  function persist(next) {
    setReports(next)
    storage.setReports(next)
  }

  function handleAdd(metricKey, values, extra) {
    const reading = makeReading(metricKey, values, extra)
    if (!reading) return false
    persist(addReading(reports, reading))
    setAdding(null)
    return true
  }

  function handleDelete(id) {
    persist(removeReading(reports, id))
  }

  const recent = useMemo(
    () =>
      reports
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, 12),
    [reports]
  )

  const hasAny = reports.length > 0

  function shareLatest() {
    const lines = METRICS.map((m) => {
      const latest = latestFor(reports, m.key)
      return latest ? `${t(`reports.metric.${m.key}`)}: ${displayValue(latest)} ${m.unit} (${formatIN(latest.date, lang)})` : null
    }).filter(Boolean)
    if (lines.length === 0) return
    shareOnWhatsApp(`${t('reports.title')}\n${lines.join('\n')}`)
  }

  return (
    <>
      <PageHeader
        title={t('reports.title')}
        subtitle={t('reports.sub')}
        action={
          <div className="flex items-center gap-2">
            {hasAny && (
              <Button variant="secondary" onClick={shareLatest}>
                <Share2 size={15} /> {t('common.whatsapp')}
              </Button>
            )}
            <Button as={Link} to="/chat?q=I%20want%20to%20understand%20my%20health%20readings" variant="secondary">
              <MessageSquare size={15} /> {t('common.askMitra')}
            </Button>
          </div>
        }
      />

      {/* Non-dismissable safety note — this is a personal record, not advice. */}
      <div className="mb-6 flex items-start gap-2 rounded-2xl border border-line bg-white shadow-card px-4 py-3 text-sm text-ink-muted">
        <Info size={16} className="shrink-0 text-indigo-500 mt-0.5" />
        <span>{t('reports.disclaimer')}</span>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {METRICS.map((m) => {
          const latest = latestFor(reports, m.key)
          const series = seriesFor(reports, m.key)
          const trend = trendFor(reports, m.key)
          const points = series.map((r) => ({
            x: r.date,
            y: plotValue(r),
            label: displayValue(r),
          }))
          return (
            <div key={m.key} className="rounded-2xl bg-white border border-line shadow-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: m.tint }}
                  >
                    <Activity size={18} color={m.color} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{t(`reports.metric.${m.key}`)}</h3>
                    <p className="text-xs text-ink-faint">{m.unit}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAdding(m.key)}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Plus size={13} /> {t('reports.add')}
                </button>
              </div>

              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[26px] leading-tight font-bold text-ink">
                    {latest ? displayValue(latest) : '—'}
                  </p>
                  {latest && (
                    <p className="text-xs text-ink-faint">
                      {formatIN(latest.date, lang)}
                    </p>
                  )}
                </div>
                {trend && (
                  <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                    {trend === 'up' ? (
                      <TrendingUp size={15} className="text-ink-muted" />
                    ) : trend === 'down' ? (
                      <TrendingDown size={15} className="text-ink-muted" />
                    ) : (
                      <Minus size={15} className="text-ink-muted" />
                    )}
                    {t(`reports.trend.${trend}`)}
                  </span>
                )}
              </div>

              <div className="mt-2">
                {points.length > 0 ? (
                  <TrendChart
                    points={points}
                    color={m.color}
                    unit={m.unit}
                    ariaLabel={`${t(`reports.metric.${m.key}`)}: ${points.length} readings, latest ${displayValue(latest)} ${m.unit}`}
                  />
                ) : (
                  <p className="text-xs text-ink-faint py-6 text-center">{t('reports.noneYet')}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent entries */}
      <section className="mt-8 rounded-2xl bg-white border border-line shadow-card p-5">
        <h2 className="text-base font-semibold text-ink mb-3">{t('reports.recent')}</h2>
        {!hasAny ? (
          <EmptyState title={t('reports.empty')} />
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((r) => {
              const m = getMetric(r.metric)
              return (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: m?.color || '#4F46E5' }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {t(`reports.metric.${r.metric}`)}:{' '}
                        <span className="font-semibold">{displayValue(r)}</span>{' '}
                        <span className="text-ink-faint font-normal">{m?.unit}</span>
                      </p>
                      <p className="text-xs text-ink-faint">
                        {formatIN(r.date, lang)}
                        {r.note ? ` · ${r.note}` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    aria-label={t('reports.delete')}
                    className="p-1.5 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {adding && (
        <AddReadingModal
          metricKey={adding}
          onClose={() => setAdding(null)}
          onSave={handleAdd}
        />
      )}
    </>
  )
}

function AddReadingModal({ metricKey, onClose, onSave }) {
  const t = useT()
  const metric = getMetric(metricKey)
  const [values, setValues] = useState({})
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')

  const ok = isValidReading(metricKey, values) && date && date <= todayISO()

  function submit(e) {
    e.preventDefault()
    if (!ok) return
    onSave(metricKey, values, { date, note })
  }

  return (
    <Modal open onClose={onClose} title={`${t('reports.addTitle')} — ${t(`reports.metric.${metricKey}`)}`}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {metric.fields.map((f) => (
            <label key={f.name} className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">
                {t(`reports.field.${metricKey}.${f.name}`)} <span className="text-ink-faint">({metric.unit})</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                step={f.step}
                min={f.min}
                max={f.max}
                value={values[f.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </label>
          ))}
        </div>

        <label className="block">
          <span className="text-[13px] font-medium text-ink mb-1.5 block">{t('reports.date')}</span>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-ink mb-1.5 block">
            {t('reports.note')} <span className="text-ink-faint">({t('reports.optional')})</span>
          </span>
          <input
            value={note}
            maxLength={140}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('reports.notePlaceholder')}
            className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </label>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={!ok}>
            {t('reports.save')}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('reports.cancel')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

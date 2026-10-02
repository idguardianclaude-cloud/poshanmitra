import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Landmark, ExternalLink, Check, FileText, MapPin, ArrowRight, MessageSquare, Star } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { IconTile } from '../components/ui/IconTile.jsx'
import {
  schemes,
  CATEGORIES,
  BENEFIT_TYPES,
  categoryCounts,
  helpfulResources,
} from '../data/schemes.js'
import { useT } from '../lib/i18n.js'

const SORTS = ['Popular first', 'A–Z', 'Z–A']

export function Schemes() {
  const t = useT()
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [benefitType, setBenefitType] = useState('')
  const [sort, setSort] = useState('Popular first')
  const [detail, setDetail] = useState(null)

  const counts = useMemo(() => categoryCounts(), [])

  const filtered = useMemo(() => {
    let list = schemes.filter((s) => {
      if (cat !== 'all' && !s.categories.includes(cat)) return false
      if (benefitType && s.benefitType !== benefitType) return false
      if (query) {
        const q = query.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q))
          return false
      }
      return true
    })
    list = [...list]
    if (sort === 'A–Z') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'Z–A') list.sort((a, b) => b.name.localeCompare(a.name))
    else list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    return list
  }, [cat, query, benefitType, sort])

  return (
    <>
      <PageHeader
        title={t('schemes.title')}
        subtitle={t('schemes.sub')}
        action={
          <Button
            as={Link}
            to="/chat?q=Which%20government%20schemes%20am%20I%20likely%20eligible%20for%2C%20and%20how%20do%20I%20apply%3F"
            variant="secondary"
          >
            <MessageSquare size={16} /> {t('common.askMitra')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-5">
          {/* Search + filters */}
          <div className="rounded-2xl bg-white border border-line shadow-card p-4 space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('schemes.search')}
                className="w-full rounded-xl border border-line bg-canvas pl-9 pr-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="text-sm">
                <span className="sr-only">Benefit type</span>
                <select
                  value={benefitType}
                  onChange={(e) => setBenefitType(e.target.value)}
                  className="rounded-xl border border-line bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <option value="">{t('schemes.allBenefit')}</option>
                  {BENEFIT_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-line bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s}>
                      {t('schemes.sortBy')}: {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  cat === c.key
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-line text-ink hover:bg-canvas'
                }`}
              >
                {t(`schemes.cat.${c.key}`)}{' '}
                <span className={cat === c.key ? 'text-indigo-100' : 'text-ink-faint'}>
                  {counts[c.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Scheme rows */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white border border-line shadow-card p-10 text-center text-sm text-ink-muted">
              {t('schemes.noMatch')}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((s) => (
                <SchemeRow key={s.id} scheme={s} onView={() => setDetail(s)} t={t} />
              ))}
            </div>
          )}

          <p className="text-xs text-ink-faint">{t('schemes.footnote')}</p>
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-indigo-100 shadow-card p-5" style={{ backgroundColor: '#EEF0FF' }}>
            <h2 className="text-base font-semibold text-ink">{t('schemes.checkEligibility')}</h2>
            <p className="mt-1 text-sm text-ink-muted">{t('schemes.checkEligibilitySub')}</p>
            <Button as={Link} to="/schemes/eligibility" className="mt-4 w-full">
              {t('schemes.checkEligibilityCta')} <ArrowRight size={16} />
            </Button>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-3">{t('schemes.topSchemes')}</h2>
            <ol className="space-y-3">
              {schemes.slice(0, 3).map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() => setDetail(s)}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink group-hover:text-indigo-600">{s.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-3">{t('schemes.resources')}</h2>
            <ul className="space-y-2">
              {helpfulResources.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-ink">
                  <FileText size={15} className="text-ink-faint" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink">{t('common.needHelp')}</h2>
            <p className="mt-1 text-sm text-ink-muted">{t('schemes.needHelpSub')}</p>
            <Button as={Link} to="/chat?q=How%20do%20I%20apply%20for%20PMMVY" variant="secondary" className="mt-3 w-full">
              <MessageSquare size={16} /> {t('common.askMitra')}
            </Button>
          </div>
        </aside>
      </div>

      <SchemeDetail scheme={detail} onClose={() => setDetail(null)} />
    </>
  )
}

function SchemeRow({ scheme, onView, t }) {
  return (
    <section className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-start gap-4">
        <IconTile icon={Landmark} fill="#FFFBEB" color="#F59E0B" size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-ink">{scheme.name}</h3>
            {scheme.popular && (
              <Badge tone="warning">
                <Star size={11} /> {t('schemes.popular')}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">{scheme.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {scheme.tags.map((t) => (
              <Badge key={t} tone="neutral">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-canvas p-3">
        <p className="text-xs font-semibold text-ink mb-2">{t('schemes.benefits')}</p>
        <ul className="space-y-1">
          {scheme.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-ink">
              <Check size={14} className="text-emerald-600 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="secondary" size="sm" onClick={onView}>
          {t('schemes.viewDetails')}
        </Button>
      </div>
    </section>
  )
}

function SchemeDetail({ scheme, onClose }) {
  const t = useT()
  if (!scheme) return null
  return (
    <Modal
      open={!!scheme}
      onClose={onClose}
      title={scheme.name}
      footer={
        <Button
          as="a"
          href={scheme.portal}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          {t('schemes.applyPortal')} <ExternalLink size={16} />
        </Button>
      }
    >
      <p className="text-sm text-ink">{scheme.description}</p>

      <Section title={t('schemes.benefits')}>
        <ul className="space-y-1.5">
          {scheme.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-ink">
              <Check size={14} className="text-emerald-600 shrink-0" /> {b}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('schemes.whoEligible')}>
        <ul className="space-y-1.5">
          {scheme.eligibility.map((e) => (
            <li key={e} className="flex items-start gap-2 text-sm text-ink">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> {e}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('schemes.requiredDocs')}>
        <ul className="space-y-1.5">
          {scheme.documents.map((d) => (
            <li key={d} className="flex items-center gap-2 text-sm text-ink">
              <FileText size={14} className="text-ink-faint shrink-0" /> {d}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-ink-faint">{t('schemes.noAadhaar')}</p>
      </Section>

      <Section title={t('schemes.whereApply')}>
        <p className="flex items-start gap-2 text-sm text-ink">
          <MapPin size={15} className="text-ink-faint shrink-0 mt-0.5" />
          {scheme.whereToApply}
        </p>
      </Section>
    </Modal>
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-ink mb-2">{title}</h3>
      {children}
    </div>
  )
}

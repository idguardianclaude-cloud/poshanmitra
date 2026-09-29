import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ExternalLink, ArrowRight, MessageSquare, Share2 } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useT } from '../lib/i18n.js'
import { campaigns } from '../data/campaigns.js'
import { shareOnWhatsApp } from '../lib/whatsapp.js'

export function Campaigns() {
  const t = useT()

  return (
    <>
      <PageHeader title={t('campaigns.title')} subtitle={t('campaigns.sub')} />

      <div className="mb-6 rounded-2xl border border-indigo-100 shadow-card p-4 text-sm text-ink-muted" style={{ backgroundColor: '#EEF0FF' }}>
        {t('campaigns.intro')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {campaigns.map((c) => (
          <article key={c.id} className="rounded-2xl bg-white border border-line shadow-card p-5 flex flex-col">
            <div className="flex items-start gap-3">
              <span
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.tint }}
              >
                <Calendar size={20} className="text-indigo-600" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-ink leading-snug">{c.name}</h2>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                  <Calendar size={12} /> {c.when}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-ink-muted">{c.what}</p>

            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <Users size={15} className="text-ink-faint shrink-0 mt-0.5" />
                <dd className="text-ink-muted">{c.forWho}</dd>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-ink-faint shrink-0 mt-0.5" />
                <dd className="text-ink-muted">{c.where}</dd>
              </div>
            </dl>

            <div className="mt-3 rounded-xl bg-canvas border border-line px-3 py-2 text-sm text-ink">
              <span className="font-medium">{t('campaigns.whatToDo')}: </span>
              {c.action}
            </div>

            <div className="mt-4 flex items-center gap-3 pt-1">
              <Button as="a" href={c.link} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
                {t('campaigns.official')} <ExternalLink size={14} />
              </Button>
              <Button
                as={Link}
                to={`/chat?q=${encodeURIComponent(`Tell me more about ${c.name} and how it helps me`)}`}
                variant="ghost"
                size="sm"
              >
                <MessageSquare size={14} /> {t('common.askMitra')}
              </Button>
              <button
                onClick={() =>
                  shareOnWhatsApp(`${c.name}\n${c.when} · ${c.forWho}\n${c.action}\n${c.link}`)
                }
                aria-label={t('common.whatsapp')}
                title={t('common.whatsapp')}
                className="ml-auto p-2 rounded-lg text-ink-faint hover:text-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Share2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Cross-link to schemes */}
      <section className="mt-8 rounded-2xl bg-white border border-line shadow-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">{t('campaigns.schemesTitle')}</h2>
          <p className="text-sm text-ink-muted mt-0.5">{t('campaigns.schemesSub')}</p>
        </div>
        <Button as={Link} to="/schemes" variant="secondary">
          {t('campaigns.viewSchemes')} <ArrowRight size={15} />
        </Button>
      </section>
    </>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Play, TrendingUp, Bell, Check, MessageSquare, ExternalLink, BadgeCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { Illustration } from '../components/Illustration.jsx'
import { categories, videos, continueWatching, trending, officialSources, DEFAULT_SOURCE } from '../data/videos.js'
import { useT } from '../lib/i18n.js'
import { storage } from '../lib/storage.js'

const SORTS = ['Latest', 'Shortest', 'Longest', 'A–Z', 'Z–A']

export function Videos() {
  const t = useT()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('Latest')
  const [visible, setVisible] = useState(8)
  const [playing, setPlaying] = useState(null)
  const [subscribed, setSubscribed] = useState(() => storage.getNotifications())

  const filtered = useMemo(() => {
    let list = videos.filter((v) => {
      if (category && v.category !== category) return false
      if (query && !v.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
    const by = (fn) => (list = [...list].sort(fn))
    if (sort === 'A–Z') by((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'Z–A') by((a, b) => b.title.localeCompare(a.title))
    else if (sort === 'Shortest') by((a, b) => dur(a) - dur(b))
    else if (sort === 'Longest') by((a, b) => dur(b) - dur(a))
    return list
  }, [query, category, sort])

  const catCount = useMemo(() => {
    const map = {}
    for (const v of videos) map[v.category] = (map[v.category] || 0) + 1
    return map
  }, [])

  function toggleSubscribe() {
    const next = !subscribed
    setSubscribed(next)
    storage.setNotifications(next)
  }

  return (
    <>
      <PageHeader title={t('videos.title')} subtitle={t('videos.sub')} />

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('videos.search')}
            className="w-full rounded-xl border border-line bg-white pl-9 pr-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <option value="">{t('videos.allCategories')}</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {SORTS.map((s) => (
            <option key={s}>{t('videos.sort')}: {s}</option>
          ))}
        </select>
      </div>

      {/* Hero */}
      <div className="rounded-2xl p-6 sm:p-8 mb-6 text-white bg-gradient-to-br from-indigo-600 to-indigo-700">
        <h2 className="text-xl sm:text-2xl font-bold max-w-xl">{t('videos.heroTitle')}</h2>
        <p className="mt-2 text-sm text-indigo-100 max-w-xl">{t('videos.heroSub')}</p>
        <Button variant="secondary" className="mt-4" onClick={() => setPlaying(videos[0])}>
          <Play size={16} /> {t('videos.watchPopular')}
        </Button>
      </div>

      {/* Category strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setCategory('')}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium border ${
            category === '' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink hover:bg-canvas'
          }`}
        >
          {t('videos.all')}
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium border ${
              category === c.key ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink hover:bg-canvas'
            }`}
          >
            {c.label}{' '}
            <span className={category === c.key ? 'text-indigo-100' : 'text-ink-faint'}>{catCount[c.key] || 0}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-3">
          <h2 className="text-base font-semibold text-ink mb-3">{t('videos.popular')}</h2>
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white border border-line shadow-card p-10 text-center text-sm text-ink-muted">
              {t('videos.noMatch')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(0, visible).map((v) => (
                <VideoCard key={v.id} video={v} onPlay={() => setPlaying(v)} />
              ))}
            </div>
          )}
          {visible < filtered.length && (
            <div className="mt-5 text-center">
              <Button variant="secondary" onClick={() => setVisible((n) => n + 4)}>
                {t('videos.loadMore')}
              </Button>
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-3">{t('videos.continueWatching')}</h2>
            <ul className="space-y-3">
              {continueWatching.map((c) => {
                const v = videos.find((x) => x.id === c.id)
                return (
                  <li key={c.id}>
                    <button onClick={() => v && setPlaying(v)} className="w-full flex gap-3 text-left group">
                      <span className="relative w-24 shrink-0 aspect-video rounded-lg overflow-hidden bg-canvas">
                        {v?.youtubeId && (
                          <img
                            src={ytThumb(v.youtubeId)}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-black/25">
                          <span className="block h-full bg-red-600" style={{ width: `${c.progress}%` }} />
                        </span>
                      </span>
                      <p className="flex-1 text-sm text-ink group-hover:text-indigo-600 line-clamp-2">{c.title}</p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={17} className="text-indigo-600" />
              <h2 className="text-base font-semibold text-ink">{t('videos.trending')}</h2>
            </div>
            <ol className="space-y-3">
              {trending.map((tr, i) => {
                const v = videos.find((x) => x.id === tr.id)
                return (
                  <li key={`${tr.id}-${i}`}>
                    <button onClick={() => v && setPlaying(v)} className="w-full flex items-center gap-2.5 text-left group">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="relative w-20 shrink-0 aspect-video rounded-md overflow-hidden bg-canvas">
                        {v?.youtubeId && (
                          <img
                            src={ytThumb(v.youtubeId)}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-ink group-hover:text-indigo-600 line-clamp-2">{tr.title}</span>
                        <span className="block text-xs text-ink-faint line-clamp-1">{tr.channel}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="rounded-2xl border border-indigo-100 shadow-card p-5 text-center" style={{ backgroundColor: '#EEF0FF' }}>
            <Bell size={22} className="mx-auto text-indigo-600" />
            <h2 className="mt-2 text-base font-semibold text-ink">{t('videos.newWeekly')}</h2>
            <p className="mt-1 text-sm text-ink-muted">{t('videos.newWeeklySub')}</p>
            <Button
              className="mt-3 w-full"
              variant={subscribed ? 'secondary' : 'primary'}
              onClick={toggleSubscribe}
            >
              {subscribed ? (
                <>
                  <Check size={16} /> {t('settings.on')}
                </>
              ) : (
                t('videos.subscribe')
              )}
            </Button>
          </div>
        </aside>
      </div>

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </>
  )
}

function dur(v) {
  const [m, s] = v.duration.split(':').map(Number)
  return m * 60 + s
}

// Real YouTube thumbnail — public, keyless. hqdefault (480x360) always exists;
// object-cover crops it to a clean 16:9 like YouTube's own cards.
function ytThumb(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

function VideoCard({ video, onPlay }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card overflow-hidden">
      <button onClick={onPlay} className="relative w-full aspect-video overflow-hidden group" style={{ backgroundColor: video.tint }}>
        {video.youtubeId && (
          <img
            src={ytThumb(video.youtubeId)}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full bg-black/55 group-hover:bg-red-600 flex items-center justify-center transition-colors">
            <Play size={20} className="text-white ml-0.5" fill="currentColor" />
          </span>
        </span>
        <span className="absolute bottom-2 right-2 text-[11px] font-medium text-white bg-black/80 rounded px-1.5 py-0.5">
          {video.duration}
        </span>
      </button>
      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <Badge tone="primary">{video.tag}</Badge>
          {video.youtubeId && (
            <Badge tone="success">
              <BadgeCheck size={11} /> Verified
            </Badge>
          )}
        </div>
        <p className="mt-2 text-sm font-medium text-ink line-clamp-2">{video.title}</p>
        {video.channel && (
          <p className="mt-1 text-xs text-ink-faint line-clamp-1">{video.channel}</p>
        )}
      </div>
    </div>
  )
}

function VideoModal({ video, onClose }) {
  const t = useT()
  if (!video) return null
  return (
    <Modal open={!!video} onClose={onClose} title={video.title}>
      {video.youtubeId ? (
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        // SAFETY.md §9 — no verified embed. Instead offer safe, useful actions:
        // ask Mitra (grounded in vetted content) and an official health source.
        <div className="rounded-xl border border-line bg-canvas p-6 text-center">
          <Illustration name="shield-check" size={88} />
          <p className="mt-4 text-base font-medium text-ink">{t('videos.comingSoon')}</p>
          <p className="mt-1 text-sm text-ink-muted max-w-sm mx-auto">{t('videos.verifiedNote')}</p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              as={Link}
              to={`/chat?q=${encodeURIComponent(video.title)}`}
              onClick={onClose}
            >
              <MessageSquare size={16} /> {t('videos.askAbout')}
            </Button>
            {(() => {
              const src = officialSources[video.category] || DEFAULT_SOURCE
              return (
                <Button as="a" href={src.url} target="_blank" rel="noopener noreferrer" variant="secondary">
                  {t('videos.officialSource')}: {src.label} <ExternalLink size={14} />
                </Button>
              )
            })()}
          </div>
          <Badge tone="neutral" className="mt-4">
            {video.tag} · {video.duration}
          </Badge>
        </div>
      )}
    </Modal>
  )
}

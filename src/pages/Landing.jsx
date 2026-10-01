import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle, Salad, FileText, MapPin, Video, Activity, Bell,
  Megaphone, ShieldCheck, Globe, Stethoscope, Lock, ArrowRight, Check,
  Sparkles, HeartPulse, Phone, Play,
} from 'lucide-react'
import { Button } from '../components/ui/Button.jsx'
import { LogoMark } from '../components/Logo.jsx'
import { ProductDemo } from '../components/ProductDemo.jsx'
import { DisclaimerFooter } from '../components/layout/DisclaimerFooter.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { getLanding } from '../lib/landingContent.js'

// Public marketing landing page (route: /welcome). Trilingual — content comes from
// landingContent.js keyed by the app language (with a switcher in the header that
// also sets the language carried into sign-up). Motion is decorative and gated
// behind prefers-reduced-motion (see index.css). Copy stays honest: sample diet,
// information-not-diagnosis, on-device data; "Meet Priya" is the known persona.

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const LANG_TOGGLE = [
  { code: 'en', short: 'EN' },
  { code: 'hi', short: 'हिं' },
  { code: 'mr', short: 'मरा' },
]

// Icons pair positionally with content.features / content.safety.items / content.how.steps
const FEATURE_ICONS = [
  { icon: MessageCircle, tint: '#EEF0FF' }, { icon: Salad, tint: '#ECFDF5' },
  { icon: FileText, tint: '#FFFBEB' }, { icon: MapPin, tint: '#EFF6FF' },
  { icon: Video, tint: '#FEF2F2' }, { icon: Activity, tint: '#F0FDFA' },
  { icon: Bell, tint: '#F5F3FF' }, { icon: Megaphone, tint: '#FDF2F8' },
]
const SAFETY_ICONS = [ShieldCheck, Stethoscope, Lock, HeartPulse]
const STAT_VALUES = [{ v: 3, s: '' }, { v: 12, s: '' }, { v: 8, s: '+' }, { v: 0, s: '' }]

function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(prefersReduced())
  useEffect(() => {
    if (prefersReduced() || !ref.current) return setInView(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { threshold },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold, once])
  return [ref, inView]
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  )
}

function useCountUp(target, run, dur = 1200) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (prefersReduced()) return setN(target)
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, dur])
  return n
}

export function Landing() {
  const { lang, setLang } = useProfile()
  const c = getLanding(lang)

  return (
    <div className="min-h-screen bg-canvas text-ink overflow-x-hidden" lang={lang}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-canvas/80 backdrop-blur border-b border-line">
        <div className="max-w-main mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-2.5 group shrink-0">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 transition-transform group-hover:scale-105">
              <LogoMark size={20} />
            </span>
            <span className="font-bold text-[15px] leading-none hidden xs:inline sm:inline">PoshanMitra AI</span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-sm text-ink-muted">
            {[[c.nav.features, '#features'], [c.nav.safety, '#safety'], [c.nav.how, '#how'], [c.nav.languages, '#languages']].map(([l, h]) => (
              <a key={h} href={h} className="relative hover:text-ink after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="inline-flex rounded-full border border-line bg-white p-0.5" role="group" aria-label="Language">
              {LANG_TOGGLE.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  lang={l.code}
                  aria-pressed={lang === l.code}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${lang === l.code ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:text-ink'}`}
                >
                  {l.short}
                </button>
              ))}
            </div>
            <Button as={Link} to="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">{c.login}</Button>
            <Button as={Link} to="/signup" size="sm">{c.getStarted}</Button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative lp-mesh overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 -left-16 w-72 h-72 bg-indigo-300/30 lp-blob" />
          <div aria-hidden="true" className="pointer-events-none absolute top-24 -right-10 w-64 h-64 bg-indigo-200/40 lp-blob" style={{ animationDelay: '3s' }} />

          <div className="relative max-w-main mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-20 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="lp-pop inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur ring-1 ring-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1">
                <Sparkles size={13} /> {c.beta}
              </span>
              <h1 className="lp-pop mt-4 text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight" style={{ animationDelay: '0.06s' }}>
                {c.heroTitle}{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">{c.heroAccent}</span>
              </h1>
              <p className="lp-pop mt-4 text-base sm:text-lg text-ink-muted max-w-xl" style={{ animationDelay: '0.12s' }}>{c.heroSub}</p>
              <div className="lp-pop mt-4 space-y-1" style={{ animationDelay: '0.18s' }}>
                <p className="text-sm font-semibold text-indigo-700">Swasth Maa, Swasth Shishu, Swasth Bharat</p>
                <p className="text-sm text-ink-faint" lang="hi">स्वस्थ माँ · स्वस्थ शिशु · स्वस्थ भारत</p>
              </div>
              <div className="lp-pop mt-7 flex flex-col sm:flex-row gap-3" style={{ animationDelay: '0.24s' }}>
                <Button as={Link} to="/signup" className="sm:px-6 shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-transform">
                  {c.getStartedFree} <ArrowRight size={16} />
                </Button>
                <Button as="a" href="#demo" variant="secondary" className="sm:px-6"><Play size={15} fill="currentColor" /> {c.watchDemo}</Button>
              </div>
              <div className="lp-pop mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted" style={{ animationDelay: '0.3s' }}>
                {c.trust.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> {t}</span>
                ))}
              </div>
            </div>

            <ChatPreview c={c} />
          </div>

          {/* Marquee strip */}
          <div className="lp-marquee-track relative border-t border-line bg-white/60 backdrop-blur py-3">
            <div className="flex gap-3 w-max lp-marquee">
              {[...c.features, ...c.features].map((f, i) => (
                <span key={i} className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white border border-line text-xs font-medium text-ink-muted px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {f.title}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsBand labels={c.statLabels} />

        {/* Demo */}
        <section id="demo" className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1">
              <Play size={12} fill="currentColor" /> {c.demo.eyebrow}
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">{c.demo.title}</h2>
            <p className="mt-3 text-ink-muted">{c.demo.sub}</p>
          </Reveal>
          <Reveal>
            <div className="max-w-3xl mx-auto">
              <ProductDemo content={c} lang={lang} />
            </div>
          </Reveal>
        </section>

        {/* Features */}
        <section id="features" className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.featuresTitle}</h2>
            <p className="mt-3 text-ink-muted">{c.featuresSub}</p>
          </Reveal>
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i].icon
              return (
                <Reveal key={f.title} delay={(i % 4) * 80}>
                  <div className="group h-full rounded-2xl bg-white border border-line shadow-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-100">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" style={{ backgroundColor: FEATURE_ICONS[i].tint }}>
                      <Icon size={20} className="text-indigo-600" />
                    </span>
                    <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Safety */}
        <section id="safety" className="bg-white border-y border-line">
          <div className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-start">
            <Reveal className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1">
                <ShieldCheck size={13} /> {c.safety.eyebrow}
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">{c.safety.title}</h2>
              <p className="mt-3 text-ink-muted max-w-md">{c.safety.sub}</p>
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 flex items-start gap-3">
                <span className="relative inline-flex mt-0.5 shrink-0">
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-emergency/40 lp-ring" />
                  <Phone size={18} className="relative text-emergency" />
                </span>
                <p className="text-sm text-ink">{c.safety.emergency}</p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              {c.safety.items.map((s, i) => {
                const Icon = SAFETY_ICONS[i]
                return (
                  <Reveal key={s.title} delay={(i % 2) * 100}>
                    <div className="group h-full rounded-2xl bg-canvas border border-line p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:bg-white">
                      <Icon size={22} className="text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="mt-3 text-[15px] font-semibold">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.how.title}</h2>
            <p className="mt-3 text-ink-muted">{c.how.sub}</p>
          </Reveal>
          <div className="mt-9 grid md:grid-cols-3 gap-5">
            {c.how.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 110}>
                <div className="relative h-full rounded-2xl bg-white border border-line shadow-card p-6 overflow-hidden">
                  <span className="absolute -right-3 -top-4 text-[92px] font-bold text-indigo-50 select-none leading-none">{i + 1}</span>
                  <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">{i + 1}</span>
                  <h3 className="relative mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="relative mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Button as={Link} to="/signup" className="sm:px-6 hover:-translate-y-0.5 transition-transform">{c.createProfile} <ArrowRight size={16} /></Button>
          </Reveal>
        </section>

        {/* Languages */}
        <section id="languages" className="bg-white border-y border-line">
          <div className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1">
                <Globe size={13} /> {c.langs.eyebrow}
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">{c.langs.title}</h2>
              <p className="mt-3 text-ink-muted max-w-md">{c.langs.sub}</p>
            </Reveal>
            <div className="grid grid-cols-3 gap-4">
              {c.langs.cards.map(([label, greet], i) => (
                <Reveal key={label} delay={i * 90}>
                  <div className="rounded-2xl bg-canvas border border-line p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:bg-white">
                    <p className="text-lg font-bold text-indigo-600" lang={label === 'English' ? 'en' : 'hi'}>{label}</p>
                    <p className="mt-2 text-sm text-ink-muted" lang={label === 'English' ? 'en' : 'hi'}>{greet}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Meet Priya */}
        <section className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-white border border-line p-7 sm:p-10 grid md:grid-cols-[auto,1fr] gap-6 items-center">
              <span className="lp-float inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600 text-white text-2xl font-bold shrink-0 mx-auto md:mx-0 shadow-lg shadow-indigo-600/20">P</span>
              <div>
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{c.priya.eyebrow}</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold">{c.priya.title}</h2>
                <p className="mt-3 text-ink-muted max-w-2xl">{c.priya.body}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="max-w-main mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center text-white lp-gradient bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700">
              <div aria-hidden="true" className="pointer-events-none absolute -top-10 -left-10 w-48 h-48 bg-white/10 lp-blob" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-8 w-56 h-56 bg-white/10 lp-blob" style={{ animationDelay: '4s' }} />
              <h2 className="relative text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">{c.cta.title}</h2>
              <p className="relative mt-3 text-indigo-100 max-w-xl mx-auto">{c.cta.sub}</p>
              <div className="relative mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button as={Link} to="/signup" variant="secondary" className="sm:px-7 hover:-translate-y-0.5 transition-transform">
                  {c.getStartedFree} <ArrowRight size={16} />
                </Button>
              </div>
              <p className="relative mt-6 text-sm text-indigo-100">Swasth Maa, Swasth Shishu, Swasth Bharat</p>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-white">
        <div className="max-w-main mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600">
                <LogoMark size={20} />
              </span>
              <span className="font-bold text-[15px]">PoshanMitra AI</span>
            </div>
            <p className="mt-3 text-sm text-ink-muted max-w-xs">Swasth Maa, Swasth Shishu, Swasth Bharat</p>
          </div>
          <FooterCol title={c.footer.product} links={[[c.nav.features, '#features'], [c.nav.safety, '#safety'], [c.nav.how, '#how'], [c.nav.languages, '#languages']]} />
          <FooterCol title={c.footer.start} links={[[c.login, '/login'], [c.footer.createProfile, '/login']]} internal />
          <div>
            <p className="text-[13px] font-semibold text-ink">{c.footer.noteTitle}</p>
            <p className="mt-3 text-xs text-ink-muted leading-relaxed">{c.footer.note}</p>
          </div>
        </div>
      </footer>
      <DisclaimerFooter />
    </div>
  )
}

function ChatPreview({ c }) {
  const m = c.demo.mock
  const [showLast, setShowLast] = useState(prefersReduced())
  useEffect(() => {
    if (prefersReduced()) return
    const id = setTimeout(() => setShowLast(true), 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-4 bg-gradient-to-br from-white/60 to-transparent rounded-[2rem] -z-10" />
      <div className="lp-float2 mx-auto w-full max-w-sm rounded-3xl bg-white border border-line shadow-xl shadow-indigo-600/10 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
            <LogoMark size={18} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold leading-none">{m.mitra}</p>
            <p className="text-[11px] text-indigo-100 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
            </p>
          </div>
        </div>
        <div className="p-4 space-y-3 bg-canvas min-h-[232px]">
          <div className="lp-pop flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 text-white text-sm px-3.5 py-2 shadow-sm">{m.chatQ}</p>
          </div>
          <div className="lp-pop flex justify-start" style={{ animationDelay: '0.5s' }}>
            <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white border border-line text-sm text-ink px-3.5 py-2 shadow-sm">{m.chatA}</p>
          </div>
          {showLast ? (
            <div className="lp-pop flex justify-start">
              <p className="max-w-[75%] rounded-2xl rounded-bl-md bg-white border border-line text-sm text-ink px-3.5 py-2 shadow-sm">{m.mealNote}</p>
            </div>
          ) : (
            <div className="flex justify-start">
              <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white border border-line px-3.5 py-3">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-faint" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-faint" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-faint" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsBand({ labels }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  return (
    <section ref={ref} className="border-b border-line bg-white">
      <div className="max-w-main mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STAT_VALUES.map((s, i) => (
          <StatItem key={i} value={s.v} suffix={s.s} label={labels[i]} run={inView} />
        ))}
      </div>
    </section>
  )
}

function StatItem({ value, suffix, label, run }) {
  const n = useCountUp(value, run)
  return (
    <div>
      <p className="text-3xl sm:text-4xl font-bold text-indigo-600 tabular-nums">{n}{suffix}</p>
      <p className="mt-1 text-xs text-ink-muted max-w-[18ch] mx-auto">{label}</p>
    </div>
  )
}

function FooterCol({ title, links, internal }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-ink">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            {internal ? (
              <Link to={href} className="text-sm text-ink-muted hover:text-indigo-600">{label}</Link>
            ) : (
              <a href={href} className="text-sm text-ink-muted hover:text-indigo-600">{label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

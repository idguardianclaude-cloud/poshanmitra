import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle, Salad, FileText, MapPin, Video, Activity, Bell,
  Megaphone, ShieldCheck, Globe, Stethoscope, Lock, ArrowRight, Check,
  Sparkles, HeartPulse, Phone,
} from 'lucide-react'
import { Button } from '../components/ui/Button.jsx'
import { LogoMark } from '../components/Logo.jsx'
import { DisclaimerFooter } from '../components/layout/DisclaimerFooter.jsx'
import { useT } from '../lib/i18n.js'

// Public marketing landing page (route: /welcome), English-first — the app runs in
// English / हिंदी / मराठी after sign-in. Motion is decorative and fully gated behind
// prefers-reduced-motion (see index.css + prefersReduced()). Copy stays honest:
// the diet is a "sample plan", Mitra gives information (never diagnosis), and data
// stays on the device. "Meet Priya" is the app's known illustrative persona.

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Reveal-on-scroll / in-view detection (no dependency). Under reduced motion it
// reports "in view" immediately so nothing is hidden or animated.
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

// Eased count-up that runs once its container scrolls into view.
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

const FEATURES = [
  { icon: MessageCircle, tint: '#EEF0FF', title: 'Mitra, your AI companion', desc: 'Ask anything about pregnancy, diet or baby care in your own language. Mitra remembers your month and conditions like a caring friend.' },
  { icon: Salad, tint: '#ECFDF5', title: 'Sample daily meal plans', desc: 'Balanced, vegetarian-friendly Indian meal ideas for each day — general guidance to eat well through pregnancy.' },
  { icon: FileText, tint: '#FFFBEB', title: 'Government schemes', desc: 'PMMVY, JSY, PMSMA and more — with a simple eligibility checker that tells you what you qualify for.' },
  { icon: MapPin, tint: '#EFF6FF', title: 'Nearby hospitals', desc: 'A real map of maternity hospitals near you with directions and one-tap calling — no account, no API key.' },
  { icon: Video, tint: '#FEF2F2', title: 'Verified videos', desc: 'Short, trustworthy videos from credible health educators — in English and हिंदी — never unverified clips.' },
  { icon: Activity, tint: '#F0FDFA', title: 'Health reports & trends', desc: 'Log Hb, BP, sugar and weight and see simple trends over time. A personal record you can share with your doctor.' },
  { icon: Bell, tint: '#F5F3FF', title: 'Gentle reminders', desc: 'ANC visits, iron-folic tablets and custom nudges — with one-tap WhatsApp sharing for your family.' },
  { icon: Megaphone, tint: '#FDF2F8', title: 'Health campaigns', desc: 'Stay on top of official drives like PMSMA and Poshan Maah, with what, when and where to go.' },
]

const SAFETY = [
  { icon: ShieldCheck, title: 'Danger-sign detection', desc: 'Twelve obstetric warning signs are screened on every message. If one appears, Mitra shows an emergency screen with 108 — instantly, before anything else.' },
  { icon: Stethoscope, title: 'Information, never diagnosis', desc: 'Mitra shares guidance and always points you toward a doctor — never a diagnosis, medicine name or dose.' },
  { icon: Lock, title: 'Your data stays with you', desc: 'Your profile and health logs live on your device. There is no account server collecting your information.' },
  { icon: HeartPulse, title: 'Built with clinical care', desc: 'Content is written conservatively for pregnancy safety, with a disclaimer on every screen. Not a substitute for your doctor.' },
]

const STEPS = [
  { n: '1', title: 'Sign in with your mobile', desc: 'No passwords, no paperwork. Just your phone number to get started.' },
  { n: '2', title: 'Tell us about you', desc: 'Your due date, food preference and language — takes under a minute.' },
  { n: '3', title: 'Get daily guidance', desc: 'A companion, a plan and reminders that adapt to your week of pregnancy.' },
]

const STATS = [
  { value: 3, suffix: '', label: 'Languages — EN · हिंदी · मराठी' },
  { value: 12, suffix: '', label: 'Danger signs screened every message' },
  { value: 8, suffix: '+', label: 'Tools in one companion' },
  { value: 0, suffix: '', label: 'Data that leaves your device' },
]

const MARQUEE = [
  'AI companion', 'Sample diet plans', 'PMMVY eligibility', 'Nearby hospitals',
  'Verified videos', 'Hb · BP · sugar trends', 'ANC reminders', 'हिंदी · मराठी',
  'Danger-sign alerts', 'On-device privacy',
]

export function Landing() {
  const t = useT()

  return (
    <div className="min-h-screen bg-canvas text-ink overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-canvas/80 backdrop-blur border-b border-line">
        <div className="max-w-main mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 transition-transform group-hover:scale-105">
              <LogoMark size={20} />
            </span>
            <span className="font-bold text-[15px] leading-none">{t('common.appName')}</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-ink-muted">
            {[['Features', '#features'], ['Safety', '#safety'], ['How it works', '#how'], ['Languages', '#languages']].map(([l, h]) => (
              <a key={h} href={h} className="relative hover:text-ink after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
            <Button as={Link} to="/login" size="sm">Get started</Button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative lp-mesh overflow-hidden">
          {/* floating decorative blobs */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 -left-16 w-72 h-72 bg-indigo-300/30 lp-blob" />
          <div aria-hidden="true" className="pointer-events-none absolute top-24 -right-10 w-64 h-64 bg-indigo-200/40 lp-blob" style={{ animationDelay: '3s' }} />

          <div className="relative max-w-main mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-20 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="lp-pop inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur ring-1 ring-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1">
                <Sparkles size={13} /> Free during our private beta
              </span>
              <h1 className="lp-pop mt-4 text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight" style={{ animationDelay: '0.06s' }}>
                A caring companion for every step of your{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">pregnancy</span>
              </h1>
              <p className="lp-pop mt-4 text-base sm:text-lg text-ink-muted max-w-xl" style={{ animationDelay: '0.12s' }}>
                PoshanMitra AI guides expecting mothers in India with a friendly AI companion,
                daily nutrition, government schemes, nearby hospitals and safety-first care —
                in English, हिंदी and मराठी.
              </p>
              <div className="lp-pop mt-4 space-y-1" style={{ animationDelay: '0.18s' }}>
                <p className="text-sm font-semibold text-indigo-700">{t('common.tagline')}</p>
                <p className="text-sm text-ink-faint" lang="hi">स्वस्थ माँ · स्वस्थ शिशु · स्वस्थ भारत</p>
              </div>
              <div className="lp-pop mt-7 flex flex-col sm:flex-row gap-3" style={{ animationDelay: '0.24s' }}>
                <Button as={Link} to="/login" className="sm:px-6 shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-transform">
                  Get started free <ArrowRight size={16} />
                </Button>
                <Button as="a" href="#how" variant="secondary" className="sm:px-6">See how it works</Button>
              </div>
              <div className="lp-pop mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted" style={{ animationDelay: '0.3s' }}>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> 3 languages</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Safety-first design</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Data stays on your device</span>
              </div>
            </div>

            {/* Animated Mitra chat preview */}
            <ChatPreview />
          </div>

          {/* Marquee strip */}
          <div className="lp-marquee-track relative border-t border-line bg-white/60 backdrop-blur py-3">
            <div className="flex gap-3 w-max lp-marquee">
              {[...MARQUEE, ...MARQUEE].map((m, i) => (
                <span key={i} className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white border border-line text-xs font-medium text-ink-muted px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsBand />

        {/* Features */}
        <section id="features" className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Everything a mother needs, in one place</h2>
            <p className="mt-3 text-ink-muted">From the first trimester to your baby's first foods — practical, trustworthy help, always a doctor away.</p>
          </Reveal>
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 80}>
                <div className="group h-full rounded-2xl bg-white border border-line shadow-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-100">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" style={{ backgroundColor: f.tint }}>
                    <f.icon size={20} className="text-indigo-600" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Safety */}
        <section id="safety" className="bg-white border-y border-line">
          <div className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-start">
            <Reveal className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1">
                <ShieldCheck size={13} /> Safety comes first
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">Designed to keep mother and baby safe</h2>
              <p className="mt-3 text-ink-muted max-w-md">
                Maternal health is not the place for guesswork. PoshanMitra is built conservatively —
                it screens for emergencies, refuses to diagnose, and always guides you toward care.
              </p>
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 flex items-start gap-3">
                <span className="relative inline-flex mt-0.5 shrink-0">
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-emergency/40 lp-ring" />
                  <Phone size={18} className="relative text-emergency" />
                </span>
                <p className="text-sm text-ink">
                  A danger sign in your message brings up an <span className="font-semibold">emergency screen with 108</span> right away — no chatbot delay.
                </p>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              {SAFETY.map((s, i) => (
                <Reveal key={s.title} delay={(i % 2) * 100}>
                  <div className="group h-full rounded-2xl bg-canvas border border-line p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:bg-white">
                    <s.icon size={22} className="text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="mt-3 text-[15px] font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Start in under two minutes</h2>
            <p className="mt-3 text-ink-muted">No paperwork, no cost. Just three simple steps.</p>
          </Reveal>
          <div className="mt-9 grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 110}>
                <div className="relative h-full rounded-2xl bg-white border border-line shadow-card p-6 overflow-hidden">
                  <span className="absolute -right-3 -top-4 text-[92px] font-bold text-indigo-50 select-none leading-none">{s.n}</span>
                  <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold">{s.n}</span>
                  <h3 className="relative mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="relative mt-1.5 text-sm text-ink-muted leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Button as={Link} to="/login" className="sm:px-6 hover:-translate-y-0.5 transition-transform">Create your free profile <ArrowRight size={16} /></Button>
          </Reveal>
        </section>

        {/* Languages */}
        <section id="languages" className="bg-white border-y border-line">
          <div className="max-w-main mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1">
                <Globe size={13} /> In your language
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">English, हिंदी and मराठी</h2>
              <p className="mt-3 text-ink-muted max-w-md">
                Mitra chats, the diet plan, reminders and the whole app switch to your language.
                Made for Tier-2 and Tier-3 India, and light enough for everyday phones.
              </p>
            </Reveal>
            <div className="grid grid-cols-3 gap-4">
              {[['English', 'Hello, Mitra'], ['हिंदी', 'नमस्ते, मित्रा'], ['मराठी', 'नमस्कार, मित्रा']].map(([label, hi], i) => (
                <Reveal key={label} delay={i * 90}>
                  <div className="rounded-2xl bg-canvas border border-line p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:bg-white">
                    <p className="text-lg font-bold text-indigo-600" lang={label === 'English' ? 'en' : 'hi'}>{label}</p>
                    <p className="mt-2 text-sm text-ink-muted" lang={label === 'English' ? 'en' : 'hi'}>{hi}</p>
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
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">An example journey</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold">Meet Priya, 26 — Pune, 5th month</h2>
                <p className="mt-3 text-ink-muted max-w-2xl">
                  Every morning Priya opens PoshanMitra to see her week's milestones, checks off her
                  iron tablet, asks Mitra what to cook, and finds she's eligible for PMMVY. When she
                  felt unwell one evening, Mitra recognised the warning sign and showed her the
                  emergency screen at once. <span className="text-ink">That's the companion we're building.</span>
                </p>
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
              <h2 className="relative text-2xl sm:text-4xl font-bold max-w-2xl mx-auto">Start your healthy pregnancy journey today</h2>
              <p className="relative mt-3 text-indigo-100 max-w-xl mx-auto">Free during our private beta. Your data stays with you.</p>
              <div className="relative mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <Button as={Link} to="/login" variant="secondary" className="sm:px-7 hover:-translate-y-0.5 transition-transform">
                  Get started free <ArrowRight size={16} />
                </Button>
              </div>
              <p className="relative mt-6 text-sm text-indigo-100">{t('common.tagline')}</p>
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
              <span className="font-bold text-[15px]">{t('common.appName')}</span>
            </div>
            <p className="mt-3 text-sm text-ink-muted max-w-xs">{t('common.tagline')}</p>
          </div>
          <FooterCol title="Product" links={[['Features', '#features'], ['Safety', '#safety'], ['How it works', '#how'], ['Languages', '#languages']]} />
          <FooterCol title="Get started" links={[['Log in', '/login'], ['Create profile', '/login']]} internal />
          <div>
            <p className="text-[13px] font-semibold text-ink">A note on care</p>
            <p className="mt-3 text-xs text-ink-muted leading-relaxed">
              PoshanMitra provides general health information, not medical advice, and is not a
              substitute for your doctor. In an emergency, call 108.
            </p>
          </div>
        </div>
      </footer>
      <DisclaimerFooter />
    </div>
  )
}

// Mitra chat preview — bubbles pop in on load, a typing indicator precedes the
// last reply, and the send button pulses. Above the fold, so it animates on mount.
function ChatPreview() {
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
            <LogoMark size={19} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold leading-none">Mitra</p>
            <p className="text-[11px] text-indigo-100 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · your companion
            </p>
          </div>
        </div>
        <div className="p-4 space-y-3 bg-canvas min-h-[232px]">
          <div className="lp-pop flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 text-white text-sm px-3.5 py-2 shadow-sm">
              I'm in my 5th month. What should I eat today?
            </p>
          </div>
          <div className="lp-pop flex justify-start" style={{ animationDelay: '0.5s' }}>
            <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-white border border-line text-sm text-ink px-3.5 py-2 shadow-sm">
              Wonderful, Priya! In your 2nd trimester, focus on iron and calcium — try palak,
              dal, curd and a fruit. Here's a sample plan for today 🌸
            </p>
          </div>
          {showLast ? (
            <div className="lp-pop flex justify-start">
              <p className="max-w-[75%] rounded-2xl rounded-bl-md bg-white border border-line text-sm text-ink px-3.5 py-2 shadow-sm">
                Remember your iron-folic tablet after lunch. Shall I set a reminder?
              </p>
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
        <div className="px-4 py-3 border-t border-line bg-white flex items-center gap-2">
          <span className="flex-1 rounded-full bg-canvas border border-line text-[13px] text-ink-faint px-3.5 py-2">Ask Mitra anything…</span>
          <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white">
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-indigo-600/50 lp-ring" />
            <ArrowRight size={16} className="relative" />
          </span>
        </div>
      </div>
    </div>
  )
}

function StatsBand() {
  const [ref, inView] = useInView({ threshold: 0.4 })
  return (
    <section ref={ref} className="border-b border-line bg-white">
      <div className="max-w-main mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} run={inView} />
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

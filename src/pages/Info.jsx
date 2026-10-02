import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Shield, FileText, Info as InfoIcon } from 'lucide-react'
import { LogoMark } from '../components/Logo.jsx'
import { DisclaimerFooter } from '../components/layout/DisclaimerFooter.jsx'

// Public trust pages — About, Privacy, and Terms. Deliberately plain-spoken and
// HONEST for a private beta: we describe exactly what the app does and does not do,
// where data lives (on the device), and the one thing that leaves it (chat messages
// sent to Google to generate Mitra's replies). Nothing here overstates the product
// or implies medical authority. These routes are public so anyone — including an
// app-store reviewer — can read them without signing in.
const TABS = [
  { key: 'about', to: '/about', label: 'About', icon: InfoIcon },
  { key: 'privacy', to: '/privacy', label: 'Privacy', icon: Shield },
  { key: 'terms', to: '/terms', label: 'Terms', icon: FileText },
]

export function Info() {
  const { pathname } = useLocation()
  const active = TABS.find((x) => pathname.startsWith(x.to))?.key || 'about'

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="bg-white border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600">
              <LogoMark size={20} />
            </span>
            <span className="font-bold text-[15px] text-ink">PoshanMitra AI</span>
          </Link>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-indigo-600">
            <ArrowLeft size={15} /> Back
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <nav className="flex gap-2 mb-6">
          {TABS.map((tab) => {
            const on = active === tab.key
            return (
              <Link
                key={tab.key}
                to={tab.to}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                  on ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink-muted hover:bg-white/70'
                }`}
              >
                <tab.icon size={15} /> {tab.label}
              </Link>
            )
          })}
        </nav>

        <article className="rounded-2xl bg-white border border-line shadow-card p-6 sm:p-8 prose-sm">
          {active === 'about' && <About />}
          {active === 'privacy' && <Privacy />}
          {active === 'terms' && <Terms />}
        </article>
      </main>

      <DisclaimerFooter />
    </div>
  )
}

function H({ children }) {
  return <h2 className="text-lg font-bold text-ink mt-6 mb-2 first:mt-0">{children}</h2>
}
function P({ children }) {
  return <p className="text-sm text-ink-muted leading-relaxed mb-3">{children}</p>
}
function LI({ children }) {
  return <li className="text-sm text-ink-muted leading-relaxed">{children}</li>
}

function About() {
  return (
    <>
      <h1 className="text-2xl font-bold text-ink">About PoshanMitra AI</h1>
      <P><em>Swasth Maa, Swasth Shishu, Swasth Bharat</em> — a healthy mother, a healthy child, a healthy India.</P>
      <P>
        PoshanMitra AI is a maternal-health companion for pregnant women in India. It brings together simple,
        trustworthy support in one place: an AI helper (Mitra) for everyday pregnancy questions, a sample diet guide,
        government-scheme information and eligibility checks, nearby hospitals, awareness campaigns, short videos, and
        private on-device tools like a kick counter, contraction timer, weight and mood check-ins, and a hospital-bag
        checklist.
      </P>
      <P>It is available in English, हिन्दी and मराठी, and is free to use.</P>
      <H>What it is — and isn’t</H>
      <P>
        Mitra shares general information and gentle guidance. It is <strong>not a doctor</strong> and does not give
        diagnoses, prescribe medicines, or replace your antenatal check-ups. For anything concerning, it will always
        point you toward your doctor or the hospital — never away from them.
      </P>
      <H>A private beta</H>
      <P>
        This is an early, private beta used by a small group. We are still improving it, so some features are marked
        “Demo”. We’d love your feedback — you can reach us at the email your invite came from.
      </P>
    </>
  )
}

function Privacy() {
  return (
    <>
      <h1 className="text-2xl font-bold text-ink">Privacy</h1>
      <P>We’ve designed PoshanMitra to keep your information with <strong>you</strong>. In plain language:</P>
      <H>Your data stays on your device</H>
      <P>
        Your profile, reports you note, reminders, tool entries (kicks, weight, mood, checklist) and your chat history
        are saved in your browser’s local storage on this device. They are not uploaded to our servers and we cannot
        see them.
      </P>
      <H>What leaves your device</H>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <LI>
          <strong>Chat messages:</strong> when you ask Mitra something, your message (with a little pregnancy context,
          like your week) is sent securely to Google’s Gemini AI to generate a reply. We route it through a small server
          so our AI key stays private; we don’t store your chats on that server.
        </LI>
        <LI>
          <strong>Optional sign-in:</strong> if you choose Google or email sign-in, that is handled by Supabase (our
          authentication provider) to confirm it’s you. You can use most of the app without signing in.
        </LI>
      </ul>
      <H>Sensitive details</H>
      <P>
        We never ask for your full Aadhaar number to be stored. The verification feature is a clearly-labelled demo and
        keeps only a masked value (last 4 digits) on your device. We do not sell your data or show you ads.
      </P>
      <H>Payments</H>
      <P>
        We don’t take payments. Shop and booking “checkouts” are demos that create a reference number only — no money
        changes hands, and “Buy” links simply open a trusted store like Amazon or Flipkart.
      </P>
      <H>Deleting your data</H>
      <P>
        You’re in control. Go to <strong>Settings → Delete all my data</strong> to erase everything this app has stored
        on your device, at any time.
      </P>
      <P className="text-xs">
        We aim to follow the spirit of India’s Digital Personal Data Protection (DPDP) Act. As a beta, this notice may
        be updated as the product grows.
      </P>
    </>
  )
}

function Terms() {
  return (
    <>
      <h1 className="text-2xl font-bold text-ink">Terms of Use</h1>
      <H>Information, not medical advice</H>
      <P>
        PoshanMitra provides general information to support your pregnancy journey. It does not provide medical advice,
        diagnosis or treatment, and using it does not create a doctor–patient relationship. Always follow the guidance
        of your own doctor and your antenatal check-ups.
      </P>
      <H>In an emergency</H>
      <P>
        If you notice warning signs or feel unwell, do not wait. Call <strong>108</strong> for an ambulance or
        <strong> 112</strong> for emergencies, or go to your nearest hospital right away.
      </P>
      <H>Demo features</H>
      <P>
        Some features are labelled “Demo” (for example Aadhaar verification, OTP for an alternate number, update
        channels, and Shop/booking checkout). These simulate a flow so you can see how it works; they do not perform a
        real government check, send real messages, or take payment.
      </P>
      <H>Beta software</H>
      <P>
        This is an early beta provided “as is”, without warranties. We’re improving it continuously and features may
        change. Please use your own judgement, and tell us what could be better.
      </P>
      <H>Contact</H>
      <P>Questions about these terms? Reach us at the email your beta invite came from.</P>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Phone, ArrowRight, ShieldCheck, Loader2, Check } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { Button } from './ui/Button.jsx'
import { LogoMark } from './Logo.jsx'
import { DisclaimerFooter } from './layout/DisclaimerFooter.jsx'
import { authAvailable, signInWithGoogle, sendEmailOtp, verifyEmailOtp } from '../lib/auth.js'
import { normalizeMobile, isValidMobile, isValidEmail } from '../lib/validate.js'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Pointer-driven 3D tilt on the brand visual (CSS 3D, no library; reduced-motion safe).
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(1000px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`
    }
    const reset = () => {
      el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
    }
  }, [ref])
}

const GoogleG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C39.9 36.7 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
)

export function AuthScreen({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const { profile, login } = useProfile()
  const navigate = useNavigate()
  const tiltRef = useRef(null)
  useTilt(tiltRef)

  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneStep, setPhoneStep] = useState('enter') // enter | otp
  const [phoneOtp, setPhoneOtp] = useState('')
  const [busy, setBusy] = useState('') // '', 'google', 'email', 'otp', 'phone'
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const afterAuth = () => navigate(profile?.onboarded ? '/' : '/onboarding')

  async function onGoogle() {
    setError('')
    setBusy('google')
    const { error: err } = await signInWithGoogle()
    if (err) {
      setBusy('')
      setError(err === 'not-configured' ? 'Google sign-in isn’t set up yet. Use email or phone below.' : err)
    }
    // On success the browser redirects to Google, then back.
  }

  async function onSendOtp(e) {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) return setError('Please enter a valid email address.')
    setBusy('email')
    const { error: err } = await sendEmailOtp(email)
    setBusy('')
    if (err) {
      setError(err === 'not-configured' ? 'Email sign-in isn’t set up yet. Use your phone below.' : err)
      return
    }
    setOtpSent(true)
    setNotice(`We emailed a 6-digit code to ${email}.`)
  }

  async function onVerifyOtp(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code from your email.')
    setBusy('otp')
    const { error: err, session } = await verifyEmailOtp(email, otp)
    setBusy('')
    if (err || !session) return setError(err || 'That code didn’t work. Try again.')
    afterAuth()
  }

  function onSendPhoneOtp(e) {
    e.preventDefault()
    setError('')
    if (!isValidMobile(phone)) return setError('Please enter a valid 10-digit mobile number.')
    // DEMO OTP: real SMS needs a paid provider, so this is a simulated OTP step —
    // any 6 digits verify. (Wire a real SMS provider later to make it live.)
    setPhoneStep('otp')
    setNotice(`OTP sent to +91 ${phone}. Demo — enter any 6 digits.`)
  }

  function onVerifyPhone(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(phoneOtp)) return setError('Enter the 6-digit OTP.')
    login()
    afterAuth()
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Brand panel with animated 3D card */}
        <div className="relative lg:w-1/2 overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-8 lg:p-16 flex flex-col justify-between">
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-10 w-72 h-72 bg-white/10 lp-blob" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 -right-10 w-80 h-80 bg-white/10 lp-blob" style={{ animationDelay: '4s' }} />

          <Link to="/welcome" className="relative flex items-center gap-3 w-fit">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15">
              <LogoMark size={24} />
            </span>
            <div>
              <p className="font-bold text-lg leading-none">PoshanMitra AI</p>
              <p className="text-[12px] text-indigo-100 mt-1">Swasth Maa, Swasth Shishu, Swasth Bharat</p>
            </div>
          </Link>

          <div className="relative my-10 flex justify-center">
            {/* 3D tilt card */}
            <div ref={tiltRef} className="w-full max-w-sm rounded-3xl bg-white/10 backdrop-blur border border-white/15 p-6 shadow-2xl transition-transform duration-200 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-3" style={{ transform: 'translateZ(40px)' }}>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15">
                  <LogoMark size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none">Mitra</p>
                  <p className="text-[11px] text-indigo-100 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Your companion
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/90 rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5" style={{ transform: 'translateZ(24px)' }}>
                Welcome 🌸 I'll guide you through every week — diet, check-ups, schemes and more, in your language.
              </p>
              <div className="mt-4 flex flex-wrap gap-2" style={{ transform: 'translateZ(60px)' }}>
                {['Diet', 'Schemes', 'Hospitals', 'Safety-first'].map((t) => (
                  <span key={t} className="text-[11px] font-medium rounded-full bg-white/15 px-2.5 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="relative text-[12px] text-indigo-100 flex items-center gap-2">
            <ShieldCheck size={15} /> Private beta · your information stays on your device.
          </p>
        </div>

        {/* Auth form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-sm lp-pop">
            <h1 className="text-2xl font-bold text-ink">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {isSignup ? 'Start your healthy pregnancy journey.' : 'Sign in to continue your journey.'}
            </p>

            <div className="mt-6 rounded-2xl bg-white border border-line shadow-card p-6 space-y-4">
              {/* Google */}
              <button
                onClick={onGoogle}
                disabled={busy === 'google'}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {busy === 'google' ? <Loader2 size={16} className="animate-spin" /> : <GoogleG />}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-[11px] text-ink-faint">
                <span className="h-px flex-1 bg-line" /> or use email <span className="h-px flex-1 bg-line" />
              </div>

              {/* Email OTP */}
              {!otpSent ? (
                <form onSubmit={onSendOtp} className="space-y-2.5">
                  <label className="block">
                    <span className="sr-only">Email</span>
                    <div className="flex items-center rounded-xl border border-line bg-canvas focus-within:ring-2 focus-within:ring-indigo-500">
                      <Mail size={16} className="ml-3 text-ink-faint" />
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        placeholder="you@example.com"
                        className="flex-1 bg-transparent py-2.5 px-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                      />
                    </div>
                  </label>
                  <Button type="submit" className="w-full" disabled={busy === 'email'}>
                    {busy === 'email' ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} Email me a code
                  </Button>
                </form>
              ) : (
                <form onSubmit={onVerifyOtp} className="space-y-2.5">
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                    placeholder="6-digit code"
                    className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-center text-lg tracking-[0.3em] font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  <Button type="submit" className="w-full" disabled={busy === 'otp'}>
                    {busy === 'otp' ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Verify & continue
                  </Button>
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setNotice('') }} className="w-full text-xs text-ink-muted hover:text-ink">
                    ← Use a different email
                  </button>
                </form>
              )}

              <div className="flex items-center gap-3 text-[11px] text-ink-faint">
                <span className="h-px flex-1 bg-line" /> or your phone <span className="h-px flex-1 bg-line" />
              </div>

              {/* Phone OTP (demo — any 6 digits) */}
              {phoneStep === 'enter' ? (
                <form onSubmit={onSendPhoneOtp} className="space-y-2.5">
                  <div className="flex items-center rounded-xl border border-line bg-canvas focus-within:ring-2 focus-within:ring-indigo-500">
                    <Phone size={15} className="ml-3 text-ink-faint" />
                    <span className="pl-2 pr-1 text-sm text-ink-muted">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => { setPhone(normalizeMobile(e.target.value)); setError('') }}
                      placeholder="98765 43210"
                      className="flex-1 bg-transparent py-2.5 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full">
                    Send OTP <ArrowRight size={15} />
                  </Button>
                </form>
              ) : (
                <form onSubmit={onVerifyPhone} className="space-y-2.5">
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => { setPhoneOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                    placeholder="6-digit OTP"
                    className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-center text-lg tracking-[0.3em] font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  <Button type="submit" variant="secondary" className="w-full">
                    <Check size={16} /> Verify & {isSignup ? 'continue' : 'sign in'}
                  </Button>
                  <button type="button" onClick={() => { setPhoneStep('enter'); setPhoneOtp(''); setNotice('') }} className="w-full text-xs text-ink-muted hover:text-ink">
                    ← Change number
                  </button>
                </form>
              )}

              {notice && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{notice}</p>}
              {error && <p className="text-xs text-red-600">{error}</p>}
              {!authAvailable() && (
                <p className="text-[11px] text-ink-faint">Phone quick-start works offline. Google/email activate once the backend is configured.</p>
              )}
            </div>

            <p className="mt-5 text-sm text-ink-muted text-center">
              {isSignup ? (
                <>Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Log in</Link></>
              ) : (
                <>New here? <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">Create an account</Link></>
              )}
            </p>
          </div>
        </div>
      </div>
      <DisclaimerFooter />
    </div>
  )
}

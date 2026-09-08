import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShieldCheck } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Illustration } from '../components/Illustration.jsx'

export function Login() {
  const { login, profile } = useProfile()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const digits = phone.replace(/\D/g, '')
  const valid = digits.length === 10

  const handleContinue = (e) => {
    e.preventDefault()
    if (!valid) {
      setError('Please enter a 10-digit mobile number.')
      return
    }
    login()
    // No profile yet → onboarding; else straight to the app.
    navigate(profile ? '/' : '/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-canvas">
      {/* Left — brand panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-10 lg:p-16 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/15">
            <Heart size={22} fill="#EEF0FF" stroke="#EEF0FF" />
          </span>
          <div>
            <p className="font-bold text-lg">PoshanMitra AI</p>
            <p className="text-[12px] text-indigo-100">Swasth Maa, Swasth Shishu, Swasth Bharat</p>
          </div>
        </div>

        <div className="my-10">
          <Illustration name="pregnant-seated" size={160} className="opacity-95" />
          <h1 className="mt-6 text-3xl font-bold leading-tight max-w-sm">
            Your caring companion through pregnancy.
          </h1>
          <p className="mt-3 text-indigo-100 max-w-sm text-sm">
            Trusted guidance on diet, health and government schemes — in your language,
            on your device.
          </p>
        </div>

        <p className="text-[12px] text-indigo-100 flex items-center gap-2">
          <ShieldCheck size={15} /> Private beta. Your information stays on your device.
        </p>
      </div>

      {/* Right — sign-in card */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-white border border-line shadow-card p-7">
            <h2 className="text-xl font-bold text-ink">Welcome</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Enter your mobile number to continue.
            </p>

            <form onSubmit={handleContinue} className="mt-6 space-y-4">
              <div>
                <label htmlFor="phone" className="block text-[13px] font-medium text-ink mb-1.5">
                  Mobile number
                </label>
                <div className="flex items-center rounded-xl border border-line bg-canvas focus-within:ring-2 focus-within:ring-indigo-500">
                  <span className="pl-3 pr-2 text-sm text-ink-muted">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      setError('')
                    }}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent py-2.5 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={!valid}>
                Continue
              </Button>
            </form>

            <p className="mt-5 text-[12px] text-ink-faint text-center">
              Private beta. Your information stays on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  MessageSquare,
  Lock,
} from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { schemes } from '../data/schemes.js'
import { evaluateEligibility, STATUS } from '../lib/eligibility.js'
import { ordinalMonth } from '../lib/pregnancy.js'

const ELIG_KEY = 'poshanmitra_eligibility'

const STATES = [
  'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan',
  'Karnataka', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Delhi',
]
const DISTRICTS = {
  Maharashtra: ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Kolhapur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
  Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
}
const INCOME = ['Below ₹1 lakh', '₹1–2.5 L', '₹2.5–5 L', '₹5–8 L', 'Above ₹8 L']
const RATION = ['APL', 'BPL', 'Antyodaya', 'None']
const CATEGORY = ['General', 'OBC', 'SC', 'ST']

const STEPS = [
  'Basic Information',
  'Family & Income Details',
  'Pregnancy Details',
  'Review & Results',
]

function loadAnswers(profile) {
  try {
    const saved = JSON.parse(localStorage.getItem(ELIG_KEY) || 'null')
    if (saved && typeof saved === 'object') return saved
  } catch {
    /* ignore */
  }
  // Prefill from profile. Age may be a bracket string — leave numeric age blank
  // if we can't parse a clean number.
  const parsedAge = Number(String(profile?.age || '').match(/\d+/)?.[0])
  return {
    fullName: profile?.name || '',
    age: Number.isFinite(parsedAge) ? String(parsedAge) : '',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    mobile: '',
    email: '',
    citizen: 'Yes',
    hasAadhaar: '',
    income: '',
    rationCard: '',
    category: '',
    govtEmployee: '',
    bankLinkedAadhaar: '',
    pregnancyNumber: '',
    currentMonth: profile?.month ? String(profile.month) : '',
    anganwadiRegistered: '',
    hospitalDelivery: '',
    mcpCard: '',
  }
}

export function SchemeEligibility() {
  const { profile } = useProfile()
  const [step, setStep] = useState(0)
  const [a, setA] = useState(() => loadAnswers(profile))

  function set(field, value) {
    setA((prev) => {
      const next = { ...prev, [field]: value }
      try {
        localStorage.setItem(ELIG_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const step1Valid =
    a.fullName && a.age && a.state && a.district && a.city && /^\d{10}$/.test(a.mobile.replace(/\D/g, '')) && a.citizen && a.hasAadhaar
  const step2Valid = a.income && a.rationCard && a.category && a.govtEmployee && a.bankLinkedAadhaar
  const step3Valid = a.pregnancyNumber && a.currentMonth && a.anganwadiRegistered && a.hospitalDelivery && a.mcpCard

  const canContinue = [step1Valid, step2Valid, step3Valid, true][step]

  return (
    <>
      <Link to="/schemes" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-3">
        <ArrowLeft size={15} /> Back to Schemes
      </Link>
      <PageHeader
        title="Check Your Eligibility"
        subtitle="Answer a few questions to see which schemes you may be eligible for."
      />

      {/* Step indicator */}
      <ol className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border ${
                i === step
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : i < step
                  ? 'bg-white border-line text-ink hover:bg-canvas'
                  : 'bg-white border-line text-ink-faint'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-white/20' : 'bg-canvas'
                }`}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-ink-faint" />}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-white border border-line shadow-card p-5 sm:p-6">
            {step === 0 && <Step1 a={a} set={set} />}
            {step === 1 && <Step2 a={a} set={set} />}
            {step === 2 && <Step3 a={a} set={set} />}
            {step === 3 && <Step4 a={a} goto={setStep} />}

            {/* Local-only privacy note */}
            <div className="mt-5 flex items-center gap-2 text-xs text-ink-faint">
              <Lock size={13} /> All your answers are stored only on this device.
            </div>

            {/* Nav */}
            <div className="mt-5 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => canContinue && setStep((s) => s + 1)} disabled={!canContinue}>
                  Save & Continue <ChevronRight size={16} />
                </Button>
              ) : (
                <Button as={Link} to="/schemes" variant="secondary">
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-3">How It Works</h2>
            <ol className="space-y-3 text-sm">
              {[
                'Answer a few quick questions about you and your family.',
                'We check them against each scheme’s public rules.',
                'See which schemes you may be eligible for and how to apply.',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-ink-muted">{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <h2 className="text-base font-semibold text-ink">Why your information matters</h2>
            </div>
            <p className="text-sm text-ink-muted">
              Your answers help us match you to the right schemes. They stay on your device —
              nothing is uploaded, and we never ask for your Aadhaar or bank account number.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink">Need help?</h2>
            <p className="mt-1 text-sm text-ink-muted">Ask Mitra about any scheme.</p>
            <Button as={Link} to="/chat?q=Which%20schemes%20can%20I%20apply%20for" variant="secondary" className="mt-3 w-full">
              <MessageSquare size={16} /> Ask Mitra
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}

// ---- Field helpers ----
function Field({ label, optional, children, valid }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink mb-1.5">
        {label}
        {optional && <span className="text-ink-faint font-normal">(optional)</span>}
        {valid && <Check size={14} className="text-emerald-600" />}
      </span>
      {children}
    </label>
  )
}
const inputCls =
  'w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

function Radio({ label, options, value, onChange, valid }) {
  return (
    <Field label={label} valid={valid}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              value === o ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink hover:bg-canvas'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </Field>
  )
}

function Step1({ a, set }) {
  const districts = DISTRICTS[a.state] || ['Other']
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Basic Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" valid={!!a.fullName}>
          <input className={inputCls} value={a.fullName} onChange={(e) => set('fullName', e.target.value)} />
        </Field>
        <Field label="Age (years)" valid={!!a.age}>
          <input type="number" min="14" max="60" className={inputCls} value={a.age} onChange={(e) => set('age', e.target.value)} />
        </Field>
        <Field label="State" valid={!!a.state}>
          <select
            className={inputCls}
            value={a.state}
            onChange={(e) => {
              set('state', e.target.value)
              set('district', (DISTRICTS[e.target.value] || ['Other'])[0])
            }}
          >
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="District" valid={!!a.district}>
          <select className={inputCls} value={a.district} onChange={(e) => set('district', e.target.value)}>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
            <option>Other</option>
          </select>
        </Field>
        <Field label="City / Village" valid={!!a.city}>
          <input className={inputCls} value={a.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label="Mobile Number" valid={/^\d{10}$/.test(a.mobile.replace(/\D/g, ''))}>
          <div className="flex items-center rounded-xl border border-line bg-canvas focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="pl-3 pr-1.5 text-sm text-ink-muted">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              className="flex-1 bg-transparent py-2.5 pr-3 text-sm focus:outline-none"
              value={a.mobile}
              onChange={(e) => set('mobile', e.target.value)}
            />
          </div>
        </Field>
        <Field label="Email" optional valid={false}>
          <input type="email" className={inputCls} value={a.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>
      <Radio label="Are you an Indian Citizen?" options={['Yes', 'No']} value={a.citizen} onChange={(v) => set('citizen', v)} valid={!!a.citizen} />
      <Radio label="Do you have an Aadhaar Card?" options={['Yes', 'No']} value={a.hasAadhaar} onChange={(v) => set('hasAadhaar', v)} valid={!!a.hasAadhaar} />
      <p className="text-xs text-ink-faint">We only ask whether you have an Aadhaar card — never the number.</p>
    </div>
  )
}

function Step2({ a, set }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Family & Income Details</h2>
      <Field label="Annual household income" valid={!!a.income}>
        <select className={inputCls} value={a.income} onChange={(e) => set('income', e.target.value)}>
          <option value="">Select a bracket</option>
          {INCOME.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </Field>
      <Radio label="Ration card type" options={RATION} value={a.rationCard} onChange={(v) => set('rationCard', v)} valid={!!a.rationCard} />
      <Radio label="Category" options={CATEGORY} value={a.category} onChange={(v) => set('category', v)} valid={!!a.category} />
      <Radio label="Is anyone in your family a government employee?" options={['Yes', 'No']} value={a.govtEmployee} onChange={(v) => set('govtEmployee', v)} valid={!!a.govtEmployee} />
      <Radio label="Do you have a bank account linked to Aadhaar?" options={['Yes', 'No']} value={a.bankLinkedAadhaar} onChange={(v) => set('bankLinkedAadhaar', v)} valid={!!a.bankLinkedAadhaar} />
    </div>
  )
}

function Step3({ a, set }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Pregnancy Details</h2>
      <Radio label="Which pregnancy is this?" options={['First', 'Second', 'Third or more']} value={a.pregnancyNumber} onChange={(v) => set('pregnancyNumber', v)} valid={!!a.pregnancyNumber} />
      <Field label="Current month" valid={!!a.currentMonth}>
        <select className={inputCls} value={a.currentMonth} onChange={(e) => set('currentMonth', e.target.value)}>
          <option value="">Select</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => (
            <option key={m} value={m}>
              {ordinalMonth(m)} month
            </option>
          ))}
        </select>
      </Field>
      <Radio label="Are you registered at an Anganwadi centre?" options={['Yes', 'No', "Don't know"]} value={a.anganwadiRegistered} onChange={(v) => set('anganwadiRegistered', v)} valid={!!a.anganwadiRegistered} />
      <Radio label="Planning a hospital delivery?" options={['Yes', 'No', 'Not decided']} value={a.hospitalDelivery} onChange={(v) => set('hospitalDelivery', v)} valid={!!a.hospitalDelivery} />
      <Radio label="Do you have a MCP card?" options={['Yes', 'No']} value={a.mcpCard} onChange={(v) => set('mcpCard', v)} valid={!!a.mcpCard} />
    </div>
  )
}

function Step4({ a, goto }) {
  const results = useMemo(() => evaluateEligibility(a), [a])
  const byId = useMemo(() => Object.fromEntries(schemes.map((s) => [s.id, s])), [])

  const summaryRows = [
    { label: 'Name', value: a.fullName, step: 0 },
    { label: 'Age', value: a.age, step: 0 },
    { label: 'State / District', value: `${a.state}, ${a.district}`, step: 0 },
    { label: 'Income', value: a.income, step: 1 },
    { label: 'Ration card', value: a.rationCard, step: 1 },
    { label: 'Category', value: a.category, step: 1 },
    { label: 'Pregnancy', value: a.pregnancyNumber, step: 2 },
    { label: 'Hospital delivery', value: a.hospitalDelivery, step: 2 },
  ]

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-ink">Review & Results</h2>

      {/* Answer summary */}
      <div className="rounded-2xl border border-line bg-canvas p-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {summaryRows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{r.label}</dt>
              <dd className="flex items-center gap-2 text-ink text-right">
                {r.value || '—'}
                <button onClick={() => goto(r.step)} className="text-xs text-indigo-600 hover:text-indigo-700 underline">
                  Edit
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((res) => {
          const s = byId[res.id]
          if (!s) return null
          return <ResultCard key={res.id} scheme={s} result={res} />
        })}
      </div>

      {/* Departmental confirmation note — SAFETY.md §5 */}
      <div className="rounded-2xl border border-line bg-white p-4 text-sm text-ink-muted">
        Final eligibility is decided by the government department. Please confirm at your
        Anganwadi centre or the official portal.
      </div>
    </div>
  )
}

function ResultCard({ scheme, result }) {
  const tone =
    result.status === STATUS.ELIGIBLE ? 'success' : result.status === STATUS.NEED_INFO ? 'warning' : 'neutral'
  const label =
    result.status === STATUS.ELIGIBLE
      ? 'You may be eligible'
      : result.status === STATUS.NEED_INFO
      ? 'Need more info'
      : 'Not eligible'

  return (
    <section className="rounded-2xl border border-line bg-white shadow-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{scheme.name}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">{scheme.benefits[0]}</p>
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>
      <p className="mt-2 text-xs text-ink-muted">{result.reason}</p>

      <details className="mt-2">
        <summary className="text-xs text-indigo-600 cursor-pointer">Required documents</summary>
        <ul className="mt-1.5 space-y-1">
          {scheme.documents.map((d) => (
            <li key={d} className="flex items-center gap-2 text-xs text-ink">
              <FileText size={12} className="text-ink-faint" /> {d}
            </li>
          ))}
        </ul>
      </details>

      {result.status !== STATUS.NOT_ELIGIBLE && (
        <a
          href={scheme.portal}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Apply on Official Portal <ExternalLink size={14} />
        </a>
      )}
    </section>
  )
}

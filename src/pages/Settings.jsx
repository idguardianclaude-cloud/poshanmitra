import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Trash2, Bell, Globe, MessageSquare, RefreshCw, ShieldCheck, Phone, ExternalLink, BadgeCheck, IdCard } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { storage } from '../lib/storage.js'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useT, LANGS } from '../lib/i18n.js'
import { ordinalMonth, ordinalTrimester } from '../lib/pregnancy.js'
import { cleanName, isValidName, normalizeMobile, isValidMobile } from '../lib/validate.js'
import { RemindersManager } from '../components/RemindersManager.jsx'
import { CloudBackup } from '../components/CloudBackup.jsx'
import { CareTeam } from '../components/CareTeam.jsx'
import { ProfileCompleteness } from '../components/ProfileCompleteness.jsx'

const FOODS = ['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Jain']

export function Settings() {
  const { profile, authUser, updateProfile, lang, setLang, deleteAllData } = useProfile()
  const t = useT()
  const navigate = useNavigate()

  const [name, setName] = useState(profile?.name || '')
  const [food, setFood] = useState(profile?.food || '')
  const [notif, setNotif] = useState(storage.getNotifications())
  const [saved, setSaved] = useState(false)

  // Verification & contact
  const [altPhone, setAltPhone] = useState(profile?.altPhone || '')
  const [abha, setAbha] = useState(profile?.abha || '')
  const [aadhaar, setAadhaar] = useState('')
  const [vSaved, setVSaved] = useState(false)
  const altOk = !altPhone || isValidMobile(altPhone)
  const aadhaarVerified = Boolean(profile?.aadhaarVerified)
  const altVerified = Boolean(profile?.altPhoneVerified)
  const abhaLinked = Boolean(profile?.abha)
  const channels = profile?.updateChannels || { whatsapp: true, sms: false, email: Boolean(authUser?.email) }

  function saveVerification() {
    if (!altOk) return
    updateProfile({ altPhone: altPhone || null, abha: abha.trim().slice(0, 40) || null })
    setVSaved(true)
    setTimeout(() => setVSaved(false), 1800)
  }
  // DEMO: real Aadhaar verification needs a UIDAI licence. We NEVER store the full
  // number — only a masked form + a verified flag, and it's clearly marked "Demo".
  function verifyAadhaar() {
    const digits = aadhaar.replace(/\D/g, '')
    if (digits.length !== 12) return
    updateProfile({ aadhaarMasked: `XXXX XXXX ${digits.slice(-4)}`, aadhaarVerified: true })
    setAadhaar('')
  }
  function verifyAlt() {
    if (!isValidMobile(altPhone)) return
    updateProfile({ altPhone, altPhoneVerified: true }) // DEMO OTP (no SMS)
  }
  function toggleChannel(k) {
    updateProfile({ updateChannels: { ...channels, [k]: !channels[k] } })
  }

  const nameOk = isValidName(name)
  const dirty =
    (nameOk && cleanName(name) !== (profile?.name || '')) || food !== (profile?.food || '')

  function save() {
    if (!nameOk) return
    updateProfile({ name: cleanName(name), food: food || null })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  function toggleNotif() {
    const next = !notif
    setNotif(next)
    storage.setNotifications(next)
  }

  function handleDelete() {
    if (window.confirm(t('header.deleteConfirm'))) {
      deleteAllData()
      navigate('/login')
    }
  }

  const conditions = Array.isArray(profile?.conditions) ? profile.conditions : []

  return (
    <>
      <PageHeader title={t('settings.title')} subtitle={t('settings.sub')} />

      <div className="max-w-2xl space-y-6">
        {/* Profile completeness nudge (hidden once 100%) */}
        <ProfileCompleteness />

        {/* Profile */}
        <section className="rounded-2xl bg-white border border-line shadow-card p-5">
          <h2 className="text-base font-semibold text-ink mb-4">{t('settings.profile')}</h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">{t('settings.editName')}</span>
              <input
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              {name && !nameOk && <p className="mt-1 text-xs text-red-600">{t('valid.name')}</p>}
            </label>

            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">{t('settings.foodPref')}</span>
              <select
                value={food}
                onChange={(e) => setFood(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="">{t('settings.notSet')}</option>
                {FOODS.map((f) => (
                  <option key={f} value={f}>
                    {t(`food.${f}`)}
                  </option>
                ))}
              </select>
              <span className="text-xs text-ink-faint mt-1 block">
                {t('nav.diet')} · {t('diet.samplePill')}
              </span>
            </label>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-ink-muted">{t('dash.pregnancyMonth')}</p>
                <p className="font-medium text-ink">
                  {profile?.month
                    ? `${ordinalMonth(profile.month, lang)} · ${ordinalTrimester(profile.trimester, lang)}`
                    : t('settings.notSet')}
                </p>
              </div>
              <div>
                <p className="text-ink-muted">{t('settings.conditionsLabel')}</p>
                <p className="font-medium text-ink">
                  {conditions.length
                    ? conditions.map((c) => t(`conditions.${c}`)).join(', ')
                    : t('settings.notSet')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button onClick={save} disabled={!dirty || !nameOk}>
                {saved ? (
                  <>
                    <Check size={16} /> {t('settings.saved')}
                  </>
                ) : (
                  t('settings.saveChanges')
                )}
              </Button>
              <Button as={Link} to="/onboarding" variant="ghost">
                <RefreshCw size={15} /> {t('settings.redoSetup')}
              </Button>
            </div>
          </div>
        </section>

        {/* Verification & contact */}
        <section className="rounded-2xl bg-white border border-line shadow-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <BadgeCheck size={18} className="text-indigo-600" />
            <h2 className="text-base font-semibold text-ink">Verification & contact</h2>
          </div>
          <p className="text-xs text-ink-muted mb-4">Optional. Helps us personalise care and reach you.</p>

          <div className="space-y-4">
            {/* Email (verified via Google / email sign-in) */}
            {authUser?.email && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink truncate">{authUser.email}</p>
                  <p className="text-xs text-emerald-700">Verified email ({authUser.provider === 'google' ? 'Google' : 'email'})</p>
                </div>
                <BadgeCheck size={18} className="text-emerald-600 shrink-0" />
              </div>
            )}

            {/* Aadhaar (demo verification) */}
            <div>
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Aadhaar <span className="text-ink-faint font-normal">(demo verification)</span></span>
              {aadhaarVerified ? (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{profile?.aadhaarMasked || 'XXXX XXXX ••••'}</p>
                    <p className="text-xs text-emerald-700">Verified · Demo</p>
                  </div>
                  <BadgeCheck size={18} className="text-emerald-600 shrink-0" />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    inputMode="numeric"
                    maxLength={14}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/[^\d ]/g, ''))}
                    placeholder="1234 5678 9012"
                    className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  <Button variant="secondary" onClick={verifyAadhaar} disabled={aadhaar.replace(/\D/g, '').length !== 12}>
                    <ShieldCheck size={15} /> Verify (Demo)
                  </Button>
                </div>
              )}
              <p className="text-xs text-ink-faint mt-1">Demo only — real Aadhaar verification needs a UIDAI licence. We store only the last 4 digits, never the full number.</p>
            </div>

            {/* ABHA */}
            <div>
              <span className="text-[13px] font-medium text-ink mb-1.5 block">
                ABHA (Ayushman Bharat Health Account){abhaLinked && <span className="ml-1 text-xs text-emerald-700">· Linked</span>}
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={abha}
                  onChange={(e) => setAbha(e.target.value)}
                  placeholder="Your ABHA address (e.g. priya@abdm)"
                  className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <Button as="a" href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer" variant="secondary">
                  <IdCard size={15} /> Create / Link ABHA <ExternalLink size={13} />
                </Button>
              </div>
              <p className="text-xs text-ink-faint mt-1">Opens the official ABDM portal. We store only the ABHA address you type — never your Aadhaar.</p>
            </div>

            {/* Alternate number + demo OTP verify */}
            <div>
              <span className="text-[13px] font-medium text-ink mb-1.5 block">
                Alternate mobile number{altVerified && <span className="ml-1 text-xs text-emerald-700">· Verified</span>}
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center rounded-xl border border-line bg-canvas focus-within:ring-2 focus-within:ring-indigo-500 flex-1">
                  <Phone size={15} className="ml-3 text-ink-faint" />
                  <span className="pl-2 pr-1 text-sm text-ink-muted">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={altPhone}
                    onChange={(e) => setAltPhone(normalizeMobile(e.target.value))}
                    placeholder="98765 43210"
                    className="flex-1 bg-transparent py-2.5 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                  />
                </div>
                <Button variant="secondary" onClick={verifyAlt} disabled={!isValidMobile(altPhone) || altVerified}>
                  {altVerified ? (<><BadgeCheck size={15} /> Verified</>) : 'Verify (Demo)'}
                </Button>
              </div>
              {!altOk && <p className="mt-1 text-xs text-red-600">{t('valid.mobile')}</p>}
              <p className="text-xs text-ink-faint mt-1">For emergencies. OTP verification is simulated here (real SMS needs a provider).</p>
            </div>

            {/* Update channels (demo) */}
            <div>
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Get updates & reminders on</span>
              <div className="flex flex-wrap gap-2">
                {[['whatsapp', 'WhatsApp'], ['sms', 'SMS'], ['email', 'Email']].map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleChannel(k)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${channels[k] ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink-muted hover:bg-canvas'}`}
                  >
                    {channels[k] && <Check size={14} />} {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-faint mt-1">Demo — WhatsApp/SMS delivery is simulated for now (needs a paid gateway); email works once your sign-in email is set.</p>
            </div>

            <Button onClick={saveVerification} disabled={!altOk}>
              {vSaved ? (<><Check size={16} /> Saved</>) : 'Save details'}
            </Button>
          </div>
        </section>

        {/* Language */}
        <section className="rounded-2xl bg-white border border-line shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={18} className="text-indigo-600" />
            <h2 className="text-base font-semibold text-ink">{t('settings.languageTitle')}</h2>
          </div>
          <div className="inline-flex rounded-full border border-line p-0.5 bg-canvas">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  lang === l.code ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:text-ink'
                }`}
                lang={l.code}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl bg-white border border-line shadow-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-indigo-600" />
              <div>
                <h2 className="text-base font-semibold text-ink">{t('settings.notifTitle')}</h2>
                <p className="text-sm text-ink-muted">{t('settings.notifToggle')}</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={notif}
              onClick={toggleNotif}
              className={`relative w-12 h-7 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                notif ? 'bg-indigo-600' : 'bg-line'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  notif ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </section>

        {/* My care team — ASHA/ANM, doctor, hospital contacts */}
        <CareTeam />

        {/* Cloud backup & restore (opt-in, when signed in) */}
        <CloudBackup />

        {/* Reminders */}
        <RemindersManager />

        {/* Help */}
        <section className="rounded-2xl bg-white border border-line shadow-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <h2 className="text-base font-semibold text-ink">{t('settings.help')}</h2>
          </div>
          <p className="text-sm text-ink-muted">{t('settings.helpBody')}</p>
          <Button
            as={Link}
            to="/chat?q=I%20need%20help%20using%20this%20app"
            variant="secondary"
            className="mt-3"
          >
            <MessageSquare size={15} /> {t('settings.contactMitra')}
          </Button>
        </section>

        {/* Data */}
        <section className="rounded-2xl border border-line shadow-card p-5" style={{ backgroundColor: '#FEF2F2' }}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h2 className="text-base font-semibold text-ink">{t('settings.dangerZone')}</h2>
          </div>
          <p className="text-sm text-ink-muted">{t('settings.dataNote')}</p>
          <button
            onClick={handleDelete}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Trash2 size={15} /> {t('header.deleteData')}
          </button>
        </section>
      </div>
    </>
  )
}

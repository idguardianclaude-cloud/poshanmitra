import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Trash2, Bell, Globe, MessageSquare, RefreshCw, ShieldCheck } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { storage } from '../lib/storage.js'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useT, LANGS } from '../lib/i18n.js'
import { ordinalMonth, ordinalTrimester } from '../lib/pregnancy.js'
import { cleanName, isValidName } from '../lib/validate.js'
import { RemindersManager } from '../components/RemindersManager.jsx'

const FOODS = ['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Jain']

export function Settings() {
  const { profile, updateProfile, lang, setLang, deleteAllData } = useProfile()
  const t = useT()
  const navigate = useNavigate()

  const [name, setName] = useState(profile?.name || '')
  const [food, setFood] = useState(profile?.food || '')
  const [notif, setNotif] = useState(storage.getNotifications())
  const [saved, setSaved] = useState(false)

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

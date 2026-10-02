import { useState } from 'react'
import { Users, Phone, Check, Pencil } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { Button } from './ui/Button.jsx'
import { normalizeMobile, isValidMobile } from '../lib/validate.js'

// "My care team" — saves the people a woman actually turns to: her ASHA/ANM health
// worker, her doctor, and her hospital, each with one-tap calling. Stored on her
// profile (profile.careTeam), on-device. This connects the app to real human help —
// the ASHA worker is often her closest health contact — without any backend.
const ROLES = [
  { key: 'asha', label: 'ASHA / ANM worker', hint: 'Your local health worker' },
  { key: 'doctor', label: 'Doctor', hint: 'Your gynaecologist / physician' },
  { key: 'hospital', label: 'Hospital / PHC', hint: 'Where you have your check-ups' },
]

export function CareTeam() {
  const { profile, updateProfile } = useProfile()
  const saved = profile?.careTeam || {}
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(() => ({
    asha: { ...(saved.asha || { name: '', phone: '' }) },
    doctor: { ...(saved.doctor || { name: '', phone: '' }) },
    hospital: { ...(saved.hospital || { name: '', phone: '' }) },
  }))

  const hasAny = ROLES.some((r) => saved[r.key]?.name || saved[r.key]?.phone)

  function set(role, field, value) {
    setDraft((d) => ({ ...d, [role]: { ...d[role], [field]: value } }))
  }
  function save() {
    const clean = {}
    for (const r of ROLES) {
      const name = (draft[r.key].name || '').trim().slice(0, 60)
      const phone = normalizeMobile(draft[r.key].phone || '')
      if (name || phone) clean[r.key] = { name, phone }
    }
    updateProfile({ careTeam: clean })
    setEditing(false)
  }

  return (
    <section className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <Users size={18} className="text-indigo-600" />
        <h2 className="text-base font-semibold text-ink">My care team</h2>
        {hasAny && !editing && (
          <button onClick={() => setEditing(true)} className="ml-auto inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink">
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>

      {!editing && !hasAny ? (
        <>
          <p className="text-sm text-ink-muted">Save your health worker, doctor and hospital for one-tap calling when you need them.</p>
          <Button variant="secondary" className="mt-3" onClick={() => setEditing(true)}>Add contacts</Button>
        </>
      ) : editing ? (
        <div className="space-y-4">
          {ROLES.map((r) => (
            <div key={r.key}>
              <p className="text-[13px] font-medium text-ink">{r.label}</p>
              <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={draft[r.key].name}
                  onChange={(e) => set(r.key, 'name', e.target.value)}
                  placeholder={r.hint}
                  className="rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  value={draft[r.key].phone}
                  onChange={(e) => set(r.key, 'phone', e.target.value)}
                  inputMode="tel"
                  placeholder="Phone number"
                  className="rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {draft[r.key].phone && !isValidMobile(normalizeMobile(draft[r.key].phone)) && (
                <p className="mt-1 text-[11px] text-amber-600">Enter a valid 10-digit mobile number.</p>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Button onClick={save}><Check size={15} /> Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {ROLES.filter((r) => saved[r.key]?.name || saved[r.key]?.phone).map((r) => {
            const c = saved[r.key]
            return (
              <li key={r.key} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                <span className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{c.name || r.label}</p>
                  <p className="text-xs text-ink-faint">{r.label}{c.phone ? ` · ${c.phone}` : ''}</p>
                </div>
                {c.phone && (
                  <a
                    href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                    aria-label={`Call ${c.name || r.label}`}
                    className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:brightness-95"
                  >
                    <Phone size={13} /> Call
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-ink-faint">Saved only on this device. Your ASHA worker is often your nearest help — keep her number handy.</p>
    </section>
  )
}

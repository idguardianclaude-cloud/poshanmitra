import { useState } from 'react'
import { Phone, MapPin, Plus, Trash2, Share2, AlertTriangle, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button.jsx'
import { storage } from '../../lib/storage.js'
import { normalizeMobile, isValidMobile } from '../../lib/validate.js'

// Emergency help: one tap to call 108, share your live location with family on
// WhatsApp, and keep emergency contacts. Plus a quick danger-signs reference.
// Nothing here diagnoses — it's about getting help fast.

const DANGER_SIGNS = [
  'Heavy bleeding',
  'Severe or constant headache',
  'Blurred vision or seeing spots',
  'Fits or convulsions',
  'Baby moving much less than usual',
  'Water breaking or fluid leaking',
  'High fever',
  'Severe belly pain',
  'Sudden swelling of face/hands',
  'Difficulty breathing',
  'Can’t stop vomiting',
  'Fainting',
]

export function EmergencySOS() {
  const [contacts, setContacts] = useState(() => storage.getEmergencyContacts())
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [adding, setAdding] = useState(false)
  const [showSigns, setShowSigns] = useState(false)
  const [locBusy, setLocBusy] = useState(false)

  function persist(next) {
    setContacts(next)
    storage.setEmergencyContacts(next)
  }
  function addContact(e) {
    e.preventDefault()
    if (!name.trim() || !isValidMobile(phone)) return
    persist([...contacts, { id: `e-${Date.now()}`, name: name.trim().slice(0, 40), phone }])
    setName('')
    setPhone('')
    setAdding(false)
  }

  // Share current location on WhatsApp (to a contact if given, else generic).
  function shareLocation(toPhone) {
    const open = (text) => {
      const base = toPhone ? `https://wa.me/91${toPhone}` : 'https://wa.me/'
      window.open(`${base}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    }
    if (!navigator.geolocation) {
      open('I need help. Please call me — I am not well.')
      return
    }
    setLocBusy(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocBusy(false)
        const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        open(`I need help 🙏 I'm not well. My location: ${link}`)
      },
      () => {
        setLocBusy(false)
        open('I need help 🙏 I am not well. Please call me.')
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5 lg:col-span-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center bg-red-50">
          <AlertTriangle size={18} className="text-emergency" />
        </span>
        <h2 className="text-base font-semibold text-ink">Emergency</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">Get help fast. In an emergency, don't wait.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="tel:108"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emergency text-white px-4 py-3.5 text-base font-bold hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Phone size={18} /> Call 108 (Ambulance)
        </a>
        <Button variant="secondary" className="py-3.5" onClick={() => shareLocation(contacts[0]?.phone)} disabled={locBusy}>
          <MapPin size={16} /> {locBusy ? 'Getting location…' : 'Share my location'}
        </Button>
      </div>

      {/* Emergency contacts */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-semibold text-ink">Emergency contacts</p>
          {!adding && (
            <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
              <Plus size={13} /> Add
            </button>
          )}
        </div>

        {adding && (
          <form onSubmit={addContact} className="flex flex-col sm:flex-row gap-2 mb-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. Husband)" className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            <div className="flex items-center rounded-xl border border-line bg-canvas focus-within:ring-2 focus-within:ring-indigo-500 flex-1">
              <span className="pl-3 pr-1 text-sm text-ink-muted">+91</span>
              <input type="tel" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(normalizeMobile(e.target.value))} placeholder="98765 43210" className="flex-1 bg-transparent py-2 pr-3 text-sm focus:outline-none" />
            </div>
            <Button type="submit" size="sm" disabled={!name.trim() || !isValidMobile(phone)}>Save</Button>
          </form>
        )}

        {contacts.length === 0 ? (
          <p className="text-xs text-ink-faint">Add family or your doctor for one-tap help.</p>
        ) : (
          <ul className="space-y-1.5">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 rounded-xl bg-canvas border border-line px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.name}</p>
                  <p className="text-xs text-ink-faint">+91 {c.phone}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={`tel:+91${c.phone}`} aria-label={`Call ${c.name}`} className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50"><Phone size={16} /></a>
                  <button onClick={() => shareLocation(c.phone)} aria-label="Share location" className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50"><Share2 size={16} /></button>
                  <button onClick={() => persist(contacts.filter((x) => x.id !== c.id))} aria-label="Remove" className="p-2 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Danger signs quick reference */}
      <div className="mt-5 border-t border-line pt-3">
        <button onClick={() => setShowSigns((s) => !s)} className="w-full flex items-center justify-between text-[13px] font-semibold text-ink">
          Danger signs — go to hospital now
          <ChevronDown size={16} className={`text-ink-faint transition-transform ${showSigns ? 'rotate-180' : ''}`} />
        </button>
        {showSigns && (
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {DANGER_SIGNS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-ink-muted">
                <AlertTriangle size={13} className="text-emergency shrink-0 mt-0.5" /> {d}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-ink-faint">If you notice any of these, call 108 or go to the nearest hospital immediately.</p>
      </div>
    </div>
  )
}

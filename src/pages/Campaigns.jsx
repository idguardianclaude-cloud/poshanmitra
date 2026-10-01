import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, MapPin, Users, ExternalLink, ArrowRight, MessageSquare, Share2,
  Check, CalendarPlus, Navigation, Mail, Trash2, Gift, Sparkles, X,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { useT } from '../lib/i18n.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { campaigns } from '../data/campaigns.js'
import { shareOnWhatsApp } from '../lib/whatsapp.js'
import { storage } from '../lib/storage.js'
import { formatIN } from '../lib/dates.js'
import {
  suggestDate, makeBooking, addBooking, removeBooking, bookingSummary,
  downloadICS, mailtoLink,
} from '../lib/campaignBooking.js'

export function Campaigns() {
  const t = useT()
  const { lang, profile } = useProfile()
  const [location, setLocationState] = useState(() => storage.getLocation())
  const [cityInput, setCityInput] = useState(() => storage.getLocation()?.city || '')
  const [locBusy, setLocBusy] = useState(false)
  const [bookings, setBookingsState] = useState(() => storage.getBookings())
  const [booking, setBooking] = useState(null) // campaign being booked

  function saveLocation(loc) {
    setLocationState(loc)
    storage.setLocation(loc)
  }
  function onSaveCity() {
    const city = cityInput.trim().slice(0, 60)
    saveLocation({ ...(location || {}), city })
  }
  function useMyLocation() {
    if (!navigator.geolocation) return
    setLocBusy(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveLocation({ ...(location || {}), lat: pos.coords.latitude, lng: pos.coords.longitude, nearMe: true })
        setLocBusy(false)
      },
      () => setLocBusy(false),
      { timeout: 8000 }
    )
  }

  function persistBookings(next) {
    setBookingsState(next)
    storage.setBookings(next)
  }
  function onBooked(b) {
    persistBookings(addBooking(bookings, b))
  }

  return (
    <>
      <PageHeader title={t('campaigns.title')} subtitle={t('campaigns.sub')} />

      {/* Location bar */}
      <div className="mb-5 rounded-2xl bg-white border border-line shadow-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <MapPin size={18} className="text-indigo-600 shrink-0" />
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onBlur={onSaveCity}
              onKeyDown={(e) => e.key === 'Enter' && onSaveCity()}
              placeholder="Your city or area (e.g. Pune)"
              className="flex-1 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={useMyLocation} disabled={locBusy}>
              <Navigation size={14} /> {locBusy ? 'Locating…' : 'Use my location'}
            </Button>
            <Button as={Link} to="/hospitals" size="sm">
              Facilities near me <ArrowRight size={14} />
            </Button>
          </div>
        </div>
        {(location?.city || location?.nearMe) && (
          <p className="mt-2 text-xs text-ink-faint inline-flex items-center gap-1">
            <Check size={12} className="text-emerald-600" />
            {location.city ? `Showing relevance for ${location.city}. ` : ''}
            These are nationwide drives — attend at your nearest government facility or Anganwadi.
          </p>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-indigo-100 shadow-card p-4 text-sm text-ink-muted" style={{ backgroundColor: '#EEF0FF' }}>
        {t('campaigns.intro')}
      </div>

      {/* My bookings */}
      {bookings.length > 0 && (
        <section className="mb-6 rounded-2xl bg-white border border-line shadow-card p-5">
          <h2 className="text-base font-semibold text-ink mb-3">My appointments</h2>
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 rounded-xl bg-canvas border border-line px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{b.campaignName}</p>
                  <p className="text-xs text-ink-faint">{formatIN(b.date, lang)}{b.time ? ` · ${b.time}` : ''}{b.place ? ` · ${b.place}` : ''}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => downloadICS(b)} aria-label="Add to calendar" title="Add to calendar" className="p-1.5 rounded-lg text-ink-faint hover:text-indigo-600 hover:bg-indigo-50"><CalendarPlus size={15} /></button>
                  <button onClick={() => shareOnWhatsApp(`My appointment\n${bookingSummary(b)}`)} aria-label="Share on WhatsApp" title="WhatsApp" className="p-1.5 rounded-lg text-ink-faint hover:text-emerald-600 hover:bg-emerald-50"><Share2 size={15} /></button>
                  <a href={mailtoLink(b)} aria-label="Email details" title="Email" className="p-1.5 rounded-lg text-ink-faint hover:text-indigo-600 hover:bg-indigo-50"><Mail size={15} /></a>
                  <button onClick={() => persistBookings(removeBooking(bookings, b.id))} aria-label="Remove" title="Remove" className="p-1.5 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {campaigns.map((c) => (
          <article key={c.id} className="rounded-2xl bg-white border border-line shadow-card p-5 flex flex-col">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.tint }}>
                <Calendar size={20} className="text-indigo-600" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-ink leading-snug">{c.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600"><Calendar size={12} /> {c.when}</span>
                  {c.cost && <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">{c.cost}</span>}
                </div>
              </div>
            </div>

            {c.benefits && (
              <p className="mt-3 inline-flex items-start gap-1.5 text-sm text-ink">
                <Sparkles size={15} className="text-indigo-500 shrink-0 mt-0.5" /> <span className="font-medium">{c.benefits}</span>
              </p>
            )}
            <p className="mt-2 text-sm text-ink-muted">{c.what}</p>

            {Array.isArray(c.perks) && c.perks.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-ink-muted inline-flex items-center gap-1 mb-1.5"><Gift size={12} className="text-indigo-500" /> What you get</p>
                <ul className="space-y-1">
                  {c.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ink-muted">
                      <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-start gap-2"><Users size={15} className="text-ink-faint shrink-0 mt-0.5" /><dd className="text-ink-muted">{c.forWho}</dd></div>
              <div className="flex items-start gap-2"><MapPin size={15} className="text-ink-faint shrink-0 mt-0.5" /><dd className="text-ink-muted">{c.where}</dd></div>
            </dl>

            <div className="mt-3 rounded-xl bg-canvas border border-line px-3 py-2 text-sm text-ink">
              <span className="font-medium">{t('campaigns.whatToDo')}: </span>{c.action}
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap pt-1">
              <Button size="sm" onClick={() => setBooking(c)}>
                <CalendarPlus size={14} /> {c.bookable ? 'Book a slot' : 'Set a reminder'}
              </Button>
              <Button as="a" href={c.link} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
                {t('campaigns.official')} <ExternalLink size={14} />
              </Button>
              <Button as={Link} to={`/chat?q=${encodeURIComponent(`Tell me more about ${c.name} and how it helps me`)}`} variant="ghost" size="sm">
                <MessageSquare size={14} /> {t('common.askMitra')}
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Cross-link to schemes */}
      <section className="mt-8 rounded-2xl bg-white border border-line shadow-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">{t('campaigns.schemesTitle')}</h2>
          <p className="text-sm text-ink-muted mt-0.5">{t('campaigns.schemesSub')}</p>
        </div>
        <Button as={Link} to="/schemes" variant="secondary">
          {t('campaigns.viewSchemes')} <ArrowRight size={15} />
        </Button>
      </section>

      {booking && (
        <BookingModal
          campaign={booking}
          defaultPlace={location?.city || ''}
          defaultName={profile?.name || ''}
          lang={lang}
          onClose={() => setBooking(null)}
          onBooked={onBooked}
        />
      )}
    </>
  )
}

function BookingModal({ campaign, defaultPlace, defaultName, lang, onClose, onBooked }) {
  const [date, setDate] = useState(() => suggestDate(campaign.cadence))
  const [time, setTime] = useState('')
  const [place, setPlace] = useState(defaultPlace)
  const [name, setName] = useState(defaultName)
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(null) // the booking once saved

  function submit(e) {
    e.preventDefault()
    const b = makeBooking(campaign, { date, time, place, name, phone })
    if (!b) return
    onBooked(b)
    setSaved(b)
  }

  return (
    <Modal open onClose={onClose} title={saved ? 'You’re all set 🌸' : (campaign.bookable ? 'Book a slot' : 'Set a reminder')}>
      {!saved ? (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-ink-muted">{campaign.name}</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Time <span className="text-ink-faint">(optional)</span></span>
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:00 AM" className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            </label>
          </div>
          <label className="block">
            <span className="text-[13px] font-medium text-ink mb-1.5 block">Place <span className="text-ink-faint">(facility / Anganwadi)</span></span>
            <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Nearest government facility" className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Phone <span className="text-ink-faint">(optional)</span></span>
              <input type="tel" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
            </label>
          </div>
          <p className="text-[11px] text-ink-faint">This is a personal reminder you keep on your device — not an official government booking. Attend at the facility on your chosen day.</p>
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={!date}><Check size={16} /> Save</Button>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <p className="text-sm font-medium text-ink">{saved.campaignName}</p>
            <p className="text-sm text-ink-muted mt-0.5">{formatIN(saved.date, lang)}{saved.time ? ` · ${saved.time}` : ''}{saved.place ? ` · ${saved.place}` : ''}</p>
          </div>
          <p className="text-sm text-ink-muted">Saved to <span className="font-medium text-ink">My appointments</span>. Get your details anytime:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button variant="secondary" size="sm" onClick={() => downloadICS(saved)}><CalendarPlus size={15} /> Add to calendar</Button>
            <Button variant="secondary" size="sm" onClick={() => shareOnWhatsApp(`My appointment\n${bookingSummary(saved)}`)}><Share2 size={15} /> WhatsApp</Button>
            <Button as="a" href={mailtoLink(saved)} variant="secondary" size="sm"><Mail size={15} /> Email</Button>
          </div>
          <div className="pt-1">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

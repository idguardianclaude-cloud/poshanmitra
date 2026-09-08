import { useMemo, useState } from 'react'
import {
  Search,
  MapPin,
  Navigation,
  Phone,
  BadgeCheck,
  Baby,
  ShieldCheck,
  Building2,
  Crosshair,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Illustration } from '../components/Illustration.jsx'
import {
  hospitals,
  FACILITY_OPTIONS,
  SPECIALITIES,
  directionsUrl,
  healthcareTips,
} from '../data/hospitals.js'

const DISTANCES = [
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 25 km', value: 25 },
]

export function Hospitals() {
  const [name, setName] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [facilities, setFacilities] = useState({ '24x7 Emergency': true, Cashless: true, Ambulance: true })
  const [distance, setDistance] = useState(10)
  // "Apply Filters" commits the working filters; the list reads the applied set.
  const [applied, setApplied] = useState({ name: '', speciality: '', facilities: {}, distance: 25 })

  const filtered = useMemo(() => {
    const active = Object.keys(applied.facilities).filter((k) => applied.facilities[k])
    return hospitals
      .filter((h) => {
        if (applied.name && !h.name.toLowerCase().includes(applied.name.toLowerCase())) return false
        if (applied.speciality && h.speciality !== applied.speciality) return false
        if (h.distanceKm > applied.distance) return false
        if (active.length && !active.every((f) => h.facilities.includes(f))) return false
        return true
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }, [applied])

  function applyFilters() {
    setApplied({ name, speciality, facilities: { ...facilities }, distance })
  }

  return (
    <>
      <PageHeader
        title="Nearby Hospitals"
        subtitle="Find hospitals and healthcare centers near you."
      />

      {/* Location + stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            defaultValue="Pune, Maharashtra, India"
            className="w-full rounded-xl border border-line bg-white pl-9 pr-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Your location"
          />
        </div>
        <Button variant="secondary">
          <Crosshair size={16} /> Use Current Location
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatChip icon={Building2} label="Hospitals Found" value="25+" />
        <StatChip icon={MapPin} label="Search Radius" value="5 km" />
        <StatChip icon={ShieldCheck} label="Emergency Care" value="24x7" />
        <StatChip icon={BadgeCheck} label="Cashless" value="Available" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-5">
          {/* Map placeholder */}
          <div className="relative rounded-2xl border border-line overflow-hidden h-56" style={{ backgroundColor: '#EFF6FF' }}>
            <MapGrid />
            {hospitals.map((h, i) => (
              <span
                key={h.id}
                className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
                style={{ left: `${h.pin.x}%`, top: `${h.pin.y}%` }}
                title={h.name}
              >
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rotate-45 -mt-1" />
              </span>
            ))}
            <span className="absolute bottom-2 right-2 text-[11px] text-ink-faint bg-white/80 rounded px-2 py-0.5">
              Map preview
            </span>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white border border-line shadow-card p-10 text-center text-sm text-ink-muted">
              No hospitals match your filters. Try widening the distance or clearing a facility.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((h, i) => (
                <HospitalRow key={h.id} hospital={h} index={i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Filter rail */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-line shadow-card p-5 space-y-4">
            <h2 className="text-base font-semibold text-ink">Filters</h2>

            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Search Hospital Name</span>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ruby Hall"
                  className="w-full rounded-xl border border-line bg-canvas pl-9 pr-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Speciality</span>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <option value="">All specialities</option>
                {SPECIALITIES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Facilities</span>
              <div className="space-y-2">
                {FACILITY_OPTIONS.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={!!facilities[f]}
                      onChange={(e) => setFacilities((prev) => ({ ...prev, [f]: e.target.checked }))}
                      className="rounded border-line text-indigo-600 focus-visible:ring-indigo-500"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-[13px] font-medium text-ink mb-1.5 block">Distance</span>
              <select
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {DISTANCES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>

            <Button className="w-full" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>

          {/* Emergency card — SAFETY: Call 108, not "Emergency Call" */}
          <div className="rounded-2xl border border-amber-200 shadow-card p-5" style={{ backgroundColor: '#FFFBEB' }}>
            <div className="flex items-start gap-3">
              <Illustration name="ambulance" size={56} />
              <div>
                <h2 className="text-base font-semibold text-ink">Need Emergency Help?</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Get immediate assistance for you and your baby.
                </p>
              </div>
            </div>
            <a
              href="tel:108"
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-base font-bold text-white"
              style={{ backgroundColor: '#DC2626' }}
            >
              <Phone size={18} /> Call 108
            </a>
          </div>

          {/* Healthcare tips */}
          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-3">Healthcare Tips</h2>
            <ul className="space-y-2">
              {healthcareTips.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-ink-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}

function StatChip({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-3 flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
        <Icon size={17} />
      </span>
      <div>
        <p className="text-sm font-bold text-ink leading-tight">{value}</p>
        <p className="text-[11px] text-ink-muted">{label}</p>
      </div>
    </div>
  )
}

function MapGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
      <defs>
        <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#C7D2FE" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

function HospitalRow({ hospital: h, index }) {
  return (
    <section className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
            {index}
          </span>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
            <Building2 size={22} className="text-blue-500" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-ink">{h.name}</h3>
            {h.verified && (
              <Badge tone="info">
                <BadgeCheck size={12} /> Verified
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted flex items-start gap-1.5">
            <MapPin size={14} className="text-ink-faint shrink-0 mt-0.5" /> {h.address}
          </p>
          <p className="mt-1 text-xs text-ink-faint">{h.distanceKm} km away · {h.speciality}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {h.labourWard && (
              <Badge tone="success">
                <Baby size={11} /> Labour ward
              </Badge>
            )}
            {h.pmjay && (
              <Badge tone="primary">
                <ShieldCheck size={11} /> PMJAY cashless
              </Badge>
            )}
            {h.tags.map((t) => (
              <Badge key={t} tone="neutral">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              as="a"
              href={directionsUrl(h)}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              <Navigation size={15} /> Directions
            </Button>
            <Button as="a" href={`tel:${h.phone.replace(/\s/g, '')}`} size="sm">
              <Phone size={15} /> Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

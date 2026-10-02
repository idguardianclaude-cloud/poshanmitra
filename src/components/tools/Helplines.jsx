import { Phone, LifeBuoy } from 'lucide-react'

// Verified directory of free, national helplines useful to a pregnant woman and
// new mother in India. Every number is a one-tap call. These are public toll-free
// government / national lines (24×7). We keep the list short and relevant so it's
// genuinely useful in a moment of need, and lead with the two that matter most in
// pregnancy: 108 (ambulance) and 102 (free maternal & child transport).
const LINES = [
  { number: '108', name: 'Ambulance', desc: 'Medical emergency — free ambulance to hospital.', urgent: true },
  { number: '102', name: 'Maternal & child transport', desc: 'Free pick-up & drop for pregnant women and newborns.', urgent: true },
  { number: '112', name: 'Emergency (all services)', desc: 'Single number for police, fire and medical emergencies.', urgent: true },
  { number: '104', name: 'Health advice helpline', desc: 'Free health information and counselling (most states).' },
  { number: '1098', name: 'Childline', desc: 'Help for any child in distress or in need of care.' },
  { number: '181', name: 'Women helpline', desc: 'Support for women facing distress or violence.' },
  { number: '1800-599-0019', name: 'KIRAN mental-health', desc: 'Free, confidential emotional support, many languages.' },
]

export function Helplines() {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#ECFEFF' }}>
          <LifeBuoy size={18} className="text-cyan-600" />
        </span>
        <h2 className="text-base font-semibold text-ink">Important helplines</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4">Free national numbers. Tap to call. Save the ones you may need.</p>

      <ul className="space-y-2">
        {LINES.map((l) => (
          <li key={l.number}>
            <a
              href={`tel:${l.number.replace(/[^0-9]/g, '')}`}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                l.urgent ? 'border-red-100 bg-red-50/60 hover:bg-red-50' : 'border-line hover:bg-canvas'
              }`}
            >
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${l.urgent ? 'bg-red-600 text-white' : 'bg-cyan-50 text-cyan-700'}`}>
                <Phone size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-ink tabular-nums">{l.number}</span>
                  <span className="text-sm font-medium text-ink-muted truncate">{l.name}</span>
                </span>
                <span className="block text-xs text-ink-faint">{l.desc}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-ink-faint">Numbers are national; some services vary by state. In any emergency, don’t wait — call.</p>
    </div>
  )
}

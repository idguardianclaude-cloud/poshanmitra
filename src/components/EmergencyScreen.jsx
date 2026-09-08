import { Link } from 'react-router-dom'
import { Phone, Building2 } from 'lucide-react'
import { Illustration } from './Illustration.jsx'

// =============================================================================
// EmergencyScreen — SAFETY.md §2. Shown when checkRedFlags() matches, or when
// Gemini returns urgency === 'emergency'. Its only job is to move her toward a
// doctor. Do NOT add reassurance, possible causes, self-care, or condition names.
//
// The three languages are HARDCODED in full here and never translated at runtime.
// The "This isn't an emergency — continue chatting" link is deliberately quiet,
// below the card body, never a primary button. She can dismiss it; the app must
// never dismiss it for her.
// =============================================================================

const COPY = {
  en: {
    title: 'Please get medical help now',
    body: 'What you’ve described can be serious in pregnancy. Do not wait to see if it improves.',
    call: 'Call 108 — Ambulance',
    hospital: 'Find nearest hospital',
    family:
      'If you have a family member nearby, tell them now and ask them to go with you.',
    dismiss: 'This isn’t an emergency — continue chatting',
  },
  hi: {
    title: 'कृपया अभी चिकित्सा सहायता लें',
    body: 'आपने जो बताया है वह गर्भावस्था में गंभीर हो सकता है। यह देखने के लिए इंतज़ार न करें कि यह ठीक होता है या नहीं।',
    call: '108 पर कॉल करें — एम्बुलेंस',
    hospital: 'निकटतम अस्पताल खोजें',
    family:
      'अगर आपके पास कोई परिवारजन है, तो उन्हें अभी बताएं और उनसे साथ चलने को कहें।',
    dismiss: 'यह आपातकाल नहीं है — बातचीत जारी रखें',
  },
  mr: {
    title: 'कृपया आत्ताच वैद्यकीय मदत घ्या',
    body: 'तुम्ही जे सांगितले आहे ते गर्भावस्थेत गंभीर असू शकते. सुधारते का हे पाहण्यासाठी थांबू नका.',
    call: '108 वर कॉल करा — रुग्णवाहिका',
    hospital: 'जवळचे रुग्णालय शोधा',
    family:
      'तुमच्याजवळ कुटुंबातील कोणी असल्यास, त्यांना आत्ताच सांगा आणि सोबत येण्यास सांगा.',
    dismiss: 'ही आणीबाणी नाही — संवाद सुरू ठेवा',
  },
}

export function EmergencyScreen({ lang = 'en', onDismiss }) {
  const c = COPY[lang] || COPY.en

  return (
    <div
      className="rounded-2xl bg-white border border-line border-l-4 shadow-card overflow-hidden"
      style={{ borderLeftColor: '#DC2626' }}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-6" lang={lang}>
        <div className="flex items-start gap-4">
          <Illustration name="ambulance" size={72} />
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: '#DC2626' }}>
              {c.title}
            </h2>
            <p className="mt-2 text-sm text-ink">{c.body}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <a
            href="tel:108"
            className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-4 text-lg font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: '#DC2626' }}
          >
            <Phone size={22} /> {c.call}
          </a>

          <Link
            to="/hospitals"
            className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-ink bg-white border border-line hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Building2 size={18} /> {c.hospital}
          </Link>
        </div>

        <p className="mt-4 text-sm text-ink-muted">{c.family}</p>
      </div>

      {/* Quiet dismiss — below the card body, never a primary button. */}
      <div className="border-t border-line bg-canvas px-6 py-3 text-center">
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-ink-faint hover:text-ink-muted underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          lang={lang}
        >
          {c.dismiss}
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// rag.js — a small, on-device retrieval layer over PoshanMitra's OWN vetted
// content (schemes, scheme eligibility, weekly milestones, the sample diet,
// hospitals, the video library, and a curated set of safe FAQs).
//
// WHY THIS EXISTS
// Left to itself, a general model guesses. It can invent a scheme benefit, a
// wrong ₹ amount, or a milestone that doesn't match the app's own screens — and
// for a pregnant woman in a private beta, a confident wrong answer is a harm.
// So before Mitra answers, we retrieve the most relevant passages from content
// the team has already vetted and hand them to the model as grounding, so its
// replies agree with what the rest of the app shows.
//
// HOW IT STAYS SAFE
// - This runs ONLY after checkRedFlags() has cleared the message (Chatbot.jsx
//   calls the red-flag layer first; askMitra — and therefore this — is never
//   reached on a danger sign). Grounding never touches the emergency path.
// - Every passage below is drawn from already-vetted app data or written here to
//   the same SAFETY.md rules: no medicine names or doses, no diagnosis, the diet
//   is labelled general/sample, and anything symptom-shaped points to a doctor.
// - Grounding is *reference material*, not an override. The system prompt tells
//   Mitra it never loosens a safety rule; the second urgency layer still runs.
//
// HOW IT WORKS (no extra key, no new dependency — keyword / semantic-lite)
// The corpus is built once at module load. A query is tokenised (English +
// romanised + Devanagari), expanded through a small synonym map so "ulti",
// "vomiting" and "मळमळ" all reach the nausea passage, then scored against each
// passage with IDF-lite weighting (rarer words count for more) plus a boost for
// a passage's own keywords. We return the top few passages over a floor.
// =============================================================================

import { schemes } from '../data/schemes.js'
import { weeklyMilestones, hospitalBag } from '../data/checkup.js'
import { summary as dietSummary, meals } from '../data/meals.js'
import { hospitals } from '../data/hospitals.js'
import { videos } from '../data/videos.js'

// --- tokenisation -----------------------------------------------------------

// Lowercase, strip apostrophes to nothing (so contractions collapse the same way
// redflags.js normalises them), turn other punctuation into spaces, keep Latin
// letters, digits and Devanagari. The ₹ sign is kept as its own token so a
// money question can match the financial schemes.
function tokenize(text) {
  const norm = String(text || '')
    .toLowerCase()
    .normalize('NFC')
    .replace(/['’‘]/g, '')
    .replace(/₹/g, ' ₹ ')
    .replace(/[^a-z0-9₹ऀ-ॿ]+/g, ' ')
    .trim()
  if (!norm) return []
  return norm.split(/\s+/).filter((t) => t && !STOPWORDS.has(t) && (t.length > 1 || /[ऀ-ॿ₹]/.test(t)))
}

// Deliberately small — only truly content-free words. We must not strip words
// that carry meaning in a short health question.
const STOPWORDS = new Set([
  // English
  'the', 'a', 'an', 'is', 'are', 'am', 'was', 'were', 'be', 'to', 'of', 'in', 'on',
  'for', 'and', 'or', 'my', 'me', 'i', 'you', 'it', 'this', 'that', 'do', 'does',
  'can', 'should', 'would', 'will', 'what', 'how', 'when', 'why', 'which', 'with',
  'at', 'by', 'as', 'if', 'so', 'about', 'from', 'get', 'got', 'have', 'has', 'had',
  // romanised Hindi/Marathi fillers
  'hai', 'ho', 'ka', 'ki', 'ke', 'ko', 'me', 'mein', 'se', 'hu', 'hoon', 'kya',
  'mujhe', 'mera', 'meri', 'kaise', 'kaisi', 'kar', 'karu', 'raha', 'rahi', 'aur',
  'mala', 'majha', 'kase', 'ahe', 'tar',
])

// --- synonym / semantic-lite expansion --------------------------------------
//
// Groups of equivalent terms across English, romanised Hindi/Marathi, and
// Devanagari. Every group includes the English word(s) that actually appear in
// the corpus, so expanding a query token to its whole group makes the passage
// reachable. This is the "semantic-lite" layer — cheap, transparent, no model.
const SYNONYM_GROUPS = [
  ['diet', 'food', 'eat', 'eating', 'meal', 'meals', 'nutrition', 'khana', 'khaana', 'bhojan', 'aahar', 'आहार', 'खाना', 'जेवण', 'आहारात'],
  ['protein', 'dal', 'paneer', 'sprouts', 'egg', 'milk'],
  ['iron', 'anaemia', 'anemia', 'haemoglobin', 'hemoglobin', 'hb', 'loha', 'लोह'],
  ['calcium', 'bones', 'curd', 'dahi'],
  ['nausea', 'vomiting', 'vomit', 'ulti', 'ultti', 'matli', 'sickness', 'morning', 'मळमळ', 'उलटी', 'मिचली'],
  ['supplement', 'supplements', 'folic', 'vitamin', 'tablet', 'tablets', 'goli', 'गोली'],
  ['exercise', 'yoga', 'walk', 'walking', 'vyayam', 'व्यायाम', 'कसरत', 'योग'],
  ['sleep', 'sleeping', 'rest', 'sona', 'neend', 'नींद', 'झोप'],
  ['weight', 'gain'],
  ['week', 'weeks', 'month', 'months', 'trimester', 'hafta', 'saptah', 'mahina', 'महीना', 'हफ्ता', 'आठवडा', 'महिना'],
  ['baby', 'foetus', 'fetus', 'bacha', 'baccha', 'बच्चा', 'बाळ', 'शिशु', 'grow', 'growth', 'development', 'size'],
  ['movement', 'moving', 'kick', 'kicks', 'kicking', 'halchal', 'हलचल', 'हालचाल'],
  ['scheme', 'schemes', 'yojana', 'yojna', 'benefit', 'benefits', 'money', 'paisa', 'cash', 'financial', 'rupees', 'amount', '₹', 'योजना', 'पैसा', 'लाभ'],
  ['pmmvy', 'matru', 'vandana', 'maternity'],
  ['hospital', 'hospitals', 'delivery', 'deliver', 'labour', 'labor', 'anganwadi', 'aspatal', 'अस्पताल', 'रुग्णालय', 'प्रसूती'],
  ['doctor', 'anc', 'checkup', 'check', 'antenatal', 'visit', 'daaktar', 'डॉक्टर', 'तपासणी'],
  ['breastfeeding', 'breastfeed', 'breast', 'feeding', 'latch', 'stanpan', 'स्तनपान', 'दूध'],
  ['video', 'videos', 'watch', 'learn'],
  ['vaccine', 'vaccination', 'immunisation', 'immunization', 'tt', 'td', 'tetanus', 'tika', 'टीका', 'लस'],
  ['heartburn', 'acidity', 'gas'],
  ['swelling', 'feet', 'legs'],
  ['emotional', 'stress', 'anxious', 'anxiety', 'mood', 'sad', 'worried', 'tanav', 'तनाव', 'ताण'],
  ['hospital-bag', 'bag', 'pack', 'packing'],
]

// token -> Set of all tokens in every group it belongs to.
const SYNONYM_MAP = (() => {
  const map = new Map()
  for (const group of SYNONYM_GROUPS) {
    for (const term of group) {
      const set = map.get(term) || new Set()
      for (const other of group) set.add(other)
      map.set(term, set)
    }
  }
  return map
})()

function expand(tokens) {
  const out = new Set(tokens)
  for (const t of tokens) {
    const syn = SYNONYM_MAP.get(t)
    if (syn) for (const s of syn) out.add(s)
  }
  return out
}

// --- corpus -----------------------------------------------------------------
//
// Each document is { id, source, title, text, keywords }. `keywords` are extra
// high-signal terms (topic words that may not appear verbatim in the text); a
// query term matching a keyword scores double. Text is kept short and vetted.

function buildCorpus() {
  const docs = []

  // Schemes — one passage each. Grounds Mitra on real benefits, ₹ amounts and
  // where to apply, so she never invents scheme details.
  for (const s of schemes) {
    docs.push({
      id: `scheme:${s.id}`,
      source: 'scheme',
      title: s.name,
      text: `${s.description} Benefits: ${s.benefits.join('; ')}. Who may be eligible: ${s.eligibility.join('; ')}. Where to apply: ${s.whereToApply} Official portal: ${s.portal}`,
      keywords: ['scheme', 'yojana', 'benefit', 'eligible', ...s.tags.map((t) => t.toLowerCase())],
    })
  }

  // Weekly milestones — general educational content, keyed by the week it starts.
  for (const m of weeklyMilestones) {
    docs.push({
      id: `week:${m.from}`,
      source: 'milestone',
      title: `Around week ${m.from} of pregnancy`,
      text: `Baby is about the size of ${m.size}. ${m.baby} For you: ${m.mom} Tips: ${m.tips.join(' ')} Things to do: ${m.checklist.join('; ')}.`,
      keywords: ['week', 'trimester', 'baby', 'milestone', 'development'],
    })
  }

  // Hospital bag — useful in the late weeks.
  docs.push({
    id: 'checkup:hospital-bag',
    source: 'checkup',
    title: 'What to pack in your hospital bag',
    text: `Keep these ready for delivery: ${hospitalBag.join('; ')}.`,
    keywords: ['hospital-bag', 'bag', 'pack', 'delivery', 'labour'],
  })

  // Sample diet — explicitly GENERAL guidance, never personalised (SAFETY.md §4).
  docs.push({
    id: 'diet:sample',
    source: 'diet',
    title: 'Sample pregnancy meal plan (general guidance, not personalised)',
    text:
      `This is a general sample day of meals for pregnancy — not personalised medical nutrition advice; it should be followed alongside a doctor's or dietitian's guidance. ` +
      `A balanced day is around ${dietSummary.calories} with about ${dietSummary.protein} of protein and ${dietSummary.water} of water across ${dietSummary.meals}. ` +
      meals
        .map((meal) => `${meal.name} (${meal.time}): ${meal.items.map((it) => it.name).join(', ')}.`)
        .join(' '),
    keywords: ['diet', 'food', 'meal', 'nutrition', 'protein', 'sample', 'eat'],
  })

  // Hospitals — a compact grounding passage (not the full directory). Names the
  // ones that can deliver a baby and which accept PMJAY cashless, and reminds
  // that 108 is the emergency number.
  const labourWards = hospitals.filter((h) => h.labourWard).map((h) => h.name)
  const pmjayHospitals = hospitals.filter((h) => h.pmjay).map((h) => h.name)
  docs.push({
    id: 'hospitals:pune',
    source: 'hospital',
    title: 'Hospitals with maternity care in Pune',
    text:
      `The app lists ${hospitals.length} Pune hospitals with maternity units — see the Hospitals page for addresses, phone numbers and directions. ` +
      `Hospitals with a labour ward for delivery include: ${labourWards.slice(0, 6).join(', ')}. ` +
      `Hospitals that accept Ayushman Bharat (PMJAY) cashless include: ${pmjayHospitals.join(', ')}. ` +
      `For any emergency, call 108 for a free ambulance.`,
    keywords: ['hospital', 'delivery', 'labour', 'maternity', 'pmjay', 'ambulance', 'pune'],
  })

  // Video library — titles only, so Mitra can point her to a relevant video.
  docs.push({
    id: 'videos:index',
    source: 'video',
    title: 'Videos available in the app',
    text: `The Videos section has short guides including: ${videos.map((v) => v.title).join('; ')}. Suggest the relevant one when it helps.`,
    keywords: ['video', 'watch', 'guide', 'learn'],
  })

  // Curated safe FAQs — written to SAFETY.md: general, no medicine/dose, no
  // diagnosis, and anything symptom-shaped ends with a doctor pointer.
  for (const faq of SAFE_FAQS) docs.push(faq)

  return docs
}

// Vetted general answers to the most common early questions. These mirror the
// app's own content and the SAFETY.md tone. They are grounding hints for Mitra,
// not scripts — she rewrites them warmly in the user's language.
const SAFE_FAQS = [
  {
    id: 'faq:nausea',
    source: 'faq',
    title: 'Managing nausea and morning sickness',
    text:
      'Nausea and vomiting ("morning sickness") are very common in early pregnancy. Small, frequent meals, dry snacks like toast or biscuits on waking, sipping water or ginger/lemon water, and avoiding strong smells can help. If vomiting is severe or she cannot keep any food or water down, she should see her doctor.',
    keywords: ['nausea', 'vomiting', 'morning', 'sickness', 'ulti'],
  },
  {
    id: 'faq:iron',
    source: 'faq',
    title: 'Iron-rich foods in pregnancy',
    text:
      'Iron helps prevent anaemia in pregnancy. Iron-rich everyday foods include dal, leafy greens (palak, methi), jaggery, beans, and dates; pairing them with vitamin-C foods like amla, orange or lemon helps absorption. For any iron supplement — which one and how much — she should ask her doctor.',
    keywords: ['iron', 'anaemia', 'anemia', 'palak', 'dal', 'jaggery'],
  },
  {
    id: 'faq:supplements',
    source: 'faq',
    title: 'Supplements like folic acid and iron',
    text:
      'Supplements such as folic acid, iron and calcium are commonly advised in pregnancy. The right supplement and the right amount are decided by her doctor for her specifically — she should ask her doctor which supplement and how much is right for her, rather than starting or changing a dose on her own.',
    keywords: ['supplement', 'folic', 'vitamin', 'tablet', 'iron', 'calcium'],
  },
  {
    id: 'faq:exercise',
    source: 'faq',
    title: 'Exercise and yoga during pregnancy',
    text:
      'Gentle activity is usually good in a normal pregnancy — walking, gentle prenatal yoga and stretching help mood, sleep and digestion. Avoid heavy lifting, contact sports, lying flat on the back in later pregnancy, and anything that feels painful. She should check with her doctor before starting a new exercise, especially if she has any pregnancy complication.',
    keywords: ['exercise', 'yoga', 'walk', 'activity', 'stretching'],
  },
  {
    id: 'faq:sleep',
    source: 'faq',
    title: 'Sleep and comfort in pregnancy',
    text:
      'Sleeping on the side (the left side is often most comfortable later in pregnancy), with a pillow between the knees or under the bump, can ease backache and help rest. Small frequent meals and not eating right before bed can reduce heartburn at night.',
    keywords: ['sleep', 'rest', 'comfort', 'backache', 'side'],
  },
  {
    id: 'faq:water',
    source: 'faq',
    title: 'Staying hydrated',
    text:
      'Drinking enough water through the day supports digestion, helps reduce swelling and constipation, and keeps energy steady. Coconut water, buttermilk and soups add to fluids too.',
    keywords: ['water', 'hydration', 'fluids', 'thirsty'],
  },
  {
    id: 'faq:kicks',
    source: 'faq',
    title: 'Feeling the baby move',
    text:
      'Many women first feel flutters of movement around the middle of pregnancy, and kicks grow stronger later. Later in pregnancy it helps to notice the baby\'s usual pattern of movements. If she ever notices the baby moving much less than usual, she should contact her doctor the same day.',
    keywords: ['movement', 'kick', 'kicks', 'flutter', 'moving'],
  },
  {
    id: 'faq:emotional',
    source: 'faq',
    title: 'Emotional wellbeing in pregnancy',
    text:
      'Mood ups and downs are normal in pregnancy with all the hormonal and life changes. Rest, gentle activity, talking to trusted family or friends, and small breaks help. If she feels persistently low, very anxious, or unable to cope, that is worth sharing with her doctor — support is available and it is nothing to be ashamed of.',
    keywords: ['emotional', 'mood', 'stress', 'anxious', 'sad', 'wellbeing'],
  },
]

// Freeze the corpus and the document-frequency table once.
const CORPUS = buildCorpus()

// Pre-tokenise each doc into a term Set and a keyword Set for fast scoring.
const INDEX = CORPUS.map((doc) => {
  const terms = new Set([
    ...tokenize(`${doc.title} ${doc.text}`),
    ...doc.keywords.flatMap((k) => tokenize(k)),
  ])
  const keywords = new Set(doc.keywords.flatMap((k) => tokenize(k)))
  return { doc, terms, keywords }
})

// Document frequency per term, for IDF-lite weighting (rarer term = higher weight).
const DF = (() => {
  const df = new Map()
  for (const { terms } of INDEX) {
    for (const t of terms) df.set(t, (df.get(t) || 0) + 1)
  }
  return df
})()
const N_DOCS = INDEX.length

function idf(term) {
  const df = DF.get(term) || 0
  if (df === 0) return 0
  return Math.log(1 + N_DOCS / df)
}

// --- retrieval --------------------------------------------------------------

const DEFAULT_LIMIT = 3
// A single moderately-specific term match clears this; it filters out passages
// that only share a common word with the query.
const MIN_SCORE = 1.5

// Retrieve the most relevant vetted passages for a (red-flag-cleared) message.
// Returns [{ id, source, title, text, score }], best first, at most `limit`.
export function retrieve(message, { limit = DEFAULT_LIMIT } = {}) {
  const queryTokens = tokenize(message)
  if (queryTokens.length === 0) return []
  const expanded = expand(queryTokens)

  const scored = []
  for (const { doc, terms, keywords } of INDEX) {
    let score = 0
    let hits = 0
    for (const t of expanded) {
      if (!terms.has(t)) continue
      hits += 1
      // Keyword hits count double — they are the passage's own topic words.
      score += idf(t) * (keywords.has(t) ? 2 : 1)
    }
    if (hits > 0 && score >= MIN_SCORE) {
      scored.push({ id: doc.id, source: doc.source, title: doc.title, text: doc.text, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit)
}

// Build the grounding block injected into Mitra's prompt. Returns '' when
// nothing relevant is found, so a general question is answered as before (still
// under every safety rule). The header tells the model this is vetted reference
// material and must not override any safety rule.
export function buildGrounding(message, { limit = DEFAULT_LIMIT } = {}) {
  const hits = retrieve(message, { limit })
  if (hits.length === 0) return ''
  const lines = hits.map((h) => `- ${h.title}: ${h.text}`)
  return (
    `REFERENCE — verified PoshanMitra content relevant to her message. Use it to ground your answer so it agrees with what the app shows (correct scheme details, ₹ amounts, milestones, meal ideas, hospital info). Prefer these facts over your own memory. This reference NEVER loosens a safety rule — still no diagnosis, no medicine names or doses, and always point her to a doctor for anything medical.\n` +
    lines.join('\n')
  )
}

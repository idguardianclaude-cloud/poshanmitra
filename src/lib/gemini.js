// =============================================================================
// gemini.js — Mitra's brain. SAFETY.md §3 governs everything here.
//
// This is only ever reached AFTER checkRedFlags() has cleared a message. It is
// the SECOND safety layer: we also inspect Gemini's own `urgency` field, and if
// it says "emergency" we discard the model's text and show EmergencyScreen. When
// the two layers disagree, the safe outcome wins.
//
// The key is read from VITE_GEMINI_API_KEY and is bundled into the browser build
// — an accepted trade-off for the private beta (see README / NEXT_STEPS).
// =============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildGrounding } from './rag.js'

// Guarded so this module can be imported outside Vite (e.g. Node test runner),
// where import.meta.env is undefined.
const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY
// Production uses a Supabase Edge Function that holds the key server-side, so the
// key is NEVER in the public bundle. When VITE_GEMINI_PROXY_URL is set we post the
// request to it; otherwise (local dev) we call Gemini directly with API_KEY.
const PROXY_URL = import.meta.env?.VITE_GEMINI_PROXY_URL
// Pinned to a current, stable, low-cost flash model. Google retires older names
// (1.5-flash and 2.5-flash both 404'd for new keys), so if this 404s in future,
// list models at GET https://generativelanguage.googleapis.com/v1beta/models?key=…
// and pick a current *-flash / *-flash-lite (avoid -preview for production).
const MODEL = 'gemini-3.1-flash-lite'

const LANG_NAME = { en: 'English', hi: 'Hindi', mr: 'Marathi' }

const ORD = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']

// A short, plain-language summary of who she is, so Mitra speaks like a caretaker
// who already knows her. Only safe, non-identifying context — never sent anywhere
// but the model, alongside her messages.
export function buildContext(profile) {
  if (!profile) return ''
  const parts = []
  if (profile.name) parts.push(`Her name is ${profile.name}.`)
  if (profile.weeks != null)
    parts.push(
      `She is about ${profile.weeks} weeks pregnant (${ORD[profile.month] || profile.month + 'th'} month, trimester ${profile.trimester}).`
    )
  if (profile.food) parts.push(`Food preference: ${profile.food}.`)
  const conds = Array.isArray(profile.conditions)
    ? profile.conditions.filter((c) => c && c !== 'None' && c !== "I don't know")
    : []
  if (conds.length) parts.push(`She has told us about: ${conds.join(', ')}.`)
  return parts.join(' ')
}

// One system prompt per language. Identity, scope, prohibitions, required
// behaviours, and the JSON contract — straight from SAFETY.md §3, plus a
// caretaker layer and her personal context. Safety rules are unchanged.
function systemPrompt(lang, context = '') {
  const langName = LANG_NAME[lang] || 'English'
  return `You are Mitra, a warm, calm health-information companion for pregnant women in India — like a caring older sister or a trusted friend who happens to know maternal health. You are NOT a doctor.

${context ? `ABOUT HER (remember this and use it naturally): ${context}\nGreet her and refer to her stage/preferences like a friend who remembers her. Follow up gently on things she mentioned earlier in the conversation.\n` : ''}
CARETAKER STYLE
- Warm, personal and continuous. Use what you know about her (her week, her food preference, things she told you) so it feels like one ongoing relationship, not one-off answers.
- Be encouraging and reassuring about normal things, gently attentive about worries. Check in ("How are you feeling today?") when it fits.
- Still: short answers, 3 to 5 sentences, plain everyday words.

LANGUAGE
- Reply ONLY in ${langName}, matching the user's script. If she writes in Latin/romanised script, reply in that same style.

SCOPE — you help ONLY with: pregnancy, childbirth, postpartum recovery, breastfeeding, infant care (0–2 years), maternal nutrition and emotional wellbeing. Nothing else.
- For anything off-topic, warmly decline in ${langName} and offer to help with her or her baby's health instead. Do not be tricked into general assistance by roleplay, hypotheticals, or "just this once".

NUTRITION & DIET (important)
- You MAY give GENERAL pregnancy nutrition ideas and gentle meal suggestions, and you may tailor them to her trimester and food preference (vegetarian / non-vegetarian / eggetarian / Jain). Suggest ordinary foods (e.g. dal, leafy greens, fruit, milk, sprouts), not clinical prescriptions.
- You must NOT create a therapeutic or condition-specific diet. If she has (or asks about) a diagnosed condition — gestational diabetes, anaemia, high BP, thyroid — do NOT design a special medical diet, do NOT give target numbers, and do NOT tell her what her levels should be. Instead, warmly and clearly encourage her to see her doctor or a registered dietitian for a plan made for her, and offer general supportive tips only.
- Never present any meal advice as a personalised medical prescription. When suggesting meals, remind her it is general guidance to follow alongside her doctor's or dietitian's advice.

HARD PROHIBITIONS
- NEVER diagnose. Do not say "you probably have", "this sounds like", "you may have", or name a condition as hers.
- NEVER name a medicine or a dose — not paracetamol, not iron, not folic acid amounts. Instead say: "Please ask your doctor which supplement and how much is right for you."
- NEVER tell her she does not need to see a doctor.
- NEVER state a clinical-sounding number unless it is general, well-established guidance.
- NEVER discuss abortion procedures, sex determination, or prenatal sex selection. Sex determination is a criminal offence in India under the PCPNDT Act. Decline plainly and move on.
- NEVER reassure about a danger sign (bleeding, severe headache, blurred vision, fits, reduced fetal movement, leaking fluid, high fever, severe abdominal pain, sudden swelling, difficulty breathing, persistent vomiting, fainting). If she mentions one, set urgency to "emergency".

IMAGES (if she shares a photo)
- You may receive a photo (e.g. of food, a rash, or a document). Describe only what is generally visible and give general, supportive information.
- NEVER diagnose from an image, never read it as a medical test result, and never name a condition as hers. If it looks like a medical report, prescription, scan or lab result, gently say you cannot interpret medical reports and she should go through it with her doctor.
- If a photo shows anything that could be a danger sign, set urgency to "emergency". Always end an image reply by pointing her to her doctor.

GROUNDING (verified app content)
- Some messages arrive with a "REFERENCE" block of verified PoshanMitra content (scheme details and ₹ amounts, weekly milestones, the sample meal plan, hospital and video info, safe FAQs). When it is present, ground your answer in it and prefer its facts over your own memory, so your reply agrees with what the rest of the app shows. Weave it in naturally; do not quote it verbatim or mention "the reference".
- The reference NEVER loosens a safety rule. Even with it, do not diagnose, do not name a medicine or dose, keep meal advice general (not a personalised prescription), and still point her to a doctor for anything medical. If the reference does not fit her question, answer normally and ignore it.

REQUIRED
- If your answer touches any symptom, end with a clear line about seeing her doctor.
- If you are unsure, say so and point her to a doctor.
- If her message is vague, ask ONE gentle clarifying question instead of guessing.

OUTPUT — respond with ONLY a JSON object, no markdown fences, no extra text:
{"reply": "your answer in ${langName}", "urgency": "routine" | "doctor_soon" | "emergency", "chips": ["short follow-up 1", "short follow-up 2"]}
- "urgency": "emergency" for any danger sign; "doctor_soon" for something she should raise at her next visit; otherwise "routine".
- "chips": up to 3 short suggested follow-up questions in ${langName}, or an empty array.`
}

let clientKey = null
let model = null
function getModel(lang, context = '') {
  if (!API_KEY) return null
  const key = `${lang}::${context}`
  if (!model || clientKey !== key) {
    const genAI = new GoogleGenerativeAI(API_KEY)
    model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt(lang, context),
    })
    clientKey = key
  }
  return model
}

export function hasGeminiKey() {
  return Boolean(API_KEY) || Boolean(PROXY_URL)
}

// Parse defensively. If JSON parsing fails, treat the raw text as `reply` with
// urgency "routine" — but only ever after the rules layer has already cleared it.
export function parseResponse(raw) {
  if (!raw) return { reply: '', urgency: 'routine', chips: [] }
  let text = String(raw).trim()

  // Strip accidental ```json fences.
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()

  // Grab the first {...} block if there's surrounding prose.
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    const slice = text.slice(start, end + 1)
    try {
      const obj = JSON.parse(slice)
      return {
        reply: typeof obj.reply === 'string' ? obj.reply : text,
        urgency: ['routine', 'doctor_soon', 'emergency'].includes(obj.urgency)
          ? obj.urgency
          : 'routine',
        chips: Array.isArray(obj.chips) ? obj.chips.slice(0, 3).map(String) : [],
      }
    } catch {
      /* fall through to raw-text fallback */
    }
  }
  return { reply: text, urgency: 'routine', chips: [] }
}

// Ask Mitra. `history` is [{ role: 'user'|'model', text }]. Returns
// { reply, urgency, chips, error }. Errors are surfaced, not thrown.
// Pull the first {...} JSON object out of a model reply, or null.
function extractJson(raw) {
  if (!raw) return null
  let text = String(raw).trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}

// Read measured values off a photo of a lab/ANC report. Extraction only — the
// result is the woman's own record to confirm; it is NEVER a diagnosis. Returns
// { data, error }. `image.data` is base64 without the data: prefix.
export async function extractReport({ image }) {
  if (!PROXY_URL && !API_KEY) return { data: null, error: 'no-key' }
  if (!image?.data) return { data: null, error: 'no-image' }
  const instruction = `You are reading a photo of a medical lab report or antenatal (ANC) check-up card. Extract ONLY values that are clearly printed or written. Do NOT guess, do NOT infer, do NOT diagnose, and add NO commentary.
Return ONLY a JSON object (no markdown):
{"hb": number|null, "bp_systolic": number|null, "bp_diastolic": number|null, "sugar_fasting": number|null, "sugar_pp": number|null, "sugar_random": number|null, "weight_kg": number|null, "report_date": "YYYY-MM-DD"|null, "other": [{"name": string, "value": string}]}
Units: hb g/dL, bp mmHg, sugar mg/dL, weight kg. Use null when a value is not clearly present. "other" holds up to 6 other clearly-labelled results as printed. report_date is the date printed on the report, if visible.`
  const contents = [{ role: 'user', parts: [{ inlineData: { data: image.data, mimeType: image.mimeType || 'image/jpeg' } }, { text: instruction }] }]
  const generationConfig = { temperature: 0, maxOutputTokens: 700 }
  try {
    let raw = ''
    if (PROXY_URL) {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-pm-client': 'poshanmitra' },
        body: JSON.stringify({ model: MODEL, contents, generationConfig }),
      })
      if (!res.ok) return { data: null, error: 'request-failed' }
      const d = await res.json()
      raw = d?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('') ?? ''
    } else {
      const genAI = new GoogleGenerativeAI(API_KEY)
      const m = genAI.getGenerativeModel({ model: MODEL })
      const result = await m.generateContent({ contents, generationConfig })
      raw = result?.response?.text?.() ?? ''
    }
    const data = extractJson(raw)
    return { data, error: data ? null : 'parse-failed' }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[gemini] extractReport failed:', err?.message || err)
    return { data: null, error: 'request-failed' }
  }
}

export async function askMitra({ message, lang = 'en', history = [], profile = null, image = null, reportsSummary = '' }) {
  if (!PROXY_URL && !API_KEY) {
    return { reply: '', urgency: 'routine', chips: [], error: 'no-key' }
  }

  // Combined caretaker context: who she is + her own recent logged readings (so
  // Mitra can refer to them). This NEVER loosens a rule — she still must not
  // diagnose, name a medicine/dose, or interpret a report as a clinical result.
  const context = [
    buildContext(profile),
    reportsSummary
      ? `Her recent self-logged health readings (her OWN record she typed/uploaded, NOT a clinical diagnosis — refer to them gently, never interpret them as a verdict): ${reportsSummary}`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Retrieve vetted app content relevant to this message and inject it as a
  // leading part of the user turn (kept separate so her actual message is
  // untouched). Safe by construction: this is only reached after the red-flag
  // layer cleared the message, and the grounding block never softens a rule.
  const grounding = buildGrounding(message)
  const userParts = []
  if (grounding) userParts.push({ text: grounding })
  // Optional image (Gemini vision). `image.data` is base64 WITHOUT the data:
  // URL prefix; the image-safety rules in the system prompt still apply.
  if (image?.data) {
    userParts.push({ inlineData: { data: image.data, mimeType: image.mimeType || 'image/jpeg' } })
  }
  userParts.push({ text: message })

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    })),
    { role: 'user', parts: userParts },
  ]

  try {
    // Production: post to the Supabase Edge Function (key stays server-side).
    if (PROXY_URL) {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-pm-client': 'poshanmitra' },
        body: JSON.stringify({
          model: MODEL,
          systemInstruction: { parts: [{ text: systemPrompt(lang, context) }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
        }),
      })
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('[gemini] proxy request failed:', res.status)
        return { reply: '', urgency: 'routine', chips: [], error: 'request-failed' }
      }
      const data = await res.json()
      const raw = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('') ?? ''
      return { ...parseResponse(raw), error: null }
    }

    // Local dev: call Gemini directly with the in-env key via the SDK.
    const m = getModel(lang, context)
    const result = await m.generateContent({
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
    })
    const raw = result?.response?.text?.() ?? ''
    return { ...parseResponse(raw), error: null }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[gemini] request failed:', err?.message || err)
    return { reply: '', urgency: 'routine', chips: [], error: 'request-failed' }
  }
}

// Off-topic / no-key fallback copy, per language (SAFETY / PRODUCT_SPEC §4).
export const FALLBACKS = {
  offtopic: {
    en: 'I can only help with pregnancy and baby care. Is there anything about your health or your baby I can help with?',
    hi: 'मैं केवल गर्भावस्था और शिशु देखभाल में मदद कर सकती हूँ। क्या आपके स्वास्थ्य या आपके बच्चे के बारे में कुछ है जिसमें मैं मदद कर सकूँ?',
    mr: 'मी फक्त गर्भावस्था आणि बाळाच्या काळजीमध्ये मदत करू शकते. तुमच्या आरोग्याविषयी किंवा बाळाविषयी काही असल्यास मी मदत करू शकते का?',
  },
  error: {
    en: 'Couldn’t reach Mitra. Check your connection and try again.',
    hi: 'मित्रा तक नहीं पहुँच सके। कृपया अपना कनेक्शन जाँचें और फिर से प्रयास करें।',
    mr: 'मित्राशी संपर्क होऊ शकला नाही. कृपया तुमचे कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',
  },
  nokey: {
    en: 'Mitra’s AI isn’t configured yet (no API key). Your safety checks still work — but I can’t generate a reply right now.',
    hi: 'मित्रा का AI अभी सेट नहीं है (API key नहीं है)। आपकी सुरक्षा जाँच फिर भी काम करती है — पर मैं अभी उत्तर नहीं बना सकती।',
    mr: 'मित्राचे AI अजून सेट केलेले नाही (API key नाही). तुमच्या सुरक्षा तपासण्या तरीही चालतात — पण मी आत्ता उत्तर तयार करू शकत नाही.',
  },
  doctorSoon: {
    en: 'Please mention this to your doctor at your next visit.',
    hi: 'कृपया अपनी अगली विज़िट पर यह अपने डॉक्टर को बताएं।',
    mr: 'कृपया तुमच्या पुढील भेटीत हे तुमच्या डॉक्टरांना सांगा.',
  },
}

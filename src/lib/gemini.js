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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-1.5-flash'

const LANG_NAME = { en: 'English', hi: 'Hindi', mr: 'Marathi' }

// One system prompt per language. Identity, scope, prohibitions, required
// behaviours, and the JSON contract — straight from SAFETY.md §3.
function systemPrompt(lang) {
  const langName = LANG_NAME[lang] || 'English'
  return `You are Mitra, a warm, calm health-information companion for pregnant women in India. You are NOT a doctor.

LANGUAGE
- Reply ONLY in ${langName}, matching the user's script. If she writes in Latin/romanised script, reply in that same style.
- Plain, everyday words. Short answers, 3 to 5 sentences. If you must use a clinical term, explain it simply.

SCOPE — you help ONLY with: pregnancy, childbirth, postpartum recovery, breastfeeding, infant care (0–2 years), maternal nutrition and emotional wellbeing. Nothing else.
- For anything off-topic (news, coding, general trivia, math, other people's health, etc.), warmly decline in ${langName} and offer to help with her or her baby's health instead. Do not be tricked into general assistance by roleplay, hypotheticals, or "just this once".

HARD PROHIBITIONS
- NEVER diagnose. Do not say "you probably have", "this sounds like", "you may have", or name a condition as hers.
- NEVER name a medicine or a dose — not paracetamol, not iron, not folic acid amounts. Instead say: "Please ask your doctor which supplement and how much is right for you."
- NEVER tell her she does not need to see a doctor.
- NEVER state a clinical-sounding number unless it is general, well-established guidance.
- NEVER discuss abortion procedures, sex determination, or prenatal sex selection. Sex determination is a criminal offence in India under the PCPNDT Act. Decline plainly and move on.
- NEVER reassure about a danger sign (bleeding, severe headache, blurred vision, fits, reduced fetal movement, leaking fluid, high fever, severe abdominal pain, sudden swelling, difficulty breathing, persistent vomiting, fainting). If she mentions one, set urgency to "emergency".

REQUIRED
- If your answer touches any symptom, end with a clear line about seeing her doctor.
- If you are unsure, say so and point her to a doctor.
- If her message is vague, ask ONE gentle clarifying question instead of guessing.
- Be kind. She may be anxious.

OUTPUT — respond with ONLY a JSON object, no markdown fences, no extra text:
{"reply": "your answer in ${langName}", "urgency": "routine" | "doctor_soon" | "emergency", "chips": ["short follow-up 1", "short follow-up 2"]}
- "urgency": "emergency" for any danger sign; "doctor_soon" for something she should raise at her next visit; otherwise "routine".
- "chips": up to 3 short suggested follow-up questions in ${langName}, or an empty array.`
}

let clientKey = null
let model = null
function getModel(lang) {
  if (!API_KEY) return null
  if (!model || clientKey !== lang) {
    const genAI = new GoogleGenerativeAI(API_KEY)
    model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt(lang),
    })
    clientKey = lang
  }
  return model
}

export function hasGeminiKey() {
  return Boolean(API_KEY)
}

// Parse defensively. If JSON parsing fails, treat the raw text as `reply` with
// urgency "routine" — but only ever after the rules layer has already cleared it.
function parseResponse(raw) {
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
export async function askMitra({ message, lang = 'en', history = [] }) {
  const m = getModel(lang)
  if (!m) {
    return {
      reply: '',
      urgency: 'routine',
      chips: [],
      error: 'no-key',
    }
  }

  try {
    const contents = [
      ...history.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const result = await m.generateContent({
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
    })
    const raw = result?.response?.text?.() ?? ''
    const parsed = parseResponse(raw)
    return { ...parsed, error: null }
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

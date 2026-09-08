// Web Speech API wrappers — voice input (STT) and read-aloud (TTS). Everything
// here degrades to a graceful no-op when the browser lacks the API, so callers
// never need to feature-detect. Language codes map en/hi/mr → BCP-47.

const BCP47 = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' }

export function speechSupported() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function ttsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Start listening. onResult(transcript), onEnd(). Returns a stop() function.
// No-op (returns a stop that does nothing) when unsupported.
export function startListening({ lang = 'en', onResult, onEnd, onError } = {}) {
  const Ctor =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  if (!Ctor) {
    onError?.('unsupported')
    onEnd?.()
    return () => {}
  }

  const rec = new Ctor()
  rec.lang = BCP47[lang] || 'en-IN'
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.continuous = false

  rec.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map((r) => r[0]?.transcript || '')
      .join(' ')
      .trim()
    if (transcript) onResult?.(transcript)
  }
  rec.onerror = (e) => onError?.(e?.error || 'error')
  rec.onend = () => onEnd?.()

  try {
    rec.start()
  } catch (err) {
    onError?.(err?.message || 'start-failed')
    onEnd?.()
    return () => {}
  }

  return () => {
    try {
      rec.stop()
    } catch {
      /* no-op */
    }
  }
}

// Read text aloud in the chosen language. No-op when unsupported.
export function speak(text, lang = 'en') {
  if (!ttsSupported() || !text) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(String(text))
    u.lang = BCP47[lang] || 'en-IN'
    u.rate = 0.98
    u.pitch = 1
    // Prefer a voice matching the language if one is installed.
    const voices = window.speechSynthesis.getVoices?.() || []
    const match = voices.find((v) => v.lang === u.lang) || voices.find((v) => v.lang?.startsWith(lang))
    if (match) u.voice = match
    window.speechSynthesis.speak(u)
  } catch {
    /* no-op */
  }
}

export function stopSpeaking() {
  if (!ttsSupported()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* no-op */
  }
}

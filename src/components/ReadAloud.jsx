import { useEffect, useState } from 'react'
import { Volume2, Square } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { ttsSupported, speak, stopSpeaking } from '../lib/speech.js'

// "Read aloud" control, shown once in the Header so EVERY screen can be heard — a
// core accessibility feature for an audience that may read less comfortably or
// prefer listening. On tap it reads the current page's main content in the chosen
// language (en/hi/mr) using the device's built-in voices; tap again to stop. It
// grabs text from the <main> region at click time, so it always reads whatever
// page is open without any per-page wiring. Hidden when the browser has no TTS.
export function ReadAloud() {
  const { lang } = useProfile()
  const [speaking, setSpeaking] = useState(false)

  // Stop speech when unmounting or navigating away mid-utterance.
  useEffect(() => () => stopSpeaking(), [])

  if (!ttsSupported()) return null

  function gatherText() {
    const main = document.querySelector('main')
    const raw = (main?.innerText || document.body?.innerText || '').replace(/\s+/g, ' ').trim()
    // Cap length so a long page doesn't read endlessly; she can stop any time.
    return raw.slice(0, 2200)
  }

  function toggle() {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    const text = gatherText()
    if (!text) return
    setSpeaking(true)
    speak(text, lang, { onEnd: () => setSpeaking(false) })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      title={speaking ? 'Stop reading' : 'Read this page aloud'}
      aria-label={speaking ? 'Stop reading' : 'Read this page aloud'}
      className={`relative p-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        speaking ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:bg-canvas'
      }`}
    >
      {speaking ? <Square size={18} /> : <Volume2 size={19} />}
      {speaking && <span className="absolute inset-0 rounded-xl ring-2 ring-indigo-300 animate-ping" aria-hidden />}
    </button>
  )
}

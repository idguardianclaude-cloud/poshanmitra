import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Heart,
  Send,
  Mic,
  Square,
  ImagePlus,
  ClipboardList,
  Volume2,
  CheckCheck,
  Trash2,
  Info,
} from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { storage } from '../lib/storage.js'
import { checkRedFlags } from '../lib/redflags.js'
import { askMitra, FALLBACKS } from '../lib/gemini.js'
import { startListening, speak, stopSpeaking, speechSupported } from '../lib/speech.js'
import { ordinalMonth, ordinalTrimester } from '../lib/pregnancy.js'
import { formatIN, nextCheckupDate } from '../lib/dates.js'
import { EmergencyScreen } from '../components/EmergencyScreen.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Chip } from '../components/ui/Chip.jsx'
import { LANGS, useT } from '../lib/i18n.js'

const TOPICS = [
  'Diet & Nutrition',
  'Exercise & Yoga',
  'Symptoms & Solutions',
  'Baby Development',
  'Supplements',
  'Emotional Well-being',
]

function now() {
  return Date.now()
}
function fmtTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  } catch {
    return ''
  }
}
let idc = 0
const nextId = () => `${now()}-${idc++}`

export function Chatbot() {
  const { profile, lang, setLang } = useProfile()
  const t = useT()
  const [messages, setMessages] = useState(() => storage.getChat())
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [emergency, setEmergency] = useState(null) // null | { lang }
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [listening, setListening] = useState(false)
  const stopListenRef = useRef(null)
  const endRef = useRef(null)
  const [params, setParams] = useSearchParams()
  const openingHandled = useRef(false)

  const name = profile?.name?.split(' ')[0] || 'Priya'

  useEffect(() => {
    storage.setChat(messages)
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, emergency])

  // Opening message routed from the dashboard chips (?q=...). Send once.
  useEffect(() => {
    const q = params.get('q')
    if (q && !openingHandled.current) {
      openingHandled.current = true
      params.delete('q')
      setParams(params, { replace: true })
      send(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pushMessage(msg) {
    setMessages((prev) => [...prev, { id: nextId(), ts: now(), ...msg }])
  }

  async function send(rawText) {
    const text = String(rawText || '').trim()
    if (!text || typing) return
    setInput('')

    // Snapshot history BEFORE adding the new user turn (for Gemini context).
    const history = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text,
    }))

    pushMessage({ role: 'user', text })

    // ---- SAFETY LAYER 1: red flags. Never reaches Gemini on a match. ----
    const flag = checkRedFlags(text)
    if (flag.matched) {
      setEmergency({ lang })
      return
    }

    // ---- Clean → Gemini (SAFETY LAYER 2 re-checks urgency) ----
    setTyping(true)
    const res = await askMitra({ message: text, lang, history })
    setTyping(false)

    if (res.error === 'no-key') {
      pushMessage({ role: 'mitra', text: FALLBACKS.nokey[lang] || FALLBACKS.nokey.en })
      return
    }
    if (res.error === 'request-failed') {
      pushMessage({ role: 'mitra', text: FALLBACKS.error[lang] || FALLBACKS.error.en })
      return
    }
    if (res.urgency === 'emergency') {
      // Discard the model's text entirely — show the fixed screen.
      setEmergency({ lang })
      return
    }

    const reply = res.reply || FALLBACKS.error[lang] || FALLBACKS.error.en
    pushMessage({
      role: 'mitra',
      text: reply,
      urgency: res.urgency,
      chips: res.chips || [],
    })
    if (autoSpeak) speak(reply, lang)
  }

  function handleSubmit(e) {
    e.preventDefault()
    send(input)
  }

  function toggleVoice() {
    if (listening) {
      stopListenRef.current?.()
      setListening(false)
      return
    }
    setListening(true)
    stopListenRef.current = startListening({
      lang,
      onResult: (transcript) => setInput((v) => (v ? v + ' ' : '') + transcript),
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    })
  }

  function injectHealthSummary() {
    const summary =
      `My health summary — Month: ${ordinalMonth(profile?.month)} (${ordinalTrimester(
        profile?.trimester
      )} trimester), ` +
      `Food preference: ${profile?.food || 'not set'}, ` +
      `Conditions: ${
        Array.isArray(profile?.conditions) && profile.conditions.length
          ? profile.conditions.join(', ')
          : 'none noted'
      }. Please keep this in mind when you help me.`
    send(summary)
  }

  function clearChat() {
    stopSpeaking()
    setMessages([])
    storage.clearChat()
    setEmergency(null)
  }

  const showFirstRun = messages.length === 0 && !emergency

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-ink leading-tight">{t('chat.title')}</h1>
            <Badge tone="primary">{t('chat.pill')}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{t('chat.sub', { name })}</p>
        </div>
        <button
          onClick={clearChat}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink border border-line rounded-xl px-3 py-2 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Trash2 size={15} /> {t('chat.clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Main chat */}
        <div className="rounded-2xl bg-white border border-line shadow-card flex flex-col min-h-[520px]">
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 max-h-[62vh]">
            {showFirstRun && <FirstRun name={name} lang={lang} />}

            {emergency ? (
              <EmergencyScreen lang={emergency.lang} onDismiss={() => setEmergency(null)} />
            ) : (
              <>
                {messages.map((m, i) => (
                  <MessageBubble
                    key={m.id}
                    msg={m}
                    lang={lang}
                    isLastMitra={
                      m.role === 'mitra' && i === messages.length - 1 && !typing
                    }
                    onChip={(c) => send(c)}
                  />
                ))}
                {typing && <TypingIndicator />}
              </>
            )}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          {!emergency && (
            <div className="border-t border-line p-4">
              {/* Action row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <button
                  onClick={toggleVoice}
                  disabled={!speechSupported()}
                  title={speechSupported() ? t('chat.voiceInput') : t('chat.voiceUnsupported')}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 ${
                    listening
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-line text-ink hover:bg-canvas'
                  }`}
                >
                  {listening ? <Square size={14} /> : <Mic size={14} />}
                  {listening ? t('chat.listening') : t('chat.voiceInput')}
                </button>

                <button
                  disabled
                  title={t('common.comingSoon')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13px] font-medium text-ink-faint bg-white cursor-not-allowed"
                >
                  <ImagePlus size={14} /> {t('chat.uploadImage')}
                </button>

                <button
                  onClick={injectHealthSummary}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13px] font-medium text-ink bg-white hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <ClipboardList size={14} /> {t('chat.healthSummary')}
                </button>

                <button
                  onClick={() => {
                    stopSpeaking()
                    setAutoSpeak((v) => !v)
                  }}
                  className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    autoSpeak
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
                      : 'bg-white border-line text-ink-muted hover:bg-canvas'
                  }`}
                  aria-pressed={autoSpeak}
                >
                  <Volume2 size={14} /> {autoSpeak ? t('chat.autoSpeakOn') : t('chat.autoSpeakOff')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat.placeholder')}
                  aria-label={t('chat.placeholder')}
                  className="flex-1 rounded-xl border border-line bg-canvas px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white w-12 h-12 hover:bg-indigo-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="mt-2 text-xs text-ink-faint">{t('chat.helper')}</p>
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <HealthSummaryCard profile={profile} lang={lang} />

          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink mb-3">{t('chat.chatTopics')}</h2>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((tp) => (
                <Chip key={tp} onClick={() => send(t(`chat.topics.${tp}`))}>
                  {t(`chat.topics.${tp}`)}
                </Chip>
              ))}
            </div>
          </div>

          <VoiceAssistantPanel
            lang={lang}
            setLang={setLang}
            listening={listening}
            onToggle={toggleVoice}
          />
        </aside>
      </div>
    </>
  )
}

function FirstRun({ name }) {
  const t = useT()
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5">
        <MitraAvatar />
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white border border-line px-4 py-2.5 text-sm text-ink shadow-card">
          {t('chat.greeting', { name })}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-canvas border border-line px-3 py-2 text-xs text-ink-muted">
        <Info size={14} className="shrink-0 text-ink-faint" />
        <span>{t('chat.privacyNote')}</span>
      </div>
    </div>
  )
}

function MitraAvatar() {
  return (
    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
      <Heart size={15} fill="#EEF0FF" stroke="#EEF0FF" />
    </span>
  )
}

function MessageBubble({ msg, lang, isLastMitra, onChip }) {
  const t = useT()
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-tr-sm bg-indigo-50 text-ink px-4 py-2.5 text-sm">
            {msg.text}
          </div>
          <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-ink-faint">
            {fmtTime(msg.ts)} <CheckCheck size={13} className="text-indigo-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2.5">
      <MitraAvatar />
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tl-sm bg-white border border-line px-4 py-2.5 text-sm text-ink shadow-card" lang={lang}>
          {msg.text}
        </div>

        {msg.urgency === 'doctor_soon' && (
          <div className="mt-1.5 rounded-xl bg-tint-schemes border border-amber-100 px-3 py-2 text-xs text-amber-700" lang={lang}>
            {FALLBACKS.doctorSoon[lang] || FALLBACKS.doctorSoon.en}
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-ink-faint">{fmtTime(msg.ts)}</span>
          <button
            onClick={() => speak(msg.text, lang)}
            title={t('chat.readAloud')}
            aria-label={t('chat.readAloud')}
            className="text-ink-faint hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            <Volume2 size={14} />
          </button>
        </div>

        {isLastMitra && Array.isArray(msg.chips) && msg.chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {msg.chips.slice(0, 3).map((c, i) => (
              <Chip key={i} onClick={() => onChip(c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5" aria-label="Mitra is typing">
      <MitraAvatar />
      <div className="rounded-2xl rounded-tl-sm bg-white border border-line px-4 py-3 shadow-card flex items-center gap-1">
        <span className="typing-dot w-2 h-2 rounded-full bg-indigo-300" />
        <span className="typing-dot w-2 h-2 rounded-full bg-indigo-300" />
        <span className="typing-dot w-2 h-2 rounded-full bg-indigo-300" />
      </div>
    </div>
  )
}

function HealthSummaryCard({ profile, lang }) {
  const t = useT()
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <h2 className="text-base font-semibold text-ink mb-3">{t('chat.healthSummary')}</h2>
      <dl className="space-y-2.5 text-sm">
        <Row label={t('chat.pregnancyMonthRail')}>
          {profile?.month
            ? `${ordinalMonth(profile.month, lang)} (${ordinalTrimester(profile.trimester, lang)})`
            : '—'}
        </Row>
        <Row label={t('chat.poshanScoreRail')}>
          <span className="font-semibold text-emerald-600">{profile?.poshanScore ?? 78}/100 ↑</span>
        </Row>
        <Row label={t('chat.lastCheckup')}>{t('chat.daysAgo')}</Row>
        <Row label={t('chat.nextCheckupRail')}>{formatIN(nextCheckupDate(), lang)}</Row>
      </dl>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink text-right">{children}</dd>
    </div>
  )
}

function VoiceAssistantPanel({ lang, setLang, listening, onToggle }) {
  const t = useT()
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5 text-center">
      <h2 className="text-base font-semibold text-ink mb-4">{t('chat.voiceAssistant')}</h2>
      <button
        onClick={onToggle}
        disabled={!speechSupported()}
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 ${
          listening ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
        }`}
        aria-label={listening ? 'Stop listening' : 'Start voice input'}
      >
        {listening ? <Square size={26} /> : <Mic size={26} />}
      </button>
      <div className="mt-3 flex items-center justify-center gap-1 h-6" aria-hidden="true">
        {[10, 16, 22, 16, 10, 18, 12].map((h, i) => (
          <span
            key={i}
            className={`w-1 rounded-full ${listening ? 'bg-indigo-400' : 'bg-indigo-100'}`}
            style={{ height: h }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-faint">
        {speechSupported()
          ? listening
            ? t('chat.listeningNow')
            : t('chat.tapToSpeak')
          : t('chat.voiceUnsupported')}
      </p>

      <div className="mt-4 inline-flex rounded-full border border-line p-0.5 bg-canvas">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              lang === l.code ? 'bg-indigo-600 text-white' : 'text-ink-muted hover:text-ink'
            }`}
            lang={l.code}
          >
            {l.code === 'en' ? 'English' : l.code === 'hi' ? 'हिंदी' : 'मराठी'}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Salad, FileText, MapPin, Phone } from 'lucide-react'
import { LogoMark } from './Logo.jsx'
import { ttsSupported, stopSpeaking } from '../lib/speech.js'

// Self-playing product demo for the landing page — an animated walkthrough of the
// real features with a synchronized voice-over spoken by the Web Speech API in the
// selected language (en-IN / hi-IN / mr-IN). No video file, no account, works
// offline. Timer-driven: each scene shows for `ms` with narration layered on top
// and cancelled on scene change / pause. Captions are always visible, so the demo
// is fully usable muted or when a browser omits speech. All text comes from the
// `content` prop (landingContent.js) so the whole tour is trilingual.

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const BCP47 = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' }
const SCENE_MS = [6200, 5200, 5600, 4800, 6200, 5200]
const RENDERERS = [SceneChat, SceneDiet, SceneSchemes, SceneHospitals, SceneSafety, SceneClosing]

function narrate(text, lang) {
  try {
    const s = window.speechSynthesis
    if (!s || !text) return
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = BCP47[lang] || 'en-IN'
    u.rate = 1
    u.pitch = 1
    const voices = s.getVoices?.() || []
    const v = voices.find((x) => x.lang === u.lang) || voices.find((x) => x.lang?.startsWith(lang))
    if (v) u.voice = v
    s.speak(u)
  } catch {
    /* no-op */
  }
}

export function ProductDemo({ content, lang = 'en' }) {
  const demo = content.demo
  const m = demo.mock
  const scenes = demo.scenes.map((sc, idx) => ({ ...sc, ms: SCENE_MS[idx], Render: RENDERERS[idx] }))

  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [muted, setMuted] = useState(false)
  const [i, setI] = useState(0)
  const canSpeak = useRef(false)

  useEffect(() => {
    canSpeak.current = ttsSupported()
  }, [])

  useEffect(() => {
    if (!started || !playing) return
    const scene = scenes[i]
    if (!muted && canSpeak.current) narrate(scene.narration, lang)
    const to = setTimeout(() => {
      if (i < scenes.length - 1) setI(i + 1)
      else {
        setPlaying(false)
        setFinished(true)
      }
    }, scene.ms)
    return () => {
      clearTimeout(to)
      stopSpeaking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, playing, muted, started, lang])

  useEffect(() => () => stopSpeaking(), [])

  function start() {
    setStarted(true)
    setFinished(false)
    setI(0)
    setPlaying(true)
  }
  function togglePlay() {
    if (finished || !started) return start()
    setPlaying((p) => !p)
  }
  function restart() {
    stopSpeaking()
    setI(0)
    setFinished(false)
    setStarted(true)
    setPlaying(true)
  }
  function toggleMute() {
    setMuted((prev) => {
      const next = !prev
      if (next) stopSpeaking()
      else if (playing && canSpeak.current) narrate(scenes[i].narration, lang)
      return next
    })
  }

  const scene = scenes[i]
  const Render = scene.Render
  const reduce = prefersReduced()

  return (
    <div className="rounded-3xl bg-white border border-line shadow-card overflow-hidden">
      {/* Screen */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 aspect-video flex items-center justify-center p-4 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-8 -left-8 w-40 h-40 bg-white/10 lp-blob" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 w-48 h-48 bg-white/10 lp-blob" style={{ animationDelay: '3s' }} />

        <div key={i} className={`relative w-full max-w-md ${reduce ? '' : 'lp-pop'}`}>
          <Render m={m} />
        </div>

        {(!started || !playing) && (
          <button
            onClick={togglePlay}
            aria-label={finished ? 'Replay demo' : started ? 'Resume demo' : 'Play demo'}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-indigo-900/45 backdrop-blur-[1px] text-white"
          >
            <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-indigo-600 shadow-lg">
              {!reduce && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-white/60 lp-ring" />}
              {finished ? <RotateCcw size={26} className="relative" /> : <Play size={28} className="relative ml-1" fill="currentColor" />}
            </span>
            <span className="text-sm font-semibold">
              {finished ? demo.replay : started ? demo.resume : demo.poster}
            </span>
            {!started && <span className="text-xs text-indigo-100">{demo.tourNote}</span>}
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="px-5 py-3 bg-ink text-white text-sm text-center min-h-[52px] flex items-center justify-center" aria-live="polite">
        <p className="max-w-2xl" lang={lang}>{started ? scene.narration : demo.caption0}</p>
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-5 py-3 flex items-center gap-3">
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {finished ? <RotateCcw size={18} /> : playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
        </button>

        <div className="flex-1 flex items-center gap-1.5">
          {scenes.map((s, idx) => (
            <span key={idx} className="h-1.5 flex-1 rounded-full bg-canvas overflow-hidden">
              <span
                className={`block h-full rounded-full ${(idx < i || finished || (idx === i && started)) ? 'bg-indigo-600 w-full' : 'w-0'}`}
                style={idx === i && started && playing && !reduce ? { animation: `lp-fillbar ${s.ms}ms linear` } : undefined}
              />
            </span>
          ))}
        </div>

        <span className="hidden sm:block text-xs text-ink-muted tabular-nums shrink-0 w-10 text-right">
          {started ? `${i + 1}/${scenes.length}` : `${scenes.length}`}
        </span>

        <button onClick={restart} aria-label="Restart demo" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-muted hover:bg-canvas shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <RotateCcw size={16} />
        </button>
        <button onClick={toggleMute} aria-label={muted ? 'Unmute voice-over' : 'Mute voice-over'} className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-muted hover:bg-canvas shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  )
}

/* ---------------------------- Scene mock screens --------------------------- */

function MockScreen({ title, tint = '#EEF0FF', icon: Icon, children }) {
  return (
    <div className="rounded-2xl bg-white shadow-xl shadow-indigo-950/20 overflow-hidden text-left">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg" style={{ backgroundColor: tint }}>
          {Icon ? <Icon size={15} className="text-indigo-600" /> : <LogoMark size={15} />}
        </span>
        <span className="text-[13px] font-semibold text-ink">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function SceneChat({ m }) {
  return (
    <MockScreen title={m.mitra}>
      <div className="space-y-2.5">
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 text-white text-[13px] px-3 py-2">{m.chatQ}</p>
        </div>
        <div className="flex justify-start">
          <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-canvas border border-line text-[13px] text-ink px-3 py-2">{m.chatA}</p>
        </div>
      </div>
    </MockScreen>
  )
}

function SceneDiet({ m }) {
  return (
    <MockScreen title={m.mealTitle} tint="#ECFDF5" icon={Salad}>
      <div className="space-y-2">
        {[[m.breakfast, m.b_food], [m.lunch, m.l_food], [m.snack, m.s_food]].map(([meal, food]) => (
          <div key={meal} className="flex items-center justify-between rounded-xl bg-canvas border border-line px-3 py-2">
            <span className="text-[12px] font-semibold text-ink-muted">{meal}</span>
            <span className="text-[13px] text-ink">{food}</span>
          </div>
        ))}
        <p className="text-[11px] text-ink-faint pt-1">{m.mealNote}</p>
      </div>
    </MockScreen>
  )
}

function SceneSchemes({ m }) {
  return (
    <MockScreen title={m.schemeTitle} tint="#FFFBEB" icon={FileText}>
      <div className="space-y-2">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <p className="text-[13px] font-semibold text-ink">Matru Vandana Yojana (PMMVY)</p>
          <p className="text-[12px] text-emerald-700 mt-0.5">{m.eligible}</p>
        </div>
        <div className="rounded-xl border border-line bg-canvas px-3 py-2.5">
          <p className="text-[13px] font-semibold text-ink">Janani Suraksha Yojana</p>
          <p className="text-[12px] text-ink-muted mt-0.5">{m.jsyDesc}</p>
        </div>
      </div>
    </MockScreen>
  )
}

function SceneHospitals({ m }) {
  return (
    <MockScreen title={m.hospTitle} tint="#EFF6FF" icon={MapPin}>
      <div className="relative h-24 rounded-xl bg-[#EAF1FB] border border-line overflow-hidden mb-2">
        {[[24, 34], [58, 22], [40, 62], [78, 54]].map(([x, y], k) => (
          <span key={k} className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center" style={{ left: `${x}%`, top: `${y}%` }}>{k + 1}</span>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-canvas border border-line px-3 py-2">
        <span className="text-[13px] text-ink">{m.hospMeta}</span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600"><Phone size={12} /> {m.call}</span>
      </div>
    </MockScreen>
  )
}

function SceneSafety({ m }) {
  return (
    <div className="rounded-2xl bg-white shadow-xl shadow-indigo-950/20 overflow-hidden text-center border-t-4 border-emergency">
      <div className="p-5">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
          <Phone size={22} className="text-emergency" />
        </span>
        <p className="mt-3 text-[15px] font-bold text-ink">{m.safeTitle}</p>
        <p className="mt-1 text-[12px] text-ink-muted">{m.safeSub}</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emergency text-white text-sm font-semibold px-4 py-2">
          <Phone size={15} /> {m.call108}
        </span>
      </div>
    </div>
  )
}

function SceneClosing({ m }) {
  return (
    <div className="text-center text-white">
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mx-auto">
        <LogoMark size={34} />
      </span>
      <p className="mt-4 text-xl font-bold">PoshanMitra AI</p>
      <p className="mt-1 text-sm text-indigo-100">Swasth Maa · Swasth Shishu · Swasth Bharat</p>
      <span className="mt-4 inline-flex items-center rounded-xl bg-white text-indigo-600 text-sm font-semibold px-4 py-2">{m.getStartedFree}</span>
    </div>
  )
}

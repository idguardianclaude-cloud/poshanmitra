import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, MessageCircle, Salad, FileText, MapPin, Phone } from 'lucide-react'
import { LogoMark } from './Logo.jsx'
import { ttsSupported, stopSpeaking } from '../lib/speech.js'

// Self-playing product demo for the landing page — an animated walkthrough of the
// real features with a synchronized voice-over spoken by the Web Speech API (the
// same API the app already uses; no video file, no account, works offline). It is
// timer-driven: each scene shows for `ms`, with the narration layered on top and
// cancelled on scene change / pause. Captions are always visible, so the demo is
// fully usable when audio is muted or the browser blocks/omits speech synthesis.
// Playback begins on a user click (the gesture that unlocks audio autoplay).

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const SCENES = [
  {
    label: 'Meet Mitra',
    ms: 6200,
    narration:
      'Meet Mitra, your caring pregnancy companion. Ask anything about diet, health, or your baby — in English, Hindi, or Marathi.',
    render: SceneChat,
  },
  {
    label: 'Daily nutrition',
    ms: 5200,
    narration:
      'Each day, Mitra shares a sample meal plan for your trimester, using everyday Indian foods.',
    render: SceneDiet,
  },
  {
    label: 'Government schemes',
    ms: 5600,
    narration:
      'See which government schemes you qualify for, like the Matru Vandana Yojana, in just a few taps.',
    render: SceneSchemes,
  },
  {
    label: 'Nearby hospitals',
    ms: 4800,
    narration: 'Find maternity hospitals near you, with directions and one-tap calling.',
    render: SceneHospitals,
  },
  {
    label: 'Safety first',
    ms: 6200,
    narration:
      'And if you ever describe a danger sign, Mitra instantly shows an emergency screen with 108. Safety always comes first.',
    render: SceneSafety,
  },
  {
    label: 'Start free',
    ms: 5200,
    narration: 'PoshanMitra. Swasth Maa, Swasth Shishu, Swasth Bharat. Get started free today.',
    render: SceneClosing,
  },
]

function narrate(text) {
  try {
    const s = window.speechSynthesis
    if (!s) return
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-IN'
    u.rate = 1
    u.pitch = 1
    const voices = s.getVoices?.() || []
    const v = voices.find((x) => x.lang === 'en-IN') || voices.find((x) => x.lang?.startsWith('en'))
    if (v) u.voice = v
    s.speak(u)
  } catch {
    /* no-op */
  }
}

export function ProductDemo() {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [muted, setMuted] = useState(false)
  const [i, setI] = useState(0)
  const canSpeak = useRef(false)

  useEffect(() => {
    canSpeak.current = ttsSupported()
  }, [])

  // Drive the current scene: narrate (unless muted) and advance after `ms`.
  useEffect(() => {
    if (!started || !playing) return
    const scene = SCENES[i]
    if (!muted && canSpeak.current) narrate(scene.narration)
    const to = setTimeout(() => {
      if (i < SCENES.length - 1) setI(i + 1)
      else {
        setPlaying(false)
        setFinished(true)
      }
    }, scene.ms)
    return () => {
      clearTimeout(to)
      stopSpeaking()
    }
  }, [i, playing, muted, started])

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
    setMuted((m) => {
      const next = !m
      if (next) stopSpeaking()
      else if (playing && canSpeak.current) narrate(SCENES[i].narration)
      return next
    })
  }

  const scene = SCENES[i]
  const Scene = scene.render
  const reduce = prefersReduced()

  return (
    <div className="rounded-3xl bg-white border border-line shadow-card overflow-hidden">
      {/* Screen */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 aspect-video flex items-center justify-center p-4 sm:p-8">
        {/* decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-8 -left-8 w-40 h-40 bg-white/10 lp-blob" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 w-48 h-48 bg-white/10 lp-blob" style={{ animationDelay: '3s' }} />

        {/* Scene mock */}
        <div key={i} className={`relative w-full max-w-md ${reduce ? '' : 'lp-pop'}`}>
          <Scene />
        </div>

        {/* Play / pause / replay overlay */}
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
              {finished ? 'Replay demo' : started ? 'Resume' : 'Watch the demo'}
            </span>
            {!started && <span className="text-xs text-indigo-100">2-minute tour · with voice-over</span>}
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="px-5 py-3 bg-ink text-white text-sm text-center min-h-[52px] flex items-center justify-center" aria-live="polite">
        <p className="max-w-2xl">{started ? scene.narration : 'A quick tour of how PoshanMitra helps you through pregnancy.'}</p>
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

        {/* Segmented progress */}
        <div className="flex-1 flex items-center gap-1.5">
          {SCENES.map((s, idx) => (
            <span key={s.label} className="h-1.5 flex-1 rounded-full bg-canvas overflow-hidden">
              <span
                className={`block h-full rounded-full ${idx < i || finished ? 'bg-indigo-600 w-full' : idx === i && started ? 'bg-indigo-600 w-full' : 'w-0'}`}
                style={idx === i && started && playing && !reduce ? { animation: `lp-fillbar ${s.ms}ms linear` } : undefined}
              />
            </span>
          ))}
        </div>

        <span className="hidden sm:block text-xs text-ink-muted tabular-nums shrink-0 w-10 text-right">
          {started ? `${i + 1}/${SCENES.length}` : `${SCENES.length}`}
        </span>

        <button
          onClick={restart}
          aria-label="Restart demo"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-muted hover:bg-canvas shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute voice-over' : 'Mute voice-over'}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-muted hover:bg-canvas shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
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

function SceneChat() {
  return (
    <MockScreen title="Mitra">
      <div className="space-y-2.5">
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-indigo-600 text-white text-[13px] px-3 py-2">I'm in my 5th month. What should I eat today?</p>
        </div>
        <div className="flex justify-start">
          <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-canvas border border-line text-[13px] text-ink px-3 py-2">Focus on iron and calcium — palak, dal, curd and a fruit. Here's a sample plan 🌸</p>
        </div>
      </div>
    </MockScreen>
  )
}

function SceneDiet() {
  return (
    <MockScreen title="Today's meal plan" tint="#ECFDF5" icon={Salad}>
      <div className="space-y-2">
        {[['Breakfast', 'Vegetable poha + milk'], ['Lunch', 'Roti, dal, palak sabzi, curd'], ['Snack', 'Fruit + roasted chana']].map(([m, f]) => (
          <div key={m} className="flex items-center justify-between rounded-xl bg-canvas border border-line px-3 py-2">
            <span className="text-[12px] font-semibold text-ink-muted">{m}</span>
            <span className="text-[13px] text-ink">{f}</span>
          </div>
        ))}
        <p className="text-[11px] text-ink-faint pt-1">Sample plan — general guidance for pregnancy.</p>
      </div>
    </MockScreen>
  )
}

function SceneSchemes() {
  return (
    <MockScreen title="Scheme eligibility" tint="#FFFBEB" icon={FileText}>
      <div className="space-y-2">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <p className="text-[13px] font-semibold text-ink">Matru Vandana Yojana (PMMVY)</p>
          <p className="text-[12px] text-emerald-700 mt-0.5">✓ You look eligible · ₹5,000 in instalments</p>
        </div>
        <div className="rounded-xl border border-line bg-canvas px-3 py-2.5">
          <p className="text-[13px] font-semibold text-ink">Janani Suraksha Yojana</p>
          <p className="text-[12px] text-ink-muted mt-0.5">Cash help for institutional delivery</p>
        </div>
      </div>
    </MockScreen>
  )
}

function SceneHospitals() {
  return (
    <MockScreen title="Nearby hospitals" tint="#EFF6FF" icon={MapPin}>
      <div className="relative h-24 rounded-xl bg-[#EAF1FB] border border-line overflow-hidden mb-2">
        {[[24, 34], [58, 22], [40, 62], [78, 54]].map(([x, y], k) => (
          <span key={k} className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center" style={{ left: `${x}%`, top: `${y}%` }}>{k + 1}</span>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-canvas border border-line px-3 py-2">
        <span className="text-[13px] text-ink">Sahyadri Hospital · 1.2 km</span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600"><Phone size={12} /> Call</span>
      </div>
    </MockScreen>
  )
}

function SceneSafety() {
  return (
    <div className="rounded-2xl bg-white shadow-xl shadow-indigo-950/20 overflow-hidden text-center border-t-4 border-emergency">
      <div className="p-5">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
          <Phone size={22} className="text-emergency" />
        </span>
        <p className="mt-3 text-[15px] font-bold text-ink">This may need urgent care</p>
        <p className="mt-1 text-[12px] text-ink-muted">Please contact a doctor or emergency services now.</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emergency text-white text-sm font-semibold px-4 py-2">
          <Phone size={15} /> Call 108
        </span>
      </div>
    </div>
  )
}

function SceneClosing() {
  return (
    <div className="text-center text-white">
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 mx-auto">
        <LogoMark size={34} />
      </span>
      <p className="mt-4 text-xl font-bold">PoshanMitra AI</p>
      <p className="mt-1 text-sm text-indigo-100" lang="hi">Swasth Maa · Swasth Shishu · Swasth Bharat</p>
      <span className="mt-4 inline-flex items-center rounded-xl bg-white text-indigo-600 text-sm font-semibold px-4 py-2">Get started free</span>
    </div>
  )
}

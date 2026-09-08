import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Send } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { storage } from '../lib/storage.js'
import { derivePregnancy } from '../lib/pregnancy.js'
import { Chip } from '../components/ui/Chip.jsx'
import { Button } from '../components/ui/Button.jsx'

// Five questions, asked one at a time, chat-style. Every answer is saved
// immediately (resume on reload). Every question offers Skip / I don't know,
// both storing null — never block progress on a skip. PRODUCT_SPEC §2.
const QUESTIONS = [
  {
    id: 'name',
    prompt:
      "Hello! I'm Mitra 👋 I'll ask you a few quick questions so I can help you better. What should I call you?",
    type: 'text',
    placeholder: 'Type your name…',
  },
  {
    id: 'dueBasis',
    prompt:
      'Lovely to meet you! Do you know your due date, or the date your last period started?',
    type: 'date-basis',
  },
  {
    id: 'age',
    prompt: 'How old are you? This helps me tailor guidance to you.',
    type: 'age',
    chips: ['20–25', '26–30', '31–35', 'Other'],
  },
  {
    id: 'food',
    prompt: 'What do you usually eat? I’ll keep your meal plan in line with it.',
    type: 'chips',
    chips: ['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Jain'],
  },
  {
    id: 'conditions',
    prompt:
      'Last one — have you been told about any of these? Pick all that apply, or choose None.',
    type: 'multi',
    chips: ['Anemia', 'Gestational diabetes', 'High BP', 'Thyroid', 'None', "I don't know"],
  },
]

export function Onboarding() {
  const { updateProfile, setProfile } = useProfile()
  const navigate = useNavigate()

  const saved = storage.getOnboarding()
  const [step, setStep] = useState(saved?.step ?? 0)
  const [answers, setAnswers] = useState(saved?.answers ?? {})
  // Seed the first Mitra prompt here (not in an effect) so StrictMode's double
  // invoke can't duplicate it.
  const [thread, setThread] = useState(
    saved?.thread?.length ? saved.thread : [{ role: 'mitra', text: QUESTIONS[0].prompt }]
  )
  const [textValue, setTextValue] = useState('')
  const [dateBasis, setDateBasis] = useState(null) // 'due' | 'lmp'
  const [dateValue, setDateValue] = useState('')
  const [ageValue, setAgeValue] = useState('')
  const [multi, setMulti] = useState([])
  const endRef = useRef(null)

  const q = QUESTIONS[step]
  const done = step >= QUESTIONS.length

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  function persist(next) {
    storage.setOnboarding(next)
  }

  function advance(answerValue, displayText) {
    const nextAnswers = { ...answers, [q.id]: answerValue }
    const userMsg = { role: 'user', text: displayText }
    const nextStep = step + 1

    // Save this answer into the profile immediately.
    if (q.id === 'name') updateProfile({ name: answerValue })
    if (q.id === 'age') updateProfile({ age: answerValue })
    if (q.id === 'food') updateProfile({ food: answerValue })
    if (q.id === 'conditions') updateProfile({ conditions: answerValue })
    if (q.id === 'dueBasis') {
      const derived = derivePregnancy(answerValue?.date, answerValue?.basis)
      updateProfile({
        dueBasis: answerValue,
        ...derived,
      })
    }

    setAnswers(nextAnswers)
    setThread((prev) => {
      const withUser = [...prev, userMsg]
      if (nextStep < QUESTIONS.length) {
        const withNext = [...withUser, { role: 'mitra', text: QUESTIONS[nextStep].prompt }]
        persist({ step: nextStep, answers: nextAnswers, thread: withNext })
        return withNext
      }
      // Finished.
      const closing = { role: 'mitra', text: 'Perfect ✅ Your PoshanMitra is ready.' }
      const finalThread = [...withUser, closing]
      persist({ step: nextStep, answers: nextAnswers, thread: finalThread })
      return finalThread
    })
    setStep(nextStep)

    // Reset transient inputs.
    setTextValue('')
    setDateBasis(null)
    setDateValue('')
    setAgeValue('')
    setMulti([])

    if (nextStep >= QUESTIONS.length) finish(nextAnswers)
  }

  function finish(finalAnswers) {
    // Seed poshanScore to match the approved mockups (78 across the app).
    updateProfile({ poshanScore: 78, onboarded: true })
    storage.clearOnboarding()
    setTimeout(() => navigate('/'), 900)
  }

  function skip() {
    advance(null, 'Skip')
  }

  const progress = Math.min(step + 1, QUESTIONS.length)

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-line px-6 py-4 flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-indigo-600 text-white">
          <Heart size={18} fill="#EEF0FF" stroke="#EEF0FF" />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-ink">Setting up your PoshanMitra</p>
          <p className="text-xs text-ink-faint">
            {done ? 'All set' : `${progress} of ${QUESTIONS.length}`}
          </p>
        </div>
        <div className="w-32 h-1.5 rounded-full bg-canvas overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(progress / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 py-6 space-y-4">
          {thread.map((m, i) => (
            <Bubble key={i} role={m.role} text={m.text} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* Answer controls */}
      {!done && (
        <div className="border-t border-line bg-white">
          <div className="max-w-lg mx-auto px-5 py-4">
            {q.type === 'text' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const v = textValue.trim()
                  if (v) advance(v, v)
                }}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={q.placeholder}
                  className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <Button type="submit" disabled={!textValue.trim()}>
                  <Send size={16} />
                </Button>
              </form>
            )}

            {q.type === 'date-basis' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Chip selected={dateBasis === 'due'} onClick={() => setDateBasis('due')}>
                    I know my due date
                  </Chip>
                  <Chip selected={dateBasis === 'lmp'} onClick={() => setDateBasis('lmp')}>
                    I know my last period date
                  </Chip>
                </div>
                {dateBasis && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (dateValue) {
                        const label =
                          dateBasis === 'due' ? 'Due date: ' : 'Last period: '
                        advance({ basis: dateBasis, date: dateValue }, label + dateValue)
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" disabled={!dateValue}>
                      Next
                    </Button>
                  </form>
                )}
              </div>
            )}

            {q.type === 'age' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {q.chips.map((c) => (
                    <Chip
                      key={c}
                      selected={c !== 'Other' && ageValue === c}
                      onClick={() => {
                        if (c === 'Other') {
                          setAgeValue('other')
                        } else {
                          advance(c, c)
                        }
                      }}
                    >
                      {c}
                    </Chip>
                  ))}
                </div>
                {ageValue === 'other' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const n = parseInt(textValue, 10)
                      if (n > 0) advance(n, `${n} years`)
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="number"
                      min="14"
                      max="60"
                      autoFocus
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Enter your age"
                      className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" disabled={!textValue}>
                      Next
                    </Button>
                  </form>
                )}
              </div>
            )}

            {q.type === 'chips' && (
              <div className="flex flex-wrap gap-2">
                {q.chips.map((c) => (
                  <Chip key={c} onClick={() => advance(c, c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            )}

            {q.type === 'multi' && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {q.chips.map((c) => {
                    const exclusive = c === 'None' || c === "I don't know"
                    const selected = multi.includes(c)
                    return (
                      <Chip
                        key={c}
                        selected={selected}
                        onClick={() => {
                          if (exclusive) {
                            setMulti([c])
                          } else {
                            setMulti((prev) =>
                              prev.includes(c)
                                ? prev.filter((x) => x !== c)
                                : [...prev.filter((x) => x !== 'None' && x !== "I don't know"), c]
                            )
                          }
                        }}
                      >
                        {c}
                      </Chip>
                    )
                  })}
                </div>
                <Button
                  disabled={multi.length === 0}
                  onClick={() => advance(multi, multi.join(', '))}
                >
                  Finish setup
                </Button>
              </div>
            )}

            {/* Universal skip */}
            <div className="mt-3">
              <button
                onClick={skip}
                className="text-xs text-ink-faint hover:text-ink-muted underline underline-offset-2"
              >
                Skip this question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Bubble({ role, text }) {
  if (role === 'mitra') {
    return (
      <div className="flex items-start gap-2.5">
        <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <Heart size={15} fill="#EEF0FF" stroke="#EEF0FF" />
        </span>
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white border border-line px-4 py-2.5 text-sm text-ink shadow-card">
          {text}
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-indigo-50 text-ink px-4 py-2.5 text-sm">
        {text}
      </div>
    </div>
  )
}

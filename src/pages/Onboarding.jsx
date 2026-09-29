import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Send } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { storage } from '../lib/storage.js'
import { derivePregnancy } from '../lib/pregnancy.js'
import { Chip } from '../components/ui/Chip.jsx'
import { Button } from '../components/ui/Button.jsx'
import { DisclaimerFooter } from '../components/layout/DisclaimerFooter.jsx'
import { useT, translate } from '../lib/i18n.js'
import { cleanName, isValidName, isValidAge, validatePregnancyDate } from '../lib/validate.js'

// Five questions, asked one at a time, chat-style. Every answer is saved
// immediately (resume on reload). Every question offers Skip / I don't know,
// both storing null — never block progress on a skip. PRODUCT_SPEC §2.
// Chip `values` are the canonical English tokens stored in the profile (the diet
// and eligibility logic depends on them, e.g. 'Vegetarian', 'Jain', 'None');
// their DISPLAY is translated via t() at render time.
const QUESTIONS = [
  { id: 'name', promptKey: 'onboarding.q_name', type: 'text' },
  { id: 'dueBasis', promptKey: 'onboarding.q_due', type: 'date-basis' },
  { id: 'age', promptKey: 'onboarding.q_age', type: 'age', chips: ['20–25', '26–30', '31–35', 'Other'] },
  {
    id: 'food',
    promptKey: 'onboarding.q_food',
    type: 'chips',
    chips: ['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Jain'],
  },
  {
    id: 'conditions',
    promptKey: 'onboarding.q_conditions',
    type: 'multi',
    chips: ['Anemia', 'Gestational diabetes', 'High BP', 'Thyroid', 'None', "I don't know"],
  },
]

// Translate a food/condition token for display, keeping the stored value canonical.
function labelFor(t, kind, value) {
  if (value === "I don't know") return t('conditions.dontKnow')
  return t(`${kind}.${value}`)
}

export function Onboarding() {
  const { updateProfile, setProfile, lang } = useProfile()
  const t = useT()
  const navigate = useNavigate()

  const saved = storage.getOnboarding()
  const [step, setStep] = useState(saved?.step ?? 0)
  const [answers, setAnswers] = useState(saved?.answers ?? {})
  // Seed the first Mitra prompt here (not in an effect) so StrictMode's double
  // invoke can't duplicate it.
  const [thread, setThread] = useState(
    saved?.thread?.length
      ? saved.thread
      : [{ role: 'mitra', text: translate(lang, QUESTIONS[0].promptKey) }]
  )
  const [textValue, setTextValue] = useState('')
  const [dateBasis, setDateBasis] = useState(null) // 'due' | 'lmp'
  const [dateValue, setDateValue] = useState('')
  const [ageValue, setAgeValue] = useState('')
  const [multi, setMulti] = useState([])
  const [err, setErr] = useState('')
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
        const withNext = [
          ...withUser,
          { role: 'mitra', text: t(QUESTIONS[nextStep].promptKey) },
        ]
        persist({ step: nextStep, answers: nextAnswers, thread: withNext })
        return withNext
      }
      // Finished.
      const closing = { role: 'mitra', text: t('onboarding.closing') }
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
    setErr('')

    if (nextStep >= QUESTIONS.length) finish(nextAnswers)
  }

  function finish(finalAnswers) {
    // Seed poshanScore to match the approved mockups (78 across the app).
    updateProfile({ poshanScore: 78, onboarded: true })
    // Clear inside the deferred step so it runs AFTER the final setThread/persist
    // commits — otherwise that persist re-writes the resume key we just cleared.
    setTimeout(() => {
      storage.clearOnboarding()
      navigate('/')
    }, 900)
  }

  function skip() {
    advance(null, t('onboarding.skip'))
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
          <p className="font-semibold text-ink">{t('onboarding.settingUp')}</p>
          <p className="text-xs text-ink-faint">
            {done
              ? t('onboarding.allSet')
              : t('onboarding.stepOf', { current: progress, total: QUESTIONS.length })}
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
                  const v = cleanName(textValue)
                  if (isValidName(v)) advance(v, v)
                  else setErr(t('valid.name'))
                }}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  maxLength={40}
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value)
                    setErr('')
                  }}
                  placeholder={t('onboarding.typeName')}
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
                    {t('onboarding.knowDueDate')}
                  </Chip>
                  <Chip selected={dateBasis === 'lmp'} onClick={() => setDateBasis('lmp')}>
                    {t('onboarding.knowLastPeriod')}
                  </Chip>
                </div>
                {dateBasis && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const code = validatePregnancyDate(dateValue, dateBasis)
                      if (code) {
                        setErr(
                          code === 'future'
                            ? t('valid.dateFuture')
                            : code === 'past'
                            ? t('valid.datePast')
                            : code === 'required'
                            ? t('valid.required')
                            : t('valid.dateRange')
                        )
                        return
                      }
                      const label =
                        dateBasis === 'due' ? t('onboarding.dueLabel') : t('onboarding.lmpLabel')
                      advance({ basis: dateBasis, date: dateValue }, label + dateValue)
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) => {
                        setDateValue(e.target.value)
                        setErr('')
                      }}
                      className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" disabled={!dateValue}>
                      {t('onboarding.next')}
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
                      if (isValidAge(n)) advance(n, `${n} ${t('onboarding.years')}`)
                      else setErr(t('valid.age'))
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="number"
                      min="14"
                      max="60"
                      autoFocus
                      value={textValue}
                      onChange={(e) => {
                        setTextValue(e.target.value)
                        setErr('')
                      }}
                      placeholder={t('onboarding.enterAge')}
                      className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" disabled={!textValue}>
                      {t('onboarding.next')}
                    </Button>
                  </form>
                )}
              </div>
            )}

            {q.type === 'chips' && (
              <div className="flex flex-wrap gap-2">
                {q.chips.map((c) => (
                  <Chip key={c} onClick={() => advance(c, labelFor(t, 'food', c))}>
                    {labelFor(t, 'food', c)}
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
                        {labelFor(t, 'conditions', c)}
                      </Chip>
                    )
                  })}
                </div>
                <Button
                  disabled={multi.length === 0}
                  onClick={() =>
                    advance(multi, multi.map((c) => labelFor(t, 'conditions', c)).join(', '))
                  }
                >
                  {t('onboarding.finishSetup')}
                </Button>
              </div>
            )}

            {err && <p className="mt-2 text-xs text-red-600">{err}</p>}

            {/* Universal skip */}
            <div className="mt-3">
              <button
                onClick={skip}
                className="text-xs text-ink-faint hover:text-ink-muted underline underline-offset-2"
              >
                {t('onboarding.skip')}
              </button>
            </div>
          </div>
        </div>
      )}

      <DisclaimerFooter />
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

// Tests for local reminder scheduling. The scheduling functions are pure and
// take an explicit `now`, so we can prove "is it due?" and "when next?" without
// timers. Also checks the safety-shaped validation (a tablet reminder never
// needs a medicine/dose — only a time and an optional label).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  makeReminder,
  isDue,
  appliesToday,
  dueReminders,
  markFired,
  nextOccurrence,
  upcoming,
  updateReminder,
  removeReminder,
} from './reminders.js'

// Fixed reference instant: Thursday 2026-01-08, 09:30 local.
const NOW = new Date(2026, 0, 8, 9, 30, 0)

test('makeReminder validates shape and rejects bad input', () => {
  assert.equal(makeReminder({ kind: 'anc', time: '09:00', repeat: 'daily' }).repeat, 'daily')
  assert.equal(makeReminder({ kind: 'bogus', time: '09:00', repeat: 'daily' }), null)
  assert.equal(makeReminder({ kind: 'anc', time: '9am', repeat: 'daily' }), null)
  assert.equal(makeReminder({ kind: 'anc', time: '09:00', repeat: 'once' }), null) // needs date
  assert.equal(makeReminder({ kind: 'anc', time: '09:00', repeat: 'weekly', days: [] }), null)
})

test('daily reminder is due once its time has passed, not before', () => {
  const before = makeReminder({ kind: 'tablet', time: '10:00', repeat: 'daily' })
  const after = makeReminder({ kind: 'tablet', time: '08:00', repeat: 'daily' })
  assert.equal(isDue(before, NOW), false)
  assert.equal(isDue(after, NOW), true)
})

test('a fired reminder does not fire again the same day', () => {
  const r = makeReminder({ kind: 'tablet', time: '08:00', repeat: 'daily' })
  assert.equal(isDue(r, NOW), true)
  const [fired] = markFired([r], [r.id], NOW)
  assert.equal(isDue(fired, NOW), false)
})

test('once reminder only applies on its date, then disables after firing', () => {
  const r = makeReminder({ kind: 'anc', time: '08:00', repeat: 'once', date: '2026-01-08' })
  assert.equal(appliesToday(r, NOW), true)
  assert.equal(appliesToday(r, new Date(2026, 0, 9, 8, 0)), false)
  const [fired] = markFired([r], [r.id], NOW)
  assert.equal(fired.enabled, false) // one-off won't nag again
})

test('weekly reminder applies only on its chosen weekdays', () => {
  // Thursday = 4. NOW is a Thursday.
  const thu = makeReminder({ kind: 'anc', time: '08:00', repeat: 'weekly', days: [4] })
  const mon = makeReminder({ kind: 'anc', time: '08:00', repeat: 'weekly', days: [1] })
  assert.equal(isDue(thu, NOW), true)
  assert.equal(isDue(mon, NOW), false)
})

test('disabled reminders never fire', () => {
  const r = { ...makeReminder({ kind: 'tablet', time: '08:00', repeat: 'daily' }), enabled: false }
  assert.equal(isDue(r, NOW), false)
})

test('dueReminders returns only the currently-due ones', () => {
  const list = [
    makeReminder({ kind: 'tablet', time: '08:00', repeat: 'daily' }),
    makeReminder({ kind: 'tablet', time: '22:00', repeat: 'daily' }),
  ]
  const due = dueReminders(list, NOW)
  assert.equal(due.length, 1)
  assert.equal(due[0].time, '08:00')
})

test('nextOccurrence finds the next matching datetime', () => {
  const daily = makeReminder({ kind: 'tablet', time: '10:00', repeat: 'daily' })
  const next = nextOccurrence(daily, NOW)
  assert.equal(next.getHours(), 10)
  assert.equal(next.getDate(), 8) // later today

  const passedDaily = makeReminder({ kind: 'tablet', time: '08:00', repeat: 'daily' })
  assert.equal(nextOccurrence(passedDaily, NOW).getDate(), 9) // tomorrow

  const pastOnce = makeReminder({ kind: 'anc', time: '08:00', repeat: 'once', date: '2020-01-01' })
  assert.equal(nextOccurrence(pastOnce, NOW), null)
})

test('upcoming sorts enabled reminders by next fire time', () => {
  const list = [
    makeReminder({ kind: 'tablet', time: '22:00', repeat: 'daily' }),
    makeReminder({ kind: 'tablet', time: '10:00', repeat: 'daily' }),
  ]
  const up = upcoming(list, NOW, 5)
  assert.equal(up[0].time, '10:00')
  assert.equal(up[1].time, '22:00')
})

test('update/remove operate by id immutably', () => {
  const r = makeReminder({ kind: 'anc', time: '09:00', repeat: 'daily' })
  const list = [r]
  const off = updateReminder(list, r.id, { enabled: false })
  assert.equal(off[0].enabled, false)
  assert.equal(list[0].enabled, true) // original untouched
  assert.equal(removeReminder(list, r.id).length, 0)
})

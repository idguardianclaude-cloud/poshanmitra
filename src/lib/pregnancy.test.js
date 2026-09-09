import { test } from 'node:test'
import assert from 'node:assert/strict'
import { derivePregnancy, ordinalMonth, ordinalTrimester, formatDateIN } from './pregnancy.js'

const DAY = 86400000

test('derives ~18 weeks from an LMP 18 weeks + 3 days ago', () => {
  const lmp = new Date(Date.now() - (18 * 7 + 3) * DAY).toISOString().slice(0, 10)
  const d = derivePregnancy(lmp, 'lmp')
  assert.equal(d.weeks, 18)
  assert.equal(d.days, 3)
  assert.equal(d.trimester, 2)
  assert.equal(d.month, 5)
})

test('due-date basis: EDD is 280 days after LMP', () => {
  const lmp = new Date('2025-01-01')
  const due = new Date(lmp.getTime() + 280 * DAY).toISOString().slice(0, 10)
  const d = derivePregnancy(due, 'due')
  assert.equal(d.dueDate, due)
})

test('trimester boundaries', () => {
  // 8 weeks → 1st, 20 weeks → 2nd, 30 weeks → 3rd
  const at = (w) => derivePregnancy(new Date(Date.now() - w * 7 * DAY).toISOString().slice(0, 10), 'lmp').trimester
  assert.equal(at(8), 1)
  assert.equal(at(20), 2)
  assert.equal(at(30), 3)
})

test('missing/invalid input returns nulls, no throw', () => {
  assert.deepEqual(derivePregnancy(null), { weeks: null, days: null, trimester: null, month: null, dueDate: null })
  assert.deepEqual(derivePregnancy('not-a-date'), { weeks: null, days: null, trimester: null, month: null, dueDate: null })
})

test('formatting helpers', () => {
  assert.equal(ordinalMonth(5), '5th')
  assert.equal(ordinalTrimester(2), '2nd')
  assert.equal(ordinalMonth(null), '—')
  assert.match(formatDateIN('2025-05-12'), /12 May 2025/)
})

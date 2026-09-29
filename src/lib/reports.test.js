// Tests for the Reports log logic. These lock the sanity-bound validation (a
// typo like 900 kg is rejected), the BP two-field handling, series sorting for
// the trend line, and the descriptive-only trend direction. This is a personal
// record, never a clinical verdict — there are deliberately no "high/low" tests.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isValidReading,
  makeReading,
  addReading,
  removeReading,
  seriesFor,
  latestFor,
  trendFor,
  displayValue,
  plotValue,
  getMetric,
} from './reports.js'

test('accepts an in-range single-value reading', () => {
  assert.equal(isValidReading('hb', { value: 11.5 }), true)
  assert.equal(isValidReading('weight', { value: 62 }), true)
})

test('rejects out-of-range or non-numeric readings (typo guard)', () => {
  assert.equal(isValidReading('weight', { value: 900 }), false)
  assert.equal(isValidReading('hb', { value: 'abc' }), false)
  assert.equal(isValidReading('hb', {}), false)
})

test('BP requires both systolic and diastolic in range', () => {
  assert.equal(isValidReading('bp', { systolic: 120, diastolic: 80 }), true)
  assert.equal(isValidReading('bp', { systolic: 120 }), false)
  assert.equal(isValidReading('bp', { systolic: 999, diastolic: 80 }), false)
})

test('makeReading returns null on invalid, a normalised object on valid', () => {
  assert.equal(makeReading('hb', { value: 'x' }), null)
  const r = makeReading('hb', { value: 11 }, { date: '2026-01-02', note: ' morning ' })
  assert.equal(r.metric, 'hb')
  assert.equal(r.value, 11)
  assert.equal(r.date, '2026-01-02')
})

test('unknown metric is invalid', () => {
  assert.equal(isValidReading('bogus', { value: 1 }), false)
  assert.equal(makeReading('bogus', { value: 1 }), null)
})

test('add/remove are immutable and work by id', () => {
  const a = makeReading('weight', { value: 60 }, { date: '2026-01-01' })
  const b = makeReading('weight', { value: 61 }, { date: '2026-01-08' })
  let list = addReading(addReading([], a), b)
  assert.equal(list.length, 2)
  list = removeReading(list, a.id)
  assert.equal(list.length, 1)
  assert.equal(list[0].id, b.id)
})

test('seriesFor filters by metric and sorts oldest → newest', () => {
  const list = [
    makeReading('weight', { value: 62 }, { date: '2026-02-01' }),
    makeReading('hb', { value: 11 }, { date: '2026-01-15' }),
    makeReading('weight', { value: 60 }, { date: '2026-01-01' }),
  ]
  const s = seriesFor(list, 'weight')
  assert.deepEqual(s.map((r) => r.value), [60, 62])
})

test('latestFor returns the most recent reading', () => {
  const list = [
    makeReading('weight', { value: 60 }, { date: '2026-01-01' }),
    makeReading('weight', { value: 64 }, { date: '2026-03-01' }),
  ]
  assert.equal(latestFor(list, 'weight').value, 64)
  assert.equal(latestFor(list, 'hb'), null)
})

test('trendFor describes movement between the last two readings only', () => {
  const up = [
    makeReading('weight', { value: 60 }, { date: '2026-01-01' }),
    makeReading('weight', { value: 62 }, { date: '2026-02-01' }),
  ]
  assert.equal(trendFor(up, 'weight'), 'up')
  assert.equal(trendFor([up[0]], 'weight'), null) // need two points
})

test('displayValue and plotValue handle BP as systolic/diastolic', () => {
  const bp = makeReading('bp', { systolic: 118, diastolic: 76 }, { date: '2026-01-01' })
  assert.equal(displayValue(bp), '118/76')
  assert.equal(plotValue(bp), 118)
})

test('every metric has translation-ready keys and fields', () => {
  for (const key of ['hb', 'bp', 'sugar', 'weight']) {
    const m = getMetric(key)
    assert.ok(m && m.fields.length >= 1 && m.unit)
  }
})

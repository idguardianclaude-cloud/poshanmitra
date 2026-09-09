// Tests for Mitra's response parsing — the SECOND safety layer. If this misreads
// an "emergency" urgency, a danger-sign reply could slip through, so parsing must
// be strict about the urgency field and safe on malformed input.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseResponse } from './gemini.js'

test('parses a clean JSON object', () => {
  const r = parseResponse('{"reply":"Drink water","urgency":"routine","chips":["a","b"]}')
  assert.equal(r.reply, 'Drink water')
  assert.equal(r.urgency, 'routine')
  assert.deepEqual(r.chips, ['a', 'b'])
})

test('preserves an emergency urgency so layer 2 can catch it', () => {
  const r = parseResponse('{"reply":"go now","urgency":"emergency","chips":[]}')
  assert.equal(r.urgency, 'emergency')
})

test('strips ```json code fences', () => {
  const r = parseResponse('```json\n{"reply":"hi","urgency":"routine","chips":[]}\n```')
  assert.equal(r.reply, 'hi')
  assert.equal(r.urgency, 'routine')
})

test('extracts the JSON object from surrounding prose', () => {
  const r = parseResponse('Sure! {"reply":"ok","urgency":"doctor_soon","chips":[]} hope that helps')
  assert.equal(r.reply, 'ok')
  assert.equal(r.urgency, 'doctor_soon')
})

test('unknown urgency value falls back to routine (never invents emergency)', () => {
  const r = parseResponse('{"reply":"ok","urgency":"critical","chips":[]}')
  assert.equal(r.urgency, 'routine')
})

test('malformed JSON becomes a routine reply with the raw text', () => {
  const r = parseResponse('just some plain text, not json')
  assert.equal(r.urgency, 'routine')
  assert.equal(r.reply, 'just some plain text, not json')
})

test('caps chips at 3 and stringifies them', () => {
  const r = parseResponse('{"reply":"x","urgency":"routine","chips":["a","b","c","d","e"]}')
  assert.equal(r.chips.length, 3)
  assert.deepEqual(r.chips, ['a', 'b', 'c'])
})

test('empty / nullish input is a safe routine blank', () => {
  assert.deepEqual(parseResponse(''), { reply: '', urgency: 'routine', chips: [] })
  assert.deepEqual(parseResponse(null), { reply: '', urgency: 'routine', chips: [] })
})

test('non-array chips are coerced to an empty array', () => {
  const r = parseResponse('{"reply":"x","urgency":"routine","chips":"nope"}')
  assert.deepEqual(r.chips, [])
})

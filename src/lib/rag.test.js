// Tests for the RAG retrieval layer (rag.js). These lock the behaviour that
// matters: common questions retrieve the RIGHT vetted passage, cross-language
// and romanised phrasing still hits, and off-topic / empty input grounds
// nothing (so we never inject noise). Retrieval runs only after the red-flag
// layer has cleared a message, so danger signs are out of scope here.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { retrieve, buildGrounding } from './rag.js'

const idsFor = (q) => retrieve(q).map((h) => h.id)
const topId = (q) => retrieve(q)[0]?.id

test('a diet question retrieves the sample meal plan', () => {
  assert.ok(idsFor('what should I eat for breakfast').includes('diet:sample'))
})

test('romanised food question (khana) still reaches the diet passage', () => {
  assert.ok(idsFor('mujhe kya khana chahiye').includes('diet:sample'))
})

test('a money/scheme question retrieves PMMVY', () => {
  assert.ok(idsFor('which scheme gives money to pregnant women').includes('scheme:pmmvy'))
})

test('a nausea question retrieves the nausea FAQ', () => {
  assert.equal(topId('I keep feeling nausea in the morning'), 'faq:nausea')
})

test('romanised nausea (ulti) reaches the nausea FAQ', () => {
  assert.ok(idsFor('subah subah ulti feeling').includes('faq:nausea'))
})

test('a yoga/exercise question retrieves the exercise FAQ', () => {
  assert.ok(idsFor('is yoga safe during pregnancy').includes('faq:exercise'))
})

test('a supplements question retrieves the supplements FAQ (no dose named there)', () => {
  const hits = retrieve('should I take folic acid tablets')
  assert.ok(hits.some((h) => h.id === 'faq:supplements'))
  // The passage must not name a dose — it routes to the doctor.
  const faq = hits.find((h) => h.id === 'faq:supplements')
  assert.match(faq.text, /ask her doctor/i)
})

test('a hospital question retrieves the Pune hospitals passage', () => {
  assert.ok(idsFor('where can I deliver my baby in Pune').includes('hospitals:pune'))
})

test('a weekly milestone question retrieves a milestone passage', () => {
  const hits = retrieve('how big is my baby this week')
  assert.ok(hits.some((h) => h.source === 'milestone'))
})

test('off-topic query grounds nothing', () => {
  assert.deepEqual(retrieve('who won the cricket match yesterday'), [])
  assert.equal(buildGrounding('who won the cricket match yesterday'), '')
})

test('empty / nullish input grounds nothing', () => {
  assert.deepEqual(retrieve(''), [])
  assert.deepEqual(retrieve(null), [])
  assert.equal(buildGrounding(''), '')
})

test('retrieve caps results at the requested limit', () => {
  const hits = retrieve('pregnancy diet iron scheme hospital baby week', { limit: 2 })
  assert.ok(hits.length <= 2)
})

test('results are sorted by score, best first', () => {
  const hits = retrieve('what should I eat for breakfast')
  for (let i = 1; i < hits.length; i++) {
    assert.ok(hits[i - 1].score >= hits[i].score)
  }
})

test('buildGrounding produces a safety-preserving header and bullet lines', () => {
  const g = buildGrounding('which scheme gives money to pregnant women')
  assert.match(g, /^REFERENCE/)
  assert.match(g, /NEVER loosens a safety rule/i)
  assert.match(g, /\n- /) // at least one bulleted passage
})

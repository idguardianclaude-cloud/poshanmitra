import { test } from 'node:test'
import assert from 'node:assert/strict'
import { evaluateEligibility, STATUS } from './eligibility.js'

function statusOf(results, id) {
  return results.find((r) => r.id === id)?.status
}

test('universal schemes are always eligible', () => {
  const r = evaluateEligibility({})
  assert.equal(statusOf(r, 'poshan'), STATUS.ELIGIBLE)
  assert.equal(statusOf(r, 'pmposhan'), STATUS.ELIGIBLE)
})

test('PMMVY: first child, 19+, not govt employee → eligible', () => {
  const r = evaluateEligibility({
    age: '26', citizen: 'Yes', govtEmployee: 'No', pregnancyNumber: 'First',
  })
  assert.equal(statusOf(r, 'pmmvy'), STATUS.ELIGIBLE)
})

test('PMMVY: government employee → not eligible', () => {
  const r = evaluateEligibility({ age: '26', govtEmployee: 'Yes', pregnancyNumber: 'First' })
  assert.equal(statusOf(r, 'pmmvy'), STATUS.NOT_ELIGIBLE)
})

test('PMMVY: under 19 → not eligible', () => {
  const r = evaluateEligibility({ age: '17', govtEmployee: 'No', pregnancyNumber: 'First' })
  assert.equal(statusOf(r, 'pmmvy'), STATUS.NOT_ELIGIBLE)
})

test('PMMVY: second child → need more info (state may extend)', () => {
  const r = evaluateEligibility({ age: '26', govtEmployee: 'No', pregnancyNumber: 'Second' })
  assert.equal(statusOf(r, 'pmmvy'), STATUS.NEED_INFO)
})

test('JSY: BPL + hospital delivery → eligible', () => {
  const r = evaluateEligibility({ rationCard: 'BPL', hospitalDelivery: 'Yes' })
  assert.equal(statusOf(r, 'jsy'), STATUS.ELIGIBLE)
})

test('JSY: no institutional delivery → not eligible', () => {
  const r = evaluateEligibility({ rationCard: 'BPL', hospitalDelivery: 'No' })
  assert.equal(statusOf(r, 'jsy'), STATUS.NOT_ELIGIBLE)
})

test('PMJAY: Antyodaya/BPL → eligible; otherwise need more info', () => {
  assert.equal(statusOf(evaluateEligibility({ rationCard: 'Antyodaya' }), 'pmjay'), STATUS.ELIGIBLE)
  assert.equal(statusOf(evaluateEligibility({ rationCard: 'APL' }), 'pmjay'), STATUS.NEED_INFO)
})

test('never crashes on empty answers', () => {
  assert.doesNotThrow(() => evaluateEligibility({}))
})

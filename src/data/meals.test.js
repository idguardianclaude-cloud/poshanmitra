import { test } from 'node:test'
import assert from 'node:assert/strict'
import { meals, applyFoodPreference } from './meals.js'

const names = (m) => m.items.map((i) => i.name)

test('non-vegetarian keeps the boiled egg', () => {
  const out = applyFoodPreference(meals, 'Non-vegetarian')
  assert.ok(names(out[0]).some((n) => /boiled egg/i.test(n)))
})

test('vegetarian swaps the egg for paneer, keeps everything else', () => {
  const out = applyFoodPreference(meals, 'Vegetarian')
  assert.ok(names(out[0]).some((n) => /paneer/i.test(n)))
  assert.ok(!names(out[0]).some((n) => /egg/i.test(n)))
  // Same number of items — vegetarian only substitutes, never drops.
  meals.forEach((m, i) => assert.equal(out[i].items.length, m.items.length))
})

test('Jain: egg swapped, onion/root items dropped, but no meal is emptied', () => {
  const out = applyFoodPreference(meals, 'Jain')
  // Egg gone.
  assert.ok(!names(out[0]).some((n) => /egg/i.test(n)))
  // Genuine onion/root items removed.
  const all = out.flatMap(names)
  assert.ok(!all.some((n) => /mixed vegetable sabzi/i.test(n)))
  assert.ok(!all.some((n) => /steamed vegetables/i.test(n)))
  // Every meal still has at least two items (never starved to one).
  out.forEach((m) => assert.ok(m.items.length >= 2, `${m.name} too sparse`))
})

test('unknown/empty preference leaves the plan unchanged', () => {
  const out = applyFoodPreference(meals, '')
  meals.forEach((m, i) => assert.deepEqual(names(out[i]), names(m)))
})

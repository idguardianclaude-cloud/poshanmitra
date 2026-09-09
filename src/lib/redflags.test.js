// SAFETY-CRITICAL regression suite. If any test here fails, the red-flag layer
// has regressed and the build must not ship. Run with `npm test`.
//
// The first two blocks are the exact SAFETY.md §8 acceptance strings. They are a
// release gate — do not weaken them to make a change pass.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkRedFlags } from './redflags.js'

// SAFETY.md §8 — must trigger the emergency screen.
const MUST_TRIGGER = [
  'mujhe bleeding ho rahi hai',
  'मला रक्तस्त्राव होतोय',
  'baby is not moving since morning',
  'pet me bahut tez dard ho raha hai',
  'मुझे बहुत तेज सिरदर्द है और धुंधला दिख रहा है',
  'water is leaking',
  'I fainted twice today',
]

// SAFETY.md §8 — must be answered normally (no emergency screen).
const MUST_NOT_TRIGGER = [
  'what should I eat for breakfast',
  'is it safe to do yoga in 5th month',
  'my gums bleed when I brush',
]

for (const msg of MUST_TRIGGER) {
  test(`§8 danger sign fires: "${msg}"`, () => {
    assert.equal(checkRedFlags(msg).matched, true, 'expected an emergency match')
  })
}

for (const msg of MUST_NOT_TRIGGER) {
  test(`§8 safe message stays clean: "${msg}"`, () => {
    assert.equal(checkRedFlags(msg).matched, false, 'expected NO emergency match')
  })
}

// Broader danger-sign coverage across the three scripts, one per WHO/GoI sign.
const MORE_TRIGGERS = {
  bleeding: ['khoon aa raha hai', 'I have vaginal bleeding', 'रक्तस्त्राव हो रहा है'],
  headache: ['sir me bahut dard hai', 'severe headache since morning', 'डोकं खूप दुखतंय'],
  vision: ['everything looks blurry', 'aankhon ke aage andhera', 'धुंधला दिख रहा है'],
  convulsions: ['I am having fits', 'jhatke aa rahe hain', 'झटके येत आहेत'],
  fetal_movement: ['baby not kicking today', 'bacha hil nahi raha', 'बाळ हलत नाही'],
  leaking_fluid: ['my water broke', 'pani nikal raha hai', 'पाणी गळत आहे'],
  fever: ['I have a high fever', 'tez bukhar hai', 'खूप ताप आलाय'],
  abdominal_pain: ['severe abdominal pain', 'pet me tez dard', 'पोटात खूप दुखतंय'],
  swelling: ['sudden swelling in my face', 'chehre par sujan', 'हातांना सूज'],
  breathing: ["I can't breathe properly", 'saans nahi aa rahi', 'दम लागतोय'],
  fainting: ['I passed out', 'behosh ho gayi thi', 'चक्कर आया'],
}

for (const [sign, msgs] of Object.entries(MORE_TRIGGERS)) {
  for (const msg of msgs) {
    test(`danger sign [${sign}] fires: "${msg}"`, () => {
      assert.equal(checkRedFlags(msg).matched, true)
    })
  }
}

// Common benign pregnancy questions must NOT fire (usability guard).
const SAFE = [
  'how much water should I drink daily',
  'can I eat papaya during pregnancy',
  'when will I feel the baby kick',
  'what exercises are safe in second trimester',
  'how to manage morning nausea', // nausea/vomiting requires a persistence qualifier
  'is ulti normal in early pregnancy',
  'which fruits are good for me',
]

for (const msg of SAFE) {
  test(`benign question stays clean: "${msg}"`, () => {
    assert.equal(checkRedFlags(msg).matched, false)
  })
}

// Persistent vomiting DOES fire (qualifier present).
test('persistent vomiting fires', () => {
  assert.equal(checkRedFlags('baar baar ulti ho rahi hai kuch nahi ruk raha').matched, true)
})

// Empty / whitespace input is safe.
test('empty input is clean', () => {
  assert.equal(checkRedFlags('').matched, false)
  assert.equal(checkRedFlags('   ').matched, false)
  assert.equal(checkRedFlags(null).matched, false)
})

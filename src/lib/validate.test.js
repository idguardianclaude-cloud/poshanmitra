import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  digitsOnly,
  normalizeMobile,
  isValidMobile,
  isValidEmail,
  cleanName,
  isValidName,
  isValidAge,
  validatePregnancyDate,
  cleanMessage,
  MAX_MESSAGE,
} from './validate.js'

test('digitsOnly strips and caps', () => {
  assert.equal(digitsOnly('98765-43210'), '9876543210')
  assert.equal(digitsOnly('abc123def456', 4), '1234')
})

test('normalizeMobile drops +91 / leading 0', () => {
  assert.equal(normalizeMobile('+91 98765 43210'), '9876543210')
  assert.equal(normalizeMobile('09876543210'), '9876543210')
  assert.equal(normalizeMobile('98765 43210'), '9876543210')
})

test('Indian mobile validation', () => {
  assert.equal(isValidMobile('9876543210'), true)
  assert.equal(isValidMobile('+91 98765 43210'), true)
  assert.equal(isValidMobile('1234567890'), false) // must start 6-9
  assert.equal(isValidMobile('98765'), false) // too short
})

test('email: optional but valid when present', () => {
  assert.equal(isValidEmail(''), true)
  assert.equal(isValidEmail('  '), true)
  assert.equal(isValidEmail('a@b.co'), true)
  assert.equal(isValidEmail('nope'), false)
  assert.equal(isValidEmail('a@b'), false)
})

test('name cleaning + validation', () => {
  assert.equal(cleanName('  Priya   Sharma  '), 'Priya Sharma')
  assert.equal(isValidName('Priya'), true)
  assert.equal(isValidName('   '), false)
  assert.equal(isValidName('12345'), false) // digits only
  assert.equal(cleanName('x'.repeat(60)).length, 40)
})

test('age bounds 14–60', () => {
  assert.equal(isValidAge(26), true)
  assert.equal(isValidAge('30'), true)
  assert.equal(isValidAge(13), false)
  assert.equal(isValidAge(61), false)
  assert.equal(isValidAge(25.5), false)
})

test('pregnancy date sanity', () => {
  const iso = (offsetDays) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString().slice(0, 10)
  }
  assert.equal(validatePregnancyDate('', 'due'), 'required')
  assert.equal(validatePregnancyDate('not-a-date', 'due'), 'invalid')
  // LMP must be past, within ~43 weeks
  assert.equal(validatePregnancyDate(iso(-70), 'lmp'), null)
  assert.equal(validatePregnancyDate(iso(5), 'lmp'), 'future')
  assert.equal(validatePregnancyDate(iso(-320), 'lmp'), 'toofar')
  // Due date within range
  assert.equal(validatePregnancyDate(iso(120), 'due'), null)
  assert.equal(validatePregnancyDate(iso(400), 'due'), 'toofar')
  assert.equal(validatePregnancyDate(iso(-60), 'due'), 'past')
})

test('message cap', () => {
  assert.equal(cleanMessage('x'.repeat(2000)).length, MAX_MESSAGE)
})

// Tests for the WhatsApp click-to-chat URL builder. Locks correct encoding
// (so newlines, ₹ and Devanagari survive) and phone normalisation.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { whatsappShareUrl } from './whatsapp.js'

test('builds a no-contact share URL with encoded text', () => {
  const url = whatsappShareUrl('ANC visit at 9:00\n₹5,000 scheme')
  assert.ok(url.startsWith('https://wa.me/?text='))
  assert.ok(url.includes('%0A')) // newline encoded
  assert.ok(url.includes('%E2%82%B9')) // ₹ encoded
  assert.ok(!url.includes(' ')) // no raw spaces
})

test('normalises a phone number to digits only', () => {
  const url = whatsappShareUrl('hi', '+91 98765 43210')
  assert.ok(url.startsWith('https://wa.me/919876543210?text='))
})

test('empty/nullish text is safe', () => {
  assert.equal(whatsappShareUrl(''), 'https://wa.me/?text=')
  assert.equal(whatsappShareUrl(null), 'https://wa.me/?text=')
})

test('Devanagari text is encoded, not dropped', () => {
  const url = whatsappShareUrl('गोली लेने का समय')
  assert.ok(url.length > 'https://wa.me/?text='.length)
  assert.equal(decodeURIComponent(url.split('text=')[1]), 'गोली लेने का समय')
})

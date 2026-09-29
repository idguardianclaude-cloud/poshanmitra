// =============================================================================
// whatsapp.js — official WhatsApp "click to chat" sharing (wa.me).
//
// WHY THIS SHAPE. Real WhatsApp *delivery* (a message that arrives on its own,
// scheduled) needs the WhatsApp Business API (or a provider like Twilio), an
// approved business number, a message template, AND a backend server to hold the
// secret and send the request. PoshanMitra is a no-backend, no-key private beta
// (CLAUDE.md), and a browser cannot send WhatsApp messages directly. So we use
// the one mechanism that works with no account, no key and no server: the
// official click-to-chat link, which opens WhatsApp with the message pre-filled
// for HER to send (to herself, her family, or a caretaker) with one tap.
//
// Automated/scheduled WhatsApp push is tracked in TODO as needing a backend.
// =============================================================================

// Build an official wa.me URL. With a phone (any format), it targets that
// contact; without one, WhatsApp lets her pick who to send to. `text` is
// URL-encoded so newlines and ₹/Devanagari survive.
export function whatsappShareUrl(text, phone) {
  const query = `?text=${encodeURIComponent(text || '')}`
  const digits = String(phone || '').replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}${query}` : `https://wa.me/${query}`
}

// Open WhatsApp with the message pre-filled. Returns the URL (also handy for tests).
export function shareOnWhatsApp(text, phone) {
  const url = whatsappShareUrl(text, phone)
  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  return url
}

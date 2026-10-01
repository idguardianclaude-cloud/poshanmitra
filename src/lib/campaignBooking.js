// Campaign slot booking — pure, on-device. This is NOT an official government
// booking (no public API exists for that); it's a personal appointment the woman
// records so she can get a reminder, share it on WhatsApp, add it to her calendar,
// or email it. All free, no backend required.

function pad(n) {
  return String(n).padStart(2, '0')
}

export function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Suggest the next sensible date for a campaign based on its cadence.
export function suggestDate(cadence) {
  const now = new Date()
  if (cadence === 'monthly-9') {
    // PMSMA — the 9th of this month, or next month if the 9th has passed.
    const d = new Date(now.getFullYear(), now.getMonth(), 9)
    if (d < now) d.setMonth(d.getMonth() + 1)
    return toISODate(d)
  }
  if (cadence === 'monthly') {
    const d = new Date(now)
    d.setDate(now.getDate() + 7) // within the next week
    return toISODate(d)
  }
  // Everything else: a week out as a gentle default.
  const d = new Date(now)
  d.setDate(now.getDate() + 7)
  return toISODate(d)
}

let seq = 0
export function makeBooking(campaign, { date, time = '', place = '', name = '', phone = '' }) {
  if (!campaign || !date) return null
  return {
    id: `b-${Date.now()}-${seq++}`,
    campaignId: campaign.id,
    campaignName: campaign.name,
    date,
    time: time.slice(0, 20),
    place: place.slice(0, 120),
    name: name.slice(0, 60),
    phone: phone.slice(0, 15),
    createdAt: new Date().toISOString(),
  }
}

export function addBooking(list, booking) {
  if (!booking) return list
  return [booking, ...(Array.isArray(list) ? list : [])]
}

export function removeBooking(list, id) {
  return (Array.isArray(list) ? list : []).filter((b) => b.id !== id)
}

export function bookingSummary(b) {
  const bits = [b.campaignName, b.date, b.time, b.place].filter(Boolean)
  return bits.join(' · ')
}

// A minimal, valid .ics calendar event the browser can download.
export function toICS(b) {
  const dt = (b.date || '').replace(/-/g, '')
  const uid = `${b.id}@poshanmitra`
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const desc = `PoshanMitra reminder: ${b.campaignName}${b.time ? ' at ' + b.time : ''}${b.place ? ' — ' + b.place : ''}`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PoshanMitra//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dt}`,
    `SUMMARY:${b.campaignName}`,
    `DESCRIPTION:${desc}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(b) {
  try {
    const blob = new Blob([toICS(b)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poshanmitra-${b.campaignId}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch {
    /* no-op */
  }
}

export function mailtoLink(b) {
  const subject = encodeURIComponent(`My PoshanMitra appointment: ${b.campaignName}`)
  const body = encodeURIComponent(
    `I've noted this appointment:\n\n${bookingSummary(b)}\n\nThis is a personal reminder from the PoshanMitra app, not an official booking.`
  )
  return `mailto:?subject=${subject}&body=${body}`
}

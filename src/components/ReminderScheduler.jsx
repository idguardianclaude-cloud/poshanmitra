import { useEffect, useRef } from 'react'
import { storage } from '../lib/storage.js'
import { dueReminders, markFired, fireNotification } from '../lib/reminders.js'
import { useT } from '../lib/i18n.js'

// Invisible poller: while the app is open it checks once a minute whether any
// local reminder is due, fires a browser notification, and marks it fired so it
// doesn't repeat. On-device only — there is no backend push (documented limit).
export function ReminderScheduler() {
  const t = useT()
  const tRef = useRef(t)
  tRef.current = t

  useEffect(() => {
    function tick() {
      const list = storage.getReminders()
      if (!list.length) return
      const due = dueReminders(list)
      if (!due.length) return
      for (const r of due) {
        const title = r.title || tRef.current(`reminders.kind.${r.kind}`)
        fireNotification(tRef.current('reminders.notifTitle'), title)
      }
      storage.setReminders(markFired(list, due.map((r) => r.id)))
    }

    tick() // catch anything already due when the app opens
    const id = setInterval(tick, 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return null
}

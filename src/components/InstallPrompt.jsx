import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

// A gentle "Add to Home Screen" prompt. On Android/Chrome we capture the browser's
// beforeinstallprompt event and offer a one-tap Install. On iOS Safari (which has
// no such event) we show the manual Share → Add to Home Screen hint. Dismissal is
// remembered so we never nag. Hidden entirely once the app is already installed
// (running in standalone display mode). This helps our audience — women on phones —
// keep PoshanMitra one tap away, offline-capable via the existing service worker.
const DISMISS_KEY = 'poshanmitra_install_dismissed'

function isStandalone() {
  try {
    return (
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    )
  } catch {
    return false
  }
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [show, setShow] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      /* ignore */
    }
    if (dismissed || isStandalone()) return

    function onBeforeInstall(e) {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    // iOS gives no event — show the manual hint after a short, non-intrusive delay.
    let iosTimer
    if (isIOS()) {
      iosTimer = setTimeout(() => {
        setIosHint(true)
        setShow(true)
      }, 4000)
    }

    function onInstalled() {
      setShow(false)
      try {
        localStorage.setItem(DISMISS_KEY, '1')
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      if (iosTimer) clearTimeout(iosTimer)
    }
  }, [])

  function dismiss() {
    setShow(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferred) return
    deferred.prompt()
    try {
      await deferred.userChoice
    } catch {
      /* ignore */
    }
    setDeferred(null)
    dismiss()
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md rounded-2xl bg-white border border-line shadow-xl shadow-indigo-900/10 p-4 flex items-start gap-3">
        <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Download size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Add PoshanMitra to your phone</p>
          {iosHint ? (
            <p className="text-xs text-ink-muted mt-0.5 flex items-center gap-1 flex-wrap">
              Tap <Share size={13} className="inline text-indigo-600" /> <span className="font-medium">Share</span> then
              <span className="font-medium">“Add to Home Screen”.</span>
            </p>
          ) : (
            <p className="text-xs text-ink-muted mt-0.5">Open it like an app, even offline — no Play Store needed.</p>
          )}
          {!iosHint && (
            <button
              onClick={install}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-sm font-medium hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Download size={15} /> Install
            </button>
          )}
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="p-1 rounded-lg text-ink-faint hover:text-ink hover:bg-canvas shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

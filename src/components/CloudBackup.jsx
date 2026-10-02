import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CloudUpload, CloudDownload, Cloud, Check, Loader2, AlertCircle } from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { Button } from './ui/Button.jsx'
import { formatIN } from '../lib/dates.js'
import { cloudAvailable, backupToCloud, restoreFromCloud, lastBackupAt } from '../lib/cloudSync.js'

// Settings card: opt-in cloud backup & restore to the signed-in user's own private
// row. Manual by design — she presses a button and we tell her exactly what happened.
// Shown only when cloud auth is configured. When signed out, it invites sign-in
// (so her record can move to a new phone) without blocking anything.
export function CloudBackup() {
  const { authUser } = useProfile()
  const [busy, setBusy] = useState(null) // 'backup' | 'restore' | null
  const [msg, setMsg] = useState(null) // { ok, text }
  const [last, setLast] = useState(null)

  useEffect(() => {
    let alive = true
    if (authUser?.id) lastBackupAt(authUser).then((d) => alive && setLast(d))
    return () => {
      alive = false
    }
  }, [authUser])

  if (!cloudAvailable()) return null

  async function doBackup() {
    setBusy('backup')
    setMsg(null)
    const r = await backupToCloud(authUser)
    setBusy(null)
    if (r.ok) {
      setLast(r.savedAt)
      setMsg({ ok: true, text: 'Backed up to your account.' })
    } else {
      setMsg({ ok: false, text: 'Could not back up. Please try again.' })
    }
  }

  async function doRestore() {
    if (!window.confirm('Restore will replace the data on this device with your last cloud backup. Continue?')) return
    setBusy('restore')
    setMsg(null)
    const r = await restoreFromCloud(authUser)
    setBusy(null)
    if (r.ok && r.restored > 0) {
      setMsg({ ok: true, text: 'Restored from your account. Reloading…' })
      setTimeout(() => window.location.reload(), 900)
    } else if (r.ok) {
      setMsg({ ok: false, text: 'No cloud backup found yet. Back up first.' })
    } else {
      setMsg({ ok: false, text: 'Could not restore. Please try again.' })
    }
  }

  return (
    <section className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <Cloud size={18} className="text-indigo-600" />
        <h2 className="text-base font-semibold text-ink">Cloud backup</h2>
      </div>

      {!authUser?.id ? (
        <div>
          <p className="text-sm text-ink-muted">
            Sign in to keep a private backup of your record, so nothing is lost if you change your phone.
          </p>
          <Button as={Link} to="/login" variant="secondary" className="mt-3">
            Sign in to back up
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-muted">
            Keep a private copy of your data in your account ({authUser.email || 'signed in'}). Only you can see it.
          </p>
          <p className="text-xs text-ink-faint mt-1">
            {last ? `Last backup: ${formatIN(last)}` : 'No backup yet on this account.'}
          </p>

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button onClick={doBackup} disabled={busy !== null}>
              {busy === 'backup' ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />} Back up now
            </Button>
            <Button onClick={doRestore} variant="secondary" disabled={busy !== null}>
              {busy === 'restore' ? <Loader2 size={15} className="animate-spin" /> : <CloudDownload size={15} />} Restore
            </Button>
          </div>

          {msg && (
            <p className={`mt-3 text-sm flex items-center gap-1.5 ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
              {msg.ok ? <Check size={15} /> : <AlertCircle size={15} />} {msg.text}
            </p>
          )}
          <p className="mt-3 text-[11px] text-ink-faint">
            Backup and restore are manual — we never sync silently in the background. Restoring replaces this device's data.
          </p>
        </>
      )}
    </section>
  )
}

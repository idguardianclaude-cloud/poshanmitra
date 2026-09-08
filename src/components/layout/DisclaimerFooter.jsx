import { useProfile } from '../../context/ProfileContext.jsx'
import { DISCLAIMER, t } from '../../lib/i18n.js'

// Persistent, non-dismissable. On every page — SAFETY.md §7.
export function DisclaimerFooter() {
  const { lang } = useProfile()
  return (
    <footer className="border-t border-line bg-canvas px-6 py-3 text-center">
      <p className="text-xs text-ink-muted max-w-3xl mx-auto" lang={lang}>
        {t(DISCLAIMER, lang)}
      </p>
    </footer>
  )
}

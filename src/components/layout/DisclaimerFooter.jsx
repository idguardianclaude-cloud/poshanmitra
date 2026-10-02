import { Link } from 'react-router-dom'
import { useProfile } from '../../context/ProfileContext.jsx'
import { DISCLAIMER, t } from '../../lib/i18n.js'

// Persistent, non-dismissable. On every page — SAFETY.md §7. Also carries the
// trust-page links (About / Privacy / Terms) so they're reachable everywhere.
export function DisclaimerFooter() {
  const { lang } = useProfile()
  return (
    <footer className="border-t border-line bg-canvas px-6 py-3 text-center">
      <p className="text-xs text-ink-muted max-w-3xl mx-auto" lang={lang}>
        {t(DISCLAIMER, lang)}
      </p>
      <nav className="mt-1.5 flex items-center justify-center gap-3 text-[11px] text-ink-faint">
        <Link to="/about" className="hover:text-indigo-600">About</Link>
        <span aria-hidden>·</span>
        <Link to="/privacy" className="hover:text-indigo-600">Privacy</Link>
        <span aria-hidden>·</span>
        <Link to="/terms" className="hover:text-indigo-600">Terms</Link>
      </nav>
    </footer>
  )
}

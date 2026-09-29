import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useT } from '../lib/i18n.js'
import { DisclaimerFooter } from './layout/DisclaimerFooter.jsx'

// NOTE ON THE CLASS COMPONENT (CLAUDE.md says "hooks only, no class components"):
// an Error Boundary is the one thing React has no hook for — getDerivedStateFromError /
// componentDidCatch only exist on classes. This is the sole, deliberate exception.
// For real beta users, a single component throwing must NOT white-screen the whole
// app; it should fall back to a calm, localized recovery card instead. The fallback
// UI itself is a normal function component (ErrorFallback) so it can use hooks.

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Keep the details in the console for debugging; never surface a raw stack to
    // the user. No remote logging — this app sends nothing off-device by design.
    console.error('PoshanMitra crashed:', error, info?.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />
    }
    return this.props.children
  }
}

// Localized recovery screen. Reload fully reloads the app; "Go to Dashboard"
// clears the boundary and navigates home without a full reload. The disclaimer
// footer stays present even here (CLAUDE.md hard rule #4).
function ErrorFallback({ onReset }) {
  const t = useT()

  function goHome() {
    onReset()
    // Hard-set the location so a broken route is fully left behind, honouring the
    // hash-router fallback used in sandboxed single-file builds.
    const base = window.__PM_HASH_ROUTER__ ? '#/' : '/'
    window.location.assign(base)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6 text-center">
      <div className="max-w-md w-full rounded-2xl bg-white border border-line shadow-card p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle size={26} className="text-amber-600" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-ink">{t('common.errTitle')}</h1>
        <p className="mt-2 text-sm text-ink-muted">{t('common.errBody')}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <RefreshCw size={16} /> {t('common.errReload')}
          </button>
          <button
            onClick={goHome}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Home size={16} /> {t('common.errHome')}
          </button>
        </div>
      </div>
      <div className="mt-6 max-w-md w-full overflow-hidden rounded-2xl border border-line">
        <DisclaimerFooter />
      </div>
    </div>
  )
}

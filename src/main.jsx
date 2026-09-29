import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './index.css'

// Normal deploys use clean-URL BrowserRouter. A single-file/sandboxed build (e.g.
// the Artifact preview) sets window.__PM_HASH_ROUTER__ to fall back to HashRouter.
const Router = typeof window !== 'undefined' && window.__PM_HASH_ROUTER__ ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProfileProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ProfileProvider>
    </Router>
  </React.StrictMode>
)

// Register the service worker for offline support. Production only — a SW in dev
// caches Vite's module graph and causes stale-reload confusion.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support is progressive enhancement; ignore failures */
    })
  })
}

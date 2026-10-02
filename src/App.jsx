import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useProfile } from './context/ProfileContext.jsx'
import { AppShell } from './components/layout/AppShell.jsx'
import { Login } from './pages/Login.jsx'
import { Dashboard } from './pages/Dashboard.jsx'

// First-paint screens (Login/Dashboard) load eagerly. Every other route is
// code-split so its JS — and heavy deps like Leaflet (Hospitals map) or the
// chart code (Reports) — only downloads when that page is opened. This keeps
// the initial bundle small, which matters for the target audience: women on
// Tier 2–3 mobile connections. named export → { default } for React.lazy.
const lazyPage = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })))
const Landing = lazyPage(() => import('./pages/Landing.jsx'), 'Landing')
const Signup = lazyPage(() => import('./pages/Signup.jsx'), 'Signup')
const Onboarding = lazyPage(() => import('./pages/Onboarding.jsx'), 'Onboarding')
const Chatbot = lazyPage(() => import('./pages/Chatbot.jsx'), 'Chatbot')
const DietPlan = lazyPage(() => import('./pages/DietPlan.jsx'), 'DietPlan')
const Videos = lazyPage(() => import('./pages/Videos.jsx'), 'Videos')
const Schemes = lazyPage(() => import('./pages/Schemes.jsx'), 'Schemes')
const SchemeEligibility = lazyPage(() => import('./pages/SchemeEligibility.jsx'), 'SchemeEligibility')
const Hospitals = lazyPage(() => import('./pages/Hospitals.jsx'), 'Hospitals')
const Settings = lazyPage(() => import('./pages/Settings.jsx'), 'Settings')
const Checkup = lazyPage(() => import('./pages/Checkup.jsx'), 'Checkup')
const Reports = lazyPage(() => import('./pages/Reports.jsx'), 'Reports')
const Tools = lazyPage(() => import('./pages/Tools.jsx'), 'Tools')
const Shop = lazyPage(() => import('./pages/Shop.jsx'), 'Shop')
const Campaigns = lazyPage(() => import('./pages/Campaigns.jsx'), 'Campaigns')
const NotFound = lazyPage(() => import('./pages/NotFound.jsx'), 'NotFound')

// Shown while a code-split page chunk downloads. Deliberately minimal so it
// never flashes distracting content on a fast connection.
function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
      <div className="h-8 w-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

// Route guard: no login flag → public landing (/welcome); logged in but no
// completed profile → /onboarding.
function RequireApp({ children }) {
  const { loggedIn, profile } = useProfile()
  const location = useLocation()
  if (!loggedIn) return <Navigate to="/welcome" replace state={{ from: location }} />
  if (!profile?.onboarded) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  const { loggedIn, profile } = useProfile()

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route
          path="/welcome"
          element={loggedIn && profile?.onboarded ? <Navigate to="/" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={loggedIn && profile?.onboarded ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={loggedIn && profile?.onboarded ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="/onboarding"
          element={!loggedIn ? <Navigate to="/login" replace /> : <Onboarding />}
        />

        <Route
          element={
            <RequireApp>
              <AppShell />
            </RequireApp>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/diet" element={<DietPlan />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/eligibility" element={<SchemeEligibility />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/checkup" element={<Checkup />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

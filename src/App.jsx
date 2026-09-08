import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useProfile } from './context/ProfileContext.jsx'
import { AppShell } from './components/layout/AppShell.jsx'
import { Login } from './pages/Login.jsx'
import { Onboarding } from './pages/Onboarding.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Chatbot } from './pages/Chatbot.jsx'
import { DietPlan } from './pages/DietPlan.jsx'
import { Videos } from './pages/Videos.jsx'
import { Schemes } from './pages/Schemes.jsx'
import { SchemeEligibility } from './pages/SchemeEligibility.jsx'
import { Hospitals } from './pages/Hospitals.jsx'
import { CheckupPage, CampaignsPage, ReportsPage } from './pages/StubPage.jsx'
import { NotFound } from './pages/NotFound.jsx'

// Route guard: no login flag → /login; logged in but no completed profile → /onboarding.
function RequireApp({ children }) {
  const { loggedIn, profile } = useProfile()
  const location = useLocation()
  if (!loggedIn) return <Navigate to="/login" replace state={{ from: location }} />
  if (!profile?.onboarded) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  const { loggedIn, profile } = useProfile()

  return (
    <Routes>
      <Route
        path="/login"
        element={loggedIn && profile?.onboarded ? <Navigate to="/" replace /> : <Login />}
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
        <Route path="/checkup" element={<CheckupPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

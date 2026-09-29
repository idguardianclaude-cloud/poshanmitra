import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Header } from './Header.jsx'
import { DisclaimerFooter } from './DisclaimerFooter.jsx'
import { ReminderScheduler } from '../ReminderScheduler.jsx'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <ReminderScheduler />
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        />
      )}

      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1">
          <div className="mx-auto max-w-main px-5 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
        <DisclaimerFooter />
      </div>
    </div>
  )
}

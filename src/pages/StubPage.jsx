import { Link } from 'react-router-dom'
import { Illustration } from '../components/Illustration.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'

// Shared shell for /checkup, /campaigns, /reports — keeps navigation honest.
export function StubPage({ title, subtitle }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-2xl bg-white border border-line shadow-card">
        <div className="flex flex-col items-center text-center py-16 px-6">
          <Illustration name="shield-check" size={120} />
          <p className="mt-4 text-base font-medium text-ink">Coming soon in the next update.</p>
          <p className="mt-1 text-sm text-ink-muted max-w-sm">
            We are building this section carefully so it is genuinely useful. Check back soon.
          </p>
          <Button as={Link} to="/" variant="secondary" className="mt-5">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </>
  )
}

export function CheckupPage() {
  return <StubPage title="Weekly Check-up" subtitle="Track your weekly pregnancy milestones and to-dos." />
}
export function CampaignsPage() {
  return <StubPage title="Campaigns" subtitle="Health drives and awareness campaigns near you." />
}
export function ReportsPage() {
  return <StubPage title="Reports" subtitle="Store and track your test reports over time." />
}

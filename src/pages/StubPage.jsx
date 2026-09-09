import { Link } from 'react-router-dom'
import { Illustration } from '../components/Illustration.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useT } from '../lib/i18n.js'

// Shared shell for /checkup, /campaigns, /reports — keeps navigation honest.
export function StubPage({ title, subtitle }) {
  const t = useT()
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-2xl bg-white border border-line shadow-card">
        <div className="flex flex-col items-center text-center py-16 px-6">
          <Illustration name="shield-check" size={120} />
          <p className="mt-4 text-base font-medium text-ink">{t('stub.comingSoon')}</p>
          <p className="mt-1 text-sm text-ink-muted max-w-sm">{t('stub.comingSoonBody')}</p>
          <Button as={Link} to="/" variant="secondary" className="mt-5">
            {t('common.backToDashboard')}
          </Button>
        </div>
      </div>
    </>
  )
}

export function CheckupPage() {
  const t = useT()
  return <StubPage title={t('stub.checkup')} subtitle={t('stub.checkupSub')} />
}
export function CampaignsPage() {
  const t = useT()
  return <StubPage title={t('stub.campaigns')} subtitle={t('stub.campaignsSub')} />
}
export function ReportsPage() {
  const t = useT()
  return <StubPage title={t('stub.reports')} subtitle={t('stub.reportsSub')} />
}

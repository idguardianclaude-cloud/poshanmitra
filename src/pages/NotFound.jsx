import { Link } from 'react-router-dom'
import { Illustration } from '../components/Illustration.jsx'
import { Button } from '../components/ui/Button.jsx'
import { useT } from '../lib/i18n.js'

export function NotFound() {
  const t = useT()
  return (
    <div className="flex flex-col items-center text-center py-20">
      <Illustration name="empty-box" size={120} />
      <h1 className="mt-4 text-2xl font-bold text-ink">{t('notFound.title')}</h1>
      <p className="mt-1 text-sm text-ink-muted">{t('notFound.body')}</p>
      <Button as={Link} to="/" className="mt-5">
        {t('common.backToDashboard')}
      </Button>
    </div>
  )
}

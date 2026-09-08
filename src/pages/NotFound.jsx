import { Link } from 'react-router-dom'
import { Illustration } from '../components/Illustration.jsx'
import { Button } from '../components/ui/Button.jsx'

export function NotFound() {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <Illustration name="empty-box" size={120} />
      <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-1 text-sm text-ink-muted">
        The page you are looking for doesn’t exist or has moved.
      </p>
      <Button as={Link} to="/" className="mt-5">
        Back to Dashboard
      </Button>
    </div>
  )
}

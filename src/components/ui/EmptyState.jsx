import { Illustration } from '../Illustration.jsx'

export function EmptyState({ illustration = 'empty-box', title, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      <Illustration name={illustration} size={96} />
      <p className="mt-4 text-sm text-ink-muted max-w-xs">{title}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

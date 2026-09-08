const tones = {
  success: 'bg-tint-nutrition text-emerald-700',
  warning: 'bg-tint-schemes text-amber-700',
  danger: 'bg-tint-videos text-red-700',
  info: 'bg-tint-hospitals text-blue-700',
  neutral: 'bg-canvas text-ink-muted',
  primary: 'bg-indigo-50 text-indigo-600',
}

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

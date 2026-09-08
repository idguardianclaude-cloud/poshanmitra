export function Card({ title, action, children, className = '', bodyClassName = '' }) {
  return (
    <section
      className={`rounded-2xl bg-white border border-line shadow-card ${className}`}
    >
      {(title || action) && (
        <header className="flex items-center justify-between px-5 pt-5 pb-3">
          {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
          {action && <div className="text-sm">{action}</div>}
        </header>
      )}
      <div className={`px-5 ${title || action ? 'pb-5' : 'py-5'} ${bodyClassName}`}>
        {children}
      </div>
    </section>
  )
}

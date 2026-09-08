export function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div className={`relative overflow-hidden bg-canvas ${rounded} ${className}`}>
      <div className="shimmer absolute inset-0" aria-hidden="true" />
    </div>
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  )
}

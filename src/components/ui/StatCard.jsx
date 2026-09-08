import { IconTile } from './IconTile.jsx'

export function StatCard({ icon, fill, color, label, value, sub, progress }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-ink-muted">{label}</p>
          <p className="mt-1 text-[26px] leading-tight font-bold text-ink">{value}</p>
        </div>
        {icon && <IconTile icon={icon} fill={fill} color={color} size={44} />}
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-canvas overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
      {sub && <p className="mt-2 text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

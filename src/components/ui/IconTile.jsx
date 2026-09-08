// Tinted rounded square used in Quick Access and stat-card icon circles.
// Pass fill (bg hex) and color (icon hex) from the DESIGN_SYSTEM tint table.
export function IconTile({ icon: Icon, fill, color, size = 44, className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl shrink-0 ${className}`}
      style={{ backgroundColor: fill, width: size, height: size }}
    >
      <Icon size={size * 0.5} color={color} strokeWidth={2} />
    </span>
  )
}

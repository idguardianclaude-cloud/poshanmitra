// A tiny dependency-free trend chart (inline SVG) for the Reports page. It shows
// HER OWN logged numbers over time — a line with points, min/max guides and the
// latest value. It draws no clinical thresholds and makes no judgement; it only
// plots what she entered. Accessible: the <svg> carries a text summary.

// `points`: [{ x: label, y: number, label?: string }] oldest → newest.
export function TrendChart({ points = [], color = '#4F46E5', unit = '', ariaLabel }) {
  const W = 320
  const H = 96
  const padX = 10
  const padY = 14

  if (points.length === 0) return null

  const ys = points.map((p) => p.y)
  let min = Math.min(...ys)
  let max = Math.max(...ys)
  if (min === max) {
    // Flat series — pad the range so the line sits in the middle, not on an edge.
    min -= 1
    max += 1
  }
  const innerW = W - padX * 2
  const innerH = H - padY * 2

  const xFor = (i) =>
    points.length === 1 ? W / 2 : padX + (i / (points.length - 1)) * innerW
  const yFor = (v) => padY + innerH - ((v - min) / (max - min)) * innerH

  const coords = points.map((p, i) => ({ cx: xFor(i), cy: yFor(p.y), ...p }))
  const path = coords.map((c) => `${c.cx.toFixed(1)},${c.cy.toFixed(1)}`).join(' ')

  const summary =
    ariaLabel ||
    `Trend of ${points.length} readings, from ${points[0].y} to ${points[points.length - 1].y} ${unit}.`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-24"
      role="img"
      aria-label={summary}
      preserveAspectRatio="none"
    >
      <title>{summary}</title>
      {/* baseline */}
      <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="#EEF0F6" strokeWidth="1" />
      {points.length > 1 && (
        <polyline
          points={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r="3.5" fill={color} />
        </g>
      ))}
      {/* latest value label */}
      <text
        x={coords[coords.length - 1].cx}
        y={Math.max(10, coords[coords.length - 1].cy - 7)}
        textAnchor="end"
        fontSize="11"
        fontWeight="600"
        fill={color}
      >
        {coords[coords.length - 1].label ?? coords[coords.length - 1].y}
      </text>
    </svg>
  )
}

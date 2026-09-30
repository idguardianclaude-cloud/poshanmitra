// PoshanMitra brand mark. A heart (care, "Mitra" — a caring friend) cradling a
// small sprout (nourishment, "Poshan"; new life). Drawn so the sprout sits
// entirely on the white heart, so the mark drops straight into the existing
// indigo / translucent brand badges in place of the old lucide <Heart/> — same
// `size` prop, same fill by default. All brand touchpoints import from here, so
// the logo is redesigned in exactly one place.

const HEART = '#EEF0FF' // soft white heart, as before
const SPROUT = '#4F46E5' // indigo sprout — high contrast on the white heart

export function LogoMark({ size = 20, heart = HEART, sprout = SPROUT, className = '', title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title || 'PoshanMitra'}
    >
      {/* Heart */}
      <path
        d="M12 21.1l-1.35-1.23C5.6 15.3 2.4 12.4 2.4 8.8 2.4 5.9 4.7 3.6 7.6 3.6c1.63 0 3.2.76 4.4 2.05C13.2 4.36 14.77 3.6 16.4 3.6c2.9 0 5.2 2.3 5.2 5.2 0 3.6-3.2 6.5-8.25 11.08L12 21.1z"
        fill={heart}
      />
      {/* Sprout — a short stem with a central leaf and two side leaves, all
          sitting inside the white heart (never overlapping the tile). */}
      <g fill={sprout} stroke={sprout} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17.2V13.4" strokeWidth="1.5" fill="none" />
        <path d="M12 13.6C10.9 11.6 11 9.4 12 7.6c1 1.8 1.1 4 0 6z" strokeWidth="0.3" />
        <path d="M12 14.9C9.8 14.9 8.3 13.5 8 11.3c2.2.2 3.7 1.5 4 3.6z" strokeWidth="0.3" />
        <path d="M12 14.9c2.2 0 3.7-1.4 4-3.6-2.2.2-3.7 1.5-4 3.6z" strokeWidth="0.3" />
      </g>
    </svg>
  )
}

// Mark inside its indigo tile + the wordmark. Use where a full lockup is wanted.
export function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500"
        style={{ width: size, height: size }}
      >
        <LogoMark size={Math.round(size * 0.56)} />
      </span>
      {showText && <span className="font-bold text-[15px] leading-none">PoshanMitra AI</span>}
    </span>
  )
}

// All illustrations live here — flat geometric SVG in the indigo/lavender palette.
// Swap in unDraw SVGs later by editing only this file. Three colours throughout:
//   primary #4F46E5 · mid #C7D2FE · soft #EEF0FF. No gradients, no detail.

const P = '#4F46E5'
const MID = '#C7D2FE'
const SOFT = '#EEF0FF'

function Frame({ size, label, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  )
}

export function Illustration({ name, size = 120, className = '' }) {
  const shapes = {
    'pregnant-seated': (
      <>
        <ellipse cx="60" cy="104" rx="34" ry="6" fill={SOFT} />
        <rect x="34" y="70" width="52" height="26" rx="13" fill={MID} />
        <circle cx="60" cy="44" r="14" fill={P} />
        <path d="M46 72c0-9 6-16 14-16s14 7 14 16v8H46v-8Z" fill={P} />
        <circle cx="72" cy="78" r="11" fill={SOFT} />
        <circle cx="72" cy="78" r="4" fill={MID} />
      </>
    ),
    ambulance: (
      <>
        <ellipse cx="60" cy="98" rx="40" ry="6" fill={SOFT} />
        <rect x="20" y="52" width="58" height="34" rx="7" fill={P} />
        <rect x="62" y="60" width="30" height="26" rx="6" fill={MID} />
        <rect x="45" y="62" width="6" height="16" rx="2" fill={SOFT} />
        <rect x="40" y="67" width="16" height="6" rx="2" fill={SOFT} />
        <circle cx="38" cy="90" r="8" fill="#1E1E2D" />
        <circle cx="38" cy="90" r="3" fill={SOFT} />
        <circle cx="78" cy="90" r="8" fill="#1E1E2D" />
        <circle cx="78" cy="90" r="3" fill={SOFT} />
      </>
    ),
    'blood-drop': (
      <>
        <path d="M60 20c14 20 22 30 22 42a22 22 0 1 1-44 0c0-12 8-22 22-42Z" fill={MID} />
        <path d="M60 40c7 11 11 17 11 24a11 11 0 0 1-22 0c0-7 4-13 11-24Z" fill={P} />
      </>
    ),
    'water-glass': (
      <>
        <path d="M42 34h36l-4 54a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6l-4-54Z" fill={SOFT} />
        <path d="M45 62h30l-2 26a6 6 0 0 1-6 6H53a6 6 0 0 1-6-6l-2-26Z" fill={MID} />
        <rect x="40" y="30" width="40" height="8" rx="4" fill={P} />
      </>
    ),
    'empty-box': (
      <>
        <ellipse cx="60" cy="98" rx="36" ry="6" fill={SOFT} />
        <path d="M30 56l30-14 30 14-30 12-30-12Z" fill={MID} />
        <path d="M30 56v26l30 12V68L30 56Z" fill={P} />
        <path d="M90 56v26l-30 12V68l30-12Z" fill="#3730A3" />
      </>
    ),
    'shield-check': (
      <>
        <path d="M60 22l28 10v22c0 20-13 34-28 40-15-6-28-20-28-40V32l28-10Z" fill={MID} />
        <path d="M60 34l18 6v16c0 13-8 22-18 26-10-4-18-13-18-26V40l18-6Z" fill={SOFT} />
        <path d="M50 60l7 7 14-14" stroke={P} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    bell: (
      <>
        <path d="M60 30a18 18 0 0 1 18 18v14l6 10H36l6-10V48a18 18 0 0 1 18-18Z" fill={MID} />
        <circle cx="60" cy="26" r="5" fill={P} />
        <path d="M52 80a8 8 0 0 0 16 0H52Z" fill={P} />
      </>
    ),
    mail: (
      <>
        <rect x="26" y="40" width="68" height="44" rx="8" fill={MID} />
        <path d="M28 44l32 24 32-24" stroke={P} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
    headset: (
      <>
        <path d="M34 66v-8a26 26 0 0 1 52 0v8" stroke={P} strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="28" y="62" width="14" height="22" rx="6" fill={MID} />
        <rect x="78" y="62" width="14" height="22" rx="6" fill={MID} />
        <path d="M85 84c0 8-8 12-16 12" stroke={P} strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="66" cy="96" r="4" fill={P} />
      </>
    ),
  }

  return (
    <span className={className}>
      <Frame size={size} label={name}>
        {shapes[name] || shapes['empty-box']}
      </Frame>
    </span>
  )
}

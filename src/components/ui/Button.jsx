const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white text-ink border border-line hover:bg-canvas',
  ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50',
  // danger reserved for the 108 button — emergency red only. SAFETY.md / DESIGN_SYSTEM.
  danger: 'bg-emergency text-white hover:brightness-95',
}

const sizes = {
  sm: 'text-[13px] px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
}

export function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <As className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </As>
  )
}

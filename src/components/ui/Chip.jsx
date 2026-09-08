export function Chip({ selected = false, children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
        selected
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white border-line text-ink hover:bg-indigo-50 hover:border-indigo-100'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

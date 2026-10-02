import { BookOpen } from 'lucide-react'

// A small, consistent "where this comes from" line. Citing the public-health bodies
// behind the content (India's Ministry of Health, ICMR and the WHO) builds trust and
// signals the information is grounded, not invented. Purely informational — it names
// sources, it doesn't turn general guidance into personal medical advice.
export function SourceNote({ sources = ['MoHFW', 'ICMR', 'WHO'], className = '' }) {
  return (
    <p className={`flex items-center gap-1.5 text-[11px] text-ink-faint ${className}`}>
      <BookOpen size={12} className="shrink-0" />
      <span>Based on public guidance from {sources.join(', ')}.</span>
    </p>
  )
}

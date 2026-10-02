import { PageHeader } from '../components/ui/PageHeader.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useT } from '../lib/i18n.js'
import { KickCounter } from '../components/tools/KickCounter.jsx'
import { ContractionTimer } from '../components/tools/ContractionTimer.jsx'

// Hub for self-contained pregnancy tools. Each tool is its own module under
// components/tools/ and rendered here as a card. New tools are added over time.
export function Tools() {
  const t = useT()
  const { lang } = useProfile()
  return (
    <>
      <PageHeader title={t('nav.tools')} subtitle="Simple, private tools for your pregnancy — right on your device." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <KickCounter lang={lang} />
        <ContractionTimer />
      </div>
    </>
  )
}

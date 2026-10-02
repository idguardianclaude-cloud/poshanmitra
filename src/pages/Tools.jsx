import { PageHeader } from '../components/ui/PageHeader.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useT } from '../lib/i18n.js'
import { KickCounter } from '../components/tools/KickCounter.jsx'
import { ContractionTimer } from '../components/tools/ContractionTimer.jsx'
import { EmergencySOS } from '../components/tools/EmergencySOS.jsx'
import { WaterTracker } from '../components/tools/WaterTracker.jsx'
import { WeightTracker } from '../components/tools/WeightTracker.jsx'
import { MoodCheckin } from '../components/tools/MoodCheckin.jsx'
import { BirthPlan } from '../components/tools/BirthPlan.jsx'
import { BabyThisWeek } from '../components/tools/BabyThisWeek.jsx'
import { HospitalBag } from '../components/tools/HospitalBag.jsx'
import { FoodSafety } from '../components/tools/FoodSafety.jsx'

// Hub for self-contained pregnancy tools. Each tool is its own module under
// components/tools/ and rendered here as a card. New tools are added over time.
export function Tools() {
  const t = useT()
  const { lang } = useProfile()
  return (
    <>
      <PageHeader title={t('nav.tools')} subtitle="Simple, private tools for your pregnancy — right on your device." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <BabyThisWeek />
        <EmergencySOS />
        <KickCounter lang={lang} />
        <WaterTracker />
        <ContractionTimer />
        <WeightTracker />
        <FoodSafety />
        <MoodCheckin />
        <HospitalBag />
        <BirthPlan />
      </div>
    </>
  )
}

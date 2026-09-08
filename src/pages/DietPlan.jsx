import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  Beef,
  Droplet,
  UtensilsCrossed,
  Coffee,
  Sprout,
  Cookie,
  Soup,
  Download,
  Check,
  Repeat,
  ShoppingCart,
  BookOpen,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react'
import { useProfile } from '../context/ProfileContext.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { IconTile } from '../components/ui/IconTile.jsx'
import { summary, days, meals, applyFoodPreference } from '../data/meals.js'

const MEAL_ICON = {
  breakfast: Coffee,
  'mid-morning': Sprout,
  lunch: UtensilsCrossed,
  evening: Cookie,
  dinner: Soup,
}

function currentDayKey() {
  const idx = (new Date().getDay() + 6) % 7 // 0 = Monday
  return days[idx]?.key || 'mon'
}

export function DietPlan() {
  const { profile } = useProfile()
  const [activeDay, setActiveDay] = useState(currentDayKey)

  const planned = useMemo(
    () => applyFoodPreference(meals, profile?.food),
    [profile?.food]
  )

  const conditions = Array.isArray(profile?.conditions)
    ? profile.conditions.filter((c) => c && c !== 'None' && c !== "I don't know")
    : []
  const hasCondition = conditions.length > 0

  return (
    <>
      <PageHeader
        title="Diet Plan"
        subtitle="A balanced diet is essential for your health and your baby's growth."
        action={
          <Button variant="secondary" onClick={() => window.print()}>
            <Download size={16} /> Download Diet Plan
          </Button>
        }
      >
        {/* NOT "Personalized for You" — SAFETY.md §4. */}
        <Badge tone="primary">Sample plan</Badge>
      </PageHeader>

      {/* Condition-present warning — SAFETY.md §4 */}
      {hasCondition && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-tint-schemes px-4 py-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            You've told us about a health condition ({conditions.join(', ')}). Please ask
            your doctor or a dietitian to review this plan before following it.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard icon={Flame} fill="#FEF2F2" color="#EF4444" label="Calorie Target" value={summary.calories} />
        <SummaryCard icon={Beef} fill="#ECFDF5" color="#10B981" label="Protein" value={summary.protein} />
        <SummaryCard icon={Droplet} fill="#EFF6FF" color="#3B82F6" label="Water Intake" value={summary.water} />
        <SummaryCard icon={UtensilsCrossed} fill="#FFFBEB" color="#F59E0B" label="Meals" value={summary.meals} />
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-print">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDay(d.key)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeDay === d.key
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-line text-ink hover:bg-canvas'
            }`}
          >
            <span className="block">{d.label}</span>
            <span className={`block text-[11px] ${activeDay === d.key ? 'text-indigo-100' : 'text-ink-faint'}`}>
              {d.date}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Meals */}
        <div className="xl:col-span-2 space-y-4">
          {planned.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <NutritionDonut score={profile?.poshanScore ?? 78} />
          <DietHighlights />
          <QuickActions />
          <div className="rounded-2xl bg-white border border-line shadow-card p-5">
            <h2 className="text-base font-semibold text-ink">Next Review</h2>
            <p className="mt-1 text-sm text-ink-muted">19 May 2025 (Monday)</p>
          </div>
        </aside>
      </div>

      {/* Required bottom note — SAFETY.md §4, non-dismissable. */}
      <div className="mt-8 rounded-2xl border border-line bg-white px-5 py-4">
        <p className="text-sm text-ink-muted">
          This is a general meal plan for pregnancy, not personalised medical nutrition
          advice. Please follow it along with your doctor's or dietitian's guidance.
        </p>
      </div>
    </>
  )
}

function SummaryCard({ icon, fill, color, label, value }) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-4 flex items-center gap-3">
      <IconTile icon={icon} fill={fill} color={color} size={44} />
      <div>
        <p className="text-[13px] text-ink-muted">{label}</p>
        <p className="text-lg font-bold text-ink leading-tight">{value}</p>
      </div>
    </div>
  )
}

function MealCard({ meal }) {
  const Icon = MEAL_ICON[meal.id] || UtensilsCrossed
  return (
    <section className="rounded-2xl bg-white border border-line shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Food visual (tinted block — no external image assets tonight) */}
        <div
          className="sm:w-40 h-32 sm:h-auto flex items-center justify-center shrink-0"
          style={{ backgroundColor: meal.tint }}
        >
          <Icon size={40} className="text-ink/40" />
        </div>

        <div className="flex-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon size={18} className="text-indigo-600" />
              <h3 className="text-base font-semibold text-ink">{meal.name}</h3>
            </div>
            <span className="text-xs text-ink-faint">{meal.time}</span>
          </div>

          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {meal.items.map((it, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-ink">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {it.name}
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Nutrient label="Calories" value={`${meal.nutrients.kcal}`} unit="kcal" />
            <Nutrient label="Protein" value={`${meal.nutrients.protein}`} unit="g" />
            <Nutrient label="Carbs" value={`${meal.nutrients.carbs}`} unit="g" />
            <Nutrient label="Fats" value={`${meal.nutrients.fats}`} unit="g" />
          </div>

          <div className="mt-3 rounded-xl bg-canvas px-3 py-2 text-xs text-ink-muted">
            <span className="font-medium text-ink">Tip: </span>
            {meal.tip}
          </div>
        </div>
      </div>
    </section>
  )
}

function Nutrient({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2 text-center">
      <p className="text-sm font-bold text-ink">
        {value}
        <span className="text-[11px] font-medium text-ink-faint"> {unit}</span>
      </p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  )
}

function NutritionDonut({ score }) {
  // Segments: Good 60 / Protein 20 / Carbs 15 / Fats 5 (sum 100).
  const segs = [
    { label: 'Good', value: 60, color: '#10B981' },
    { label: 'Protein', value: 20, color: '#6366F1' },
    { label: 'Carbs', value: 15, color: '#F59E0B' },
    { label: 'Fats', value: 5, color: '#EC4899' },
  ]
  const r = 42
  const C = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <h2 className="text-base font-semibold text-ink mb-3">Nutrition Balance</h2>
      <div className="flex items-center gap-4">
        <svg width="112" height="112" viewBox="0 0 112 112" className="shrink-0" role="img" aria-label={`Poshan score ${score} of 100`}>
          <circle cx="56" cy="56" r={r} fill="none" stroke="#EEF0F6" strokeWidth="12" />
          {segs.map((s) => {
            const len = (s.value / 100) * C
            const el = (
              <circle
                key={s.label}
                cx="56"
                cy="56"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="12"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 56 56)"
                strokeLinecap="butt"
              />
            )
            offset += len
            return el
          })}
          <text x="56" y="52" textAnchor="middle" className="fill-ink" style={{ fontSize: 20, fontWeight: 700 }}>
            {score}
          </text>
          <text x="56" y="68" textAnchor="middle" className="fill-ink-faint" style={{ fontSize: 10 }}>
            / 100
          </text>
        </svg>
        <ul className="space-y-1.5 text-sm">
          {segs.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-ink-muted">{s.label}</span>
              <span className="ml-auto text-ink font-medium">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DietHighlights() {
  const items = ['Rich in Protein', 'Good Calcium', 'Hydration', 'Fiber Intake']
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <h2 className="text-base font-semibold text-ink mb-3">Diet Highlights</h2>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2 text-sm text-ink">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check size={13} />
            </span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuickActions() {
  const actions = [
    { label: 'Swap Food', icon: Repeat, to: '/diet' },
    { label: 'Grocery List', icon: ShoppingCart, to: '/diet' },
    { label: 'Recipes', icon: BookOpen, to: '/diet' },
    { label: 'Ask AI', icon: MessageSquare, to: '/chat?q=Help%20me%20with%20my%20diet' },
  ]
  return (
    <div className="rounded-2xl bg-white border border-line shadow-card p-5">
      <h2 className="text-base font-semibold text-ink mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm text-ink hover:bg-canvas transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <a.icon size={16} className="text-indigo-600" />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

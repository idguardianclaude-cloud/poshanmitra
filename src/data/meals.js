// Sample meal plan for pregnancy — SAFETY.md §4. These numbers are hand-written
// approximations, NOT verified from IFCT/ICMR-NIN tables. The page must label this
// a "Sample plan" and carry the required non-dismissable note. Never present as
// personalised medical nutrition advice.

export const summary = {
  calories: '2100 kcal/day',
  protein: '75 g/day',
  water: '2.5 L/day',
  meals: '5 per day',
}

// Day tabs — a week starting Monday 12 May.
export const days = [
  { key: 'mon', label: 'Mon', date: '12 May' },
  { key: 'tue', label: 'Tue', date: '13 May' },
  { key: 'wed', label: 'Wed', date: '14 May' },
  { key: 'thu', label: 'Thu', date: '15 May' },
  { key: 'fri', label: 'Fri', date: '16 May' },
  { key: 'sat', label: 'Sat', date: '17 May' },
  { key: 'sun', label: 'Sun', date: '18 May' },
]

// Five meals from PRODUCT_SPEC §5. `items` may carry tags for swap logic:
//   { name, egg?: true, root?: true, allium?: true }
export const meals = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '7:30–8:30 AM',
    tint: '#FFFBEB',
    items: [
      { name: 'Vegetable Upma' },
      { name: 'Boiled Egg (1)', egg: true },
      { name: 'Banana (1 medium)' },
      { name: 'Milk (1 glass)' },
    ],
    nutrients: { kcal: 450, protein: 18, carbs: 60, fats: 12 },
    tip: 'A healthy breakfast gives you energy for the whole day.',
  },
  {
    id: 'mid-morning',
    name: 'Mid-morning Snack',
    time: '10:30 AM',
    tint: '#ECFDF5',
    items: [
      { name: 'Sprouts Chaat' },
      { name: 'Almonds (5)' },
      { name: 'Coconut Water (1 glass)' },
    ],
    nutrients: { kcal: 200, protein: 8, carbs: 22, fats: 8 },
    tip: 'Sprouts are rich in protein and fiber.',
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '1:00–2:00 PM',
    tint: '#EFF6FF',
    items: [
      { name: '2 Phulka' },
      { name: 'Moong Dal' },
      { name: 'Mixed Vegetable Sabzi', root: true, allium: true },
      { name: 'Brown Rice (1 cup)' },
      { name: 'Curd (1 bowl)' },
      { name: 'Salad' },
    ],
    nutrients: { kcal: 600, protein: 22, carbs: 85, fats: 15 },
    tip: 'Include protein, fiber and calcium in your lunch.',
  },
  {
    id: 'evening',
    name: 'Evening Snack',
    time: '4:30–5:00 PM',
    tint: '#FDF2F8',
    items: [
      { name: 'Roasted Chana (1 small bowl)' },
      { name: 'Buttermilk (1 glass)' },
      { name: 'Apple (1 small)' },
    ],
    nutrients: { kcal: 250, protein: 10, carbs: 30, fats: 5 },
    tip: 'Light and healthy snack keeps your energy steady.',
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '7:30–8:30 PM',
    tint: '#F0FDFA',
    items: [
      { name: 'Vegetable Soup' },
      { name: '2 Phulka' },
      { name: 'Paneer Bhurji' },
      { name: 'Steamed Vegetables', root: true },
    ],
    nutrients: { kcal: 500, protein: 20, carbs: 30, fats: 14 },
    tip: 'Keep dinner light and easy to digest.',
  },
]

// One simple swap map, not a rules engine (SAFETY.md §4 / PRODUCT_SPEC §5).
// Vegetarian: boiled egg → paneer cubes. Jain: also drop items tagged as an
// onion/garlic (`allium`) or root vegetable. Only items that genuinely are those
// carry the tag — composite dishes commonly made Jain-style (paneer bhurji,
// vegetable soup, sprouts chaat) are left in so a meal is never starved to one item.
export function applyFoodPreference(mealList, food) {
  const pref = (food || '').toLowerCase()
  const isVeg = pref === 'vegetarian' || pref === 'jain'
  const isJain = pref === 'jain'

  return mealList.map((meal) => {
    let items = meal.items.map((it) => {
      if (it.egg && isVeg) return { ...it, name: 'Paneer Cubes (100g)', egg: false }
      return it
    })
    if (isJain) {
      items = items.filter((it) => !it.root && !it.allium)
    }
    return { ...meal, items }
  })
}

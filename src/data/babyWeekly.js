// Week-by-week "your baby this week" — gentle, general educational milestones with
// a familiar size comparison (fruits/vegetables common in India). These are broad,
// typical facts for a healthy pregnancy, NOT a measurement of her baby and NOT a
// diagnosis — every baby grows at its own pace. The tool says exactly that. We keep
// comparisons to foods a woman in a Tier 2–3 city will recognise.
export const BABY_WEEKLY = [
  { w: 4, size: 'a poppy seed', emoji: '•', note: 'The tiny embryo is settling in. Your body has begun its amazing work.' },
  { w: 5, size: 'a sesame seed', emoji: '•', note: 'The heart is beginning to form and will soon start to beat.' },
  { w: 6, size: 'a grain of rice', emoji: '🌾', note: 'A tiny heartbeat may be seen on a scan this week.' },
  { w: 7, size: 'a blueberry', emoji: '🫐', note: 'Little arm and leg buds are appearing.' },
  { w: 8, size: 'a rajma bean', emoji: '🫘', note: 'Fingers and toes are starting to form.' },
  { w: 9, size: 'a grape', emoji: '🍇', note: 'Tiny muscles are forming; baby can make small movements.' },
  { w: 10, size: 'a strawberry', emoji: '🍓', note: 'Vital organs are in place and beginning to work.' },
  { w: 11, size: 'a lime', emoji: '🍈', note: 'Baby is now officially called a foetus and is growing fast.' },
  { w: 12, size: 'a lemon', emoji: '🍋', note: 'Reflexes are developing — baby can curl fingers and toes.' },
  { w: 13, size: 'a pea pod', emoji: '🌱', note: 'You are entering the second trimester — often an easier phase.' },
  { w: 14, size: 'a lemon', emoji: '🍋', note: 'Baby can make facial expressions now.' },
  { w: 16, size: 'an avocado', emoji: '🥑', note: 'You may start to feel tiny flutters in the coming weeks.' },
  { w: 18, size: 'a bell pepper', emoji: '🫑', note: 'Baby’s ears are in position and may begin to hear sounds.' },
  { w: 20, size: 'a banana', emoji: '🍌', note: 'Halfway there! The anomaly scan is usually done around now.' },
  { w: 22, size: 'a papaya slice', emoji: '🥭', note: 'Baby is developing a sense of touch.' },
  { w: 24, size: 'a corn cob', emoji: '🌽', note: 'Baby’s face is almost fully formed.' },
  { w: 26, size: 'a capsicum', emoji: '🫑', note: 'Baby may respond to your voice and to light.' },
  { w: 28, size: 'a brinjal', emoji: '🍆', note: 'Third trimester begins. Baby can open and close its eyes.' },
  { w: 30, size: 'a large cabbage', emoji: '🥬', note: 'Baby is putting on weight and practising breathing movements.' },
  { w: 32, size: 'a coconut', emoji: '🥥', note: 'Baby’s bones are hardening (except the soft skull).' },
  { w: 34, size: 'a cantaloupe', emoji: '🍈', note: 'Baby’s lungs are maturing well.' },
  { w: 36, size: 'a bottle gourd', emoji: '🥒', note: 'Baby may be settling head-down, getting ready.' },
  { w: 38, size: 'a small pumpkin', emoji: '🎃', note: 'Baby is considered full-term very soon. Almost time!' },
  { w: 40, size: 'a watermelon', emoji: '🍉', note: 'Your due date is here — but a week either side is perfectly normal.' },
]

// The best entry for a given week: the latest milestone at or before `weeks`.
export function babyForWeek(weeks) {
  if (weeks == null || Number.isNaN(Number(weeks))) return null
  const w = Number(weeks)
  let best = null
  for (const entry of BABY_WEEKLY) {
    if (entry.w <= w) best = entry
    else break
  }
  return best || BABY_WEEKLY[0]
}

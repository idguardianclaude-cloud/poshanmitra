// Week-by-week "your baby this week" — gentle, general educational milestones with
// a familiar size comparison (fruits/vegetables common in India). These are broad,
// typical facts for a healthy pregnancy, NOT a measurement of her baby and NOT a
// diagnosis — every baby grows at its own pace. The tool says exactly that. We keep
// comparisons to foods a woman in a Tier 2–3 city will recognise.
//
// `mom` is a short, supportive "for you this week" note for the MOTHER — general
// comfort/self-care framing, never a diagnosis and never a medicine.
export const BABY_WEEKLY = [
  { w: 4, size: 'a poppy seed', emoji: '•', note: 'The tiny embryo is settling in. Your body has begun its amazing work.', mom: 'You may feel tired or notice a missed period. Start folic acid if your doctor advises.' },
  { w: 5, size: 'a sesame seed', emoji: '•', note: 'The heart is beginning to form and will soon start to beat.', mom: 'Early nausea can begin. Eat small, frequent meals and rest when you can.' },
  { w: 6, size: 'a grain of rice', emoji: '🌾', note: 'A tiny heartbeat may be seen on a scan this week.', mom: 'Tender breasts and tiredness are common. Be gentle with yourself.' },
  { w: 7, size: 'a blueberry', emoji: '🫐', note: 'Little arm and leg buds are appearing.', mom: 'Morning sickness may peak. Ginger and lemon water can help.' },
  { w: 8, size: 'a rajma bean', emoji: '🫘', note: 'Fingers and toes are starting to form.', mom: 'Book your first ANC check-up if you haven’t yet.' },
  { w: 9, size: 'a grape', emoji: '🍇', note: 'Tiny muscles are forming; baby can make small movements.', mom: 'Mood swings are normal with changing hormones. Talk to someone you trust.' },
  { w: 10, size: 'a strawberry', emoji: '🍓', note: 'Vital organs are in place and beginning to work.', mom: 'Keep taking your folic acid and iron as advised. Stay hydrated.' },
  { w: 11, size: 'a lime', emoji: '🍈', note: 'Baby is now officially called a foetus and is growing fast.', mom: 'Nausea often starts easing soon. Keep meals simple and regular.' },
  { w: 12, size: 'a lemon', emoji: '🍋', note: 'Reflexes are developing — baby can curl fingers and toes.', mom: 'Your first-trimester scan is usually around now. Energy may return soon.' },
  { w: 13, size: 'a pea pod', emoji: '🌱', note: 'You are entering the second trimester — often an easier phase.', mom: 'Many women feel better now. A good time for gentle walks.' },
  { w: 14, size: 'a lemon', emoji: '🍋', note: 'Baby can make facial expressions now.', mom: 'Appetite may improve. Focus on iron- and protein-rich foods.' },
  { w: 16, size: 'an avocado', emoji: '🥑', note: 'You may start to feel tiny flutters in the coming weeks.', mom: 'You may notice a small bump. Comfortable, loose clothing helps.' },
  { w: 18, size: 'a bell pepper', emoji: '🫑', note: 'Baby’s ears are in position and may begin to hear sounds.', mom: 'Talk or sing to your baby — they may begin to hear you.' },
  { w: 20, size: 'a banana', emoji: '🍌', note: 'Halfway there! The anomaly scan is usually done around now.', mom: 'Halfway! Don’t miss your mid-pregnancy scan and check-up.' },
  { w: 22, size: 'a papaya slice', emoji: '🥭', note: 'Baby is developing a sense of touch.', mom: 'Back twinges may begin. Sit with support and avoid long standing.' },
  { w: 24, size: 'a corn cob', emoji: '🌽', note: 'Baby’s face is almost fully formed.', mom: 'Ask your doctor about the glucose (sugar) test around this time.' },
  { w: 26, size: 'a capsicum', emoji: '🫑', note: 'Baby may respond to your voice and to light.', mom: 'Rest on your side. Keep counting baby’s kicks as they grow stronger.' },
  { w: 28, size: 'a brinjal', emoji: '🍆', note: 'Third trimester begins. Baby can open and close its eyes.', mom: 'Check-ups become more frequent now. Watch for swelling or headaches.' },
  { w: 30, size: 'a large cabbage', emoji: '🥬', note: 'Baby is putting on weight and practising breathing movements.', mom: 'Heartburn and breathlessness are common. Smaller meals help.' },
  { w: 32, size: 'a coconut', emoji: '🥥', note: 'Baby’s bones are hardening (except the soft skull).', mom: 'Start thinking about your birth plan and hospital bag.' },
  { w: 34, size: 'a cantaloupe', emoji: '🍈', note: 'Baby’s lungs are maturing well.', mom: 'Rest often. Note the pattern of your baby’s movements.' },
  { w: 36, size: 'a bottle gourd', emoji: '🥒', note: 'Baby may be settling head-down, getting ready.', mom: 'Keep your bag and documents ready. Know the signs of labour.' },
  { w: 38, size: 'a small pumpkin', emoji: '🎃', note: 'Baby is considered full-term very soon. Almost time!', mom: 'Rest, stay calm, and watch for labour signs or your water breaking.' },
  { w: 40, size: 'a watermelon', emoji: '🍉', note: 'Your due date is here — but a week either side is perfectly normal.', mom: 'Any day now! Go to hospital if contractions are regular or your water breaks.' },
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

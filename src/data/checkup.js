// Week-by-week pregnancy milestones — GENERAL educational content (the kind every
// pregnancy app shows), not personalised medical advice. The page carries the
// standard disclaimer. Entries are keyed by the week they start; the page shows
// the latest entry at or before the mother's current week.

export const weeklyMilestones = [
  {
    from: 4,
    size: 'a poppy seed',
    baby: 'The tiny embryo is settling in and the basic structures that become the brain, spine and heart are beginning to form.',
    mom: 'You may feel little yet, or notice tender breasts and mild tiredness. A missed period is often the first sign.',
    tips: ['Start (or continue) folic acid as advised by your doctor.', 'Avoid alcohol, tobacco and raw/undercooked food.'],
    checklist: ['Confirm the pregnancy and note your last period date', 'Book your first antenatal (ANC) visit'],
  },
  {
    from: 7,
    size: 'a blueberry',
    baby: 'Tiny arm and leg buds appear and the heart is beating steadily.',
    mom: 'Nausea (“morning sickness”) and food aversions are common now. Eating small, frequent meals can help.',
    tips: ['Keep dry snacks like biscuits or toast handy for nausea.', 'Sip water and stay hydrated through the day.'],
    checklist: ['Attend your first ANC check-up', 'Ask your doctor about the supplements right for you'],
  },
  {
    from: 10,
    size: 'a strawberry',
    baby: 'All the essential organs have formed and are starting to work. The baby is now called a foetus.',
    mom: 'Nausea may still be around; your waistband might start feeling snug.',
    tips: ['Include iron-rich foods like dal, leafy greens and jaggery.', 'Gentle walks help digestion and mood.'],
    checklist: ['Get your first-trimester blood tests done', 'Note any questions for your next visit'],
  },
  {
    from: 13,
    size: 'a lemon',
    baby: 'The baby can make tiny movements and even hiccup. Fingerprints are forming.',
    mom: 'Welcome to the second trimester — energy often returns and nausea eases.',
    tips: ['A good time for gentle prenatal yoga or walking.', 'Focus on protein and calcium (milk, curd, paneer, sprouts).'],
    checklist: ['Second ANC visit', 'Discuss the NT scan / first-trimester screening with your doctor'],
  },
  {
    from: 17,
    size: 'a pomegranate',
    baby: 'The baby is growing quickly and may start responding to sounds. Soft hair (lanugo) covers the skin.',
    mom: 'You might feel the first flutters of movement. A small bump is usually visible now.',
    tips: ['Sleep on your side with a pillow between your knees for comfort.', 'Keep up iron and calcium in your meals.'],
    checklist: ['Third ANC visit', 'Plan your anomaly (level-2) ultrasound around weeks 18–20'],
  },
  {
    from: 21,
    size: 'a banana',
    baby: 'The baby is more active, with clear sleep and wake cycles, and can hear your voice.',
    mom: 'Your bump is growing; you may notice mild backache. Good posture helps.',
    tips: ['Talk or sing to your baby — they can hear you now.', 'Avoid lifting heavy things; bend at the knees.'],
    checklist: ['Review your anomaly scan results with your doctor', 'Ask about the TT/Td tetanus vaccination'],
  },
  {
    from: 25,
    size: 'a cauliflower',
    baby: 'The lungs are developing and the baby is putting on weight and fat.',
    mom: 'You may feel stronger kicks. Watch for swelling in the feet and rest with legs raised.',
    tips: ['Keep moving gently, but rest when you feel tired.', 'Stay hydrated to help reduce swelling.'],
    checklist: ['Ask your doctor about the gestational diabetes (glucose) test', 'Start noting your baby’s movement patterns'],
  },
  {
    from: 29,
    size: 'a small pumpkin',
    baby: 'The brain is growing fast and the baby can open their eyes.',
    mom: 'Third trimester begins — you may tire more easily and feel breathless at times.',
    tips: ['Eat smaller meals more often to ease heartburn.', 'Count your baby’s kicks daily and tell your doctor of any drop.'],
    checklist: ['ANC visits become more frequent now', 'Discuss your birth plan and preferred hospital'],
  },
  {
    from: 33,
    size: 'a pineapple',
    baby: 'The baby is gaining weight steadily and usually settling head-down.',
    mom: 'You may feel Braxton-Hicks (practice) contractions. Real, regular, painful contractions need a call to your doctor.',
    tips: ['Rest often and keep your feet up when you can.', 'Learn the signs of labour so you know when to go in.'],
    checklist: ['Pack your hospital bag (see the checklist below)', 'Confirm your delivery hospital and travel plan'],
  },
  {
    from: 37,
    size: 'a bunch of spinach (full-term soon!)',
    baby: 'The baby is considered full-term from 37 weeks and is getting ready to meet you.',
    mom: 'Watch closely for labour signs: regular contractions, waters breaking, or a “show”.',
    tips: ['Keep your phone charged and hospital bag ready by the door.', 'Rest, and call your doctor with any danger sign immediately.'],
    checklist: ['Weekly ANC check-ups', 'Review the danger signs — and keep 108 saved'],
  },
]

// The hospital bag list is useful across the late weeks.
export const hospitalBag = [
  'MCP card and all reports',
  'ID and any insurance/scheme documents',
  'Comfortable clothes and slippers for you',
  'Baby clothes, blankets and a soft towel',
  'Toiletries and sanitary pads',
  'Snacks and a water bottle',
  'Phone charger',
]

export function milestoneForWeek(week) {
  if (!week) return weeklyMilestones[0]
  let m = weeklyMilestones[0]
  for (const entry of weeklyMilestones) {
    if (week >= entry.from) m = entry
  }
  return m
}

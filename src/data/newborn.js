// Newborn care basics + newborn danger signs. General, widely-recommended care
// education for the first weeks (aligned with MoHFW / WHO newborn-care guidance).
// NOT a diagnosis and NOT a substitute for the ANM/doctor; we never name a medicine.
// Danger signs always say "go to hospital" — we escalate toward care.
export const NEWBORN_CARE = [
  { emoji: '🤱', title: 'Feeding', tips: [
    'Start breastfeeding within 1 hour of birth.',
    'Feed on demand — about 8–12 times a day.',
    'Give only breastmilk for the first 6 months — no water, honey or ghutti.',
  ] },
  { emoji: '🪢', title: 'Cord care', tips: [
    'Keep the cord stump clean and dry.',
    'Don’t apply anything unless your health worker advises.',
    'It usually dries and falls off in 1–2 weeks.',
  ] },
  { emoji: '🧣', title: 'Keeping warm', tips: [
    'Skin-to-skin contact keeps baby warm and calm.',
    'Cover the head with a cap; dress in soft layers.',
    'Delay the first bath for a few days, as advised.',
  ] },
  { emoji: '😴', title: 'Safe sleep', tips: [
    'Lay baby on the back to sleep.',
    'Use a firm, flat surface; keep pillows and loose cloth away from the face.',
    'Keep baby close, in a smoke-free space.',
  ] },
  { emoji: '🧼', title: 'Hygiene', tips: [
    'Wash your hands before holding or feeding baby.',
    'Keep unwell visitors away in the early weeks.',
    'Take baby for the first check-up within a few days.',
  ] },
]

export const NEWBORN_DANGER = [
  'Not feeding or refusing feeds',
  'Fast or difficult breathing, or chest pulling in',
  'Fever, or body feels cold to touch',
  'Yellow skin or eyes that is spreading (jaundice)',
  'Very sleepy, hard to wake, or floppy',
  'Fits or convulsions',
  'Redness, pus or bleeding at the cord',
]

// Postpartum recovery checklist for the mother — grouped, tickable reminders.
export const POSTPARTUM = [
  { key: 'rest', title: 'Rest & nourish', items: [
    'Rest whenever your baby sleeps',
    'Eat iron- and protein-rich meals, drink plenty of fluids',
    'Keep taking iron/calcium if your doctor advised',
    'Begin gentle movement when you feel ready',
  ] },
  { key: 'body', title: 'Your body', items: [
    'Keep any stitches and the perineum clean and dry',
    'Use clean maternity pads; change them often',
    'Go for your 6-week postnatal check-up',
  ] },
  { key: 'mind', title: 'Your mind', items: [
    'Accept help from family — you don’t have to do it all',
    'Talk about your feelings; “baby blues” are common',
    'Rest your eyes and take short breaks',
  ] },
]

export const POSTPARTUM_DANGER = [
  'Heavy bleeding — soaking a pad in an hour, or large clots',
  'Fever, chills, or foul-smelling discharge',
  'Severe headache or blurred vision',
  'Pain, redness or swelling in one leg (calf)',
  'Severe low mood, or any thought of harming yourself or the baby',
]

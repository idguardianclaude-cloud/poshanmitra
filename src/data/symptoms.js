// Common pregnancy discomforts — simple comfort measures AND clear "when to seek
// help" guidance. SAFETY-SENSITIVE (SAFETY.md §3/§4): this is general self-care
// education, NOT diagnosis and NOT treatment. We never name a medicine or a dose.
// Every entry pairs gentle, widely-recommended comfort tips with the warning signs
// that mean "see your doctor" or "go now" — we always escalate toward care, never
// away from it. The card also shows the emergency danger-signs up front.
export const DANGER_SIGNS = [
  'Heavy bleeding from the vagina',
  'Severe headache or blurred vision',
  'Severe pain in the upper belly',
  'Baby moving much less than usual',
  'Water breaks or fluid leaks (before 37 weeks)',
  'High fever, fits, or fainting',
]

export const SYMPTOMS = [
  {
    key: 'nausea',
    emoji: '🤢',
    name: 'Morning sickness (nausea)',
    selfCare: [
      'Eat small meals often; don’t stay empty-stomach.',
      'Try ginger, lemon water, or dry toast / biscuits.',
      'Avoid strong smells and oily, spicy food.',
      'Sip water through the day to stay hydrated.',
    ],
    seekCare: [
      'You can’t keep any food or water down.',
      'You vomit many times a day or feel very weak.',
      'You pass very little urine (sign of dehydration).',
    ],
  },
  {
    key: 'heartburn',
    emoji: '🔥',
    name: 'Heartburn & acidity',
    selfCare: [
      'Eat smaller meals and chew slowly.',
      'Don’t lie down right after eating; wait 1–2 hours.',
      'Avoid very spicy, oily or fried food.',
      'Prop your head up a little while sleeping.',
    ],
    seekCare: [
      'The pain is severe or in your upper belly.',
      'It comes with a bad headache or blurred vision.',
    ],
  },
  {
    key: 'swelling',
    emoji: '🦶',
    name: 'Swelling in feet & ankles',
    selfCare: [
      'Rest with your feet raised when you can.',
      'Avoid standing for long periods.',
      'Wear comfortable, loose footwear.',
      'Keep drinking water and move gently.',
    ],
    seekCare: [
      'Sudden swelling of your face or hands.',
      'Swelling with a severe headache or blurred vision.',
      'One leg is swollen, red, warm or painful.',
    ],
  },
  {
    key: 'backpain',
    emoji: '🦴',
    name: 'Back pain',
    selfCare: [
      'Sit and stand with a straight, supported back.',
      'Try gentle stretches and short walks.',
      'Use a warm compress on the sore area.',
      'Wear flat, comfortable footwear.',
    ],
    seekCare: [
      'The pain is severe or comes in a regular rhythm.',
      'It comes with fever, or with bleeding or fluid leaking.',
    ],
  },
  {
    key: 'constipation',
    emoji: '🚽',
    name: 'Constipation',
    selfCare: [
      'Eat more fibre — fruits, vegetables, whole grains.',
      'Drink plenty of water through the day.',
      'Stay lightly active with short walks.',
    ],
    seekCare: [
      'You have severe belly pain.',
      'You notice bleeding.',
    ],
  },
  {
    key: 'cramps',
    emoji: '🦵',
    name: 'Leg cramps',
    selfCare: [
      'Gently stretch and massage the calf.',
      'Stay hydrated and keep moving a little.',
      'Eat calcium-rich foods like milk and curd.',
    ],
    seekCare: [
      'One leg is swollen, red, warm or painful (not just a cramp).',
    ],
  },
  {
    key: 'tightening',
    emoji: '🤰',
    name: 'Tightening (practice contractions)',
    selfCare: [
      'Rest and change your position.',
      'Drink some water — mild tightening often eases.',
      'Breathe slowly and relax.',
    ],
    seekCare: [
      'Regular, painful tightenings before 37 weeks.',
      'Your water breaks or you have any bleeding.',
      'You feel the baby moving much less than usual.',
    ],
  },
]

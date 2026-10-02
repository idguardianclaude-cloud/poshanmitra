// India's National Immunization Schedule (NIS) — the routine childhood vaccines
// given free at government facilities. This is GENERAL public-health information to
// help a mother know what's due and when; the exact vaccines, doses and timing are
// confirmed by her ANM / doctor and may vary (e.g. JE only in endemic districts).
// We never advise for/against a vaccine and never name a dose amount — we point to
// her health worker. Offsets are days from the baby's date of birth.
export const IMMUNIZATION = [
  {
    key: 'birth',
    offsetDays: 0,
    label: 'At birth',
    vaccines: ['BCG', 'Hepatitis B (birth dose)', 'OPV-0'],
  },
  {
    key: '6w',
    offsetDays: 42,
    label: '6 weeks',
    vaccines: ['Pentavalent-1', 'OPV-1', 'Rotavirus-1', 'fIPV-1', 'PCV-1'],
  },
  {
    key: '10w',
    offsetDays: 70,
    label: '10 weeks',
    vaccines: ['Pentavalent-2', 'OPV-2', 'Rotavirus-2'],
  },
  {
    key: '14w',
    offsetDays: 98,
    label: '14 weeks',
    vaccines: ['Pentavalent-3', 'OPV-3', 'Rotavirus-3', 'fIPV-2', 'PCV-2'],
  },
  {
    key: '9m',
    offsetDays: 274,
    label: '9–12 months',
    vaccines: ['Measles-Rubella (MR)-1', 'PCV booster', 'Vitamin A (1st dose)', 'JE-1 (in endemic areas)'],
  },
  {
    key: '16m',
    offsetDays: 480,
    label: '16–24 months',
    vaccines: ['DPT booster-1', 'OPV booster', 'MR-2', 'JE-2 (in endemic areas)'],
  },
]

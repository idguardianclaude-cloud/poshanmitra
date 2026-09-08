// Twelve real Government of India / maternal-child welfare schemes. Content is
// summarised for guidance only — the app never submits an application and never
// collects Aadhaar or bank account numbers (SAFETY.md §5). Every "apply" action
// opens the official portal in a new tab.

export const CATEGORIES = [
  { key: 'all', label: 'All Schemes' },
  { key: 'pregnant', label: 'For Pregnant Women' },
  { key: 'children', label: 'For Children' },
  { key: 'nutrition', label: 'For Nutrition' },
  { key: 'financial', label: 'Financial Support' },
]

export const BENEFIT_TYPES = ['Financial', 'Nutrition & Ration', 'Health Services', 'Insurance']

export const schemes = [
  {
    id: 'pmmvy',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    popular: true,
    benefitType: 'Financial',
    categories: ['pregnant', 'financial', 'nutrition'],
    tags: ['For Pregnant Women', 'Financial Support'],
    description:
      'Financial support for pregnant women and lactating mothers for better nutrition and partial wage compensation during pregnancy.',
    benefits: ['₹5,000 in three installments', 'Improves maternal nutrition', 'Supports healthy pregnancy'],
    eligibility: [
      'Pregnant and lactating mothers for the first living child',
      'Age 19 years or above at the time of pregnancy',
      'Not a regular employee of Central/State Government or PSU',
    ],
    documents: ['MCP (Mother-Child Protection) card', 'Bank/post-office account passbook', 'Identity proof', 'Registration at Anganwadi/health facility'],
    whereToApply: 'Register at your Anganwadi centre or approved health facility (ASHA/ANM can help).',
    portal: 'https://pmmvy.wcd.gov.in',
  },
  {
    id: 'poshan',
    name: 'POSHAN Abhiyaan',
    benefitType: 'Nutrition & Ration',
    categories: ['nutrition'],
    tags: ['For Nutrition'],
    description:
      "National nutrition mission to improve nutritional outcomes for mothers, adolescent girls and children through convergence and awareness.",
    benefits: ['Better nutrition awareness', 'Community support', 'Focus on healthy eating'],
    eligibility: [
      'Pregnant and lactating women',
      'Children under 6 years',
      'Adolescent girls (in select districts)',
    ],
    documents: ['MCP card', 'Anganwadi registration'],
    whereToApply: 'Services delivered through your local Anganwadi centre.',
    portal: 'https://poshanabhiyaan.gov.in',
  },
  {
    id: 'jsy',
    name: 'Janani Suraksha Yojana (JSY)',
    benefitType: 'Financial',
    categories: ['pregnant', 'financial'],
    tags: ['For Pregnant Women', 'Financial Support'],
    description:
      'Promotes institutional delivery among pregnant women, especially from poor households, through cash assistance.',
    benefits: ['Cash assistance for delivery', 'Safe delivery in hospitals', 'Reduced maternal mortality'],
    eligibility: [
      'Pregnant women opting for institutional delivery',
      'Priority for BPL, SC and ST women',
      'Cash amount varies by state and rural/urban area',
    ],
    documents: ['MCP card', 'BPL/caste certificate (where applicable)', 'Bank account passbook', 'Identity proof'],
    whereToApply: 'Register with your ASHA worker or at the government hospital/PHC.',
    portal: 'https://nhm.gov.in',
  },
  {
    id: 'pmposhan',
    name: 'PM POSHAN Shakti Nirman',
    benefitType: 'Nutrition & Ration',
    categories: ['nutrition', 'children'],
    tags: ['For Nutrition', 'For Children'],
    description:
      'Improves nutritional support to children (and complements maternal nutrition efforts) through hot cooked meals and take-home ration.',
    benefits: ['Take-home ration support', 'Nutrition & health education', 'Improves child growth'],
    eligibility: ['Children in government and government-aided schools', 'Delivered via ICDS/Anganwadi for younger children'],
    documents: ['School/Anganwadi enrolment'],
    whereToApply: 'Through your child’s school or the local Anganwadi centre.',
    portal: 'https://pmposhan.education.gov.in',
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat – PMJAY',
    benefitType: 'Insurance',
    categories: ['pregnant'],
    tags: ['For Pregnant Women', 'Health Cover'],
    description:
      'Health insurance coverage for hospitalization expenses for eligible families, including pre- and post-natal care.',
    benefits: ['Up to ₹5 lakh health cover per family per year', 'Cashless treatment at empanelled hospitals', 'Covers pre & post natal care'],
    eligibility: [
      'Families identified under SECC deprivation criteria',
      'Antyodaya / eligible BPL households',
      'Check your name on the official beneficiary list',
    ],
    documents: ['Ration card', 'Identity proof', 'Ayushman card (if issued)'],
    whereToApply: 'Verify eligibility on the PMJAY portal or at a Common Service Centre / empanelled hospital.',
    portal: 'https://pmjay.gov.in',
  },
  {
    id: 'indradhanush',
    name: 'Mission Indradhanush',
    benefitType: 'Health Services',
    categories: ['children'],
    tags: ['For Children', 'Immunisation'],
    description:
      'Intensified immunisation drive to fully vaccinate pregnant women and children against preventable diseases.',
    benefits: ['Free vaccination', 'Protection from preventable diseases', 'Special drives in under-served areas'],
    eligibility: ['Pregnant women (TT/Td)', 'Children up to 2 years', 'Partially or un-immunised children on priority'],
    documents: ['MCP/immunisation card'],
    whereToApply: 'Attend immunisation sessions at your Anganwadi/PHC or during Indradhanush drives.',
    portal: 'https://nhm.gov.in',
  },
  {
    id: 'jssk',
    name: 'Janani Shishu Suraksha Karyakram (JSSK)',
    benefitType: 'Health Services',
    categories: ['pregnant'],
    tags: ['For Pregnant Women', 'Free Care'],
    description:
      'Entitles pregnant women and sick newborns to free and cashless services in public health institutions.',
    benefits: ['Free delivery, including C-section', 'Free medicines, diagnostics and diet', 'Free transport to and from facility'],
    eligibility: ['All pregnant women delivering in public health institutions', 'Sick newborns up to 30 days (extended in many states to 1 year)'],
    documents: ['MCP card', 'Hospital registration'],
    whereToApply: 'Automatically available at government hospitals — ask the facility staff or your ASHA.',
    portal: 'https://nhm.gov.in',
  },
  {
    id: 'icds',
    name: 'Integrated Child Development Services (ICDS)',
    benefitType: 'Nutrition & Ration',
    categories: ['children', 'nutrition'],
    tags: ['For Children', 'For Nutrition'],
    description:
      'Package of services — supplementary nutrition, immunisation, health check-ups and pre-school education — through Anganwadi centres.',
    benefits: ['Supplementary nutrition', 'Growth monitoring & health check-ups', 'Pre-school education'],
    eligibility: ['Pregnant and lactating mothers', 'Children below 6 years'],
    documents: ['Anganwadi registration', 'MCP card'],
    whereToApply: 'Register at your nearest Anganwadi centre.',
    portal: 'https://wcd.nic.in',
  },
  {
    id: 'sukanya',
    name: 'Sukanya Samriddhi Yojana',
    benefitType: 'Financial',
    categories: ['children', 'financial'],
    tags: ['For Children', 'Savings'],
    description:
      'A small-savings scheme for a girl child to support her future education and marriage expenses, with attractive interest and tax benefits.',
    benefits: ['High fixed interest rate', 'Tax benefits under Section 80C', 'Builds a corpus for the girl child'],
    eligibility: ['Account for a girl child below 10 years', 'Opened by a parent or legal guardian', 'One account per girl child'],
    documents: ['Birth certificate of the girl child', 'Guardian identity & address proof'],
    whereToApply: 'Open an account at any post office or authorised bank branch.',
    portal: 'https://www.nsiindia.gov.in',
  },
  {
    id: 'matru-topup',
    name: 'Matru Vandana State Top-ups',
    benefitType: 'Financial',
    categories: ['nutrition'],
    tags: ['For Nutrition', 'State Benefit'],
    description:
      'Several states add a top-up amount or second-child benefit over and above central PMMVY support to strengthen maternal nutrition.',
    benefits: ['Additional cash over central PMMVY', 'Second-child benefit in some states', 'Strengthens maternal nutrition'],
    eligibility: ['Eligibility mirrors PMMVY, with state-specific additions', 'Varies by state — confirm locally'],
    documents: ['MCP card', 'PMMVY registration', 'Bank account passbook'],
    whereToApply: 'Ask your Anganwadi worker whether your state offers a top-up and how to enrol.',
    portal: 'https://wcd.nic.in',
  },
  {
    id: 'laqshya',
    name: 'LaQshya (Labour Room Quality Improvement)',
    benefitType: 'Health Services',
    categories: ['pregnant'],
    tags: ['For Pregnant Women', 'Quality Care'],
    description:
      'Improves the quality of care in labour rooms and maternity operation theatres so that every mother and newborn gets respectful, safe care.',
    benefits: ['Better labour-room quality', 'Respectful maternity care', 'Safer deliveries'],
    eligibility: ['All women delivering at LaQshya-certified public facilities'],
    documents: ['Hospital registration'],
    whereToApply: 'Available at certified government facilities — ask if your hospital is LaQshya-certified.',
    portal: 'https://nhm.gov.in',
  },
  {
    id: 'suman',
    name: 'Surakshit Matritva Aashwasan (SUMAN)',
    benefitType: 'Health Services',
    categories: ['pregnant'],
    tags: ['For Pregnant Women', 'Assured Care'],
    description:
      'Assured, dignified and free healthcare for every pregnant woman and newborn visiting a public health facility, with zero tolerance for denial of services.',
    benefits: ['Free antenatal check-ups', 'Assured, respectful care', 'Free newborn care and transport'],
    eligibility: ['All pregnant women and newborns using public health facilities'],
    documents: ['MCP card', 'Facility registration'],
    whereToApply: 'Available at SUMAN-notified public health facilities.',
    portal: 'https://suman.nhm.gov.in',
  },
]

export function categoryCounts() {
  const counts = { all: schemes.length }
  for (const cat of CATEGORIES) {
    if (cat.key === 'all') continue
    counts[cat.key] = schemes.filter((s) => s.categories.includes(cat.key)).length
  }
  return counts
}

export const helpfulResources = ['How to Apply', 'Required Documents', 'Helpline Numbers', 'Download Forms']

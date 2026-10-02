// A quick "is this commonly advised in pregnancy?" reference for everyday Indian
// foods. This is GENERAL nutrition information, NOT medical advice and NOT specific
// to any woman's condition — allergies, gestational diabetes, anaemia and other
// situations change what's right for her, so every entry points back to her doctor.
// We keep notes balanced and non-alarmist (no scare language around common myths),
// and we never name medicines or supplements. SAFETY.md §2/§3.
//
// status: 'enjoy' | 'moderate' | 'cook' | 'avoid'
export const FOOD_STATUS = {
  enjoy: { label: 'Generally good', tint: '#ECFDF5', color: '#059669' },
  moderate: { label: 'In moderation', tint: '#FFFBEB', color: '#D97706' },
  cook: { label: 'Cook well first', tint: '#EFF6FF', color: '#2563EB' },
  avoid: { label: 'Usually avoided', tint: '#FEF2F2', color: '#DC2626' },
}

export const FOODS = [
  { name: 'Leafy greens (palak, methi)', status: 'enjoy', why: 'Rich in iron and folate. Wash very well before cooking.' },
  { name: 'Dal & legumes (rajma, chana)', status: 'enjoy', why: 'Good plant protein and fibre for everyday meals.' },
  { name: 'Milk & curd (pasteurised)', status: 'enjoy', why: 'Calcium and protein. Choose pasteurised; boil loose milk.' },
  { name: 'Paneer (pasteurised)', status: 'enjoy', why: 'Good protein and calcium when made from pasteurised milk.' },
  { name: 'Fruits (banana, apple, guava)', status: 'enjoy', why: 'Vitamins and fibre. Wash well; prefer freshly cut at home.' },
  { name: 'Dry fruits & nuts', status: 'enjoy', why: 'Almonds, walnuts, dates give iron and healthy fats — a handful a day.' },
  { name: 'Millets (ragi, jowar, bajra)', status: 'enjoy', why: 'Wholesome grains with iron and calcium.' },
  { name: 'Coconut water', status: 'enjoy', why: 'A hydrating, natural drink.' },
  { name: 'Eggs (fully cooked)', status: 'cook', why: 'Great protein — cook until firm; avoid runny yolks.' },
  { name: 'Chicken & mutton', status: 'cook', why: 'Cook thoroughly until no pink remains.' },
  { name: 'Fish (low-mercury, cooked)', status: 'cook', why: 'Cooked fish like rohu/surmai in moderation. Avoid raw fish.' },
  { name: 'Sprouts', status: 'cook', why: 'Lightly steam or cook rather than eating raw, to avoid germs.' },
  { name: 'Ripe papaya', status: 'moderate', why: 'A little ripe papaya is usually fine; many prefer to avoid raw/semi-ripe papaya. Ask your doctor.' },
  { name: 'Pineapple', status: 'moderate', why: 'Normal food amounts are generally considered fine; very large quantities are often avoided.' },
  { name: 'Tea & coffee (caffeine)', status: 'moderate', why: 'Keep caffeine modest — most guidance suggests limiting to about 1–2 cups a day.' },
  { name: 'Ghee, oil & sweets', status: 'moderate', why: 'Enjoy in small amounts; too much adds excess calories.' },
  { name: 'Pickles & papad (salty)', status: 'moderate', why: 'High in salt — have little, especially if advised to watch blood pressure.' },
  { name: 'Liver & organ meat', status: 'moderate', why: 'Very high in vitamin A — only small, occasional amounts.' },
  { name: 'Street food & outside cut fruit', status: 'avoid', why: 'Hygiene risk. Prefer freshly cooked, hot food from home.' },
  { name: 'Unpasteurised / raw milk', status: 'avoid', why: 'Can carry germs — always boil loose milk before use.' },
  { name: 'Raw or undercooked meat & eggs', status: 'avoid', why: 'Can carry infection — always cook fully.' },
  { name: 'Alcohol', status: 'avoid', why: 'No amount is considered safe in pregnancy.' },
  { name: 'Tobacco, paan & gutka', status: 'avoid', why: 'Harmful to you and your baby — best avoided completely.' },
  { name: 'High-mercury fish (shark, king mackerel)', status: 'avoid', why: 'Higher mercury — usually avoided in pregnancy.' },
]

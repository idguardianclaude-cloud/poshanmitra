// Curated pregnancy & baby essentials. This is a shopping GUIDE: prices are
// indicative and "Buy" opens a real retailer search — we hold no inventory and
// take no payment (checkout is a clearly-labelled demo). SAFETY: no medicines,
// no supplements, nothing that implies a prescription — only everyday non-medical
// items. Mitra's rules (no medicine/dose) are never crossed here.

export const shopCategories = [
  { key: 'mother', label: 'Mother care' },
  { key: 'feeding', label: 'Feeding & nursing' },
  { key: 'clothing', label: 'Baby clothing' },
  { key: 'babycare', label: 'Baby care' },
  { key: 'hospital', label: 'Hospital bag' },
]

// price: indicative INR; q: retailer search query.
export const products = [
  // Mother care
  { id: 'm1', cat: 'mother', emoji: '🤰', name: 'Maternity dress', price: 599, why: 'Comfortable, roomy wear for a growing bump', q: 'maternity dress' },
  { id: 'm2', cat: 'mother', emoji: '🩲', name: 'Maternity leggings', price: 499, why: 'Soft, stretchy, over-bump support', q: 'maternity leggings' },
  { id: 'm3', cat: 'mother', emoji: '🎗️', name: 'Belly support belt', price: 699, why: 'Eases back strain in later months', q: 'pregnancy belly support belt' },
  { id: 'm4', cat: 'mother', emoji: '🧴', name: 'Stretch-mark cream', price: 450, why: 'Keeps skin moisturised and supple', q: 'stretch marks cream pregnancy' },
  { id: 'm5', cat: 'mother', emoji: '🛏️', name: 'Pregnancy pillow', price: 999, why: 'Better sleep and side-lying support', q: 'pregnancy pillow' },

  // Feeding & nursing
  { id: 'f1', cat: 'feeding', emoji: '🤱', name: 'Nursing bras (2-pack)', price: 599, why: 'Easy, comfortable breastfeeding', q: 'nursing maternity bra' },
  { id: 'f2', cat: 'feeding', emoji: '🩹', name: 'Nursing pads', price: 299, why: 'Keeps you dry and comfortable', q: 'disposable nursing breast pads' },
  { id: 'f3', cat: 'feeding', emoji: '🍼', name: 'Feeding bottles (2)', price: 499, why: 'BPA-free, anti-colic', q: 'anti colic baby feeding bottle' },
  { id: 'f4', cat: 'feeding', emoji: '✋', name: 'Manual breast pump', price: 899, why: 'Express and store milk at home', q: 'manual breast pump' },
  { id: 'f5', cat: 'feeding', emoji: '🧻', name: 'Burp cloths / bibs', price: 299, why: 'Soft cotton for feeds', q: 'baby burp cloth bib cotton' },

  // Baby clothing
  { id: 'c1', cat: 'clothing', emoji: '👶', name: 'Newborn onesies (5)', price: 699, why: 'Soft cotton, easy to change', q: 'newborn onesie cotton pack' },
  { id: 'c2', cat: 'clothing', emoji: '🧦', name: 'Mittens, caps & socks', price: 299, why: 'Keeps baby warm and cosy', q: 'newborn mittens caps socks set' },
  { id: 'c3', cat: 'clothing', emoji: '🫗', name: 'Swaddle wraps (3)', price: 599, why: 'Gentle, secure swaddling', q: 'baby swaddle wrap muslin' },
  { id: 'c4', cat: 'clothing', emoji: '🧸', name: 'Baby blanket', price: 449, why: 'Soft and breathable', q: 'baby blanket soft cotton' },

  // Baby care
  { id: 'b1', cat: 'babycare', emoji: '🧷', name: 'Newborn diapers', price: 399, why: 'Gentle, leak-proof for sensitive skin', q: 'newborn diapers' },
  { id: 'b2', cat: 'babycare', emoji: '💧', name: 'Baby wipes', price: 199, why: 'Fragrance-free, gentle cleaning', q: 'baby wipes sensitive' },
  { id: 'b3', cat: 'babycare', emoji: '🧼', name: 'Mild baby soap & shampoo', price: 299, why: 'Tear-free, gentle on skin', q: 'baby soap shampoo tear free' },
  { id: 'b4', cat: 'babycare', emoji: '🌡️', name: 'Digital thermometer', price: 249, why: 'Quick, accurate temperature checks', q: 'digital thermometer baby' },
  { id: 'b5', cat: 'babycare', emoji: '✂️', name: 'Baby grooming kit', price: 349, why: 'Safe nail clippers, comb, brush', q: 'baby grooming kit nail clipper' },

  // Hospital bag
  { id: 'h1', cat: 'hospital', emoji: '🩸', name: 'Maternity pads', price: 299, why: 'For post-delivery care', q: 'maternity sanitary pads' },
  { id: 'h2', cat: 'hospital', emoji: '🧴', name: 'Travel toiletries kit', price: 399, why: 'Essentials for your hospital stay', q: 'travel toiletries kit' },
  { id: 'h3', cat: 'hospital', emoji: '🍪', name: 'Healthy snack box', price: 349, why: 'Energy for labour and after', q: 'healthy snacks dry fruits box' },
  { id: 'h4', cat: 'hospital', emoji: '🚰', name: 'Insulated water bottle', price: 499, why: 'Stay hydrated, keeps water cool', q: 'insulated water bottle' },
]

export function priceINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

// Real retailer searches (no inventory held here). Affiliate tags can be added later.
export function amazonSearch(q) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(q)}`
}
export function flipkartSearch(q) {
  return `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`
}

// Ten real Pune hospitals with maternity units. Coordinates are approximate and
// used only to position pins on the placeholder map; the "Directions" link uses
// the hospital name + address as the destination query (more reliable than
// possibly-imprecise coordinates). Phone numbers are representative reception
// lines and should be re-verified before launch (see NEXT_STEPS.md).
//
// `labourWard` and `pmjay` are the two flags that actually matter to her — which
// hospitals can deliver her baby, and which accept PMJAY cashless.

export const FACILITY_OPTIONS = [
  '24x7 Emergency',
  'ICU Available',
  'Cashless',
  'Laboratory',
  'Pharmacy',
  'Ambulance',
]

export const SPECIALITIES = [
  'Multi Speciality',
  'Super Speciality',
  'Maternity & Women',
  'General Hospital',
]

export const hospitals = [
  {
    id: 'sahyadri-nagar',
    name: 'Sahyadri Super Speciality Hospital',
    address: 'Nagar Road, Wadgaon Sheri, Pune 411014',
    distanceKm: 1.2,
    phone: '+91 20 6721 3000',
    speciality: 'Super Speciality',
    tags: ['Multi Speciality', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 34, y: 30 },
  },
  {
    id: 'manipal-kharadi',
    name: 'Manipal Hospital (formerly Columbia Asia), Kharadi',
    address: 'Kharadi Bypass Road, Kharadi, Pune 411014',
    distanceKm: 2.8,
    phone: '+91 20 6714 6666',
    speciality: 'Multi Speciality',
    tags: ['Multi Speciality', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: false,
    verified: true,
    pin: { x: 58, y: 40 },
  },
  {
    id: 'ruby-wanowrie',
    name: 'Ruby Hall Clinic, Wanowrie',
    address: '40, Sassoon Road annexe, Wanowrie, Pune 411040',
    distanceKm: 3.6,
    phone: '+91 20 6645 5100',
    speciality: 'Multi Speciality',
    tags: ['Multi Speciality', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 46, y: 56 },
  },
  {
    id: 'jehangir',
    name: 'Jehangir Hospital',
    address: '32, Sassoon Road, Pune 411001',
    distanceKm: 4.1,
    phone: '+91 20 6681 9999',
    speciality: 'Multi Speciality',
    tags: ['Multi Speciality', '24x7 Emergency'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: false,
    verified: true,
    pin: { x: 40, y: 48 },
  },
  {
    id: 'ruby-main',
    name: 'Ruby Hall Clinic, Sassoon Road',
    address: '40, Sassoon Road, Pune 411001',
    distanceKm: 4.4,
    phone: '+91 20 6645 5000',
    speciality: 'Super Speciality',
    tags: ['Multi Speciality', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 42, y: 46 },
  },
  {
    id: 'deenanath',
    name: 'Deenanath Mangeshkar Hospital',
    address: 'Erandwane, Near Mhatre Bridge, Pune 411004',
    distanceKm: 6.2,
    phone: '+91 20 4015 1000',
    speciality: 'Multi Speciality',
    tags: ['Multi Speciality', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 22, y: 52 },
  },
  {
    id: 'sassoon',
    name: 'Sassoon General Hospital',
    address: 'Near Pune Railway Station, Pune 411001',
    distanceKm: 4.8,
    phone: '+91 20 2612 8000',
    speciality: 'General Hospital',
    tags: ['Government', '24x7 Emergency', 'PMJAY Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 44, y: 42 },
  },
  {
    id: 'kem',
    name: 'KEM Hospital, Pune',
    address: '489, Rasta Peth, Sardar Moodliar Road, Pune 411011',
    distanceKm: 5.1,
    phone: '+91 20 6603 7300',
    speciality: 'Maternity & Women',
    tags: ['Maternity', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 48, y: 44 },
  },
  {
    id: 'noble',
    name: 'Noble Hospital, Hadapsar',
    address: 'Magarpatta City Road, Hadapsar, Pune 411013',
    distanceKm: 5.9,
    phone: '+91 20 6628 5000',
    speciality: 'Multi Speciality',
    tags: ['Multi Speciality', '24x7 Emergency', 'Cashless'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Cashless', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: true,
    verified: true,
    pin: { x: 60, y: 58 },
  },
  {
    id: 'motherhood-kharadi',
    name: 'Motherhood Hospital, Kharadi',
    address: 'Gera Imperium Rise, Kharadi, Pune 411014',
    distanceKm: 3.1,
    phone: '+91 20 4912 0000',
    speciality: 'Maternity & Women',
    tags: ['Maternity', '24x7 Emergency'],
    facilities: ['24x7 Emergency', 'ICU Available', 'Laboratory', 'Pharmacy', 'Ambulance'],
    labourWard: true,
    pmjay: false,
    verified: true,
    pin: { x: 56, y: 34 },
  },
]

// Directions link — use the place query, not raw coords, for reliable routing.
export function directionsUrl(h) {
  const dest = encodeURIComponent(`${h.name}, ${h.address}`)
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}

export const healthcareTips = [
  'Keep your MCP card and a list of your medicines in your hospital bag.',
  'Save your hospital’s number and your ASHA worker’s number in your phone now.',
  'For any danger sign, call 108 first — don’t wait to arrange your own transport.',
]

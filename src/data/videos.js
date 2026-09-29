// Video library metadata. IMPORTANT (SAFETY.md §9): we only embed a YouTube video
// when its source is a verified credible channel (hospital, government health body,
// or qualified OB-GYN). Pregnancy misinformation is a real harm — an unverified
// embed is worse than an empty slot. Until each ID is verified against an approved
// channel, `youtubeId` stays null and the player shows a "Video coming soon" card.
// Adding a verified ID later is a one-line change per item.

export const categories = [
  { key: 'pregnancy-care', label: 'Pregnancy Care', count: 42, tint: '#EEF0FF' },
  { key: 'nutrition', label: 'Nutrition & Diet', count: 38, tint: '#ECFDF5' },
  { key: 'exercise', label: 'Exercise & Yoga', count: 28, tint: '#F5F3FF' },
  { key: 'baby-dev', label: 'Baby Development', count: 36, tint: '#EFF6FF' },
  { key: 'breastfeeding', label: 'Breastfeeding Guide', count: 24, tint: '#FDF2F8' },
  { key: 'health-tips', label: 'Health Tips', count: 31, tint: '#FFFBEB' },
  { key: 'mental', label: 'Mental Wellness', count: 18, tint: '#F0FDFA' },
  { key: 'labor', label: 'Labor & Delivery', count: 22, tint: '#FEF2F2' },
  { key: 'postpartum', label: 'Postpartum Care', count: 17, tint: '#EEF0FF' },
]

// Real, embeddable videos from a VERIFIED credible channel — the Stanford Center
// for Health Education "Grow Great" maternal series (verified via YouTube oEmbed;
// CC-BY-NC-ND, animated, plain-language). This satisfies SAFETY.md §9: every embed
// is from a confirmed credible source. Categories with no verified video yet
// (exercise/yoga, labour) simply show no card rather than an unverified embed.
export const VERIFIED_CHANNEL = 'Stanford Center for Health Education'

export const videos = [
  { id: 'v1', title: 'How to Recognize Pregnancy', category: 'pregnancy-care', tag: 'Pregnancy Care', duration: '2:24', tint: '#EEF0FF', youtubeId: 'kRk5dEpK59o', channel: VERIFIED_CHANNEL },
  { id: 'v2', title: 'Nutrition During Pregnancy', category: 'nutrition', tag: 'Nutrition & Diet', duration: '3:07', tint: '#ECFDF5', youtubeId: '0BrxCY89_uQ', channel: VERIFIED_CHANNEL },
  { id: 'v3', title: 'Danger Signs During Pregnancy', category: 'health-tips', tag: 'Health Tips', duration: '2:41', tint: '#FFFBEB', youtubeId: 'qFfQvnedYAk', channel: VERIFIED_CHANNEL },
  { id: 'v4', title: 'Breastfeeding: Getting Started', category: 'breastfeeding', tag: 'Breastfeeding Guide', duration: '2:33', tint: '#FDF2F8', youtubeId: 'P3RqW4nxSoo', channel: VERIFIED_CHANNEL },
  { id: 'v5', title: 'Feeding Your Family on a Budget', category: 'nutrition', tag: 'Nutrition & Diet', duration: '3:12', tint: '#ECFDF5', youtubeId: '1bPHa_Ew75Y', channel: VERIFIED_CHANNEL },
  { id: 'v6', title: "Baby's First Foods (Complementary Feeding)", category: 'baby-dev', tag: 'Baby Development', duration: '3:05', tint: '#EFF6FF', youtubeId: '_S5OdN14Yfk', channel: VERIFIED_CHANNEL },
  { id: 'v7', title: 'Mental Health Support for New Mothers', category: 'mental', tag: 'Mental Wellness', duration: '2:38', tint: '#F0FDFA', youtubeId: 'mDpBgpMPI0Y', channel: VERIFIED_CHANNEL },
  { id: 'v8', title: 'Bonding With Your Baby', category: 'postpartum', tag: 'Postpartum Care', duration: '2:20', tint: '#EEF0FF', youtubeId: 'gpf1F6zNroM', channel: VERIFIED_CHANNEL },
  { id: 'v9', title: 'Routine Immunization & Vitamin A', category: 'baby-dev', tag: 'Baby Development', duration: '2:52', tint: '#EFF6FF', youtubeId: 'LAZ9ZmNs830', channel: VERIFIED_CHANNEL },
]

// Until a specific video ID is verified against a credible channel (SAFETY.md §9),
// each category points to an official Government-of-India / UN health source, so a
// woman always has a trustworthy place to go instead of an unverified embed. These
// are established official domains (gov.in / unicef.org), safe to link.
export const officialSources = {
  'pregnancy-care': { label: 'National Health Mission', url: 'https://nhm.gov.in' },
  nutrition: { label: 'POSHAN Abhiyaan', url: 'https://poshanabhiyaan.gov.in' },
  exercise: { label: 'Ministry of Health & Family Welfare', url: 'https://www.mohfw.gov.in' },
  'baby-dev': { label: 'UNICEF India', url: 'https://www.unicef.org/india' },
  breastfeeding: { label: 'UNICEF India', url: 'https://www.unicef.org/india' },
  'health-tips': { label: 'Ministry of Health & Family Welfare', url: 'https://www.mohfw.gov.in' },
  mental: { label: 'National Health Mission', url: 'https://nhm.gov.in' },
  labor: { label: 'National Health Mission', url: 'https://nhm.gov.in' },
  postpartum: { label: 'National Health Mission', url: 'https://nhm.gov.in' },
}
export const DEFAULT_SOURCE = { label: 'Ministry of Health & Family Welfare', url: 'https://www.mohfw.gov.in' }

export const continueWatching = [
  { id: 'v1', title: 'How to Recognize Pregnancy', progress: 60 },
  { id: 'v2', title: 'Nutrition During Pregnancy', progress: 40 },
  { id: 'v4', title: 'Breastfeeding: Getting Started', progress: 25 },
]

export const trending = [
  { id: 'v3', title: 'Danger Signs During Pregnancy', channel: VERIFIED_CHANNEL },
  { id: 'v2', title: 'Nutrition During Pregnancy', channel: VERIFIED_CHANNEL },
  { id: 'v7', title: 'Mental Health Support for New Mothers', channel: VERIFIED_CHANNEL },
]

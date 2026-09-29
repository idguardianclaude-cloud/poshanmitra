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

export const videos = [
  {
    id: 'v1',
    title: 'First Trimester Care Tips for a Healthy Pregnancy',
    category: 'pregnancy-care',
    tag: 'Pregnancy Care',
    duration: '8:45',
    views: '12.5K',
    age: '2 days ago',
    tint: '#EEF0FF',
    youtubeId: null,
  },
  {
    id: 'v2',
    title: 'Top 10 Iron Rich Foods for Pregnant Women',
    category: 'nutrition',
    tag: 'Nutrition & Diet',
    duration: '6:32',
    views: '18.3K',
    age: '4 days ago',
    tint: '#ECFDF5',
    youtubeId: null,
  },
  {
    id: 'v3',
    title: 'Safe Yoga Poses During Pregnancy',
    category: 'exercise',
    tag: 'Exercise & Yoga',
    duration: '10:12',
    views: '9.8K',
    age: '1 week ago',
    tint: '#F5F3FF',
    youtubeId: null,
  },
  {
    id: 'v4',
    title: 'Breastfeeding Tips for New Mothers',
    category: 'breastfeeding',
    tag: 'Breastfeeding Guide',
    duration: '7:20',
    views: '15.1K',
    age: '1 week ago',
    tint: '#FDF2F8',
    youtubeId: null,
  },
  {
    id: 'v5',
    title: 'Calcium Rich Foods for Strong Bones',
    category: 'nutrition',
    tag: 'Nutrition & Diet',
    duration: '5:40',
    views: '7.2K',
    age: '1 week ago',
    tint: '#ECFDF5',
    youtubeId: null,
  },
  {
    id: 'v6',
    title: "Activities to Boost Your Baby's Brain",
    category: 'baby-dev',
    tag: 'Baby Development',
    duration: '9:15',
    views: '11.6K',
    age: '2 weeks ago',
    tint: '#EFF6FF',
    youtubeId: null,
  },
  {
    id: 'v7',
    title: 'How to Manage Nausea in Early Pregnancy',
    category: 'health-tips',
    tag: 'Health Tips',
    duration: '6:18',
    views: '8.9K',
    age: '2 weeks ago',
    tint: '#FFFBEB',
    youtubeId: null,
  },
  {
    id: 'v8',
    title: 'What to Pack in Your Hospital Bag',
    category: 'labor',
    tag: 'Labor & Delivery',
    duration: '6:55',
    views: '10.7K',
    age: '2 weeks ago',
    tint: '#FEF2F2',
    youtubeId: null,
  },
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
  { id: 'v1', title: 'First Trimester Care Tips for a Healthy Pregnancy', progress: 60 },
  { id: 'v3', title: 'Safe Yoga Poses During Pregnancy', progress: 40 },
  { id: 'v6', title: "Activities to Boost Your Baby's Brain", progress: 25 },
]

export const trending = [
  { id: 'v2', title: 'Top 10 Iron Rich Foods for Pregnant Women', views: '18.3K' },
  { id: 'v4', title: 'Breastfeeding Tips for New Mothers', views: '15.1K' },
  { id: 'v1', title: 'First Trimester Care Tips for a Healthy Pregnancy', views: '12.5K' },
]

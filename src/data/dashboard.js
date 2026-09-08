// Mock dashboard content. Real Indian content only — no placeholders.

// Rotates daily (index = day-of-year % length).
export const healthTips = [
  {
    title: 'Stay hydrated',
    text: "Drink plenty of water and stay hydrated. It helps in maintaining amniotic fluid and supports your baby's development.",
  },
  {
    title: 'Iron-rich foods',
    text: 'Include iron-rich foods like spinach, jaggery, dates and lentils to help prevent anemia during pregnancy.',
  },
  {
    title: 'Gentle movement',
    text: 'A short 20-minute walk after meals aids digestion and helps keep your blood sugar steady.',
  },
  {
    title: 'Rest well',
    text: 'Sleep on your left side in later months — it improves blood flow to your baby. Use a pillow between your knees for comfort.',
  },
  {
    title: 'Calcium every day',
    text: 'Milk, curd, paneer, ragi and sesame (til) support your bones and your baby’s growing skeleton.',
  },
  {
    title: 'Small, frequent meals',
    text: 'Eating smaller meals more often can ease nausea and heartburn, and keeps your energy steady through the day.',
  },
  {
    title: 'Fresh fruits',
    text: 'Seasonal fruits like guava, orange, papaya (ripe) and pomegranate add vitamins and fibre. Wash them well first.',
  },
  {
    title: 'Take your walks slow',
    text: 'Listen to your body. If you feel breathless or dizzy, sit down and rest. There is no prize for pushing through.',
  },
  {
    title: 'Mind your posture',
    text: 'As your belly grows, stand tall and avoid lifting heavy things. Bend your knees, not your back.',
  },
  {
    title: 'Talk about your feelings',
    text: 'Mood changes are normal in pregnancy. Share how you feel with someone you trust — you are not alone.',
  },
]

export function tipOfTheDay() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - start) / 86400000)
  return healthTips[dayOfYear % healthTips.length]
}

// Today's Plan timeline — rows toggle complete on the dashboard.
export const todaysPlan = [
  { id: 'ex-morning', label: 'Morning Exercise', time: '7:00 AM', done: true },
  { id: 'diet-morning', label: 'Morning Diet', time: '8:30 AM', done: true },
  { id: 'diet-afternoon', label: 'Afternoon Diet', time: '1:30 PM', done: false },
  { id: 'ex-afternoon', label: 'Afternoon Exercise', time: '4:00 PM', done: false },
  { id: 'ex-evening', label: 'Evening Exercise', time: '6:00 PM', done: false },
  { id: 'diet-evening', label: 'Evening Diet', time: '8:00 PM', done: false },
]

// Six opening-message chips on the dashboard chatbot preview.
export const chatChips = [
  'Diet Recommendation',
  'Health Advice',
  'Symptoms Check',
  'Exercise Guidance',
  'Baby Development',
  'Ask Anything',
]

export const recentVideo = {
  title: 'Yoga for Healthy Pregnancy',
  tag: 'Exercise',
  duration: '10:12',
  thumbTint: '#EEF0FF',
}

export const nextCheckup = {
  date: '2025-05-12',
  time: '10:30 AM',
  hospital: 'City Women Hospital',
}

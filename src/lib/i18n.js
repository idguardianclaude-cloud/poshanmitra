// Hardcoded UI strings for the three supported languages. These are for app
// chrome (footer, nav labels, common actions) — NOT for the emergency screen,
// whose text lives hardcoded in EmergencyScreen.jsx and is never runtime-translated.

export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी Hindi' },
  { code: 'mr', label: 'मराठी Marathi' },
]

// Persistent disclaimer footer — SAFETY.md §7. Hardcoded per language.
export const DISCLAIMER = {
  en: 'PoshanMitra provides general health information, not medical advice. Always consult your doctor. In an emergency, call 108.',
  hi: 'पोषणमित्र सामान्य स्वास्थ्य जानकारी देता है, चिकित्सकीय सलाह नहीं। हमेशा अपने डॉक्टर से सलाह लें। आपात स्थिति में 108 पर कॉल करें।',
  mr: 'पोषणमित्र सामान्य आरोग्य माहिती देते, वैद्यकीय सल्ला नाही. नेहमी आपल्या डॉक्टरांचा सल्ला घ्या. आणीबाणीत 108 वर कॉल करा.',
}

export function t(dict, lang) {
  return dict[lang] || dict.en
}

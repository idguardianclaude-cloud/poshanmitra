// =============================================================================
// redflags.js — SAFETY CRITICAL. Read SAFETY.md before touching this file.
//
// WHY THIS EXISTS
// A fluent, calm, well-written answer to "I'm bleeding at 28 weeks" could kill
// someone. So every user message is screened HERE, before Gemini is ever called.
// If it matches an obstetric danger sign, the message never reaches the model —
// she gets the fixed EmergencyScreen instead. Two independent layers guard the
// chat (this one, and a re-check of Gemini's own `urgency` field); when they
// disagree, the SAFE outcome wins.
//
// TUNING DOCTRINE (SAFETY.md §1)
// False positives are acceptable. False negatives are NOT. Someone mentioning
// bleeding gums seeing the emergency screen is the correct trade — the screen
// carries a quiet "this isn't an emergency, continue chatting" escape. So these
// lists are deliberately BROAD: clinical + plain English, Devanagari, and
// (highest value) romanised Hindi/Marathi, because most women type Latin script
// and code-mix constantly. We match ANY language list regardless of the selected
// language.
//
// TWO EXCEPTIONS where we require an intensity/persistence qualifier rather than
// firing on the bare word, because the bare word is an extremely common, benign,
// first-class supported topic and firing on it would break the app for the most
// common early-pregnancy questions:
//   - vomiting / nausea ("ulti") — we have a whole video on managing nausea.
//   - bleeding GUMS while brushing — explicitly a "must answer normally" case in
//     SAFETY.md §8, even though bleeding in general must always fire.
// Both are handled below; everything else leans broad.
// =============================================================================

// Normalise: lowercase, strip ASCII punctuation (keep Devanagari + letters),
// collapse whitespace. Devanagari characters are untouched.
function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFC')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’“”\[\]|<>@+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchesAny(normText, patterns) {
  return patterns.some((p) =>
    p instanceof RegExp ? p.test(normText) : normText.includes(p)
  )
}

// Each sign: `patterns` are suppressible by `exclude` (used for bleeding gums);
// `strong` patterns always fire and are never suppressed. Signs without
// `exclude` treat all patterns as always-firing.
export const RED_FLAGS = [
  {
    id: 'bleeding',
    label: 'Vaginal bleeding',
    // Weak generic terms — suppressed only when clearly about gums/teeth/nose.
    patterns: ['bleed', 'bleeding', 'blood', 'bloody', 'खून', 'रक्त', 'blooding'],
    // Strong terms — always fire even alongside a gum reference.
    strong: [
      'vaginal bleeding',
      'bleeding from',
      'spotting',
      'blood clot',
      'clots',
      'hemorrhage',
      'haemorrhage',
      'रक्तस्त्राव',
      'रक्तस्राव',
      'रक्तस्त्राव होतोय',
      'ब्लीडिंग',
      'खून बह',
      'खून आ',
      'खून निकल',
      'रक्त बह',
      /khoon|khun|rakt/,
      /(khoon|khun|rakt|blood|bleeding)\s*(aa|nikal|beh|bah|gir|ho|raha|rahi|rahe)/,
      /bleeding\s*(ho|start|shuru)/,
    ],
    // If ONLY the weak terms hit and the message is about gums/teeth/nose, skip.
    exclude: [
      'gum',
      'gums',
      'brush',
      'brushing',
      'teeth',
      'tooth',
      'gingiv',
      'nosebleed',
      'nose bleed',
      'मसूड़',
      'मसूड़ों',
      'दांत',
      'दात',
      'हिरड्या',
      'हिरड्यां',
    ],
  },
  {
    id: 'headache',
    label: 'Severe or persistent headache',
    patterns: [
      'headache',
      'head ache',
      'head pain',
      'migraine',
      'सिरदर्द',
      'सर दर्द',
      'सिर दर्द',
      'सिर में दर्द',
      'सिर फट',
      'डोकेदुखी',
      'डोकं दुखत',
      'डोके दुखत',
      'डोकं खूप दुखत',
      /sir\s*(me|mein|ma)?\s*dard/,
      /sar\s*dard/,
      /sir\s*dukh/,
      'sirdard',
    ],
  },
  {
    id: 'vision',
    label: 'Blurred vision or seeing spots',
    patterns: [
      'blurred vision',
      'blurry vision',
      'blur vision',
      'vision blurry',
      'vision is blurry',
      'seeing spots',
      'spots in front',
      'double vision',
      "can't see clearly",
      'cant see clearly',
      'cannot see clearly',
      'dhundhla',
      'dhundla',
      'धुंधला',
      'धुंधलापन',
      'साफ नहीं दिख',
      'आँखों के आगे अंधेरा',
      'आंखों के आगे अंधेरा',
      'अंधुक दिसत',
      'डोळ्यासमोर अंधार',
      'स्पष्ट दिसत नाही',
      'andhera',
      'aankhon ke aage',
      /aankh(o|on|ho)?.*dhundhl/,
      /(aankh|aankho|aakh|nazar).*(andher|dhundhl|kam)/,
      /andher(a|i)\s*(aa|chha|sa)/,
      /(saaf|saf)\s*nahi\s*dikh/,
    ],
  },
  {
    id: 'convulsions',
    label: 'Convulsions or fits',
    patterns: [
      'convulsion',
      'convulsions',
      'seizure',
      'seizures',
      'fits',
      'fitting',
      'having a fit',
      'jerking',
      'झटके',
      'झटका',
      'दौरा',
      'दौरे',
      'मिर्गी',
      'ऐंठन',
      'फेफरे',
      'आकडी',
      /jhatk(e|a)/,
      /daur(a|e)\s*(aa|pad)/,
      'mirgi',
    ],
  },
  {
    id: 'fetal_movement',
    label: 'Reduced or absent fetal movement',
    patterns: [
      'not moving',
      'baby not moving',
      'baby is not moving',
      'not kicking',
      'baby not kicking',
      'no movement',
      'no kicks',
      'reduced movement',
      'less movement',
      'movement reduced',
      'stopped moving',
      'baby stopped',
      "hasn't moved",
      'hasnt moved',
      'not felt the baby',
      'बच्चा हिल नहीं',
      'बच्चा नहीं हिल',
      'हलचल नहीं',
      'हलचल कम',
      'हिलना बंद',
      'किक नहीं',
      'बाळ हलत नाही',
      'हालचाल कमी',
      'हालचाल नाही',
      'बाळ हालत नाही',
      /bach(a|cha)\s*(hil|kick|move|halche).*(nahi|band|kam)/,
      /hil\s*nahi\s*raha/,
    ],
  },
  {
    id: 'leaking_fluid',
    label: 'Leaking fluid from the vagina',
    patterns: [
      'water broke',
      'water broken',
      'my water broke',
      'water is leaking',
      'water leaking',
      'leaking water',
      'leaking fluid',
      'fluid leaking',
      'leaking',
      'watery discharge',
      'gush of fluid',
      'amniotic fluid',
      'पानी निकल',
      'पानी जा रहा',
      'पानी लीक',
      'पानी बह',
      'पानी टूट',
      'पाणी गळत',
      'पाणी वाहत',
      'पाणी फुट',
      /paani|pani/,
    ],
    // "pani/paani" alone is broad; keep it — leaking fluid is high-stakes and the
    // false positive (someone talking about drinking water) is acceptable.
  },
  {
    id: 'fever',
    label: 'High fever',
    patterns: [
      'high fever',
      'fever',
      'high temperature',
      'running a temperature',
      'burning up',
      'बुखार',
      'तेज बुखार',
      'ज्वर',
      'ताप',
      'खूप ताप',
      'तीव्र ताप',
      /bukh?ar/,
      /tez\s*(bukh?ar|taap)/,
    ],
  },
  {
    id: 'abdominal_pain',
    label: 'Severe abdominal pain',
    patterns: [
      'abdominal pain',
      'stomach pain',
      'belly pain',
      'pain in stomach',
      'pain in abdomen',
      'lower abdomen pain',
      'severe cramps',
      'severe cramping',
      'sharp pain',
      'unbearable pain',
      'पेट में दर्द',
      'पेट दर्द',
      'पेट में तेज',
      'पेट में मरोड़',
      'पोटात दुखत',
      'पोटदुखी',
      'पोटात तीव्र',
      'पोटात कळ',
      // Code-mixed: "pet me bahut tez dard ho raha hai" — allow words between.
      /pet\s*(me|mein|ma|mai)?.*(dard|dukh|marod|ainthan|kal)/,
      /(dard|dukh).*pet/,
      /पेट.*(दर्द|दुख|मरोड)/,
      /पोट.*(दुख|वेदना|कळ|दर्द)/,
    ],
  },
  {
    id: 'swelling',
    label: 'Severe or sudden swelling of face and hands',
    patterns: [
      'sudden swelling',
      'severe swelling',
      'swelling in face',
      'swollen face',
      'face swelling',
      'swollen hands',
      'hands swollen',
      'puffy face',
      'अचानक सूजन',
      'चेहरे पर सूजन',
      'हाथों में सूजन',
      'मुंह सूज',
      'चेहऱ्यावर सूज',
      'हातांना सूज',
      'अचानक सूज',
      /suj(an|aan)/,
      /(chehra|muh|haath).*suj/,
    ],
  },
  {
    id: 'breathing',
    label: 'Difficulty breathing',
    patterns: [
      'difficulty breathing',
      "can't breathe",
      'cant breathe',
      'cannot breathe',
      'hard to breathe',
      'trouble breathing',
      'shortness of breath',
      'short of breath',
      'breathless',
      'gasping',
      'breathing problem',
      'सांस नहीं आ',
      'सांस लेने में',
      'सांस फूल',
      'दम घुट',
      'सांस की तकलीफ',
      'श्वास घेता येत नाही',
      'दम लागत',
      'धाप लागत',
      /saans.*(nahi|takleef|phool|ruk|band)/,
      /dam\s*ghut/,
    ],
  },
  {
    id: 'vomiting',
    label: 'Persistent vomiting, unable to keep anything down',
    // Qualifier REQUIRED — plain "ulti"/"vomiting" is common, benign morning
    // sickness and a first-class supported topic. Only persistence fires.
    patterns: [
      'persistent vomiting',
      'keep vomiting',
      'keep throwing up',
      'vomiting everything',
      'throwing up everything',
      "can't keep anything down",
      'cant keep anything down',
      "can't keep food down",
      'cannot keep food down',
      'vomiting a lot',
      'severe vomiting',
      'बार बार उल्टी',
      'लगातार उल्टी',
      'उल्टी नहीं रुक',
      'बार-बार उल्टी',
      'सारखी उलटी',
      'उलटी थांबत नाही',
      'वारंवार उलटी',
      /(baar\s*baar|lagat?ar|bahut)\s*ulti/,
      /ulti\s*(nahi|band\s*nahi)\s*ruk/,
      /kuch\s*(nahi|bhi\s*nahi)\s*ruk/,
    ],
  },
  {
    id: 'fainting',
    label: 'Fainting or loss of consciousness',
    patterns: [
      'fainted',
      'fainting',
      'feel faint',
      'about to faint',
      'passed out',
      'lost consciousness',
      'unconscious',
      'blacked out',
      'collapsed',
      'बेहोश',
      'बेहोशी',
      'अचेत',
      'चक्कर आ',
      'चक्कर आया',
      'गिर गई',
      'बेशुद्ध',
      'चक्कर येत',
      'गरगरत',
      /behosh/,
      /chakkar\s*(aa|aaya|aata)/,
      /gir\s*(gay|pad)/,
    ],
  },
]

// Screen a message. Returns { matched, id, label } — first sign that fires.
// Logs the matched sign id (NEVER the message text) so the layer can be tuned.
export function checkRedFlags(text) {
  const norm = normalize(text)
  if (!norm) return { matched: false, id: null, label: null }

  for (const flag of RED_FLAGS) {
    const excluded = flag.exclude ? matchesAny(norm, flag.exclude) : false

    // Strong patterns always fire.
    if (flag.strong && matchesAny(norm, flag.strong)) {
      logHit(flag.id)
      return { matched: true, id: flag.id, label: flag.label }
    }
    // Weak/normal patterns fire unless suppressed by an exclude context.
    if (!excluded && matchesAny(norm, flag.patterns)) {
      logHit(flag.id)
      return { matched: true, id: flag.id, label: flag.label }
    }
  }
  return { matched: false, id: null, label: null }
}

function logHit(id) {
  // Tuning aid only. Never send anywhere. Never log the message text.
  try {
    // eslint-disable-next-line no-console
    console.warn(`[redflag] matched sign: ${id}`)
  } catch {
    /* no-op */
  }
}

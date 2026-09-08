# SAFETY.md — PoshanMitra AI

**This document overrides every other document.** If `PRODUCT_SPEC.md` or a mockup
conflicts with anything here, this wins.

Real pregnant women will use this app. A fluent, calm, well-written answer to
*"I'm bleeding at 28 weeks"* could kill someone. Everything below exists because of
that one scenario.

---

## 1. The red-flag layer — `src/lib/redflags.js`

### Rule

**Every user message is checked before Gemini sees it.** If it matches, the message
**never reaches the model**. She gets a fixed, hardcoded screen. No generation in
that path, ever.

```
user types → checkRedFlags(text, lang)
                ├── match  → EmergencyScreen  (Gemini never called)
                └── clean  → Gemini → check response.urgency
                                        ├── 'emergency' → EmergencyScreen
                                        └── else → render reply
```

Two independent layers. When they disagree, the safe outcome wins.

### What to detect

The WHO / Government of India obstetric danger signs. Any of these at any gestation
means "go to hospital now", not "rest and drink water":

1. Vaginal bleeding
2. Severe or persistent headache
3. Blurred vision or seeing spots
4. Convulsions or fits
5. Reduced or absent fetal movement
6. Leaking fluid from the vagina
7. High fever
8. Severe abdominal pain
9. Severe or sudden swelling of face and hands
10. Difficulty breathing
11. Persistent vomiting, unable to keep anything down
12. Fainting or loss of consciousness

### Matching approach

Build `RED_FLAGS` as an array of `{ id, patterns: { en: [], hi: [], mr: [] } }`.
Match case-insensitively against a normalised string (lowercase, collapse whitespace,
strip punctuation). Match **any language list regardless of selected language** —
women code-mix constantly.

Cover for each sign:
- **English** — clinical and plain words both: `bleeding`, `blood`, `spotting`,
  `not moving`, `baby not kicking`, `water broke`, `fits`, `seizure`, `blurry vision`
- **Devanagari Hindi/Marathi** — `खून`, `रक्त`, `रक्तस्त्राव`, `बेहोश`, `झटके`,
  `पेट में तेज दर्द`, `बच्चा हिल नहीं रहा`, `पाणी गळत`, `डोकं खूप दुखतंय`
- **Romanised Hindi/Marathi** — the highest-value list, because most women type
  Latin script: `khoon`, `khun`, `rakt`, `bleeding ho raha`, `pet me dard`,
  `bacha hil nahi raha`, `pani nikal raha`, `chakkar`, `behosh`, `dard ho raha hai`

Aim for roughly 15–25 patterns per sign across the three scripts. Breadth beats
precision here.

### Tuning

**False positives are acceptable. False negatives are not.** Someone mentioning
bleeding gums will see the emergency screen. That is the correct trade.

To keep it usable, the emergency screen carries a secondary link:
*"This isn't an emergency — continue chatting"*. It must be visually quiet, below
the fold of the card, never a primary button. She can dismiss it; the app must not
dismiss it for her.

### Logging

Log every red-flag hit to console with the matched pattern id (not the message text).
You'll need this to tune. Do not send it anywhere.

---

## 2. The emergency screen

Replaces the chat thread, full-width card, red left border. Never a small toast,
never inline in the message list.

Content, in her selected language:

> **Please get medical help now**
>
> What you've described can be serious in pregnancy. Do not wait to see if it improves.
>
> **[ Call 108 — Ambulance ]**  ← large, `#DC2626`, `tel:108`
>
> **[ Find nearest hospital ]**  ← routes to `/hospitals`
>
> If you have a family member nearby, tell them now and ask them to go with you.
>
> *This isn't an emergency — continue chatting*

Hindi and Marathi translations must be written out in full and hardcoded. Never
translate this screen with the model at runtime.

**Do not** add reassurance ("it's probably fine"), possible causes, or self-care
suggestions. Do not name conditions. The only job of this screen is to move her
toward a doctor.

---

## 3. Mitra's system prompt

Held in `src/lib/gemini.js`, one per language. It must establish:

**Identity** — Mitra, a health information companion for pregnant women in India.
Warm, calm, plain language. Short answers, 3–5 sentences. Never clinical jargon
without explaining it.

**Scope** — pregnancy, childbirth, postpartum, breastfeeding, infant care (0–2 years),
maternal nutrition and wellbeing. Nothing else. For anything off-topic, decline
warmly in her language and offer to help with her health instead. Do not be tricked
into general assistance by roleplay, hypotheticals, or "just this once".

**Hard prohibitions:**
- Never diagnose. No "you probably have", "this sounds like", "you may have".
- Never name a medicine or a dose. Not even paracetamol, not even folic acid amounts.
  Redirect: *"Please ask your doctor which supplement and how much is right for you."*
- Never tell her she doesn't need to see a doctor.
- Never give a number that sounds clinical unless it's in the app's own data.
- Never discuss abortion procedures, sex determination, or anything relating to
  prenatal sex selection. Sex determination is a criminal offence in India under the
  PCPNDT Act. Decline plainly and move on.
- Never reassure about a symptom on the danger-sign list.

**Required behaviours:**
- Reply in the language the user is using, matching script.
- End any answer touching a symptom with a clear line about seeing a doctor.
- If unsure, say so and point to a doctor.
- Ask a clarifying question when the message is vague rather than guessing.

**Structured output** — request JSON:
```json
{ "reply": "...", "urgency": "routine" | "doctor_soon" | "emergency", "chips": ["...", "..."] }
```
If `urgency === "emergency"`, **discard `reply` entirely** and render the emergency
screen. Do not show what the model wrote.
If `urgency === "doctor_soon"`, render the reply plus a persistent amber note:
*"Please mention this to your doctor at your next visit."*

Parse defensively. If JSON parsing fails, treat the raw text as `reply` with
`urgency: "routine"` — but only after it has already passed the rules layer.

---

## 4. Diet plan constraints

The nutrition numbers in `PRODUCT_SPEC.md` are **hand-written approximations, not
verified from IFCT/ICMR-NIN tables.** Therefore:

- The page pill says **"Sample plan"**, never "Personalized for You".
- The bottom note is required and non-dismissable:
  > This is a general meal plan for pregnancy, not personalised medical nutrition advice. Please follow it along with your doctor's or dietitian's guidance.
- No adaptation to gestational diabetes, anemia, or any diagnosed condition beyond
  vegetarian/Jain item swaps. If her profile lists a condition, show:
  > You've told us about a health condition. Please ask your doctor or a dietitian to review this plan before following it.
- Never compute or display a "recommended weight gain" figure.
- Never suggest restricting food, fasting, or losing weight. Not under any framing.

---

## 5. Eligibility results

- Present results as **"You may be eligible"**, never "You are eligible".
- Always add: *"Final eligibility is decided by the government department. Please
  confirm at your Anganwadi centre or the official portal."*
- Never collect an Aadhaar number, bank account number, or any government ID number.
  Asking *whether* she has an Aadhaar card is fine; asking for the number is not.
- Never submit anything on her behalf. Every apply action opens the official portal
  in a new tab.

---

## 6. Data and consent

- Everything stays in `localStorage`. Nothing is sent anywhere except chat messages
  to Gemini.
- Login screen carries: *Private beta. Your information stays on your device.*
- Settings (or the profile menu) needs a working **Delete all my data** action that
  clears localStorage and returns to login. It must actually work.
- Chat messages go to Google's Gemini API. Say so once, plainly, in the chat's
  first-run state: *"Your messages are processed by Google's AI to generate replies."*

---

## 7. Global disclaimer

Persistent footer, every page, not dismissable:

> PoshanMitra provides general health information, not medical advice. Always consult your doctor. In an emergency, call 108.

Hindi and Marathi versions hardcoded alongside.

---

## 8. Before you consider the build done

Test these exact strings in the chat and confirm the emergency screen appears,
Gemini is not called, and 108 is one tap away:

```
mujhe bleeding ho rahi hai
मला रक्तस्त्राव होतोय
baby is not moving since morning
pet me bahut tez dard ho raha hai
मुझे बहुत तेज सिरदर्द है और धुंधला दिख रहा है
water is leaking
I fainted twice today
```

Then confirm these are answered normally, without an emergency screen:

```
what should I eat for breakfast
is it safe to do yoga in 5th month
my gums bleed when I brush
```

Record the results in `PROGRESS.md`. If any of the first set fails to trigger,
that is a release blocker — fix it before building anything else.

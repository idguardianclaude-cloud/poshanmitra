# PRODUCT_SPEC.md — PoshanMitra AI

Every screen, every field. Content below is taken from approved mockups — use it
verbatim unless it conflicts with `SAFETY.md`.

---

## Global shell

Three regions on every page after login: **sidebar (260px)** · **main** · **right rail (340px)**.
Background `#F7F8FC`. Main content max-width ~1180px.

### Sidebar
Logo mark + wordmark **PoshanMitra AI**, sub-line *Swasth Maa, Swasth Shishu, Swasth Bharat*.

Nav items, in order, each with a lucide icon:

| Label | Icon | Route | Note |
|---|---|---|---|
| Dashboard | Home | `/` | |
| AI Chatbot | MessageSquare | `/chat` | |
| Weekly Check-up | CalendarCheck | `/checkup` | "New" pill, **stub page** |
| Diet Plan | Salad | `/diet` | |
| Videos | PlaySquare | `/videos` | |
| Schemes | Landmark | `/schemes` | |
| Campaigns | Megaphone | `/campaigns` | **stub page** |
| Nearby Hospitals | Building2 | `/hospitals` | |
| Reports | BarChart3 | `/reports` | **stub page** |

Active item: pill `bg-indigo-50`, indigo text, medium weight.
Stub pages render a centered illustration + "Coming soon in the next update."

Sidebar footer card — soft lavender, illustration of a seated pregnant woman,
text *"You are not alone, we are with you"* with a small heart.

### Header
Hamburger (collapses sidebar) · search input "Search anything…" with `Ctrl + K` hint ·
language dropdown (globe icon) with **English / हिंदी Hindi / मराठी Marathi**, checkmark on
active · bell with unread count badge · avatar with **Priya Sharma** / *Pregnant Woman*
and a chevron opening a menu: Profile, Settings, Notifications (3), Language ▸, Help & Support, Logout.

### Disclaimer footer
Persistent, small, muted, on every page:
> PoshanMitra provides general health information, not medical advice. Always consult your doctor. In an emergency, call 108.

---

## 1. Login `/login`

Not real auth. Split layout: left illustration panel in indigo gradient with the
tagline; right a simple card — phone number input (+91 prefix), "Continue" button.
Any 10 digits works. Sets a flag in localStorage and routes to `/onboarding` if no
profile exists, else `/`.

Add small text: *Private beta. Your information stays on your device.*

---

## 2. Onboarding `/onboarding`

**The most important flow.** A chat, not a form — Mitra asks five questions one at a
time, each answer saved immediately, then unlocks the app.

Reuse the chat bubble styling from the Chatbot page. Mitra's avatar on the left,
user answers on the right in indigo bubbles.

Questions, in order:

1. **Name** — free text. *"Hello! I'm Mitra 👋 I'll ask you a few quick questions so I can help you better. What should I call you?"*
2. **Due date or last period** — two chips: "I know my due date" / "I know my last period date", then a date input. Compute weeks + trimester from it.
3. **Age** — number input, chips for 20–25 / 26–30 / 31–35 / Other.
4. **Food preference** — chips: Vegetarian / Non-vegetarian / Eggetarian / Jain.
5. **Any diagnosed condition** — multi-select chips: Anemia / Gestational diabetes / High BP / Thyroid / None / I don't know.

Rules:
- Every question has a **"I don't know"** and **"Skip"** option. Skipping stores `null`.
- Never block progress on a skip.
- After Q5: *"Perfect ✅ Your PoshanMitra is ready."* → route to `/`.
- Save after every single answer. If she closes the tab, resume where she left off.
- Show a small progress indicator "2 of 5".

Derived fields written to profile: `weeks`, `trimester`, `month`, `dueDate`, `poshanScore` (start at 72).

---

## 3. Dashboard `/`

Greeting: *Good Morning, Priya!* 👋 (time-aware: Morning / Afternoon / Evening),
sub-line *You are doing great! Let's continue your healthy journey.*

**Four stat cards**, each with a soft-tinted circular icon:

| Card | Value | Sub |
|---|---|---|
| Pregnancy Month | **5th Month** | 2nd Trimester · progress bar · 18 Weeks + 3 Days |
| Poshan Score | **78**/100 | Good ↑ · Keep following your plan |
| Today's Tasks | **3**/5 | Completed · 2 tasks remaining |
| Next Checkup | **12 May 2025** | 10:30 AM · City Women Hospital |

All computed from profile where possible, mock where not.

**Today's Plan** card — vertical timeline, 6 rows, green check or hollow circle:
Morning Exercise 7:00 AM ✓ Completed · Morning Diet 8:30 AM ✓ Completed ·
Afternoon Exercise 4:00 PM Pending · Afternoon Diet 1:30 PM Pending ·
Evening Exercise 6:00 PM Pending · Evening Diet 8:00 PM Pending.
Rows are clickable and toggle complete. "View All" link.

**AI Chatbot** card — Mitra avatar, *"Hello Priya! 👋 I'm your AI PoshanMitra.
How can I help you today?"*, six chips (Diet Recommendation, Health Advice,
Symptoms Check, Exercise Guidance, Baby Development, Ask Anything) — each routes to
`/chat` with that as the opening message — and a solid **Chat Now** button.

**Quick Access** — 3×2 grid of soft-tinted tiles: Diet Plan (green), Videos (pink),
Schemes (amber), Campaigns (purple), Hospitals (blue), Reports (teal).

**Recent Videos** — one thumbnail, "Yoga for Healthy Pregnancy", Exercise tag, Watch Now.

**Health Tip for You** — soft green card, water-glass illustration:
*Drink plenty of water and stay hydrated. It helps in maintaining amniotic fluid and supports your baby's development.* Rotate daily from an array of 10 tips.

---

## 4. AI Chatbot `/chat` — **the only real feature**

Header: **AI Chatbot** + "Your Health Companion" pill, sub-line
*Hi Priya! 👋 I'm here to support you and your baby's health journey.*
Top-right: **Clear Chat**.

Message list: Mitra messages left with avatar, white bubble, timestamp, and a
**speaker icon** that speaks that message aloud. User messages right, indigo-tinted
bubble, timestamp with double-tick.

Below the last Mitra message: up to 3 **quick reply chips** when relevant.

Input row above the composer: **Voice Input** (mic) · **Upload Image** (disabled,
tooltip "Coming soon") · **My Health Summary** (injects her profile as context).

Composer: text input + send button + speaker toggle (auto-speak replies on/off).
Helper text: *You can ask anything about pregnancy, diet, exercise, baby care and more…*

**Right rail:**
- *My Health Summary* — Pregnancy Month 5th (2nd Trimester) · Poshan Score 78/100 Good ↑ · Last Check-up 5 Days Ago, Next: 12 May 2025
- *Chat Topics* — Diet & Nutrition, Exercise & Yoga, Symptoms & Solutions, Baby Development, Supplements, Emotional Well-being. Clicking sends that topic.
- *Voice Assistant* — big mic button with waveform, language segmented control English / हिंदी / मराठी.

**Behaviour — see SAFETY.md, it overrides anything here.**
- Every user message goes through `checkRedFlags()` **before** Gemini.
- Language follows the header selector; Gemini replies in that language.
- Mitra answers only pregnancy / infant / maternal health. Otherwise:
  *"I can only help with pregnancy and baby care. Is there anything about your health or your baby I can help with?"* — in her language.
- Stream the reply if simple; otherwise show a three-dot typing indicator.
- Persist the thread in localStorage.

---

## 5. Diet Plan `/diet`

Title **Diet Plan** with a **"Sample plan"** pill (NOT "Personalized for You" — see
SAFETY.md). Sub-line *A balanced diet is essential for your health and your baby's growth.*
Button: **Download Diet Plan** (triggers `window.print()`).

**Four summary cards:** Calorie Target 2100 kcal/day · Protein 75 g/day ·
Water Intake 2.5 L/day · Meals 5 per day.

**Day tabs:** Mon 12 May … Sun 18 May, current day active.

**Five meal cards**, each: food photo, meal name + icon, time window,
bulleted item list, a **Nutrients** panel (kcal / Protein / Carbs / Fats), and a **Tip** panel.

| Meal | Time | Items | Nutrients | Tip |
|---|---|---|---|---|
| Breakfast | 7:30–8:30 AM | Vegetable Upma · Boiled Egg (1) · Banana (1 medium) · Milk (1 glass) | 450 kcal · P 18g · C 60g · F 12g | A healthy breakfast gives you energy for the whole day. |
| Mid-morning Snack | 10:30 AM | Sprouts Chaat · Almonds (5) · Coconut Water (1 glass) | 200 kcal · P 8g · C 22g · F 8g | Sprouts are rich in protein and fiber. |
| Lunch | 1:00–2:00 PM | 2 Phulka · Moong Dal · Mixed Vegetable Sabzi · Brown Rice (1 cup) · Curd (1 bowl) · Salad | 600 kcal · P 22g · C 85g · F 15g | Include protein, fiber and calcium in your lunch. |
| Evening Snack | 4:30–5:00 PM | Roasted Chana (1 small bowl) · Buttermilk (1 glass) · Apple (1 small) | 250 kcal · P 10g · C 30g · F 5g | Light and healthy snack keeps your energy steady. |
| Dinner | 7:30–8:30 PM | Vegetable Soup · 2 Phulka · Paneer Bhurji · Steamed Vegetables | 500 kcal · P 20g · C 30g · F 14g | Keep dinner light and easy to digest. |

If profile says vegetarian, swap the boiled egg for paneer cubes. If Jain, remove
onion/garlic items and root vegetables. Keep it simple — one swap map, not a rules engine.

**Right rail:** nutrition donut (78/100, Good 60% / Protein 20% / Carbs 15% / Fats 5%) ·
Diet Highlights (Rich in Protein, Good Calcium, Hydration, Fiber Intake — each with a
green check) · Quick Actions (Swap Food, Grocery List, Recipes, Ask AI) ·
Next Review 19 May 2025 (Monday).

**Bottom note, required:**
> This is a general meal plan for pregnancy, not personalised medical nutrition advice. Please follow it along with your doctor's or dietitian's guidance.

---

## 6. Schemes `/schemes`

Sub-line *Explore government schemes that support your health and your baby's well-being.*
Search · Category filter · Benefit Type filter · Sort by.

Category tabs with counts: **All Schemes 12** · For Pregnant Women 6 · For Children 4 ·
For Nutrition 5 · Financial Support 3.

Scheme rows — emblem, name, description, tags, a **Benefits** panel with 3 bullets,
and **View Details**:

1. **Pradhan Mantri Matru Vandana Yojana (PMMVY)** — *Popular*. Financial support for pregnant women and lactating mothers for better nutrition. Benefits: ₹5,000 in three installments · Improves maternal nutrition · Supports healthy pregnancy. Tags: For Pregnant Women, Financial Support. Portal: `https://pmmvy.wcd.gov.in`
2. **POSHAN Abhiyaan** — National nutrition mission to improve nutritional outcomes for mothers and children. Benefits: Better nutrition awareness · Community support · Focus on healthy eating.
3. **Janani Suraksha Yojana (JSY)** — Promotes institutional delivery among pregnant women. Benefits: Cash assistance for delivery · Safe delivery in hospitals · Reduced maternal mortality.
4. **PM POSHAN Shakti Nirman** — Improves nutritional support to pregnant women and children. Benefits: Take-home ration support · Nutrition & health education · Improves child growth.
5. **Ayushman Bharat – PMJAY** — Health insurance coverage for hospitalization expenses. Benefits: Up to ₹5 lakh health cover · Cashless treatment · Covers pre & post natal care.

Add 7 more (Mission Indradhanush, Janani Shishu Suraksha Karyakram, ICDS, Sukanya
Samriddhi, Matru Vandana state top-ups, LaQshya, SUMAN) with brief detail.

Footnote: *Benefits may vary depending on scheme guidelines and eligibility.*

**Right rail:** Check Your Eligibility card with CTA to `/schemes/eligibility` ·
Top Schemes 1–3 · Helpful Resources (How to Apply, Required Documents, Helpline
Numbers, Download Forms) · Need Help chat card.

### Scheme detail (modal or page)
Full description · eligibility criteria as a checklist · **required documents** list ·
where to apply (nearest Anganwadi / ASHA / online portal) · an **Apply on Official
Portal** button that opens the government site in a new tab.

**Never submit an application on her behalf. Never collect Aadhaar numbers.**

---

## 7. Eligibility wizard `/schemes/eligibility`

Back link to Schemes. Title **Check Your Eligibility**, sub-line
*Answer a few questions to see which schemes you are eligible for.*

Four numbered steps: **1 Basic Information · 2 Family & Income Details ·
3 Pregnancy Details · 4 Review & Results**. Completed steps get a check.

**Step 1 — Basic Information:** Full Name · Age (years) · State (dropdown) ·
District (dropdown) · City/Village · Mobile Number (+91) · Email (optional) ·
Are you an Indian Citizen? Yes/No · Do you have Aadhaar Card? Yes/No.
Prefill from profile. Green tick on valid fields. **Save & Continue →**

**Step 2 — Family & Income Details:** Annual household income (bracket dropdown:
Below ₹1 lakh / ₹1–2.5 L / ₹2.5–5 L / ₹5–8 L / Above ₹8 L) · Ration card type
(APL / BPL / Antyodaya / None) · Category (General / OBC / SC / ST) ·
Is anyone in your family a government employee? Yes/No · Do you have a bank account
linked to Aadhaar? Yes/No.

**Step 3 — Pregnancy Details:** Which pregnancy is this? (First / Second / Third or more) ·
Current month · Are you registered at an Anganwadi centre? Yes/No/Don't know ·
Planning a hospital delivery? Yes/No/Not decided · Do you have a MCP card? Yes/No.

**Step 4 — Review & Results:** summary of answers with edit links, then eligibility
run through `lib/eligibility.js`. Each scheme shows **Eligible** (green) /
**Not eligible** (grey, with the reason) / **Need more info** (amber), the benefit
amount, required documents, and an **Apply on Official Portal** button.

Rules to encode (simplified, documented in code comments):
- **PMMVY** — first live birth, age ≥ 19, not a regular govt employee.
- **JSY** — BPL or SC/ST, institutional delivery planned. Cash amount varies by state and rural/urban.
- **PMJAY** — based on SECC deprivation criteria; treat as "Need more info" unless Antyodaya/BPL.
- **POSHAN Abhiyaan / PM POSHAN** — universal for pregnant & lactating women, no income test.

Right rail: *How It Works* 1-2-3 · *Why Your Information Matters* (privacy note) ·
Need Help chat card.

**Store all wizard answers locally only. Say so on the screen.**

---

## 8. Nearby Hospitals `/hospitals`

Sub-line *Find hospitals and healthcare centers near you.*
Location input prefilled "Pune, Maharashtra, India" + **Use Current Location**.

Four stat chips: 25+ Hospitals Found · 5 km Search Radius · 24x7 Emergency Care ·
Cashless Facilities Available.

**Map:** static image placeholder with numbered pins. Do not integrate Google Maps
tonight — a styled placeholder with pins is fine and saves an hour.

**List**, sorted by distance, each row: index badge, photo, name, **Verified** pill,
address, distance, tags (Multi Speciality / 24x7 Emergency / Cashless), and
**Directions** + **Call** buttons.

1. Sahyadri Super Speciality Hospital — Nagar Road, Wadgaon Sheri, Pune 411014 — 1.2 km
2. Columbia Asia Hospital – Pune — Kharadi Bypass Road, Kharadi, Pune 411014 — 2.8 km
3. Ruby Hall Clinic, Wanowrie — 40, Sassoon Rd, Wanowrie, Pune 411040 — 3.6 km
4. Jehangir Hospital — 32, Sassoon Rd, Pune 411001 — 4.1 km
5. Add 6 more real Pune hospitals with maternity units.

Mark which have a **labour ward** and which accept **PMJAY cashless** — that's the
information that actually matters to her.

**Directions** → opens `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`.
**Call** → `tel:` link.

**Filter rail:** Search Hospital Name · Speciality dropdown · Facilities checkboxes
(24x7 Emergency ✓, ICU Available, Cashless ✓, Laboratory, Pharmacy, Ambulance ✓) ·
Distance dropdown (Within 10 km) · **Apply Filters** button. Filters must actually work.

**Emergency card:** amber, ambulance illustration, *Need Emergency Help? Get immediate
assistance for you and your baby.* → red **Call 108** button, `tel:108`.
(The mockup says "Emergency Call" — change it to **Call 108**, per SAFETY.md.)

Healthcare Tips card below.

---

## 9. Videos `/videos`

Sub-line *Trusted videos to guide you through pregnancy, nutrition and baby care.*
Search · All Categories dropdown · Sort dropdown (Latest / Most Popular / Most Viewed /
Highest Rated / Shortest / Longest / A–Z / Z–A).

Hero banner, indigo gradient: *Welcome to PoshanMitra Videos — Learn from experts and
take care of yourself and your baby every day.* + **Watch Popular Videos**.

**Categories** horizontal scroll with counts: Pregnancy Care 42 · Nutrition & Diet 38 ·
Exercise & Yoga 28 · Baby Development 36 · Breastfeeding Guide 24 · Health Tips 31 ·
Mental Wellness 18 · Labor & Delivery 22 · Postpartum Care 17.

**Popular Videos** grid, 4 across, each card: thumbnail with duration pill, title,
views + age, kebab menu.

1. First Trimester Care Tips for a Healthy Pregnancy — 8:45 — 12.5K views · 2 days ago
2. Top 10 Iron Rich Foods for Pregnant Women — 6:32 — 18.3K · 4 days ago
3. Safe Yoga Poses During Pregnancy — 10:12 — 9.8K · 1 week ago
4. Breastfeeding Tips for New Mothers — 7:20 — 15.1K · 1 week ago
5. Calcium Rich Foods for Strong Bones — 5:40 — 7.2K · 1 week ago
6. Activities to Boost Your Baby's Brain — 9:15 — 11.6K · 2 weeks ago
7. How to Manage Nausea in Early Pregnancy — 6:18 — 8.9K · 2 weeks ago
8. What to Pack in Your Hospital Bag — 6:55 — 10.7K · 2 weeks ago

**Load More Videos** button.

**Right rail:** Continue Watching (3 items with progress bars 60% / 40% / 25%) ·
Trending Videos (ranked 1–3) · *New Videos Every Week!* subscribe card.

**Video playback:** clicking opens a modal with a YouTube iframe embed. Use real
YouTube IDs from **credible channels only** — hospital channels, government health
channels, qualified OB-GYNs. If you cannot verify a video's source, use a placeholder
card that says "Video coming soon" rather than embedding something unverified.
Pregnancy misinformation is a real harm; an unverified embed is worse than an empty slot.

---

## 10. Stub pages

`/checkup`, `/campaigns`, `/reports` — shell + illustration + "Coming soon in the next
update" + a link back to Dashboard. Ten minutes total, keeps navigation honest.

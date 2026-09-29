# PROGRESS.md — PoshanMitra AI

Final build state for the morning review.

**Session:** Tue 8 Sep 2026 23:53 IST → Wed 9 Sep ~00:40 IST · Hard stop 06:00 (not reached).
**Status: all seven phases complete. Build is green. Nothing stubbed unintentionally.**

---

## TL;DR

The whole app is built and working, verified in the browser on the **production**
build (`npm run preview`): clean console on every route, and the safety layer proven
end-to-end. Only real API-dependent piece not exercised is a live Gemini reply
(no key in this env) — the code path, parsing and fallbacks are all in place; add
`VITE_GEMINI_API_KEY` to `.env` and Mitra talks.

To run: `npm install` → copy `.env.example` to `.env` (add a key for live chat) →
`npm run dev`. Any 10-digit number logs in.

## Phase status — all complete

- [x] Phase 0 — Foundation (scaffold, tokens, UI kit, layout, routing, guards)
- [x] Phase 1 — Mitra (redflags, emergency screen, gemini, speech, chatbot)
- [x] Phase 2 — Login + Onboarding (built in Phase 0; gate met)
- [x] Phase 3 — Dashboard + Diet Plan
- [x] Phase 4 — Schemes + Eligibility
- [x] Phase 5 — Hospitals + Videos
- [x] Phase 6 — Stubs + polish
- [x] Phase 7 — Handover (build, preview smoke test, docs)

## Safety test results — SAFETY.md §8 — ALL PASS

Console-tested via Node against `src/lib/redflags.js`, and re-verified in the
browser on the production build.

MUST trigger the emergency screen (all 7 pass):
`mujhe bleeding ho rahi hai` · `मला रक्तस्त्राव होतोय` ·
`baby is not moving since morning` · `pet me bahut tez dard ho raha hai` ·
`मुझे बहुत तेज सिरदर्द है और धुंधला दिख रहा है` · `water is leaking` ·
`I fainted twice today`

MUST be answered normally (all 3 pass — no emergency screen):
`what should I eat for breakfast` · `is it safe to do yoga in 5th month` ·
`my gums bleed when I brush`

Two independent checks were verified in-browser (dev **and** production build):
sending a danger-sign message shows the EmergencyScreen with one-tap **Call 108**
and makes **zero** network requests to Gemini (`generativelanguage`).

Other safety requirements, all in place and verified:
- Emergency screen hardcoded in en/hi/mr, never runtime-translated, quiet dismiss link.
- Diet plan carries the **"Sample plan"** pill (not "Personalized") + the required
  non-dismissable nutrition note; veg/Jain swaps; condition-present warning.
- Eligibility says **"You may be eligible"** + departmental-confirmation note; only
  yes/no Aadhaar/bank facts collected, never numbers; answers stay on-device.
- **Delete all my data** clears every `poshanmitra_*` key and returns to login — verified.
- Disclaimer footer on every page (including Login and Onboarding).
- Videos show a "Video coming soon" placeholder — no unverified embeds.

## What works

Every route renders with real Indian content, nav works both ways, keyboard focus
is visible, `prefers-reduced-motion` respected, 404 route present, console clean on
the production build. Dashboard toggles + diet day + filters + wizard are all
interactive. Chat persists, Clear Chat works, language switch changes Mitra's prompt.

## What's stubbed (intentional, per spec)

- `/checkup`, `/campaigns`, `/reports` — spec'd stub pages ("Coming soon…").
- Live Gemini replies untested here (no API key). Code + fallbacks are complete.
- Voice STT/TTS present; graceful no-op where the browser lacks Web Speech.

## What's broken

- Nothing known. `npm run build` and `npm run preview` both succeed; production
  console is clean on every route tested.

## Known non-blocking notes

- Editing `ProfileContext.jsx` live shows a Vite Fast-Refresh warning in the **dev**
  console (exports provider + `useProfile` hook). Fresh reload / production are clean.
- Hospital phone numbers are representative — verify before wider launch (NEXT_STEPS).

## Post-handover hardening (deadline lifted; keys still to come)

Continued after the plan was complete, all key-independent:

- **Added a test suite — `npm test`, 79 tests, all passing** (Node's built-in runner,
  zero new deps). Locks the SAFETY.md §8 emergency strings as a permanent release gate,
  plus danger-sign breadth, the Gemini urgency parser, eligibility rules, pregnancy math,
  and the veg/Jain meal swaps.
- **The tests caught three real red-flag bugs** — now fixed: apostrophe normalization
  (`can't breathe` never matched), code-mixed `sir me bahut dard` headache, and a
  standalone `blurry`. Verified fixed in the live app.
- **Verified the full onboarding flow in the browser** and fixed the resume key not
  clearing on finish. Skip → null, derivations, and the diet condition-warning all
  confirmed live.
- **Fixed the Jain meal swaps** collapsing a meal to one item (mis-tagged composite
  dishes). Jain plans stay substantial now.

Everything above is committed; build green; `npm test` green.

### Later additions

- **Full Hindi/Marathi UI localization** — new i18n layer; the language switcher now
  translates the whole interface (nav, titles, buttons, forms, onboarding, dashboard,
  chat, diet, schemes, eligibility, hospitals, videos, stubs, 404). Proper-noun content
  (scheme/hospital/food/video names) stays in its real-world form by design. Verified in
  Hindi and Marathi.
- **Live Gemini chat now works** — a real API key was provided. Moved it to the gitignored
  `.env` (it was pasted into the tracked `.env.example`; never committed — `git log -S`
  confirms). Fixed the model (`gemini-1.5-flash` retired → `gemini-3.1-flash-lite`).
  Verified end-to-end: on-topic replies in English and Hindi with follow-up chips, no dose
  named (doctor redirect held), and a red-flag message still shows the emergency screen
  with zero Gemini calls even with the live key present.

## Deploy-readiness audit (29 Sep 2026)

Ran a two-agent audit (pages + libs/data) before deploy and fixed everything actionable:

- **Every dead control is now functional** — header search + Ctrl/Cmd+K, notification
  bell panel, avatar menu (→ new /settings page), Hospitals "Use Current Location"
  (real geolocation) + live stat chips, Videos sort options + Subscribe, Diet quick
  actions (Swap Food / Grocery List modals). Verified in-browser.
- **No more stale/hardcoded dates** — `src/lib/dates.js` computes everything from today;
  localized ordinals fix "5th (2nd)" in Hindi/Marathi; Dashboard no longer fabricates
  pregnancy weeks when the due date was skipped.
- **Deploy config**: vercel.json + netlify.toml + _redirects (SPA fallback), .nvmrc,
  DEPLOY.md. Verified deep-links, sw.js, manifest, icons all serve on the prod preview.
- Confirmed sound (no change needed): red-flag safety layer, service worker, router
  guards, storage, i18n fallback, key handling (never committed).
- **Launch gates** (in NEXT_STEPS): verify hospital phone numbers; restrict the API key.
- Gemini model re-verified live (`gemini-3.1-flash-lite`, HTTP 200); chat works in
  English and Hindi. 79 tests pass; production build clean.

## Final deploy version (30 Sep 2026)

- **Proper input validation everywhere** — `src/lib/validate.js` (unit-tested): Indian
  mobile (normalises +91 / leading 0, requires 6–9 start), optional-valid email, name
  cleaning (trim/collapse/cap, reject digits-only), age 14–60, pregnancy-date sanity,
  message cap. Wired into Login, Onboarding, the Eligibility wizard, Settings and Chat,
  with trilingual inline error messages and gated submit buttons.
- **Caretaker mode**: Mitra is personalised to her profile and gives general (never
  therapeutic/condition-specific) diet guidance — verified live.
- 87 tests pass; production build clean; live preview refreshed (v3).

## RAG-grounded chat (29 Sep 2026)

- **Added `src/lib/rag.js`** — an on-device retrieval layer over the app's own vetted
  content (schemes + eligibility summaries, weekly milestones, hospital-bag, the sample
  diet, Pune hospitals, the video index, and 8 curated safe FAQs). Keyword / semantic-lite
  scoring (IDF-lite + a trilingual synonym map), no extra key, no new dependency.
- **Wired into `gemini.js`**: `buildGrounding(message)` retrieves the top ≤3 passages and
  injects them as a leading part of the user turn (her actual message untouched); a new
  GROUNDING section in the system prompt tells Mitra to prefer these facts but that the
  reference NEVER loosens a safety rule. Off-topic / empty messages ground nothing.
- **Safety preserved**: RAG runs only after `checkRedFlags()` clears the message, so it
  never touches the emergency path; the second urgency layer is unchanged; the diet passage
  stays labelled general/sample and the supplements FAQ names no dose. Verified the grounding
  output for English and romanised-Hindi queries (money→PMMVY, iron→diet+iron FAQ, kicks→
  milestone+movement FAQ).
- **Tests**: added `src/lib/rag.test.js` (14 tests). **101 tests pass**; `npm run build` clean.

## Reports + Reminders + Campaigns + WhatsApp (29 Sep 2026)

- **Reports** (`/reports`): on-device log of Hb / BP / blood sugar / weight with
  dependency-free inline-SVG trend charts. Personal record only — no diagnosis, no
  thresholds, non-dismissable "share with your doctor" note. `src/lib/reports.js`,
  `src/components/TrendChart.jsx`, `src/pages/Reports.jsx`.
- **Local reminders**: ANC / tablet / custom reminders via the Notification API +
  an on-device poller (`ReminderScheduler`, runs while the app is open). Managed in
  Settings (`RemindersManager`), surfaced on the Dashboard. Tablet reminders never name a
  medicine/dose. `src/lib/reminders.js`.
- **Campaigns** (`/campaigns`): real GoI maternal-child drives (PMSMA, Poshan Maah, AMB,
  IMI, SUMAN, VHSND, Breastfeeding Week…) with official links; recurring dates by cycle so
  nothing goes stale. `src/data/campaigns.js`, `src/pages/Campaigns.jsx`.
- **WhatsApp share** (`src/lib/whatsapp.js`, official wa.me): send a reminder / campaign /
  report summary to family or a caretaker — keyless, no backend. Automated scheduled
  WhatsApp delivery is NOT built (needs WhatsApp Business API + backend; see TODO/DECISIONS).
- Deleted the now-unused `StubPage.jsx`. **126 tests pass**; build clean; headless-Chromium
  smoke test: all 10 routes render with 0 console errors, add-reading & add-reminder flows work.

## Still open in TODO

Videos (verified YouTube IDs — held on safety grounds; improving with official channel
links instead), Chat image upload (Gemini vision), and the API-key proxy (deferred:
CLAUDE.md says not to build a proxy for this beta). The "Needs the user" items (real OTP
login, clinician review, IFCT/ICMR diet numbers) need accounts/keys I can't create.

See `NEXT_STEPS.md` for the longer-term list.

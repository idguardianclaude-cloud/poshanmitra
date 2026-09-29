# TODO.md — "No Coming Soon" build tracker

Goal: eliminate every "coming soon"/placeholder using **free, open-source, no-account**
tech (no paid keys, no external accounts). Tick items as done. **After a usage-limit
reset, read `CLAUDE.md`, `PROGRESS.md`, `DECISIONS.md`, then resume from the first
unchecked box here.**

Constraint I cannot cross (even with permission): I can't create the user's Google /
Firebase / Maps accounts or API keys (that means logging in as them). So every item
below is designed to need **none** of that.

## Done
- [x] **Weekly Check-up** (`/checkup`) — real week-by-week screen (baby size, baby/you,
      tips, this-week checklist, hospital-bag, timeline, Ask-Mitra). Commit `Weekly Check-up`.
- [x] **Hospitals real map** — Leaflet + OpenStreetMap (free, no key), numbered markers,
      popups with Directions/Call, real Pune coords. Replaced the placeholder grid.

## In progress / next (no account needed)
- [x] **Verify the Leaflet map renders in-browser** — confirmed: real Pune OSM tiles +
      numbered markers + popups render correctly, no key.
- [x] **RAG-grounded chat** — built `src/lib/rag.js`: an on-device retrieval layer over the
      app's own vetted content (12 schemes + eligibility summaries, weekly milestones,
      hospital-bag, the sample diet, Pune hospitals, the video index, and 8 curated safe
      FAQs). Keyword/semantic-lite scoring (IDF-lite + a trilingual synonym map: English /
      romanised / Devanagari), no extra key, no new dependency. `buildGrounding()` injects
      the top matches into Mitra's prompt as a leading part of the user turn; a new GROUNDING
      section in the system prompt tells her to prefer these facts but that it NEVER loosens a
      safety rule. Runs only after the red-flag layer clears a message. 14 new tests (101 total
      passing); build green. See DECISIONS.md.
- [x] **Reports** (`/reports`) — real local tracking: log Hb, BP, blood sugar, weight;
      dependency-free inline-SVG trend charts; stored on-device (`storage.getReports`).
      `src/lib/reports.js` (sanity bounds, series/trend helpers — NEVER diagnostic),
      `src/components/TrendChart.jsx`, `src/pages/Reports.jsx`. Non-dismissable note: it is
      a personal record, not medical advice; "Send to WhatsApp" shares latest with family/
      doctor. 11 tests. Verified in-browser (0 console errors, add-reading flow works).
- [x] **Local reminders** — ANC-visit / tablet / custom reminders via the browser
      Notification API + on-device schedule (`src/lib/reminders.js`, pure & tested).
      `ReminderScheduler` polls each minute while the app is open; managed in Settings
      (`RemindersManager`), surfaced on the Dashboard (upcoming card). Each reminder has a
      "Send to WhatsApp" share (wa.me) for family/caretakers. A tablet reminder never names
      a medicine/dose (SAFETY.md). 10 tests. Verified in-browser.
- [x] **Campaigns** (`/campaigns`) — real GoI maternal-child drives (PMSMA, Poshan Maah,
      Poshan Pakhwada, Anemia Mukt Bharat, Intensified Mission Indradhanush, SUMAN, VHSND,
      World Breastfeeding Week) with what/when/where/action + official links; recurring
      dates described by cycle so they never go stale. `src/data/campaigns.js`,
      `src/pages/Campaigns.jsx`. Per-campaign "Send to WhatsApp". Verified in-browser.

### WhatsApp sharing (added on request)
- [x] **WhatsApp click-to-share** (`src/lib/whatsapp.js`, wa.me) on reminders, campaigns and
      the reports summary — keyless, no backend, fits the no-server architecture. Automated
      *scheduled* WhatsApp delivery is NOT done: it needs the WhatsApp Business API (or a
      provider) + an approved number + a backend to hold the secret — out of scope for this
      keyless private beta (same reason as the API-key proxy). 4 tests.
- [x] **Chat image upload** — multimodal Gemini vision wired (`src/lib/image.js` downscales
      via canvas so the persisted thumbnail + payload stay small). The composer's photo button
      is live: pick → preview → send (with or without a caption). `askMitra` sends an
      `inlineData` part; a new IMAGES section in the system prompt forbids diagnosing from a
      photo, reading it as a medical report, or naming a condition, and routes to a doctor.
      Red-flag layer still screens any caption; urgency re-check still applies. Verified
      in-browser (button enabled, preview, send-gating, 0 console errors).
- [x] **Videos — DONE, real embeds.** Researched + verified (via YouTube oEmbed) the
      **Stanford Center for Health Education "Grow Great"** maternal series and embedded 9
      real, playable, credibility-verified videos (How to Recognize Pregnancy, Nutrition,
      Danger Signs, Breastfeeding, Feeding on a Budget, Baby's First Foods, Mental Health,
      Bonding, Immunization). Each card shows a "Verified" badge + the channel; category
      counts are now real; fabricated view/rating fields removed. Verified in-browser: the
      YouTube player loads and plays. The official-source fallback remains for any future
      null-id entry (exercise/labour have no verified video yet, so they simply show none).
- [ ] **API-key proxy** — DEFERRED. CLAUDE.md says explicitly "Do not spend time building a
      proxy" for this private beta (the in-bundle key is an accepted, documented trade-off).
      That hard rule overrides this item; it belongs to pre-public-launch hardening.

## Needs the user (small, optional — features still work without)
- [ ] Real **OTP login** — needs an SMS provider account (MSG91/Twilio/Firebase). Until
      then the validated phone entry stands (works for private beta).
- [ ] **Clinician review** of generated medical content (weekly info, diet) before real users.
- [ ] **IFCT/ICMR-verified** diet numbers (stays "Sample plan" until provided).

## Deployment hardening (done 30 Sep 2026 — no account needed)
- [x] **Code-split routing** — lazy-load every page except Login/Dashboard behind a
      Suspense spinner. Leaflet (map), charts (Reports) and Gemini (Chat) download only
      when opened. Initial bundle **190KB → 92KB gzipped (~52% smaller)**; >500KB warning
      gone. Matters for Tier 2-3 mobile connections. Verified in-browser (spinner → chunk
      → page render, 0 errors).
- [x] **ErrorBoundary** — top-level boundary so a component crash can't white-screen the
      app; localized (EN/HI/MR) recovery card with Reload / Go-to-Dashboard, disclaimer
      footer kept. `src/components/ErrorBoundary.jsx`.

## Notes / status
- Gemini chat: WORKING with the user's key (`AQ.Ab8…WhGA`). Caretaker + safety verified.
  Now RAG-grounded over the app's own vetted content (`src/lib/rag.js`).
- Build: green. Tests: 126 passing (validate, redflags, eligibility, rag, reports,
  reminders, whatsapp suites).
- **Full in-browser smoke test (fresh tabs): all 11 routes render with 0 console errors**
  — /, /chat, /diet, /videos, /schemes, /schemes/eligibility, /hospitals (real OSM map),
  /settings, /checkup, /campaigns, /reports.
- **No "coming soon" remains anywhere.** Videos was the last, now real Stanford embeds.
- Live preview artifact (keyless): https://claude.ai/artifact/Jpk2JGydwg3ZP4AH5gsAzW

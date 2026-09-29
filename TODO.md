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
- [ ] **Reports** (`/reports`) — real local tracking: manually log Hb, BP, blood sugar,
      weight; simple trend charts; stored on-device. Replaces the stub.
- [ ] **Local reminders** — ANC-visit / tablet reminders via the browser Notification API
      + on-device schedule (no backend). Surface on dashboard + a manage UI in Settings.
- [ ] **Campaigns** (`/campaigns`) — real content: current GoI maternal-child health
      drives (Poshan Maah, Mission Indradhanush, PMSMA, etc.) with what/when/where + links.
      Replaces the stub.
- [ ] **Videos** — research credible sources myself (MoHFW/UNICEF/WHO/hospital/OB-GYN
      channels), verify, embed real YouTube IDs (free). Replaces "Video coming soon".
- [ ] **Chat image upload** — wire multimodal (Gemini vision, same key) so she can send a
      photo (e.g., a report) — with safety guardrails. Depends on a working Gemini key.
- [ ] **API-key proxy** — small serverless function on the (free) Vercel/Netlify deploy so
      the key isn't in the client bundle. Pre-public-launch hardening.

## Needs the user (small, optional — features still work without)
- [ ] Real **OTP login** — needs an SMS provider account (MSG91/Twilio/Firebase). Until
      then the validated phone entry stands (works for private beta).
- [ ] **Clinician review** of generated medical content (weekly info, diet) before real users.
- [ ] **IFCT/ICMR-verified** diet numbers (stays "Sample plan" until provided).

## Notes / status
- Gemini chat: WORKING with the user's key (`AQ.Ab8…WhGA`). Caretaker + safety verified.
  Now RAG-grounded over the app's own vetted content (`src/lib/rag.js`).
- Build: green. Tests: 101 passing (added rag.test.js). Dev server managed by preview_start on :5173.
- Live preview artifact (keyless): https://claude.ai/artifact/Jpk2JGydwg3ZP4AH5gsAzW

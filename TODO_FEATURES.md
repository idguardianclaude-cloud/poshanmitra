# Feature build — $0 plan (approved 1 Oct 2026)

All free tier. Items needing a paid service (SMS OTP, WhatsApp Business API, real
Aadhaar/ABHA/govt-slot APIs) are replaced with the best free equivalent and marked.

## Phase 1 — Auth + Login/Signup (in progress)
- [ ] `@supabase/supabase-js` client (`src/lib/supabase.js`) — env-gated, graceful if unset
- [ ] `src/lib/auth.js` — Google OAuth, email OTP, session, sign-out (all no-op if unconfigured)
- [ ] Separate **/login** and **/signup** pages, animated + CSS-3D (tilt/parallax)
- [ ] **Continue with Google** (Supabase OAuth, free) — needs 1-time provider config in Supabase dashboard
- [ ] **Email OTP** (free, Supabase built-in email) for sign-in and for step-up verification
- [ ] Phone kept as a profile field (SMS OTP = paid, deferred); "action step-up" uses email OTP
- [ ] ProfileContext: accept a Supabase session as logged-in, additive to the current local flow

## Phase 2 — Navbar + Dashboard
- [ ] Fill the empty right navbar: profile menu (avatar/name/sign-out), notifications bell (reminders), language, Ask-Mitra quick action
- [ ] Dashboard "profile complete / verification status" card after onboarding

## Phase 3 — Reports
- [ ] **Upload report** (PDF/photo) → Supabase Storage (RLS) or local
- [ ] **Extract values** with Gemini vision (via the proxy) → add to Reports log after user confirms
- [ ] **Mitra aware of recent reports** = feed a summary into her context/RAG (NOT model fine-tuning). Safety unchanged: no diagnosis, always points to doctor.
- [ ] Move weekly-checkup reports to the **Weekly Check-up** section only; hospital reports in Reports

## Phase 4 — Campaigns
- [ ] Location search + "near me" (browser geolocation) → filter + nearby facilities on the map
- [ ] Each campaign: timing, perks, benefits, eligibility fields
- [ ] **Slot booking** → saved to Supabase (appointment record + reminder) + on-screen & email confirmation + WhatsApp share. (Not an official govt booking — no such public API.)
- [ ] Updates via in-app + browser notification + email (free) + WhatsApp share. SMS/auto-WhatsApp = paid, deferred.

## Phase 5 — Profile verification
- [ ] **ABHA**: "Link ABHA" via official ABDM portal redirect (we store nothing sensitive)
- [ ] Aadhaar: real verification NOT possible (UIDAI licence + sensitive ID handling). Skipped.
- [ ] Alternate number field; verify via email OTP (free) until an SMS provider is added

## Can't be free / not possible (honest)
- Real phone/alternate OTP (needs SMS provider — paid)
- Automated WhatsApp updates (WhatsApp Business API — paid/approved)
- Real Aadhaar / ABHA verification APIs (licensed) and real govt campaign slot booking (no public API)

# Feature build — resume TODO ($0 plan)

## 🔨 CURRENT DIRECTIVE (2 Oct): free = real, paid = labeled dummy
Build the paid-blocked features as working **dummy/mock** flows (labeled "Demo"
where they imitate a real external action, so no user is misled):
- [x] **Phone OTP** (signup/login) — send → enter OTP → verify (accept any 6 digits). Dummy.
- [x] **Alternate-number OTP** (Settings) — dummy verify → "Verified" badge.
- [x] **Aadhaar verify** (Settings) — 12-digit input → "Verify (Demo)" → store MASKED only + verified flag. Never store full Aadhaar.
- [x] **ABHA** — keep official link; add a demo "linked" state when an address is saved.
- [x] **Updates channels** (Campaigns booking + reminders) — WhatsApp/SMS/Email toggles → dummy "you'll be notified" confirmation (no real send).
- [x] **Slot booking** — demo booking reference (PM-XXXXXX) + "Demo" note (keep honest it's not a real govt slot).
- [ ] Free & still real: Hindi/Marathi translation of the new screens (reports/campaigns/profile/auth).

---
# (original plan below)


**How to resume after a limit reset:** read `CLAUDE.md`, `memory/live-deployment.md`,
then this file top-to-bottom. Everything is free-tier. The Supabase *activation*
steps (Google OAuth creds, email template) are deliberately LAST — the user said
"do everything, in last we'll do the Supabase work."

## Live facts (don't re-derive)
- **Live site:** https://poshanmitra-hqai.netlify.app (Netlify site id
  `2704addb-0aa9-4394-a571-93abba086a22`, team `idguardianclaude`). Redeploy:
  call Netlify MCP `deploy-site` → run the printed `npx @netlify/mcp … --proxy-path …`
  in the repo dir (builds on Netlify; takes a few min). SSO gate already disabled.
- **Supabase:** project `poshanmitra`, ref `pkqlmhbeawrqpqjonkvk`, ap-south-1.
  URL https://pkqlmhbeawrqpqjonkvk.supabase.co. RLS schema
  (profiles/reports/reminders/chat_messages) + `gemini` proxy Edge Function (verify_jwt off).
- Env (set in Netlify + in local `.env.production`, gitignored): VITE_GEMINI_PROXY_URL,
  VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY. Gemini key is NOT in the bundle.
- Branch: work on local `main`; push to BOTH `main` and `claude/awesome-ramanujan-bbb0f1`.
- Verify in-browser with a FRESH tab (dev console buffer is stale — see memory).

---

## ✅ DONE
- [x] Supabase project + RLS schema + Gemini key proxy (Edge Function). Key off the bundle.
- [x] Deployed live on Netlify ($0). SPA routing, 0 console errors.
- [x] **Auth Phase 1**: `@supabase/supabase-js`, `src/lib/supabase.js`, `src/lib/auth.js`
      (Google OAuth + email OTP, graceful fallback). Separate **/login** + **/signup**
      (`src/components/AuthScreen.jsx`, thin `pages/Login.jsx` + `pages/Signup.jsx`) with
      CSS-3D tilt card + animations + Google/email/phone. Phone quick-start works with no config.
      ProfileContext adopts a Supabase session; Header shows real user (name/email/avatar).
      Landing CTAs → /signup, "Log in" → /login.
- [x] **Reports backend** (committed, UI pending): `gemini.extractReport({image})`,
      `askMitra({…, reportsSummary})` folds readings into Mitra's context,
      `reports.readingsFromExtract()` + `reports.summariseForMitra()`,
      `image.readAndDownscaleImage(file, maxDim)`.

## ✅ DONE (session 2)
- [x] **Reports upload UI** — UploadReportModal: photo → Gemini extracts values → confirm → save; Chatbot passes reportsSummary so Mitra is aware. LIVE.
- [x] **Campaigns** — location bar (city + geolocation + facilities link), perks/benefits/cost on each card, slot booking (BookingModal → My appointments + .ics + WhatsApp + email). LIVE.
- [x] **Profile verification** — Settings "Verification & contact": verified email badge, ABHA link (official ABDM portal) + address field, alternate number. LIVE.
- [x] **Navbar** — added quick "Ask Mitra" button + Poshan-score chip to the Header right side; Header shows real signed-in user. LIVE.
- [x] **Weekly check-up separation** — "This week's check-up" log in the Checkup section only (separate store), distinct from Reports uploads. LIVE.

## ⏳ Old in-progress note (now done — Reports upload UI)
`src/pages/Reports.jsx` already imports: Upload, Loader2, Check, Sparkles, isImageFile,
readAndDownscaleImage, extractReport, hasGeminiKey, readingsFromExtract. Still to do:
- [ ] Add an **"Upload report"** button to the PageHeader action (next to Ask Mitra).
- [ ] `UploadReportModal`: file input → `readAndDownscaleImage(file, 1024)` → preview →
      `extractReport({image})` (spinner) → map with `readingsFromExtract(data)` → show the
      extracted readings for the woman to confirm/deselect + show `data.other[]` read-only →
      "Save to my log" → add all via the existing `persist(addReading(...))` loop.
      Safety copy: "We read these numbers off your report — please check them. Your record, not a diagnosis."
- [ ] If `!hasGeminiKey()` or extraction fails → friendly fallback ("add manually").
- [ ] **Chatbot.jsx**: pass `reportsSummary: summariseForMitra(storage.getReports())` into
      `askMitra(...)` so Mitra is aware of recent readings.
- [ ] Build + fresh-tab verify + commit + deploy.

## ☐ Weekly check-up separation
- [ ] Hospital/lab reports live in **Reports** (with the upload above).
- [ ] Add a "This week's check-up" log (weight/BP/notes for the ANC visit) in the **Checkup**
      page only, stored separately (e.g. `storage` key `poshanmitra_checkups`), shown in Checkup.

## ☐ Campaigns
- [ ] Location: browser geolocation + a **city/state search** box → filter campaigns; show
      nearby facilities on the existing Leaflet map (reuse `HospitalMap`/hospitals data).
- [ ] Enrich `src/data/campaigns.js` with **timing, perks, benefits, eligibility** fields; render them clearly.
- [ ] **Slot booking**: a booking form → save to Supabase (`bookings` table, add RLS) +
      on-screen confirmation + **email** (Supabase) + **WhatsApp share** (wa.me). Frame clearly
      as an app appointment/reminder, NOT an official govt booking (no public API for that).
- [ ] Updates via in-app + browser Notification + email + WhatsApp share (SMS/auto-WhatsApp = paid, skip).

## ☐ Profile verification
- [ ] **ABHA**: "Link ABHA" button → official ABDM portal (https://abha.abdm.gov.in) in a new tab;
      store only a self-entered ABHA address string if the user types it (optional). No sensitive data.
- [ ] **Aadhaar**: real verification NOT possible (UIDAI licence + sensitive ID). Skip; do not store Aadhaar.
- [ ] **Alternate number** field in Settings/Profile; verify via **email OTP** (free) — phone OTP needs paid SMS.
- [ ] Dashboard **"profile complete / verified" card** after onboarding.

## ☐ Navbar (needs 1 clarification)
- The top Header right side is ALREADY full (search, language, notifications bell, profile menu).
  Ask the user WHICH navbar felt empty, or add requested quick-actions (e.g. Poshan score chip,
  Ask-Mitra button) to the Header right side.

## ☐ LAST — Supabase activation (user does these; free)
- [ ] **Gemini chat secret** (already pending): set `GEMINI_API_KEY` secret on the `gemini`
      Edge Function (Supabase dashboard → Edge Functions → gemini → Secrets) so live chat works.
- [ ] **Google login**: create a Google OAuth client (Google Cloud Console, free) → paste
      Client ID/Secret into Supabase → Authentication → Providers → Google. Add the Netlify URL
      to Authorized redirect URIs + Supabase redirect allow-list.
- [ ] **Email OTP code**: Supabase → Auth → Email templates → include `{{ .Token }}` so the
      6-digit code the UI asks for is in the email (else switch UI to magic-link).

## Can't be free / not possible (honest)
Real phone/alt-number SMS OTP; automated WhatsApp updates; real Aadhaar/ABHA verification APIs;
real government campaign slot booking.

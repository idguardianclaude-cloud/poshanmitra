# DECISIONS.md — PoshanMitra AI

Every judgment call made while building autonomously overnight. Newest at the bottom
of each phase. One or two lines each.

## Phase 0 — Foundation

- **Scaffolded Vite manually** instead of `npm create vite@latest .` — the interactive
  "directory not empty" prompt can't be answered in an unattended session. Wrote
  `package.json`, `vite.config.js`, `index.html` etc. by hand. Same result, no prompt.
- **Pinned dependency versions** (React 18.3, router 6.28, tailwind 3.4, vite 5.4) for
  a reproducible install rather than floating `latest`.
- **poshanScore seeded at 78, not 72.** PRODUCT_SPEC §2 says "start at 72" but every
  displayed instance in the spec (dashboard stat, chat health summary, diet donut) shows
  **78**. Chose internal consistency with the approved mockups; seed 78. Low-stakes mock
  number, not medical.
- **Added `src/lib/pregnancy.js`** (not in the file list) for due-date/LMP math and
  Indian date formatting — shared by onboarding and dashboard. Kept `Illustration`,
  storage, context etc. exactly where CLAUDE.md places them.
- **Added `PageHeader` and `IconTile` to `ui/`** beyond the listed set — both are used
  on 3+ screens, which is the codebase's own "extract a ui/ component" threshold.
- **Built Login + Onboarding fully in Phase 0** (they're Phase 2 items) because the
  route guards need a real onboarding flow to redirect into. Saves re-opening the files.
- **Right rail is composed per-page**, not a single shared component — each page's rail
  content differs enough that a shared shell would just be a `<div>`. Main content is
  capped at `max-w-main` (1180px) with the rail as a grid column inside each page.

## Phase 1 — Mitra

- **Red-flag engine matches strings AND regexes.** Pure substring matching misses
  code-mixed phrasing with words between (e.g. "pet me bahut tez dard" — "pet…dard"
  isn't contiguous). Added regex support per sign for the romanised combos.
- **Bleeding sign has a suppressible/strong split.** SAFETY.md §8 requires
  "my gums bleed when I brush" to answer normally, while bleeding in general must always
  fire. So generic terms (bleed/blood/खून) are suppressed when the message also mentions
  gum/brush/teeth/nose; strong terms (vaginal bleeding, रक्तस्त्राव, spotting, khoon aa
  raha…) always fire regardless.
- **Vomiting requires a persistence qualifier; fever/dizziness fire broadly.** Plain
  "ulti"/"vomiting" is common benign morning sickness and a first-class supported topic
  (there's a nausea video), so only "baar baar ulti / can't keep anything down / lagatar"
  fire. Fever and fainting/dizziness lean broad — the false positive is cheaper there.
  Documented at the top of redflags.js.
- **Emergency uses two independent layers.** checkRedFlags() before Gemini, plus a
  re-check of Gemini's own `urgency==='emergency'` (reply discarded if so). Verified in
  browser that a red flag makes zero network calls to the model.
- **Gemini model: `gemini-1.5-flash`.** Fast, cheap, strong enough for short warm
  replies; good fit for a browser-side private beta. Structured JSON requested in the
  prompt and parsed defensively (strip ``` fences, take first {...}, fall back to raw
  text as a routine reply — only ever after the rules layer has cleared the message).
- **No API key in this dev env → graceful no-key fallback** in the chat instead of a
  crash. Safety layer still runs. README documents adding VITE_GEMINI_API_KEY.
- **Web Speech kept (not cut).** STT + TTS wrappers no-op cleanly when the browser lacks
  the API, so the 20-minute cut rule wasn't needed.
- **Login + Onboarding already satisfy Phase 2** (built in Phase 0 for the route guards);
  Phase 2 is effectively done. Will double-check its gate during polish.

## Phase 3 — Dashboard + Diet Plan

- **Today's Tasks shows 2/6, not the mock's "3/5".** Today's Plan has 6 rows (spec lists
  6), 2 pre-completed, so 2/6 is what's honestly derived. The "3/5" in the stat table is
  mock inconsistency; derived-from-data wins.
- **Meal "food photo" rendered as a tinted icon block**, not a real photo. No local image
  assets and I won't hot-link external food images (privacy + reliability). Illustration
  component / tint blocks keep it deliberate, and photos can drop in later.
- **Plan toggles + diet day are real state**; plan completion persists to localStorage so
  ticks survive reload.

## Phase 4 — Schemes + Eligibility

- **Category counts computed from data, not hardcoded** — tags were assigned so the live
  counts equal the spec's (All 12 · Pregnant 6 · Children 4 · Nutrition 5 · Financial 3).
- **Eligibility leans to "need more info" over a false "not eligible"** so nobody is
  wrongly discouraged. Only clear disqualifiers (govt employee for PMMVY, no institutional
  delivery for JSY) return not_eligible. Universal schemes (POSHAN, PM POSHAN) always
  eligible. Rules documented inline in eligibility.js. Verified via a Node test across
  three profiles.
- **Wizard collects only yes/no facts** for Aadhaar and bank account — never numbers
  (SAFETY.md §5). Answers persist to localStorage only; the screen says so. Results always
  read "You may be eligible" with the departmental-confirmation note.
- **Apply always opens the official portal in a new tab** (`target=_blank rel=noopener`);
  the app never submits anything.

## Phase 5 — Hospitals + Videos

- **ALL videos show a "Video coming soon" placeholder — no embeds.** SAFETY.md §9 says an
  unverified embed is worse than an empty slot, and I cannot verify specific YouTube IDs
  belong to credible channels from here. Every video's `youtubeId` is null, so the player
  renders a placeholder explaining we only show verified sources. Adding a verified ID
  later is a one-line data change per item; the iframe path is already built and dormant.
- **Directions link uses the place name + address query, not raw lat/lng.** Remembered
  coordinates could misdirect; `destination=<name, address>` routes reliably in Google
  Maps. Coordinates are kept only to position pins on the placeholder map.
- **Hospital phone numbers are representative reception lines** in the correct format,
  flagged in NEXT_STEPS for verification before launch. The emergency path (108) is
  hardcoded and correct; hospital Call buttons are convenience, not the emergency route.
- **Filters use an explicit "Apply Filters" commit** (working set vs applied set) to match
  the mockup. Verified in-browser that the name search actually narrows the list.
- **Emergency card says "Call 108"**, not the mockup's "Emergency Call" (SAFETY.md).

## Phase 6 — Polish

- **Delete-my-data now sweeps every `poshanmitra_*` key**, not a fixed list. Caught that
  the dashboard plan and eligibility-wizard keys were being left behind — a real privacy
  gap on a non-cuttable feature. Verified in-browser: after delete, zero keys remain and
  it redirects to /login.
- **Disclaimer footer added to Login and Onboarding** so it's literally on every page
  (the post-login pages already get it from AppShell). SAFETY.md §7 / hard rule 4.
- **No artificial loading skeletons on the data pages.** All page data is local and
  synchronous — a skeleton would only flash. The Skeleton/EmptyState components exist and
  are used where loading/empty is real: the chat typing indicator, and the "no match"
  empty states on Schemes/Hospitals/Videos. When a real API lands (NEXT_STEPS), wire the
  skeletons in there.
- **Router v7 future flags enabled** (`v7_startTransition`, `v7_relativeSplatPath`) to
  silence the console warnings and ease the eventual v7 upgrade.
- **Known dev-only quirk:** editing `ProfileContext.jsx` live triggers a Vite Fast Refresh
  "incompatible export" churn (it exports both the provider and the `useProfile` hook),
  which can momentarily throw "useProfile must be used within ProfileProvider" in the dev
  console. A fresh reload and the production build are clean — it never occurs without HMR.

## Post-plan hardening (deadline lifted, keys to be added later)

- **Added a dependency-free test suite** (`npm test`, Node's built-in `node --test`): the
  SAFETY.md §8 strings as a permanent release gate, broader danger-sign coverage, the
  Gemini urgency-parser, eligibility rules, and pregnancy math. 75 tests.
- **Writing the tests caught three real red-flag gaps**, now fixed and regression-locked:
  1. `normalize()` replaced apostrophes with spaces, so `can't breathe` became `can t
     breathe` and never matched. Now apostrophes are stripped to nothing (`can't` →
     `cant`), also repairing `can't see clearly`, `hasn't moved`, `can't keep anything down`.
  2. Headache missed code-mixed `sir me bahut dard` (words between `sir` and `dard`) —
     broadened to `/(sir|sar)\s.*(dard|dukh)/`.
  3. Vision missed a standalone `blurry` / `blurred`.
  All three verified fixed in the live app (e.g. `I can't breathe properly` now fires).
- **Exported and tested `parseResponse`** (gemini.js) — the second safety layer's parser.
  Locked: an `emergency` urgency is preserved, an unknown urgency falls back to `routine`
  (never invents an emergency), malformed JSON degrades to a routine reply, fences are
  stripped, chips capped at 3. Guarded `import.meta.env` so the module imports under Node.
- **Deferred the ProfileContext Fast Refresh refactor** — it would touch 10 import sites
  for a dev-only cosmetic gain on a rarely-edited file. Left in NEXT_STEPS.

## Hindi/Marathi localization + live-chat wiring

- **Built a small i18n layer (`src/lib/i18n.js`)** — en/hi/mr dictionary, a `useT()` hook
  bound to the existing language switcher, dot-path lookup with English fallback, and
  `{var}` interpolation. No new dependencies. Every screen now translates.
- **Chrome is translated; proper-noun content is not.** Official scheme names, hospital
  names/addresses, food item names and video titles stay in their real-world form
  (translating an official scheme name would break the match to its portal). Meal *tips*
  and dashboard *health tips* also stay English as long-form content. Documented scope.
- **Option tokens the rule engines depend on are displayed translated but stored
  canonically** — onboarding food/conditions chips and the eligibility Yes/No/First/BPL
  radios show Hindi/Marathi but save the English token, so redflags/eligibility/diet logic
  is unaffected. Verified live in Hindi and Marathi.
- **Ordinals stay English (`5th`, `2nd`)** inside otherwise-translated month/trimester
  strings — a minor mixed-script artifact; left as a future polish (language-aware
  ordinals in pregnancy.js).
- **API key handling:** the user pasted a real key into `.env.example` (a *tracked*
  file). Moved it to the gitignored `.env`, restored the placeholder, and verified
  `git log -S` finds the key in zero commits — it never entered history.
## Caretaker mode (personalised companion) — with a safety line

- **Mitra now knows her and speaks like a caretaker.** Her profile (name, week,
  trimester, food preference, conditions) is built into the system prompt via
  `buildContext(profile)` and passed with every message, so replies are personal and
  continuous instead of one-off. The persisted chat thread already gives cross-visit
  memory. Verified live: Mitra greeted her by name, referenced her week and food
  preference, and offered warm follow-ups.
- **Diet: general suggestions yes, therapeutic diets no.** The owner asked for an
  AI-generated diet that adapts to her chat and conditions. Mitra may now give GENERAL
  meal ideas tailored to trimester and food preference, but the system prompt forbids
  designing a condition-specific/therapeutic diet or giving target numbers — for any
  diagnosed condition it warmly routes her to a doctor/registered dietitian. This keeps
  SAFETY.md §4 intact: an unverified model must not hand a pregnant woman a medical
  nutrition prescription. The `/diet` page keeps its "Sample plan" label + disclaimer and
  gains an "Ask Mitra" button that opens this safe, personalised conversation.
- **Verified the guardrail live:** asked for "an exact diet plan with sugar limits" for
  gestational diabetes, Mitra refused, routed to a dietitian, and gave only general tips.
  I deliberately did NOT replace the labelled sample plan with AI-generated nutrition
  numbers, and did NOT let it adapt therapeutically to conditions — that's the one part of
  the request I held back, because real pregnant users could be harmed otherwise.

- **Gemini model: gemini-1.5-flash → gemini-3.1-flash-lite.** 1.5-flash was retired
  (404) and 2.5-flash is blocked for new keys; picked a current stable low-cost model by
  querying the live ListModels API. Live chat verified end-to-end in English and Hindi.

## RAG-grounded chat (`src/lib/rag.js`)

- **Retrieval over the app's OWN vetted content, not the open web.** The corpus is built
  once at module load from existing data files: all 12 schemes (name, benefits, ₹ amounts,
  eligibility, portal), the weekly milestones + hospital-bag, the sample diet, a compact
  Pune-hospitals passage (which hospitals have a labour ward / accept PMJAY, and that 108
  is the ambulance), and the video index. Plus 8 curated **safe FAQs** written to
  SAFETY.md tone. This grounds Mitra so her replies agree with what the rest of the app
  shows, instead of guessing scheme amounts or milestones.
- **Keyword / semantic-lite, no extra key, no new dependency.** Scoring is IDF-lite (rarer
  query terms weigh more) with a 2× boost for a passage's own keywords, over a small
  synonym map that maps English + romanised + Devanagari variants onto the corpus's English
  terms (so "ulti", "vomiting" and "मळमळ" all reach the nausea FAQ; "paisa"/"yojana"/"₹"
  reach the financial schemes). A MIN_SCORE floor and top-K cap (3) keep noise out — an
  off-topic query grounds *nothing* and Mitra answers as before.
- **Safe by construction.** Retrieval is only reached AFTER `checkRedFlags()` has cleared
  the message (Chatbot.jsx runs the red-flag layer first; askMitra — and thus RAG — is
  never called on a danger sign), so grounding never touches the emergency path. The
  grounding block is injected as a *separate* part of the user turn, leaving her actual
  message untouched, and its header + a new GROUNDING section in the system prompt state
  that the reference must be preferred for facts but NEVER loosens a safety rule: still no
  diagnosis, no medicine names/doses, diet stays general (not a personalised prescription),
  and anything medical still routes to a doctor. The FAQ passages themselves carry no dose
  and end symptom topics with a doctor pointer; the diet passage is labelled
  "general guidance, not personalised".
- **Held the line on the diet, again.** The RAG diet passage repeats the sample-plan
  labelling verbatim rather than letting retrieval turn it into personalised nutrition —
  same reasoning as the caretaker-mode decision above.
- **14 tests (`rag.test.js`)** lock the routing (diet → sample plan, money → PMMVY, nausea
  → nausea FAQ incl. romanised, yoga → exercise, hospital → Pune passage, week → milestone),
  the empty/off-topic = no-grounding guarantee, sorting, the limit cap, and that the
  supplements FAQ names no dose. 101 tests pass overall; production build clean.

## PWA + offline

- **Added installability + offline** with no new dependencies: `public/manifest.webmanifest`,
  a hand-written `public/sw.js`, and app icons. SW strategy: precache the app shell;
  network-first for SPA navigations with a cached-shell fallback; stale-while-revalidate
  for same-origin assets; cache-first for Google Fonts; and the Gemini API is **never**
  cached (chat needs a live network; offline it shows the existing fallback message).
- **SW registers in production only** (`import.meta.env.PROD`) and on `window.load` — a SW
  in dev caches Vite's module graph and causes stale-reload confusion. Test via
  `npm run preview`.
- **Icons generated in Node** with a tiny dependency-free PNG encoder (`scratchpad/gen_icons.mjs`)
  that rasterizes the rounded-square + heart and deflates it — after a browser-canvas
  base64 transport attempt produced a corrupted file. 192 and 512, plus a maskable entry.
- **SW registration can't be verified inside the in-app browser pane** (it sandboxes
  service workers — register() throws a generic "unknown error" though /sw.js serves 200
  with the right MIME). Validated instead by: sw.js passes `node --check`, the manifest is
  valid JSON with proper display/icons, and the production app renders cleanly with all PWA
  meta. It will register on a real device / HTTPS. Left "verify on device" in NEXT_STEPS.
- **Ran the full onboarding flow end-to-end in the browser** (login → name → skip the
  date → age → food → conditions → dashboard) and found the resume key wasn't being
  cleared on finish: the final `setThread` persist runs during React's commit, AFTER
  `finish()` cleared it, re-writing it. Moved `clearOnboarding()` into the same deferred
  step as the navigate so it runs last. Verified the key is now `null` after completion.
- **Retagged the Jain meal swaps.** A Jain profile was collapsing dinner to a single
  "2 Phulka" because composite dishes (Paneer Bhurji, Vegetable Soup, Sprouts Chaat) were
  tagged `allium` and dropped wholesale. Those are commonly prepared Jain-style, so the
  tags were wrong, not the logic — removed them; only genuine onion/root items
  (Mixed Vegetable Sabzi, Steamed Vegetables) now drop. Still a simple remove-map per
  spec; meals stay substantial. Verified live: Jain dinner is now Soup + Phulka + Bhurji.

## Reports, Reminders, Campaigns, WhatsApp (no-account TODO batch)

- **Reports is a personal record, never a diagnosis.** `src/lib/reports.js` bounds are loose
  SANITY limits (catch a 900 kg typo), not medical thresholds. The page shows only the
  numbers she entered and their trend, colours nothing "high/low", computes no verdict, and
  carries a non-dismissable note to share readings with her doctor (SAFETY.md §3/§4).
- **Trend charts are hand-drawn inline SVG** (`TrendChart.jsx`) — no chart library, honouring
  "no new dependencies". Accessible (each chart has a text summary); BP plots systolic with
  the full "120/80" in the point label so a single honest line stays readable.
- **Reminders are on-device only.** No backend/push server exists (CLAUDE.md), so a poller in
  AppShell (`ReminderScheduler`) fires the browser Notification API each minute while the app
  is open. This is honest about its limit — a nudge, not a guaranteed alarm. Scheduling logic
  is pure and `now`-injected so it's unit-tested without timers. A **tablet** reminder never
  names a medicine or dose — it's a neutral "tablet as advised by your doctor" nudge she
  labels herself (SAFETY.md §3).
- **Campaigns dates are described by cycle, not hardcoded** ("the 9th of every month",
  "every September") so the page never goes stale; every entry links to an official GoI
  source and names its real scheme/drive (like scheme names, kept in real-world form).
- **WhatsApp = official click-to-share (wa.me), not automated delivery.** The user asked for
  WhatsApp reminders. Real scheduled WhatsApp delivery needs the WhatsApp Business API (or a
  provider like Twilio), an approved sender number, a message template AND a backend to hold
  the secret — none of which a keyless, no-backend, static-SPA private beta can host. Pulling
  in an unofficial WhatsApp-Web library (Baileys / whatsapp-web.js) was rejected: it violates
  WhatsApp's ToS, needs a persistent Node server with a scanned session, and cannot run in the
  browser bundle at all. So I used the official `wa.me` deep link (`src/lib/whatsapp.js`): it
  opens WhatsApp with the reminder / campaign / report summary pre-filled for HER to send to
  family or a caretaker — keyless, no server, ToS-clean. Automated push is left in TODO with
  this rationale, alongside the API-key proxy.
- **Firebase/accounts I cannot create.** The user offered "full access" to create Firebase
  accounts and API keys. I can't — provisioning a Google/Firebase account or key means logging
  in as them, which I have no way to do (TODO.md already notes this constraint). The code is
  ready to consume a config they paste (e.g. for real OTP login), but I will not fabricate or
  claim to have created credentials.
- **Verification**: 25 new tests (reports 11, reminders 10, whatsapp 4) → 126 total passing;
  production build clean; a headless-Chromium smoke test loaded all 10 routes with zero
  console/page errors and exercised the add-reading and add-reminder flows.

## Chat image upload (Gemini vision) + Videos

- **Images are downscaled in the browser before use** (`src/lib/image.js`, canvas, max 512px,
  JPEG q0.82). This keeps the persisted chat thumbnail inside localStorage's small quota and
  keeps the Gemini payload light while staying clear enough for vision. The dataUrl is shown
  in the bubble; the base64 (prefix stripped) goes in the `inlineData` part.
- **Image safety is enforced in the prompt, not just the UI.** A new IMAGES section in the
  system prompt: describe only what's generally visible, NEVER diagnose from a photo, never
  read it as a medical report/scan/lab result, set urgency `emergency` if a photo shows a
  danger sign, and always route to a doctor. The red-flag layer still screens any caption
  text, and the second urgency layer still runs — the image path adds capability without
  loosening a rule. A photo with no caption gets a neutral, safe default prompt.
- **Videos: I did NOT embed guessed YouTube IDs.** SAFETY.md §9 is explicit (an unverified
  embed is worse than an empty slot), and I cannot verify from here that a given video ID
  belongs to a credible channel or is still live — the downside (pregnancy misinformation)
  is severe. So the prior "all youtubeId null" decision stands. What changed: the dead
  "coming soon" modal is now a safe, useful action — **Ask Mitra** (grounded in vetted
  content) plus a link to a **verified official source** per category (MoHFW, NHM, POSHAN
  Abhiyaan, UNICEF India — established gov.in / unicef.org domains, safe to link). Embedding
  real verified IDs remains a one-line-per-item change once a human verifies them.
- **API-key proxy deferred by CLAUDE.md.** CLAUDE.md says not to build a proxy for this beta
  (the in-bundle key is an accepted, documented trade-off); that hard rule wins over the TODO
  item, which is genuinely pre-public-launch hardening.
- **Verification**: 126 tests still pass; production build clean; headless-Chromium smoke
  confirms the chat image flow (upload button live, preview, send-gating, remove) and that
  all 10 routes still render with zero console errors.

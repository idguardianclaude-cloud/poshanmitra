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

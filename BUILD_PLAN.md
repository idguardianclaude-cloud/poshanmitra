# BUILD_PLAN.md — PoshanMitra AI

Ordered task list. Tick items as you complete them and commit after each phase.
Times are budgets, not targets — if a phase runs 20 minutes over, cut scope from a
later phase rather than dropping quality here.

**Hard stop: 06:00 Wednesday.** See the stop protocol at the bottom.

---

## Phase 0 — Foundation · 45 min

- [ ] `npm create vite@latest . -- --template react`
- [ ] Install: `tailwindcss postcss autoprefixer react-router-dom lucide-react @google/generative-ai`
- [ ] Tailwind init, config with the tokens from `DESIGN_SYSTEM.md`
- [ ] `index.css` — Tailwind layers, Plus Jakarta Sans import, `body { background: #F7F8FC }`
- [ ] `.env.example` with `VITE_GEMINI_API_KEY=` and `.env` gitignored
- [ ] `README.md` — setup, run, deploy, and the note about the exposed API key
- [ ] `src/components/ui/` — Card, StatCard, Button, Badge, Chip, IconTile, Skeleton, EmptyState
- [ ] `src/components/Illustration.jsx` — all inline SVGs
- [ ] `src/components/layout/` — Sidebar, Header, AppShell, DisclaimerFooter
- [ ] `src/context/ProfileContext.jsx` + `src/lib/storage.js`
- [ ] Router with every route stubbed, navigation working end to end
- [ ] `git init`, first commit

**Gate:** `npm run dev` runs clean, you can click every nav item, no console errors.

---

## Phase 1 — Mitra · 90 min · **the one thing that must ship**

- [ ] `src/lib/redflags.js` — full pattern set, three scripts, `checkRedFlags()`
- [ ] **Test the seven emergency strings from SAFETY.md §8 before writing any UI.**
      Console-test it. Do not proceed until all seven match.
- [ ] `src/components/EmergencyScreen.jsx` — hardcoded, three languages, Call 108
- [ ] `src/lib/gemini.js` — client, three system prompts, JSON response parsing,
      defensive fallback
- [ ] `src/lib/speech.js` — `startListening(lang)` / `speak(text, lang)`,
      graceful no-op if `webkitSpeechRecognition` is absent
- [ ] `src/pages/Chatbot.jsx` — full layout per spec, message list, typing indicator,
      quick-reply chips, composer, per-message speaker button
- [ ] Voice input button wired, with a recording state
- [ ] Auto-speak toggle for replies
- [ ] Right rail: Health Summary, Chat Topics, Voice Assistant panel
- [ ] Thread persisted in localStorage, Clear Chat works
- [ ] Language switch changes the system prompt mid-conversation
- [ ] **Re-run all ten test strings from SAFETY.md §8, record results in PROGRESS.md**

**Gate:** all seven emergency strings trigger the screen; all three safe strings
get normal answers; Gemini is verifiably not called on a red flag.

**If Web Speech fights you for more than 20 minutes:** ship typed input plus TTS
output only, note it in `DECISIONS.md`, move on. Do not lose an hour here.

---

## Phase 2 — Onboarding + Login · 45 min

- [ ] `src/pages/Login.jsx` — phone input, any 10 digits passes
- [ ] `src/pages/Onboarding.jsx` — five questions, chat-style, chips + inputs
- [ ] Skip and "I don't know" on every question, storing `null`
- [ ] Save after every answer; resume on reload
- [ ] Derive `weeks`, `trimester`, `month` from due date or LMP
- [ ] Route guard: no profile → `/onboarding`; no login flag → `/login`

**Gate:** fresh browser → login → five questions → dashboard, with a skip used
partway and nothing broken.

---

## Phase 3 — Dashboard + Diet Plan · 60 min

- [ ] `src/data/dashboard.js`, `src/data/meals.js`
- [ ] Dashboard: greeting, four stat cards, Today's Plan with working toggles,
      Chatbot preview card with chips routing into `/chat`, Quick Access grid,
      Recent Videos, Health Tip
- [ ] Diet Plan: four summary cards, day tabs, five meal cards with nutrients and
      tips, right rail (donut, highlights, quick actions, next review)
- [ ] **"Sample plan" pill and the required bottom note** — see SAFETY.md §4
- [ ] Veg / Jain item swaps from profile
- [ ] Condition-present warning line if profile lists a condition

**Gate:** both pages match the mockups; the diet disclaimer is present and correct.

---

## Phase 4 — Schemes + Eligibility · 45 min

- [ ] `src/data/schemes.js` — 12 schemes with benefits, documents, portal URLs
- [ ] Schemes list, category tabs with counts, search, filters, right rail
- [ ] Scheme detail modal with required documents and Apply on Official Portal
- [ ] `src/lib/eligibility.js` — rules for PMMVY, JSY, PMJAY, POSHAN, PM POSHAN,
      each with a comment explaining the rule
- [ ] Four-step wizard, prefilled from profile, validation, step indicator
- [ ] Results: "You may be eligible" wording, reasons for ineligibility,
      the departmental-confirmation note
- [ ] **No Aadhaar or bank account numbers collected anywhere**

**Gate:** wizard completes end to end and produces sensible results for the
seeded profile.

---

## Phase 5 — Hospitals + Videos · 45 min

- [ ] `src/data/hospitals.js` — 10 real Pune hospitals with coords, labour ward and
      PMJAY flags
- [ ] Hospitals page, stat chips, static map placeholder with pins, list rows
- [ ] Working filters (facilities, distance, speciality, name search)
- [ ] Directions → Google Maps URL · Call → `tel:` · **Call 108** emergency card
- [ ] `src/data/videos.js` — categories and video list with verified YouTube IDs
- [ ] Videos page: hero, category strip, grid, load more, right rail
- [ ] Playback modal with iframe embed
- [ ] **Any video whose source you cannot verify → "Video coming soon" placeholder**

**Gate:** filters actually filter; Call 108 dials; no unverified embeds.

---

## Phase 6 — Stubs + polish · 30 min

- [ ] `/checkup`, `/campaigns`, `/reports` stub pages
- [ ] Loading skeletons on every data-backed page
- [ ] Empty states
- [ ] Disclaimer footer verified present on every route
- [ ] **Delete all my data** action in the profile menu, actually working
- [ ] Focus rings, alt text, `prefers-reduced-motion`
- [ ] Console clean, no React key warnings
- [ ] 404 route

---

## Phase 7 — Handover · 30 min

- [ ] `npm run build` succeeds
- [ ] `npm run preview` smoke test of every route
- [ ] README complete: setup, env var, deploy steps for Vercel and Netlify
- [ ] `PROGRESS.md` final — what's done, what's stubbed, all safety test results
- [ ] `DECISIONS.md` final — every judgment call and its reason
- [ ] `NEXT_STEPS.md` — the week-two list: real auth, backend proxy for the API key,
      IFCT-verified meal database, scheme scraper with staging review, mobile layouts,
      Google Places integration, red-flag tuning from real usage
- [ ] Final commit

**Do not deploy.** Leave it built and ready; the deploy target is decided in the morning.

---

## Cut order, if time runs short

Cut from the bottom up, without hesitation:

1. Videos page → static cards, no playback
2. Hospitals filters → static list only
3. Eligibility wizard → schemes list only, no wizard
4. Dashboard Today's Plan interactivity → static
5. Diet Plan day tabs → single day only

**Never cut:** the red-flag layer, the emergency screen, the disclaimers, the
diet-plan sample labelling, or the delete-my-data action. Those five ship or the
app doesn't.

---

## Stop protocol — 06:00 Wednesday

At 06:00, regardless of state:

1. Stop writing features immediately, mid-task if necessary.
2. Make whatever you have compile and run. A broken build is worse than a missing page.
3. Comment out or stub anything half-finished so `npm run dev` starts clean.
4. Commit everything.
5. Write the final `PROGRESS.md` with: what works, what doesn't, exactly where you
   stopped, and the single next thing to pick up.
6. Stop.

---

## If you hit a usage limit

Write `PROGRESS.md` immediately with your exact position before you stop responding.
When the session resumes: read `CLAUDE.md`, `PROGRESS.md`, and `DECISIONS.md` first,
then continue from the next unticked box in this file. Do not restart, do not
re-scaffold, do not re-litigate settled decisions.

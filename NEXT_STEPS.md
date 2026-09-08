# NEXT_STEPS.md — PoshanMitra AI

The week-two list. Ordered roughly by importance for moving from private beta to a
wider release. Nothing here blocks the current private beta.

## Safety & trust (do these first)

- **Backend proxy for the Gemini key.** Today the key ships in the browser bundle
  (accepted for the private beta). Before any wider release, move the Gemini call
  behind a small serverless function so the key never reaches the client. The client
  code already isolates the call in `src/lib/gemini.js` — repoint `askMitra` at the
  proxy.
- **Red-flag tuning from real usage.** `checkRedFlags` logs matched sign ids to the
  console (never the message). Collect these during the beta (with consent, on-device)
  and tune patterns — especially romanised Hindi/Marathi, which is where real messages
  live. Add signs/phrasings that were missed; trim any that over-fire annoyingly.
- **Verify every embedded video against an approved channel.** All videos currently
  show a "Video coming soon" placeholder by design (SAFETY.md §9). Build a short
  allow-list of credible channels (hospitals, MoHFW/UNICEF/WHO India, qualified OB-GYNs),
  verify each `youtubeId`, and fill them in `src/data/videos.js`. The player already
  embeds when `youtubeId` is set.
- **Clinician review of all health copy** — the diet plan, tips, system prompt, and
  scheme summaries — before wider release.

## Data quality

- **IFCT/ICMR-NIN-verified meal database.** Replace the hand-written nutrition numbers
  in `src/data/meals.js` with values from the official Indian Food Composition Tables.
  Keep the "Sample plan" labelling regardless.
- **Verify hospital phone numbers and add more cities.** Numbers in
  `src/data/hospitals.js` are representative reception lines — confirm each before
  launch. Extend beyond Pune.
- **Scheme scraper with a staging review step.** Pull scheme details/amounts from
  official portals into staging, have a human review, then publish — so benefits stay
  current without hand-editing `src/data/schemes.js`.

## Product

- **Real authentication** (OTP via an SMS provider) replacing the any-10-digits stub.
- **Google Places / Maps integration** for the Hospitals page (live location, real
  map, accurate distances) replacing the placeholder map.
- **Weekly Check-up, Campaigns, Reports** — the three stub pages.
- **Mobile layouts.** The app is responsive and degrades sanely, but the sub-`lg`
  experience deserves dedicated polish since much of the audience is mobile-first.
- **Full Hindi/Marathi UI translation.** Safety-critical strings (emergency screen,
  disclaimer) are already hardcoded in all three languages; extend i18n to the rest of
  the chrome and page copy.

## Engineering

- **Resolve the ProfileContext Fast Refresh warning** (split the `useProfile` hook into
  its own module) so dev HMR stays clean. Dev-only; production is unaffected.
- **Add an error boundary** around the router for a friendly fallback screen.
- **Tests** — unit tests for `redflags.js` (the SAFETY.md §8 strings as a regression
  suite), `eligibility.js`, and `pregnancy.js`; a smoke e2e that a red-flag message
  never triggers a network call.
- **Persist chat/plan/eligibility per-user** once real auth exists.

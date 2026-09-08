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

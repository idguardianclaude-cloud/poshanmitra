# CLAUDE.md — PoshanMitra AI

Project context for Claude Code. Read this first, every session.

## What this is

**PoshanMitra AI** — a maternal health companion web app for pregnant women in India.
Tagline: *Swasth Maa, Swasth Shishu, Swasth Bharat*.

Audience: urban / semi-urban Indian women, Tier 2–3 cities, English / Hindi / Marathi.
Persona in all mock data: **Priya Sharma, 26, 5th month, 2nd trimester, Pune**.

This is being built as a **private beta** — real people will use it, but a small,
known group. Not a public launch. Not a throwaway demo either.

## Stack — do not change these

- **Vite + React 18** (JavaScript, not TypeScript — speed over safety tonight)
- **Tailwind CSS** for all styling. No CSS-in-JS, no component libraries.
- **react-router-dom** v6 for routing
- **lucide-react** for icons
- **@google/generative-ai** for Gemini
- No backend. No database. No auth server.
- All data lives in `src/data/*.js` as plain exported objects.
- User profile persists in `localStorage` under key `poshanmitra_profile`.

Gemini is called **directly from the browser** using `VITE_GEMINI_API_KEY`.
This exposes the key in the bundle. That is an accepted trade-off for a private
beta and is documented in README. Do not spend time building a proxy.

## Project structure

```
src/
  main.jsx
  App.jsx                 # router + route guards
  index.css               # tailwind + font imports + tokens
  components/
    layout/               # Sidebar, Header, AppShell, RightRail
    ui/                   # Card, Button, Badge, Chip, StatCard, Modal, Skeleton
    Illustration.jsx      # ALL illustrations live here, swap-ready
  pages/
    Login.jsx
    Onboarding.jsx
    Dashboard.jsx
    Chatbot.jsx
    DietPlan.jsx
    Schemes.jsx
    SchemeEligibility.jsx
    Hospitals.jsx
    Videos.jsx
  lib/
    gemini.js             # Gemini client + system prompts per language
    redflags.js           # SAFETY CRITICAL — see SAFETY.md
    speech.js             # Web Speech API wrappers (STT + TTS)
    eligibility.js        # scheme rule engine
    storage.js            # localStorage helpers
  context/
    ProfileContext.jsx    # user profile + language, app-wide
  data/
    meals.js schemes.js hospitals.js videos.js dashboard.js
```

## Hard rules

1. **`src/lib/redflags.js` is safety-critical.** Read `SAFETY.md` before touching it.
   Never let a red-flag message reach Gemini. Never soften the emergency screen.
2. **Never present invented nutrition numbers as personalised medical advice.**
   The diet plan is labelled "Sample meal plan — general guidance for pregnancy."
   Not "Personalised for You."
3. **Mitra gives information, never diagnosis.** No "you probably have X."
   No medicine names or dosages. Always points toward a doctor, never away.
4. **Every page keeps the disclaimer footer.** Not dismissable.
5. **Scope Mitra to pregnancy, infant, and maternal health only.** Politely decline
   everything else in the user's own language.

## Conventions

- Functional components, hooks only. No class components.
- One component per file, named export matching filename.
- Tailwind classes inline. Extract to a `ui/` component when used 3+ times.
- Keep comments minimal except in `redflags.js` and `eligibility.js`, where the
  *why* matters more than the code.
- Indian formatting throughout: `₹5,000`, `+91 98765 43210`, `12 May 2025`.
- Real Indian content everywhere. No lorem ipsum, no "Product 1", no US placeholders.

## Definition of done for any screen

Renders with mock data · nav works both ways · loading state · empty state ·
keyboard focus visible · no console errors · matches the mockup's layout and palette.

## Files to read

- `PRODUCT_SPEC.md` — every screen, every field, all content
- `DESIGN_SYSTEM.md` — tokens, components, exact styling
- `SAFETY.md` — red-flag layer, disclaimers, Mitra's boundaries
- `BUILD_PLAN.md` — ordered task list, tick items as you go
- `PROGRESS.md` — you create and maintain this; state at every checkpoint
- `DECISIONS.md` — you create and maintain this; every judgment call you made

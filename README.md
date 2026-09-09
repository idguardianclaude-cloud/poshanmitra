# PoshanMitra AI

A maternal health companion web app for pregnant women in India.
_Swasth Maa, Swasth Shishu, Swasth Bharat._

Private beta. Trusted guidance on diet, health, government schemes and nearby
hospitals — in English, Hindi and Marathi, with all personal data kept on the
device.

## Stack

- Vite + React 18 (JavaScript)
- Tailwind CSS
- react-router-dom v6
- lucide-react icons
- `@google/generative-ai` (Gemini), called directly from the browser

No backend, no database, no auth server. The user profile and chat thread live in
`localStorage`. Mock content lives in `src/data/*.js`.

## Setup

```bash
npm install
cp .env.example .env   # then add your Gemini key
npm run dev
```

Open the printed local URL. Any 10-digit number logs you in (this is not real auth).

### Gemini API key

Set `VITE_GEMINI_API_KEY` in `.env`. Get a key at
<https://aistudio.google.com/app/apikey>.

> **Security note — the key is exposed in the browser bundle.** Because Gemini is
> called directly from the client, the key ships in the built JavaScript. This is an
> accepted trade-off for a small, private beta. **Before any public launch, move the
> Gemini call behind a backend proxy** (see `NEXT_STEPS.md`). Use a key with strict
> quotas and no unnecessary billing while in beta.

If no key is set, the chatbot still runs the safety red-flag layer and shows a clear
"couldn't reach Mitra" message instead of a generated reply.

## Scripts

```bash
npm run dev       # start dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm test          # run the test suite (Node's built-in runner)
```

The test suite includes the SAFETY.md §8 emergency strings as a permanent
regression gate — if `npm test` fails on those, the red-flag layer has regressed
and the build must not ship.

## Safety

This app follows `SAFETY.md`. In short:

- Every chat message is screened by `src/lib/redflags.js` **before** it can reach
  Gemini. Obstetric danger signs trigger a fixed emergency screen with a one-tap
  **Call 108** — the model is never called on those messages.
- The diet plan is labelled a **sample plan**, not personalised medical advice.
- Eligibility results say **"You may be eligible"** and never collect Aadhaar or bank
  account numbers.
- A persistent disclaimer footer appears on every page.
- **Delete all my data** (profile menu) clears everything from the device.

## Deploy

Static build; host `dist/` anywhere. See `NEXT_STEPS.md` for the pre-launch checklist
(backend proxy for the API key first).

- **Vercel:** framework preset “Vite”, build `npm run build`, output `dist`, add
  `VITE_GEMINI_API_KEY` in project env vars.
- **Netlify:** build `npm run build`, publish directory `dist`, add the same env var.

## Project docs

`CLAUDE.md` · `PRODUCT_SPEC.md` · `DESIGN_SYSTEM.md` · `SAFETY.md` · `BUILD_PLAN.md`
· `PROGRESS.md` · `DECISIONS.md` · `NEXT_STEPS.md`

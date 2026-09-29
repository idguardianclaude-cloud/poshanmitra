# DEPLOY.md — PoshanMitra AI

The app is a static Vite SPA. Config for both Vercel and Netlify is in the repo
(`vercel.json`, `netlify.toml`, `public/_redirects`, `.nvmrc`). SPA deep-links,
the service worker, the manifest and icons are all verified against a production
preview.

## One thing only you can do

The Gemini API key is **not in the repo** (it lives in the gitignored `.env`).
Whichever host you use, add it as a build-time environment variable:

```
VITE_GEMINI_API_KEY = <your key>
```

Vite inlines it at build time, so it must be set **before** the build runs on the host.
Without it the whole app works except live chat (which shows a clear "not configured"
message); the safety red-flag layer still runs.

---

## Option A — Vercel (recommended, ~2 min)

**Fastest, from this folder:**
```bash
npx vercel --prod
```
- First run opens a browser to log in (I can't do this step for you — it's your account).
- Accept the detected settings (framework: Vite, build `npm run build`, output `dist`).
- After it deploys once, add the env var and redeploy:
```bash
npx vercel env add VITE_GEMINI_API_KEY production
npx vercel --prod
```

**Or via the dashboard:** push this repo to GitHub, then in vercel.com → New Project →
import the repo → add `VITE_GEMINI_API_KEY` under Environment Variables → Deploy.

## Option B — Netlify

```bash
npx netlify deploy --build --prod
```
- First run logs in via browser (your account).
- Or: netlify.com → Add new site → import the GitHub repo → Site settings →
  Environment variables → add `VITE_GEMINI_API_KEY` → Deploy.

`netlify.toml` already sets the build command, publish dir, Node 20, and SPA redirects.

## Option C — any static host

```bash
npm ci
npm run build
# upload the dist/ folder; ensure all unknown routes fall back to /index.html
```

---

## Push to GitHub first (for dashboard deploys)

The repo is committed locally. To push (uses your GitHub account):
```bash
gh repo create poshanmitra-ai --private --source=. --push
# or, with an existing empty repo:
git remote add origin https://github.com/<you>/poshanmitra-ai.git
git push -u origin master
```

## Post-deploy checklist

- [ ] Open the site → login (any 10 digits) → onboarding → dashboard.
- [ ] Chat: ask a normal question (gets a reply) and send a danger-sign phrase
      (shows the emergency screen; no model call).
- [ ] Switch language to हिंदी / मराठी — the UI translates.
- [ ] Install prompt appears (PWA) and the app opens offline after first load.
- [ ] Profile menu → **Delete all my data** clears and returns to login.

## Security note

The key is bundled into the client build (documented private-beta tradeoff). Before a
wider/public launch, move the Gemini call behind a serverless proxy — see `NEXT_STEPS.md`.
Use a key with tight quotas while in beta.

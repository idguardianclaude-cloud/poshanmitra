# STARTUP_ROADMAP.md — PoshanMitra AI

Turning the working private-beta app into a viable startup. Ordered by leverage,
not by ease. Tick items as you go. **Validate before you build (Phase 0).**

**Positioning wedge (decide first, then everything serves it):**
> The safety-first, voice-first, multilingual pregnancy companion for Tier 2–3 /
> semi-urban women that existing apps ignore — and that a health system can trust
> enough to deploy.

Legend: `[P0]` do now · `[P1]` next · `[P2]` later · ⟶ depends on.

---

## Phase 0 — Validate (weeks 1–4) — before writing more product code

- [ ] `[P0]` Write a one-line problem statement and the single wedge above; kill scope that doesn't serve it.
- [ ] `[P0]` 20–30 interviews with target women (Tier 2–3, Hindi/Marathi) — is safety triage + reminders a top-3 pain?
- [ ] `[P0]` 5 interviews with ASHA / Anganwadi workers — where does a tool fit their real workflow?
- [ ] `[P0]` Competitive teardown: Mylo, BabyChakra, govt RCH/ANMOL/eSanjeevani, Momspresso — what do they miss for this audience?
- [ ] `[P0]` Recruit a clinical advisor / co-founder (OB-GYN or public-health MD). Trust and content credibility start here.
- [ ] `[P1]` Define the one pilot partner type to chase (hospital chain OR district NHM OR NGO) and the outcome metric that would make them pay.

**Gate:** a written wedge, evidence the pain is real, and one named pilot lead.

---

## Phase 1 — From chatbot to care companion (months 1–3)

The chatbot alone won't retain. These create daily habit + measurable impact.

- [ ] `[P0]` **Backend + accounts** (replaces localStorage-only). Real auth (OTP), server-stored profile/chat/records, multi-device. ⟶ everything below.
- [ ] `[P0]` **Reminders & scheduling engine** — ANC visits, IFA/calcium tablets, TT shots, vaccination (Mission Indradhanush). Push notifications. This is the retention + adherence killer feature.
- [ ] `[P0]` **Human handoff on risk** — route `emergency` / `doctor_soon` (already emitted by `src/lib/gemini.js`) to a teleconsult or the woman's ASHA worker, not just "call 108." Turns the safety layer into a triage funnel.
- [ ] `[P1]` **Longitudinal tracking** — weight, BP, hemoglobin, kick counts; a digital MCP card. Q&A → care record.
- [ ] `[P1]` **Postpartum + infant 0–2** — breastfeeding, newborn care, immunisation. Halts the birth-time churn cliff; ~2× lifetime value.
- [ ] `[P2]` Family/husband view + peer community for engagement.
- [ ] `[P2]` Real verified video library (partner with hospital channels) — replace the "coming soon" placeholders.

**Gate:** a woman gets a useful reminder, logs one vital, and can reach a human when a red flag fires.

---

## Phase 2 — Trust & compliance (parallel with Phase 1)

Trust is the product in health. These are also sales prerequisites.

- [ ] `[P0]` **Proxy the Gemini key** behind a serverless function (key currently ships in the bundle — see README/NEXT_STEPS). ⟶ backend.
- [ ] `[P0]` **DPDP Act 2023 compliance** — explicit consent, data-residency, PII handling, deletion (the `Delete all my data` action already models the intent).
- [ ] `[P0]` **Clinical review of all health copy** — diet plan, tips, system prompt, scheme summaries. Publish the advisory board visibly.
- [ ] `[P1]` **Red-flag tuning from real usage** — `src/lib/redflags.js` logs matched sign ids (never text). Collect with consent, expand romanised Hindi/Marathi coverage. This tuned safety layer is proprietary IP.
- [ ] `[P1]` Confirm you are **not a regulated medical device**; keep information-not-diagnosis framing (already enforced in the system prompt).
- [ ] `[P2]` Security review + pen test before any public launch.

**Gate:** no secret in the client, a consent + privacy flow, and clinician-signed content.

---

## Phase 3 — Business model & go-to-market (months 2–6)

Answer "who pays?" — D2C subscription is brutal for this audience.

- [ ] `[P0]` Pick 1–2 monetization paths to test:
  - [ ] B2G — ASHA/Anganwadi tool or state NHM deployment.
  - [ ] B2B2C — white-label patient engagement + teleconsult take-rate for a hospital/clinic chain.
  - [ ] Insurer / PMJAY / employer-maternity / CSR-funded (someone else pays for outcomes).
  - [ ] Commerce (supplements/baby products) — only after trust, never at the cost of safety.
- [ ] `[P0]` **Run one pilot** with defined, measured outcomes (below). 50–200 women is enough to prove signal.
- [ ] `[P1]` Pricing model + a simple LOI/contract for the pilot partner.
- [ ] `[P1]` CAC/distribution plan — partnerships over paid D2C acquisition.

**Gate:** one signed pilot with an outcome metric and a paying (or intending-to-pay) partner.

---

## Phase 4 — Moat & scale (month 6+)

- [ ] `[P1]` Deepen the moat: localized safety-tuned content + workflow lock-in (ASHAs/hospitals running their flow on you) + distribution relationships.
- [ ] `[P1]` Google Places / live map for Hospitals (replace the placeholder); real facility data.
- [ ] `[P2]` Full Hindi/Marathi content (UI is done; extend to long-form tips, scheme descriptions), plus more languages.
- [ ] `[P2]` Native mobile (or keep PWA) — PWA install/offline is already built; verify on-device and add an "Add to Home Screen" hint.
- [ ] `[P2]` Cost engineering on the model at scale; caching; cheaper/faster inference.

---

## Cross-cutting — measure everything (from day one)

Without outcomes you can't sell to anyone who'd pay. Build privacy-respecting analytics early.

- [ ] `[P0]` ANC visit adherence · IFA/calcium compliance · vaccination on-time rate.
- [ ] `[P0]` Danger-sign → facility conversion (the safety layer's real-world impact).
- [ ] `[P1]` Institutional-delivery rate among users · scheme-enrolment completion.
- [ ] `[P1]` Engagement/retention: DAU/WAU, reminder open-rate, week-4 and postpartum retention.

---

## Risks to watch

- Medical liability and misinformation harm — the safety layer mitigates but doesn't eliminate; keep clinician oversight.
- Regulatory: telemedicine practice guidelines; PCPNDT (already handled in the prompt).
- Model cost + latency at scale.
- Competition and government's own free apps — the wedge (underserved Tier 2–3, safety, voice, offline) is the answer.

---

## What's already built (assets to leverage, not rebuild)

Hard red-flag safety layer (tested) · trilingual UI + emergency screen · offline PWA ·
schemes + eligibility engine · diet plan with safety labelling · voice I/O · on-device
privacy + delete-my-data. These map directly to the "safe, multilingual, underserved"
positioning — lead with them.

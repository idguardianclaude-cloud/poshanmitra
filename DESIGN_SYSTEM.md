# DESIGN_SYSTEM.md — PoshanMitra AI

The visual direction is **already decided by the approved mockups**. This document
records it. Do not reinterpret it, do not "improve" it — match it.

The look: soft, medical-but-warm. White cards floating on a pale lilac-grey field,
generous rounding, indigo as the single strong colour, pastel tints doing the
categorisation work. Nothing sharp, nothing loud. It should feel like a calm clinic,
not a fitness app.

---

## Colour

```js
// tailwind.config.js — theme.extend.colors
indigo: {
  50:  '#EEF0FF',   // active nav pill, user chat bubble, soft fills
  100: '#E0E3FF',
  500: '#6366F1',
  600: '#4F46E5',   // PRIMARY — buttons, active nav text, links, logo
  700: '#4338CA',   // hover
}
ink:   { DEFAULT: '#1E1E2D', muted: '#6B7280', faint: '#9CA3AF' }
line:  '#EEF0F6'    // all card borders
canvas:'#F7F8FC'    // page background
```

Pastel tints for category tiles and stat-card icon circles — always the 50-weight
fill with the 500/600-weight icon:

| Meaning | Fill | Icon |
|---|---|---|
| Nutrition / success | `#ECFDF5` | `#10B981` |
| Videos / alert-soft | `#FEF2F2` | `#EF4444` |
| Schemes / warning | `#FFFBEB` | `#F59E0B` |
| Campaigns / primary | `#F5F3FF` | `#8B5CF6` |
| Hospitals / info | `#EFF6FF` | `#3B82F6` |
| Reports / calm | `#F0FDFA` | `#14B8A6` |
| Pink accent | `#FDF2F8` | `#EC4899` |

Status: Normal `#10B981` · Slightly High `#F59E0B` · Low / Emergency `#EF4444`.

**Emergency red is reserved.** `#DC2626` appears only on the 108 button and the
red-flag screen. Never use it for decoration, never for a "delete" button.

---

## Type

**Plus Jakarta Sans** throughout — Google Fonts, weights 400/500/600/700.
One family. It has the rounded warmth the mockups show without being childish.
Fallback stack: `'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif`.

| Role | Size / weight | Colour |
|---|---|---|
| Page title | 28px / 700 | ink |
| Page subtitle | 14px / 400 | ink.muted |
| Card title | 16px / 600 | ink |
| Stat value | 24–28px / 700 | ink |
| Stat label | 13px / 500 | ink.muted |
| Body | 14px / 400 | ink |
| Small / meta | 12px / 400 | ink.faint |
| Button | 14px / 600 | — |

Sentence case everywhere. **No all-caps labels.** No tracked-out eyebrow text.

Devanagari renders in the same family; if Marathi conjuncts look wrong, add
**Noto Sans Devanagari** as a fallback for `:lang(hi), :lang(mr)` only.

---

## Shape and depth

- Cards: `rounded-2xl` (16px), `bg-white`, `border border-line`, `shadow-[0_1px_3px_rgba(16,24,40,0.04)]`
- Buttons and inputs: `rounded-xl` (12px)
- Pills, chips, badges: `rounded-full`
- Icon circles: `rounded-2xl`, 40–48px
- Avatars: `rounded-full`

Shadows stay barely-there. The mockups get their depth from the white-on-lilac
contrast, not from shadow. Resist deepening them.

---

## Layout

```
┌──────────┬────────────────────────────────────────┬─────────────┐
│ sidebar  │ header (sticky, 72px)                  │             │
│ 260px    ├────────────────────────────────────────┤ right rail  │
│          │                                        │ 340px       │
│ nav      │ main content                           │ stacked     │
│          │ gap-6 between cards                    │ cards       │
│ ...      │                                        │             │
│ help     │                                        │             │
│ card     │                                        │             │
└──────────┴────────────────────────────────────────┴─────────────┘
```

Page padding 24–32px · card padding 20–24px · card gap 24px · grid gap 16px.
Sidebar and header are fixed; only main and rail scroll.

Desktop-first tonight, but write responsive Tailwind classes as you go
(`lg:grid-cols-3` etc.) so it degrades sanely rather than breaking. Below `lg`,
the right rail stacks under main. Below `md`, the sidebar becomes a drawer behind
the hamburger. Do not spend extra time perfecting mobile.

---

## Components to build first (`src/components/ui/`)

- **Card** — `{ title, action, children, className }`, renders the header row with
  optional right-side link.
- **StatCard** — `{ icon, tint, label, value, sub, progress }`.
- **Button** — variants `primary` (indigo-600 solid) · `secondary` (white, border) ·
  `ghost` · `danger` (only for 108). Sizes `sm` `md`.
- **Badge** — `{ tone: 'success'|'warning'|'danger'|'info'|'neutral', children }`.
- **Chip** — pill button for quick replies and filters, `selected` state.
- **IconTile** — the tinted rounded square used in Quick Access.
- **Skeleton** — shimmer block for loading states.
- **EmptyState** — illustration + one line + one action.

Build these before any page. Every page then composes them.

---

## Illustrations

All in `src/components/Illustration.jsx`, one component, switch on a `name` prop:

`pregnant-seated` · `ambulance` · `blood-drop` · `water-glass` · `empty-box` ·
`shield-check` · `bell` · `mail` · `headset`

Draw them as **inline SVG using flat geometric shapes** in the indigo/lavender
palette — a seated figure is a few rounded rects, an arc, and a circle. Keep them
simple and consistent: same stroke weight, same 3-colour palette (`#4F46E5`,
`#C7D2FE`, `#EEF0FF`), no gradients, no detail.

They must read as deliberate flat illustration, not as failed realism. If a shape
isn't working, simplify it further rather than adding detail.

Every usage goes through this component so unDraw SVGs can be dropped in later
by editing one file.

---

## Motion

Almost none. Transitions on hover and focus only (`transition-colors duration-150`),
the typing indicator in chat, and the shimmer on skeletons. No scroll-triggered
entrances, no card lift on hover, no page transitions.

Respect `prefers-reduced-motion` — disable the typing dots and shimmer.

---

## Accessibility floor

Visible focus ring on everything interactive (`focus-visible:ring-2 ring-indigo-500
ring-offset-2`). Real `<button>` and `<a>` elements. Labels on all inputs. Alt text
on images. Colour never the sole carrier of meaning — status pills carry text too.
Body text contrast at least 4.5:1 (`#6B7280` on white passes; `#9CA3AF` does not, so
keep it to meta text only).

---

## Writing in the UI

Plain, warm, second person. *"You are doing great"*, not *"User progress: optimal."*
Buttons say what happens: **Save & Continue**, **Call 108**, **Apply on Official Portal**.
The same action keeps the same name everywhere.

Empty states invite: *"No reports yet. Upload your first test report to track your health."*
Errors explain and offer a fix, never apologise vaguely: *"Couldn't reach Mitra.
Check your connection and try again."*

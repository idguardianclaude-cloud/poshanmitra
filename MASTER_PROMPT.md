# MASTER_PROMPT.md

Copy everything between the lines into Claude Code as your first message.

Put `CLAUDE.md`, `PRODUCT_SPEC.md`, `DESIGN_SYSTEM.md`, `SAFETY.md` and
`BUILD_PLAN.md` in the project folder first, and add your Gemini key to `.env`
before you start.

---

```
Build PoshanMitra AI — a maternal health web app for pregnant women in India.

Read these four files in the project root before doing anything, in this order:
CLAUDE.md, SAFETY.md, PRODUCT_SPEC.md, DESIGN_SYSTEM.md. Then open BUILD_PLAN.md
and work through it phase by phase. Everything you need is in those files.

## Working conditions

I am asleep. My laptop is on and will stay on. Nobody is here to answer questions,
approve anything, or unblock you. When you wake up a decision, make it, write one
line in DECISIONS.md explaining why, and keep going. Never stop and wait for me.

Work autonomously through every phase in BUILD_PLAN.md, in order, without pausing
between them.

## Hard stop at 06:00

Run `date` at the start of every phase and note the time in PROGRESS.md.

At 06:00 local time, stop immediately, even mid-task. Then, in this order:
make it compile, stub out anything half-written so `npm run dev` starts clean,
commit everything, write the final PROGRESS.md, and stop. A broken build at 6am
is worse than three missing pages.

If you reach 06:00 during a phase, do not try to finish it. Stop.

## If you hit a usage limit

Before you go quiet, write PROGRESS.md with your exact position: last completed
checkbox, current file, and the next concrete step. Commit.

When the session resumes, read CLAUDE.md, PROGRESS.md and DECISIONS.md first, then
continue from the next unticked box in BUILD_PLAN.md. Do not restart the project.
Do not re-scaffold. Do not revisit decisions already recorded in DECISIONS.md.

## Files you own and must maintain

PROGRESS.md — update after every completed phase and before any stop. What's done,
what's stubbed, what's broken, where you are, what's next.

DECISIONS.md — every judgment call: what you chose, what you rejected, why.
One or two lines each. This is what I read first when I wake up.

## Safety — non-negotiable

SAFETY.md overrides PRODUCT_SPEC.md and overrides the mockups wherever they conflict.

Build src/lib/redflags.js first, before any chat UI, and console-test all seven
emergency strings in SAFETY.md §8 until every one matches. A red-flagged message
must never reach Gemini. Do not soften the emergency screen, do not add reassurance
to it, and do not translate it at runtime.

The diet plan ships labelled "Sample plan" with the required disclaimer. The
eligibility results say "You may be eligible". No Aadhaar or bank account numbers
are collected anywhere. The disclaimer footer is on every page.

If you fall behind, cut from the bottom of the cut list in BUILD_PLAN.md. Never cut
the red-flag layer, the emergency screen, the disclaimers, the diet-plan labelling,
or the delete-my-data action.

## Quality bar

Real Indian content everywhere — no lorem ipsum, no "Product 1", no US placeholders.
Match the design tokens in DESIGN_SYSTEM.md exactly; they come from approved mockups,
so implement them rather than improving them.

Commit after every phase with a clear message. Keep the build green — if something
breaks, fix it before moving on rather than accumulating broken files.

Do not deploy. Leave it built and ready; I'll choose the host in the morning.

Start with Phase 0.
```

---

## Running it overnight

Two things Claude Code cannot do on its own, so handle them yourself before bed.

**It cannot resume itself after a usage limit.** When the limit hits, the session
stops and stays stopped until something restarts it. Use the wrapper script
(`run-overnight.sh`) — it relaunches with `--continue` every few minutes, so the
work picks up on its own once your limit resets.

**Its sense of time is unreliable.** The prompt tells it to run `date`, but a model
absorbed in a task can drift past a deadline. The script enforces 06:00 with a real
process kill, which is the only version of that guarantee worth having.

```bash
chmod +x run-overnight.sh
./run-overnight.sh
```

Then leave the terminal open, disable sleep on the laptop, and go to bed.

macOS: `caffeinate -dims ./run-overnight.sh`
Windows: run it in WSL, and set Power & sleep to Never.

## When you wake up

Read in this order: `PROGRESS.md`, then `DECISIONS.md`, then `git log --oneline`.
Then run `npm run dev` and click through every route before you read a single line
of code.

Test the seven emergency strings yourself. Do not take the log's word for it —
that layer is the one thing worth verifying with your own hands before anyone
else uses this.

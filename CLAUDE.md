# Working rules — QuantumCrypto Frontend

> **Why this file exists.** This project is built by one developer over long stretches, with
> gaps of weeks between sessions. The failure mode to avoid is: *a lot of things changed, and
> now nobody knows what was done, what was tested, what works and what doesn't.* These rules
> exist to make that impossible. They are not style preferences — they are how the project
> stays knowable.

## 1. One atomic slice at a time

A **slice** is the smallest change that leaves the app in a working, committable state.

**The loop, every time:**

```
think → agree with Ibra → TRACK THE AGREEMENT → ONE small change → gates → REVIEW OWN WORK
      → verify → commit → update tracker → next
                                            … and PUSH before the session ends
```

**Before each slice, recall it in a few lines** — what it is, why, and where it sits in the plan.
Sessions are weeks apart; nobody should have to reconstruct the context from the diff.

Never start the next slice before the current one is committed. If a slice turns out to be two
concerns, stop and split it — do not "finish it quickly since I'm already here".

### 1a. Commit, push, merge — three different jobs (agreed 2026-09-23)

| | what it is | when |
|---|---|---|
| **commit** | a save point on the laptop | when something is **agreed** (tracker, docs) or **proven** (code: gates green, plus Ibra's browser check when the player sees a change). A proposal still under discussion, or code not yet verified, is **never** committed |
| **push** | the backup on GitHub; it also runs CI | at the **end of every work session**, and before any break where losing the work would hurt. Not needed after every commit |
| **merge into `development`** | what moves toward the deployed app | only through a **pull request**, and only when a **whole chapter** is complete — e.g. the E91 migration, the physics simulation — or when Ibra asks. When a chapter closes, Claude says so: *"this is a good moment to merge."* |

**Track first:** every agreement — a finding, a decision, a wording, a plan, a slice — goes into the
tracker as soon as it is agreed, before any code, not only when the slice lands.

Learned the hard way: an agreed wording once lived only in a chat that ended, and nine commits sat on
one laptop for five days.

### 1b. Review your own work before handing it over — and say the loop out loud

**The review step is not optional and does not wait to be asked for.** Green gates mean the code
compiles and the tests pass; they say nothing about whether the design is right, whether a behaviour
change was smuggled into a refactor, or whether a hook was left silently optional. Every single time
this review has been done, it has found something: a foot-gun rebuilt inside the shared code, an
import cycle, a test that passed on broken code, a store read swapped for a localStorage read.

**Why this rule needs a forcing function, written plainly so it is not lost again (2026-09-04).**
Ibra asked why written rules — tracking especially — get skipped until he asks. The honest answer:
the steps of this loop are not equally enforced. `npm test` prints red or green, so it cannot be
skipped unnoticed. "Update the tracker" and "review your own work" produce no signal at all, and
once the code is green the slice *feels* finished. So the invisible steps are the ones that fall
away, and a longer session makes it worse.

**So the fix is not another rule to remember — it is a trigger.** At the end of every slice, state
the loop explicitly, as a checklist, in the message that hands the work over:

```
Gates:     <tests / tsc / lint results>
Review:    <what re-reading the diff found — "nothing" is a valid answer, silence is not>
Tracker:   <updated, or why not yet>
Verify:    <exactly what Ibra should click, and what a correct result looks like>
```

What must be said aloud cannot be skipped silently. If one of those lines is missing from a handover
message, the slice is not finished.

## 2. Never mix concerns in one commit

A commit does exactly one kind of thing:

| Kind | Example |
|---|---|
| behaviour fix | the Eve re-emission fix |
| pure refactor | extracting `protocol.ts` (no behaviour change) |
| test | the physics-contract suite |
| docs / tracker | the ADR rule, the roadmap |
| cleanup | removing dead imports |

**Refactor and behaviour change never share a commit.** If they do, nobody can tell which line
changed the behaviour — and `git bisect` becomes useless. When a job needs both, split it:
`2.5a` = refactor (behaviour-preserving), `2.5b` = the behaviour change. That split is what let
us prove the Eve extraction was safe.

## 3. Gates — every commit, no exceptions

```bash
npm test          # all green
npx tsc --noEmit  # clean
npx next lint     # clean
```

CI runs the same three on every push (`.github/workflows/tests.yml`). A commit that knowingly
leaves any of them red does not go in — including "temporary" red tests. If a test can only pass
after a later slice, it ships **with** that later slice, not before it.

## 4. Behaviour-touching changes need a human check before commit

Automated gates catch logic and statistics. They do **not** catch wiring — components have no
automated coverage yet (testing-strategy phases 2–3 not started).

So: if a change touches a component or anything the player sees, it is checked in a real browser
before it is committed — **Claude first, then Ibra** (agreed 2026-09-25):

1. **Claude plays it** in its built-in browser against the local dev server, reads the stored state
   to check the arithmetic, and sends the evidence (screenshots, values). Ibra is not asked to click
   through a flow Claude can play itself.
2. **When Claude's check passes, Ibra checks** the look (colours, size, readability) and gives the
   final OK. Claude says exactly what to look at.

Do not commit on the assumption it works.

Multiplayer needs two isolated browsers — same-origin `localStorage` is shared between tabs, so two
tabs of one site are not a valid multi test. For Ibra: normal + incognito. For Claude: one tab on
`localhost:3000`, one on `127.0.0.1:3000` (different origins, separate storage — to confirm on first
use). Server-side behaviour can also be checked with `tools/e91_fake_browsers.mjs` in the backend.

## 5. Every bug fix carries the test that would have caught it

Established after the July harvest, when several real bugs were found by chance. Write the test
**first**, run it against the broken code, and confirm it **fails** — that failure is the proof
it would have caught the bug. Then fix, and watch it go green.

A test that passes on the broken code is not a regression test. The original Eve test asserted
only array length and value range, which the broken output satisfied perfectly — that is exactly
how a 22-month bug survives.

## 6. Record what was verified, and how

The tracker (`tasks_todo.md`) is the memory of the project. When a slice lands, write down:

- what changed,
- **how it was verified** (which tests, which browser flow, which numbers observed),
- what is still unverified.

"Done" alone is not a record. `"Browser-verified: 20 photons encode correctly, sifted keys
identical"` is a record — it answers *what did we test?* months later, and it is the reason a
cold session can pick this project up.

## 7. Verify claims against the code, not memory

Before asserting how something works — including things stated earlier in the same conversation
— check the actual file. Scope claims especially: the Eve bug was called "solo-only" until the
backend was read and a second copy turned up in multiplayer.

When a fact matters, show the evidence (the grep, the run, the measured number) rather than
asserting it.

## Where things are written down

| Document | What it governs |
|---|---|
| `tasks_todo.md` | live tracker + the **roadmap to completion** (top of file) |
| `docs/shared-protocol-lifecycle-adr.md` | **Axis A** — session & data lifecycle. §13.3 = physics rule |
| `docs/protocol-physics.md` | **Axis B** — the quantum simulation itself |
| `docs/testing-strategy.md` | testing law, phases, CI |

**Two axes, easy to confuse:** the lifecycle ADR asks *"where does this data go, and does it
survive a refresh?"*. It never asks *"is the number in it physically correct?"*. A protocol can
be fully lifecycle-conformant and still simulate the wrong physics — BB84 was, for 22 months.
Establish which axis a task is on before starting it.

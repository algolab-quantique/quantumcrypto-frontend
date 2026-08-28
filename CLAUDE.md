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
think → agree with Ibra → ONE small change → gates → verify → commit → update tracker → next
```

Never start the next slice before the current one is committed. If a slice turns out to be two
concerns, stop and split it — do not "finish it quickly since I'm already here".

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

So: if a change touches a component or anything the player sees, **Ibra verifies it in the
browser before it is committed.** State plainly what to click and what a correct result looks
like. Do not commit on the assumption it works.

Multiplayer needs two browsers (normal + incognito — same-origin `localStorage` is shared
between tabs, so two tabs is not a valid multi test).

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

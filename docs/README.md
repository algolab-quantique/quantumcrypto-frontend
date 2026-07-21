# docs/ — Reader's Guide

> One screen to know which document is the law, which is history, and which is
> an idea. Rule of the shelf: **the tree holds what you must be able to
> discover; git history holds what you'd only retrieve knowing it existed.
> Reasoning ages into value; status snapshots age into lies** (they get
> deleted — git keeps them forever anyway).

## 📜 The law — current, follow these

| Document | What it is |
|---|---|
| [shared-protocol-lifecycle-adr.md](shared-protocol-lifecycle-adr.md) | **AXIS A — the architecture reference (ACCEPTED, July 2026).** Session lifecycle, adapter contract, `detectSession`, the Navigation Invariant (§11), the Solo/Multi Parity Principle (§11), Eve semantics (§12), standing policies (§13). E91/DPS replicate against this. **Governs where data goes — not what the simulation computes.** |
| [protocol-physics.md](protocol-physics.md) | **AXIS B — the quantum simulation itself (OPEN, July 2026).** Encoding, measurement, Eve, sifting. Why there is no single source of truth today (the same primitive written out 4× each), how the codebase got there (verified via git), the target `lib/{protocol}/protocol.ts` structure, and the BB84 Eve bug that opened the file. |
| [testing-strategy.md](testing-strategy.md) | **The testing law (ACCEPTED).** Vitest, colocated tests, phased scope, CI, and the rule: every hand-found bug's fix commit carries its test. |

> **Two axes, easy to confuse.** The lifecycle ADR asks *"where does this data go, and does it
> survive a refresh?"*. It never asks *"is the number in it physically correct?"*. A protocol
> can be fully lifecycle-conformant and still simulate the wrong physics — BB84 was, for 22
> months. Read both.

The **live task tracker** is [`tasks_todo.md`](../tasks_todo.md) at the repo root.

## 📚 History — the reasoning that produced the law (do NOT follow as spec)

| Document | What it is |
|---|---|
| [architecture-analysis.md](architecture-analysis.md) | The June 2026 deep audit of the codebase that motivated the ADR — including paths considered and rejected. Answers "why not X?". |
| [architecture-discussion-log.md](architecture-discussion-log.md) | The three-way debate (Ibra + two AI reviewers) that shaped the ADR. |
| [storage-architecture.md](storage-architecture.md) | Pre-ADR storage/hydration/reconnection reasoning + per-protocol audit. Unique content until its planned Phase-6 rewrite. |

## 💡 Ideas — not decided

| Document | What it is |
|---|---|
| [product-vision-game-experience.md](product-vision-game-experience.md) | Draft product/UX ideas ("from protocol forms to playable learning") for future discussion. |

## 🗑️ Deleted from the shelf (retrievable via git, forever)

- `tasks_archived.md` — frozen statuses of completed tasks (2026-07-17). The story of every completed task lives in the commit history. Read it back: `git show 6bd4ee9:docs/tasks_archived.md`
- `protocol-session-lifecycle-diagrams.md` — preliminary diagrams, fully superseded by the ADR's §4 (2026-07-17).

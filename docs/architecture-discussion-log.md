# Architecture Discussion Log

> **Date**: June 2026  
> **Participants**: Developer (Ibra), Claude Opus 4 (architecture proposal), Codex/ChatGPT 5.5 (reviewer)  
> **Outcome**: [shared-protocol-lifecycle-adr.md](shared-protocol-lifecycle-adr.md) (since ACCEPTED, July 2026)
> **Historical document** — the debate that produced the ADR; do not follow as a spec.

This document records the key decisions and disagreements from the architecture
review discussion. It is kept so a future contributor can understand **why**
certain decisions were made, not just **what** was decided.

---

## Context

The developer requested a clean architecture for the QuantumCrypto frontend with
one shared lifecycle rule for BB84, E91, DPS, and future protocols. Claude Opus 4
performed a deep codebase investigation
([architecture-analysis.md](architecture-analysis.md)) and proposed an adapter-based
architecture. Codex/ChatGPT 5.5 reviewed the proposal and challenged several
points. The developer mediated the discussion.

---

## Key Decisions

### 1. Adapter Pattern: Approved ✅

**Consensus across all three parties.** A `ProtocolAdapter` interface with plain
TypeScript objects (not OOP classes) is the right approach for React + Zustand.

- Claude proposed it.
- Codex agreed but wanted a smaller initial scope.
- Developer approved: "An 8-field adapter that removes duplicated lifecycle code
  does pay rent."

### 2. `saveCheckpoint()`: Keep it ✅

**Initial proposal**: Include `saveCheckpoint()` in the lifecycle service.

**Codex challenge**: "May be unnecessary now because stores already persist with
`updateAndStore()`."

**Claude initially agreed** to drop it.

**Developer pushed back**: "If the file has this, so this should be replaced by
this idea... in the future it will be logic where to search for function or code,
not we think it should be here, then we don't find it since it was working inside
files."

**Final decision**: Keep `saveCheckpoint()`. Rationale:
- **Discoverability** — a future developer asks "where does saving happen?" and
  finds one named function, not 20 scattered `updateAndStore()` calls.
- **Extensibility** — when backend snapshot sync arrives, this is the named door
  where it plugs in.
- **Consistency** — the lifecycle has start/restore/complete/abandon, it should
  have save.
- In Phase 1, it is a thin wrapper. It earns its place by being findable.

### 3. Phase 1 Adapter Scope: Small ✅

**Claude's initial proposal** had ~15 fields including `events`,
`getInitialRoomState()`, `getInitialProgressState()`, `getConstants()`.

**Codex challenge**: "Full adapter with events/constants/initial states is too
much for phase 1."

**Final decision**: Phase 1 adapter has **8 core fields**:
`protocolId`, `storageKeys`, `gameDataKey`, `playerDataKey`, `resetRoom`,
`restoreRoom`, `resetProgress`, `hydrateProgress`. Plus 3 store accessors.

Events, constants, and initial state factories move to Phase 5 (socket refactor).

### 4. No Separate `StorageService` or `SocketService` in Phase 1 ✅

**Claude's initial proposal** had `StorageService`, `SocketService`, and
`ProtocolEvents` as separate abstractions.

**Codex called this "enterprise ceremony."**

**Final decision**: No separate service classes in Phase 1. Storage helpers live
inside `lifecycle.ts`. Socket refactor belongs to Phase 5. The word "ceremony"
was accepted as fair criticism: abstraction that does not pay rent is ceremony.

### 5. Socket Provider: Touch LAST ✅

**All three parties agreed.** The 1,556-line socket-provider is the riskiest
file. Refactoring it before the lifecycle adapters are proven is "gambling."

Phase 5 only, after BB84/E91/DPS lifecycle migrations are committed and tested.

### 6. Don't Merge Game Stores or Progress Stores ✅

**Claude proposed** leaving them separate (they are small, ~35 and ~145 lines).

**Codex agreed**: "Duplication is cheaper than abstraction here."

**Final decision**: Keep them separate. Revisit only if a 4th protocol arrives
and the pattern becomes clearly wasteful.

### 7. No OOP Classes ✅

**Unanimous.** React + Zustand is functional-first. TypeScript interfaces +
adapter objects + generic helper functions give the same contract benefits without
fighting the framework.

### 8. Incremental Phases with Compile/Test Gates ✅

**Claude proposed** 6 phases.

**Codex insisted** on compile/test checkpoints between phases.

**Developer confirmed**: "We can be ambitious and still move like engineers, not
gamblers."

**Final decision**: Each phase must compile and pass manual testing before the
next one begins. If BB84 migration (Phase 2) makes things worse, stop and fix
before touching E91.

### 9. Commits Should Compile ✅

**Codex said**: "I do not like 'it may not compile at each commit.' On a private
branch, WIP is fine locally, but pushed commits should ideally compile."

**Developer initially considered allowing non-compiling commits on the
architecture branch**, but accepted Codex's point.

**Final decision**: Pushed commits should compile. Local WIP can be messy.

---

## What Was Explicitly Rejected

| Rejected Idea | Reason |
|---------------|--------|
| OOP class inheritance (`class BB84Store extends BaseProtocolStore`) | Fights React/Zustand |
| One generic room store for all protocols | Room state shapes are fundamentally different; generic = `Record<string, any>` mess |
| One universal socket handler | Play-room events are inherently protocol-specific |
| Big-bang refactor (all at once) | "Engineers, not gamblers" |
| `StorageService` / `SocketService` in Phase 1 | Ceremony that does not pay rent yet |
| Another vague planning doc without decisions | "One final ADR that replaces the scattered docs" |

---

## Open Questions (Not Yet Resolved)

These remain open for future discussion:

1. **Backend snapshots**: The long-term plan calls for backend room snapshots on
   reconnect. Is the backend team working on this? It affects how much we invest
   in the local-only restore path.

2. **Game stores**: If a 4th protocol arrives, should the 3 identical game stores
   (~35 lines each) be merged into a generic factory? Currently decided: keep
   separate, revisit later.

3. **Progress stores**: Same question for the ~95% identical progress stores
   (~145 lines each). Currently decided: keep separate, revisit later.

---

## Document Relationships

```
docs/
├── architecture-analysis.md                 ← Deep codebase investigation (this led to the ADR)
├── architecture-discussion-log.md           ← This file: 3-way review decisions
├── shared-protocol-lifecycle-adr.md         ← Draft candidate architecture plan
├── storage-architecture.md                  ← Historical per-protocol audit (points to ADR)
├── protocol-session-lifecycle-diagrams.md   ← (deleted 2026-07-17; superseded by ADR §4)
├── product-vision-game-experience.md        ← Product/UX vision (separate concern)
└── tasks_archived.md                        ← (deleted 2026-07-17; history lives in git)
```

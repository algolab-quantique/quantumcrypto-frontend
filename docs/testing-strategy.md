# Testing Strategy

> **Status**: ACCEPTED (Ibra, July 2026) — Task 47.
> **Motivation**: "We discover bugs by chance, and this is not good at all" (Ibra,
> 2026-07-16). The July 2026 bug harvest was entirely chance-found by manual play:
> the missing key-sacrifice step (Task 53 — protocol-core, present since the
> beginning), the Eve flag conflation (Task 51), the validation-cap restart loop,
> the equal-count empty-key edge, the stale basis inputs. Every one of them was a
> few-line unit test away. This document turns "found by chance" into "checked by
> machine on every change".

---

## 1. Decision: Vitest

We use **[Vitest](https://vitest.dev)** as the test runner.

### Why Vitest

| Criterion | Vitest |
|---|---|
| TypeScript + our `@/` path aliases | Works nearly zero-config (one small `vitest.config.ts`) |
| Speed | esbuild-powered; the whole phase-1 suite runs in ~1 s; instant watch mode |
| API familiarity | **Jest-compatible** (`describe` / `it` / `expect`) — anyone who knows Jest knows Vitest |
| ESM / modern stack | Native; no transform gymnastics |
| Next.js blessing | Officially documented by Next.js as a first-class setup |
| Browser APIs for unit tests | `happy-dom` environment provides `localStorage` etc. without a real browser |

### Alternatives considered (and why not)

- **Jest** — the historical standard; perfectly capable, but needs more plumbing
  with Next + TS (`next/jest` transform config), is slower, and its ESM support
  is still awkward. Extra setup for no gain over Vitest.
- **Node built-in runner (`node:test`)** — zero dependencies, but no TS out of
  the box, fewer features, least familiar to future contributors.
- **Bun test** — fast, but requires the Bun runtime; not our toolchain.
- **Playwright / Cypress** — a *different layer*: end-to-end browser tests (real
  clicks, real navigation). Complementary later (phase 3), not a substitute for
  the unit layer.

### Dev dependencies

`vitest`, `happy-dom` (light fake DOM/storage). The `@/…` import aliases are
resolved natively (`resolve.tsconfigPaths: true` in `vitest.config.ts`).
Nothing enters the production bundle.

---

## 2. Structure and conventions

**Tests are colocated**: `foo.test.ts` sits next to `foo.ts`. The test *documents
the module's contract* one file away from it; Vitest picks up `*.test.ts`
automatically and the Next build ignores them.

```
vitest.config.ts                             # aliases + happy-dom environment
lib/protocol-lifecycle/lifecycle.ts
lib/protocol-lifecycle/lifecycle.test.ts     # ← beside its module
lib/bb84/solo-round.ts
lib/bb84/solo-round.test.ts
lib/bb84/utils.test.ts
lib/bb84/solo-player.test.ts
```

Conventions:
- One `describe` block per exported function; test names state the CONTRACT
  ("broken multiplayer identity is corrupt, never solo"), not the implementation.
- `localStorage` and Zustand stores are reset in `beforeEach` — every test starts
  from a blank world.
- Randomness (`Math.random`) is stubbed (`vi.spyOn`) when a test needs a
  deterministic draw; otherwise tests assert shapes/lengths, not exact values.
- Run with `npm test` (one-shot, CI-friendly) and `npm run test:watch` (dev).

---

## 3. Scope — phased, like everything else in this repo

### Phase 1 (NOW): pure logic — the protocol and lifecycle core

No React, no sockets, no browser. Exactly the files where the July bugs lived:

| File under test | What its tests lock in |
|---|---|
| `lib/protocol-lifecycle/lifecycle.ts` | **`detectSession`**: the full classification matrix (none / corrupt / solo / multi × completed; DPS-solo compat gated to `protocolId === 'dps'`; broken multi identity ⇒ corrupt, never fake solo; orphan multi ⇒ corrupt). **`restoreCheckpoint`**: missing/corrupted/active/completed; requires a REAL checkpoint (never synthesizes from the DPS marker). **`startFresh` / `abandon`**: clear every `storageKeys` entry, reset mode flags. *Protects all three protocols at once.* |
| `lib/bb84/solo-round.ts` | `restartSoloRound` preserves config and the Eve DRAW (and `withoutEve` zeroes presence only — the flow flag survives); rounds increment; stale `bb84BobBasisInputs` cleared; Bob gets generated photons, Alice gets her transcript; the Eve record lifecycle (start/detected/rounds). |
| `lib/bb84/utils.ts` | **`sacrificeValidationBits`** — key shrinks by exactly the validation indices; no-op without validation. *The test that would have caught Task 53 years ago.* |
| `lib/bb84/solo-player.ts` | Generators produce correct shapes/lengths; `mimicEveIntercept` outputs valid photons of the same length; `getValidBits` sifts by basis match. |

≈ 35 assertions. The `detectSession` matrix already exists (it was verified as a
throwaway script during Task 48 Slice B) — phase 1 makes it permanent.

### Phase 2 (later): component tests

React Testing Library on the high-value components (restart dialogs, results
table, guards) — decided and scoped when we get there.

### Phase 3 (later): end-to-end

Playwright for the flows we test by hand today (browser Back/Forward chains,
solo/multi rounds). Could eventually replace the manual two-browser ritual.

### CI — ACTIVE (2026-07-17)

`.github/workflows/tests.yml`: on every push and pull request, GitHub runs
`npm test` + `tsc --noEmit` + `npm run lint` on a clean machine and marks the
commit ✓ or ✗ — "checked by machine" is true even when nobody remembers to
run it.

---

## 4. The rule going forward

**A bug found by hand gets a test when it is fixed.** The fix commit carries the
test that would have caught it. This is how the suite grows where it matters —
around real failure modes, not imaginary ones.

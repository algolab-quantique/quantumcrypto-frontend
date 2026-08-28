# Protocol Physics — the second axis

> **Status**: 🔴 PROBLEM STATED, work started (BB84 Eve fix done, extraction not started).
> **Opened**: 2026-07-20, after the BB84 Eve bug (tasks_todo Task 57).
> **Scope**: the quantum simulation itself — encoding, measurement, eavesdropping,
> sifting. **Not** session/storage lifecycle: that is
> [shared-protocol-lifecycle-adr.md](shared-protocol-lifecycle-adr.md).

---

## 1. Why this document exists

The project has been refactoring under one architecture document since June 2026. It is
easy — and wrong — to assume that document covers everything. It does not:

| Axis | What it governs | Where it lives | State |
|---|---|---|---|
| **A. Session & data lifecycle** | Where form data goes, refresh, restore, `startFresh`, `abandon`, storage keys, route guards | [shared-protocol-lifecycle-adr.md](shared-protocol-lifecycle-adr.md) | ACCEPTED; BB84 pilot complete; E91/DPS pending |
| **B. Protocol physics** | Photon encoding, measurement, Eve, sifting — *what the simulation computes* | **this document** | just opened |

**Axis A never inspected Axis B.** The lifecycle refactor asked "where does this data go
and does it survive a refresh?" — never "is the number in it physically correct?". That is
not a criticism of the ADR; it is a statement of its scope. But it means a protocol can be
fully lifecycle-conformant and still compute the wrong physics — which is exactly what BB84
was, for 22 months.

---

## 2. How the codebase got here (verified against git, not recollection)

| Fact | Evidence |
|---|---|
| Six contributors over ~2 years | `git log --format="%an" \| sort \| uniq -c` → chegrane 300, noblechap 40, Frederic 28, ZoubaGate 12, jeanfredericlaprade 2, Maxime Dion 1 |
| The app was built **multiplayer-first** | multiplayer paths date to the initial commit; solo arrives later, per protocol |
| **BB84 solo** predates the current maintainer | `2024-11-25 \| Frederic \| "Play solo"` created `lib/bb84/solo-player.ts` |
| **E91 solo** added by the current maintainer | `2025-12-08 \| chegrane` |
| **DPS solo** added by the current maintainer | `2026-01-07 \| chegrane` |
| The Eve bug is **as old as the repo** | `git log -S "eveIntercept" -- components/bb84/play-page/tabs/alice-exchange-tab.tsx` → `2024-09-03 \| Frederic \| "Initial commit"` |
| It reached solo by **copy-paste**, 3 months later | `git log -S "const basis = bases[index]" -- lib/bb84/solo-player.ts` → `2024-11-25 \| Frederic \| "Play solo"` |

**The shape of the problem:** each contributor added a mode or a feature and copied the
physics they needed into the file they were working in. Nobody owned the physics. The goal
of "add solo without breaking multi" was met — but it doubled every physics primitive
instead of sharing one.

---

## 3. Current state: there is no single source of truth

Two primitives define BB84. Both are written out by hand in **four** places each.

**Measurement** — photon + basis → bit:

| Location | Runs in |
|---|---|
| `lib/bb84/solo-player.ts:9` — inside `simulateBobExchange` | solo |
| `lib/bb84/solo-player.ts:78` — inside `mimicEveIntercept` (Eve measuring) | solo + multi |
| `components/bb84/play-page/tabs/bob-exchange-tab.tsx:166` — `measure()` | **solo + multi** |
| `components/bb84/play-page/tabs/alice-exchange-tab.tsx:265` — inside `eveIntercept` | solo + multi |

**Encoding** — bit + basis → photon (1=0/+, 2=1/+, 3=0/x, 4=1/x):

| Location | Note |
|---|---|
| `lib/bb84/solo-player.ts:54` — `generateAlicePhotons` | |
| `lib/bb84/solo-player.ts:90` — Eve's re-emission | **this is the line that was wrong** |
| `components/bb84/play-page/tabs/alice-exchange-tab.tsx:203` — `isValid()` | written as a *truth table* — a different shape of the same knowledge |
| `components/bb84/play-page/tabs/alice-exchange-tab.tsx:277` — Eve's re-emission | the duplicate |

### The naming caused the duplication

`lib/bb84/solo-player.ts` holds physics that multiplayer needs. Verified call-site audit:
multiplayer imports **nothing** from it. A developer working on a multiplayer tab has no
reason to open a file named *solo*-player — so they write the physics inline. That is how
`eveIntercept` and `measure()` were born.

> The file name is not a label on the problem. It is the cause of it.

The same disease exists in E91: `lib/e91/solo-player.ts` holds physics that the **backend**
duplicates in Python (`e91/consumers.py:480`, `:508`).

---

## 4. The rule (decided 2026-07-20)

Recorded as a standing policy in
[ADR §13.3](shared-protocol-lifecycle-adr.md) — *"Protocol physics: ONE implementation, and
the SENDER simulates the channel"*. Summary:

1. Physics lives in `lib/{protocol}/` — never in a component, never in the socket provider.
2. A component needing physics **imports** it. A component-local copy is a defect even if it
   currently behaves correctly.
3. Solo and multi call the **same** function. Mode differences are parameters, not second
   implementations.
4. The backend stays transport + orchestration (pairing, the `eve_present` draw, validation
   indices). **In multiplayer the transmitting client applies channel effects (Eve) before
   sending** — this is what lets one implementation serve both modes, since solo can never
   call the backend.
5. E91's backend physics is grandfathered, not endorsed — a migration target.

The rejected alternative (server-side Eve) and the accepted cost of this choice are argued
in full in ADR §13.3. The short version: solo physics is permanently frontend, so
backend-side multi physics *guarantees* two implementations in two languages — which E91
already demonstrates, bias-bug included.

---

## 5. Target structure

```
lib/bb84/
  protocol.ts     ← THE physics. Mode-agnostic. Imported by solo AND multi.
                    encodePhoton(bit, basis)     -> 1|2|3|4     [only encoding table]
                    measurePhoton(photon, basis) -> '0'|'1'     [only measurement rule]
                    interceptResend(photons)                    [Eve = measure + encode]
                    siftBits(bits, basesA, basesB)
                    randomBits(n) / randomBases(n) / encodePhotons(bits, bases)

  solo-round.ts   ← solo ORCHESTRATION only (who plays whom, restart, Eve record)
  utils.ts        ← key policy (isKeyTooShort, sacrificeValidationBits)
  eve-story.ts    ← results narrative
```

Consumers then import primitives instead of re-deriving them:
`bob-exchange-tab.measure()` → `measurePhoton`; `alice-exchange-tab.isValid()` →
`encodePhoton(bit, basis) === polar`; Eve built from the two primitives.

**Why this matters more than the bug fix:** the fix repaired one instance of "re-emitted in
the wrong basis". Building Eve *from* `encodePhoton` makes that class of error
unrepresentable — there is only one place that knows how a measurement becomes a photon.

---

## 6. The bug that opened this file

`mimicEveIntercept` re-emitted using `bases[index]` — the 2-element alphabet `['+','x']` —
instead of `eveBases[index]`, Eve's drawn bases. Indices ≥ 2 read `undefined`, no branch
matched, and a dangling `else` returned a constant photon `4`. Eve measured, then discarded
her result.

- **Effect**: ~50% error per sifted bit instead of the textbook 25% — the app over-taught
  "Eve always gets caught". Detection at production settings ran ~93% where BB84 predicts 68%.
- **Scope**: both modes. Solo-as-Bob via `mimicEveIntercept`; solo-as-Alice **and all
  multiplayer** via the duplicate `eveIntercept`.
- **Why nothing caught it**: `bases` is a valid in-scope `string[]`; `noUncheckedIndexedAccess`
  is not enabled (`tsconfig.json` has `strict` but that flag is not part of it), so
  `bases[19]` types as `string`; the dangling `else` turned `undefined` into a *plausible*
  photon; and the existing test asserted only length and value-domain — which the broken
  output satisfies.

**Reproduce in the browser** (works on any unfixed build): solo, role **Bob**, Eve
probability 1, 20 photons, type `x` in every basis row. Buggy: `alicePhotons` reads
`[1, 3, 4, 4, 4, …]` and every measurement from row 3 on is `1`. Fixed: both vary.

**The test that would have caught it** (now in `lib/bb84/solo-player.test.ts`): pin
`Math.random` to force Eve's basis, then assert the physics invariant — *measuring in `+`
can only re-emit `+` photons (1 or 2)*.

---

## 7. Status and plan

Tracked in [`tasks_todo.md`](../tasks_todo.md) **Task 57** (findings A–J) and **Task 52**
(E91 Eve audit, 52-C…52-F).

| Slice | What | Status |
|---|---|---|
| 0 | ADR §13.3 + §12 correction | ✅ done 2026-07-20 |
| 1 | Eve fix + 5 regression tests | ✅ done 2026-07-20 (uncommitted at time of writing) |
| 2 | Delete the private `eveIntercept`; import the shared one | ⏳ next — **this is what fixes multiplayer** |
| 2.5 | Extract `protocol.ts`; all consumers import primitives | ⏳ the real repair |
| 3 | Remove the two dead imports | ⏳ |
| 4 | Physics-contract test suite | ⏳ |

**Open sequencing question (for Ibra):** whether to finish Axis B for BB84 *before* starting
the Axis A migration for E91/DPS. The argument for physics-first: E91 and DPS will be opened
and edited during their lifecycle migration, and their physics is already known to have
problems (E91 52-C…52-F; DPS has no solo Eve at all) — touching those files twice is waste.
The argument against: Axis A has momentum and a proven pilot.

---

## 8. Verify any claim here yourself

```bash
# every copy of the measurement rule
grep -rn "photon == 1 && basis\|photon == '1' && basis" --include="*.ts" --include="*.tsx" lib/ components/

# every copy of the encoding rule
grep -rn "=== '0' && basis === '+'\|bit === '0' && basis === '+'" --include="*.ts" --include="*.tsx" lib/ components/

# does multiplayer import anything from lib/bb84/solo-player?
grep -rn "solo-player" --include="*.tsx" components/bb84/

# does the backend do BB84 physics? (expect: nothing)
grep -rn "photon" --include="*.py" ../quantumcrypto-backend/ | grep -v photon_number

# E91's Python twin of the frontend physics
sed -n '480,530p' ../quantumcrypto-backend/e91/consumers.py
```

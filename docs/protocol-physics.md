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

## 8. Why validation bits are capped at n/4 (measured, 2026-08-28)

Both BB84 modals cap validation bits at `photonNumber / 4`. Ibra asked the right question — *on
what basis?* — and the honest answer has two halves: **the ratio is not derived from BB84 theory,
but the cap is justified by measurement.** Written here because the reasoning previously lived only
in a code comment and would have been lost.

**What the cap really says.** Validation bits are sacrificed from the **sifted** key, not from the
photon count:

```
n photons → Bob's basis matches Alice's ~half the time → sifted ≈ n/2
            validation bits are taken FROM the sifted key
            final key = sifted − validation
```

So `v = n/4` means **"sacrifice about half of the sifted key"**. It is expressed against `n` only
because that is what the form asks the student for.

**Why not n/2.** `isKeyTooShort` (`lib/bb84/utils.ts`) restarts the game when
`sifted ≤ validation`. Sifted length is random — `Binomial(n, ½)` — so a cap set at the *average*
fails about half the time. Measured over 200 000 games per row:

| n | cap | v | P(restart) | avg final key | P(catch Eve) = 1−(¾)ᵛ |
|---|---|---|---|---|---|
| 16 | **n/2** | 8 | **59.9%** | 2.0 | 90% |
| 16 | **n/4** | 4 | **3.8%** | 4.2 | 68% |
| 16 | n/8 | 2 | 0.2% | 6.0 | 44% |
| 30 | n/2 | 15 | 57.3% | 2.5 | 99% |
| 30 | **n/4** | 7 | **0.2%** | 8.0 | 87% |

An `n/2` cap makes roughly **six games in ten restart before the student can play** — which matches
what Ibra hit by hand (6 photons / 3 validation ⇒ ~66% restart).

**The honest caveat.** `n/4` is a round number chosen as a compromise, not a security bound. It
keeps restarts rare (0.2–5%), leaves a usable key, and still detects Eve ~68% of the time at the
production minimum. For contrast, the Qiskit BB84 reference (Task 57 finding K) sacrifices **20%**
of the sifted key, and real QKD derives the fraction from statistical confidence bounds rather than
a fixed ratio.

**The teaching point currently invisible to students:** more validation bits ⇒ better chance of
catching Eve, but a shorter key. That tradeoff *is* the BB84 lesson, and the UI states only the
cap. See Task 59.

## 9. Verify any claim here yourself

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

---

## 10. E91 — the protocol, and how we simulate it without Qiskit

> **Status**: 🔴 SPEC WRITTEN 2026-09-11, implementation not started.
> **Why it exists**: E91's simulation was translated from the Python backend
> (`eveGeneratedBits` 2024-11-07 → `solo-player.ts` 2025-12-08) and both copies are wrong
> in the same way. This section is the **contract** both implementations must satisfy, so
> that a future divergence is a failing test rather than a discovery 22 months later.
> **Source of truth**: `CMAI-E91` (Ibra's own Qiskit workshop — real circuits on Aer).
> Anything here that contradicts that repository is a bug in this document.

### 10.1 The setup

A **source** produces entangled pairs and sends one particle to Alice and one to Bob. They
each choose a measurement basis *independently and at random*, and measure.

**E91 has no sender and no receiver.** This is the structural difference from BB84, and it
has two consequences that the code must respect:

- **The source is a role, not a person.** It can be a third party, or Alice, or Bob — or
  Eve. So a function that produces a pair is not "Alice cheating"; it is the source doing
  its job, and *who calls it is outside the physics*.
- **Alice and Bob do the same thing.** There is no first mover in the protocol. Any
  ordering in our code is an implementation detail, never a rule.

### 10.2 Bases

Four measurement angles, 45° apart. Alice draws from three, Bob from three, overlapping in
two — the overlap is what produces the key.

| id | angle | Alice | Bob |
|---|---|---|---|
| `1` | 0° | ✅ | |
| `2` | 45° | ✅ | ✅ |
| `3` | 90° | ✅ | ✅ |
| `4` | 135° | | ✅ |

- **Key pairs** — the bases match: `(2,2)` and `(3,3)`. Perfect correlation, so the two
  sides hold the same bit.
- **CHSH pairs** — Alice `{1,3}` × Bob `{2,4}`: `(1,2)`, `(1,4)`, `(3,2)`, `(3,4)`.
- **Discarded** — the remaining three: `(1,3)`, `(2,3)`, `(2,4)`. Nine combinations in all:
  2 key + 4 CHSH + 3 discarded.

⚠️ **The pair is ordered, Alice first.** `(3,2)` is a CHSH pair; `(2,3)` is discarded. They
are different combinations, not two spellings of one — a symmetric lookup silently turns
three discarded pairs into CHSH data.

**Bell test:**

```
S = E(1,2) − E(1,4) + E(3,2) + E(3,4)
```

where `E(a,b) = P(same) − P(different)` over the pairs measured in that basis combination.

### 10.3 The one physical rule

Everything below rests on **one** formula, and it answers one question: *a measurement at
angle θ₁, against a state defined at angle θ₂ — how often do they disagree?*

```
P(disagree) = sin²( (θ₁ − θ₂) / 2 )
```

| Δ | P(disagree) | meaning |
|---|---|---|
| 0° | **0.000** | same angle → always agree |
| 45° | 0.146 | |
| 90° | **0.500** | perpendicular axes → pure coin flip |
| 135° | 0.854 | |

It is used in **both** situations, which is why there is only one rule to get right:

- **an intact pair** — "the state defined at θ₂" is the other party's measurement, so the
  formula gives the |Φ⁺⟩ correlation `E(a,b) = cos(θₐ − θ_b)` (spin-½ convention);
- **a pair Eve resent** — "the state defined at θ₂" is the product state she prepared, so
  the formula gives how far each side drifts from what she sent.

**BB84 is the same rule, evaluated at only two angles.** Its two bases are 90° apart, so
`measurePhoton` only ever needs Δ = 0° (returns the encoded bit) and Δ = 90° (returns a coin
flip) — which is exactly why it can be an `if/else` and E91 cannot.

> ⚠️ `lib/e91/solo-player.ts` contains `PROBABILITY_THRESHOLD = sin²(π/8) ≈ 0.1464`. That is
> **not a constant** — it is this function evaluated at Δ = 45°, frozen, and then applied to
> *every* mismatched pair. It is why the 90° pairs are wrong (0.854 where physics says
> 0.500) and why the file reads as magic numbers. The replacement has the function; the
> constant disappears.

### 10.4 The pair, without Qiskit

CMAI's `create_list_bell_pairs(n)` returns **n identical quantum circuits** — a pair that
nobody has measured yet. That object is what lets Eve intercept *before* Alice and Bob
measure. We cannot run circuits, so we need the same handle carrying the same information —
which, for an undisturbed pair, is **none**:

```
Pair = Entangled                      // intact. carries nothing: no bits exist yet
     | Resent { angle, bit }          // Eve measured at `angle`, got `bit`, re-prepared both
```

`Resent.bit` is **what Eve prepared**, not what Alice or Bob will read. They read it only if
they happen to measure at her angle; otherwise they disagree with probability sin²(Δ/2).

**This is the piece missing from the current code, and the reason Eve could not be written
correctly.** Today `onMeasurement` draws one side's bits as a fair coin *first*, then fits
the other side to them — so by the time Eve would act there is no pair in flight to
intercept. All that remains is to fabricate the second side from its bases alone, which is
precisely what `eveGenerateBits(bases)` does. **The Eve bug is not a wrong formula; it is a
missing object.**

### 10.5 The pipeline

Each step: what the protocol says, then what we do. Names are CMAI's, translated to this
codebase's camelCase (Python is snake_case; TypeScript is camelCase — same wording, same
signature).

**1 — Create the pairs.** *The source emits n entangled pairs.*
CMAI `create_list_bell_pairs(n)` → ours `createEntangledPairs(n)`. **One parameter.** It
cannot depend on anyone's bases: the pairs exist before anyone has chosen one.

```
createEntangledPairs(n) -> [Entangled, Entangled, ...]   // n identical
```

**2 — Choose bases.** *Alice and Bob each pick randomly and independently.*
CMAI `generate_random_bases(n, options)` → ours `generateRandomBases(n, options)`.

```
generateRandomBases(n, options) -> [basis, ...]          // options = ALICE_BASES | BOB_BASES
```

> The current `generateBases(n, isAlice)` takes a **boolean** that selects a hidden array,
> with two wrapper functions passing it. Passing the basis list instead removes the role
> coupling — which is 10.1's point in code.

**3 — Eve intercepts (optional).** *She measures the pair in a basis of her choosing, which
destroys the entanglement, then re-prepares and forwards a product state.*
CMAI `create_eavesdropped_state(pair)` → ours `eveInterceptAndResend(pair)`. **Pair in, pair
out** — interception and resend are one step because physically they are.

```
eveInterceptAndResend(pair):
    angle ← uniform random from {0°, 45°, 90°, 135°}
    bit   ← measureOneSide(pair, angle)          // what she actually reads
    return Resent{ angle, bit }                  // what she forwards to both sides

measureOneSide(pair, θ):
    if pair is Entangled:    return fair coin             // 50/50 in every basis — see below
    else:                    return pair.bit flipped with probability sin²((θ − pair.angle)/2)
```

> `measureOneSide` is the single-particle half of the rule in 10.3, and giving Eve it —
> rather than an unconditional coin — is what makes her `pair` argument mean something. On
> an intact pair the two are identical, so it changes **no** number in 10.6. It matters for
> two reasons: the function becomes **total** (a resent pair is a legal input, so a second
> eavesdropper or a re-run degrades correctly instead of silently re-randomising), and it
> keeps interception expressed as *measure the thing you were given*, which is the property
> the current code lost.

> **Why her read is 50/50 regardless of basis, unlike BB84.** In BB84 Alice *prepares* the
> photon, so "Eve's basis matches the photon's basis" is a real question. In E91 nobody
> prepares anything — an entangled particle has no basis and no value until measured, so
> every basis gives her a fair coin. What her choice *does* determine is the angle the pair
> collapses along, and therefore how much of Alice–Bob's correlation survives.
>
> She may measure one particle or both: measuring one collapses the other, so as long as she
> uses **one basis per pair** the statistics are identical. CMAI measures both.

**4 — Measure.** *Both parties measure the same pair, each in their own basis.*
CMAI `measure_bell_pair(pair, a, b)` → ours `measurePair(pair, aBasis, bBasis)`.

```
measurePair(pair, aBasis, bBasis):
    θa, θb ← angles of aBasis, bBasis
    if pair is Entangled:
        aliceBit ← fair coin
        bobBit   ← aliceBit flipped with probability sin²((θa − θb)/2)
    else:                                        // Resent{angle, bit}
        aliceBit ← bit flipped with probability sin²((θa − angle)/2)
        bobBit   ← bit flipped with probability sin²((θb − angle)/2)
    return { aliceBit, bobBit }
```

> **On the `Entangled` branch drawing Alice first:** two binary outcomes are completely
> determined by their two marginals and their correlation, so "fair coin, then flip against
> sin²(Δ/2)" produces *exactly* the joint distribution of a simultaneous measurement. It is
> an implementation order, not a physical claim, and it does not make Alice the sender
> (10.1). Both sides come out of **one** call on **one** pair — which is the property the
> current code lacks.

**5 — Sift.** *Compare bases publicly; split the results.*
CMAI `extract_e91_key_and_bell_test_data(...)` → ours `siftKeyAndBellData(...)`.
Same basis → key bit. A CHSH pair → Bell-test data. Everything else → discarded.

**6 — Bell test.** CMAI `calculate_correlations` / `calculate_chsh_value` → ours
`correlations(...)` / `chshValue(...)`. Compute the four `E(a,b)`, combine per 10.2.

**7 — Verdict.** *Compare S against the classical bound.* **We deliberately have no
threshold constant: the student reads the pairs and decides.** At 10–30 photons that is the
only honest design — see 10.7 — but the game must *say so*, which it does not (**Task 68**).

### 10.6 Acceptance numbers — the contract

Both implementations must reproduce these. They are **measured, not asserted**: the
pseudo-code in 10.5 was transcribed literally into a script and run over 200 000 pairs per
figure, giving S = 2.831 / 1.410, key errors 0.0 % / 25.0 %, and every per-basis marginal
between 0.498 and 0.500. So this table is not an aspiration — it is what 10.5 *does*, and
any implementation that disagrees has departed from the spec rather than from an opinion.

| | no Eve | with Eve |
|---|---|---|
| **S** | **2√2 ≈ 2.828** | **√2 ≈ 1.414** (≤ 2 ⇒ Bell restored) |
| errors on key pairs `(2,2)`, `(3,3)` | **0 %** | **25 %** — same as BB84's intercept-resend |
| P(bit = 1), each side | 50 % | 50 % |
| **P(bit = 1) per basis, each side** | **50 %** | **50 %** |

The last row is the regression guard for the bug being fixed: today basis `2` returns `0`
**100 %** of the time and bases `1`/`3` do so 85 % of the time. A test that only checks the
overall marginal would pass on biased-but-balanced output; the per-basis test would not.

### 10.7 Deliberate deviations, stated so they are not mistaken for bugs

1. **No state vectors, no circuits.** We reproduce the measurement *statistics*, not the
   quantum state. Legitimate because every observable in E91 is a measurement statistic.
2. **|Φ⁺⟩, not the singlet |Ψ⁻⟩** that CMAI uses. With |Φ⁺⟩ matching bases give *identical*
   bits, so the key needs no inversion and the app's existing sign convention for S holds.
   Decided by Ibra, 2026-09-10.
3. **10–30 photons, where CMAI uses 2000.** Only 4 of 9 basis combinations are CHSH pairs,
   so at 20 photons each correlation rests on ~2 pairs and **S = 2.83 ± 1.4** — it can land
   below 2 with no Eve present. CMAI's |S| > 2.5 threshold is sound at ±0.13 and impossible
   here. **Decision (Ibra, 2026-09-10): do not raise the count — explain it** (Task 68).

### 10.8 Verify any claim here yourself

```bash
# the angles, bases and CHSH pairs, in the authoritative source
sed -n '18,22p' ../../CMAI-E91/Part_2_E91/utils/chsh_core.py     # CHSH bases
grep -n "ALICE_BASES\|BOB_BASES\|CHSH_BASIS_PAIRS" ../../CMAI-E91/Part_2_E91/02_E91_Protocol_SOLUTION.ipynb

# Eve, as the reference implements her
grep -n "def create_eavesdropped_state" -A 20 ../../CMAI-E91/Part_2_E91/utils/chsh_core.py

# the two copies being replaced
grep -n "eveGenerateBits\|PROBABILITY_THRESHOLD" -A 25 lib/e91/solo-player.ts
grep -n "def eveGeneratedBits" -A 20 ../quantumcrypto-backend/e91/consumers.py

# which came first (expect: Python 2024-11-07, TypeScript 2025-12-08)
git log --reverse --format="%ad %s" --date=short -- lib/e91/solo-player.ts | head -1
```

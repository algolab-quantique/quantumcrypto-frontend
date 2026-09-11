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

## 10. E91

Two halves, deliberately separated:

- **10.1 – 10.6 — the protocol.** What E91 *is*. No code, no repository, no language.
  Anyone who knows quantum mechanics should be able to check it, and anyone who does not
  should be able to follow it.
- **10.7 – 10.11 — our adaptation.** What we build instead, because a browser cannot run a
  quantum circuit, and **why each choice preserves the protocol above**.

---

### 10.1 The idea

A **source** produces pairs of entangled particles and sends one particle of each pair to
Alice and the other to Bob. Alice and Bob each pick a measurement angle at random,
independently, and measure their own particle.

Afterwards they announce **which angles they used** — never the results. Two things follow
from that announcement:

- where they happened to pick the **same angle**, their results are identical → those bits
  become the **shared key**;
- where they picked particular **different angles**, the results are used for a statistical
  test — the **CHSH/Bell test** — which reveals whether anyone tampered with the particles
  on the way.

The security does not come from hiding anything. It comes from the fact that **measuring an
entangled particle destroys the correlation**, and the Bell test measures that correlation.

**There is no sender and no receiver.** Alice and Bob do exactly the same thing. The source
is a *role*, not a person: it may be an independent third party, or Alice, or Bob — or even
Eve. Nothing in the physics depends on who holds it.

### 10.2 The angles

Each side picks from three angles. They overlap in two, and the overlap is what makes a key
possible.

| | angles available |
|---|---|
| **Alice** | **0°**, 45°, 90° |
| **Bob** | 45°, 90°, **135°** |

A round is described by the pair **(Alice's angle, Bob's angle)** — always in that order.
There are 3 × 3 = **9** possible combinations, and each has one of three fates:

| (Alice, Bob) | fate | why |
|---|---|---|
| **(45°, 45°)** · **(90°, 90°)** | **KEY** | same angle → results always identical |
| **(0°, 45°)** · **(0°, 135°)** · **(90°, 45°)** · **(90°, 135°)** | **CHSH** | the four terms of the Bell test |
| (0°, 90°) · (45°, 90°) · (45°, 135°) | discarded | neither |

The four CHSH combinations are exactly *Alice's CHSH angles* **{0°, 90°}** crossed with
*Bob's CHSH angles* **{45°, 135°}**.

> ⚠️ **The order is part of the identity.** `(90°, 45°)` is a CHSH round — Alice at 90°, Bob
> at 45°. `(45°, 90°)` is discarded — Alice at 45°, Bob at 90°. They are different rounds,
> not two spellings of one, because **45° is never one of Alice's CHSH angles**. This is why
> the literature writes Alice's angles as *a, a′* and Bob's as *b, b′*: the letter says whose
> it is, so the order can never be lost. Any lookup that treats the two as interchangeable
> silently promotes three discarded rounds into Bell-test data.

### 10.3 How correlated the two results are

Everything in E91 rests on one quantity: **how often do Alice's and Bob's results differ?**

For the entangled pairs used here, the answer depends only on the **difference between their
two angles**, written Δ:

```
P(different) = sin²( Δ / 2 )          Δ = Alice's angle − Bob's angle
```

| Δ | P(different) | what it means |
|---|---|---|
| **0°** | **0.000** | same angle → **always identical** ← this is what makes the key work |
| 45° | 0.146 | mostly the same |
| 90° | **0.500** | completely unrelated — a coin flip |
| 135° | 0.854 | mostly opposite |

> **Reading the key rows.** The key comes from `(45°, 45°)` and `(90°, 90°)`. In both,
> Δ = 45 − 45 = 0 and Δ = 90 − 90 = 0 — the **first row** of the table. Same angle,
> P(different) = 0, so Alice and Bob hold the same bit without ever exchanging it. The other
> rows are what happens for the combinations they *discard* or use for the Bell test.

This is the only physical rule in E91. Everything else — the key, the Bell test, Eve's
detectability — is a consequence of it.

### 10.4 The Bell test

For each of the four CHSH combinations, gather the rounds measured with those two angles and
compute a **correlation**:

```
E(a, b) = P(same) − P(different)        → +1 perfectly identical, −1 perfectly opposite
```

Combine the four into one number:

```
S = E(0°,45°) − E(0°,135°) + E(90°,45°) + E(90°,135°)
```

| value of \|S\| | meaning |
|---|---|
| ≤ **2** | the results could be produced by ordinary (classical) objects carrying pre-set values |
| up to **2√2 ≈ 2.83** | only genuine entanglement can do this |

Undisturbed pairs give **2√2**. That is the whole point: **a value above 2 is proof the
particles were still entangled when they arrived**, and therefore that nobody measured them
in between.

### 10.5 Eve

The attack E91 must survive is **intercept-and-resend**. Eve catches a pair before it
reaches Alice and Bob, measures it at an angle of her own choosing, and forwards ordinary
particles carrying what she read.

She cannot avoid being seen, and the reason is worth stating precisely:

1. **Her measurement destroys the entanglement.** What she forwards is no longer an
   entangled pair — it is two ordinary particles, each prepared along *her* angle.
2. **Alice and Bob almost never share her angle**, so their results now drift from what she
   sent, by exactly the rule in 10.3.
3. **Their correlation collapses**, and S falls from 2√2 to at most 2 — the classical range.
   The Bell test sees it.

> **Why her own result is a coin flip, whatever angle she picks.** This is the sharpest
> difference from BB84. There, Alice *prepares* each photon, so it carries a definite value
> in a definite basis, and "did Eve guess the right basis?" is a real question. In E91
> **nobody prepares anything**: an entangled particle has no value and no direction until
> someone measures it. So every angle she picks gives her a 50/50 result. What her choice
> decides is not what she learns — it is *the angle the pair collapses onto*, and therefore
> how much of Alice and Bob's correlation survives.
>
> She may intercept one particle or both. Measuring one collapses the other, so as long as
> she uses **one angle per pair**, both give the same statistics.

### 10.6 The protocol, end to end

```
1. the source makes n entangled pairs and distributes them
2. Alice picks n angles at random; Bob picks n angles at random — independently
   (if Eve is present she intercepts, measures, and forwards her own particles)
3. both measure their own particle
4. they announce their ANGLES only, and split the rounds:
        same angle          -> key bits
        a CHSH combination  -> Bell-test data
        anything else       -> discard
5. compute S from the Bell-test data
6. |S| close to 2√2 -> nobody listened, keep the key
   |S| at or below 2 -> the channel was tampered with, throw the key away
```

---

### 10.7 Our adaptation — the constraint

**A browser cannot run a quantum circuit.** There is no state vector, no simulator, and no
qubit. We have random numbers.

That is not fatal, because **every quantity E91 depends on is a measurement statistic.** The
key, the error rate and S are all counts of agreements and disagreements. If our simulation
produces the *same distributions* as the real thing, every conclusion a student draws from
it is the conclusion they would draw from a real experiment.

So the rule we hold ourselves to is:

> Reproduce the **statistics** of 10.1 – 10.6 exactly. Never reproduce them by a route that
> makes one of the protocol's steps impossible to express.

The second half matters as much as the first, and 10.8 is why.

### 10.8 Our adaptation — the pair

The protocol has a step that nothing else can substitute for: **Eve receives a pair that
nobody has measured yet, and forwards a different one.** To express that, a pair has to
*exist as a thing* between the moment the source makes it and the moment Alice and Bob
measure it. In a quantum library that thing is the circuit object. We do not have one, so we
define our own.

**What must it hold?** Only what a later measurement needs to know — no more:

| state | what it holds | why |
|---|---|---|
| **intact** | **nothing** | neither particle has a value or a direction yet. The only thing true of an undisturbed pair is *that it is undisturbed*, so every intact pair is interchangeable — which is exactly why a source can hand out n identical ones |
| **resent by Eve** | the **angle** she measured at, and the **bit** she read | she destroyed the entanglement and forwarded two ordinary particles prepared that way. Those two facts are the complete description of what Alice and Bob will receive |

**What can you do with it?** Three things, and nothing else:

| | |
|---|---|
| **measure one side** at an angle | → one bit |
| **measure both sides** at two angles | → two bits, correlated per 10.3 |
| **intercept it** | → a *new* pair: the one Eve forwards |

There is deliberately **no way to read bits out of a pair without measuring it**, because in
the protocol there is nothing to read. A pair is not a container of two bits waiting to be
collected; it is a thing that *produces* bits when measured, differently depending on the
angles used. Building it that way is what makes 10.5 expressible at all: `intercept` takes a
pair and returns a pair, exactly as Eve does.

> **Why "intercept" must take the pair it is given.** It would be simpler to have Eve just
> invent two bits. But then she is not intercepting anything — she is fabricating the round,
> and her behaviour no longer depends on what she received. Handing her the pair keeps the
> step honest, and keeps it composable: measuring a pair Eve already resent degrades it
> correctly instead of silently starting over.

### 10.9 Our adaptation — the steps

Language-independent. Each step names the protocol step it implements.

```
createEntangledPairs(n)                     -- 10.6 step 1
    return n intact pairs                      (identical: an intact pair carries nothing)

generateRandomBases(n, availableAngles)     -- 10.6 step 2
    return n angles drawn uniformly from availableAngles

measureOneSide(pair, angle)                 -- the single-particle half of 10.3
    if pair is intact:
        return a fair coin                     -- no value exists until measured (10.5)
    else:
        return pair.bit, flipped with probability sin²((angle − pair.angle) / 2)

interceptAndResend(pair)                    -- 10.5, Eve
    angle = a uniformly random angle
    bit   = measureOneSide(pair, angle)        -- she measures what she was given
    return a resent pair carrying (angle, bit)

measurePair(pair, aliceAngle, bobAngle)     -- 10.6 step 3
    if pair is intact:
        aliceBit = a fair coin
        bobBit   = aliceBit, flipped with probability sin²((aliceAngle − bobAngle) / 2)
    else:
        aliceBit = pair.bit, flipped with probability sin²((aliceAngle − pair.angle) / 2)
        bobBit   = pair.bit, flipped with probability sin²((bobAngle   − pair.angle) / 2)
    return (aliceBit, bobBit)

siftKeyAndBellData(results, aliceAngles, bobAngles)     -- 10.6 step 4
    same angle         -> key
    CHSH combination   -> Bell-test data, keeping both angles
    otherwise          -> discard

correlations(bellData) / chshValue(correlations)        -- 10.6 step 5
```

> **On `measurePair` giving Alice a coin first.** Two binary results are completely described
> by their two individual rates and their correlation. Drawing one fairly and the other
> against `sin²(Δ/2)` therefore produces *exactly* the joint distribution of two simultaneous
> measurements — it is an order of evaluation, not a claim that Alice measures first. Both
> bits come out of **one** call on **one** pair, which is what keeps step 3 a single act.

### 10.10 What our version must produce

Any implementation — in any language — is correct only if it reproduces these. They are
measured, not asserted: the pseudo-code in 10.9 was transcribed literally and run over
200 000 pairs per figure.

| | no Eve | with Eve | measured |
|---|---|---|---|
| **S** | 2√2 ≈ **2.828** | ≤ 2, in fact **√2 ≈ 1.414** | 2.831 / 1.410 |
| **key error rate** (same angle) | **0 %** | **25 %** | 0.0 % / 25.0 % |
| P(result = 1), each side | 50 % | 50 % | ✓ |
| **P(result = 1), for every single angle** | **50 %** | **50 %** | 0.498 – 0.500 |

The last row deserves its own test. A measurement result must be a fair coin **at every
angle taken separately**, not merely on average: a simulation can be balanced overall while
one angle always returns the same value, and a student would spot the eavesdropper by
staring at that angle instead of by the Bell test — which would defeat the entire lesson.

### 10.11 Choices we made, and why

| choice | why | consequence |
|---|---|---|
| Statistics, not state vectors | a browser has no simulator; every E91 observable is a statistic (10.7) | the physics is exact where it is observable, and absent where it is not |
| **\|Φ⁺⟩**, so matching angles give **identical** results | the key can be used directly, with no inversion step | a treatment using the singlet \|Ψ⁻⟩ would give *opposite* results on matching angles and require one side to flip. Both are valid E91; ours is the simpler one to play |
| Eve picks a **new random angle for every pair** | it is the strongest simple attack, and it is basis-independent | her disturbance is a uniform **25 %** at every angle. Letting her reuse one fixed angle would leave a per-angle signature a student could exploit — detectable, but for the wrong reason |
| **10–30 pairs**, where a real experiment uses thousands | the student sets each round by hand; it is a game, not a lab | **S is very noisy at this size** — with ~20 pairs each of the four correlations rests on about two rounds, so S ≈ 2.83 **± 1.4** and can fall below 2 with nobody listening. We do **not** raise the count. We explain it, and we let the student judge the rounds rather than a threshold judge for them |

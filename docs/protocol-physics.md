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
Alice and the other to Bob. Alice and Bob each pick a measurement basis — an **angle** — at
random and independently, and measure their own particle.

Afterwards they announce **which bases (angles) they used** — never the results. Two things follow
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

### 10.2 The measurement bases (angles)

Each side picks from three bases. A basis here *is* an angle, so the two words are used
interchangeably below — the literature uses both. The two sides overlap in two bases, and that
overlap is what makes a key possible.

| | bases (angles) available |
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

> ⚠️ **These are qubit (Bloch-sphere) angles, not physical polarizer angles.** On the Bloch
> sphere orthogonal states are **180°** apart, which is why the rule carries the **Δ/2**. A
> linear polarizer's orthogonal states are **90°** apart and Malus's law reads `sin²(Δ)` with
> no halving, so the same experiment built with polarizers uses **22.5°** steps — exactly half
> of ours. Both describe the same physics; ours is the convention the reference workshop uses
> (it rotates with `ry(−π/4)` for the 45° basis, a Bloch rotation). **Never mix the two**:
> applying Malus's law to our angles collapses S to 0.

> **Reading the key rows.** The key comes from `(45°, 45°)` and `(90°, 90°)`. In both,
> Δ = 45 − 45 = 0 and Δ = 90 − 90 = 0 — the **first row** of the table. Same angle,
> P(different) = 0, so Alice and Bob hold the same bit without ever exchanging it. The other
> rows are what happens for the combinations they *discard* or use for the Bell test.

#### The same rule, applied to a pair Eve prepared

The table above is for an **intact** pair, where the rule is applied **once**: Alice's result
is a fair coin and Bob's is taken against hers, so `P(Alice ≠ Bob) = sin²(Δ/2)` directly.

For a **product** pair the rule still holds, but it describes *one measurement against the
angle Eve prepared* — and it is applied **twice**, independently, once per side:

```
pₐ = sin²((θₐ − θₑ)/2)      p_b = sin²((θ_b − θₑ)/2)
P(Alice ≠ Bob) = pₐ(1 − p_b) + p_b(1 − pₐ)      ← they differ if exactly ONE of them flipped
```

**So Alice and Bob do NOT obey `sin²((θₐ − θ_b)/2)` with each other once Eve has been
there** — and that difference is precisely how she is caught. Take matching bases,
θₐ = θ_b = 45°, where an intact pair can *never* disagree:

| Eve measured at | each side flips with | Alice ≠ Bob |
|---|---|---|
| 45° — she guessed their basis | 0.000 | **0 %** |
| 0° or 90° | 0.146 | **25 %** |
| 135° | 0.500 | **50 %** |
| **average over her four choices** | | **25 %** |

That 25 % is her whole signature in the key — and note she is *not* safe when she guesses
right: one basis matching is not four (10.5).

This is the only physical rule in E91. Everything else — the key, the Bell test, Eve's
detectability — is a consequence of applying it once or twice.

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

1. **Her measurement destroys the entanglement.** She cannot forward what she measured —
   it no longer exists. What she sends is a *new*, ordinary pair she prepares herself, both
   particles along *her* angle, carrying the value she read.
2. **The two particles now carry definite values along a single angle.** Their correlation
   therefore factorises — each side's result depends only on its own angle and hers — and a
   factorised correlation is exactly what "classical" means here. **This holds whether or not
   her angle matched theirs**: everyone draws from the same public set {0°, 45°, 90°, 135°}, so
   she often *does* share an angle with one of them. Sharing it does not help. A matching angle
   reproduces one correlation; **S is built from four**, and no single fixed angle can satisfy
   all four at once.
3. **Their correlation collapses**, and S falls from 2√2 to at most 2 — the classical range.
   The Bell test sees it.

> **Why her own result is a coin flip, whatever angle she picks.** This is the sharpest
> difference from BB84. There, Alice *prepares* each photon with a definite value in a
> definite basis, so "did Eve guess the right basis?" is a real question with a real answer.
> In E91 nothing is prepared: measuring one half of an entangled pair gives **50/50 in every
> basis**, full stop. That is an experimental fact about the statistics, and it is all this
> document needs — no claim about what she "really" learns, which is a question about
> interpretation and not about the protocol.
>
> Her choice of angle still matters, but for the other side of the transaction: it fixes the
> angle along which the particles she forwards are prepared, and therefore how much of Alice
> and Bob's correlation survives.
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

The protocol has a step nothing else can substitute for: **Eve receives a pair that nobody
has measured yet, and forwards a different one.** For that to be expressible, a pair must
*exist as a thing* between the moment the source makes it and the moment Alice and Bob
measure it. In a quantum library that thing is the circuit object. We have no such library,
so we define the object ourselves.

**A pair describes only itself.** It has no idea who made it, who is carrying it, or who
measured it. In particular **Eve is not part of its vocabulary** — "a pair Eve resent" is a
statement about history, not about the object, and an object that recorded it would be
answering the very question the Bell test exists to ask.

**The analogy that makes it click:** a quantum circuit *is itself a simulation*, and our
object is the same idea with the arithmetic left out. In a circuit you **build** entanglement
with gates (`H` then `CNOT`); we simply mark the pair `entangled`. In a circuit **measuring
destroys it** and leaves classical bits behind. And in a circuit, **preparing a fresh pair
without entangling gates** gives you an ordinary `product` pair — which is exactly what Eve
builds and forwards. Our object is those same three moves with the arithmetic left out.

**Its state** is therefore one of exactly two things, both physical:

| state | what it holds | why |
|---|---|---|
| **`entangled`** | **nothing** | neither particle has a value or a direction yet. The only thing true of an undisturbed pair is *that it is undisturbed* — so all `entangled` pairs are interchangeable, which is exactly why a source can hand out n identical ones |
| **`product`** | an **angle** and a **bit** | an ordinary, unentangled pair: both particles carry a definite value along one definite angle. Those two facts are the complete description of what a measurement will see |

`product` is the standard name for "not entangled": the joint state factorises into one
state per particle. It says *what the pair is*, not *who made it or why* — Eve is the only
one who makes one mid-flight in our game today, but a source could hand out product pairs
directly and nothing in the object would change.

> **Why there is no `collapsed` state.** Measuring *does* collapse an entangled pair — but
> our model never needs to represent the result, because **no ENTANGLED pair is ever measured
> twice**. (A `product` pair is measured twice — once by each side — and that is correct:
> it is already a definite state, so measuring it collapses nothing. This distinction was
> imprecise here until 2026-09-16.)
> Without Eve, one `measurePair` call consumes the pair and it is done. With Eve, she
> measures the entangled pair and then **builds a new `product` pair** rather than passing on
> the one she destroyed. "Collapsed" is the name of an *event*, and events do not need to be
> stored — only states do.

**Its behaviour** — two ways to make one, two ways to read one, and nothing else:

| | |
|---|---|
| **create entangled** | → a new `entangled` pair. Anyone may do this: a third party, Alice, Bob, or Eve |
| **create product**, given an angle and a bit | → a new, unentangled pair prepared in that definite state |
| **measure one side** at an angle | → one bit |
| **measure both sides** at two angles | → two bits, correlated per 10.3 |

There is deliberately **no way to read bits out of a pair without measuring it**, because in
the protocol there is nothing to read. A pair is not a container of two bits waiting to be
collected; it is a thing that *produces* bits when measured, differently depending on the
angles used.

> **There is no "intercept" operation, and that is the point.** An earlier draft gave the
> object a single `intercept` step that took a pair and returned a modified one. That is not
> what happens — and a quantum circuit says so plainly. Measuring **destroys** the pair;
> nothing can then "forward a modified version" of it. What Eve does is two ordinary things
> in sequence: she **measures** what arrived, and she **creates a new pair** — not entangled
> — prepared along her angle with the bit she read, and sends that.
>
> So her attack is a *composition of the primitives above*, not a primitive of its own. This
> is the same discipline BB84 already follows, where Eve is literally
> `encodePhoton(measurePhoton(photon, b), b)` — measure, then prepare. Building her out of
> the two operations is what makes "re-emit in the wrong basis" unrepresentable rather than
> merely fixed.

#### Who can see this state? Nobody in the game

The state is **our bookkeeping**, not a fact any player has access to. Alice, Bob and Eve
all see exactly one thing: the bit their own measurement returned. None of them can ask a
pair whether it is `entangled`, which is precisely why they must run the Bell test over many
rounds to find out.

> **It is not a "hidden variable" in the physics sense either**, and the reason is worth one
> line. Our `entangled` pair produces Bob's result using **Alice's angle** — the two sides
> are resolved together, in one call, by design (10.9). That is a *non-local* rule, and it is
> exactly why our simulation can reproduce S = 2√2. A model where each particle carried its
> own private instructions and ignored the other side's angle could not exceed 2 — that is
> Bell's theorem. We are not smuggling local realism in; we are computing the joint
> distribution directly.

#### A worked example

Three rounds, to make the object concrete. Angles are drawn independently each round.

```
ROUND 1 — no Eve, and the bases happen to match
   source                  pair = entangled
   Alice measures at 45°   Δ = 45 − 45 = 0°  → P(different) = 0
   Bob   measures at 45°   → both get the same bit, say 1
   announced (45°, 45°)    → KEY.  Alice 1, Bob 1.   they agree, as they always do

ROUND 2 — Eve intercepts, and the bases still match
   source                  pair = entangled
   Eve measures at 0°      reads 0 — the entangled pair is now destroyed
   Eve creates a new pair  product{ angle 0°, bit 0 }   ← she sends THIS one instead
   Alice measures at 45°   Δ = 45 − 0 = 45°  → flips with p = 0.146 → 0
   Bob   measures at 45°   Δ = 45 − 0 = 45°  → flips with p = 0.146 → 1   ← this one flipped
   announced (45°, 45°)    → KEY.  Alice 0, Bob 1.   THEY DISAGREE

   Two rounds, same announced bases, opposite outcomes. Round 1 can never disagree;
   round 2 disagrees 25 % of the time. That 25 % is Eve's whole signature.

ROUND 3 — Eve intercepts, and she happens to pick Alice's angle
   source                  pair = entangled
   Eve measures at 45°     reads 1 → she creates and sends product{ 45°, 1 }
   Alice measures at 45°   Δ = 0   → never flips → 1      Eve knows this bit exactly
   Bob   measures at 135°  Δ = 90° → flips with p = 0.5   → coin flip
   announced (45°, 135°)   → discarded (not a key pair, not a CHSH pair)

   Sharing an angle wins Eve that one bit — and the pair Alice and Bob receive is
   still an ordinary, unentangled one. The correlation it would have contributed
   to S is gone either way.
```

### 10.9 Our adaptation — the steps

Language-independent. Each step names the protocol step it implements.

```
createEntangledPairs(n)                     -- 10.6 step 1
    return n entangled pairs                   (identical: an entangled pair carries nothing)

createProductPair(angle, bit)             -- a pair prepared in a definite state
    return an unentangled (product) pair carrying (angle, bit)

generateRandomBases(n, availableAngles)     -- 10.6 step 2
    return n angles drawn uniformly from availableAngles

measureOneSide(pair, angle)                 -- the single-particle half of 10.3
    if pair is entangled:
        return a fair coin                     -- no value exists until measured (10.5)
    else:
        return pair.bit, flipped with probability sin²((angle − pair.angle) / 2)

eavesdrop(pair)                             -- 10.5, Eve. NOT a primitive: two steps
    angle = a uniformly random angle
    bit   = measureOneSide(pair, angle)        -- 1. she measures what arrived (destroying it)
    return { angle, bit,                       -- 2. she prepares and sends a NEW pair
             sent: createProductPair(angle, bit) }

    ⚠️ It returns her READ as well as the pair, and that is not convenience.
       Without it, an implementation that measures the pair and then forwards an
       UNRELATED coin is undetectable: S still falls to √2, the key error is still
       25 %, the marginals are still fair — every number in 10.10 passes, and only
       Eve's knowledge silently drops to zero. Found by mutation testing on
       2026-09-17, after that exact sabotage survived all 23 tests. The app needs
       it anyway: it reports "Eve has successfully read this number of bits".

measureOtherSide(pair, myAngle, theirBit, theirAngle)    -- the OTHER half of 10.3
    if pair is entangled:
        return theirBit, flipped with probability sin²((myAngle − theirAngle) / 2)
    else:
        return measureOneSide(pair, myAngle)   -- a product pair is local: they do not matter

measurePair(pair, aliceAngle, bobAngle)     -- 10.6 step 3. a COMPOSITION, not a third rule
    aliceBit = measureOneSide(pair, aliceAngle)
    bobBit   = measureOtherSide(pair, bobAngle, aliceBit, aliceAngle)
    return (aliceBit, bobBit)

siftKeyAndBellData(results, aliceAngles, bobAngles)     -- 10.6 step 4
    same angle         -> key
    CHSH combination   -> Bell-test data, keeping both angles
    otherwise          -> discard

    ⚠️ In THIS app only the key half is code. The CHSH half is the student's job:
       they drag each round into one of the four buckets by hand, and the UI
       accepts the drop only if the angles really are that combination
       (solo-CHSH-tab.tsx:264,273,282,291). That is the exercise, not an
       oversight — do not replace it with an automatic split.

correlations(bellData) / chshValue(correlations)        -- 10.6 step 5
```

> **On `measurePair` giving Alice a coin first.** Two binary results are completely described
> by their two individual rates and their correlation. Drawing one fairly and the other
> against `sin²(Δ/2)` therefore produces *exactly* the joint distribution of two simultaneous
> measurements — it is an order of evaluation, not a claim that Alice measures first. Both
> bits come out of **one** call on **one** pair, which is what keeps step 3 a single act.

#### Why this has three functions a quantum notebook does not need

A Qiskit reference has one measurement function — `measure_bell_pair(pair, a, b)` — and needs
no more, because **both measurements happen on one line, in one process.** `measureOneSide`
and `measureOtherSide` exist only because **our multiplayer splits that one line across two
HTTP requests, minutes apart, from two browsers.** Same physics; sliced so it can be called at
two different times. (`createProductPair` is the third, and it exists because Eve *creates*
rather than transforms — 10.8.)

**And yes, `measureOtherSide` is cheating**, in a precise sense: it reads the result the other
side already got. No real detector does that — Alice's and Bob's are correlated with no signal
between them. We are computing a non-local correlation on one machine, so the information has
to travel somewhere. See the warning in 10.12; the players never see it.

> **"If the pair is entangled, why measure at all — why not just copy the other side's bit?"**
> Because that is right for **2 of the 9 combinations and wrong for the other 7.** When the
> angles match, Δ = 0 and `sin²(0/2) = 0`, so `measureOtherSide` *does* copy, exactly — that is
> the key, and it falls out of the rule rather than being a special case. When the angles
> differ the results are **correlated but not identical**, and copying would force E = +1
> everywhere:
>
> ```
> S = 1 − 1 + 1 + 1 = 2        ← exactly the classical bound. never violated.
> ```
>
> A game built that way would report "classical" on a perfect, un-eavesdropped channel — the
> Bell test could never fire, and Eve would become invisible by making no difference. **The
> partial disagreement at mismatched angles is not noise to be optimised away; it is the
> signal.** And once Eve has been there the pair is a product state, so `measureOtherSide`
> ignores the other side's bit completely (10.8) — copying is wrong in that case too.

> **Why `measurePair` is a composition, and why that matters more than it looks.** There are
> exactly **two** measurement rules — *measure a side with nothing to go on*, and *measure a
> side when the other side already went*. Everything else is built from them:
>
> | who | calls |
> |---|---|
> | **solo** (both sides at once) | `measurePair` |
> | **multiplayer, first to click** | `measureOneSide` |
> | **multiplayer, second to click** | `measureOtherSide` |
> | **Eve** | `measureOneSide`, then `createProductPair` |
>
> Four situations, **one rule each, zero duplicated arithmetic.** If `measurePair` were
> written out independently instead of composed, multiplayer would have to re-derive
> `sin²(Δ/2)` for its second mover — and a second copy of the correlation rule is precisely
> the defect this document exists to prevent. **This is the property to protect when the code
> is written.**

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
| **No noise model** | our pairs and detectors are perfect; a real experiment has both | an undisturbed run reaches the ideal 2√2 exactly. Worth knowing before comparing a student's number to a published one — though at our sample size, **sampling noise dwarfs anything a detector would add** |
| **Eve always uses intercept-and-resend**, one pair at a time | it is the attack E91 is taught with, and the one the Bell test is built to catch | other strategies exist and are out of scope. A student should not conclude that S ≤ 2 is the signature of *every* possible eavesdropper |
| **10–30 pairs**, where a real experiment uses thousands | the student sets each round by hand; it is a game, not a lab | **S is not merely noisy here — it is unreliable in both directions.** See the measured table below. We do **not** raise the count; we explain it, and we let the student judge the rounds rather than a threshold judge for them |

#### How unreliable, exactly (measured, 20 000 simulated games per cell)

Only 4 of the 9 basis combinations are CHSH rounds, so at 20 pairs each of the four
correlations rests on **about two rounds**. The consequences are worse than "± 1.4":

| pairs | **false alarm** — no Eve, yet \|S\| ≤ 2 | **false negative** — Eve present, yet \|S\| > 2 |
|---|---|---|
| **20** | **34 %** | **27 %** |
| **30** | **22 %** | **29 %** |

Two things follow, and both belong in what the student is told (**Task 68**):

1. **A third of honest games look attacked, and a quarter of attacked games look honest.** At
   this size the Bell test is not a detector; it is a *hint*.
2. **S is coarsely quantised.** With ~2 rounds behind each correlation, `E(a,b)` can only land
   on a few values, so S lands on a sparse ladder — a student will essentially **never** see
   2.83. Telling them the ideal is 2√2 while showing them 3.0 invites exactly the wrong
   conclusion unless the variance is explained alongside it.

*This is the strongest argument in the document for Task 68: the sample size is not a wart to
apologise for — unexplained, it actively teaches the wrong lesson.*

### 10.12 When the two sides measure at different times

Solo measures both sides in one call. **Multiplayer cannot**: Alice and Bob are different
browsers, and each measures when its own player clicks. This section is how that is resolved
without changing any physics above.

#### The two cases are not equally hard, and the reason is the physics

| the pair is | is it local? | can each side be computed alone? |
|---|---|---|
| **`product`** (Eve has been here) | **yes** — each particle carries a definite value along a known angle | **Yes.** Both sides are independent given `(angle, bit)`. Each computes `measureOneSide` whenever its player clicks, in any order, with no reference to the other |
| **`entangled`** | **no** — the outcome depends on *both* angles | **No.** The second side to measure must know the first's **angle** |

That asymmetry is not an accident of our design. **Eve's whole effect is to destroy a
non-local correlation**, so a pair she has touched is an ordinary local object — and local
objects are precisely the ones each side can evaluate alone. Her attack makes the simulation
*easier*, for the same reason it makes the key insecure.

#### Resolving an entangled pair: first one gets a coin, second one follows

```
when a side measures an ENTANGLED pair:
    if the other side has not measured yet:
        my bit = a fair coin                       -- nothing to correlate with yet
    else:
        my bit = their bit, flipped with probability sin²((my angle − their angle) / 2)
```

**No waiting and no synchronisation.** Whoever clicks first is served immediately; whoever
clicks second is drawn against the first. This is **exact**, not an approximation: two binary
results are completely determined by their two rates and their correlation, so this produces
the identical joint distribution to measuring both at once.

> ⚠️ **We are moving information the real protocol does not.** In reality nothing travels
> between Alice's detector and Bob's — their results are correlated without any signal. Our
> second measurement genuinely *reads* the first one's angle and bit. That is an artefact of
> simulating a non-local correlation on one machine, and it is invisible to the players. It
> is recorded here so that a future developer does not mistake it for a claim about physics.

#### Why you cannot design the ordering away

It is tempting to remove the dependency: pre-draw each round's outcomes when the pair is
created, store them, and let each side read its own. **That cannot work, and the reason is
Bell's theorem.** A scheme in which each particle carries pre-stored instructions and ignores
the other side's angle is a *local hidden-variable model*, and such a model is bounded by
**S ≤ 2**. Ours must reach **2√2**.

So **the outcome must depend on both angles** — that much is forced, and any implementation
reaching 2√2 has that dependency somewhere.

> ⚠️ **But "depends on both angles" is not the same as "first, then second", and an earlier
> version of this section conflated them** (caught in external review, 2026-09-16). Bell
> forbids computing each side from its own angle alone. It says nothing about *ordering*.
> **If you wait until both bases are known, you sample the pair jointly, in one symmetric
> step, with no first and no second** — which is exactly what solo does.
>
> The ordering in multiplayer is therefore **a UI decision, not a physical one**: it exists
> only because we choose to serve the first player their result before the second has chosen a
> basis. That has a consequence worth reading twice:

#### DECIDED (2026-09-16): the first arrival computes its own bits

The open question — *does the first arrival compute its own bits, or does the second compute
both?* — is closed, and **not** on game feel. Two arguments settled it, one of which corrects
a claim that stood in this document for a few hours.

**❌ "Waiting for both sides deletes the race" — wrong, and it was mine.** It does not. It
**moves** the race from the outcome to the *rendezvous*: if both players click together, both
store their angle, and then both ask *"are both angles present?"*. Depending on how those
reads interleave, **both** can answer no — and each waits forever for the other — or **both**
can answer yes, and compute the round twice from two independent draws. An atomic
check-and-set is still required, just guarding a different question. **You cannot escape
concurrency by changing which side calls the function.**

**✅ The deciding argument is physical, not technical.** Alice can measure her particle in
Geneva today and Bob can measure his in Vienna next week. **Alice's detector fires without
Bob's basis.** Making her wait for his choice before she may see her own result tells a
student that her measurement cannot resolve until he acts — which is exactly the
action-at-a-distance E91 must *not* teach. First-arrival resolution matches the physics; a
rendezvous misrepresents it.

**So: whoever clicks first is served immediately**, via the atomic claim above, and the
second correlates against them.

> **Does multiplayer still share solo's code?** Yes — where it matters. Solo calls
> `measurePair`, which 10.9 defines as a composition of `measureOneSide` and
> `measureOtherSide`; multiplayer calls those two directly, one per arrival. **The rules are
> shared; only the wrapper differs.** That is the single-source-of-truth property, and it
> survives this decision intact.

#### The consequence: a race condition, and the only correct fix

Two players can click *Measure* at the same instant. Both handlers then ask "has the other
side measured yet?", **both read "no"**, and both take the fair-coin branch. Two independent
coins, no correlation — a key with ~50 % errors and an S near 0, in a game with no
eavesdropper. Silent, rare, and indistinguishable from bad luck.

> **This is live today.** `e91/consumers.py` reads `iteration.bob_bits`, decides, and saves,
> with **no transaction and no row lock** (verified 2026-09-11: no `select_for_update`, no
> `transaction.atomic` anywhere in the file). The window is milliseconds — but a classroom
> runs many rounds, and rare events happen.

**The fix is serialisation, and it must be ONE step.** The trap is that the obvious guard —
*"read the flag; if it is free, take it"* — is itself a read-then-write, so two simultaneous
requests can both read "free". That does not fix the race; it moves it to the flag.

#### The decision (2026-09-11): a conditional write on the round's own row

The round already has a database row, and the database can check-and-set **in a single
statement**:

**Draw your bit first, then try to claim with it.** The claim and the *result* must be in the
same statement:

```sql
UPDATE round
   SET first_mover = 'A', first_bit = ?, first_angle = ?
 WHERE id = ? AND first_mover IS NULL
```

| result | meaning | what that side does |
|---|---|---|
| **1 row** | you claimed it | you were first — the coin you drew stands, and it is **already stored** |
| **0 rows** | someone was ahead of you | you are second — discard your coin, read their bit and angle, correlate |

> ⚠️ **Why the bit must be in the same statement — a bug found in review (2026-09-16).** An
> earlier version claimed the flag alone:
> `UPDATE round SET first_mover='A' WHERE first_mover IS NULL`, and only *then* computed and
> wrote the bit. That leaves a window: Alice claims, and before her second query lands Bob
> claims, sees `0 rows`, concludes he is second, goes to read her bit — **and finds `NULL`**.
> The race is narrower than the original one but it is the same race. Writing the outcome
> inside the claim closes it: a side that reads `0 rows` is guaranteed the winner's bit and
> angle are already committed, because they were part of the statement that beat it.

No lock to hold, nothing to release, no message between the two players, and no state that
can be lost. The claim and the decision are the same operation.

#### Why not a mutex on a variable in the server

It was considered and it is not wrong — a mutex around an in-memory flag **does** serialise
the check-and-set, and it is faster than a database write. Three reasons it lost:

1. **It is correct only inside one process.** The backend runs a single Daphne process today,
   so it would work — but the project is already configured with a **Redis channel layer**,
   which exists precisely so that several processes can serve one game. The day a second
   instance is started, every process gets its own mutex and the guard silently protects
   nothing. A correctness property that depends on how the service happens to be deployed is
   a bad property.
2. **The speed advantage is not real here.** The handler already writes this row
   (`save_iteration`). The conditional `UPDATE` *replaces* that write rather than adding one,
   so the marginal cost is about zero. We are not introducing a database; we are using the
   one already in the critical path.
3. **It adds state to maintain**: a per-round entry, and cleanup so finished rounds do not
   accumulate. The row already exists and is already cleaned up with the game.

*(If in-memory speed ever does matter, the correct version of the same idea is Redis
`SETNX` — atomic, already a dependency, and correct across processes. An in-process mutex is
only defensible with a permanent commitment to a single process.)*

Anything else — reordering, retrying, comparing timestamps — either reintroduces the race or
smuggles in the local hidden-variable model the previous section rules out.

> **Still open: which side does the work.** Two shapes are compatible with the claim above.
> Either the **first** arrival computes its own bits (the loser then correlates against them),
> which lets a player see their result the moment they click; or the **second** arrival
> computes **both** sides at once, which lets multiplayer call exactly the same `measurePair`
> as solo — one physics path instead of two — at the cost of the first player waiting. This is
> a game-feel decision, not a correctness one; both are safe once the claim is atomic.

**The product case needs none of this.** Once Eve has measured, both sides are independent
(see the table at the top of 10.12), so there is nothing to serialise: each side computes
whenever its player clicks.

#### What multiplayer has to store

Solo holds the pair in a local variable for the length of one call. Multiplayer cannot — the
two measurements are separate requests — so whatever the pair *is* must survive between them.
The object's own definition (10.8) says exactly how much that is, and it is very little:

| the round is | what must persist | why |
|---|---|---|
| **entangled, nobody measured yet** | **nothing** | an entangled pair carries no data. "A pair exists" is implied by the round existing |
| **entangled, one side has measured** | that side's **bit and angle** — both already stored today | this is what `measureOtherSide` needs |
| **product (Eve was here)** | her **angle** and **bit** | this is the pair. Without it the second side cannot be computed at all |
| **either** | who claimed **first** | the atomic claim above; it cannot be inferred from "are their bits set yet", because that inference is the race |

So the backend gains **three** nullable columns — `eve_angle`, `eve_bit`, `first_mover` — and
nothing else. No new events, no new messages, no synchronisation.

> Note the shape: **the columns are the pair object, persisted.** They are not bookkeeping
> bolted on beside the physics; they are what 10.8 says a pair consists of. A future move of
> E91's physics fully into the frontend deletes all three, because the pair would then live in
> the one place that measures it — exactly as it does in solo today.

### 10.13 What the tests must pin, beyond the four headline numbers

10.10's four numbers are necessary and **not sufficient**. A wrong implementation can hit all
four. These are the properties that separate "produces the right averages" from "is the right
simulation" — each names the specific wrong implementation it catches.

| # | pin this | the bug it catches |
|---|---|---|
| **1** | **Each CHSH term individually**, with its sign: `E(0°,45°) = +0.707`, **`E(0°,135°) = −0.707`**, `E(90°,45°) = +0.707`, `E(90°,135°) = +0.707` | summing magnitudes. `|E₁|+|E₂|+|E₃|+|E₄|` also equals 2.83 while the geometry is inverted |
| **2** | **The 9-combination partition, by ordered pair**: 2 key, 4 CHSH, 3 discarded — and specifically that **`(45°,90°)` is DISCARDED** while `(90°,45°)` is CHSH | an unordered basis check. `cos(45°−90°) = cos(0°−45°)`, so wrongly pooling `(45°,90°)` into a CHSH bucket **leaves S at exactly 2√2** — every headline number passes while the sifter is corrupt |
| **3** | **No-signalling**: fix Bob at 45°; `P(Bob = 1)` must be 50 % **for each of Alice's angles separately**, not merely on average | a `measureOtherSide` whose bias depends on the other side's angle. That is faster-than-light signalling, and it averages away |
| **4** | **Eve actually forwards what she read**: when `θₑ = θₐ = θ_b`, `Eve.bit == Alice.bit == Bob.bit` with **zero** exceptions. And on matching-basis rounds where A = B with Eve 45° off, `P(Eve = Alice \| A = B) = 97.1 %` | Eve drawing one bit for herself and a *different* one into the pair. Still a product state, so S still falls to √2 and errors are still 25 % — but her knowledge of the key drops to nothing |
| **5** | **`probDiff(0°, 135°) = 0.854`**, never 0.146 | normalising Δ to an acute angle. `|135° − 180°| = 45°` flips `E(0°,135°)` positive — which test 1 then catches from the other direction |
| **6** | **Each SIDE measures each pair at most once** — the pair itself may legitimately be measured twice, once per side, whether it is `entangled` or `product` | over-eager immutability. *This row has now been wrong twice.* A blanket "throw on any second measurement" breaks the product case; "an entangled pair is consumed once" breaks multiplayer, where the first arrival calls `measureOneSide` and the second calls `measureOtherSide` **on the same entangled pair, by design**. Enforcing the real invariant needs per-side tracking and is probably not worth it — but nothing may *claim* an invariant the code correctly violates |
| **7** | **Round-to-round independence**: over 10 000 consecutive rounds, `corr(Aᵢ, Aᵢ₊₁) ≈ 0` and `corr(θₑ,ᵢ, θₑ,ᵢ₊₁) ≈ 0` | state leaking between rounds — reused variables, a cached draw. **This is the exact shape of the BB84 bug that opened this document** (§6), and aggregate statistics hide it completely |

> Tests 1–5 and 7 came from an external adversarial review (Gemini, via Ibra, 2026-09-16).
> Test 6 came from that review too, but **inverted**: it proposed throwing on any second
> measurement, which would break the product-pair case. Checking it is what found the
> imprecision now corrected in 10.8.

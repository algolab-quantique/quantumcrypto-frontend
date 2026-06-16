# QuantumCrypto Product Vision: From Protocol Forms to Playable Learning

> Draft note. This is not an implementation plan yet. It captures product and UX ideas to discuss later, before deciding what to build.

## Current Identity

QuantumCrypto is currently a responsive web application for presenting quantum communication protocols such as BB84, E91, and DPS.

It is described as a game, but the current experience is closer to an interactive protocol simulator or guided quantum communication lab:

- the user follows protocol steps,
- fills or validates forms,
- exchanges data with another player or a simulated partner,
- reaches a result screen.

This is useful educationally, but it does not yet feel like a real game.

## Web App vs Mobile App

The recommended direction for now is to keep QuantumCrypto as a responsive website.

Native-only mobile app development should not be the next step unless there is a strong reason such as:

- app-store distribution is required,
- deep mobile device APIs are needed,
- the product strategy becomes mobile-first only,
- a sponsor or deployment environment explicitly requires Android or iOS.

For the current project, a better future direction is likely:

1. keep the responsive website,
2. improve mobile layouts,
3. later make it installable as a PWA if useful,
4. avoid maintaining separate web, Android, and iOS codebases too early.

## Product Positioning

There are two possible identities:

### Option A: Interactive Quantum Protocol Lab

This is the honest current identity.

Strengths:

- educational,
- clear,
- easier to maintain,
- good for demonstrations and classrooms.

Weakness:

- less exciting if users expect a game.

### Option B: Quantum Communication Game

This is the aspirational identity.

To deserve the word "game", the experience should include more game mechanics:

- missions,
- stakes,
- feedback,
- visible progress,
- challenge,
- scoring,
- replayable outcomes,
- stronger visual world.

The product can evolve from Option A toward Option B gradually.

## Core Game Fantasy

The central fantasy should be:

> Alice and Bob must transmit a secret message while protecting it from Eve.

This can become the common narrative layer for BB84, E91, DPS, and future protocols.

Each protocol then becomes a different way to solve the same mission:

- BB84: choose and compare bases, discard mismatches, detect Eve.
- E91: use entanglement/correlations to create and verify a key.
- DPS: use phase differences and detection times to infer the key.

## What Would Make It Feel More Like a Game

Potential future improvements:

- Add a mission framing before the protocol starts.
- Show Alice, Bob, Eve, photons, channel, detectors, and encrypted messages visually.
- Add "Learn mode" and "Challenge mode".
- Add score, timer, key length, errors, and Eve detection feedback.
- Add visible success moments when a secure key is created or a message is decrypted.
- Add replayable outcomes such as secure success, Eve detected, short key, or failed synchronization.
- Make the result screen feel like a debrief, not only a table.

Important: these should come after the lifecycle architecture is stable enough to support them safely.

## Game Screen Header / HUD Direction

The current in-game interface is too bare: usually only the protocol title button appears at the top left.

A heavy top navigation bar is probably not ideal during active play, because it can distract users and increase accidental exits.

A better direction is a compact game HUD:

- left: QuantumCrypto or protocol name,
- center or near-left: current protocol, for example BB84 / E91 / DPS,
- role badge: Alice, Bob, Eve, or Admin,
- connection/session status,
- small menu button.

The menu could contain:

- quit game,
- return to protocol page,
- help / protocol summary,
- results, when available.

This keeps the game screen focused while still giving users clear navigation.

## Product Modes To Discuss Later

Possible modes:

- Learn mode: guided, forgiving, current step-by-step style.
- Challenge mode: fewer hints, scoring, timer, mistakes matter.
- Classroom mode: master/admin creates a room and watches results.
- Solo practice: computer partner, no backend dependency.
- Multiplayer mission: Alice and Bob cooperate in real time.

## Architecture Dependency

The new shared lifecycle architecture should come before large game-feel changes.

Reason:

- start, save, refresh, reconnect, leave, replay, and results must behave consistently,
- each new visual/game feature depends on reliable session state,
- without a shared lifecycle, adding game UI will multiply protocol-specific bugs.

Recommended order:

1. Finish and document the shared protocol lifecycle.
2. Standardize BB84, E91, and DPS session behavior.
3. Add a compact in-game HUD.
4. Improve mobile layouts.
5. Add game-feel features progressively.
6. Consider PWA installability later.

## Open Questions

- Should the public wording be "game", "lab", "simulator", or "interactive game lab"?
- Should Learn mode and Challenge mode be separate from the beginning?
- Should scoring be protocol-specific or shared across protocols?
- What should a successful game measure: time, key length, correctness, Eve detection, or teamwork?
- Should the app work offline for solo mode?
- Should multiplayer require backend snapshots before deeper game features?
- Should the mobile experience be optimized as a website first, then PWA later?

## Decision For Now

For the near future:

- Keep QuantumCrypto as a responsive website.
- Do not start a native mobile rewrite.
- Treat the current app as an interactive protocol lab that can evolve into a stronger game.
- Build the shared lifecycle architecture before major gameplay redesign.
- Keep this document as the product/UX vision reference for future discussions.

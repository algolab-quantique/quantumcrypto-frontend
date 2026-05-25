# Storage, Hydration, and Reconnection Plan

## Goal

Make BB84, E91, and DPS behave with the same mental model:

- **Solo mode**: `localStorage` is the source of truth.
- **Multiplayer mode**: the **backend room state** is the source of truth, and `localStorage` is a recovery cache for identity, progress, tab, and room state after refresh.

The app should feel consistent across protocols:

- refresh should not silently lose state,
- back navigation should be guarded only when it is actually needed,
- completed games should cleanly exit and clear stale data,
- restore logic should be explicit, predictable, and protocol-specific.

## Core Design Rule

### Solo mode
Solo mode is fully local. The browser holds everything needed to rebuild the game:

- player identity
- game config
- room/game state
- progress step and active tab
- displayed lines / narration

That means solo mode should:

1. save state to `localStorage` on every meaningful update,
2. restore from `localStorage` on mount,
3. clear its own keys when starting a fresh run or leaving the game.

### Multiplayer mode
Multiplayer mode has a backend room and WebSocket connection, so the server should remain the truth for the live game. `localStorage` should only help the client recover after refresh or reconnect.

That means multiplayer should:

1. save enough client-side state to reconnect,
2. restore identity and room context after refresh,
3. reconnect to the play room if the game is still active,
4. avoid over-clearing state before the restore path has a chance to run,
5. clean stale completed-game storage once the result is acknowledged.

## Shared Storage Layers

Across all three protocols, the persistence model is usually split into three layers:

| Layer           | Purpose                 | Typical keys                                      |
| --------------- | ----------------------- | ------------------------------------------------- |
| Player store    | identity and mode flags | `player-storage` via Zustand persist              |
| Game room store | protocol state          | `bb84GameData`, `dpsGameData`, `e91GameData`      |
| Progress store  | step, tab, transcript   | `bb84Step`, `bb84Tab`, `bb84DisplayedLines`, etc. |

This separation is good. The problem is not the existence of the layers. The problem is whether every protocol uses them in the same lifecycle.

## Current Pattern by Protocol

## BB84

### Solo flow
BB84 solo is the strongest reference implementation.

Relevant files:

- [components/bb84/home-page/solo-game-modal.tsx](components/bb84/home-page/solo-game-modal.tsx)
- [components/bb84/play-page/game.tsx](components/bb84/play-page/game.tsx)
- [store/bb84/bb84-room-store.ts](store/bb84/bb84-room-store.ts)
- [store/bb84/bb84-progress-store.ts](store/bb84/bb84-progress-store.ts)
- [lib/bb84/utils.ts](lib/bb84/utils.ts)

What it does well:

- clears stale BB84 data before starting a new solo game,
- writes fresh config to `localStorage`,
- restores room state on mount,
- restores step, tab, displayed lines, and validation length,
- uses `usePreventNavigation` in the active play wrapper,
- clears all BB84 keys on exit or replay flows.

BB84 solo therefore matches the desired model very closely.

### Multiplayer flow
Relevant files:

- [components/bb84/home-page/bb84-game-form-v3.tsx](components/bb84/home-page/bb84-game-form-v3.tsx)
- [components/bb84/play-page/game.tsx](components/bb84/play-page/game.tsx)
- [store/bb84/bb84-room-store.ts](store/bb84/bb84-room-store.ts)
- [store/bb84/bb84-progress-store.ts](store/bb84/bb84-progress-store.ts)
- [lib/bb84/utils.ts](lib/bb84/utils.ts)

What it does well:

- offers a rejoin dialog when old room data exists,
- restores game progress from `localStorage`,
- reconnects to the play room,
- clears stale storage when joining a new game or when a completed game is detected.

BB84 multiplayer is the clearest reference for the desired reconnect behavior.

### BB84 assessment
BB84 is close to the target architecture already.

Remaining work is mostly about consistency and making sure the same rules are followed in E91 and DPS, not about redesigning BB84 itself.

## E91

### Solo flow
Relevant files:

- [components/e91/play-page/solo-game.tsx](components/e91/play-page/solo-game.tsx)
- [components/e91/home-page/solo-game-modal.tsx](components/e91/home-page/solo-game-modal.tsx)
- [store/e91/e91-room-store.ts](store/e91/e91-room-store.ts)
- [store/e91/e91-progress-store.ts](store/e91/e91-progress-store.ts)
- [lib/e91/utils.ts](lib/e91/utils.ts)

What it does well:

- restores room data, progress, tab, displayed lines, photon count, and Eve config on mount,
- shows welcome messages if no transcript exists,
- keeps the solo flow fully local,
- clears E91-specific keys via `clearE91LocalStorage`.

E91 solo is a valid localStorage-first implementation.

### Multiplayer flow
Relevant files:

- [components/e91/home-page/e91-game-form-v3.tsx](components/e91/home-page/e91-game-form-v3.tsx)
- [components/e91/play-page/game.tsx](components/e91/play-page/game.tsx)
- [store/e91/e91-room-store.ts](store/e91/e91-room-store.ts)
- [store/e91/e91-progress-store.ts](store/e91/e91-progress-store.ts)
- [lib/e91/utils.ts](lib/e91/utils.ts)

What it does well:

- has a rejoin dialog path,
- tries to restore progress and reconnect,
- clears stale completed-game storage on landing/home transitions.

What is weak:

- the restore path is more fragile than BB84 because it depends on multiplayer-specific conditions at mount,
- the browser-refresh recovery path is easy to miss if the player store or socket state is not ready in time,
- the current design is more sensitive to hydration timing than the solo flow.

### E91 assessment
E91 should behave like BB84, but multiplayer is not yet as robust.

The correct target is:

1. preserve server truth for live multiplayer,
2. preserve local recovery data for reconnect,
3. restore consistently after refresh,
4. avoid losing the room identity before reconnect can happen.

E91 is the highest priority protocol for architecture cleanup because it already exposes the same storage layers but does not yet fully normalize the lifecycle.

## DPS

### Solo flow
Relevant files:

- [components/dps/play-page/solo-game.tsx](components/dps/play-page/solo-game.tsx)
- [components/dps/home-page/solo-game-modal.tsx](components/dps/home-page/solo-game-modal.tsx)
- [store/dps/dps-room-store.ts](store/dps/dps-room-store.ts)
- [store/dps/dps-progress-store.ts](store/dps/dps-progress-store.ts)
- [lib/dps/utils.ts](lib/dps/utils.ts)

What it does well:

- restores player data when needed,
- restores room state,
- restores photon number, validation bits length, step, tab, and displayed lines,
- shows a loading gate until hydration is complete,
- keeps solo flow deterministic and explicit.

DPS solo is the most defensive hydration implementation in the repo.

### Multiplayer flow
Relevant files:

- [components/dps/home-page/dps-game-form-v3.tsx](components/dps/home-page/dps-game-form-v3.tsx)
- [components/dps/play-page/game.tsx](components/dps/play-page/game.tsx)
- [store/dps/dps-room-store.ts](store/dps/dps-room-store.ts)
- [store/dps/dps-progress-store.ts](store/dps/dps-progress-store.ts)
- [lib/dps/utils.ts](lib/dps/utils.ts)

What it does well:

- clears stale data when starting new sessions,
- protects navigation during active games,
- uses protocol-specific clear helpers.

What is missing:

- the multiplayer page does not yet have the same restore/rejoin pipeline as the solo page,
- the rejoin dialog is intentionally disabled,
- the active multiplayer wrapper does not yet mirror the solo hydration model,
- the refresh/reconnect story is weaker than both BB84 and E91.

### DPS assessment
DPS multiplayer needs the most structural work if the goal is parity with solo mode.

The backend room is already the correct source of truth, but the client-side reconnect path is incomplete.

## What the Pop-up Means

The browser popup that appears on back or reload is a **guardrail**, not the core solution.

### Good use of the popup
Use it when:

- the user is about to leave an active game,
- leaving would invalidate the current session,
- there is no reliable restore path for the current state.

### Bad use of the popup
Do not rely on it as the main recovery strategy.

If the app can restore state correctly, the popup becomes less important for refresh and more relevant only for accidental back navigation or tab close.

## Source of Truth Rule

This is the architecture rule to keep the codebase coherent:

### Solo
- source of truth: `localStorage`
- restore from: `localStorage`
- clear by: protocol-specific cleanup helper

### Multiplayer
- source of truth: backend room + WebSocket state
- recovery cache: `localStorage`
- restore from: localStorage only when reconnecting or refreshing
- clear by: protocol-specific cleanup helper after completion or explicit exit

## Current Gaps

### BB84
- Mostly aligned.
- Minor consistency work only.

### E91
- Multiplayer restore is not as reliable as solo.
- Rejoin and hydration timing need to be hardened.
- The app should not depend on fragile mount timing to recover the room.

### DPS
- Multiplayer restore/rejoin path is incomplete.
- Needs the same lifecycle discipline as solo.
- Needs a clearer reconnect contract.

## Recommended Implementation Order

### Phase 1: Make the architecture explicit
- keep solo mode as the localStorage-first reference,
- keep multiplayer as backend-first with recovery cache,
- document the exact keys and cleanup rules per protocol.

### Phase 2: Normalize BB84 as the benchmark
- treat BB84 as the behavior model for restore/rejoin/cleanup,
- verify all BB84 paths still match the intended pattern.

### Phase 3: Harden E91 multiplayer
- make restore deterministic,
- ensure refresh recovery works even when socket state is late,
- align the lobby and play wrapper behavior with the solo model.

### Phase 4: Bring DPS multiplayer up to parity
- implement the missing restore/rejoin pipeline,
- mirror the solo hydration contract,
- keep cleanup protocol-specific and explicit.

## Practical Rule for Future Work

When you change one protocol, ask the same three questions every time:

1. Where is the authoritative state saved?
2. How is it restored after refresh?
3. How is stale state cleared after completion or exit?

If the answers are not the same shape in BB84, E91, and DPS, the implementation is drifting.

## Working Conclusion

The best long-term design is:

- **solo = localStorage-first**,
- **multiplayer = backend-first + localStorage recovery**,
- **shared lifecycle rules across BB84, E91, and DPS**,
- **protocol-specific cleanup helpers**,
- **explicit restore/rejoin flows instead of accidental navigation behavior**.

That gives us one coherent architecture instead of three separate habits.

# Storage, Hydration, and Reconnection Plan

## Goal

Make BB84, E91, and DPS behave with the same mental model:

- **Solo mode**: `localStorage` is the source of truth.
- **Multiplayer mode**: the **backend room state** is the source of truth for shared protocol facts, and `localStorage` is a recovery cache for identity, local UI checkpoint, transcript, and drafts after refresh.

The app should feel consistent across protocols:

- refresh should not silently lose state,
- back navigation should be guarded only when it is actually needed,
- completed games should cleanly exit and clear stale data,
- restore logic should be explicit, predictable, protocol-specific, and paced for learning.

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
Multiplayer is not just "solo with sockets." The shared room state belongs to
the backend because more than one browser can mutate it.

Shared protocol facts should be backend-authoritative:

- photons or phases sent,
- bases shared,
- key bits and partner bits,
- validation indices and validation status,
- cipher/message exchange,
- game completion.

Client-local state should remain player-specific:

- game identity (`gameCode`, `room`, role, player name, partner),
- current visible tab,
- local progress checkpoint,
- transcript lines already shown to this player,
- local drafts that have not been submitted yet.

Because this app is primarily a step-by-step learning experience, reconnect
must be **backend-authoritative but player-paced**. A refreshed player should
not be teleported straight to the most advanced room state. Instead, the client
should reconnect, compare the backend room snapshot with the player's local UI
checkpoint, and guide the player through any missed protocol events in order.

If the backend cannot be reached, multiplayer actions should be disabled. The
user can then retry reconnecting, exit the game, or intentionally continue as a
local solo-style simulation. Continuing locally should not pretend the
multiplayer room is still synchronized.

### Component File Separation (Solo vs. Multiplayer)

To keep concerns clearly separated, we split solo play and multiplayer play into distinct files where appropriate:

*   **Solo mode** uses `solo-game.tsx`. Since it runs entirely locally, it executes synchronous, immediate state mutations.
*   **Multiplayer mode** uses `multi-game.tsx` (previously `game.tsx`). It is asynchronous and event-driven, mutating state in response to WebSocket messages broadcast by the server.

Having separate files avoids wrapping every state update and UI render block in complex `if (playingSolo)` conditions, resulting in cleaner, more maintainable code.

*   *Note: BB84 has now been split into `solo-game.tsx` and `multi-game.tsx`. Some BB84 tab components are still shared between both modes and may still branch internally on `playingSolo`.*

### Completed Multiplayer Games

A completed multiplayer game has two separate states:

- completed play state: stored locally so refresh restores the felicitation screen
- results state: loaded by the results page from the backend

Refresh on the completed play page should not automatically open the results page.
It should restore the completed play screen and keep the user in control.

When the user clicks "Voir les résultats", the app navigates to the results route.
That route opens its own results WebSocket and fetches player data from the backend.

## Shared Storage Layers

Across all three protocols, the persistence model is usually split into three layers:

| Layer           | Purpose                 | Typical keys                                      |
| --------------- | ----------------------- | ------------------------------------------------- |
| Player store    | identity and mode flags | `player-storage` via Zustand persist              |
| Game room store | local room snapshot / solo source of truth | `bb84GameData`, `dpsGameData`, `e91GameData`      |
| Progress store  | local UI checkpoint, tab, transcript | `bb84Step`, `bb84Tab`, `bb84DisplayedLines`, etc. |

This separation is good. The problem is not the existence of the layers. The problem is whether every protocol uses them in the same lifecycle.

In multiplayer, the local room snapshot is a recovery aid, not the final
authority. The long-term reconnect contract should ask the backend for a room
snapshot or ordered event history after reconnect.

## Current Pattern by Protocol

## BB84

### Solo flow
BB84 solo is the strongest reference implementation.

Relevant files:

- [components/bb84/home-page/solo-game-modal.tsx](components/bb84/home-page/solo-game-modal.tsx)
- [components/bb84/play-page/solo-game.tsx](components/bb84/play-page/solo-game.tsx)
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
- [components/bb84/play-page/multi-game.tsx](components/bb84/play-page/multi-game.tsx)
- [store/bb84/bb84-room-store.ts](store/bb84/bb84-room-store.ts)
- [store/bb84/bb84-progress-store.ts](store/bb84/bb84-progress-store.ts)
- [lib/bb84/utils.ts](lib/bb84/utils.ts)

What it does well:

- offers a rejoin dialog when old room data exists,
- restores game progress from `localStorage` as the current frontend fallback,
- reconnects to the play room using saved player identity,
- clears stale storage when joining a new game or when a completed game is detected.

What still needs clarification:

- BB84 should set/confirm `playingMultiplayer` when roles are assigned so a direct refresh enters the multiplayer recovery branch.
- Manual progress reads in `multi-game.tsx` should be replaced with `hydrateBB84ProgressStore()`.
- The current `bb84GameData` restore is a useful fallback, but the long-term target is a backend room snapshot or ordered event history after reconnect.
- If the backend is ahead of the local UI checkpoint, BB84 should guide the player through missed educational steps instead of jumping directly to the latest tab.

BB84 multiplayer is the clearest current frontend reference, but the desired long-term behavior is backend-authoritative and player-paced.

### BB84 assessment
BB84 is close to the target file architecture already.

Remaining work is about clarifying multiplayer refresh semantics, keeping the solo flow localStorage-first, and making the BB84 multiplayer reconnect path robust enough to become the reference for E91 and DPS.

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
- [components/e91/play-page/multi-game.tsx](components/e91/play-page/multi-game.tsx)
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
- [components/dps/play-page/multi-game.tsx](components/dps/play-page/multi-game.tsx)
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
- source of truth for shared protocol facts: backend room + WebSocket state
- recovery cache: `localStorage`
- restore from: backend room snapshot or ordered event history after reconnect
- temporary fallback: local room snapshot from `localStorage` when backend snapshot support does not exist yet
- UI pacing: compare backend state with the local player's UI checkpoint and guide missed steps in order
- clear by: protocol-specific cleanup helper after completion or explicit exit

## Current Gaps

### BB84
- File split is done: BB84 now has separate `solo-game.tsx` and `multi-game.tsx`.
- Solo is aligned and should remain localStorage-first.
- Multiplayer still needs clearer refresh semantics: backend-authoritative, player-paced recovery.
- Current localStorage room restore is acceptable as a temporary fallback, not the long-term source of truth.
- Confirm/set the BB84 `playingMultiplayer` flag during role assignment.

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
- keep BB84 solo as the localStorage-first reference,
- harden BB84 multiplayer around backend-authoritative, player-paced recovery,
- use `hydrateBB84ProgressStore()` for local UI checkpoint hydration,
- preserve local room restore only as a fallback until backend snapshots are available,
- document or implement the backend reconnect snapshot/event-history contract.

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

For multiplayer, add a fourth question:

4. If the backend is ahead after reconnect, how does the UI teach the missed steps instead of skipping them?

## Working Conclusion

The best long-term design is:

- **solo = localStorage-first**,
- **multiplayer = backend-authoritative + localStorage recovery cache**,
- **multiplayer refresh = player-paced catch-up, not automatic teleport to the latest backend phase**,
- **shared lifecycle rules across BB84, E91, and DPS**,
- **protocol-specific cleanup helpers**,
- **explicit restore/rejoin flows instead of accidental navigation behavior**.

That gives us one coherent architecture instead of three separate habits.

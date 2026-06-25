# Quantum Crypto Frontend - Issue Tracker & Plan

> [!NOTE]
> Completed Tasks 1 to 22 and completed top-level Tasks 25, 29 to 36 have been archived to [docs/tasks_archived.md](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/docs/tasks_archived.md) to keep this active TODO list clean and compact.

---

### 23. 🟡 INFRA: Verify Backend Connectivity After VM Migration

**Status**: 🟡 INVESTIGATION — TODO  
**Date Added**: May 20, 2026  
**Priority**: 🟡 MEDIUM (may already be resolved — domain was re-pointed)

**Context**: The backend VM was physically changed, but the public domain name (e.g. `bb84.physc...`) was re-pointed to the new VM. Since the same domain is used, AWS Amplify environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WEBSOCKET_URL`) should still be correct — no change needed in Amplify Console.

**However**, even though the domain is the same, the new VM may have:
- Different firewall/security group rules blocking ports
- Missing CORS configuration for the frontend origin
- Backend service not running or not auto-started after migration
- SSL certificate issues if the domain verification changed
- WebSocket upgrade not allowed by new VM's reverse proxy config

**Investigation Steps**:
1. [ ] Open browser DevTools (Network tab) on the live deployed app
2. [ ] Click "Start Game" and check the failed request to `/record_game_statistic/`
3. [ ] Note the exact error: `ERR_CONNECTION_REFUSED`? `CORS`? `502`? `timeout`?
4. [ ] SSH into the new VM and verify the backend process is running (`systemctl status` or `docker ps`)
5. [ ] Test the API directly: `curl -X POST https://bb84.physc.../record_game_statistic/`
6. [ ] Test WebSocket: `wscat -c wss://bb84.physc.../ws/games/bb84/TEST/`
7. [ ] Once Bug #22 fix is deployed, the game will start regardless — but analytics will still fail silently until the backend is verified

**Note**: Even after fixing Bug #22 (try/catch), we should verify the backend is fully operational. Bug #22 makes the game resilient, but analytics and IP recording will be lost until the backend API is confirmed working.

**Estimated Time**: ~30 minutes investigation

---

### 24. 🟡 Multiplayer Refresh / Reconnect Recovery (BB84 / E91 / DPS)

**Status**: ✅ SHORT-TERM FRONTEND PARITY COMPLETE / 🟡 LONG-TERM BACKEND SNAPSHOT TODO
**Date Added**: May 26, 2026  
**Priority**: 🟡 MEDIUM — keep as backend-snapshot architecture reference
**Context**: Solo mode restoration works well and is intentionally `localStorage`-first. Multiplayer should use a different rule: the backend room is the source of truth for shared protocol facts, while `localStorage` is only a recovery cache for identity, local UI checkpoint, transcript, and drafts.

For this educational app, refresh must not blindly jump a player to the most advanced backend state. Multiplayer recovery should be **backend-authoritative but player-paced**:
- reconnect to the backend room first,
- get a room snapshot or ordered event history from the backend when available,
- compare it with the local player's last UI checkpoint,
- guide the player through any missed protocol steps in order,
- disable multiplayer actions while disconnected,
- if reconnect fails, offer retry / exit / continue locally as a solo-style simulation.

Short term, the frontend may keep using the existing local snapshot fallback where the backend does not yet provide a reconnect snapshot. Long term, BB84/E91/DPS should all converge on backend snapshot recovery.

**Current State per Protocol**:

| Protocol | Component File | Hydration function exported? | Current restoration |
|----------|----------------|------------------------------|-------------------------------------|
| **BB84** | `components/bb84/play-page/multi-game.tsx` | ✅ `hydrateBB84ProgressStore()` | Uses the progress hydrator, restores local room snapshot/config, and reconnects. Current working multiplayer reference. |
| **E91** | `components/e91/play-page/multi-game.tsx` | ✅ `hydrateE91ProgressStore()` | Validates saved player identity before restoring room data, restores progress/config, and guards duplicate reconnect attempts. |
| **DPS** | `components/dps/play-page/multi-game.tsx` | ✅ `hydrateDPSProgressStore()` | Restores player identity, room snapshot, progress, and config. DPS also persists photon config in player recovery data so refresh does not fall back to the default 20 rows. |

**What to do**:

#### Sub-task A: BB84 (Clarify and harden current frontend recovery)
- [ ] Verify BB84 role assignment still sets `playingMultiplayer: true` and `playingSolo: false` so refresh enters the multiplayer recovery branch.
- [x] Use `hydrateBB84ProgressStore()` in `components/bb84/play-page/multi-game.tsx` for step/tab/line recovery.
- [ ] Keep `restoreGame(gameData)` and config restores (`photonNumber`, `gameHasEve`, `validationBitsLength`) as the current local fallback until backend snapshots exist.
- [ ] Keep the `hasInitialized` ref since it guards all mount-time recovery operations.
- [ ] Document the backend requirement: on reconnect, BB84 should eventually receive a room snapshot or ordered event history instead of trusting only `localStorage`.

#### Sub-task B: E91 Multiplayer Stabilization

**Goal**: Make E91 multiplayer follow the current BB84 multiplayer recovery contract before starting the shared lifecycle refactor.

**Validated findings from review**:
- E91 already has `hydrateE91ProgressStore()`, but `components/e91/play-page/multi-game.tsx` still reads progress keys manually.
- E91 role assignment already sets `playingMultiplayer: true`, but does not explicitly set `playingSolo: false`.
- E91 `multi-game.tsx` restores `e91GameData` before validating `e91PlayerData`, so stale room state can be applied before the code knows whether the saved multiplayer session is valid.
- E91 rejoin restores and reconnects from the form page, while `multi-game.tsx` can also restore/reconnect on mount. This creates a timing-sensitive double-restore/double-connect risk.
- Completed-game refresh should restore the felicitation screen and skip play-socket reconnect. It should not automatically clear storage; clearing belongs to Home, Replay, or starting a fresh session.

**Urgent: fix first**
- [x] In `components/e91/play-page/multi-game.tsx`, validate `e91PlayerData` before calling `restoreGame(gameData)`.
  - Required valid fields: `gameCode`, `role`, and `room`.
  - If `e91PlayerData` is missing/invalid, reset `playingMultiplayer` to `false`, skip room restore, and initialize fresh welcome lines if needed.
- [x] In the E91 role-assignment branch in `components/providers/socket-provider.tsx`, set both mode flags: `playingMultiplayer: true` and `playingSolo: false`.
- [x] In `components/e91/home-page/e91-game-form-v3.tsx` rejoin flow, reassert `playingMultiplayer: true` and `playingSolo: false` before reconnecting.
- [x] In `components/e91/play-page/multi-game.tsx`, replace manual `e91Step`/`e91Tab`/`e91DisplayedLines` reads with `hydrateE91ProgressStore()`.
- [x] In `components/e91/play-page/multi-game.tsx`, restore E91 multiplayer config with BB84 parity:
  - `e91PhotonNumber`
  - `e91GameHasEve`
  - `e91ValidationBitsLength`

**Medium: harden after urgent fixes**
- [x] Decide one owner for E91 rejoin restore/reconnect:
  - Option A: form page restores identity only, then `multi-game.tsx` owns restore/reconnect.
  - Option B: form page restores/reconnects, and `multi-game.tsx` detects that rejoin is already in progress.
  - Decision: do not refactor this now. The app is working well after the reconnect guard, and the clean one-owner lifecycle should be solved by the planned shared multiplayer architecture instead of another E91-only intermediate refactor.
- [x] Use socket `playRoomConnecting` state, or an equivalent local guard, to prevent duplicate reconnect attempts during rejoin.
- [x] Add orphan-data handling on the E91 form page:
  - If `e91GameData` exists but `e91PlayerData` does not, treat it as stale/orphaned multiplayer data and clear E91 storage.
  - Preserve valid interrupted sessions by showing the rejoin dialog.
- [x] Verify completed E91 game refresh on `/e91/play`:
  - `gameSuccess=true` restores the felicitation screen.
  - The play socket is not reconnected.
  - Home/Replay/fresh start clears the old protocol data intentionally.

**Low: cleanup later**
> Deferred: keep these as optional follow-up tasks if the shared multiplayer architecture is not implemented soon. Do not prioritize them before deployment unless a visible bug appears.

- [ ] Remove or reactivate the dead `GameRestartDialog` path in `components/e91/play-page/tabs/solo-CHSH-tab.tsx`.
- [ ] Make `components/e91/play-page/graphPopup.tsx` theme-aware by replacing hardcoded white SVG text/dots with foreground-aware styling.
- [ ] Consolidate duplicated E91 `moveToExchangeTab` helpers into one helper that accepts the correct displayed step number.
- [ ] Keep `clearE91LocalStorage()` as the single cleanup entry point; do not add duplicate `resetRoom()` / `resetProgress()` calls next to it unless the helper is changed.

#### Sub-task C: E91 Active-Game Leave / Navigation Lifecycle

**Status**: ✅ URGENT FRONTEND WORK COMPLETE — partner-left behavior moved to future backend/frontend contract  
**Context**: The E91 refresh path now works well when Alice/Bob/Admin refresh each step. In-app active-game leave is handled by the E91 play page. Browser Back/Forward intentionally follows normal browser history and relies on saved-state recovery instead of fragile fake-history trapping.

**Observed tests**:
- [x] Refreshing each step across Admin + Alice private window + Bob separate browser restores correctly.
- [x] Clicking the `E91` title during an active game now shows a leave confirmation.
- [x] Clicking `Cancel` in the `E91` title leave confirmation stays in the same active game/step.
- [x] Clicking `OK` in the `E91` title leave confirmation clears the active session and navigates to `/e91`.
- [x] E91 in-app title exit now uses the page-level custom dialog flow (`Rester dans la partie` / `Quitter la partie`) instead of `window.confirm`.
- [x] The brief wrong render of empty step 1 during confirmed leave was replaced with a neutral `Déconnexion...` transition state.
- [x] Browser Back fake-history trapping was removed from the E91 play route. E91 now relies on in-app leave controls plus saved-state recovery.
- [x] Native browser unload warning was removed from E91 active play because refresh restore works and the browser cannot cleanly warn for close/change-URL while allowing refresh silently.
- [x] Accepted E91 browser Back/Forward behavior:
  - Back follows normal browser history instead of showing a custom warning.
  - Returning Forward to `/e91/play` restores the saved active game state.
  - In completed games, Forward can briefly visit `/e91/play` then continue according to browser history; this is acceptable for now because the game is already complete.
- [x] Partner-left behavior is intentionally not solved in this urgent pass; it is tracked as Task 27 because it needs a backend/frontend event contract.

**Resolved root causes**:
- `components/e91/play-page/e91-button.tsx` was a direct `Link` to `/e91` and closed `playRoomSocket` directly. It now delegates leave requests to the E91 play page.
- `usePreventNavigation`'s fake `popstate` trap proved fragile after refresh. E91 no longer uses it.
- `components/e91/home-page/e91-game-form-v3.tsx` redirected to `/e91/play` when `isPlayRoomConnected` was true, even if the local active session had just been cleared. It now requires a valid active session.

**Urgent next implementation**:
- [x] Add a socket-provider action such as `disconnectPlayRoom()` or `leavePlayRoom()` that closes the play socket and resets play-room connection flags.
- [x] Use a single E91 active-game leave handler that, after confirmation:
  - closes/leaves the play room,
  - clears E91 storage through `clearE91LocalStorage()`,
  - sets `playingSolo=false` and `playingMultiplayer=false`,
  - navigates to the intended destination (`/e91` for E91 title, `/` for main home/back exit).
- [x] Update `components/e91/play-page/e91-button.tsx` to show the same leave confirmation instead of using a raw `Link`.
- [x] Harden `components/e91/home-page/e91-game-form-v3.tsx` so `isPlayRoomConnected` alone cannot redirect to `/e91/play`; require a valid active E91 session too.
- [x] Add a page-level leaving state so cleanup does not briefly render an empty/fresh multiplayer step before route navigation completes.
- [x] Centralize E91 in-app leave behavior in `app/(main)/e91/play/page.tsx`; `components/e91/play-page/e91-button.tsx` now only requests leave and does not own cleanup/navigation.
- [x] Remove E91 native unload warning so refresh restores directly without an extra browser popup.
- [x] Remove E91's dependency on `usePreventNavigation()` / fake `popstate` browser-back trapping.
- [x] Avoid redundant play-page `router.replace()` on socket reconnect when the browser is already on the correct play page.
- [x] Document that E91 browser Back/Forward is now normal browser history, not an app-controlled leave flow. The supported clean leave path is the in-app `E91` title button.
- [x] Move partner-left notification / computer fallback to Task 27.
- [x] Re-test:
  - [x] click `E91` title and cancel => remains in same game/step,
  - [x] click `E91` title and confirm => reaches `/e91`, old game is cleared,
  - [x] refresh during active E91 play => no warning, state restores from saved snapshot,
  - [x] browser Back/Forward is no longer custom-trapped for E91; saved session/rejoin handles recovery if the route returns to `/e91/play`,

**Follow-up notes**:
- [x] Add defensive parsing for corrupted `e91PlayerData` / `e91GameData` in `components/e91/home-page/e91-game-form-v3.tsx`.
- [ ] Add defensive parsing inside E91 multiplayer restore helpers if future tests expose corrupt storage on direct `/e91/play` refresh.
- [x] Fix `components/shared/e91-progression-sidebar.tsx` notification badge to observe `useE91ProgressStore()` instead of `useBB84ProgressStore()`.

#### Sub-task D: DPS (Net-new restore logic for multiplayer)
- [x] Add `hasInitialized` ref to `components/dps/play-page/multi-game.tsx`
- [x] Add `restoreGame(gameData)` call for `dpsGameData`
- [x] Call `hydrateDPSProgressStore()` for step/tab/lines
- [x] Add config restoration for `dpsPhotonNumber`, `dpsGameHasEve`
- [x] Set DPS multiplayer role assignment to persist `playingMultiplayer: true` and `playingSolo: false`.
- [x] Persist DPS `photonNumber` and `validationBitsLength` in `dpsPlayerData` during role assignment, and restore them from `dpsPlayerData` as fallback on `/dps/play` refresh.
- [x] Harden DPS Alice inference so missing/partial `alicePhases[index]` cannot crash the UI while waiting for a complete saved snapshot.
- [x] **Test carefully**: DPS multiplayer refresh, completed-game refresh, replay to `/dps`, and quit-to-home behavior are stable enough for the current deploy revision.
- [x] Follow-up: DPS master results page now behaves like BB84/E91 after Task 29 frontend wiring; no backend change was needed.

**Estimated Time**:
- E91 urgent stabilization: ~1 focused session
- E91 medium hardening: ~1 additional session after urgent fixes are verified
- DPS multiplayer parity: separate follow-up task/session

---

### 26. 🟡 Architecture: Shared Protocol Session Lifecycle

**Status**: 🟡 DESIGN / TODO  
**Date Added**: June 9, 2026  
**Priority**: 🟡 MEDIUM-HIGH  
**Depends On**: Task 24 short-term frontend parity is complete. Long-term backend snapshot recovery remains part of this architecture work.

**Context**: The current app already has the correct building blocks:
- `player-store` for identity and solo/multiplayer flags
- protocol `game-store` files for configuration
- protocol `room-store` files for protocol-specific state
- protocol `progress-store` files for current step/tab/transcript
- protocol-specific `localStorage` keys for recovery

The missing piece is a shared lifecycle contract. Protocol room state should stay protocol-specific, but starting, saving, restoring, completing, replaying, and clearing should follow one standard lifecycle across BB84, E91, DPS, and future protocols.

**Reference Docs**:
- Main architecture plan: `docs/shared-protocol-lifecycle-adr.md`
- Historical context: `docs/storage-architecture.md`, `docs/protocol-session-lifecycle-diagrams.md`

**Target Rule**:

Protocol data stays protocol-specific. Session lifecycle becomes shared and standard.

**Recommended Order**:
1. [x] Finish short-term BB84/E91/DPS frontend recovery parity under Task 24.
2. [x] Commit the stable recovery state before architecture work.
3. [ ] Finalize the shared lifecycle contract in docs.
4. [ ] Create shared lifecycle helper/adapters:
   - `startFreshProtocolSession(protocol, mode)`
   - `saveProtocolCheckpoint(protocol)`
   - `restoreProtocolCheckpoint(protocol)`
   - `completeProtocolSession(protocol)`
   - `abandonProtocolSession(protocol)`
   - `clearProtocolStorage(protocol)`
5. [ ] Create protocol adapters for BB84, E91, and DPS.
6. [ ] Migrate BB84 first because it is the current working multiplayer reference.
7. [ ] Migrate E91 second because it has the more complex protocol state.
8. [ ] Migrate DPS after BB84 and E91 are stable.

**Design Notes**:
- A `ProtocolSession` is not a replacement for existing stores. It coordinates `player-store`, protocol game store, protocol room store, protocol progress store, and localStorage snapshot.
- A `ProtocolCheckpoint` is the last completed, committed protocol action.
- Temporary UI input is a draft, not necessarily a checkpoint.
- Completed games should keep their local snapshot so refresh restores the felicitation screen.
- Home/replay should intentionally clear the protocol session and start fresh.

**Estimated Time**: 1-2 days depending on how much adapter code is introduced.

---

### 27. 🟡 E91 Multiplayer: Partner Disconnected Computer Fallback

**Status**: 🟡 TODO / FUTURE UX  
**Date Added**: June 9, 2026  
**Priority**: 🟡 LOW for now  
**Depends On**: E91 active-game leave lifecycle and backend/player-left contract.

**Context**: If one human player leaves an E91 multiplayer room, the remaining player should not remain blocked forever. Eventually, the UI should explain that the human partner disconnected and offer to continue with a computer-controlled partner.

This is intentionally future work. It should not be guessed in the frontend only. The correct implementation needs a small backend/frontend contract:
- Frontend sends an explicit leave/abandon event when a player intentionally quits an E91 play room.
- Backend marks the player as left and broadcasts a partner-left event to the remaining player.
- Frontend receives that event and moves into a clear "partner disconnected" UI state.
- Computer fallback is added only after the event contract and scoring semantics are decided.

**Desired UX**:
- Bob/Alice receives a clear message such as: "Your human partner disconnected."
- The player can choose:
  - leave the game,
  - wait/retry if reconnect is possible,
  - continue with a computer partner.
- If continuing with the computer, the app converts the remaining flow into a solo-style simulation from the last safe checkpoint.

**Open questions**:
- Does the backend currently emit a reliable player-left event for E91 play rooms?
- What should the frontend send on intentional leave: existing `PLAYER_LEFT`, a new `LEAVE_ROOM`, or a protocol-specific `E91_PLAYER_LEFT` event?
- What payload should the backend broadcast: leaver role, remaining role, room id, game code, reconnect timeout, last safe checkpoint?
- What protocol state is required to convert an active E91 multiplayer game into a solo continuation?
- Should the converted game be scored as multiplayer, solo, or a separate "continued with computer" mode?

**Task**:
- [ ] Define the E91 backend leave event sent by the quitting player.
- [ ] Define the E91 backend partner-left event broadcast to the remaining player.
- [ ] Add frontend receive-handler for the E91 partner-left event.
- [ ] Add frontend "partner disconnected" state with leave/wait options.
- [ ] Add "continue with computer" transition only after the backend event contract is stable.
- [ ] Document scoring/result semantics before implementation.

---

### 28. 🔴 E91 Multiplayer: Short-Key Restart Must Be Synchronized

**Status**: 🔴 TODO / BUG — DO NOT FIX IN THE CURRENT SMALL HARDENING PASS  
**Date Added**: June 10, 2026  
**Priority**: 🔴 HIGH  
**Depends On**: E91 multiplayer backend event contract / room-level restart semantics.

**Context**: In E91 multiplayer, if the valid shared key is too short after basis classification, one player can see the "key too small, restart" flow before the other player reaches the same checkpoint. The restart is currently too local/client-driven, so Alice and Bob can diverge.

**Observed broken scenarios**:
- Scenario 1: Alice reaches the short-key condition first and restarts while Bob is still waiting for Alice/Bob data from the previous step. Bob later reaches a different state and can trigger another restart.
- Scenario 2: Alice restarts first and sends new-game data. Bob is still in the old game state, receives new data, and becomes inconsistent: old step + new key/data. Alice can then be blocked waiting for Bob in the restarted game.

**Why this is a real multiplayer bug**:
- Short-key restart is a room-level protocol transition, not a local UI action.
- Both players must reset from the same backend event.
- Old messages from the previous round must not be accepted after a restart.

**Desired contract**:
- Frontend sends a room-level event such as `SHORT_KEY_DETECTED` / `RESTART_REQUESTED`.
- Backend decides and broadcasts one restart event to both Alice and Bob.
- Both clients reset only when receiving the backend restart event.
- The restart event should include enough information to reset deterministically:
  - game code / room id,
  - restart round id or epoch,
  - roles if roles change,
  - Eve state,
  - photon/config values.
- Protocol messages should include a round id / restart epoch so stale messages from the previous round can be ignored.

**Task**:
- [ ] Define backend event names and payloads for E91 short-key restart.
- [ ] Add a frontend "waiting for synchronized restart" state after short key is detected.
- [ ] Disable protocol actions while waiting for the synchronized restart event.
- [ ] Reset both clients only from the backend broadcast.
- [ ] Add/verify round id or restart epoch so stale old-round messages are ignored.
- [ ] Test Alice-first and Bob-first short-key detection flows.

---

### 37. 🟡 DPS: Remove Remaining Fragile Browser Navigation Guard

**Status**: 🟡 BLOCKED AFTER MANUAL TEST — keep current guard for now
**Date Added**: June 15, 2026
**Priority**: 🟡 MEDIUM after DPS crash fix

**Context**: Earlier E91 work showed that custom browser back/refresh trapping was fragile. DPS multiplayer still uses `usePreventNavigation(!gameSuccess, handleNavCleanup)` inside `components/dps/play-page/multi-game.tsx`.

**Manual test result**: Removing the guard was attempted and then reverted. The test exposed hidden DPS crashes when the browser Back button was allowed to follow normal history:
- Bob Back path: navigating back to `/dps` can crash `better-react-mathjax` with `Cannot read properties of null (reading 'nextSibling')`.
- Alice path after Bob sends times: `components/dps/play-page/tabs/alice-inference-tab.tsx` can crash at `(alicePhases[index] as any).split("")` when a valid `T1/T2` index has no matching `alicePhases[index]`.

**Decision**: Do not remove the DPS browser guard yet. The guard is ugly, but it currently masks real route/state crashes. Fix the crashes first, then retry this cleanup.

**Expected direction**:
- Keep strong in-app leave confirmation on the DPS title button.
- Let browser refresh restore the saved snapshot without an extra warning.
- Avoid browser-back hacks that can produce inconsistent history behavior.

**Fix plan**:
- [x] Re-check current DPS/E91/BB84 navigation patterns before changing code.
- [x] Attempt removing `usePreventNavigation` from DPS multiplayer only.
- [x] Manual test DPS multiplayer refresh/back behavior with Alice + Bob.
- [x] Revert the removal after the manual test exposed hidden crashes.
- [ ] Fix or isolate the DPS `/dps` MathJax crash on browser Back before retrying normal browser history.
- [x] Harden `AliceInferenceTab` so missing/partial `alicePhases[index]` cannot crash the UI.
- [ ] Retry removing `usePreventNavigation` only after both blockers are fixed.

**Implementation note**:
- E91 already removed this fake browser-history trap.
- BB84 still uses `usePreventNavigation` in solo/multi; decide separately whether to clean BB84 after DPS is verified.

---

### 38. ⚪ DPS: Eve Mode Support

**Status**: ⏳ FUTURE
**Date Added**: June 15, 2026
**Priority**: ⚪ VERY LOW / after new architecture

**Context**: DPS currently has no real Eve flow. The solo modal explicitly notes that Eve is not implemented yet, and the DPS validation tab is effectively empty.

**Future task**:
- [ ] Define DPS Eve rules and UI.
- [ ] Add backend/frontend payload support if needed.
- [ ] Implement DPS validation tab.
- [ ] Add DPS Eve results fields only after the gameplay exists.

---

### 39. ⚪ DPS Solo: Add Results Table Like E91 Solo / DPS Multiplayer

**Status**: ⏳ FUTURE
**Date Added**: June 15, 2026
**Priority**: ⚪ LOW / after deployment-critical DPS polish

**Context**: DPS multiplayer now has a shared results table, and E91 solo has a dedicated `/e91/solo-results` route. DPS solo currently ends with local replay/main-menu buttons only; there is no DPS solo results page/table.

**Expected future behavior**:
- DPS solo success should offer a real results screen instead of only local end buttons.
- The UI should be aligned with E91 solo and DPS multiplayer where possible.
- Results should include at least player role/pair, elapsed time if available, and useful DPS-specific values such as photon count or final key length if already stored.

**Task**:
- [ ] Design the DPS solo result payload from existing local DPS stores.
- [ ] Add a DPS solo results route.
- [ ] Add a DPS solo results table component.
- [ ] Update DPS solo progression to navigate to the solo results page.
- [ ] Keep replay/main-menu cleanup behavior consistent with E91 solo and DPS multiplayer.

---

### 40. 🟡 Architecture: Shared Protocol Lifecycle Implementation

**Status**: 🟡 TODO / ACTIVE ARCHITECTURE BRANCH  
**Date Added**: June 22, 2026  
**Priority**: 🟡 MEDIUM-HIGH  
**Branch**: `ibra_architecture`  
**Main reference**: `docs/shared-protocol-lifecycle-adr.md`

**Goal**: Implement one shared lifecycle rule for BB84, E91, DPS, and future protocols:

`start -> save -> refresh/restore -> leave -> replay -> complete -> results`

Protocol room data stays protocol-specific. The shared layer only owns the lifecycle operations that are currently duplicated across protocols.

**Working rules**:
- Do not rewrite all protocols at once.
- Keep the public lifecycle API simple; hide mode-specific details inside helpers unless callers really need them.
- Review, discuss, and correct architecture changes before committing them.
- Each phase must compile before commit.
- Each protocol migration must be manually tested before moving to the next one.
- Keep socket-provider refactor last.
- Record bugs found during the migration here instead of hiding them in memory.
- Track every caution, bug, and design decision in this file or the ADR before moving on.
- At call sites, prefer lifecycle intention names (`startFresh`, `abandon`) over repeated cleanup mechanics.

**Phase 1: Shared lifecycle infrastructure only**
- [x] Create `lib/protocol-lifecycle/types.ts`.
- [x] Create `lib/protocol-lifecycle/lifecycle.ts`.
- [x] Create `lib/protocol-lifecycle/bb84-adapter.ts`.
- [x] Create `lib/protocol-lifecycle/e91-adapter.ts`.
- [x] Create `lib/protocol-lifecycle/dps-adapter.ts`.
- [x] Create `lib/protocol-lifecycle/registry.ts`.
- [x] Build passes.
- [x] No protocol behavior changes yet.

**Phase 1b: Restore API hardening**
- [x] Keep `restoreCheckpoint(adapter)` as the single public restore door.
- [x] Restore local checkpoint for solo and multiplayer without requiring `playerDataKey`.
- [x] Validate multiplayer identity internally only when `playerDataKey` exists.
- [x] Replace nullable restore status with explicit result objects.
- [x] Document that multiplayer restores local UI first, then reconnects/reconciles backend truth.
- [x] Document internal restore/reconnect components so the client/server flow is discoverable.
- [x] Build passes.

**Phase 2: BB84 pilot**
- [ ] Phase 2a: migrate only BB84 cleanup/start/exit calls to lifecycle helpers.
- [ ] Keep BB84 behavior identical to the current stable app.
- [ ] Test BB84 solo: start, refresh, complete, replay, leave.
- [ ] Test BB84 multiplayer: create/join, refresh, leave guard, completion, results.
- [ ] Commit BB84 migration before touching E91.

**Phase 2a: BB84 safe cleanup/start mapping**

Safe now:
- [ ] `components/bb84/home-page/bb84-game-form-v3.tsx`: replace stale/corrupt session cleanup and rejoin cancel cleanup with lifecycle cleanup intent.
- [ ] `components/bb84/home-page/bb84-game-form-v3.tsx`: replace join/create pre-cleanup with `startFresh(bb84Adapter)`.
- [ ] `components/bb84/home-page/solo-game-modal.tsx`: replace solo game start cleanup with `startFresh(bb84Adapter)`.
- [x] `app/(main)/bb84/play/page.tsx`: replace intentional leave cleanup with `abandon(bb84Adapter)`.
- [x] `components/bb84/play-page/solo-game.tsx`: replace solo navigation cleanup with `abandon(bb84Adapter)`.
- [x] `components/bb84/play-page/multi-game.tsx`: replace multiplayer navigation cleanup with `abandon(bb84Adapter)`.
- [x] `components/bb84/play-page/bb84-progression.tsx`: replace successful solo main-menu cleanup with `abandon(bb84Adapter)`.
- [x] `app/(main)/games/[gameType]/[gameCode]/results/page.tsx`: replace BB84 results home cleanup with lifecycle cleanup intent.

Do not touch yet:
- [ ] `components/bb84/home-page/bb84-game-form-v3.tsx`: keep `getGameProgress()` manual rejoin/restore flow.
- [ ] `components/bb84/play-page/solo-game.tsx`: keep mount-time refresh restore flow.
- [ ] `components/bb84/play-page/multi-game.tsx`: keep mount-time refresh/reconnect flow.

Special cases to leave alone:
- [ ] `lib/bb84/utils.ts`: keep `restartWithoutEve()` until we design an explicit lifecycle action for it.
- [ ] `components/bb84/play-page/tabs/basis-tab.tsx`: keep key-too-small restart logic unchanged.
- [ ] BB84 replay currently routes to `/bb84` and relies on completed-game mount cleanup / next `startFresh`; later define explicit replay lifecycle behavior.
- [ ] `components/bb84/play-page/tabs/messaging-tab.tsx`: remove unused `clearBB84LocalStorage` import in a tiny cleanup.

**Phase 3: E91 migration**
- [ ] Migrate E91 cleanup/start/restore calls after BB84 is stable.
- [ ] Preserve completed-game refresh behavior.
- [ ] Preserve active-game leave guard.
- [ ] Test E91 solo and multiplayer, including refresh/reconnect and results.

**Phase 4: DPS migration**
- [ ] Migrate DPS cleanup/start/restore calls after E91 is stable.
- [ ] Preserve DPS refresh fixes and result-table behavior.
- [ ] Test DPS solo and multiplayer, including Alice/Bob refresh edge cases.

**Phase 5: Socket-provider cleanup last**
- [ ] Extract shared waiting-room connect/disconnect/start logic only after all protocol lifecycle migrations are stable.
- [ ] Keep protocol-specific play-room event handlers separate.
- [ ] Test full multiplayer flows for BB84, E91, and DPS.

**Bugs / decisions found during implementation**:
- [ ] Adapter caution: keep each `storageKeys` list complete or stale localStorage can survive abandon/replay.
- [ ] Adapter caution: `getRoomSnapshot()` must stay JSON-safe; add explicit snapshot mappers if stores gain non-serializable values.

---

### 41. ⚪ Repository Structure Cleanup After Lifecycle Migration

**Status**: ⚪ DEFERRED
**Date Added**: June 23, 2026
**Priority**: ⚪ LOW until lifecycle migration is stable

**Goal**: clean folder ownership so future contributors can find files by responsibility, not by history.

**Current findings**:
- `components/shared/` contains protocol-specific UI: `bb84-progression-sidebar.tsx`, `e91-progression-sidebar.tsx`, `dps-progression-sidebar.tsx`.
- `components/shared/` should mean reusable UI used across protocols, not "old place for mixed components".
- `commons/http.ts` overlaps semantically with `lib/` / service code and should be reviewed.
- `app/(main)/services/api.js` is app-route-adjacent service code; decide if it belongs in `lib/` or a dedicated API client folder.
- Translation/content ownership is split between `lang/` TypeScript line files and `content/` markdown files; document the rule before moving anything.

**Possible target structure**:
- Move protocol-specific UI to `components/{protocol}/...` when touched for real work.
- Keep generic UI primitives in `components/ui/`.
- Keep reusable cross-protocol React components in `components/shared/`.
- Keep non-React logic in `lib/`.
- Keep Zustand stores in `store/`.
- Keep React hooks in `hooks/`.

**Rule**: do this as isolated cleanup commits after BB84/E91/DPS lifecycle migration, unless a file must move for the migration itself.

---

### 42. ⚪ Navigation Guard Alignment After Lifecycle Migration

**Status**: ⚪ DEFERRED
**Date Added**: June 23, 2026
**Priority**: ⚪ LOW until lifecycle migration is stable

**Goal**: use the modern navigation standard consistently across BB84, E91, DPS, and future protocols.

**Standard**:
- Guard in-app protocol/title navigation with the custom `Rester dans la partie` / `Quitter la partie` dialog.
- Do not hijack browser Back with fake `pushState` traps.
- Trust refresh/rejoin recovery instead of trying to lock users into the page.

**Future cleanup**:
- [ ] Remove `usePreventNavigation` from BB84 solo and multiplayer after BB84 lifecycle migration is stable.
- [ ] Remove `usePreventNavigation` from DPS multiplayer after DPS lifecycle migration is stable.
- [ ] Keep E91 as the reference for no browser-back trap.
- [ ] Preserve in-app leave dialogs for all protocols.

---

### 🧪 LOCAL TESTING NOTE: Same-Browser Tab Collision

**Not a code bug** — this is a testing methodology issue.

All Chrome tabs on the same origin share the exact same `localStorage`. The Zustand persist store (`player-storage`) writes `playerRole`, `playerId`, `playingSolo`, etc. When 3 tabs (Master, Alice, Bob) all write to the same key, they overwrite each other's state.

**Proper local multiplayer testing**:
- Tab 1: Normal Chrome window (Master)
- Tab 2: Chrome Incognito window (Alice) — separate localStorage
- Tab 3: Firefox or Safari (Bob) — separate localStorage

This is expected browser behavior, not a bug to fix.

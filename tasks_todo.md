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
- [x] Phase 2a: migrate only BB84 cleanup/start/exit calls to lifecycle helpers.
- [x] Phase 2b: migrate BB84 solo restore to `restoreCheckpoint(bb84Adapter)`.
- [x] Phase 2c: migrate BB84 multiplayer restore/reconnect after solo restore is stable.
- [x] Keep BB84 behavior identical for migrated cleanup/start/exit paths.
- [x] Test BB84 solo restore after Phase 2b.
- [x] Test BB84 multiplayer restore/reconnect after Phase 2c.
- [ ] Finish BB84 pilot before touching E91. `bb84-game-form-v3.tsx#getGameProgress()` now DELETED (commit `c894fbf`) — replaced by read-only detection on `/bb84` plus play-page-only restore/reconnect. Remaining pilot work before E91: (1) `usePreventNavigation` removal slice + browser-Back rejoin test, (2) Task 45 solo play-page fail-close.

**Phase 2a: BB84 safe cleanup/start mapping**

Safe now:
- [x] `components/bb84/home-page/bb84-game-form-v3.tsx`: replace stale/corrupt session cleanup and rejoin cancel cleanup with lifecycle cleanup intent.
- [x] `components/bb84/home-page/bb84-game-form-v3.tsx`: replace join/create pre-cleanup with `startFresh(bb84Adapter)`.
- [x] `components/bb84/home-page/solo-game-modal.tsx`: replace solo game start cleanup with `startFresh(bb84Adapter)`.
- [x] `app/(main)/bb84/play/page.tsx`: replace intentional leave cleanup with `abandon(bb84Adapter)`.
- [x] `components/bb84/play-page/solo-game.tsx`: replace solo navigation cleanup with `abandon(bb84Adapter)`.
- [x] `components/bb84/play-page/multi-game.tsx`: replace multiplayer navigation cleanup with `abandon(bb84Adapter)`.
- [x] `components/bb84/play-page/bb84-progression.tsx`: replace successful solo main-menu cleanup with `abandon(bb84Adapter)`.
- [x] `app/(main)/games/[gameType]/[gameCode]/results/page.tsx`: replace BB84 results home cleanup with lifecycle cleanup intent.

Still open:
- [x] `components/bb84/home-page/bb84-game-form-v3.tsx`: `getGameProgress()` DELETED (commit `c894fbf`). Detection on `/bb84` is now read-only (`detectBB84Session()`); `/bb84/play` is the sole owner of `restoreCheckpoint(bb84Adapter)` and reconnect.

**Phase 2d: BB84 rejoin design decision**
**Status**: ✅ IMPLEMENTED & manually tested — committed as `c894fbf`. Tested: solo A/B direct `/bb84`, solo via `/`→BB84 card, rejoin cancel→cleared, completed→no dialog, multi A/B rejoin via `/bb84` and `/`. Browser-Back rejoin intentionally NOT tested here (blocked by `usePreventNavigation`; that is the next separate slice). Solo play-page corrupt/missing fail-close is deferred to Task 45.
Context:
- Refresh on `/bb84/play` is already handled by `restoreCheckpoint(bb84Adapter)`.
- Rejoin is for leaving the play route and later landing on `/bb84` with a recoverable active session: browser Back, manual URL entry, closed tab reopened, or dev navigation.
- In-app BB84 title/protocol navigation is already guarded; if the user explicitly chooses "Quitter", `abandon(bb84Adapter)` should clear the session and no rejoin should appear.
- Detection must be read-only. Do not call `restoreCheckpoint()` from the form page just to decide whether a dialog should appear, because it mutates stores.

Current architecture smell (confirmed LIVE, not hypothetical):
- Two restore owners already exist and already diverge:
  - `/bb84/play` uses clean `restoreCheckpoint(bb84Adapter)` — validates corrupt `bb84GameData`, returns explicit `{kind}`.
  - `/bb84` uses old manual `getGameProgress()` — hand-reads 7 keys, no corrupt-data validation, reconnects from the form page.
- `getGameProgress()` does not navigate; navigation happens as a side effect when `isPlayRoomConnected` flips and the form effect re-runs. That timing coupling is the fragility to remove.
- Solo rejoin is currently ABSENT, not imperfect: the rejoin dialog only opens when `bb84PlayerData` exists, and `bb84PlayerData` is written for multiplayer only. `getGameProgress()` never sets `playingSolo`. A solo player returning to `/bb84` gets no rejoin offer today, so Phase 2d solo detection is net-new work, not a refinement.

Accepted direction (IMPLEMENTED — commit `c894fbf`):
- [x] Replace manual form-page rejoin restore with read-only session detection on `/bb84` (`detectBB84Session()`).
- [x] Keep `/bb84/play` as the only owner of `restoreCheckpoint(bb84Adapter)` and multiplayer reconnect. Verified by grep: `connectToPlayRoom('bb84', …)` now only in `multi-game.tsx`.
- [x] On rejoin accept, route to `/bb84/play` (via `router.replace`) after setting the existing mode flags correctly:
  - solo: `playingSolo=true`, `playingMultiplayer=false`
  - multiplayer: `playingSolo=false`, `playingMultiplayer=true`
- [x] On rejoin decline, call `abandon(bb84Adapter)` and stay on the BB84 form page.
- [x] Make the rejoin dialog require an explicit accept/decline choice; block Escape/outside-click dismissal.

Mode detection for this slice:
- Multiplayer candidate: valid active `bb84PlayerData` + valid active `bb84GameData`.
- Solo candidate (IMPLEMENTED, flag-independent): valid active `bb84GameData` + NO valid `bb84PlayerData`. The originally-planned `playingSolo === true` check was dropped after testing: the landing page (`app/(main)/page.tsx:24`) resets `playingSolo` on mount, which hid a recoverable solo session when the user returned through `/`. Keying on the absence of multiplayer identity is robust across that reset.
- Completed or corrupt data: clear with `abandon(bb84Adapter)`.
- No recoverable session: show normal BB84 form page.

Do not solve in this slice:
- Do not create a generic session system yet.
- Do not rename localStorage keys yet.
- Do not migrate E91/DPS rejoin yet.
- Do not remove `usePreventNavigation` in THIS slice. Rejoin is now implemented and tested (except the Back path), so its removal is the NEXT separate slice, where the browser-Back rejoin path gets validated.

**Phase 2b: BB84 solo restore mapping**
- [x] Add optional `hydrateConfig()` adapter hook for setup/config state.
- [x] Implement BB84 config hydration for photon count, Eve flag, and validation length.
- [x] Replace BB84 solo manual room/progress/config restore with `restoreCheckpoint(bb84Adapter)`.
- [x] Test BB84 solo refresh as Alice and Bob with custom photon count.
- [x] Test BB84 solo refresh with Eve enabled and disabled.
- [x] Test BB84 solo completed-game refresh.

**Phase 2c.1: BB84 multiplayer restore mapping**
- [x] Document fail-closed rule before code migration.
- [x] If `bb84GameData` is missing/corrupt, or `bb84PlayerData` is missing/invalid, fail closed with `abandon(bb84Adapter)` and `router.replace('/bb84')`.
- [x] This intentionally avoids the old behavior of reconnecting with valid `bb84PlayerData` but missing room state; the play socket does not resend a full room snapshot on reconnect.
- [x] HOC note: `is-connected.tsx` trusts protocol player data in localStorage, so resetting only `playingMultiplayer` is not enough.

**Phase 2c.2: BB84 multiplayer restore migration**
- [x] Code migration target: `components/bb84/play-page/multi-game.tsx` only; leave `bb84-game-form-v3.tsx#getGameProgress()` manual for this slice.
- [x] Tests: active refresh Alice/Bob, completed refresh with no reconnect, corrupt `bb84PlayerData`, and orphan `bb84PlayerData` without `bb84GameData`.

Special cases to leave alone:
- [ ] `lib/bb84/utils.ts`: keep `restartWithoutEve()` until we design an explicit lifecycle action for it.
- [ ] `components/bb84/play-page/tabs/basis-tab.tsx`: keep key-too-small restart logic unchanged.
- [ ] BB84 replay currently routes to `/bb84` and relies on completed-game mount cleanup / next `startFresh`; later define explicit replay lifecycle behavior.
- [x] `components/bb84/play-page/tabs/messaging-tab.tsx`: remove unused `clearBB84LocalStorage` import in a tiny cleanup.

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
- [ ] BB84 solo setup: photon minimum validation uses `BB84_TEST_MODE` values, but the translated message still says production values `16`/`10`; align copy or disable test mode before deployment.
- [ ] Home page/dev startup: refreshing quickly after `npm run dev` can land near `/#about` with hero/protocol sections apparently missing or mis-positioned. Likely hash/scroll restoration before the dev layout finishes loading; reproduce separately before fixing.
- [ ] BB84 multiplayer partner-left gap: fail-closed/quit cleans Alice locally, but Bob and the master results page can remain waiting. Define a backend/frontend leave event policy before fixing.
- [ ] DPS tiny cleanup: remove unused wrong `clearBB84LocalStorage` import from `components/dps/play-page/tabs/alice-messaging-tab.tsx`.
- [ ] Naming/design cleanup: `{protocol}PlayerData` really means `{protocol}MultiplayerSession`; document or rename later. Note: the code's own type is already named `MultiplayerSession` (`lib/protocol-lifecycle/types.ts`), so only the localStorage key string and `adapter.playerDataKey` lag behind — the rename is conceptually cheap, but still needs a storage-key migration shim on deploy.
- [ ] Mode cleanup: `/bb84/play` currently renders `playingSolo ? <SoloGame /> : <MultiGame />`; future architecture should use an explicit session mode instead of treating "not solo" as multiplayer. GUARDRAIL: when `mode` is introduced it must REPLACE the two booleans (`playingSolo`, `playingMultiplayer`), NOT add a third field beside them — a third field triples the drift surface. This is the "bigger refactor" (touches `is-connected.tsx`, socket-provider role assignment, all three protocols); defer, do not do it in Phase 2d.
- [ ] Protocol entry-flow target: `/protocol` -> choose mode -> create session -> `/protocol/play` -> render from explicit mode.
- [ ] DPS safety bug — PROMOTED to Task 44 (high-priority standalone, not normal deferred cleanup): DPS partner-left paths call `localStorage.clear()`, wiping BB84/E91/player-storage too. Do as an isolated fix after BB84 Phase 2d rejoin is tested.
- [ ] `socket-provider.tsx` DPS partner-left cleanup is duplicated in `B_BASES_EVENT` and `PLAYER_LEFT_EVENT`; consolidate as part of Task 44.
- [ ] `RESTART_WITHOUT_EVE_EVENT` manually removes protocol localStorage keys; later design an explicit lifecycle action instead of mixing it into the BB84 rejoin slice.
- [ ] `is-connected.tsx` currently infers sessions from `player-storage` and `{protocol}PlayerData`; future adapter-based detection should consider `adapter.gameDataKey` too.
- [ ] BB84 solo completed restore works by restored room state/lines, but `solo-game.tsx` does not explicitly branch on `result.kind === 'completed'`; clarify opportunistically if touching that file. Related: Task 45 (solo play-page must fail-close on `missing`/`corrupted`).
- [ ] `multi-game.tsx` reads `session.gameHasEve` through the generic session index signature; leave for now, but avoid spreading protocol-specific fields into the generic type without a real need.

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
- `beforeunload` is native browser behavior, but it also fires on refresh; do not re-enable it while refresh restore is expected to be silent.
- `usePreventNavigation` currently implements only the fragile `popstate` back-button trap; its `beforeunload` code is commented out.

**Future cleanup**:
- [x] Removed BB84 `usePreventNavigation` popstate trap from solo+multi play (commit `042354a`, Task 46 Slice 1). Browser Back now follows normal history; refresh+rejoin handle recovery.
- [ ] Remove `usePreventNavigation` from DPS multiplayer after DPS lifecycle migration is stable.
- [ ] Keep E91 as the reference for no browser-back trap.
- [ ] Preserve in-app leave dialogs for all protocols.
- [ ] Do not re-enable `beforeunload` unless we accept that refresh will show the native browser warning too.

---

### 43. 🔴 Generic Multiplayer Partner-Left Lifecycle

**Status**: 🔴 OPEN
**Priority**: 🔴 HIGH after BB84 Phase 2c restore commit

**Problem**:
- `PLAYER_LEFT_EVENT` is currently handled only for DPS in `socket-provider.tsx`.
- BB84/E91 partners can stay blocked when the other player leaves, fails closed, or disconnects.
- The master/results page can keep waiting forever because abandoned rooms are not represented as completed/abandoned.

**Frontend plan**:
- [ ] Refactor `PLAYER_LEFT_EVENT` to use `getProtocolAdapter(gameType)` and `abandon(adapter)`.
- [ ] Route the remaining player to `/${gameType}` instead of `/`.
- [ ] Remove DPS-specific `localStorage.clear()` from partner-left cleanup.
- [ ] Preserve toast notification that the partner left.

**Backend/master plan**:
- [ ] Define an abandoned-room status/event.
- [ ] Backend should mark abandoned rooms and notify result/master views.
- [ ] Results page should show abandoned rooms instead of waiting forever.

**Architecture docs**:
- [x] Add partner-left/abandon flow to the lifecycle sequence diagram.
- [x] Add `PLAYER_LEFT_EVENT` as a shared multiplayer lifecycle event in the ADR.
- [x] Document that frontend cleanup and backend abandoned-room status are separate responsibilities.

---

### 44. 🔴 DPS Safety: Remove Cross-Protocol `localStorage.clear()` from Partner-Left Paths

**Status**: 🔴 OPEN — standalone high-priority safety fix (NOT normal deferred cleanup)
**Date Added**: July 1, 2026
**Priority**: 🔴 HIGH
**Ordering**: Small isolated fix AFTER BB84 Phase 2d rejoin is tested. Do not mix into Phase 2d.

**Why this is not ordinary cleanup**:
- This is a data-safety bug, not a naming/refactor smell. Its blast radius does not respect the BB84 pilot ordering.
- DPS socket partner-left paths call `localStorage.clear()`, which wipes ALL app storage — BB84, E91, and `player-storage` — not just DPS keys.
- A DPS multiplayer partner leaving can therefore destroy an unrelated protocol's saved session.

**Findings**:
- `localStorage.clear()` appears in DPS socket partner-left handling in `components/providers/socket-provider.tsx`.
- The DPS partner-left cleanup is duplicated across `B_BASES_EVENT` and `PLAYER_LEFT_EVENT`; both must be fixed and ideally consolidated.

**Fix plan**:
- [ ] Replace `localStorage.clear()` with `abandon(dpsAdapter)` (clears only DPS keys via `adapter.storageKeys`) in DPS partner-left paths.
- [ ] Consolidate the duplicated DPS partner-left cleanup in `B_BASES_EVENT` and `PLAYER_LEFT_EVENT` into one path.
- [ ] Verify BB84/E91/`player-storage` survive a DPS partner-left event.
- [ ] Align with Task 43 (generic `PLAYER_LEFT_EVENT` via `getProtocolAdapter(gameType)` + `abandon(adapter)`) so this is not implemented twice. Task 44 is the safety-critical subset that can ship now; Task 43 remains the full partner-left lifecycle that needs the backend contract.

---

### 45. 🟡 BB84 Solo Play-Page Restore: Fail-Close on Missing/Corrupt Checkpoint

**Status**: ✅ DONE — committed as `4508907` (separate slice, after Phase 2d `c894fbf`)
**Date Added**: July 1, 2026
**Priority**: 🟡 MEDIUM — low trigger probability, but produces a frozen screen
**Found**: during Phase 2d manual testing (corrupt `bb84GameData` + refresh on `/bb84/play`).

**Symptom**:
- On `/bb84/play`, corrupting `bb84GameData` then reloading (as solo Bob) shows a stuck
  "Bienvenue dans BB84 ! / En attente des photons d'Alice..." screen, with photon count reverted
  to the store default 20. Bob waits forever because solo has no Alice/socket to send photons.

**Root cause (pre-existing, NOT caused by Phase 2d — this is the play page, not the `/bb84` form)**:
- `restoreCheckpoint(bb84Adapter)` returns `{kind:'corrupted'}` and exits early
  (`lib/protocol-lifecycle/lifecycle.ts`), before `restoreRoom`/`hydrateProgress`/`hydrateConfig`.
- `components/bb84/play-page/solo-game.tsx` treats `missing` and `corrupted` as a "fresh session"
  and pushes Bob's welcome+waiting lines, but never regenerates Alice's photons or fails closed.
- Result: empty room + default photon count (`bb84-game-store` has no persistence) + Bob stuck.

**Design note — `missing` should ALSO fail-close (correction to the other agent's proposal)**:
- A legitimate fresh solo start is NOT `missing`: the solo modal writes `bb84GameData = {evePresent}`
  before `router.replace('/bb84/play')`, so a real fresh start restores as `active`. The fresh-Alice
  welcome is driven by `kind === 'active' && displayedLines.length === 0`, not by `missing`.
- Therefore, on the play page, BOTH `missing` and `corrupted` are anomalous → fail-close, mirroring
  `multi-game.tsx` (no valid session → `abandon` + `router.replace('/bb84')`). Keeping `missing` as a
  fresh session would leave the same frozen-Bob defect for the `missing`+Bob case.

**Fix plan**:
- [x] In `components/bb84/play-page/solo-game.tsx`, on `result.kind === 'missing' || 'corrupted'`:
      `abandon(bb84Adapter)` → `router.replace('/')` → `return`. Target is `/`, NOT `/bb84`: `abandon`
      flips `playingSolo` false, so the route swaps SoloGame→(guarded) MultiGame, and `is-connected`
      finds no session and redirects to `/`. Targeting `/` matches that guard deterministically instead
      of racing it. (The "swap" never paints MultiGame — `is-connected` renders null then redirects.)
- [x] Keep the fresh-welcome branch only for `kind === 'active'` with empty `displayedLines`.
- [ ] (Optional, deferred) Decide whether `restoreCheckpoint` should reset stores on `'corrupted'` so no
      caller can be left half-restored; caller-side `abandon` already avoids the half-state.
- [x] Tested: corrupt & missing on `/bb84/play` → redirect to `/`, no frozen screen. Normal solo refresh
      and completed-solo refresh still restore correctly.

---

### 46. 🟡 BB84 Browser-Back / Navigation Hardening (post-`usePreventNavigation` removal)

**Status**: 🟡 OPEN — surfaced while testing the trap-removal slice
**Date Added**: July 1, 2026
**Priority**: mixed (see per-item priorities)

**Prerequisite (P0)**: ✅ DONE — Slice 1 removed `usePreventNavigation` from BB84 solo+multi (commit `042354a`). Manually tested: in-app title "Quitter la partie ?" dialog (Rester/Quitter), mid-game refresh restore (solo + multi), completed-game refresh félicitation, and the old native "Quitter la partie ? Votre progression sera perdue." confirm no longer appears. Next active work: **P1 / Slice 2**.

**Verified navigation model (grounded in code)**:
- Landing card → `/bb84`: `<Link href="/bb84">` (push).
- `/bb84` → `/bb84/waiting-room` (multi): `socket-provider.tsx:288` `router.push('bb84/waiting-room')`.
- `/bb84/waiting-room` → `/bb84/play` (game start): `navigateToPlayPage` `router.replace` (kills the lobby; `/bb84` preserved).
- `/bb84` → `/bb84/play` (solo start): `solo-game-modal.tsx:194` `router.replace` (overwrites `/bb84`).
- Result: multi Back → `/bb84` (good, only broken by Issue 1); solo Back → `/` (skips `/bb84`).

**Issues / slices**:
- [x] **RESOLVED — Slice 2b (tested green, uncommitted WIP): connected-multiplayer auto-bounce removed.** `bb84-game-form-v3.tsx`: the mount effect no longer `router.replace('/bb84/play')`-bounces when `isPlayRoomConnected` + recoverable session; it now shows the rejoin dialog even with a live socket, and *decline* (`onCancelRejoin`) does `disconnectPlayRoom()` + `abandon`. Ibra tested multi (Alice+Bob): M1 Back → `/bb84` + rejoin dialog + full restore ✅; M2 decline → clean socket `CloseEvent {code: 1000, wasClean: true}` ✅. Known/deferred: on decline the *partner* stays blocked (no partner-left signal) — Tasks 27/43.
- [x] **RESOLVED — Slice 2c (tested green, uncommitted WIP): rejoin `replace` → `push`.** `onRejoin` did `router.replace('/bb84/play')`; from `/bb84` (after Back) that overwrote `/bb84` and left a stale forward `/bb84/play`, so history became `[/, /bb84/play, /bb84/play]` — forward stayed active but no-op'd then died, Back no-op'd once then jumped to landing. Fixed: `replace` → **`push`** per the Slice 2a rule (both `/bb84` and `/bb84/play` are real destinations); push keeps a clean, bounded `[/, /bb84, /bb84/play]` even on repeat rejoin. Ibra tested multi (Alice+Bob): repeated Back → `/bb84` → Rejoin at several game steps, **forward arrow no longer stuck-active** ✅.
- [x] **RESOLVED — Slice 3a (tested green, uncommitted WIP): disconnect on completed/corrupt abandon.** Repro was (multi, to félicitation): Back → `/bb84`, Forward → `/bb84/play` rendered a **phantom fresh step-1 game** Alice+Bob could actually play, because the play sockets stayed live. **Root, fully traced:** the real gate is `is-connected.tsx` (wraps `MultiGame` via `isConnected(MultiGame)`), whose `connected = hasLocalSession || playingSolo || playingMultiplayer || isWaitingRoomConnected || isPlayRoomConnected`. On Back, the form effect's `completed` branch already ran `abandon()`, which (`lifecycle.ts:138`) clears `bb84PlayerData` **and** `resetPlayerModeFlags()` (playingSolo/Multi → false) — so the ONLY term keeping `connected` true was the lingering `isPlayRoomConnected` socket. **Fix (Slice 3a):** the `corrupt`/`completed` branch now also `disconnectPlayRoom()`. Then Forward → is-connected sees all terms false → `redirect('/')`. Deterministic (abandon resets flags synchronously). Ibra tested: Forward briefly shows `/bb84 → /bb84/play → /`, **no phantom, no screen flash**, sockets closed ✅. (Note: lands on `/`, not `/bb84`, because that redirect is is-connected's shared hardcoded `redirect('/')` — same for all protocols; acceptable.)
- [ ] **P3 (was P2) — Slice 3b: is-connected should require session DATA, not just a live socket (deferred, no current reproducer).** Class-level hardening: `is-connected.tsx` treats `isPlayRoomConnected`/`isWaitingRoomConnected` as sufficient proof of a valid session, so a socket-alive-but-no-session state renders the game. Slice 3a removed the one path that produced that state; after it, **no reproducer remains** (completed/corrupt → disconnects; decline → disconnects; normal play/waiting-room → real session). Per discipline (reproduce first, keep slices tight) this is **deferred** as defense-in-depth against future code that opens a socket without a session — do NOT build blind. Related to the `is-connected` gap under "Deeper root" below.
- [x] **RESOLVED & DONE — Slice 2a (commit `c23a24b`):** solo start now uses `push` (`solo-game-modal.tsx`), so solo Back → `/bb84` → rejoin (tested: Back/Forward traverse `[/, /bb84, /bb84/play]` cleanly, rejoin each time, decline clears). Kept `replace` for waiting-room→play. Rule adopted: **replace transient screens, push real destinations.** (Ibra + other agent agreed.)

**Tests observed (2026-07-01)**:
- Test A (multi, played to félicitation): Back → `/`, Forward → `/bb84/play` empty step 1. → Issue 2 (P2). The landing page clears completed data (`page.tsx:31-33`), so Forward re-enters an emptied session. **Superseded by the 2026-07-07 repro** in the Slice 3 item above: post-Slice-2a the Back now lands on `/bb84` (not `/`), and the emptied session is cleared by the form effect's `completed` branch — Forward then renders the phantom fresh game. Trigger now understood (socket stays live).
- Test B (multi, results table): Back → `/`, Forward → results table restored. **Works, no action** — results is a backend route (`app/(main)/games/[gameType]/[gameCode]/results`).

**Deeper root → now owned by Task 48** (session single-source-of-truth refactor). `is-connected.tsx` ignores `{protocol}GameData`; `/bb84/play` uses the `playingSolo ? Solo : Multi` mode smell; socket-as-proof-of-session. The full diagnosis + staged slice plan (A–E) live in Task 48.

**Priority order agreed with Ibra**: P0 land Slice 1 → P1 Slice 2 (auto-bounce) → P2 Slice 3 (multi fail-close) → then Task 44 (DPS `localStorage.clear()`) → deferred is-connected/mode refactor.

---

### 47. 🟡 Codebase Review Findings (2026-07-06 full review)

**Status**: 🟡 OPEN — net-new findings only; overlaps cross-referenced, not duplicated
**Date Added**: July 6, 2026
**Priority**: mixed (per item)

**Context**: full codebase/architecture review (tsc clean, `next lint` clean, structure + duplication + lifecycle-adoption audit). Findings already tracked elsewhere are NOT repeated here: DPS `usePreventNavigation` trap → Tasks 37+42 (blocked on real DPS crashes — remove only after those are fixed); repo folder ownership → Task 41; lifecycle rollout to E91/DPS → Tasks 26/40; socket-provider mode-boolean smell → Task 40 guardrail note; TEST_MODE copy mismatch → Task 40 list.

**Net-new findings**:
- [ ] **P1 — `*_TEST_MODE = true` is a production landmine.** All three constants files (`bb84-constants.ts:35`, `e91-constants.ts:10`, `dps-constants.ts:22`) ship `TEST_MODE = true` with a hand-edit TODO. Replace the three booleans with one env-driven flag (e.g. `NEXT_PUBLIC_QC_TEST_MODE`), so production builds cannot forget it. (Related copy-alignment already in Task 40.)
- [ ] **P1 — zero test infrastructure.** No runner, no tests anywhere. First target: `lib/protocol-lifecycle/lifecycle.ts` — pure, typed, and the crown jewel. ~10 unit tests on `restoreCheckpoint` (missing/corrupted/invalid/active/completed × session states) + `abandon`/`startFresh` would protect every protocol at once. Suggest vitest (zero-config with TS).
- [ ] **P2 — lifecycle adoption is ⅓ done (measured).** Raw `localStorage` refs in components: BB84 **7**, E91 **15**, DPS **72**. ADR still `DRAFT/REVIEW`. When BB84 pilot settles: mark ADR accepted, then migrate DPS first (worst offender + still trap-guarded), then E91. (Execution tracked in 26/40; this item = the measurement + order rationale.)
- [ ] **P3 — monster pages**: `app/(main)/bb84_card/page.tsx` (1,175 lines), `app/(main)/dps/page.tsx` (953), `app/(main)/e91/page.tsx` (581) — content-heavy pages, split when next touched (no dedicated slice).
- [ ] **P3 — root-level clutter** (extends Task 41's folder work): `Hebergeurs_to_remove_later.md`, `TEST_PHOTON_VALUES.md`, `BACKEND_TEST_CHANGES.md`, `cryptoquantique_dns_setup_guide.md` → move to `docs/` or delete; **two tailwind configs** (`tailwind.config.js` AND `.ts`) → keep one.
- [ ] **P3 — datum for the deferred socket refactor**: `components/providers/socket-provider.tsx` is 1,555 lines, one context for all three protocols. Existing decision "socket-provider refactor last" (Task 40) stands; recorded here so the size is known.

**What the review found GOOD (keep doing)**: `lib/protocol-lifecycle/` design (small, typed results, fail-close, SSR-safe); tracker discipline + ADR; clean tsc/lint; consistent `store/{protocol}/{game,progress,room}` layout; physics isolated in `lib/{protocol}`; exemplary small-slice commit history.

---

### 48. 🔴 Session single-source-of-truth refactor (the "design battle")

**Status**: 🔴 OPEN — analysis confirmed, staged, NOT started. Big cross-protocol design change.
**Date Added**: July 7, 2026
**Priority**: P1 (structural; the root of the whole phantom/empty/wrong-mode game class)
**Origin**: surfaced while finishing Task 46 Slice 3a. The phantom-game bug was a *symptom*; this task is the disease. Supersedes/absorbs the "Deeper root (deferred)" note under Task 46 and the deferred **Slice 3b**.
**May get external review**: Ibra may also run another AI agent over this design before we execute — keep the diagnosis self-contained here so it can be reviewed cold.

**The diagnosis (confirmed against code):** there is **no single source of truth** for "am I in a valid game session, and is it solo or multi?". It is answered by **4 readers with different logic**, over state written by **scattered writers**.

*Readers (4 inconsistent definitions):*
- `components/hoc/is-connected.tsx:67` — `hasLocalSession || playingSolo || playingMultiplayer || isWaitingRoomConnected || isPlayRoomConnected`, else `redirect('/')`.
- `components/bb84/play-page/multi-game.tsx:71` — `playingMultiplayer && !isPlayRoomConnected` → restore-or-fail-close; **else render fresh** (the phantom path).
- form effect `components/bb84/home-page/bb84-game-form-v3.tsx:145` — `detectBB84Session()` (storage-kind based).
- play page `app/(main)/bb84/play/page.tsx:94` — `playingSolo ? <SoloGame/> : <MultiGame/>`.

*Writers (scattered):* `socket-provider.tsx:401/421/448` sets `playingMultiplayer:true` as a **side-effect of socket events**; also `solo-game-modal.tsx:156`, `bb84-game-form-v3.tsx:276/279`. Session data itself lives in **3 places**: `bb84PlayerData`, `bb84GameData`, and `player-storage` booleans — plus the live socket. Every reader stitches these differently → when two disagree, a gap opens = the bug.

**Two root smells to kill:**
1. **Socket-as-proof-of-session** — `is-connected` + `multi-game` treat socket liveness as an access signal. (Almost certainly a hydration/timing-race hack: "session not in storage yet but socket live → let them in.") *This is why 3a is only a band-aid: it removed the last lying term in one path, but the "socket ⇒ session" rule is still in the code — any future path that leaves a socket open without a session re-opens the phantom.*
2. **Mode-as-mutable-global-flag** — `playingSolo`/`playingMultiplayer` are booleans many writers keep "in sync" with reality. Mode should be **derived from the session**, not a drifting flag.

**Concrete symptoms of the tangle (evidence, not opinion):** `multi-game.tsx`'s own `router.replace('/bb84')` fail-close is now **dead code** (is-connected redirects first); `is-connected` **computes `protocol` from the path (line 21) but throws it away** and sends everyone to `/` instead of `/${protocol}`; this shape is the **pilot** E91/DPS copy via the same shared HOC.

**Target design:** ONE source of truth = the persisted session read through the lifecycle. Every guard asks the same question via the same resolver. Mode + socket are **derived from** the session, never authoritative. No valid session → fail-close to `/${protocol}`.

**Reviewed by two agents + Ibra (2026-07-08).** Claude + GPT 5.5 both endorsed the diagnosis and target. GPT's one substantive correction — **accepted and folded in below**: the socket-de-authorization must be **play-routes-only**, because `is-connected.tsx` is shared with the *waiting-room* pages, which legitimately DO use `isWaitingRoomConnected` (the lobby has no persisted play session yet). Verified against code: waiting-room writes no PlayerData/flags; `ROLES_EVENT` (`socket-provider.tsx:401-408`) persists `${protocol}PlayerData` + the mode flag BEFORE `connectToPlayRoom`, and the play socket's `CONNECTED_EVENT` (line 534) navigates after — so for play routes the socket term is pure race-cover. Also verified: **DPS solo writes `dpsPlayerData` (with a `playingSolo` marker); BB84/E91 solo write none** — so the resolver must key "multiplayer" off a valid `role`+`room` identity, not the presence of the player-data key. Architecture rules now documented in **ADR §11 "Session Detection and Route Guards"** (`docs/shared-protocol-lifecycle-adr.md`).

**Confirmed slice plan (reproduce-first, tight, cross-protocol-aware):**
- [x] **Slice A (DONE 2026-07-08, read-only spike):** verified where/when the session is persisted vs navigation, waiting-room access needs, and solo shapes. Findings written up below ("Slice A findings"). No behavior change.
- [x] **Slice B — DONE 2026-07-08 (implemented + verified, NO callers switched):** added pure, **read-only** `detectSession(adapter): DetectedSession` in `lifecycle.ts` (+ `DetectedSession` in `types.ts`) — no store hydration, no reconnect, no reset, no navigate; reuses `readStoredObject` / `isNonEmptyString` / `restoreMultiplayerSession`. `restoreCheckpoint()` stays the side-effectful restore door (Slice D refactors it to reuse `detectSession` so guard/page agree). `detectSession` is intentionally **stricter** than current `restoreCheckpoint` (unified in Slice D). tsc clean; verified via a 13-case logic matrix (scratchpad) incl. "broken multi missing room ⇒ corrupt". Type:
    ```ts
    type DetectedSession =
      | { kind: 'none' }
      | { kind: 'corrupt' }
      | { kind: 'solo';  completed: boolean }
      | { kind: 'multi'; completed: boolean; session: MultiplayerSession };
    ```
    **Final classification (safe — `solo` only on POSITIVE evidence; broken multiplayer NEVER becomes fake solo):**
      1. corrupted `gameData` ⇒ **corrupt**
      2. corrupted `playerData` ⇒ **corrupt**
      3. valid multi identity (`gameCode`+`role`+`room`) **and** `gameData` found ⇒ **multi**
      4. valid multi identity but **no** `gameData` ⇒ **corrupt** (orphan)
      5. DPS-solo compat (**gated to `protocolId === 'dps'`**): parseable `playerData` with `playingSolo:true` and no `room` ⇒ **solo** (BB84/E91 do NOT get this branch)
      6. `gameData` found **and** no `playerData` ⇒ **solo** (BB84/E91)
      7. `gameData` found **and** parseable non-solo/non-multi `playerData` ⇒ **corrupt** (NOT solo)
      8. else ⇒ **none**; `completed` ⟺ stored `gameData.gameSuccess === true` (read from JSON, no hydration). **BB84-first.**
    ⚠️ **Migration-compat, not target:** tolerating DPS solo's `dpsPlayerData` is a *compatibility rule to survive the current app*, NOT the target architecture. Target: `*PlayerData`/`playerDataKey` = multiplayer identity ONLY; solo uses the shared checkpoint model. See ADR §11 "Migration compatibility vs target architecture". Do NOT freeze this drift into the design.
- [ ] **Slice E+ / DPS cleanup (deferred to DPS migration):** rewrite DPS solo so it does NOT write `dpsPlayerData` (converge to BB84/E91 standard: solo = checkpoint + no multi identity), unless a real DPS-specific need surfaces. Then `detectSession`'s DPS-solo compat branch can be removed. Tracked so old drift is not frozen into the architecture.
- [ ] **Slice C — ATTEMPTED then REVERTED 2026-07-08 (lesson kept, code discarded).** Tried: `is-connected` fail-close BB84 routes to `/bb84` instead of `/`. **Manual test FAILED.** Root cause: `redirect()` runs inside a client `useEffect` and does a **replace**, so Forward into the stale `/bb84/play` entry (1) **flashes** the play page as it mounts before redirecting, and (2) **replaces** `/bb84/play` with a *second* `/bb84`, producing adjacent-duplicate history `[/, /bb84, /bb84]` → Back/Forward feel like "nothing happens" then jump to `/`. Same duplicate-history family as Slice 2c, and **worse UX than the old `/` redirect**. → **Proof that the guard MECHANISM must change, not just the redirect target.** Reverted (was uncommitted; tree clean). The protocol-home fail-close target is **folded into Slice D**.
- **Slice D — DESIGN (D0) AGREED 2026-07-08 (Claude + GPT 5.5 + Ibra). Split into D1–D5, reproduce-first.** Unifies the fragmented session/guard/mode logic into `detectSession`-driven single-source-of-truth for BB84. D0 findings:
    - **Guard location:** move to `PlayPage` (`app/(main)/bb84/play/page.tsx`) — it already owns mode; giving it access too resolves `detectSession` ONCE (guard + mode + which child). Absorbs the per-component HOC and the per-component restore-fail-close.
    - **Flash cause (identified):** PlayPage's own shell/header (`page.tsx:85–95`) paints before the child HOC redirects. Fix = guard at PlayPage, **render-time** (render `null` until hydrated+resolved; redirect while `null` so the shell never paints).
    - **Duplicate `/bb84` history (the Slice C failure) — real fix is NOT a nav trick:** completed Back currently `abandon()`s the checkpoint (Slice 3a), turning re-enterable `/bb84/play` into an *invalid* page that must fail-close (→ replace collides with `/bb84` → adjacent duplicate). **Keep the completed checkpoint** (still disconnect socket) so Forward RESTORES félicitation — no fail-close, no redirect, no duplicate. **This alone fixes the jank with the current HOC still in place** (that is why D2 comes before guard work). Genuine invalid access (none/corrupt, e.g. typed URL) still fail-closes to `/bb84` cleanly (no adjacent `/bb84` in that path).
    - **Fragmentation confirmed:** is-connected HOC + SoloGame own fail-close (→ `/`, `solo-game.tsx:75-78`) + MultiGame own fail-close (→ `/bb84`, `multi-game.tsx:91-93`) + PlayPage `playingSolo ? Solo : Multi`. All unify under `detectSession`.
  - [x] **D1 DONE 2026-07-08 (commit `6f47398`, tested green — refresh solo/multi/completed; corrupt case optional, not run):** `restoreCheckpoint` reuses `detectSession` (internal alignment; inherits the strict classification). **NOT zero-behavior** — test refresh: solo / multi / completed / corrupt. **Contract guard (GPT catch):** `restoreCheckpoint` still requires a real `gameData` checkpoint (`missing` → `{kind:'missing'}`) — `detectSession`'s DPS-solo marker is route-detection compat only and must NOT synthesize a restore. So the DPS drift is not baked into the shared restore function. BB84 behavior unchanged (BB84 solo/multi always have `gameData`). tsc + lint clean.
  - [x] **D2 DONE 2026-07-08 (commit `919f429`):** completed-on-`/bb84` policy — form effect's `completed` branch calls `disconnectPlayRoom()` but **NOT `abandon()`** (keeps the checkpoint). Tested solo + multi: completed → Back `/bb84` → Forward `/bb84/play` restores félicitation cleanly; repeated Back/Forward between `/bb84` and `/bb84/play` works. Bounded clearing confirmed by design: `startFresh` (new game / replay) and landing `/` (`page.tsx`) still clear completed. **Residual expected until D4:** if the user backs farther to landing `/`, landing clears completed data; then Forward into the old `/bb84/play` history entry becomes invalid and still flashes before redirecting to `/`. This is the remaining child-HOC/useEffect guard behavior, not a D2 failure.
  - [x] **D3 DONE 2026-07-08 (tested green solo+multi):** PlayPage derives mode from `detectSession.kind` (`multi`/`solo`), resolved in a mount effect (hydration-safe: `null` until resolved; is-connected already gates the child so no new flash); **keeps the HOC guard** + a `none`/`corrupt` fallback (`playingSolo`). Removed the reactive `playingSolo` render subscription. Tested: solo/multi start, refresh, and completed → Back `/bb84` → Forward restores félicitation — all correct. **Residual (expected, = D4):** the flash on *back-to-landing-then-forward* remains — landing legitimately clears the completed session, then `is-connected`'s `redirect()`-in-`useEffect` fail-closes to `/` and the shell paints first. NOT a D3 regression (unchanged `is-connected` path). tsc + lint clean.
  **🏛️ NAVIGATION INVARIANT ADOPTED 2026-07-09 (Ibra + Claude agreed; now in ADR §11 "The Navigation Invariant"):** *Session data is destroyed only by explicit user intent (new game, replay, quit) or corruption — never as a side-effect of navigation. Every play-route history entry must render a valid view of the persisted session, or fail-close only when no session exists at all.* Rationale: the browser's forward stack cannot be deleted — the only choice is whether those entries show a valid restored view or a broken page (flash/duplicate jank). Gold standard = the results-table route (URL → persisted data → view); félicitation must behave the same. **Alternatives analyzed and REJECTED:** (a) popup "quit/stay?" on Back at félicitation — back-interception anti-pattern (removed in Task 46 Slice 1), semantically empty at game end, and the defer-`gameSuccess` variant breaks completed-detection everywhere; (b) Back-to-`/bb84`-but-clear-everything — Forward cannot be blocked, clearing just guarantees a broken entry = the pre-D2 jank. **This supersedes the earlier D2-era note that "landing clears completed" — under the invariant, landing clearing is REMOVED (D4b).**
  - [x] **D4a DONE 2026-07-09 (tested green):** PlayPage owns the guard, **render-time** via `detectSession` — whole page renders `null` until the session resolves valid, so invalid entries redirect with **no paint at all**; fail-close ONLY for `none`/`corrupt` (`abandon` + `replace('/')`); **`is-connected` HOC removed from BB84 SoloGame/MultiGame** (PlayPage is their only importer — verified; waiting-rooms + E91/DPS keep the HOC). **Fail-close target = `/`** (not `/bb84`): replace-toward-`/bb84` recreates the adjacent-duplicate jank when the previous entry is `/bb84` (Slice C evidence) — ADR §11 rule 2 updated to record this decision (second agent concurred). Ibra tested: solo start/refresh/rejoin-popup ✅; félicitation Back/Forward restore ✅; **landing chain now flash-free** (URL briefly shows `/bb84/play`, page shows landing directly) ✅; typed URL `/bb84/play` with no session → straight to `/`, no flash ✅.
  - [x] **D4b DONE 2026-07-09 (tested green):** removed the **BB84** completed-clearing block from the landing page (E91/DPS blocks stay; flag-reset stays — flags demoted). The full natural chain now works, solo AND multi: félicitation → Back ×2 to `/` → Forward ×2 → **félicitation restored, no flash**; Rejouer works (startFresh). Completed data lifetime = until `startFresh` (new game/replay) or explicit quit. Optional later: max-age expiry.
  - [x] **D5a DONE 2026-07-09 (tested green) — the flag bridge.** Testing D4b exposed the LAST fragmented-reader class: **7 components still branch on `playingSolo`** (`bb84-progression.tsx:32,117-127` ending block + 5 tabs + MultiGame's restore gate `multi-game.tsx:71`). Landing resets the flags while the checkpoint now survives → restored solo félicitation rendered the MULTI ending block ("Votre Alice était…" + results link → 404 via empty solo gameCode). **Fix:** PlayPage's resolver effect re-asserts `playingSolo`/`playingMultiplayer` from `detectSession` before opening the render gate (zustand writes synchronous; all readers are children of the gate). Flags = **derived cache written only by the resolver owner**; readers migrate off flags in later cleanup. Also fixes the predicted multi-F5-after-landing edge (MultiGame's gate now passes). Tested: solo chain shows Rejouer/Retour ✅, multi chain + "voir les résultats" → real results table ✅.
  - [x] **D5b DONE 2026-07-13 (tested green):** deleted SoloGame/MultiGame dead fail-close branches (unreachable behind PlayPage's guard) and simplified MultiGame's restore gate `playingMultiplayer && !isPlayRoomConnected` → `!isPlayRoomConnected` (the flag term was constant-true via the D5a bridge; one fewer flag-reader). Removed orphaned `router`/`abandon` imports. Net −16 lines. Tested: solo refresh ✅, multi refresh ✅, multi completed Back/Forward chain ✅ (fresh tab). **Investigation note:** "hidden history states" seen during testing (Chrome, Alice=2/Bob=1, Brave=0) were **fossil `/bb84` duplicates minted by the pre-D4a MultiGame `replace('/bb84')` fail-close during earlier test sessions in long-lived tabs** — not a current-code bug; a fresh tab reproduces a clean `[/, /bb84, /bb84/play]` stack. Lesson recorded in the testing note below. **→ Slice D (D0–D5b) is COMPLETE.**
  - [ ] **Minor observation (2026-07-09, untriaged, LOW):** from restored solo félicitation, "Retour au menu principal" shows a brief background flash on the way to `/` (content not identifiable). Cosmetic; investigate when touching bb84-progression (`goToMenu` path).
  - Note: the "restart after insufficient valid bits → no photons, blocked" hit again during D4b/D5a testing via Rejouer — that is **Task 49** (already tracked, orthogonal to Task 48).
  **⚠️ Policy history (superseded):** the D2-era note said completed is kept on `/bb84` but still cleared by landing. The Navigation Invariant (above) extends D2's policy to ALL navigation: landing no longer clears completed BB84 either (D4b). Order matters: **D2 (protocol-page policy) → D3 (mode) → D4a (guard) → D4b (landing policy) → D5 (cleanup).**
- [ ] **Slice E (path-aware — CORRECTED):** remove socket-as-session **from play routes only**; the **waiting-room guard stays separate** (may keep `isWaitingRoomConnected`). Prove on BB84, then replicate to E91/DPS. (NOT "drop socket OR-terms globally" — that would break lobby access.)

**Cross-refs**: ADR §11 (the documented rules), Task 40 (socket-provider refactor stays last), Task 46 (browser-Back hardening — done, this is its deeper root), Task 47 (lifecycle adoption ⅓ done; this refactor is the natural vehicle to push BB84→100% then E91/DPS).

**Slice A findings (read-only spike, 2026-07-08 — verified against code, no behavior change):**

*(1) Multiplayer start — identical sequence for BB84/E91/DPS, all in `socket-provider.tsx` `ROLES_EVENT`:*
| Step | BB84 | E91 | DPS |
|---|---|---|---|
| set `playingMultiplayer:true` | :401 | :421 | :448 |
| write `${p}PlayerData` (incl. `role`+`room`) | :403 | :423 | :450 |
| write gameData/step/tab config | :404–406 | :424–426 | :451–456 |
| `connectToPlayRoom(...)` | :408 | :428 | :458 |
| play socket `CONNECTED_EVENT` → `navigateToPlayPage('/${p}/play')` (`replace`) | :534→543 | :534→545 | :534→547 |

→ **Session identity + mode flag are always persisted BEFORE play navigation.** So on `/${p}/play` mount, `hasLocalSession` is already true without any socket. The `isPlayRoomConnected` OR-term in `is-connected` is **race-cover for play routes** → safe to drop for play (Slice E).

*(2) Waiting-room:* `waiting-room.tsx` (all 3) write **no** `*PlayerData` and set **no** mode flags (grep empty). Lobby is navigated on the *waiting* socket's `CONNECTED_EVENT` (`socket-provider.tsx:286–288`, push `/${p}/waiting-room`), which fires BEFORE `ROLES_EVENT`. → During WAITING there is no persisted play session; the only access signal is **`isWaitingRoomConnected`**. Confirms ADR §11 rule 4 (waiting-room guard must keep the socket term; guards must be path-aware).

*(3) Solo shapes — NOT uniform:*
| Protocol | writes `*PlayerData` in solo? | contents | has `room`? |
|---|---|---|---|
| BB84 | ❌ no (`solo-game-modal.tsx:154` `startFresh` + config + `bb84GameData`; navigates `push` :200) | — | — |
| E91 | ❌ no (`solo-game-modal.tsx` config + `e91GameData`; navigates `replace` :310) | — | — |
| DPS | ✅ yes (`solo-game-modal.tsx:195`; navigates `replace` :203) | `{playerName, role, playingSolo:true, gameCode}` | ❌ **no `room`** |

→ **`*PlayerData` presence ≠ multiplayer** (DPS solo writes it). Invariant that holds for all three: **valid multiplayer ⟺ `${p}PlayerData` has valid `role` AND `room`** (solo never has both — BB84/E91 have no playerData; DPS solo has no `room`). This is exactly what `restoreMultiplayerSession` already validates.

**Design conclusion for Slice B (`detectSession` shape):**
- multiplayer ⟺ `playerData` parses with non-empty `role` AND `room`.
- solo ⟺ a local `gameData` checkpoint exists (or a `playingSolo` marker) but NOT a valid multi identity.
- none ⟺ neither.
- completed vs active ⟺ `getRoomSnapshot().gameSuccess === true` (as `restoreCheckpoint` already computes).
- Per Ibra's nit: `detectSession` **returns the session info; the caller decides reconnect** — do NOT bake reconnect into the resolver.

**Adjacent observations (NOT Slice A/Task 48 scope — logged for later):**
- E91 solo (`solo-game-modal.tsx:310`) and DPS solo (`:203`) still `router.replace('/${p}/play')`, whereas BB84 solo was switched to `push` in Task 46 Slice 2a — so E91/DPS have the same "browser-Back skips `/${p}`" issue BB84 already fixed. A Task 46 parallel for E91/DPS, to weigh after Task 48.
- `is-connected.tsx:70–75` calls `redirect('/')` inside a `useEffect` (Next's `redirect()` is meant for render/server) — minor smell; Slice C edits this line anyway.

---

### 49. 🐛 BB84 solo restart leaves an unplayable game (no photons at step 1)

**Status**: 🔵 DIAGNOSED 2026-07-13 (root cause confirmed in code) — split into 49-A (solo fix, agreed) / 49-B (multi, reproduce first). **Orthogonal to Task 48.**

**Repro (Ibra):** solo, **Bob**, photon number **4**. Kept key bits < validation length → restart dialog → restart goes to **step 1**, but only **bases** are shown, **no photons** → **stuck**. Re-confirmed via Rejouer during D4b/D5a testing.

**Root cause (CONFIRMED):** the insufficient-key restart dialog (`basis-tab.tsx:104-108`, triggered at `:115` when `keyBits.length < validationBitsLength`) calls only `resetRoom(); resetProgress();` — it regenerates **nothing**. For solo Bob, Alice's photons are generated ONCE at game start in `solo-game-modal.tsx:168-177`; no remount happens on restart, so no photons → stuck. **The correct machinery already exists and is bypassed:** the Eve-restart `restartGameWithoutEve` (`bb84-progression.tsx:61-94`) does it right — solo Bob regenerates fresh `aliceBits/aliceBases/alicePhotons` + welcome lines; multi sends the coordinated `RESTART_WITHOUT_EVE_EVENT` via the socket. (This "right code exists, caller bypasses it" pattern spawned the Task 50 audit.)

- [x] **49-A — DONE 2026-07-13 (commit `be78746`, tested green):** canonical role-aware `lib/bb84/solo-round.ts` (`beginSoloRound` + `restartSoloRound`); insufficient-key dialog rewired (solo path); zero inline generation copies remain (F4 BB84 ✅); BB84-solo welcome transcript single-sourced (F3 partial); latent fixes: Alice's missing Eve-restart welcome lines, stale `bb84BobBasisInputs` refilling the basis form after any restart (now cleared in `beginSoloRound`). Tested: forced restart (deterministic — `aliceBases` visible in localStorage → choose all-opposite) → empty form, fresh photons, Eve preserved, playable; fresh starts + Eve-restart regression OK. **Testing lesson:** `getDefaultValidationBits(4)=1` → natural trigger ≈ 1/16 — manual forcing is painful; strong argument for Task 47's vitest slice (solo-round.ts is store-driven and unit-testable by design).
- [ ] **49-C — restart UX standardization (design AGREED 2026-07-14, implementation in progress):** ONE blocking dialog for both triggers and **both modes** (Solo/Multi Parity Principle, now in ADR §11): big **Rejouer** (primary, the natural flow) + small quiet **Retour au menu BB84** (escape hatch; settings changes live at the protocol menu — "one place to configure, one button to replay"). No checkbox, no settings button (rejected: popup must not become a second settings screen). **Eve-detected Rejouer semantic — decision pending discussion:** multi's backend event is `RESTART_WITHOUT_EVE`, deliberately (design by the previous responsible: switch Eve OFF after detection so students complete the protocol instead of looping detect→restart). Recommended: both modes restart WITHOUT Eve (consistent today, zero backend). Related discovery (Ibra remembered right): **E91/DPS Eve is probabilistic** (`eve && Math.random() < 0.5`, `*_EVE_PERCENTAGE_DEFAULT = 0.5`) while **BB84 Eve is deterministic** — the odd one out; see Task 51. Retour semantics: solo = abandon + `/bb84`; multi = disconnect + abandon + `/bb84` (= existing quit; partner-left gap already Tasks 27/43). Insufficient-key Rejouer: same settings both modes (multi coordination = 49-B).
- Original 49-A plan (for reference): **solo fix (frontend-only):** extract the duplicated "start a solo Bob round" generation block (already 2 copies: `solo-game-modal.tsx:168-192`, `bb84-progression.tsx:68-89` — do NOT add a third) into one helper (e.g. `lib/bb84/solo-round.ts`). Rewire `basis-tab`'s `restartGame` for solo: reset room+progress, **re-apply config** (photonNumber, validationBitsLength, and **KEEP Eve as it was** — this restart is bad luck, not Eve-detection, so `evePresent` survives and Bob's regen applies `mimicEveIntercept` when Eve is on, like the modal), regenerate fresh randomness, push role-appropriate welcome lines (Alice regenerates via her own UI). Verify while implementing: whether `resetRoom` resets `evePresent` (if so re-set from `gameHasEve`). Test: solo Bob AND Alice, 4 photons, force insufficient key → restart → playable round, config + Eve preserved.
- [ ] **49-B — multi (REPRODUCE FIRST):** the `:115` trigger fires in multi too, and `restartGame` resets only LOCAL stores — the partner is never told → expected desync/hang. Reproduce (multi, 4 photons, one side hits insufficient key), document, then decide: proper fix is a coordinated restart like the Eve one, which likely needs a backend event (or confirming the backend relays a generic restart) — if backend-blocked, track with the partner-left family (Tasks 27/43).

---

### 50. 🟠 Behavior conformance audit — canonical code exists, callers bypass it

**Status**: 🟠 AUDITED 2026-07-13 (targeted sweep) — findings tracked, fixes NOT started.
**Principle (sibling of Task 48's state rule):** *one behavior = one canonical implementation; callers must call it.* Task 48 fixed "session STATE smeared across readers"; this audit covers "session/game BEHAVIORS smeared across copies." Trigger: Task 49's root cause — the correct restart (`restartGameWithoutEve`) existed while the broken dialog used a naive local copy.
**Scope honesty:** this is a *targeted* sweep of the classes the Task-49 bug exposed (restart, clearing, welcome-lines, generation) — not a full census. Extend when new bypass classes surface.

**Findings:**
- [ ] **F1 — Restart behavior exists in ~7 copies, most naive.** Canonical: `bb84-progression.tsx:61` (solo regen + multi socket event). Naive `resetRoom(); resetProgress();` copies: BB84 `basis-tab.tsx:104` (= Task 49), E91 `solo-basis-tab.tsx:121` (+hand-copied welcome lines), E91 `basis-tab.tsx:123` (**multi, no socket coordination!**), E91 `solo-CHSH-tab.tsx:242` (+local state reset). E91 `CHSH-tab.tsx` restart not yet read. Inconsistent pair: socket-provider `RESTART_WITHOUT_EVE` handler does E91 **inline** (`:1103-1121`, manual key removal) but BB84 via the `restartWithoutEve()` util (`:1138`) — two styles for the same behavior. And `restartWithoutEve` itself hand-removes keys instead of using lifecycle/`clearProtocolStorage`. Fix direction: per-protocol canonical `restartRound()`/`restartWithoutEve()` in the lifecycle-adjacent layer; all dialogs/handlers call it. (BB84 slice = Task 49-A/B.)
- [ ] **F2 — 23 call sites still use legacy `clearXXXLocalStorage()`** (bypassing `clearProtocolStorage`/lifecycle): DPS ×11, E91 ×9 + landing/results pages. BB84 = 0 ✅ (pilot migrated). Quantifies Task 47's "adoption ⅓" from the behavior side; absorbed by the E91/DPS replication (Tasks 26/40/48-template). E91 sites incl. `e91-game-form-v3.tsx:85,203,217,241`, `app/(main)/e91/play/page.tsx:47`, results page `:198-200`.
- [ ] **F3 — Welcome-transcript lines hand-copied in ~7 files** (BB84: modal, solo-game, multi-game, progression; + socket-provider; DPS: solo-game, multi-game). One wording/step change = 7 edit sites. Candidate: per-protocol `welcomeLines(role)` helper; fold into replication slices.
- [ ] **F4 — Solo round generation duplicated** (BB84: modal `:168-192` + progression `:68-89`; Task 49-A extracts to one helper). Check E91/DPS analogs during replication (note: E91 solo tabs seem to generate in-tab — their naive resets MAY be functional; verify per tab before "fixing").
- [ ] **F5 — Multi restarts without partner coordination** (desync class): BB84 `basis-tab` (= Task 49-B) AND E91 `basis-tab.tsx:123`. Same family as partner-left (Tasks 27/43); likely backend-dependent.
- Cross-refs (already tracked, not repeated): navigation push/replace violations in E91/DPS solo (Task 48 Slice A findings); guard/mode pattern replication (Task 48 template); raw localStorage counts (Task 47).

---

### 51. 💡 BB84 Eve should be probabilistic like E91/DPS (product idea — DISCUSS before implementing)

**Status**: 💡 IDEA 2026-07-14 (surfaced during 49-C discussion) — needs product decision (Ibra ± team).
**Finding (verified):** E91 and DPS treat the Eve checkbox as "Eve *possible*": actual presence drawn per game (`eve && Math.random() < evePercentage`, `E91_EVE_PERCENTAGE_DEFAULT = 0.5`, `DPS_EVE_PERCENTAGE_DEFAULT = 0.5`, with min/max constants). **BB84 is the odd one out:** checkbox = Eve deterministically present (`mimicEveIntercept` intercepts every photon; only *detection* is probabilistic, via physics). Looks like drift, not a BB84-specific need (Task 50 principle: unify unless the protocol requires divergence).

**Why it's attractive:** aligning BB84 (checkbox = possible, drawn at `BB84_EVE_PERCENTAGE`) is more realistic AND **dissolves the Eve-detected-restart fork**: "Rejouer = same settings" would simply *redraw* Eve — anti-loop preserved statistically (p<1 ⇒ students eventually complete the protocol, the previous responsible's goal) while keeping realism (Eve may return or slip through). One semantic for all protocols and both modes.

**Scope notes:** solo = frontend-only (mirror E91's modal pattern). Multi = check how the backend assigns `game_has_eve` before promising anything. Results/HUD copy may need "Ève était-elle présente ?" reveal like E91 (`e91OriginalEvePresent`). Do NOT bundle into 49-C — separate slice after discussion.

---

### 52. 📋 E91 pre-migration findings (recorded 2026-07-14 — for when E91's turn comes)

**Status**: 📋 RECORDED, deliberately NOT worked on (BB84 pilot first). Found by Ibra testing E91 with Eve.

- [ ] **52-A — CHSH "not secure" restart leaves an EMPTY transcript.** `solo-CHSH-tab.tsx:242` `restartGameWithoutEve` is a naive `resetRoom+resetProgress` (+local state) that regenerates nothing and pushes NO welcome lines → the Game Progression sidebar is blank after restart (screenshot confirmed). Same disease as BB84 Task 49 / Task 50 F1; the E91 *basis*-tab restart pushes lines, the CHSH one forgot (copy drift). Fix vehicle: E91's canonical `solo-round`-style helper during its migration (mirror BB84's `lib/bb84/solo-round.ts`).
- [ ] **52-B — the security claim is never verified.** `solo-CHSH-tab.tsx`: the CHSH `S` value is computed (`:116`) and displayed, but `onSecure`/`onUnsecure` "directly navigate or set state" (the file header says so itself, `:9`) — no comparison of the player's claim against `S` (≤ 2 vs > 2), no BB84-style valid/invalid "try again" feedback. Pedagogical gap: the game follows the user's decision blindly. Design the verification mechanic (mirror BB84's validate-with-feedback) at E91 migration.
- Cross-refs: Task 50 F1 (restart copies), Task 51 (E91 already has probabilistic Eve — the model BB84 may adopt), Task 26/40 (E91 lifecycle migration).

---

### 🧪 LOCAL TESTING NOTE: Fossil History in Long-Lived Tabs

**Not a code bug** — testing methodology (learned 2026-07-13, Task 48 D5b).

Browser history is per-tab and survives the whole session. When testing navigation
fixes, a long-lived tab still carries history entries minted by the OLD (buggy) code —
e.g. adjacent duplicate `/bb84` entries from the pre-D4a `replace('/bb84')` fail-close.
New navigation truncates entries only ABOVE the current position, so if a new test game
starts from a Back-reached page, fossils below it survive and reappear as "hidden states"
(Back does nothing). Symptom signature: counts differ per tab/player, and a fresh tab is
clean.

**Rule: always verify navigation-chain behavior in a FRESH tab** (or after restarting
the browser tab), so the history stack starts empty.

### 🧪 LOCAL TESTING NOTE: Same-Browser Tab Collision

**Not a code bug** — this is a testing methodology issue.

All Chrome tabs on the same origin share the exact same `localStorage`. The Zustand persist store (`player-storage`) writes `playerRole`, `playerId`, `playingSolo`, etc. When 3 tabs (Master, Alice, Bob) all write to the same key, they overwrite each other's state.

**Proper local multiplayer testing**:
- Tab 1: Normal Chrome window (Master)
- Tab 2: Chrome Incognito window (Alice) — separate localStorage
- Tab 3: Firefox or Safari (Bob) — separate localStorage

This is expected browser behavior, not a bug to fix.

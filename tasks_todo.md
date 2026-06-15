# Quantum Crypto Frontend - Issue Tracker & Plan

> [!NOTE]
> Completed Tasks 1 to 22 (UI redesign, initial fixes, Next.js configuration updates, E91 results table, etc.) have been archived to [docs/tasks_archived.md](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/docs/tasks_archived.md) to keep this active TODO list clean and compact.

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

**Status**: 🟡 TODO  
**Date Added**: May 26, 2026  
**Priority**: 🟠 HIGH for E91 multiplayer stabilization; 🟡 MEDIUM for BB84/DPS parity work  
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
| **E91** | `components/e91/play-page/multi-game.tsx` | ✅ `hydrateE91ProgressStore()` | Manual reads only inside `playingMultiplayer && !isPlayRoomConnected` branch. |
| **DPS** | `components/dps/play-page/multi-game.tsx` | ✅ `hydrateDPSProgressStore()` | **No restoration at all** — needs `hasInitialized` ref, room restore, step/tab/lines reads. |

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

#### Sub-task D: DPS (Net-new restore logic for multiplayer — needs testing)
- [x] Add `hasInitialized` ref to `components/dps/play-page/multi-game.tsx`
- [x] Add `restoreGame(gameData)` call for `dpsGameData`
- [x] Call `hydrateDPSProgressStore()` for step/tab/lines
- [x] Add config restoration for `dpsPhotonNumber`, `dpsGameHasEve`
- [x] Set DPS multiplayer role assignment to persist `playingMultiplayer: true` and `playingSolo: false`.
- [x] **Test carefully**: DPS multiplayer refresh, completed-game refresh, replay to `/dps`, and quit-to-home behavior are stable enough for the current deploy revision.
- [x] Follow-up: DPS master results page now behaves like BB84/E91 after Task 29 frontend wiring; no backend change was needed.

**Estimated Time**:
- E91 urgent stabilization: ~1 focused session
- E91 medium hardening: ~1 additional session after urgent fixes are verified
- DPS multiplayer parity: separate follow-up task/session

---

### 25. ✅ Architecture: Split BB84 `game.tsx` into `solo-game.tsx` and `multi-game.tsx`

**Status**: ✅ COMPLETED / DOCS UPDATED  
**Date Added**: May 26, 2026  
**Priority**: ✅ DONE

**Context**: This task is no longer a future TODO. BB84 now follows the same top-level file split as E91 and DPS:
- Solo container: `components/bb84/play-page/solo-game.tsx`
- Multiplayer container: `components/bb84/play-page/multi-game.tsx`
- Route switch: `app/(main)/bb84/play/page.tsx` chooses between them based on `playingSolo`.

**Task**:
- [x] Extract the solo play code into `components/bb84/play-page/solo-game.tsx`.
- [x] Create the multiplayer-only container at `components/bb84/play-page/multi-game.tsx`.
- [x] Update `app/(main)/bb84/play/page.tsx` to route between them based on `playingSolo`.
- [ ] Future cleanup: BB84 still shares several tab components between solo and multiplayer, so some internal `playingSolo` branching remains.

**Note**: Keep this task as historical context only. New work should happen under Task 24 and protocol-specific cleanup tasks.

---

### 26. 🟡 Architecture: Shared Protocol Session Lifecycle

**Status**: 🟡 DESIGN / TODO  
**Date Added**: June 9, 2026  
**Priority**: 🟡 MEDIUM-HIGH  
**Depends On**: Task 24 E91 stabilization should be completed and committed first.

**Context**: The current app already has the correct building blocks:
- `player-store` for identity and solo/multiplayer flags
- protocol `game-store` files for configuration
- protocol `room-store` files for protocol-specific state
- protocol `progress-store` files for current step/tab/transcript
- protocol-specific `localStorage` keys for recovery

The missing piece is a shared lifecycle contract. Protocol room state should stay protocol-specific, but starting, saving, restoring, completing, replaying, and clearing should follow one standard lifecycle across BB84, E91, DPS, and future protocols.

**Reference Docs**:
- Main architecture notes: `docs/storage-architecture.md`
- Diagrams: `docs/protocol-session-lifecycle-diagrams.md`

**Target Rule**:

Protocol data stays protocol-specific. Session lifecycle becomes shared and standard.

**Recommended Order**:
1. [ ] Finish E91 multiplayer parity with BB84 under Task 24.
2. [ ] Commit the stable E91/BB84 recovery state.
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

### 29. ✅ DPS Multiplayer: Results Page, Live Updates, and Results Table

**Status**: ✅ DONE
**Date Added**: June 11, 2026
**Priority**: 🔴 HIGH before final DPS deployment polish
**Depends On**: Stable DPS multiplayer refresh/save from Task 24.

**Context**: DPS multiplayer can now complete and refresh safely. The missing piece was frontend results parity: unlike BB84 and E91, DPS had no dedicated rich results table and the success screen did not route players to the shared results page.

**Final state**:
- Frontend shared results route listens to `/games/<protocol>/<gameCode>/results/`.
- The shared results page marks rooms as finished when an iteration has `elapsed_time > 0`.
- BB84, E91, and DPS now have protocol-specific table components.
- Backend DPS has `DPSIteration.elapsed_time`, and the model computes it when status becomes `FINISHED`.
- Tested with 4 DPS players / 2 pairs: the master page updates like BB84/E91 when finished players click "Voir les résultats".
- No backend change was needed.

**Goal**: DPS master results should behave like BB84/E91:
- show each finished room/pair as soon as it completes,
- identify Alice/Bob/player pair cleanly,
- show elapsed game time,
- keep waiting state only for rooms that have not finished,
- avoid guessing in the frontend if the backend result payload is stale.

**Step-by-step plan**:
1. [x] Test BB84 and E91 result pages with multiple pairs and document the expected behavior:
   - when each pair appears,
   - whether the master page updates live without refresh,
   - exact `Rooms Data` payload shape in the browser console,
   - how unfinished versus finished rooms are represented.
2. [x] Test DPS result page with multiple pairs and confirm the master page updates after pairs finish.
3. [x] Compare backend consumers for BB84, E91, and DPS:
   - play-room `B_SUCCESS` handling,
   - `update_iterations_status_to_finished`,
   - results-room `GAME_RESULTS` payload,
   - whether fresh results are broadcast after a room finishes.
4. [x] Decide the smallest correct backend/frontend contract:
   - prefer backend broadcasting fresh `GAME_RESULTS` after DPS `B_SUCCESS` if the payload is stale,
   - do not change socket event names unless backend and frontend are changed together,
   - keep BB84/E91 untouched unless tests prove they need the same live-update hardening.
5. [x] Backend live-results update not needed after frontend parity test passed.
6. [x] Add a frontend `DPSResultsTable` component:
   - start from BB84/E91 table patterns,
   - show player pair / room,
   - show iteration number,
   - show elapsed time,
   - include DPS-specific fields only if useful and present in payload, for example Eve state or detected times.
7. [x] Wire `DPSResultsTable` into the shared results route switch.
8. [x] Re-test:
   - one pair,
   - multiple pairs,
   - first pair finished while other pairs are still playing,
   - page refresh on master results,
   - replay/home buttons from the results page.

**Safety notes**:
- Do not fake completion in the frontend from Alice/Bob local success state; the backend owns room completion truth.
- Do not change DPS success event names. The current backend-supported completion event is `B_SUCCESS`.
- Backend changes should be DPS-only first, and only after observing the actual DPS result payload.

---

### 30. 🟡 BB84: Stale Session Redirect After Returning From Results/Home

**Status**: ✅ DONE
**Date Added**: June 12, 2026
**Priority**: 🟡 MEDIUM
**Depends On**: Current deploy polish; can be fixed after DPS results work if needed.

**Context**: After completing an E91 multiplayer test and clicking "Menu Principal" from the results page, clicking the BB84 card can sometimes go directly to BB84 step 1 instead of showing the BB84 solo/multiplayer choice page.

**Likely cause**: `components/bb84/home-page/bb84-game-form-v3.tsx` redirects to `/bb84/play` whenever `isPlayRoomConnected` is true. It does not first verify that the current socket/session belongs to a valid active BB84 session. This is similar to the stale redirect issue already hardened for E91/DPS.

**Expected behavior**:
- Clicking BB84 from the landing page should show the BB84 protocol home/choice UI.
- Auto-redirect to `/bb84/play` should happen only when there is a valid active BB84 play session.
- Completed or stale protocol data should be cleared intentionally.

**Task**:
- [x] Reproduce after returning from a multiplayer results page.
- [x] Harden BB84 home redirect guard so `isPlayRoomConnected` alone is not enough.
- [x] Require valid `bb84PlayerData` and active `playingMultiplayer` session before redirecting to `/bb84/play`.
- [x] Clear stale completed BB84 data safely without causing a step-1 flash.
- [x] Disconnect stale play socket when BB84 has no valid active session.
- [x] Re-test BB84 landing, solo choice, multiplayer join/create, refresh restore, and results/home flows.

---

### 31. 🟡 Aligner l’interface DPS avec BB84/E91

**Status**: ✅ DONE
**Date Added**: June 13, 2026
**Priority**: 🟡 MEDIUM before deploy
**Depends On**: DPS refresh/save and DPS results table stabilization.

**Context**: DPS now works much better in multiplayer, but a review against BB84/E91 found several UI consistency gaps. These are not new protocol features; they are polish and alignment items before deployment.

**Problems found**:
1. **DPS play page is missing the protocol button/title**
   - BB84 play page shows a `BB84` title/button at the top-left of the game area.
   - E91 play page shows an `E91` title/button with leave confirmation.
   - DPS play pages only show the mobile progression/sidebar button.
   - Affected pages:
     - `app/(main)/dps/play/page.tsx`
     - `app/(main)/dps/solo/page.tsx`

2. **DPS mobile progression notification watches the wrong store**
   - `components/shared/dps-progression-sidebar.tsx` imports `useBB84ProgressStore`.
   - It should use `useDPSProgressStore`.
   - Current risk: the red mobile notification dot can react to BB84 progression instead of DPS progression.

3. **Old shared header/sidebar still use the Institut Quantique logo**
   - Protocol home pages use `HeaderV3`, which already shows the QuantumCrypto logo.
   - Waiting rooms, shared results page, and guide page still use `components/shared/header.tsx`.
   - `components/shared/header.tsx` and `components/shared/sidebar.tsx` still show `/institut-quantique.svg` in the top-left/mobile menu.
   - Expected: QuantumCrypto logo in the top-left header; Institut Quantique can remain in footer/partner placement.

4. **DPS has weaker in-game leave UX than E91**
   - E91 has a protocol title button that asks for leave confirmation before cleaning the active game.
   - BB84 has a simpler protocol title link.
   - DPS currently has no protocol title/button in the play-page header.
   - First step: add the missing DPS title/button. Then decide whether to copy E91’s leave confirmation behavior for DPS.

**Task**:
- [x] Fix old shared `Header` and mobile `Sidebar` to show the QuantumCrypto logo.
- [x] Add a `DPS` protocol title/button to DPS multiplayer play page.
- [x] Add a `DPS` protocol title/button to DPS solo play page.
- [x] Fix `DPSProgressionSidebar` to use `useDPSProgressStore`.
- [x] Decide whether DPS should get the same leave confirmation as E91, or keep a simple protocol-home button for now. Decision: align DPS with E91 and ask for confirmation before leaving an unfinished game.
- [x] Re-test DPS solo, DPS multiplayer, waiting-room header, results header, and mobile progression notification.

---

### 32. ✅ DPS Multiplayer: Alice Refresh Crash During Step 1

**Status**: ✅ DONE
**Date Added**: June 15, 2026
**Priority**: 🔴 HIGH / deployment blocker
**Depends On**: Task 24 and Task 31.

**Observed test**: In DPS multiplayer as Alice, fill step 1, refresh the page, then the app can crash with:

```text
TypeError: Cannot read properties of undefined (reading '0')
components/dps/play-page/tabs/alice-exchange-tab.tsx
```

**Likely cause**: `AliceExchangeTab` decides that photons were sent with `alicePhotons.length > 0`, then renders `alicePhases[i][buttonIndex]`. After refresh, the restored snapshot can be partial or temporarily inconsistent: `alicePhotons` exists, but `alicePhases[i]` is missing for at least one row.

**Expected behavior**:
- Refresh during DPS Alice step 1 must never crash.
- If a full sent snapshot exists, show the sent phases and photons.
- If only a draft exists, restore the editable form.
- If saved data is partial/corrupted, ignore the bad snapshot and fall back to the last safe editable state.

**Fix plan**:
- [x] Replace `photonsSent = alicePhotons.length > 0` with a full shape check for both `alicePhotons` and `alicePhases`.
- [x] Use safe row fallbacks when rendering phase/photon rows.
- [x] Sanitize restored `dpsGameData` so partial `alicePhotons` / `alicePhases` cannot put the tab in a half-sent state.
- [x] Store Alice photons/phases atomically through `setAliceExchangeData`.
- [x] Re-test Alice refresh before sending, after sending, and with Bob connected.
- [x] Re-test DPS solo main-menu return so it does not flash the empty step 1 screen.

---

### 33. 🟠 BB84 Play Page: Add the Same Leave Guard as E91/DPS

**Status**: ⏳ TODO
**Date Added**: June 15, 2026
**Priority**: 🟠 HIGH before deploy polish
**Depends On**: Task 30.

**Observed test**: In BB84 solo and multiplayer, clicking the top-left `BB84` title during an active game does not ask whether the user wants to leave. In multiplayer, it can feel like a refresh/stay action instead of a clear navigation action.

**Current code**: `components/bb84/play-page/bb84-button.tsx` is still a raw link to `/bb84`. E91 and DPS use a play-page shell that asks for confirmation, disconnects, clears local protocol storage, then navigates to the protocol page.

**Expected behavior**:
- During an unfinished BB84 game, clicking `BB84` should ask: stay or quit.
- If the user stays, nothing changes.
- If the user quits, disconnect/clear BB84 state and go to `/bb84`.
- After success, leaving can go directly to `/bb84`, like E91/DPS.

**Fix plan**:
- [ ] Add a BB84 play-page shell or equivalent page-level guard.
- [ ] Convert `Bb84Button` from raw `Link` to `onRequestLeave`.
- [ ] Reuse the same cleanup pattern as E91/DPS with `clearBB84LocalStorage()` and `disconnectPlayRoom()`.
- [ ] Re-test BB84 solo Alice/Bob, BB84 multi Alice/Bob, unfinished game, and success screen.

---

### 34. 🟠 DPS Home Page: Align Entry Flow With BB84/E91

**Status**: ⏳ TODO
**Date Added**: June 15, 2026
**Priority**: 🟠 HIGH before deploy polish
**Depends On**: Task 31.

**Observed test**: After clicking the DPS card, DPS still has a different intermediate card/role flow, including the older Alice/Bob choice with Cat/Dog icons. This was kept temporarily as a comparison point, but now DPS should match the current BB84/E91 experience.

**Expected behavior**:
- DPS protocol page should feel like BB84/E91.
- Same visible solo/multiplayer choice pattern.
- Same role-selection style where possible.
- No extra intermediate click that only DPS has.

**Fix plan**:
- [ ] Compare `DPSMainV3` against `BB84MainV3` and `E91MainV3`.
- [ ] Remove or replace the old DPS-only intermediate flow.
- [ ] Align solo role selection UI with the current BB84/E91 style.
- [ ] Re-test DPS solo start, DPS multiplayer create/join, and stale-session cleanup.

---

### 35. 🟡 E91: Missing Localization Keys in Eve/Validation UI

**Status**: ⏳ TODO
**Date Added**: June 15, 2026
**Priority**: 🟡 MEDIUM / quick visible fix

**Observed test**:
- French E91 Eve/validation UI can show raw key `component.game.tabValidation`.
- French E91 CHSH table can show raw key `component.e91.text.values`.

**Current code**:
- `components/e91/play-page/multi-game.tsx` and `solo-game.tsx` call `localize('component.game.tabValidation')`.
- `components/e91/play-page/tabs/CHSH-tab.tsx` calls `localize('component.e91.text.values')`.
- `lang/e91-lines.ts` has `component.e91.text.values` in English/Spanish, but not French.
- `lang/e91-lines.ts` does not define `component.game.tabValidation`.

**Fix plan**:
- [ ] Add `component.game.tabValidation` to E91 translations.
- [ ] Add French `component.e91.text.values`.
- [ ] Audit E91 Eve/CHSH visible keys in French.
- [ ] Re-test E91 with Eve enabled in French.

---

### 36. 🟡 E91: Controlled Input Warning in Measurement Tab

**Status**: ⏳ TODO
**Date Added**: June 15, 2026
**Priority**: 🟡 MEDIUM / console cleanup

**Observed test**: Browser console shows:

```text
Warning: A component is changing a controlled input to be uncontrolled
components/e91/play-page/tabs/measurement-tab.tsx
```

**Likely cause**: The disabled photon/bit input renders `value={!photonsRevealed ? revealedBits[i] || '*' : bits[i]}`. During restore or reveal transitions, `bits[i]` can temporarily be `undefined`, so React sees the input value change from defined to undefined.

**Expected behavior**:
- No controlled/uncontrolled input warning.
- Refresh/restore and photon reveal should keep a stable string value.

**Fix plan**:
- [ ] Ensure the rendered input value is always a string, for example with a fallback.
- [ ] Check the revealed bits length when restored data arrives.
- [ ] Re-test E91 refresh during/after measurement.

---

### 37. 🟡 DPS: Remove Remaining Fragile Browser Navigation Guard

**Status**: ⏳ TODO
**Date Added**: June 15, 2026
**Priority**: 🟡 MEDIUM after DPS crash fix

**Context**: Earlier E91 work showed that custom browser back/refresh trapping was fragile. DPS multiplayer still calls `usePreventNavigation(!gameSuccess, handleNavCleanup)` inside `components/dps/play-page/multi-game.tsx`.

**Expected direction**:
- Keep strong in-app leave confirmation on the DPS title button.
- Let browser refresh restore the saved snapshot without an extra warning.
- Avoid browser-back hacks that can produce inconsistent history behavior.

**Fix plan**:
- [ ] Re-check DPS refresh/back behavior after fixing the Alice refresh crash.
- [ ] Decide whether to remove `usePreventNavigation` from DPS multi.
- [ ] If removed, rely on restore/cleanup logic and the in-app `DPS` leave guard.

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

### 🧪 LOCAL TESTING NOTE: Same-Browser Tab Collision

**Not a code bug** — this is a testing methodology issue.

All Chrome tabs on the same origin share the exact same `localStorage`. The Zustand persist store (`player-storage`) writes `playerRole`, `playerId`, `playingSolo`, etc. When 3 tabs (Master, Alice, Bob) all write to the same key, they overwrite each other's state.

**Proper local multiplayer testing**:
- Tab 1: Normal Chrome window (Master)
- Tab 2: Chrome Incognito window (Alice) — separate localStorage
- Tab 3: Firefox or Safari (Bob) — separate localStorage

This is expected browser behavior, not a bug to fix.

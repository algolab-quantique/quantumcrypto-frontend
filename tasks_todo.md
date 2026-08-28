# Quantum Crypto Frontend - Issue Tracker & Plan

## 👋 START HERE (new to this project?)

This file is the **live tracker**: every open bug, decision and piece of work, newest at the
bottom. Tasks are append-only — numbers are never reused, so a reference like "Task 40" is
stable forever.

**Read in this order:**
1. **[`CLAUDE.md`](CLAUDE.md)** — how we work here (one slice at a time, gates, verification).
   Read this before touching code.
2. **🗺️ ROADMAP** (just below) — everything remaining to finish the app, with estimates,
   each line pointing at the task that owns it.
3. The task you need — find it with `grep "^### " tasks_todo.md`.

**The app has two independent axes** — confusing them is how a 22-month physics bug survived
every architecture review:

| Axis | Question it answers | Document |
|---|---|---|
| **A — data lifecycle** | *Where does this data go? Does it survive a refresh?* | [`docs/shared-protocol-lifecycle-adr.md`](docs/shared-protocol-lifecycle-adr.md) |
| **B — protocol physics** | *Is the number inside it physically correct?* | [`docs/protocol-physics.md`](docs/protocol-physics.md) |

**Entry points by theme:** Architecture → **26, 40, 48** · Physics → **52, 57** ·
BB84 → **45, 46, 49, 53** · E91 → **27, 28, 52** · DPS → **37, 38, 44** ·
Testing/review → **47, 54** · Cleanup → **41, 42** · Infra → **23**

**Legend:** 🔴 open/high · 🟡 in progress or blocked · ⚪ low / future · ✅ done ·
📋 recorded, not started · 🐛 bug · 💡 idea, not decided

> [!NOTE]
> Completed Tasks 1 to 22 and completed top-level Tasks 25, 29 to 36 were archived to `docs/tasks_archived.md`, which was **deleted from the tree on 2026-07-17** (status snapshots age into lies; git keeps everything). To read it: `git show 6bd4ee9:docs/tasks_archived.md`. The full story of every completed task also lives in the commit history.

---

## 🗺️ ROADMAP TO "QUANTUMCRYPTO IS FINISHED" (added 2026-08-26)

> **What this is:** the single view of everything remaining to complete the app — 3 protocols
> × 2 modes × 2 Eve scenarios, one source of truth for the physics, the lifecycle migration
> finished, everything manually verified, design polished.
> **What this is NOT:** new tasks. Every line points at the task that already owns the work.
> Estimates are in **working days for one developer**, at the pace actually measured on BB84.

**Calibration (measured, not guessed):** the BB84 arc ran 23 June → 23 July 2026 = **23 distinct
working days / 123 commits**, of which ~8–10 were one-time architecture design (ADR, adapter
contract, `lifecycle.ts`, test setup, CI). So **BB84 replication cost ≈ 13 days**, and that
design cost is already paid. Remaining surface, measured by raw `localStorage` refs in
components: **BB84 15 · E91 22 (1.5×) · DPS 73 (5×)** — DPS is the big one.

| # | Workstream | Days | Owned by | Blocked by |
|---|---|---|---|---|
| 1 | Verify backend connectivity after VM migration | 0.5 | **Task 23** | — *(do FIRST: if broken it blocks 4, 5, 6, 7)* |
| 2 | TEST_MODE env flag (production gate) | 1–2 | **Task 47 P1** + **Task 57** (design agreed, not built) | — |
| 3 | Debug `console.log`s leaking key material | 0.5 | **Task 47 P2** | — |
| 4 | **E91 lifecycle migration** | 8–12 | **Task 40 Phase 3** + **Task 26** + **Task 52** (pre-migration findings) | — |
| 5 | **E91 physics** (biased Eve 52-D, honest Bell note 52-C, dead code 52-F) | 3–5 | **Task 52** | ⚠️ **BACKEND** — simulation duplicated in Python (`e91/consumers.py:480,507`) |
| 6 | **DPS lifecycle migration** | 12–18 | **Task 40 Phase 4** + **Task 37** (nav guard) + **Task 44** (`localStorage.clear()`) | — |
| 7 | **DPS physics** — build the missing solo Eve | 5–8 | **Task 38** | — *(frontend-only: DPS backend has no physics; build it sender-side per ADR §13.3)* |
| 8 | Socket-provider refactor (multi orchestration → per-protocol handlers) | 10–15 | **Task 40 Phase 5** | 4 + 6 stable first. **Riskiest change in the app** |
| 9 | Cleanup after migration (dead code, repo structure, nav guards) | 3–5 | **Task 41** + **Task 42** | 8 |
| 10 | Extend the ADR §13.3 conformance guard to E91 + DPS | 1–2 | **Task 57** (guard exists, watches BB84 only) | 5 + 7 |
| 11 | Manual test matrix — 3 protocols × 2 modes × 2 Eve scenarios = **12 flows**, each with refresh / restore / abandon edges (multi needs 2 browsers) | 6–10 | *see ⚠️ below* | 4, 6 |
| 12 | Test phases 2–3 (component tests, then Playwright E2E) | 8–12 | **Task 47 P1** ("Remaining: phases 2–3 later") | — *(optional, but see note)* |
| 13 | 50 dependabot vulnerabilities | 2–3 | **Task 47 P2** | — |
| 14 | **Design / visual polish** | 5–10 | ⚠️ **NOT TRACKED — needs scoping first** | someone must define "polished" |

**Totals (excluding #12, which is optional):**

| Scenario | Days | Sprints (10 d) | Calendar |
|---|---|---|---|
| Optimistic — no surprises, backend responsive | ~56 | 5.5 | **~3 months** |
| **Realistic** | **~70** | **7** | **~3.5 months** |
| Pessimistic — backend delays, DPS surprises | ~90 | 9 | **~4.5 months** |

**⚠️ Three honest caveats, recorded so they are not rediscovered later:**
1. **Only #5 is backend-blocked.** E91 is the *only* protocol whose physics is duplicated in
   Python — BB84 and DPS backends contain zero physics (verified: the only quantum math in the
   whole backend is `sin(pi/8)**2` in `e91/consumers.py`). So if backend coordination is slow,
   #4, #6, #7 and everything else can still proceed. Strategic option worth deciding: **move
   E91's physics to the frontend** like BB84/DPS and delete the two-language duplication for
   good (ADR §13.3 already marks it "grandfathered, not endorsed").
2. **Every migration has found unknown bugs** — BB84 surfaced the phantom game, the missing key
   sacrifice, the flag conflation and the 22-month Eve bug. That is the *pattern*, not bad luck.
   DPS at 5× the surface is the real unknown; its range is wide for that reason.
3. **#11 and #14 have no task yet.** #11 (the manual matrix) is deliberately left unowned until
   #12 is decided — automating it may be cheaper than replaying 12 flows by hand every migration.
   #14 (design polish) cannot be estimated honestly until someone defines the target.

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
- Historical context: `docs/storage-architecture.md` (lifecycle diagrams doc deleted 2026-07-17 — superseded by ADR §4)

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
- [ ] BB84 solo setup: photon minimum validation uses `BB84_TEST_MODE` values, but the translated message still says production values `16`/`10`; align copy or disable test mode before deployment. (→ tracked in detail as Task 57 finding **G**; preferred fix is E91-style interpolation, not relying on the numbers coinciding.)
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
- **📦 DEPLOYMENT REALITY (noted 2026-07-17):** `development` does NOT auto-deploy. Production = manual copy of the branch files into a separate OLD repo connected to AWS Amplify. Consequences: (1) merging to `development` is safe integration, no release; (2) **the TEST_MODE fix below is the GATE before any copy to the Amplify repo** — that is where the landmine detonates; (3) future item: point Amplify at THIS repo (or automate) instead of copy-paste deployment.
- [ ] **P1 — `*_TEST_MODE = true` is a production landmine.** All three constants files (`bb84-constants.ts:35`, `e91-constants.ts:10`, `dps-constants.ts:22`) ship `TEST_MODE = true` with a hand-edit TODO. Replace the three booleans with one env-driven flag (e.g. `NEXT_PUBLIC_QC_TEST_MODE`), so production builds cannot forget it. (Related copy-alignment already in Task 40.) **⚠️ SUPERSEDED BY TASK 57 (2026-07-20) — this item as written is factually wrong twice: only TWO flags are live (`DPS_TEST_MODE` is dead code and DPS has no production values at all), and a plain env variable does NOT close the hole because `.env.local` is tracked AND rsynced to the Amplify repo. Read Task 57 before implementing.**
- [x] **P1 — PHASE 1 DONE 2026-07-16: Vitest installed, 39 tests green in <1s (`npm test`). Strategy in `docs/testing-strategy.md`** (Vitest — why, vs Jest/node:test/Bun/E2E; colocated `*.test.ts`; happy-dom; phase 1 = pure logic ≈35 assertions on `lifecycle.ts` (detectSession matrix, restoreCheckpoint, startFresh/abandon), `solo-round.ts`, `sacrificeValidationBits`, `solo-player.ts`; phase 2 = components; phase 3 = Playwright E2E; CI; **rule: every hand-found bug's fix commit carries the test that would have caught it**). Colocated: `lifecycle.test.ts` (detectSession matrix permanent, restoreCheckpoint contracts, startFresh/abandon), `solo-round.test.ts` (flag split, restart semantics, Eve record), `utils.test.ts` (**sacrificeValidationBits — the test that would have caught Task 53**), `solo-player.test.ts` (generators/sifting invariants). CI ACTIVE 2026-07-16 (`.github/workflows/tests.yml`: test+tsc+lint on every push). Remaining: phases 2–3 later. **URGENCY origin (Ibra, 2026-07-16): "we discover bugs by chance, and this is not good at all"** — the July harvest was all chance-found: the missing key-sacrifice (Task 53, protocol-core!), the flag conflation, the n/2 cap restart-loop, the `<=` empty-key edge, the stale basis inputs.
- [ ] **P2 — lifecycle adoption is ⅓ done (measured).** Raw `localStorage` refs in components: BB84 **7**, E91 **15**, DPS **72**. ~~ADR still `DRAFT/REVIEW`~~ ADR marked **ACCEPTED 2026-07-16** (Task 54 F7). Next: migrate DPS first (worst offender + still trap-guarded), then E91. (Execution tracked in 26/40; this item = the measurement + order rationale.)
- [ ] **P3 — monster pages**: `app/(main)/bb84_card/page.tsx` (1,175 lines), `app/(main)/dps/page.tsx` (953), `app/(main)/e91/page.tsx` (581) — content-heavy pages, split when next touched (no dedicated slice).
- [ ] **P2 — 50 dependabot vulnerabilities on `development`** (surfaced by GitHub on the 2026-07-20 push: **23 high, 24 moderate, 3 low**). Not yet triaged. Deserves its own dedicated slice, NOT an opportunistic bump: this is Next 14.2.35 + a large transitive tree, so major upgrades carry real breakage risk and must be verified against the full flows (68 tests cover logic only, no component/E2E coverage yet). Suggested approach when scheduled: triage high-severity first, separate patch/minor bumps (low risk, batchable) from majors (one per commit, each verified), and check whether any advisory is actually reachable from this app's usage before upgrading. Dashboard: `https://github.com/algolab-quantique/quantumcrypto-frontend/security/dependabot`.
- [ ] **P2 — debug `console.log`s leak game state to the browser console in production** (surfaced during Ibra's 2026-07-20 browser verification of the Eve fix). Original author's leftovers, NOT ours (`git blame` → Frederic 2024; our 3 commits added zero logs). They print secret key material and protocol internals on every game: `basis-tab.tsx:179-180` (`'My bits'` = keyBits, `'Other bits'` = partnerBits), `validation-tab.tsx:107,109` (`'Eve Present'`, `'Went into if'`), and `socket-provider.tsx` many (`:486,:518,:532,:560,:668,:767,:815,:866,:1235` — event names, `'receiving bits:'+message.bits`, `A_KEY_EVENT`/`B_KEY_EVENT` payloads incl. validationIndices). Small, safe cleanup slice: strip them (or gate behind `QC_TEST_MODE` once Task 57 lands). Do as its own commit; a student opening devtools currently sees the key.
- [ ] **P3 — pre-existing React warning: "changing a controlled input to be uncontrolled" in `BasisTab`** (`components/bb84/play-page/tabs/basis-tab.tsx`, seen in the same 2026-07-20 session). An input's `value` goes from defined to `undefined` mid-life. NOT caused by our Slice 3 (that only removed an unused import — cannot change runtime). Real but cosmetic; unrelated to the Eve work. Fix when BasisTab is next touched: ensure the input value defaults to `''` rather than `undefined`.
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
  - [x] **Minor observation — RESOLVED 2026-07-14 by Task 49-C polish:** the "Retour au menu principal" flash was `goToMainMenu` abandoning a COMPLETED game (stores wiped while the page was still mounted). Fixed: it now just navigates (nothing to quit; Navigation Invariant). Tested green.
  - Note: the "restart after insufficient valid bits → no photons, blocked" hit again during D4b/D5a testing via Rejouer — that is **Task 49** (already tracked, orthogonal to Task 48).
  **⚠️ Policy history (superseded):** the D2-era note said completed is kept on `/bb84` but still cleared by landing. The Navigation Invariant (above) extends D2's policy to ALL navigation: landing no longer clears completed BB84 either (D4b). Order matters: **D2 (protocol-page policy) → D3 (mode) → D4a (guard) → D4b (landing policy) → D5 (cleanup).**
- [~] **Slice E (path-aware — CORRECTED): BB84 side COMPLETE via D4a (verified 2026-07-16).** Only `waiting-room.tsx` still uses `is-connected` in BB84 — exactly the part Slice E says keeps its socket signal. The play route is guarded solely by PlayPage's `detectSession` (no socket term). **Remaining scope: E91/DPS play routes at their replication** (their play components still use the HOC). (NOT "drop socket OR-terms globally" — that would break lobby access.)

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
- [x] **49-C — DONE 2026-07-14 (tested green, solo + multi):** one blocking dialog, both triggers, both modes; Eve-detected Rejouer = restart WITHOUT Eve in both modes (solo via `restartSoloRound({withoutEve:true})` incl. persisting `bb84GameHasEve`; multi via the coordinated event). Polish: honest short Eve message; `goToMainMenu` no longer abandons a completed game (empty-form flash gone); dialog stays covering the screen during exits. Multi tested with probability 1.0 + 3 validation bits: Invalide → both players get the popup → Rejouer → both restart cleanly (empty bases, welcome lines) and the new round plays fine; Valide → no spurious popup. Original design notes: ONE blocking dialog for both triggers and **both modes** (Solo/Multi Parity Principle, now in ADR §11): big **Rejouer** (primary, the natural flow) + small quiet **Retour au menu BB84** (escape hatch; settings changes live at the protocol menu — "one place to configure, one button to replay"). No checkbox, no settings button (rejected: popup must not become a second settings screen). **Eve-detected Rejouer semantic — decision pending discussion:** multi's backend event is `RESTART_WITHOUT_EVE`, deliberately (design by the previous responsible: switch Eve OFF after detection so students complete the protocol instead of looping detect→restart). Recommended: both modes restart WITHOUT Eve (consistent today, zero backend). Related discovery (Ibra remembered right): **E91/DPS Eve is probabilistic** (`eve && Math.random() < 0.5`, `*_EVE_PERCENTAGE_DEFAULT = 0.5`) while **BB84 Eve is deterministic** — the odd one out; see Task 51. Retour semantics: solo = abandon + `/bb84`; multi = disconnect + abandon + `/bb84` (= existing quit; partner-left gap already Tasks 27/43). Insufficient-key Rejouer: same settings both modes (multi coordination = 49-B).
- Original 49-A plan (for reference): **solo fix (frontend-only):** extract the duplicated "start a solo Bob round" generation block (already 2 copies: `solo-game-modal.tsx:168-192`, `bb84-progression.tsx:68-89` — do NOT add a third) into one helper (e.g. `lib/bb84/solo-round.ts`). Rewire `basis-tab`'s `restartGame` for solo: reset room+progress, **re-apply config** (photonNumber, validationBitsLength, and **KEEP Eve as it was** — this restart is bad luck, not Eve-detection, so `evePresent` survives and Bob's regen applies `mimicEveIntercept` when Eve is on, like the modal), regenerate fresh randomness, push role-appropriate welcome lines (Alice regenerates via her own UI). Verify while implementing: whether `resetRoom` resets `evePresent` (if so re-set from `gameHasEve`). Test: solo Bob AND Alice, 4 photons, force insufficient key → restart → playable round, config + Eve preserved.
- [ ] **49-B — multi (REPRODUCE FIRST):** the `:115` trigger fires in multi too, and `restartGame` resets only LOCAL stores — the partner is never told → expected desync/hang. Reproduce (multi, 4 photons, one side hits insufficient key), document, then decide: proper fix is a coordinated restart like the Eve one, which likely needs a backend event (or confirming the backend relays a generic restart) — if backend-blocked, track with the partner-left family (Tasks 27/43).
  **+ CONCRETE REPRO 2026-07-17 (Ibra):** after the coordinated Eve-restart, the next round's validation is broken: backend picked indices **1 9 4** for a key too short for index 9 → a BLANK validation row (out-of-range index), messy transcript, incomplete form. **Mechanism hypothesis: the backend's validation state (indices / key_length) is NOT reset by RESTART_WITHOUT_EVE** — it draws from the old round's key length. Also lost UX: the old "partner declared the key invalid" transcript lines are eaten by the new blocking dialog — restore a partner-notification line with the dialog. Frontend defensive option (masks, not fixes): filter out-of-range indices in validation-tab.
  **+ Multi Eve-restart round integrity (found 2026-07-14, partial repro):** the coordinated `RESTART_WITHOUT_EVE` DID restart both players (dialog → event → both reset ✅), but the new round was "not ok" (Ibra): Bob's bases came back **prefilled** (stale `bb84BobBasisInputs` — FIXED: the legacy `restartWithoutEve` util now clears it) and the round afterward misbehaved (photons pass but game broken — after the two fixes below, the 2026-07-14 retest restarted cleanly and the new round played fine, so the misbehavior was likely these two bugs; keep an eye during 49-B proper). Also fixed en route: **`eveUndetected` was never synced to the partner** (`A/B_VALIDATED_EVENT` now mirror "valid + Eve present ⇒ undetected"), which made a spurious Eve-restart dialog appear on the partner's side after a VALID verdict (pre-existing bug, exposed by testing with probability 1.0; made worse by the new blocking dialog — hence fixed now).

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
- [ ] **F6 — language-provider dictionary selection is bypass-prone (found 2026-07-16, Task 51 ph.2).** `language-provider.tsx:62`: the game dictionary (bb84/e91/dps-lines) loads only when `pathParts[2]` is `play|solo`; every other route gets ONLY `quantumcrypto-lines`, with **no fallback chain**. Consequence: teams put keys in the "wrong" file to make routes work (E91's solo-results keys, now BB84's too — documented in-file). Fix candidate: fallback chain `gameLines[str] ?? quantumcryptoLines[str] ?? str` (+ registering `solo-results` routes) — strictly additive (raw keys become translations). Do at replication.
- Cross-refs (already tracked, not repeated): navigation push/replace violations in E91/DPS solo (Task 48 Slice A findings); guard/mode pattern replication (Task 48 template); raw localStorage counts (Task 47).

---

### 51. 💡 BB84 Eve should be probabilistic like E91/DPS (product idea — DISCUSS before implementing)

**Status**: ✅ DECIDED 2026-07-14 (Ibra) — probabilistic wins; full motivation + the old choice recorded in **ADR §12 "Unification decision"**. Phase 1 (solo modal probability field + draw at start) implemented + tested green same day; restart-redraw explicitly rejected (loop at p=1.0).

- [ ] **Phase 3 — Eve-detected restart becomes a REDRAW, both modes together (decided as TARGET 2026-07-16, blocked on backend):** Ibra's call: with probabilistic Eve, forcing her off at restart is less natural than redrawing with the same probability ("if we want Eve 100% we just put prob = 1"). Makes all restarts semantically identical; physically honest at p=1.0 (no key possible on a permanently tapped channel — that's the lesson; the old "infinite loop" objection was overstated — the loop terminates via an undetected miss). **Blocked by the Parity Principle**: multi's backend event forces Eve off, so flip BOTH modes together at the 49-B backend session (backend needs a redraw-capable restart + answer whether `game_has_eve` carries checkbox or draw). ADR §12 updated.
- **Product ideas noted 2026-07-16 (decide later, with 49-B/parity in mind):** (a) validation bits as a **percentage of the sifted key** instead of a pre-chosen count (today: zod caps at photons/2 + the restart dialog catches bad sift luck — trigger fixed to `<=`, the equal case left a zero-bit key = unplayable); (b) raise the photon max above 30? (solo AND multi together — both constants are 30; note 50 rows is a lot of table UI; for Eve-miss testing 30 suffices since detection odds depend only on validation-bit count).
- [x] **Phase 2 — DONE 2026-07-16 (tested green, screenshots):** `/bb84/solo-results` route + `solo-results-table` (E91-modeled, but guarded by `detectSession` completed-solo + hydrated via `restoreCheckpoint` — immune to flag resets, fully invariant-conform; this is the template E91/DPS results adopt). Reveal verified for caught (Manches→**Itération** 2) and missed (red "clé compromise", the silent ending now loud). Solo félicitation = one "voir les résultats" button (parity, Option A); Rejouer/Retour live on results. `SoloEveRecord` {enabled, percentage, drawn, detected, rounds} + `bb84GameStartTime` (adapter storageKeys extended). **Two bugs caught by Ibra's testing en route:** (1) locale keys live in `quantumcrypto-lines` — the provider serves the game dictionary only on `play|solo` routes (Task 50 F6); (2) **flag conflation**: phase 1 set `gameHasEve` to the DRAW, silently skipping the validation step when Eve wasn't drawn — leaking the answer; split: `gameHasEve` = checkbox (flow), `evePresent` = draw (physics); restarts preserve the draw (ADR §12 corrected).
- Original Phase 2 notes (reference): **BB84 solo results/reveal screen (one deliverable, two gaps):** (1) Ibra noticed BB84 solo félicitation has only Rejouer/Retour — **no results view** (E91 has `solo-results-table.tsx` + `/e91/solo-results`; DPS's same gap is already tracked around line ~374, citing E91 as model; BB84 was untracked). (2) With probabilistic Eve, the **undetected-Eve ending is silent**: the student completes the game believing the key is secure, `eveUndetected=true` is recorded, and nobody tells them — the most teachable moment in the game. Deliverable: a BB84 solo end-of-game results/reveal view à la E91: key stats + "Ève était-elle présente ?" (present-and-missed / present-and-caught / absent). Requires storing the checkbox+probability separately from the draw (today both flags carry the draw). Semantics table (prob < 1): detected → restart WITHOUT Eve (no redraw, anti-loop); undetected → game completes with compromised key (the reveal's job); not drawn → clean game.
**Finding (verified):** E91 and DPS treat the Eve checkbox as "Eve *possible*": actual presence drawn per game (`eve && Math.random() < evePercentage`, `E91_EVE_PERCENTAGE_DEFAULT = 0.5`, `DPS_EVE_PERCENTAGE_DEFAULT = 0.5`, with min/max constants). **BB84 is the odd one out:** checkbox = Eve deterministically present (`mimicEveIntercept` intercepts every photon; only *detection* is probabilistic, via physics). Looks like drift, not a BB84-specific need (Task 50 principle: unify unless the protocol requires divergence).

**STRENGTHENED 2026-07-14 (Ibra's multi test):** BB84 **multi** is ALREADY probabilistic — the create-game modal has a "Probabilité d'Ève" field (`evePercentage` → backend `eve_percentage` → `game_has_eve` at ROLES). So **BB84 is inconsistent with itself across modes** (solo deterministic, multi probabilistic) — a Parity-Principle violation, and the alignment model is in-house: make BB84 SOLO match BB84's own multi (checkbox + probability, drawn at start/restart).

**Why it's attractive:** aligning BB84 (checkbox = possible, drawn at `BB84_EVE_PERCENTAGE`) is more realistic AND **dissolves the Eve-detected-restart fork**: "Rejouer = same settings" would simply *redraw* Eve — anti-loop preserved statistically (p<1 ⇒ students eventually complete the protocol, the previous responsible's goal) while keeping realism (Eve may return or slip through). One semantic for all protocols and both modes.

**Scope notes:** solo = frontend-only (mirror E91's modal pattern). Multi = check how the backend assigns `game_has_eve` before promising anything. Results/HUD copy may need "Ève était-elle présente ?" reveal like E91 (`e91OriginalEvePresent`). Do NOT bundle into 49-C — separate slice after discussion.

---

### 52. 📋 E91 pre-migration findings (recorded 2026-07-14 — for when E91's turn comes)

**Status**: 📋 RECORDED, deliberately NOT worked on (BB84 pilot first). Found by Ibra testing E91 with Eve.

- [ ] **52-A — CHSH "not secure" restart leaves an EMPTY transcript.** `solo-CHSH-tab.tsx:242` `restartGameWithoutEve` is a naive `resetRoom+resetProgress` (+local state) that regenerates nothing and pushes NO welcome lines → the Game Progression sidebar is blank after restart (screenshot confirmed). Same disease as BB84 Task 49 / Task 50 F1; the E91 *basis*-tab restart pushes lines, the CHSH one forgot (copy drift). Fix vehicle: E91's canonical `solo-round`-style helper during its migration (mirror BB84's `lib/bb84/solo-round.ts`).
- [ ] **52-B — the security claim is never verified.** `solo-CHSH-tab.tsx`: the CHSH `S` value is computed (`:116`) and displayed, but `onSecure`/`onUnsecure` "directly navigate or set state" (the file header says so itself, `:9`) — no comparison of the player's claim against `S` (≤ 2 vs > 2), no BB84-style valid/invalid "try again" feedback. Pedagogical gap: the game follows the user's decision blindly. Design the verification mechanic (mirror BB84's validate-with-feedback) at E91 migration.
- Cross-refs: Task 50 F1 (restart copies), Task 51 (E91 already has probabilistic Eve — the model BB84 may adopt), Task 26/40 (E91 lifecycle migration).

**🔬 E91 EVE AUDIT (2026-07-20, requested after the BB84 Eve bug — all numbers from running the REAL `lib/e91/solo-player.ts`):**

**What is RIGHT (and is the model BB84 should copy):**
- ✅ **No duplication.** `solo-measurement-tab.tsx:41` **imports** `eveGenerateBits` from `lib/e91/solo-player.ts` and calls it at `:161`/`:181`. One implementation, one home. This is exactly the architecture rule BB84's `alice-exchange-tab.tsx` violates (Task 57 A-bis) — **E91 is the good example here, BB84 is the bad one.**
- ✅ **No `undefined`-index bug.** `eveGenerateBits` loops over its own `bases` parameter, so no array-length mismatch is possible. Not the BB84 bug family.
- ✅ **The no-Eve entanglement model is excellent.** Measured S = **2.838** over 200k samples vs the quantum target 2√2 = 2.828. `generateEntangledBits` + `PROBABILITY_THRESHOLD = sin²(π/8)` is textbook-correct.
- ✅ **Eve does destroy the correlation.** With Eve, key bits at matching bases agree only **49.9%** of the time (= no correlation), and S collapses to **0.005**.

- [ ] **52-C — 🟡 DOWNGRADED P1→P3 by DECISION (Ibra, 2026-07-20): teach the concept, document the limitation.** Ibra's call: CHSH needs large N to be statistically valid, but this is a short interactive student form — so the app deliberately demonstrates the **concept** of the Bell test, not a statistically sound one. **Action is therefore NOT "raise the photon counts" but "add an explanatory Note in the simulation"** telling the student that with few photons S is noisy and a single game cannot decide the question — that limitation is itself part of the physics lesson. The numbers below stay recorded as the justification for the Note's wording, and as the reason the `onUnsecure`→`gameLoss` punishment needs revisiting (a student reasoning correctly from a noisy S must not simply "lose"). Original finding text follows.
  **Original finding — the CHSH test is statistically meaningless at every photon count the app offers.** CHSH needs 4 specific basis pairs — (1,2), (1,4), (3,2), (3,4) — each occurring with probability 1/9 (Alice picks from 3 bases, Bob from 3). Measured over 50 000 games per row, in **Eve-ABSENT** games (`gameHasEve=true, evePresent=false` — reachable under the Task 51 probabilistic draw, and the CHSH tab IS shown then: `solo-game.tsx:166` gates on `gameHasEve`):

  | photons | no-Eve games where \|S\|>2 (Bell violated, student should answer SECURE) | games missing a CHSH pair entirely |
  |---|---|---|
  | **4** (E91 solo TEST_MODE default) | **6.0%** | 99.6% |
  | 8 (TEST_MODE min with Eve) | 27.4% | 90.5% |
  | **10** (PRODUCTION default) | **37.5%** | 81.3% |
  | 20 (production min with Eve) | 66.1% | 33.8% |
  | 30 (`E91_SOLO_PHOTON_MAX`) | 77.7% | 11.4% |

  At N=10 each CHSH pair gets ~1 sample, so each E(a,b) is ±1 — pure noise. **Consequence:** a student in an Eve-absent game computes S, correctly sees the Bell inequality is NOT violated, correctly answers "not secure" — and `onUnsecure` (`solo-CHSH-tab.tsx:211-234`) sends them to `component.e91.gameLoss` because `evePresent` is false. **The student reasons correctly and is told they lost, ~62% of the time at production defaults.** At 4 photons, 99.6% of games have at least one CHSH pair with ZERO samples, whose `calculateAverage([])` returns 0 (`:110`). Fix options (decide at migration): raise E91's photon minimums well above `MAX=30`, weight basis choice toward CHSH pairs, accumulate S across rounds (`sValues[]` already exists at `:85`), or replace the hard `|S|>2` reading with an explicit confidence/《not enough data》state. **Interacts with Task 57 (TEST_MODE): E91's test values make this dramatically worse, so 52-C must be decided BEFORE the TEST_MODE flip, not after.**

- [ ] **52-D — 🟠 P2: Eve's output is biased, which is physically impossible and student-visible.** `eveGenerateBits` (`lib/e91/solo-player.ts:261-289`) produces, measured over 100k samples per basis: basis '1' → **85.32%** zeros, basis '2' → **100.00%** zeros (hardcoded `outcome = 1`, commented "Basis 2: Deterministic (always 1)"), basis '3' → **85.46%** zeros, basis '4' → 50.21% zeros. Any measurement outcome on a maximally mixed state must be **50/50** — a biased marginal means the output encodes the basis instead of a measurement. **Same family as the BB84 bug: a constant output.** Student-visible tell: with Eve present, EVERY basis-2 result is `0` (verified: at 2-2 key positions Bob's bit is '0' 100% of the time), so a student can spot Eve by "all my 2s are zeros" rather than by Bell's inequality — which defeats the entire pedagogical point of E91. Fix: make Eve's outcome an unbiased 50/50 draw for all bases (that alone still gives S≈0 and still destroys the key correlation).
- [ ] **52-E — 🟡 P3 (design note, not a bug): Eve is modelled as TOTAL decorrelation, not intercept-resend.** Measured S with Eve = **0.005**; a real intercept-resend attack on E91 halves the correlations, giving S ≈ 2√2/2 = **1.414** — still below the classical bound of 2, so still detectable, but not a flatline. The docstring (`:236-257`) is honest that this is a deliberate "Statistical Shortcut" matching the backend, and it does meet its stated goal (force S ≤ 2). Recording it because it makes Eve maximally obvious (same over-detection spirit as the BB84 bug) and because any future "how strong is Eve?" teaching lever lives here. Changing it requires a matching backend change — do not touch unilaterally.
- [ ] **52-F — P3 cleanup: `simulateSoloExchange` (`lib/e91/solo-player.ts:401-450`) is dead code**, documented as "currently NOT USED" at `:379`. It duplicates the Eve/entanglement branching that `solo-measurement-tab.tsx:155-190` actually performs — a second source of truth waiting to drift. Delete or wire it up during the E91 migration.

---

### 53. 🐛 BB84 never sacrifices the validation bits from the key (protocol-core bug)

**Status**: ✅ DONE 2026-07-16 (tested green solo + multi: shortened identical keys, message decrypts; results keyLength honest). Canonical `sacrificeValidationBits()` in `lib/bb84/utils.ts`; called by the verdict-clicker (validation-tab) and mirrored on the partner (`A/B_VALIDATED` valid branches; indices symmetric — solo: frontend draw, multi: backend singleton draw).
**The bug:** `validation-tab.tsx:85` reads the validation bits (`validationIndices.map(i => keyBits[i])`) and compares them **publicly** — but nothing ever removes them; `messaging-tab` encrypts with the full `keyBits`. In real BB84 the compared bits are announced on the public channel (Eve knows them) and MUST be discarded. Both modes affected (messaging-tab shared; multi shares the full sifted key). Pedagogically wrong exactly where the app teaches security. (Irony: the `<=` restart trigger comment already stated the correct theory — the code never did it. Poster child for Task 47's tests.)
**Fix design:** after a VALID verdict, `keyBits := keyBits without validationIndices` — solo: in validation-tab before `moveToExchangeTab`; multi: mirror in socket-provider's `A/B_VALIDATED` valid branches (`validationIndices` are already symmetric on both clients). Downstream self-corrects: cipher/key display shrink, results `keyLength` honest, checkpoint persists filtered key, `<=` trigger already guarantees ≥1 remaining bit.

---

### 54. 🔍 Critical Architecture Review findings (2026-07-16)

**Status**: ✅ **COMPLETE 2026-07-17** — all findings resolved in order (F2 → F7+F7b → F4 → F1 → F3 → F5/F6 policies; F8 = documented accepted debts). The review's verdict stands: no foundational mistake; the pilot architecture is now reusable (F1 hook), honest (F3/F4/F7), invariant-safe cross-protocol (F2), and future-guarded (F5/F6 policies in ADR §13).

- [x] **F2 DONE 2026-07-16 — DPS `localStorage.clear()` destroys other protocols' kept data.** Fixed by DELETING the two calls (they were provably redundant for DPS: `clearDPSLocalStorage()` runs adjacently at both sites). 39/39 tests green. `socket-provider.tsx:723` and `:1173` (DPS branches) wipe ALL storage — including BB84's completed sessions/Eve records that the Navigation Invariant now promises to keep (finish BB84 → play DPS multi → partner leaves → BB84 results vanish). Fix: replace ONLY the `localStorage.clear()` calls with `clearProtocolStorage(dpsAdapter)`; leave DPS's other legacy lines untouched (full DPS cleanup at its migration). Was Task 44; severity raised by the invariant.
- [x] **F1 DONE 2026-07-17 (smoke-tested green by Ibra) — extract `useProtocolSessionGuard`.** The PlayPage guard+bridge+mode logic is bespoke inline code, and `solo-results/page.tsx` already contains a second hand-copy of the gate. Replication would mint copies 3–8. Fix: pure `resolveSessionForRoute(adapter, require)` in the lifecycle (unit-testable NOW with vitest) + thin hook `useProtocolSessionGuard(adapter, {require: 'any'|'completed', failCloseTo})` wrapping it (gate + mode + flag bridge); PlayPage and solo-results consume it; E91/DPS get it free. Also fixes: guard logic currently untestable because embedded in components.
- [x] **F7 DONE 2026-07-16 (+F7b 2026-07-17) — ADR drift + docs-folder coherence.** Path fixed (§6 `shared/`→`lib/`), status ACCEPTED (replication unlocked). F7b (Ibra's catch — the folder around the law was incoherent): **`docs/README.md` index created** (the law / the reasoning / ideas / deleted); **deleted** `tasks_archived.md` (status snapshot — git keeps it: `git show 6bd4ee9:docs/tasks_archived.md`) and `protocol-session-lifecycle-diagrams.md` (fully superseded by ADR §4); stale 'draft/during review' headers fixed in the three kept historical docs; all dangling references updated. Shelf principle documented in the README: tree = discoverable, git = retrievable; reasoning ages into value, status snapshots age into lies. §6 File Structure says `shared/protocol-lifecycle/`, reality is `lib/protocol-lifecycle/`; ADR status still DRAFT/REVIEW though its own acceptance gate (Task 47 P2: "when the BB84 pilot settles") is reached. Fix: correct the path, flip status to ACCEPTED with a dated note (pilot completed 2026-07-16, Tasks 46–53).
- [x] **F4 DONE 2026-07-17 — dead/false surfaces.** `multiplayerSessionIssue` pruned from the public `CheckpointRestoreResult` (no producer since D1; internal helper states kept); ADR §3/§5 snippets + prose synced to the strict semantics. `registry.ts` kept with a loud SCAFFOLDING header (consumers: partner-left dispatch + Phase 5, ADR §4.5/§6). `multiplayerSessionIssue` in `CheckpointRestoreResult` is never emitted since D1 (a caller could handle a state that cannot occur) → prune from the public result type (the internal `restoreMultiplayerSession` kinds stay). `registry.ts` has zero importers → KEEP with a loud "not used until Phase 5 / generic PLAYER_LEFT dispatch (ADR §4.5)" comment rather than delete (near-term partner-left work needs `getAdapter(gameType)`).
- [x] **F3 DONE 2026-07-17 (wire-lite) — `saveCheckpoint`/`complete` had ZERO callers.** Persistence actually happens field-by-field via `updateAndStore` in the stores; the lifecycle's named doors are fiction (ADR §3's discoverability rationale currently false). Decision: **(a)-lite — make `complete(adapter)` real at the gameSuccess milestones** (few call sites) and AMEND ADR §3 to document the two-mechanism truth: incremental = `updateAndStore` (per-field, existing), milestone snapshot + future backend-sync hook = `complete`/`saveCheckpoint`. Rejected: deleting them (loses the designed backend plug-in point and entrenches the 3× duplicated store persistence as the only mechanism).
- [x] **F5 DONE 2026-07-17 (policy documented, ADR §13.1) — flags: 8 play-page files still read `playingSolo`; multiple writers remain** (socket ROLES ×3, solo modals ×3, form onRejoin, lifecycle resets, D5a bridge, landing). Safe today only by write ORDERING, which nothing enforces. Policy: (1) PlayPage provides a `ProtocolModeContext` (value from `detectSession`); touched components migrate from flags to context opportunistically; (2) E91/DPS pages use the F1 hook + context from day one (their tabs never read flags); (3) add the flag-writer INVENTORY to the ADR so the ordering assumption is explicit.
- [x] **F6 DONE 2026-07-17 (policy documented, ADR §13.2) — 53 room-store references inside socket-provider (domain logic in the transport layer).** Hold-the-line rule (add to ADR): NEW handler logic goes into `components/providers/socket-handlers/{protocol}-play-handler.ts` modules (ADR Phase-5 file plan) that the provider calls; existing bodies move only when touched. First candidates when next touched: the `A/B_VALIDATED` bodies (modified twice this week; extraction also makes them unit-testable).
- [ ] **F8 (LOW, notes only) — accepted debts, documented:** quit-flow `replace('/bb84')` can mint adjacent-duplicate history (push would be worse: Back into a dead game); `bb84GameData` has three writer shapes (modal seed / `updateAndStore` merge / snapshot) guarded by `restoreGame` key-validation — assign shape ownership in ADR when F3 lands.

**Positive findings (do not touch):** `detectSession` purity; the Invariant + Parity docs; fail-close semantics; adapter contract; tests+CI; the friction-first ADR culture. No foundational mistake found.

---

### 55. 🐛 Insufficient-key restart fires in NO-Eve games (trigger ignores gameHasEve)

**Status**: ✅ DONE 2026-07-17 (tested green). Pure `isKeyTooShort(sifted, gameHasEve, validationBits)` in `lib/bb84/utils.ts` (+4 tests incl. "Ibra's catch"); dialog message follows the REASON: empty key → `alertDescriptionEmptyKey` (both modes — also fixes Ibra's second catch: an EVE game with zero matching bases wrongly showed the espion text); non-empty-but-insufficient (Eve only) → espion message.
**Bug:** basis-tab's trigger `keyBits.length <= validationBitsLength` never checks `gameHasEve` — but the modal stores a validationBitsLength even when Eve is unchecked (field hidden, value kept). In a no-Eve game there is NO validation step and nothing is sacrificed: a 1-bit key is usable (1-bit key → 1-bit message; the XOR lesson works — purely educational app).
**Fix when acted:** mode-aware minimum — with Eve: `sifted > validationBitsLength` (sacrifice math); without Eve: `sifted ≥ 1` (only an empty key is truly stuck). Plus a message variant for the no-Eve empty-key case (current text wrongly says "vérifier qu'il n'y a pas d'espion").

---

### 56. 🎨 Results-page story parity: solo has the reveal, multi has the celebration

**Status**: ✅ DONE 2026-07-17 (core verified; caught-case display pending 49-B). Solo gained the celebration (then merged into reveal-led single phrases — polish slice); multi gained localized headers + derived **« Ève détectée ? »** and colored **Verdict** columns (derivation: only the coordinated Eve-restart removes Eve, so last-iteration-with-Eve ⇒ compromise; earlier-Eve-then-clean ⇒ caught). **VERIFIED by Ibra:** no-Eve room → vert « Clé sécurisée »; missed case → rouge « Clé compromise ! ». Caught-case display unverifiable until the 49-B multi-restart bug is fixed. Shared neutral key `component.results.gameSuccess` replaces the e91-named one on the shared results page.
Multi results show a generic "🎉 Félicitations ! Partie terminée avec succès !"; solo results show the Eve reveal ("Ève était absente — votre clé est sécurisée"). Mirrored gaps: solo lacks the celebration line; **multi lacks the Eve reveal** (Parity Principle: both modes should tell the same story). Multi's table is backend-fed and the backend knows `game_has_eve`, so a multi reveal is feasible — touches the multi results component (+ maybe payload). Small UX slice, with 49-B/backend session or at replication.

---

### 57. 🔬 TEST_MODE review → became the PROTOCOL PHYSICS investigation (2026-07-20)

> **📍 START HERE IF YOU ARE COLD (new session, new agent, or Ibra after a break):** read
> **[docs/protocol-physics.md](docs/protocol-physics.md)** first — it is the self-contained
> orientation for this whole line of work. This task is the raw findings log behind it.
>
> **THE REALIZATION (Ibra, 2026-07-20) — the project has TWO axes, and they were being confused:**
>
> | Axis | Governs | Document | State |
> |---|---|---|---|
> | **A. Session & data lifecycle** | where form data goes, refresh, restore, `startFresh`, `abandon`, storage keys, route guards | `docs/shared-protocol-lifecycle-adr.md` | ACCEPTED, BB84 pilot done, E91/DPS pending |
> | **B. Protocol physics** | encoding, measurement, Eve, sifting — *what the simulation computes* | **`docs/protocol-physics.md` (NEW)** | just opened |
>
> **The whole ADR/refactor effort to date was Axis A only.** It asked "where does this data go
> and does it survive a refresh?" — never "is the number in it physically correct?". That is
> its stated scope, not a flaw. But it means BB84 could be fully lifecycle-conformant and still
> compute wrong physics — which it was, for 22 months.
>
> **Verified project history (git, not recollection):** 6 contributors over ~2 years (chegrane
> 300 commits, noblechap 40, Frederic 28, ZoubaGate 12, +2). Built **multiplayer-first**; solo
> came later and per-protocol — **BB84 solo `2024-11-25 | Frederic`** (predates Ibra), **E91 solo
> `2025-12-08 | chegrane`**, **DPS solo `2026-01-07 | chegrane`**. Each contributor copied the
> physics they needed into the file they were editing. "Add solo without breaking multi"
> succeeded — but it **doubled every physics primitive instead of sharing one**. The Eve bug
> dates to `2024-09-03 | Frederic | "Initial commit"` (the multi copy) and reached solo by
> copy-paste on `2024-11-25`.
>
> - [ ] **SEQUENCING DECISION PENDING (Ibra):** finish Axis B for BB84 **before** starting the
>   Axis A migration for E91/DPS? **For:** E91/DPS files get opened and edited during their
>   lifecycle migration, and their physics already has known problems (52-C…52-F; DPS has no
>   solo Eve at all) — touching the same files twice is waste. **Against:** Axis A has momentum
>   and a proven pilot. Ibra leaned toward physics-first in the 2026-07-20 session.

**Status**: 🔴 OPEN — design agreed, Slice 0 + Slice 1 implemented (see finding J), rest not started
**Date Added**: July 20, 2026
**Priority**: mixed (A and D are P1)
**Origin**: pre-implementation review of Task 47's P1 "`*_TEST_MODE = true` is a production landmine". The review invalidated part of that item's premise and surfaced a protocol-core bug. **Every claim below was verified against the code or by simulation — none is intuition.**

**⚠️ Task 47's P1 item is factually wrong on two points** (kept there, corrected here): it says "all three constants files" ship a live flag, and it proposes a plain env variable as the fix. Neither survives contact with the code — see C and D.

#### A — 🐛 P1 PROTOCOL-CORE: Eve's re-emission uses the wrong basis array
`lib/bb84/solo-player.ts:89` — inside the re-emit `.map()`:
```ts
const basis = bases[index];      // bases is the 2-element alphabet ['+','x']
                                 // should be eveBases[index]
```
It indexes the **basis alphabet** instead of Eve's drawn bases. Combined with the dangling `else` on the third `if`, the output is deterministic garbage. **Verified empirically** (20 000 trials, exact copy of the function): photon 0 is always re-emitted in `+`, photon 1 always in `x`, and **every photon from index 2 onward is re-emitted as a constant `4`** — regardless of what Eve measured.

Effect on what students observe (200 000-trial simulation of the full pipeline `generateAlicePhotons → mimicEveIntercept → simulateBobExchange → getValidBits → validation compare`):

| photons | validation bits | P(caught) TODAY (buggy) | P(caught) CORRECT |
|---|---|---|---|
| 4  | 1 | 39.8% | **25.0%** |
| 6  | 1 | 40.6% | **24.7%** |
| 10 | 2 | 68.2% | **43.6%** |
| 16 | 4 | 92.0% | **68.3%** |
| 20 | 5 | 96.0% | **76.1%** |
| 30 | 7 | 99.0% | **86.5%** |

The CORRECT column matches theory `1 − 0.75^v` exactly (v=1→25%, v=4→68.4%, v=7→86.7%), which validates the simulation. **The app currently over-teaches "Eve always gets caught"** — the physics students see is wrong today, in dev AND in production. This is arguably more important than the whole TEST_MODE task.

#### B — P2: the existing Eve test cannot catch A
`lib/bb84/solo-player.test.ts:38` asserts only `toHaveLength(16)` and `[1,2,3,4]` membership — both hold for the broken output. Per the Task 47 rule ("every hand-found bug's fix commit carries the test that would have caught it"), A's fix must carry a **distribution/basis-correlation** test, not a shape test.

#### C — P1: `DPS_TEST_MODE` is dead, and DPS has NO production values
`dps-constants.ts:22` declares the flag; **grep confirms zero reads** (only itself and a comment at :28). DPS solo constants are hardcoded `MIN=4 / MAX=20 / DEFAULT=6`. So there are **two** live flags, not three — and flipping any flag will never fix DPS, because its production numbers were never written. Any TEST_MODE slice must *define* DPS production values, not just gate existing ones.

#### D — 🚨 P1: the proposed env-flag fix does NOT close the hole (deployment trap)
`DEPLOYMENT_GUIDE.md` Phase 2 syncs with:
`rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' ../quantumcrypto-frontend/ .`
**`.env*` is not excluded**, and `.gitignore` ignores only `.env` — so `.env.local` is git-TRACKED *and* rsynced into the Amplify repo. Verified in the installed `@next/env` (`processEnv`/`populate`): a var already present in the real environment wins, but `.env.local` **is** loaded during a production build and fills in anything Amplify has not defined. Load order is `.env.$mode.local`, `.env.local`, `.env.$mode`, `.env`.

⇒ Putting `NEXT_PUBLIC_QC_TEST_MODE=true` in `.env.local` for dev convenience **ships it to production**. A plain env flag just moves the landmine from a `.ts` file into a `.env` file — less visible, same detonation. (Bonus exposure: the tracked `.env.local` also carries `NEXT_PUBLIC_API_URL=http://localhost:8000` into the deploy repo; harmless only while Amplify defines its own.)

#### E — P2 user-visible: DPS create-game shows raw placeholders
`components/dps/home-page/create-game-modal.tsx:86` reuses `component.e91.createGame.keyMin` **without the `.replace()` calls** that E91 does (`components/e91/home-page/solo-game-modal.tsx:220-221`). The message contains `{minWithEve}` / `{minWithoutEve}`, so students see the literal braces. Also a cross-protocol key reuse smell (DPS borrowing an `e91.`-named key).

#### F — P3 i18n gap: DPS solo validation message is hardcoded English
`components/dps/home-page/solo-game-modal.tsx:123` — `` message: `Minimum ${DPS_SOLO_PHOTON_MIN} photons` `` — never localized, breaks FR/ES.

#### G — P2: the original Task 40 copy mismatch, explained
BB84 solo reuses `component.createGame.keyMin`, whose text hardcodes "16 / 10" in all three languages (`lang/quantumcrypto-lines.ts:46, 548, 1112`). Those numbers are correct for BB84 **multiplayer** (16/10) and for solo **in production mode** — they are wrong only while `BB84_TEST_MODE=true` (6/4). E91 already solved this properly with interpolation. So G is auto-fixed by the flag work, but the *right* fix is to interpolate like E91 rather than depend on the numbers coinciding.

**AGREED DESIGN for when we implement (Ibra, 2026-07-20) — "safe by absence, not safe by configuration":**
```ts
// one flag for all protocols
export const QC_TEST_MODE =
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_QC_TEST_MODE === 'true';
```
- ~~`next build` forces `NODE_ENV=production`~~ **CORRECTED 2026-07-20 (verified in installed Next 14.2.35, `node_modules/next/dist/bin/next:60`):** `next build` only **DEFAULTS** `NODE_ENV` to production (`NODE_ENV = NODE_ENV || defaultEnv`) — an inherited `NODE_ENV=development` (shell profile, CI env) survives with just a warning. The `NODE_ENV` gate is a strong second factor, NOT a guarantee.
- **The real lock:** `next.config.js` phase guard — export the function form and during `PHASE_PRODUCTION_BUILD` **throw** if test mode would be live (`NODE_ENV !== 'production'` or the flag set). A deploy build then *cannot succeed* in test mode; the failure happens at build time in Amplify, not at runtime in front of students.
- Absence ⇒ production values. Opt-in, never opt-out.
- Ships with: a CI test asserting production values under a production build; `.env*` added to the rsync excludes in `DEPLOYMENT_GUIDE.md`; **real production constants for DPS** (C); interpolated copy instead of hardcoded numbers (G).

**Recommended slice order** (not yet approved for execution): **A+B first** (small, isolated, protocol-core), then the TEST_MODE slice. Doing TEST_MODE first would ship "correct" photon minimums whose statistical justification is still computed by broken code.

**💡 Product idea (log only, do NOT build now):** the photon count is not a speed knob — it *is* the lesson. It sets P(Eve caught) from 25% to 87%. Given Task 56 now teaches three endings (`absent | caught | missed`), the honest long-term direction is to make photon count an **explained in-app choice** ("shorter game ⇒ Eve escapes more often") rather than a hidden build constant. Relates to Task 51 (probabilistic Eve) and `docs/product-vision-game-experience.md`.

**🔬 RE-VERIFICATION ADDENDUM (2026-07-20, second pass — real code, not transcription):**
- Finding A re-confirmed by importing the ACTUAL `lib/bb84/solo-player.ts` via `node --experimental-strip-types` (zero transcription). Distribution identical: idx 0 → always re-emitted `+`, idx 1 → always `x`, idx ≥2 → constant `4`. Decisive test: fixed input `[1,1,1,1,1,1]` over 5 000 runs yields output sets `{1,2} {3,4} {4} {4} {4} {4}` — from index 2 on, **Eve's output ignores her input entirely**. Root cause is one token: `bases[index]` (the 2-letter alphabet) instead of `eveBases[index]` at `solo-player.ts:89`; indices ≥2 read `undefined`, no branch matches, dangling `else` emits `4`. Indices 0/1 are also wrong (re-emit basis fixed by POSITION, not by Eve's measured basis) — just less visibly.
- Detection table recomputed with the EXACT real flow (random `generateUniqueRandomList` validation indices per `basis-tab.tsx:168`, real `isKeyTooShort` `<=` policy): TODAY buggy → 43.7% (n=4,v=1), 72.5% (10,2), 92.9% (16,4), 99.1% (30,7). AFTER one-token fix → 25.1%, 43.8%, 68.4%, 86.7% — matching theory `1−(3/4)^v` to the decimal. Conclusion unchanged, numbers now exact.
- **Sibling-protocol scan (for the DPS/E91 migration arc):** E91 `lib/e91/solo-player.ts:261` (`eveGenerateBits`) is a **documented, deliberate** phenomenological model ("Statistical Shortcut" comment block, matches backend) — NOT this bug family; audit its CHSH thresholds when E91's turn comes, but nothing silent. DPS `lib/dps/dps-protocol.ts` has **no solo Eve interception simulation at all** — consistent with C (dead flag, no prod values). The bug is BB84-only.

#### A-bis — 🚨 CORRECTION 2026-07-20 (3rd pass, after backend review): the bug is **NOT solo-only — it is in MULTIPLAYER too**
My earlier "solo-only" scoping was **WRONG**, and the error was scope, not diagnosis. Traced with the backend in hand:
- **The backend performs ZERO photon physics.** Verified: `grep -rn "photon" --include="*.py"` over the whole backend, excluding `photon_number`, returns **nothing**. `bb84/consumers.py:305` simply relays `A_PHOTONS` (and `A_BASES`/`B_BASES`/`A_CIPHER`/…) between the two clients. Eve's interception in multiplayer is therefore executed **in Alice's browser**.
- **There is a SECOND, duplicated Eve implementation:** `eveIntercept()`, a component-local function at `components/bb84/play-page/tabs/alice-exchange-tab.tsx:258-282`, called from `onSendPhotons` (`:154-157`) whenever `evePresent`. It runs for **multiplayer** (then `sendPhotons(photons)` → backend relay → Bob) **and** for solo-when-the-human-plays-Alice.
- **It carries the identical defect** at `alice-exchange-tab.tsx:276`: `const basis = bases[index]` instead of `eveBases[index]`. Confirmed by running a verbatim copy: fixed input `[1×8]` over 5 000 runs → output sets `{1,2} {3,4} {4} {4} {4} {4} {4} {4}` — byte-for-byte the same signature as `mimicEveIntercept`.

**⇒ Corrected blast radius: BOTH modes, all three player configurations.** `mimicEveIntercept` (`lib/bb84/solo-player.ts:89`) covers solo-as-Bob; `eveIntercept` (`alice-exchange-tab.tsx:276`) covers solo-as-Alice AND all of multiplayer. Every BB84 game with Eve present, in either mode, has ~50% error per sifted bit instead of the correct 25%.

**Root cause is duplication, not typing:** the physics was copy-pasted into a React component instead of imported from `lib/bb84/`, so the same bug shipped twice. `basis-tab.tsx:26` and `bob-exchange-tab.tsx:27` *import* `mimicEveIntercept` and never call it — dead imports that make the duplication look like reuse. **The fix must consolidate to ONE exported physics function in `lib/bb84/solo-player.ts` used by both call sites** — patching the two copies separately would preserve the exact condition that created the bug. This is a textbook case for the new architecture's "physics isolated in `lib/{protocol}`" rule (Task 47's "what the review found GOOD"), which this component silently violates.

#### H — Backend review notes (2026-07-20, read-only; `quantumcrypto-backend/bb84/`)
The backend's Eve role is narrow and, within that scope, sound:
- **Owns the coin flip only.** `consumers.py:175-181` draws `eve_present` per ROOM (inside the pairing loop, so each pair gets an independent draw), persists it via `create_room(...)`, and ships it to both partners in the `ROLES` message alongside `game_has_eve`. This is the multiplayer counterpart of BB84_EVE_PERCENTAGE (Task 51/ADR §12) — the frontend's solo model correctly mirrors it.
- **Owns the validation indices.** `consumers.py:336-340` — singleton per game group, `random.sample(range(key_length), validation_bits_length)`, so whichever player clicks Validate first fixes the indices for both. Correct and well commented.
- [ ] **P3 — `eve_percentage` is quantized to 1 decimal.** `consumers.py:178-181` wraps both weights in `round(x, 1)`, so 0.55 → weights `[0.6, 0.4]`. Harmless at the current 0.1-step UI (`BB84_EVE_PERCENTAGE_MIN = 0.1`), but it silently rounds any finer value; drop the `round()` or document the step.
- **Note for the E91/DPS arc:** this "backend = orchestration, frontend = physics" split is a real architectural fact to carry into the migration — it means protocol correctness is a FRONTEND responsibility in BB84 multiplayer, and `lib/bb84/` is the only correct home for it.

#### I — 🏛️ WHERE DOES PROTOCOL PHYSICS LIVE? (2026-07-20, open design question raised by Ibra)
**The question:** in multiplayer, who plays Eve — the backend (the "channel" device), Alice's device, or Bob's device? Verified survey of what the code does TODAY:

| Protocol | Multi physics runs in | Solo physics runs in | Implementations of the same physics |
|---|---|---|---|
| **BB84** | **Frontend** — Alice's browser (`alice-exchange-tab.tsx:258`), backend is a pure relay (verified: `grep photon` over the whole backend returns nothing) | Frontend (`lib/bb84/solo-player.ts`) | **2, both TypeScript** — and both carry the identical bug (A-bis) |
| **E91** | **Backend** — `e91/consumers.py:480` `generateEntangledBits`, `:508` `eveGeneratedBits`, called from the `A_MEASURE`/`B_MEASURE` handlers (`:337-364`) | Frontend (`lib/e91/solo-player.ts`) | **2, one TypeScript + one Python** |
| **DPS** | backend draws `eve_present` only; no physics found | — | — |

⇒ **The codebase already contains BOTH candidate answers, and BOTH have produced duplication.** BB84 duplicated within TypeScript (→ the Eve bug). E91 duplicated across languages — its TS docstring (`lib/e91/solo-player.ts:5`) openly states it "strictly follows the backend's simulation logic (consumers.py)", i.e. the two copies are kept in sync by human discipline alone. That is why E91's basis-2 bias (52-D) exists identically in Python and TypeScript.

**The real question is therefore not WHERE Eve runs, but HOW MANY implementations exist.** Solo can never use the backend (no game session, no round-trip), so solo physics is permanently frontend. Any design that puts multi physics in the backend *guarantees* two implementations in two languages. Only "frontend for both modes" yields one.

- [ ] **DECIDE (Ibra):** adopt **"the sender simulates the channel"** — the transmitting client applies the channel effects (Eve) before sending, so solo and multi share ONE `lib/{protocol}` implementation and the backend stays pure transport. Counter-argument to weigh: the backend already owns `eve_present` and feeds the results page, so a client that fails to apply Eve (bug/tamper/stale version) would make the results page report an Eve who never acted — server-authoritative physics cannot diverge that way. Whatever is chosen must be written into ADR §12, which currently documents `mimicEveIntercept` for solo and is **silent on who intercepts in multi**.
#### J — 📋 SLICE PLAN for the BB84 Eve fix (agreed with Ibra 2026-07-20; execute in order)

**Rule adopted:** ADR §13.3 "ONE implementation, the SENDER simulates the channel" — written 2026-07-20. Backend stays pure transport; solo and multi share one `lib/bb84/` function. Rejected alternative (backend-side Eve) and its cross-language-duplication cost are recorded in the ADR itself, not just here.

- [x] **Slice 0 — ARCHITECTURE (docs only). DONE 2026-07-20.** ADR **§13.3** added (the rule, the evidence table BB84-vs-E91, why not the backend, why not the receiver, the accepted cost, 5 standing rules, E91 grandfathered). ADR **§12** corrected — its BB84-multi row was silent on who intercepts; it now records that presence is drawn by the backend while the interception runs in Alice's browser, and that the BB84 backend performs no physics at all.
- [x] **Slice 1 — TESTS + FIX. ✅ DONE 2026-07-20 (not yet committed — awaiting Ibra's review).** TDD order executed and evidenced: the 5 new tests were run against the UNFIXED code and **all 5 failed**, while the 6 pre-existing tests passed — including the original domain test, which is the direct proof that shape-only testing could never catch this. Then `bases[index]` → `eveBases[index]` at `lib/bb84/solo-player.ts:89`; all 11 pass. Full gates: **68 tests green (5 files), `tsc --noEmit` clean, `next lint` clean.** Post-fix verification against Ibra's own browser repro: `alicePhotons` now varied (`3 3 1 2 3 1 3 2 1 1 2 1 4 4 4 1 3 2 3 1`) instead of `[1,3,4,4,4…]`; Bob typing `x` everywhere now yields a proper 0/1 mix instead of a wall of 1s. **Physics contract confirmed: error rate per sifted bit = 24.98% with Eve (textbook BB84 = 25%) and 0.00% without.** Original plan follows.
  - Fix: `lib/bb84/solo-player.ts:89` `bases[index]` → `eveBases[index]`.
  - Test 1 (**the one that would have caught it**) — physics invariant, deterministic via `vi.spyOn(Math,'random')`: force Eve's basis to `+` ⇒ every re-emitted photon must be a `+` photon (1 or 2); force `x` ⇒ every one must be an `x` photon (3 or 4). Today: FAILS.
  - Test 2 — exact arrays under the same mock. `Math.random()=0.4` (Eve always `+`, default measurement `'0'`): input `[1,2,3,4,1,2,3,4]` ⇒ **`[1,2,1,1,1,2,1,1]`** (today gives `[1,4,4,4,4,4,4,4]`). `Math.random()=0.6` (Eve always `x`, default `'1'`): same input ⇒ **`[4,4,3,4,4,4,3,4]`** (today gives `[2,4,4,4,4,4,4,4]`). Values computed and verified 2026-07-20.
  - Test 3 — no position may be constant: over many runs with a fixed input, **every** index must produce more than one distinct output. Today indices ≥2 yield only `{4}`.
  - Keep the existing length/domain test (it is not wrong, only insufficient).
- [x] **Slice 2 — CONSOLIDATE. ✅ DONE 2026-07-20 (committed).** Deleted the component-local `eveIntercept()` (was `alice-exchange-tab.tsx:259-283`); `onSendPhotons` now parses photons to numbers first, then `const sentPhotons = evePresent ? mimicEveIntercept(photons) : photons;` (shared fn). **This propagates the fix to solo-as-Alice AND all of multiplayer** — the two paths that Slice 1 did not reach. Behaviour-preserved except the intended fix: store still keeps Alice's ORIGINAL photons (`setAlicePhotons` before interception, unchanged), only the transmitted copy is Eve's. Also dissolved the **latent second defect** (old copy derived `eveBases` from `basisInputs` but measurements from `polarList` — the shared fn derives both from `photons`) and the string/number drift (`photon == '1'` → the lib fn's `photon == 1`, fed parsed numbers). Gates: 68 tests, tsc, lint all clean. Wiring sanity-checked by running the exact new parse-then-intercept expression (no position stuck on a constant; all photons in domain). First code conforming to ADR §13.3. **STILL PENDING: Ibra's two-browser multi verification** (normal + incognito, Alice+Bob, Eve on → Bob's `x`-everywhere column must be a mix, not a wall of 1s).
- [ ] **Slice 3 — CLEANUP.** Remove the dead `mimicEveIntercept` imports at `basis-tab.tsx:26` and `bob-exchange-tab.tsx:27` — never called, and they made the duplication *look* like reuse.
- **Slice 2.5 — EXTRACT `lib/bb84/protocol.ts` (the real repair, own arc — run AFTER 2 and 3).** Added 2026-07-20. **Full audit + target in [docs/protocol-physics.md](docs/protocol-physics.md) §3, §5.** The measurement + encoding rules were hand-written in multiple places; `solo-player.ts` was misnamed (held physics multiplayer needs but could never discover under a "solo" name — what *caused* the duplication). Building Eve *from* `encodePhoton` makes the whole bug class unrepresentable. Split into 3 sub-commits so behavior-change is isolated from refactor:
  - [x] **2.5a — extract primitives + rename, behavior-preserving. ✅ DONE 2026-07-22 (committed).** `git mv solo-player.ts → protocol.ts` (+ test). Added the two primitives `encodePhoton(bit,basis)→1-4` and `measurePhoton(photon,basis)→'0'/'1'` (single encoder / single measurer, with self-contained circuit docstrings — |0⟩|1⟩|+⟩|−⟩ ↔ 1/2/3/4, '+'=Z '/'x'=X — no cross-repo pointer). Rebuilt `simulateBobExchange`, `generateAlicePhotons`, and `mimicEveIntercept` FROM the primitives — Eve is now `encodePhoton(measurePhoton(p, b), b)`, so re-emitting in the wrong basis is inexpressible. Export NAMES kept stable (no `interceptResend`/`siftBits` rename — deferred, to keep this commit API-preserving and the diff small). Updated 3 import paths (`alice-exchange-tab`, `basis-tab`, `solo-round`). **Behavior-preserving proven by the existing 72 tests** (Slice 1 deterministic mocked arrays + Slice 4 seeded 25%-band all still green); tsc + lint clean. No component physics removed yet, so no browser check needed.
  - [x] **2.5b — dissolve the 2 inline component copies + conformance guard. ✅ DONE 2026-07-22 (committed).** `bob-exchange-tab.tsx` `measure()` → `measurePhoton(photon, basis)`; `alice-exchange-tab.tsx` `isValid(bit,basis,polar)` → `encodePhoton(bit,basis) === parseInt(polar)`. **After this, grep for the physics pattern returns ONLY protocol.ts.** Added the ADR §13.3 conformance guard (fs-scans `components/bb84/**`, fails if the measurement/encoding rule reappears inline) — **proven functional** (failed on an injected pattern AND on a briefly-reverted rewire). **Browser-verified by Ibra** (solo Bob, no Eve): all 20 photons encode correctly, sifted keys bit-for-bit identical (My bits == Other bits), sacrifice intact. NOTE: a stale `.next` dev cache threw a transient `solo-player.ts not found` after the `git mv` — resolved by dev-server restart, not a code issue (`tsc` clean proved all imports resolved).
  - [x] **2.5c — golden-path anchor test. ✅ DONE 2026-07-22 (committed).** Seed `Math.random` (mulberry32 0xB84), run the full protocol end to end, assert the EXACT key: clean channel → `aliceKey===bobKey==='101101010'`; with Eve → `'1110101010'` vs `'0100001110'` (4 of 10 sifted bits disturbed). Values computed offline from the same code+seed. **Suite: 75 tests / 5 files, tsc + lint clean.**
  - ✅ **Slice 2.5 COMPLETE.** Physics is now single-source-of-truth in `lib/bb84/protocol.ts`, built from `encodePhoton`/`measurePhoton` primitives (Eve = `encodePhoton(measurePhoton(p,b), b)` → the wrong-basis bug is inexpressible), and the conformance guard keeps it there. The whole Task 57 Eve arc (Slices 0,1,2,2.5,3,4) is done. **Deferred, not part of this:** the symmetric `lib/bb84/multi-round.ts` (multi orchestration is still inside the 1,585-line socket-provider — that's Task 40 Phase 5, the riskiest change; today's protocol.ts is a prerequisite that makes it cleaner). Optional follow-up: rename export `mimicEveIntercept`→`interceptResend` (deferred from 2.5a to keep the diff API-preserving).
  - **ORDERING DECIDED (Ibra, 2026-07-20): propagate the fix first (2 + 3), THEN this as its own arc.** Reasons: (1) **risk isolation** — the fix lands and pushes first, so if the refactor is reverted the physics stays correct; fixing *inside* the refactor means a revert resurrects the bug; (2) **never mix concerns** — a "refactor + behaviour change" commit is unreviewable, nobody can tell which line changed physics; (3) **Slice 2 shrinks this slice** — Eve exists twice today, once after Slice 2, and extracting from one implementation is strictly safer than extracting while two exist and could diverge mid-refactor; (4) the double-touch cost on `alice-exchange-tab.tsx` is **one import-path string**, mechanical.
- [x] **Slice 4 — AUTOMATED PHYSICS-CONTRACT SUITE. ✅ DONE 2026-07-22 (committed).** Added `describe('BB84 physics contract (end to end)')` to `lib/bb84/solo-player.test.ts` (4 tests, suite now 72 green). Pins protocol BEHAVIOUR, not shape — the class of test whose absence let the Eve bug live. Delivered: (a) **clean channel ⇒ identical sifted keys, zero errors** over 3000 games (deterministic by physics, no seed needed); (a) **Eve ⇒ ~25% sifted-bit disturbance** — full pipeline over 8000 games under a **seeded mulberry32 PRNG** (deterministic in CI, no flakiness); verified robust: test seed lands 0.2483, and 10 independent seeds span 0.2472–0.2529, all ~20σ inside the 0.22–0.28 band; (b) **`simulateBobExchange` matching-basis determinism** via pinned `Math.random` (+ photons→exact bits, x photons→exact bits); (c) **`getValidBits` order-preserving matching-position invariant**. Gates: 72 tests, tsc, lint clean. Feeds `docs/testing-strategy.md` phase 2.
  - **(d) DEFERRED to Slice 2.5 by design** (the ADR §13.3 conformance guard — "no component re-implements physics"). It **cannot pass on current code**: `bob-exchange-tab.tsx:166` still has the measurement rule inline and `alice-exchange-tab.tsx:203` still has the encoding truth-table (`isValid`). Writing the guard now would be a knowingly-red test — a CI violation. It belongs in the SAME commit as the extraction that makes it green (Slice 2.5), where it becomes the regression lock that keeps physics out of components forever.
- [x] **VERIFY after Slice 2 (browser, Ibra's own repro). ✅ DONE 2026-07-22 — all three paths confirmed in the running app.**
  - **Solo-as-Bob**: `alicePhotons` varied (e.g. `[4,4,1,1,3,2,3,2,3,4]`), no constant tail. ✓
  - **Solo-as-Alice**: sifted-key comparison showed a real mismatch (`My bits [1,1,1,1]` vs `Other bits [1,1,0,1]` — 1 of 4 differ = the textbook 25% disturbance). ✓
  - **Multiplayer (two browsers, Alice+Bob, Eve on)**: full protocol completed end-to-end through the backend relay (`A_PHOTONS`→`B_BASES`→`A_BASES`→`B_KEY`/`A_KEY`→`A_VALIDATED`→`A_CIPHER`→`B_SUCCESS`); `gameHasEve:true, evePresent:true`, 3 validation indices. **Decisive check:** Alice's stored `alicePhotons = [2,4,3,1,3,1,2,1,2,2,4,4,4,1,4,2]` was re-derived by hand from her `aliceBits`+`aliceBases` and **all 16 match the ORIGINAL encoding** — confirming Slice 2 preserved store semantics (the store keeps Alice's real photons; only the copy sent to Bob is Eve's). ✓
  - **Probabilistic detection confirmed working the RIGHT way:** across these runs Eve was present but `eveUndetected:true` (she slipped validation). That is now CORRECT — with 1–3 validation bits her miss rate is 75%…42% (`(3/4)^v`); pre-fix she was over-caught. Solo-as-Alice separately showed her being caught. Both branches fire.
  - **NOT-yet-seen (low priority):** a multiplayer run where Eve IS caught — purely probabilistic, will appear with more runs or more validation bits. Optional.

- [ ] **P3 — latent bug in the E91 Python twin:** `e91/consumers.py:508` `eveGeneratedBits` has **no `else` fallback** for an unexpected basis (the TS version has `outcome = 1` at `solo-player.ts:281`). On an unknown basis Python leaves `outcome` unbound → `UnboundLocalError` on the first iteration, or **silently reuses the previous photon's outcome** on later iterations. Unreachable today (bases are constrained to 1-4) but it is a real divergence between the two "synchronized" copies.

#### K — 🔗 External Qiskit BB84 reference: an oracle + educational source (found 2026-07-22)
A standalone real-quantum-circuit (Qiskit) BB84 challenge by the same author lives OUTSIDE this repo at
`../hackathons/Sherhack/2026/side_quests/quantum_crypto_BB84_challenge/` (key files:
`bb84_challenge_solution_good.py`, `encryption_algorithms.py`, `tutorials/tutorial_EN.md`). Read 2026-07-22.
It **independently confirms** our work: its `eve_intercept_qubits` re-emits in the basis Eve measured in
(`eve_bases[i]`) — exactly the `eveBases[index]` fix (Task 57 A) — and its `reveal_key_subset(0.2)` +
`remove_revealed_key` mirrors the key-sacrifice of Task 53. Encoding bridge: reference base '0'=Z / '1'=X,
states |0⟩|1⟩|+⟩|−⟩; our photons 1/2/3/4 = |0⟩/|1⟩/|+⟩/|−⟩, our '+'=Z / 'x'=X. Ibra also has E91 and DPS
equivalents. Two tracked follow-ups (both DECIDED "track only, do not build now" — Ibra 2026-07-22):

- [ ] **K1 — Qiskit cross-check test (oracle).** A test asserting `mimicEveIntercept`'s disturbance
  statistics match the reference's correct intercept-resend (~25% per sifted bit end-to-end). Belt-and-
  suspenders: the fix is already confirmed 4 ways (reasoning, sim, browser, this reference) + Slice 4's
  contracts. **Best built WITH/AFTER Slice 2.5** (against the extracted `lib/bb84/protocol.ts`), not before.
- [ ] **K2 — mine the tutorials for in-app educational content.** TWO distinct scopes, do not conflate:
  - **Scope A (small, aligned):** short explanatory NOTES beside simulations — the E91 CHSH "concept, not
    statistics" note (→ finding 52-C) and the TEST_MODE photon-count tradeoff note (→ Task 57). The
    tutorials are ready-made source text; E91/DPS versions exist too. Low risk, closes pedagogy gaps we
    already found.
  - **Scope B (big, UNDECIDED — needs a product discussion first):** porting the FULL tutorials (qubit /
    superposition / Z-X bases / no-cloning, with Bloch spheres + LaTeX) as tutorial pages × 3 protocols
    × 3 languages. Overlaps the existing `component.*.about.part*` content (210 keys in
    `lang/quantumcrypto-lines.ts`, rendered by the monster pages `bb84_card` 1175 / `dps` 953 / `e91`
    581 lines). Leans the app toward "course/lab" — the identity debate in
    `docs/product-vision-game-experience.md` is unresolved, so this is a strategy call, NOT a slice.
  - **NOTE — the empty `content/{lang}/*.md` are INTENTIONAL placeholders, do NOT delete as clutter**
    (Ibra, 2026-07-22): the original plan was to move the localized protocol text OUT of the dictionary
    (`lang/quantumcrypto-lines.ts` `component.*.about.part*`, 210 keys) INTO per-language markdown
    (`content/en/bb84.md`, `fr`, `es`, …), so the app reads educational text straight from markdown
    instead of the TS dictionary. Never executed — the dictionary works fine today and the migration is
    deferred (future = undecided). So the stubs are a parked idea, not dead files. If Scope B (or any
    content-source refactor) is ever taken up, this is the pre-existing plan to weigh: markdown-source vs
    keep the lang-keys. Guard: any "root-level clutter"/cleanup pass (Task 47 P3) must NOT sweep these away.

---

### 58. 🚀 Deployment readiness (opened 2026-08-27)

**Status**: 🟡 IN PROGRESS — the path to getting a correct build in front of students.
**Why now**: production has not been deployed since **2026-06-22** — *before* PR #22 (17 July).
So production has **none** of the architecture work, **none** of the Eve fix, and still ships
`TEST_MODE = true`. Students today are playing the broken Eve with test-mode photon counts.

**The path, in order:**

- [x] **1. `DEPLOYMENT_GUIDE.md` → private repo. ✅ DONE 2026-08-27.** It was untracked on one
  laptop only (gitignored in both repos) — it could be lost and teammates could not find it. Now
  **tracked in `cryptoweb-2.0-frontend`** (private, commit `3cee2ca` there) and deleted from this
  public repo (`45f6fac`); `.gitignore` keeps a pointer comment. Verified it was committed there
  *before* deleting here. rsync will not clobber it — the file no longer exists in the source, and
  rsync without `--delete` leaves destination-only files alone.
- [x] **2. Public deploy docs + a real bug fix. ✅ DONE 2026-08-27** (`727c978`, `+ README rewrite`).
  **BUG:** the README told readers to set `NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000` — missing
  the `/ws` prefix the backend routes on (`bb84/routing.py:8`), so anyone following it got silently
  broken multiplayer. Fixed. Added a "Deploying" section (build/start, Node 18.17+, any Next.js
  host, `NEXT_PUBLIC_*` baked in at build time) and a "Running the full stack" section (backend
  pointer → `.env.local` → `npm run dev`, plus the two-browser rule for testing multi).
  *Originally planned as a separate `DEPLOYING.md`; dropped because the README already covered
  clone/install/env — a second file would have duplicated it and drifted.*
- [ ] **3. TEST_MODE — the actual deploy blocker.** Design agreed in **Task 57**, **zero code
  written**. Verified 2026-08-27: all three `*_TEST_MODE = true` still, no `QC_TEST_MODE` anywhere.
  **Everything below is decided — next session is execution, no design thinking needed.**

  **⚠️ It grew: this is not just a flag, it is the whole env-file convention.** The convention was
  half-built and lost (`.env.sample` exists in the deploy repo only, with empty values), so today
  `.env.local` is **git-TRACKED in BOTH repos** with `localhost` URLs. That is why cloning "just
  works" — and also why localhost ships to production. The env convention is the *prerequisite*
  for the flag to be safe.

  **THE MECHANISM (clarified 2026-08-27 — an earlier explanation over-credited `NODE_ENV`):**
  the switch is a **FILE, not a command**. `npm run dev` / `npm run build` are both used on laptops
  AND servers, so the command can never be the mechanism. Test mode is on only if
  `NEXT_PUBLIC_QC_TEST_MODE=true` exists in a `.env.local` — a file that lives **only on developer
  machines**. **Absence = production.** `NODE_ENV` and the build guard are second/third nets for
  the case where that file leaks to a server (which rsync was literally doing).

  **THE TARGET CONVENTION:**

  | File | Tracked? | Who uses it |
  |---|---|---|
  | `.env.example` | ✅ yes | the template — documents every var incl. the commented test flag |
  | `.env.local` | ❌ **gitignored** | each developer's own copy |
  | host env config | — | production (Amplify console, private server, Vercel…) |

  **MIGRATION STEPS (safe — `--cached` keeps local files on disk, nothing breaks):**
  1. create `.env.example` (tracked): the two URLs with dev defaults + a **commented**
     `# NEXT_PUBLIC_QC_TEST_MODE=true` with a "DEV ONLY, never in production" note
  2. `.gitignore`: add `.env.local` and `.env*.local` (today it only ignores `.env`)
  3. `git rm --cached .env.local` — untracks, **keeps the file on disk**
  4. README: `cp .env.example .env.local`, **plus how a colleague turns test mode on/off**
     (uncomment one line in their own file — affects only them, cannot leak)
  5. rsync command in the private `DEPLOYMENT_GUIDE.md`: add `--exclude='.env*'`
  6. **deploy repo: `git rm --cached .env.local` there too** — see landmine below

  **🚨 LANDMINE (found 2026-08-27):** `cryptoweb-2.0-frontend/.env.local` is **tracked and pushed**,
  containing `http://localhost:8000`. Production builds from that repo. It only works today because
  Amplify's console env vars override `.env` files (env vars already in `process.env` win — verified
  in `@next/env`). That is luck, not design, and `NEXT_PUBLIC_*` are frozen into the client bundle
  at build time. Untrack it.

  **SUB-ITEMS:**
  - **(A)** shared `QC_TEST_MODE` module, safe-by-absence:
    `process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_QC_TEST_MODE === 'true'`
  - **(B)** `next.config.js` phase guard — **the real lock**: during `PHASE_PRODUCTION_BUILD`,
    **throw** if test mode would be live. Needed because `next build` only *defaults* `NODE_ENV`
    (`node_modules/next/dist/bin/next:60`), it does not force it. Build fails loudly in the Amplify
    log instead of silently shipping test values.
  - **(C)** `.env*` → rsync excludes **+ untrack in both repos** (see migration 2/3/5/6). **Upgraded
    to urgent** by the landmine above.
  - **(D)** CI test: a production build ⇒ production values.
  - **(E)** BB84 copy hardcodes "16/10" in 3 languages (`lang/quantumcrypto-lines.ts:46,548,1112`)
    → interpolate like E91 already does.
  - **(F)** remove the dead `BB84_TEST_MODE` import (`solo-game-modal.tsx:35` — comments only).
  - **(G) DECIDED (Ibra, 2026-08-27):** DPS keeps `4 / 20 / 6` as production values **but must gain
    the same two-value shape** as BB84/E91 — e.g. `DPS_SOLO_PHOTON_MIN = QC_TEST_MODE ? 4 : 4`.
    Same numbers today, but standard structure, so changing one later is a one-line edit. This also
    kills the currently-dead `DPS_TEST_MODE` (declared, never read).
  - **(H) NEW:** add **`amplify.yml`** to the deploy repo. There is none — the build steps live only
    in the AWS console, invisible, unversioned, and changeable by anyone with console access. We
    cannot currently *prove* Amplify runs `npm run build`.

  **📋 SLICE PLAN (agreed with Ibra 2026-08-28 — execute in order, one at a time).** This is TWO
  concerns, not one, so per CLAUDE.md rule 2 it does not ship as a single commit: the env-file
  convention is config hygiene, the flag is a behaviour change. Splitting them means a bug is
  never ambiguous. Order matters — the flag *reads from* the `.env.local` that slice 1 establishes.

  - [x] **SLICE 1 — env convention. ✅ DONE 2026-08-28.** Frontend `e43bd5f`, deploy repo `eb483ba`
    (deploy repo commit **NOT pushed** — see the Amplify check below). Created `.env.example`
    (tracked, both URLs with working local defaults + why `/ws` is required); `.gitignore` now
    ignores `.env.local` and `.env*.local` in **both** repos; `git rm --cached .env.local` in both
    — **verified the file is still on disk and now reports as ignored**, so nobody's local setup
    breaks; README step 2 is now `cp .env.example .env.local`, and the Deploying section names the
    two variables explicitly (its "the two variables above" no longer pointed at anything);
    `DEPLOYMENT_GUIDE.md` rsync gained `--exclude='.env*'`. Gates: 75 tests, tsc, lint green.
    **Scope refinement:** `.env.example` deliberately does NOT yet document
    `NEXT_PUBLIC_QC_TEST_MODE` — that flag does not exist until slice 2, and documenting a
    variable that does nothing would mislead. It ships with the flag.
    **⚠️ BEFORE PUSHING THE DEPLOY REPO:** confirm `NEXT_PUBLIC_API_URL` and
    `NEXT_PUBLIC_WEBSOCKET_URL` are set in the **Amplify console**. They must be (production works
    today), but this commit removes the accidental `.env.local` fallback, and pushing that branch
    triggers an Amplify build.
    ~~Original plan:~~
    *Frontend:* create `.env.example` (tracked, dev defaults + commented `NEXT_PUBLIC_QC_TEST_MODE`);
    `.gitignore` add `.env.local` + `.env*.local`; `git rm --cached .env.local` (keeps the file on
    disk); README — `cp .env.example .env.local` **and how a colleague turns test mode on for
    themselves**. *Private deploy repo:* add `--exclude='.env*'` to the rsync command in
    `DEPLOYMENT_GUIDE.md`, and `git rm --cached .env.local` there (the localhost landmine).
    Gates only — no browser check needed.
  - [ ] **SLICE 2 — the `QC_TEST_MODE` flag. ⚠️ BEHAVIOUR CHANGE → Ibra's browser check before
    commit.** Covers sub-items **A** (shared module), **F** (delete the dead `BB84_TEST_MODE`
    import), **G** (DPS gains the two-value shape, same numbers). Rewires all three constants files.
    **⚠️ REMIND IBRA WHEN WE GET HERE:** after this lands, `npm run dev` yields **production**
    values by default (10 photons, not 4). To get test mode back he must uncomment
    `NEXT_PUBLIC_QC_TEST_MODE=true` in his own `.env.local`. That is the intended design, but it
    will feel different — say it *before* he opens the browser and wonders why the numbers moved.
  - [ ] **SLICE 3 — safety nets. No behaviour change.** Sub-items **B** (`next.config.js`
    `PHASE_PRODUCTION_BUILD` guard that throws if test mode would be live) and **D** (CI test:
    production build ⇒ production values).
  - [ ] **SLICE 4 — BB84 copy (sub-item E).** Interpolate the hardcoded "16/10" in 3 languages
    (`lang/quantumcrypto-lines.ts:46,548,1112`) like E91 already does. Visible text → eyeball it.
  - [ ] **SLICE 5 — `amplify.yml` (sub-item H).** Private deploy repo. Versions the build steps
    that currently live only in the AWS console.

  **❌ CONSIDERED AND REJECTED — env schema validation (zod/envalid), 2026-08-27.** Do not
  re-propose. It was suggested as a "senior team" upgrade and the justification was **wrong**:
  it would NOT have caught the `/ws` bug we hit that day, because `ws://localhost:8000` and
  `ws://localhost:8000/ws` are *both* valid URLs — the value was semantically wrong, not malformed.
  Schema validation catches missing/malformed vars only. With **2 public `NEXT_PUBLIC_*` vars**
  (no secrets), a missing one already fails loudly (`undefined/record_game_statistic`). Verdict:
  ceremony, not safety. Revisit only if the app grows real secrets or many more variables.

  **SCOPE:** A–D are one shared module, so doing BB84 alone costs the same as all three — do all
  three. Only **E** (BB84 copy) is protocol-specific. Deploying with only BB84 fixed would still
  ship test values for E91 and DPS.
- [ ] **4. Merge `ibra_architecture` → `development`.** 17 commits ahead, **0 behind**, 75 tests +
  tsc + lint green, BB84 flows browser-verified. Clean fast-forward.
- [ ] **5. Deploy** (rsync → `cryptoweb-2.0-frontend` → Amplify), then re-verify in production.

**⚠️ Pushing `quantumcrypto--prod` triggers an AWS Amplify build.** The 2026-08-27 push of the
guide did fire one; harmless, since only `.gitignore` and a `.md` changed (no app code).

**Side findings while doing #2 (backend repo, committed there as `da12f1e`):** backend README had
Redis listed *after* `runserver` (Channels needs it first); nothing documented what the frontend
should point at; and `settings.py`'s `## Using this method.` comment sat above the **commented-out**
InMemory channel layer while local Redis was the active one — actively misleading. All corrected.
**docker-compose is broken** (Redis at `127.0.0.1` unreachable from inside the Django container —
needs a `REDIS_HOST` env var); root cause + fix recorded in the **backend** `task_todo.md`, marked
not urgent since nobody uses that path.

---

### 🎨 UI WORDING NOTE: One Vocabulary Across the App

**Decision (Ibra, 2026-07-16):** when a concept already has a word somewhere in the app,
REUSE it (ideally reuse the same localization key) instead of inventing a friendlier
synonym per screen. Case that set the rule: the solo results' rounds column — candidates
"Manches/Essais/Attempts" were considered, but the multiplayer results table already says
**"Itération / Iteration / Iteración"** (`component.results.iteration`), so the solo table
reuses that key. Consistency beats cleverness; a student who sees two words for the same
thing assumes two different things. If a word is ever deemed unfriendly for the
high-school audience, change it ONCE at the shared key — never fork it per screen.

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

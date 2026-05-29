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
**Priority**: 🟡 MEDIUM  
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
| **BB84** | `components/bb84/play-page/multi-game.tsx` | ✅ `hydrateBB84ProgressStore()` | Manual inline reads for step/tab/lines; restores local room snapshot and reconnects. Needs strategy cleanup and `playingMultiplayer` check. |
| **E91** | `components/e91/play-page/multi-game.tsx` | ✅ `hydrateE91ProgressStore()` | Manual reads only inside `playingMultiplayer && !isPlayRoomConnected` branch. |
| **DPS** | `components/dps/play-page/multi-game.tsx` | ✅ `hydrateDPSProgressStore()` | **No restoration at all** — needs `hasInitialized` ref, room restore, step/tab/lines reads. |

**What to do**:

#### Sub-task A: BB84 (Clarify and harden current frontend recovery)
- [ ] Confirm/set `playingMultiplayer: true` for BB84 when roles are assigned so refresh enters the multiplayer recovery branch.
- [ ] Replace manual `bb84Step`/`bb84Tab`/`bb84DisplayedLines` reads in `components/bb84/play-page/multi-game.tsx` with `hydrateBB84ProgressStore()`.
- [ ] Keep `restoreGame(gameData)` and config restores (`photonNumber`, `gameHasEve`, `validationBitsLength`) as the current local fallback until backend snapshots exist.
- [ ] Keep the `hasInitialized` ref since it guards all mount-time recovery operations.
- [ ] Document the backend requirement: on reconnect, BB84 should eventually receive a room snapshot or ordered event history instead of trusting only `localStorage`.

#### Sub-task B: E91 (Dedup & clean up)
- [ ] Replace manual `e91Step`/`e91Tab`/`e91DisplayedLines` reads in `components/e91/play-page/multi-game.tsx` with `hydrateE91ProgressStore()`

#### Sub-task C: DPS (Net-new restore logic for multiplayer — needs testing)
- [ ] Add `hasInitialized` ref to `components/dps/play-page/multi-game.tsx`
- [ ] Add `restoreGame(gameData)` call for `dpsGameData`
- [ ] Call `hydrateDPSProgressStore()` for step/tab/lines
- [ ] Add config restoration for `dpsPhotonNumber`, `dpsGameHasEve`
- [ ] **Test carefully**: This changes observable behaviour — DPS multiplayer will start restoring state on refresh.

**Estimated Time**: ~45 min

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

### 🧪 LOCAL TESTING NOTE: Same-Browser Tab Collision

**Not a code bug** — this is a testing methodology issue.

All Chrome tabs on the same origin share the exact same `localStorage`. The Zustand persist store (`player-storage`) writes `playerRole`, `playerId`, `playingSolo`, etc. When 3 tabs (Master, Alice, Bob) all write to the same key, they overwrite each other's state.

**Proper local multiplayer testing**:
- Tab 1: Normal Chrome window (Master)
- Tab 2: Chrome Incognito window (Alice) — separate localStorage
- Tab 3: Firefox or Safari (Bob) — separate localStorage

This is expected browser behavior, not a bug to fix.

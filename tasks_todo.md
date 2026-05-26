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

### 24. 🟡 Wire `hydrateFromStorage()` in Game Containers (BB84 / E91 / DPS)

**Status**: 🟡 TODO  
**Date Added**: May 26, 2026  
**Priority**: 🟡 MEDIUM  
**Context**: Solo mode restoration works fine (handles its own store hydration). Multiplayer modes run through the `multi-game.tsx` (E91 / DPS) and `game.tsx` (BB84) containers, which either duplicate hydration logic manually or skip it entirely.

**Current State per Protocol**:

| Protocol | Component File | Hydration function exported? | game.tsx/multi-game.tsx restoration |
|----------|----------------|------------------------------|-------------------------------------|
| **BB84** | `components/bb84/play-page/game.tsx` (Shared) | ✅ `hydrateBB84ProgressStore()` | Manual inline reads for step/tab/lines (duplicated logic) |
| **E91** | `components/e91/play-page/multi-game.tsx` | ✅ `hydrateE91ProgressStore()` | Manual reads only inside `playingMultiplayer && !isPlayRoomConnected` branch. |
| **DPS** | `components/dps/play-page/multi-game.tsx` | ✅ `hydrateDPSProgressStore()` | **No restoration at all** — needs `hasInitialized` ref, room restore, step/tab/lines reads. |

**What to do**:

#### Sub-task A: BB84 (Safe dedup — identical behaviour)
- [ ] Replace manual `bb84Step`/`bb84Tab`/`bb84DisplayedLines` reads in `components/bb84/play-page/game.tsx` (lines ~74-111) with `hydrateBB84ProgressStore()`
- [ ] Keep `restoreGame(gameData)` and config restores (`photonNumber`, `gameHasEve`, `validationBitsLength`) as-is — they belong to different stores
- [ ] The `hasInitialized` ref stays since it guards all operations

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

### 25. 🟢 Architecture: Split BB84 `game.tsx` into `solo-game.tsx` and `multi-game.tsx`

**Status**: 🟢 FUTURE TODO  
**Date Added**: May 26, 2026  
**Priority**: 🟢 LOW (For Code Cleanliness)

**Context**: In E91 and DPS, solo and multiplayer games are split into separate components (`solo-game.tsx` vs `multi-game.tsx`), keeping their concerns and lifecycles decoupled. In BB84, they are combined in `components/bb84/play-page/game.tsx`.

**Task**:
- [ ] Extract the solo play code from `components/bb84/play-page/game.tsx` into a new `components/bb84/play-page/solo-game.tsx` file.
- [ ] Rename the multiplayer-only container to `components/bb84/play-page/multi-game.tsx`.
- [ ] Update `app/(main)/bb84/play/page.tsx` to route between them based on `playingSolo`.
- [ ] Remove `playingSolo` checking complexity from BB84's tabs.

**Estimated Time**: ~1.5 hours

---

### 🧪 LOCAL TESTING NOTE: Same-Browser Tab Collision

**Not a code bug** — this is a testing methodology issue.

All Chrome tabs on the same origin share the exact same `localStorage`. The Zustand persist store (`player-storage`) writes `playerRole`, `playerId`, `playingSolo`, etc. When 3 tabs (Master, Alice, Bob) all write to the same key, they overwrite each other's state.

**Proper local multiplayer testing**:
- Tab 1: Normal Chrome window (Master)
- Tab 2: Chrome Incognito window (Alice) — separate localStorage
- Tab 3: Firefox or Safari (Bob) — separate localStorage

This is expected browser behavior, not a bug to fix.

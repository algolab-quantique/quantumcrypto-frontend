
# E91 Solo Mode - Complete Issue Tracker & Plan

---

## 🎨 UI REDESIGN (January 2026)

**Status**: ✅ DONE  
**Date Added**: January 29, 2026  
**Last Updated**: March 4, 2026  
**Priority**: 🟠 HIGH

### Overview
Redesign website based on colleague's Canva mockup. New design includes:
- ~~Updated landing page with new navigation~~ ✅ DONE
- ~~Protocol pages with left sidebar navigation~~ ✅ DONE
- Video tutorials integration
- ~~Lexique/Glossary sections~~ ✅ DONE (Guide page with terminology)

### Phases

| Phase       | Scope                                               | Estimated Time | Status                               |
| ----------- | --------------------------------------------------- | -------------- | ------------------------------------ |
| **Phase 1** | Header Navigation (Protocoles \| Guide \| À propos) | 2-3 hours      | ✅ DONE                               |
| **Phase 2** | Sticky Protocol Page Sidebar (BB84, E91, DPS)       | 2-3 hours      | ✅ DONE                               |
| **Phase 3** | Guide Page (How to Play, Terminology, Context)      | 2-3 hours      | ✅ DONE (Context section placeholder) |
| **Phase 4** | Video Tutorials Integration                         | TBD            | ⬜ TODO                               |
| **Phase 5** | Landing Page Visual Redesign (per Canva mockup)     | TBD            | ✅ DONE (V2)                          |
| **Phase 6** | **V3 Futuristic Experience (Atmosphere/Premium)**   | **TBD**        | ✅ DONE (Integrated)                  |
| **Phase 7** | Shared How-to-Play Component (BB84/E91/DPS)         | 1 hour         | ✅ DONE                               |
| **Phase 8** | Card UX Comparison Page (`/bb84_card`)              | 3-4 hours      | ✅ DONE (7 options, awaiting choice)  |

### Approach
**Modify existing pages** (not create new ones) - current structure is modular and supports gradual changes. 
*Experimental V3 work is happening at `/landingpagegame_progress_futur`.*

### New Components Needed
- [x] `ProtocolPageSidebar.tsx` - Sticky left navigation ✅ Created
- [x] `GuideNavigationMenu.tsx` - Guide dropdown in header ✅ Created
- [ ] `VideoEmbed.tsx` - YouTube embed component
- [x] Guide page with glossary/terminology ✅ Created
- [ ] `SectionCard.tsx` - Reusable card wrapper

### Implementation Order
```
✅ Header navigation: Protocoles | Guide | À propos (all pages)
✅ ProtocolPageSidebar on BB84, E91, DPS pages
✅ Guide page with How to Play, Terminology, Context
✅ Mobile sidebar mirrors desktop navigation
✅ Localization (EN/FR/ES) for all new components
□ Video tutorials integration
✅ Landing page visual redesign (V2)
✅ **V3 Experimental: Atmospheric Background (Noise/Particles)**
✅ **V3 Experimental: Hero CTA & Narrative Glow**
✅ **V3 Experimental: Premium Glassmorphism & Live Pulse**
✅ **V3 Experimental: Thematic Section Dividers**
✅ Shared How-to-Play component (replaces 3 per-protocol copies)
✅ BB84 Card UX comparison page with 7 interactive options
□ Video tutorials integration
□ Guide > Context section (currently placeholder)
```

---

### 🏛️ V3 DESIGN RATIONALE (Why we did what we did)

To ensure future developers understand the evolution of the V3 landing page, here is the rationale:

#### 1. "V2-Exact" Marriage
**Problem**: Pure glassmorphism and experimental layouts were causing readability issues and stretching on varied screens.
**Solution**: We reverted to the **exact V2 code architecture** (fixed widths, flex-centering, defined borders) but decorated it with V3's depth. This gives us V2's robust "bedrock" with V3's "premium paint."

#### 2. "Bright Heart" Quantum Photons
**Problem**: Initial particles were too subtle and looked like random noise.
**Solution**: Each photon now has a **brilliant white center (Bright Core)** that fades into green glow. This makes them look like actual concentrated quantum energy (Heart-of-Red/White) rather than static dots.

#### 3. Intelligent "Safe Zones"
**Problem**: Background movement can distract from the main message (text).
**Solution**: The particle engine avoids the central 40% of the screen. Energy flows around the Alice/Bob mascots and the sides of the text, keeping the **Hero message 100% readable**.

#### 4. The "Laser Line" Snap
**Hover Feel**: We prioritised an instant transition from neutral grey to primary green with a **30px wide glow**. This provides immediate feedback and feels "sharp" and "fast," like a quantum transition.

---

### 🧭 NAVIGATION & UX PRINCIPLES (Why we organized it this way)

A key part of the V3 update was refining how users move through the application. Here is why we chose this specific structure over other "flat" menus:

#### 1. Top Menu: "Global Context" (Reducing Cognitive Load)
**Decision**: Group items into dropdowns (Protocoles -> BB84/E91/DPS, Guide -> How to Play/Lexique) instead of listing everything.
**Why?**:
*   **Hick’s Law**: The time it takes to make a decision increases with the number and complexity of choices. By grouping, we simplify the initial choice to just 3 things: "Do I want to *Do* (Protocols), *Learn* (Guide), or *Know* (About)?"
*   **Universal Access**: If a user is deep in the BB84 tutorial and wants to switch to E91, the **Protocol Dropdown** allows a direct jump. If we didn't have this, they would have to go Home -> Select E91 (2 clicks vs 1).

#### 2. Side Menu: "Local Context" (Deep Focus)
**Decision**: The left sidebar is **Context-Aware**. It *only* shows sections relevant to the page you are on (e.g., on BB84 page: Intro -> Game -> Review).
**Why?**:
*   **Tunnel Vision for Learning**: When learning a complex topic like Quantum Cryptography, we don't want to distract the user with "Guide" or "About" links on the side.
*   **Progress Tracking**: It acts as a "Table of Contents" for the specific mission, helping the user know exactly how much playspace is left.
*   **Standard Pattern**: This follows the **Documentation/Courseware Pattern** (used by Vercel, Stripe, Coursera) where Top = App Navigation, Left = Chapter Navigation.

#### 3. Separation of Concerns
*   **Top Bar**: "Where am I in the **Application**?" (Global State)
*   **Side Bar**: "Where am I in the **Lesson**?" (Local State)
*   by separating these, we prevent the "Context Confusion" you mentioned, where a user might think "Context" applies to the whole app when it might just be for the protocol.

---

## 📦 Next.js Version Documentation

### Current Version Status (December 2025)

| Environment                  | Version    | Status                                |
| ---------------------------- | ---------- | ------------------------------------- |
| **Local (ibra_development)** | `14.2.33`  | ✅ Safe (Updated Dec 11, 2025)         |
| **Production (AWS)**         | `Outdated` | ⚠️ Needs Update (See AWS Upgrade Plan) |

### CVE-2025-66478 Security Vulnerability

**What is it?** A critical Remote Code Execution (RCE) vulnerability in React Server Components (RSC) protocol, rated CVSS 10.0.

**Are we affected?** ❌ **NO, we are NOT affected.**

According to the [official Next.js advisory](https://nextjs.org/blog/CVE-2025-66478):
> "Next.js 13.x, **Next.js 14.x stable**, Pages Router applications, and the Edge Runtime are **not affected**."

**Affected versions:**
- Next.js 15.x ❌
- Next.js 16.x ❌
- Next.js 14.3.0-canary.77+ (canary only) ❌

**Safe versions:**
- Next.js 14.x stable ✅ (We use `14.2.33`)
- Next.js 13.x stable ✅

### Why We Stay on Next.js 14.x

1. **Security**: Version 14.2.32 is NOT affected by CVE-2025-66478
2. **Stability**: No breaking changes, all current code works perfectly
3. **Risk-free**: Upgrading to 15.x or 16.x requires significant testing and possible code changes

### Future Upgrade Path (Not Urgent)

When ready to upgrade to Next.js 15.x or 16.x in the future:
- Requires thorough testing of all features
- May require code changes (React 19 compatibility, App Router updates, middleware changes)
- Plan dedicated time for testing and fixing breaking changes
- Use patched versions: `15.5.7+`, `16.0.7+`

### ✅ Minor Update Applied (December 11, 2025)

Updated from `14.2.32` to `14.2.33`:
```bash
npm install next@14.2.33
```
This was a minor patch with no breaking changes.

---

## 🚀 AWS Production Upgrade Plan

### Current Situation
- **Local**: `14.2.33` ✅
- **AWS Production (Amplify)**: `Outdated version` ⚠️

### ⚡ Deploy to AWS Amplify (When Ready)

Since we use **AWS Amplify**, deployment is automatic:

1. **Merge to production branch**
   ```bash
   # From local, merge ibra_development → main (or your production branch)
   git checkout main
   git merge ibra_development
   git push origin main
   ```

2. **Amplify automatically:**
   - Detects the push
   - Runs `npm install` (installs Next.js 14.2.33 from package.json)
   - Runs `npm run build`
   - Deploys the new version

3. **Monitor deployment** in AWS Amplify Console

> **No manual SSH or server commands needed!** Amplify handles everything.

### Pre-Deployment Checklist

1. **Verify Local Build**
   ```bash
   npm run build
   npm run start
   # Test all protocols: BB84, DPS, E91
   ```

2. **Test All Game Modes**
   - [ ] BB84 Solo Mode
   - [ ] BB84 Multiplayer Mode
   - [ ] DPS Solo Mode
   - [ ] DPS Multiplayer Mode
   - [ ] E91 Solo Mode
   - [ ] E91 Multiplayer Mode

3. **Git Commit & Push** (already done ✅)
   ```bash
   git add package.json package-lock.json
   git commit -m "chore: Update Next.js to 14.2.33 (security patch)"
   git push origin ibra_development
   ```

### Post-Deployment Verification

1. **Check Amplify Console**
   - Verify build succeeded
   - Check build logs for any errors

2. **Smoke Test**
   - [ ] Home page loads
   - [ ] BB84 protocol accessible
   - [ ] E91 solo game works
   - [ ] WebSocket connection established

### Rollback Plan

If issues occur after deployment:
```bash
# Revert to previous version locally
git revert HEAD
git push origin main
# Amplify will automatically redeploy the reverted version
```

### Contact Information

For AWS deployment assistance, contact:
- DevOps Team / Infrastructure Team
- Check AWS deployment documentation in team wiki

---

## 🚨 CRITICAL PRIORITY

### 1. ~~⚠️ Next.js Security Vulnerability~~
**Status**: ✅ RESOLVED - UPDATED TO 14.2.33  
**Our Version**: `14.2.33` (latest stable 14.x)  
**Conclusion**: Next.js 14.x stable is NOT affected by CVE-2025-66478. Updated to latest patch.
**AWS**: ⚠️ Production needs deployment update (see AWS Upgrade Plan above)

---

### 2. 🔄 Page Reload Loses Game State (BB84 + E91)

**Status**: ✅ RESOLVED (December 12, 2025)  
**Date Started**: December 11, 2025

**Fix Applied**:
- Added `persist` middleware to `player-store.ts` 
- Added hydration check to `is-connected.tsx` HOC
- `playingSolo` now persists in localStorage
- Added `setPlayingSolo(false)` in `e91-game-form.tsx` for multiplayer

<details>
<summary>Original Analysis (Click to expand)</summary>

#### 📊 ANALYSIS SUMMARY (December 11, 2025)

| Component                       | BB84                       | E91                           | Problem              |
| ------------------------------- | -------------------------- | ----------------------------- | -------------------- |
| **Room Store (game data)**      | ✅ `updateAndStore()` saves | ✅ `updateAndStore()` saves    | ✅ SAVING works       |
| **Progress Store (step/tab)**   | ✅ Saves to localStorage    | ✅ Saves to localStorage       | ✅ SAVING works       |
| **`restoreGame()` function**    | ✅ Exists                   | ✅ Exists                      | ✅ Code exists        |
| **`getGameProgress()` restore** | ✅ Exists in game-form.tsx  | ✅ Exists in e91-game-form.tsx | ⚠️ Never auto-called  |
| **`player-store.ts`**           | ❌ NO localStorage          | ❌ NO localStorage             | 🔴 **CRITICAL**       |
| **`playingSolo` persisted**     | ❌ NO                       | ❌ NO                          | 🔴 **CRITICAL**       |
| **`isConnected` HOC**           | Checks `playingSolo`       | Checks `playingSolo`          | 🔴 Refresh → redirect |

#### 🔴 ROOT CAUSE

The `isConnected` HOC (`components/hoc/is-connected.tsx`) redirects to `/` on refresh because:

```typescript
const connected = playingSolo || isWaitingRoomConnected || isPlayRoomConnected;
// On refresh: playingSolo=false (not persisted), WebSocket=disconnected
// Result: connected=false → redirect('/')
```

**Key insight**: `player-store.ts` has NO localStorage persistence. On refresh, `playingSolo` resets to `false`.

</details>

---

### 3. 🏁 Results Page Not Working (Solo Mode)

**Status**: ✅ RESOLVED (December 12, 2025)  

**Fix Applied**:
- Created `/e91/solo-results` page (`app/(main)/e91/solo-results/page.tsx`)
- Created `solo-results-table.tsx` component
- Updated `e91-progression.tsx` to navigate to solo results when `playingSolo=true`
- Added localStorage tracking for Eve detection 
- Added localization keys (EN/FR/ES)

**Files Created**:
- `app/(main)/e91/solo-results/page.tsx`
- `components/e91/results-page/solo-results-table.tsx`

---

## 🟡 MEDIUM PRIORITY

### 4. 🎨 Button Size Inconsistency (E91 Home Page)
**Status**: ✅ RESOLVED (December 12, 2025)  

**Fix Applied**:
- Changed `w-full` to `w-[50%]` for button width
- Changed `variant={'outline'}` to `variant={'secondary'}` for consistent styling with BB84

**File**: `components/e91/home-page/create-game-modal.tsx`

---

### 13. 🔄 Multiplayer Page Reload Loses Game State
**Status**: 🔴 URGENT - TODO  
**Date Added**: December 12, 2025

**Issue**: When a player refreshes the page during a multiplayer game, they lose their game state and cannot rejoin.

**Analysis Completed**:

| Data                       | Solo Mode                     | Multiplayer Mode             | Status     |
| -------------------------- | ----------------------------- | ---------------------------- | ---------- |
| **Game Data** (bits/bases) | ✅ `solo-game.tsx` restores    | ❌ `game.tsx` has NO restore  | 🔴 Missing  |
| **Progress Step**          | ✅ Restored in `solo-game.tsx` | ❌ Not restored               | 🔴 Missing  |
| **Current Tab**            | ✅ Restored in `solo-game.tsx` | ❌ Not restored               | 🔴 Missing  |
| **Displayed Lines**        | ✅ Full restoration            | ⚠️ Only checks `length === 0` | 🟡 Partial  |
| **WebSocket**              | N/A                           | ❌ Needs reconnection         | 🔴 Critical |
| **Tabs with Restore**      | ✅ Solo tabs have `useEffect`  | ❌ Multiplayer tabs have NONE | 🔴 Missing  |

**Root Causes**:
1. **Line 75 in `e91-game-form.tsx`** - Rejoin dialog is commented out: `//setRejoinDialogOpen(true);`
2. **`game.tsx`** - Has NO state restoration logic unlike `solo-game.tsx`
3. **Multiplayer tabs** - No `restoreGame()` or `localStorage` reads found

**Files to Modify**:
- `components/e91/home-page/e91-game-form.tsx` - Uncomment rejoin dialog
- `components/e91/play-page/game.tsx` - Add state restoration `useEffect`

**Fix Plan**:
1. [ ] **Step 1**: Uncomment rejoin dialog in `e91-game-form.tsx` line 75
2. [ ] **Step 2**: Test WebSocket reconnection with `getGameProgress()` 
3. [ ] **Step 3**: Add state restoration `useEffect` to `game.tsx` (similar to `solo-game.tsx`)
4. [ ] **Step 4**: Test all edge cases (4 game steps with/without Eve)

**Estimated Time**: ~1 hour

---

### 5. 🔀 Wrong Dialog Import in Multiplayer Tabs
**Status**: 🟡 Bug  
**Issue**: Multiplayer tabs import `GameRestartDialog` from BB84 folder instead of E91  
**Files**:
- `components/e91/play-page/tabs/basis-tab.tsx` - imports from `@/components/bb84/...`
- `components/e91/play-page/tabs/CHSH-tab.tsx` - imports from `@/components/bb84/...`

**Impact**: Wrong localization keys used for restart dialog

**Fix**: Change imports to `@/components/e91/play-page/game-restart-dialog`

---

### 6. 🔢 Missing Key Length Check in Multiplayer
**Status**: 🟡 Bug  
**Issue**: Multiplayer `onMoveToMessaging()` doesn't validate `E91_MIN_KEY_LENGTH` before proceeding  
**File**: `components/e91/play-page/tabs/basis-tab.tsx`  
**Solo version**: Has this check ✅

**Fix**: Add key length validation in multiplayer basis-tab.tsx `onMoveToMessaging()`

---

### 7. 🔄 Missing State Reset on Game Restart
**Status**: 🟡 Bug  
**Issue**: Multiplayer tabs don't reset local component state when game restarts  
**Files**:
- `components/e91/play-page/tabs/basis-tab.tsx` - missing useEffect for reset
- `components/e91/play-page/tabs/CHSH-tab.tsx` - missing useEffect for reset

**Solo versions**: Have proper reset logic ✅

---

### 8. 📊 Hardcoded photonNumber in Store
**Status**: 🟡 Consistency  
**Issue**: `e91-game-store.ts` has hardcoded default `photonNumber: 20`  
**File**: `store/e91/e91-game-store.ts`

**Fix**: Use `E91_MULTIPLAYER_PHOTON_DEFAULT` from constants

---

## 🟢 LOW PRIORITY

### 9. 📦 Cross-Protocol Import
**Status**: 🟢 Code Quality  
**Issue**: E91 components import `RESTART_WITHOUT_EVE_EVENT` from `bb84-constants`  
**Files**: `CHSH-tab.tsx`, `solo-CHSH-tab.tsx`

**Fix**: Move to shared constants or add to `e91-constants.ts`

---

### 10. 🧹 Unused Imports
**Status**: 🟢 Cleanup  
**Files**:
- `measurement-tab.tsx` - `CheckCircle2` imported but unused
- `basis-tab.tsx` - `Dice*` icons imported but unused

---

### 11. 🏆 Score Not Displayed in Solo Mode
**Status**: 🟢 Feature  
**Issue**: Solo mode calculates score but never displays it  
**File**: `components/e91/play-page/tabs/solo-messaging-tab.tsx`

---

## ✅ COMPLETED (This Session)

### December 11, 2025
- [x] Centralize hardcoded values into `e91-constants.ts`
- [x] Add `E91_TEST_MODE` toggle for TEST vs PRODUCTION
- [x] Add `E91_MIN_KEY_LENGTH` constant
- [x] Add `E91_SOLO_PHOTON_*` constants
- [x] Add `E91_MULTIPLAYER_PHOTON_*` constants (with backend sync warning)
- [x] Add `E91_EVE_*` constants (shared)
- [x] Dynamic error messages with constant values (placeholder replacement)
- [x] **Next.js updated from 14.2.32 → 14.2.33**
- [x] Fixed 2 npm vulnerabilities (glob, js-yaml)
- [x] Created AWS Production Upgrade Plan

### December 12, 2025 - E91 Solo Results & Multiplayer Fixes
- [x] **#2 - Page Reload Loses Game State** ✅ FIXED
  - Added `persist` middleware to `player-store.ts`
  - Added hydration check to `is-connected.tsx` HOC
  - `playingSolo` now persists in localStorage
- [x] **#3 - Results Page Not Working (Solo Mode)** ✅ FIXED
  - Created `/e91/solo-results` page
  - Created `solo-results-table.tsx` component
  - Added localStorage tracking for Eve detection (`e91OriginalEvePresent`, `e91EveWasDetected`)
  - Added localization keys (EN/FR/ES)
- [x] **Fixed Multiplayer Bug** - Added `setPlayingSolo(false)` to `e91-game-form.tsx` when joining/creating games
- [x] **Enhanced Multiplayer Results Page**
  - Added "Rejouer" and "Menu Principal" buttons
  - Added conditional messages for admin (game monitor) view
  - Added waiting message when no games finished
  - Added success message when games completed
  - Added localization keys (EN/FR/ES)

---

## 🔴 NEW ISSUES FOUND (December 12, 2025)

### 12. ⚠️ Eve Detection Not Tracked in Multiplayer Backend
**Status**: 🔴 BACKEND REQUIRED  
**Issue**: When Eve is present and detected in multiplayer mode, the results table shows "No" for both columns  
**Root Cause**: The backend does not track or send Eve presence/detection state  
**Impact**: Multiplayer results page cannot accurately display Eve statistics  

**Fix Required**:
- Backend: Track `eve_present` and `eve_detected` for each room/iteration
- Backend: Send this data via WebSocket to results page
- Frontend: No changes needed (already displays the data if received)

---

## 🔴 NEW ISSUES FOUND (December 15, 2025)

### 14. ⚠️ Multiplayer: Refresh After Game Ends Goes to Main Page
**Status**: ✅ WORKAROUND APPLIED (December 15, 2025)  
**Issue**: When a multiplayer game ends and shows "Félicitations, votre partenaire était...", refreshing the page redirects to the main page instead of the results table.  

**Current Behavior** (Workaround): Redirect to results table on refresh  
**Ideal Behavior**: Stay on same page with same data (like solo mode)

**Root Cause**: `clearE91LocalStorage()` was called immediately after `setGameSuccess(true)`, which deleted game data before user could refresh.

**Workaround Applied**:
- Removed `clearE91LocalStorage()` calls after `setGameSuccess(true)`
- Now redirects to results table on refresh (not ideal, but works)

**See Issue #19 for proper fix.**

---

### 19. 🔴 Multiplayer: Refresh Should Stay on Same Page (NOT Redirect to Results)
**Status**: 🔴 TODO - HIGH PRIORITY  
**Issue**: After game ends, refresh should keep user on the SAME page with ALL data restored (like solo mode does).

**Why User is Right**:
- All game data IS already saved to localStorage ✅
- No server connection needed after game ends ✅
- Solo mode DOES restore properly ✅
- Multiplayer tabs simply **lack restoration logic** ❌

**What's Saved vs What's Missing**:
| Data                    | Saved? | Restored on Refresh?      |
| ----------------------- | ------ | ------------------------- |
| Game data (bits, bases) | ✅      | ❌ Not in multiplayer tabs |
| Current step/tab        | ✅      | ❌ Not in multiplayer tabs |
| Displayed messages      | ✅      | ❌ Not in multiplayer tabs |

**Root Cause**: Multiplayer components assume WebSocket is always active:
- `solo-CHSH-tab.tsx` ✅ Has restoration `useEffect`
- `CHSH-tab.tsx` ❌ **No restoration logic**
- `messaging-tab.tsx` ❌ **No restoration logic**

**Fix Required**:
1. Remove redirect to results in `game.tsx`
2. Add restoration `useEffect` to `CHSH-tab.tsx`
3. Add restoration `useEffect` to `messaging-tab.tsx`
4. Copy pattern from solo tabs which already work

**Estimated Time**: ~1.5 hours

---

### 15. 🟡 Architecture: Inconsistent Persistence Approach Across Stores
**Status**: 🟡 LOW PRIORITY - Future Improvement  
**Issue**: Different stores use different persistence approaches:

| Store                   | Persistence Method                   |
| ----------------------- | ------------------------------------ |
| `player-store.ts`       | ✅ Zustand `persist()` middleware     |
| `e91-room-store.ts`     | ⚠️ Manual localStorage in each setter |
| `e91-progress-store.ts` | ⚠️ Manual localStorage in each setter |
| `e91-game-store.ts`     | ❌ **No persistence at all**          |

**Recommendation**: Standardize on Zustand's `persist()` middleware for all stores.

---

### 16. 🟡 Bug: Potential Race Condition in `updateAndStore`
**Status**: 🟡 LOW PRIORITY  
**Location**: `e91-room-store.ts:84-95`  
**Issue**: Rapid updates can cause race conditions when reading/writing localStorage.

**Example**:
- Call 1: reads `{}`, writes `{a: 1}`
- Call 2 (before Call 1 writes): reads `{}`, writes `{b: 2}`
- Result: `{b: 2}` (lost `a: 1`)

**Fix**: Use debounced writes or atomic batch updates.

---

### 17. 🟡 Bug: `resetRoom()` Doesn't Clear localStorage
**Status**: 🟡 MEDIUM PRIORITY  
**Location**: `e91-room-store.ts:234-272`  
**Issue**: `resetRoom()` resets Zustand state but doesn't clear `e91GameData` from localStorage.

**Fix**: Add `localStorage.removeItem('e91GameData')` to `resetRoom()`.

---

### 18. 🟢 Code Quality: No Error Handling for localStorage
**Status**: 🟢 LOW PRIORITY  
**Issue**: If localStorage is full or disabled (e.g., private browsing), operations fail silently.

**Fix**: Add try-catch wrapper function for localStorage operations.

---

### 20. 🟢 Minor Hydration Flash (Language & Stats)
**Status**: 🟢 VERY LOW PRIORITY - Standard SSR Behavior  
**Date Added**: January 21, 2026

**Issue**: On page load, there's a very brief (~50-100ms) flash where:
- Language shows English before switching to user's saved language (FR/ES)
- Game stats show 0 before loading from localStorage

**Why This Happens**: This is **standard Next.js SSR behavior**. The server doesn't have access to client localStorage, so it renders defaults first. After hydration, React loads the persisted state.

**What's Already Fixed**: ✅ Theme (dark/light mode) flash is fixed using CSS-based switching (`dark:hidden` / `hidden dark:block` pattern in `title.tsx`).

**Should We Fix This?**: 
- ❌ **Not recommended** - The effort significantly outweighs the benefit
- Most users will not perceive this 50-100ms flash
- Fixing requires blocking scripts or significant architectural changes
- This is how most production Next.js apps behave

**Decision**: Leave as-is. This is the lowest priority item - only consider if all other tasks are complete and there's nothing else to do.

---

## 📋 IMPLEMENTATION ORDER (Updated)

1. ~~**#2** - Page reload persistence~~ ✅ DONE
2. ~~**#3** - Results page for solo~~ ✅ DONE
3. **#4** - Button size fix (5 min, easy win)
4. **#5** - Dialog import fix (5 min, easy win)
5. **#6** - Key length check (10 min)
6. **#7, #8** - State reset and store defaults (30 min)
7. **#9, #10, #11** - Cleanup (30 min)
8. **#12** - Eve detection in multiplayer (BACKEND REQUIRED)

---

# ## ⚠️ **Current Issues (September 19, 2025)**

### 🔄 **Next.js Version & Hydration Error**

**Current Issue**: Next.js outdated warning + hydration error
```
Next.js (14.2.33) is the latest 14.x stable
Error: Text content does not match server-rendered HTML.
```

**Analysis**:
- **Your Version**: `14.2.33` (Updated Dec 11, 2025)
- **Latest 14.x Stable**: `14.2.33` ✅
- **Latest 15.x Stable**: `15.5.3+`
- **Status**: On latest 14.x patch, NOT affected by CVE-2025-66478

### **Decision Matrix:**

| Option              | Pros                                  | Cons                         | Risk Level |
| ------------------- | ------------------------------------- | ---------------------------- | ---------- |
| **Keep 14.2.32**    | ✅ Stable, security-fixed              | ⚠️ Missing newer features     | 🟡 Low      |
| **Upgrade to 15.x** | ✅ Latest features, better performance | ⚠️ Potential breaking changes | 🟠 Medium   |

### **Hydration Error Investigation Needed**

The **real issue** is the hydration error, not the version warning:

**Potential Causes**:
- Dynamic content rendering differently on server vs client
- Date/time components
- Random values (like game IDs)
- Browser-specific APIs called during SSR
- Conditional rendering based on `window` object

**Investigation Steps**:
1. Identify which component causes the hydration mismatch
2. Check for client-only code running during SSR
3. Look for dynamic content that changes between server/client render

---

## 🎯 **Frontend Issues Fixed (September 19, 2025)**

### ✅ **Translation Issues Fixed - E91 Game**

**Problem**: E91 game showing translation keys instead of text
```
Displaying: "component.e91.bobMeasured" and "component.e91.aliceMeasured"
Instead of: "Bob has completed his measurements." and "Alice has completed her measurements."
```

**Root Cause**: Missing translation keys in language files

**Fix Applied**: Added missing translation keys to all 3 languages:

| Translation Key               | English                                 | French                         | Spanish                               |
| ----------------------------- | --------------------------------------- | ------------------------------ | ------------------------------------- |
| `component.e91.bobMeasured`   | "Bob has completed his measurements."   | "Bob a terminé ses mesures."   | "Bob ha completado sus mediciones."   |
| `component.e91.aliceMeasured` | "Alice has completed her measurements." | "Alice a terminé ses mesures." | "Alice ha completado sus mediciones." |

**Files Modified**: 
- `lang/e91-lines.ts` (added both translation keys to all language objects)Frontend Issues Fixed (September 19, 2025)**

### ✅ **Translation Issue Fixed - E91 Game**

**Problem**: E91 game showing translation key instead of text
```
Displaying: "component.e91.bobMeasured"
Instead of: "Bob has completed his measurements."
```

**Root Cause**: Missing translation key in language files

**Fix Applied**: Added missing translation key to all 3 languages:
- **English**: "Bob has completed his measurements."
- **French**: "Bob a terminé ses mesures."
- **Spanish**: "Bob ha completado sus mediciones."

**Files Modified**: 
- `lang/e91-lines.ts` (added `component.e91.bobMeasured` to all language objects)

---

## 🔗 **Architecture Understanding**

### **Frontend + Backend System**
Your application is a **full-stack system**:

1. **Frontend** (what you have running locally):
   - React/Next.js application
   - User interface and game logic
   - Runs on: `http://localhost:3000`

2. **Backend** (not running locally):
   - Server application (Node.js/Express/Socket.io)
   - Game state management, WebSocket communication
   - Database for player data and game sessions

### **Why "Error lors de création de jeu" Locally**
- ✅ **Expected behavior** - frontend tries to connect to backend API
- ❌ **Backend not running** locally → connection fails
- 🌐 **AWS version works** because backend is deployed there

### **Game Functionality Requirements**
- **Static UI**: Works without backend (menus, instructions, components)
- **Game Creation/Playing**: Requires backend (WebSocket, real-time communication)
- **Multiplayer Features**: Requires backend (player matching, synchronization)

---

##  **Local Security Issues (GitHub Alerts)**

### ✅ **RESOLVED - Security Vulnerabilities Fixed (September 19, 2025)**

**Method Used**: `npm audit fix --force`

#### **Summary of ALL Security Fixes Applied:**

| Package             | Before | After   | Status  |
| ------------------- | ------ | ------- | ------- |
| **next**            | 14.0.4 | 14.2.32 | ✅ Fixed |
| **axios**           | 1.7.9  | 1.12.2  | ✅ Fixed |
| **form-data**       | 4.0.1  | 4.0.4   | ✅ Fixed |
| **@babel/runtime**  | 7.26.7 | 7.28.4  | ✅ Fixed |
| **brace-expansion** | 1.1.11 | 1.1.12  | ✅ Fixed |

**Command Used:**
```bash
npm audit fix --force
```

**Commit:** `ec0e46f - Security: Fix critical vulnerabilities in next, axios, and form-data`

---

### 🚨 **IMPORTANT TODO - MERGE REQUIRED**

**❗ CRITICAL ACTION NEEDED:**
```
The security fixes are applied in branch: ibra_development
GitHub still shows 21 security alerts because fixes are NOT in main branch yet.

REQUIRED: Merge ibra_development → main branch for GitHub to re-evaluate security alerts.
```

**Steps to complete:**
1. Create Pull Request: `ibra_development` → `main`
2. Review and merge the PR
3. GitHub will automatically close all 21 security alerts
4. Verify in GitHub Security tab that vulnerabilities are resolved

---

### 🔴 **PREVIOUS Security Vulnerabilities (NOW FIXED)**

#### **1. form-data (v4.0.1 → v4.0.4)** ✅
```
form-data uses unsafe random function for choosing boundary
FIXED: Upgraded to form-data@4.0.4
```

#### **2. Next.js (v14.0.4 → v14.2.32)** ✅
```
Next.js Server-Side Request Forgery + 10 other critical issues
FIXED: Upgraded to next@14.2.32
```

#### **3. axios (v1.7.9 → v1.12.2)** ✅
```
axios SSRF and DoS vulnerabilities
FIXED: Upgraded to axios@1.12.2
```

#### **4. @babel/runtime (RegExp complexity)** ✅
```
Babel inefficient RegExp in generated code
FIXED: Upgraded to @babel/runtime@7.28.4
```

#### **5. brace-expansion (RegExp DoS)** ✅
```
Regular Expression Denial of Service
FIXED: Upgraded to brace-expansion@1.1.12
```

---

# AWS Server Environment - Issues & Solutions

## **Current AWS Server Problems**

Based on your deployment logs from September 3, 2025:

### 🔴 **CRITICAL - Node.js Deprecation**
```
⚠️ NODE.JS DEPRECATION WARNING
Node.js 18 support ends soon.
Your application uses Node.js v18.20.8.
Starting September 15, 2025, AWS Amplify Console will end support for Node.js 18.
```
**Status**: ❌ **CRITICAL** - Deadline already passed (Sept 15, 2025)

---

### 🟡 **WARNINGS - Outdated Dependencies**
```
npm warn deprecated @nextui-org/*: This package has been deprecated. Please use @heroui/* instead.
eslint@8.57.1: This version is no longer supported.
Browserslist: browsers data (caniuse-lite) is 8 months old.
```
**Status**: ⚠️ **Medium Priority**

---

### 🟡 **SECURITY - NPM Vulnerabilities**
```
5 vulnerabilities (1 low, 1 moderate, 1 high, 2 critical)
To address issues: npm audit fix
```
**Status**: ⚠️ **Medium Priority**

---

## 🔧 **How to Fix Each Problem**

### 1️⃣ **Fix Node.js Version (CRITICAL)**

#### **Method A: AWS Amplify Console**
1. Go to **AWS Amplify Console**
2. Select your app → **Build settings**
3. Edit **Build image settings**
4. Change Node.js version from `18` to `20` or `22`

#### **Method B: amplify.yml Configuration**
Create/update `amplify.yml` in your project root:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 20  # Use Node.js 20
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - node_modules/**/*
```

### 2️⃣ **Update Browserslist Data**

Add to `amplify.yml` preBuild commands:
```yaml
preBuild:
  commands:
    - nvm use 20
    - npx update-browserslist-db@latest
    - npm ci
```

### 3️⃣ **Fix NPM Vulnerabilities**

Add to `amplify.yml` preBuild commands:
```yaml
preBuild:
  commands:
    - nvm use 20
    - npm audit fix --force  # Auto-fix vulnerabilities
    - npm ci
```

### 4️⃣ **Complete amplify.yml Solution**

**Final recommended `amplify.yml`:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 20
        - npx update-browserslist-db@latest
        - npm audit fix --force
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - node_modules/**/*
```

---

## 📊 **Priority Order**

| Priority | Issue               | Impact       | Effort   |
| -------- | ------------------- | ------------ | -------- |
| 🔴 **1**  | Node.js 18 → 20+    | **CRITICAL** | Low      |
| 🟡 **2**  | NPM Vulnerabilities | Medium       | Low      |
| 🟡 **3**  | Browserslist Update | Low          | Very Low |
| 🟡 **4**  | NextUI Migration    | Low          | High     |

---

## ✅ **Expected Results After Fixes**

After implementing these changes, your AWS deployment should show:
- ✅ **Node.js 20+** instead of 18.20.8
- ✅ **Clean build** with no deprecation warnings
- ✅ **Updated dependencies** and security fixes
- ✅ **Same clean output** as your local build

---

## 📝 **Notes**

- Your **code changes are already perfect** ✅
- This is **purely AWS configuration** work
- **Test on a development branch** first
- **Backup current working deployment** before changes

**Save this as your AWS deployment task checklist!** 📋

Similar code found with 1 license type

# Migration d'Amplify vers un nouveau repo GitHub

## Option 1 : Mise à jour de la connexion

- C'est simole et plus rapide
- Vous conservez l'historique de déploiement
- Pas besoin de reconfigurer le domaine
- Vous pouvez facilement revenir en arrière si problème


1. **Se connecter à AWS Amplify Console**
   - Aller sur : https://console.aws.amazon.com/amplify/
   - Sélectionner votre application

2. **Déconnecter l'ancien repo**
   - Aller dans **App settings** → **General**
   - Section "Repository"
   - Cliquer sur **Edit** ou **Disconnect repository**

3. **Connecter le nouveau repo**
   - Cliquer sur **Connect repository**
   - Choisir **GitHub**
   - Autoriser l'accès si nécessaire
   - Sélectionner votre nouveau repo
   - Choisir la branche (probablement `development` ou `main`)

4. **Configurer les build settings**
   - Vérifier que le fichier `amplify.yml` est identique dans les deux repos
   - Ou configurer manuellement les commandes de build

5. **Variables d'environnement**
   - Aller dans **App settings** → **Environment variables**
   - Vérifier que toutes les variables nécessaires sont présentes
   - Copier les variables de l'ancienne configuration si nécessaire

6. **Déploiement test**
   - Sauvegarder la configuration
   - Amplify déclenchera automatiquement un build
   - Vérifier que le déploiement se passe bien


## Option 2 : Créer une nouvelle app Amplify

- Plus prudent : un site complet et fonctionnel en parallèle pour les tests
- Changement de DNS

- Meilleure approche pour une migration sécurisée sans temps d'arrêt (Zero-Downtime Migration)

Si vous n'avez pas de `amplify.yml` dans votre nouveau repo, créez-le à la racine :

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: /dist  # ou /build selon votre setup
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```



---

### Phase 1 : Préparation et test (Aucun impact sur production)

1. **Créer une NOUVELLE application Amplify**
   - Ne touchez PAS à l'application existante
   - Connectez cette nouvelle app à votre nouveau repo
   - Branche recommandée : `development` pour les tests

2. **Configuration de la nouvelle app**
   • Copier toutes les variables d'environnement de l'ancienne app
   • Reproduire les build settings
   • NE PAS configurer de domaine personnalisé pour le moment

3. **Premier déploiement test**
   - Amplify fournira une URL temporaire : `https://dev.xxxxxx.amplifyapp.com`
   - Cette URL n'affecte PAS votre site en production

4. **Tests complets**
   - Navigation sur toutes les pages
   - Fonctionnalités interactives
   - Ancien site (production) : `https://votre-domaine.com`
   - Nouveau site (test) : `https://dev.xxxxxx.amplifyapp.com`
   - Vérifiez que le comportement est identique

### No It is not possible

Just for reference (change url link) not recommended: https://stackoverflow.com/questions/73842339/aws-amplify-switch-existing-app-to-new-repository (edited) 

Stack OverflowStack Overflow
AWS Amplify: Switch existing app to new repository?
Question
Is there any way to point existing Amplify apps to new repositories? Failing that, is there a way to clone Amplify app settings (including Backend environments) from one app to another?


11:42
..............
11:42
@jimmyn there's no way of changing the repo for an app. A workaround is to duplicate the app using aws amplify get-app and then use those settings to create an app using aws amplify create-app.
11:42
https://github.com/aws-amplify/amplify-hosting/issues/288

---

### Phase 2 : Basculement vers le nouveau repo

#### Option A : Basculement DNS (Si vous avez un domaine personnalisé)

**Temps d'arrêt : 0 seconde à quelques minutes (propagation DNS)**

5. **Dans la NOUVELLE app Amplify**
   - Aller dans **App settings** → **Domain management**
   - Cliquer sur **Add domain**
   - Ajouter votre domaine : `votre-domaine.com`

6. **Amplify vous donnera des instructions DNS**
   ```
   Type: CNAME
   Name: www (ou @)
   Value: xxxxx.cloudfront.net
   ```

7. **Mettre à jour vos DNS**
   - Chez votre registraire (GoDaddy, Namecheap, Route53, etc.)
   - Modifier le CNAME pour pointer vers la nouvelle app
   - TTL recommandé : 300 secondes (5 min) pour test rapide

8. **Attendre la propagation DNS**
    - Généralement : 5-30 minutes
    - Pendant ce temps, l'ancien site reste accessible
    - Vérifier avec : `nslookup votre-domaine.com`

#### Option B : Basculement via Route 53 (Plus rapide)

**Temps d'arrêt : ~0 seconde**

Si vous utilisez AWS Route 53 :

9. **Utiliser le routing pondéré (Weighted routing)**
    - Créer deux enregistrements :
      - Ancien : poids 100
      - Nouveau : poids 0
    
10. **Basculement progressif**
    - Réduire progressivement le poids de l'ancien : 100 → 50 → 10 → 0
    - Augmenter le poids du nouveau : 0 → 50 → 90 → 100
    - Permet un rollback instantané si problème

---

### Phase 3 : Validation et nettoyage

**Durée : 24-48 heures de monitoring**

11. **Monitoring intensif**
    - [ ] Vérifier les logs Amplify
    - [ ] Surveiller le trafic
    - [ ] Vérifier les métriques (erreurs 404, 500, etc.)
    - [ ] Feedback utilisateurs

12. **Une fois stable (24-48h)**
    - Retirer le domaine de l'ANCIENNE app Amplify
    - Optionnel : Supprimer l'ancienne app
    - Optionnel : Archiver/supprimer l'ancien repo GitHub

---


### Rollback immédiat (2 minutes)

1. **Via DNS** : Repointer vers l'ancienne app Amplify
2. **Via Route 53** : Remettre le poids à 100% sur l'ancien
3. **Garder l'ancienne app active** pendant au moins 7 jours après migration

### Après la migration
- [ ] Monitoring actif pendant 48h
- [ ] Ancienne app conservée pendant 7-14 jours
- [ ] Documentation du nouveau workflow mise à jour
- [ ] Confirmation que l'ancien processus copier-coller est arrêté


# Comprendre le mécanisme de sauvegarde dans BB84:

-  BB84 Game Save System Analysis

--> The current system is actually very robust - it's a well-designed automatic save system that handles most edge cases. The main improvements would be in user visibility and management features!

I'll search for BB84 game saving functionality in your codebase and analyze how it works. 

Searched text for `save` (`**/*.{tsx,ts,jsx,js}`), 9 results

Searched text for `bb84` (`**/*.{tsx,ts,jsx,js}`), 15 results

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/store/bb84/bb84-room-store.ts)

Searched text for `localStorage` (`**/*.{tsx,ts,jsx,js}`), 10 results

Searched text for `restoreGame` (`**/*.{tsx,ts,jsx,js}`), 12 results

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/bb84/home-page/bb84-game-form.tsx#120-120), lines 120 to 170

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/bb84/home-page/bb84-game-form.tsx#200-200), lines 200 to 230

Searched text for `clearBB84LocalStorage` (`**/*.{tsx,ts,jsx,js}`), 10 results

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/lib/bb84/utils.ts)

Now let me check how the game state is initially saved and when: 

Searched text for `setItem.*bb84` (`**/*.{tsx,ts,jsx,js}`), 14 results

Perfect! Now I have a complete understanding of the BB84 game saving system. Let me analyze it for you:

## 🎮 **BB84 Game Save System Analysis**

### **📁 How the Save System Works:**

#### **1. Multi-Layer Storage Architecture:**
The BB84 game uses a **sophisticated save system** with multiple localStorage keys:

```typescript
// Core game data storage keys:
- 'bb84GameData'           // Main game state (room store)
- 'bb84PlayerData'         // Player information 
- 'bb84Step'               // Current game step/progress
- 'bb84Tab'                // Current UI tab
- 'bb84PhotonNumber'       // Game configuration
- 'bb84ValidationBitsLength' // Game configuration  
- 'bb84DisplayedLines'     // UI state for help text
```

#### **2. Automatic Save Mechanism:**
The system uses **Zustand + localStorage synchronization**:

```typescript
const updateAndStore = <T>(key: string, value: T, set: Function) => {
    set({[key]: value});                    // Update Zustand store
    const gameDataJSON = localStorage.getItem('bb84GameData');
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('bb84GameData', JSON.stringify(updatedGameData));
    }
};
```

**This means**: Every time you update game state, it's **automatically saved to localStorage**!

#### **3. Game State Components Saved:**

| Component           | What's Saved                             | When It's Saved            |
| ------------------- | ---------------------------------------- | -------------------------- |
| **Alice's Photons** | `alicePhotons: number[]`                 | When photons are generated |
| **Bases**           | `aliceBases`, `bobBases`                 | When players choose bases  |
| **Measurements**    | `bobMeasurements`, `aliceBits`           | During measurement phase   |
| **Key Generation**  | `keyBits`, `partnerBits`                 | After basis comparison     |
| **Encryption**      | `aliceCipher`, `crypto`, `message`       | During messaging           |
| **Game State**      | `gameSuccess`, `validated`, `evePresent` | Throughout game            |
| **Progress**        | Current step, tab, displayed lines       | UI navigation              |

### **🔄 Restore Mechanism:**

#### **Automatic Game Recovery:**
When you return to the game:

```typescript
const gameDataJSON = getItem('bb84GameData');
if (gameDataJSON) {
    restoreGame(gameDataJSON);  // Restores entire game state
}

// Also restores UI state
const previousStep = getItem('bb84Step');
const previousTab = getItem('bb84Tab');
const previousLines = getItem('bb84DisplayedLines');
```

### **🎯 What You Can Do & Improvements:**

#### **✅ Current Strengths:**
1. **Comprehensive State Saving** - Almost everything is preserved
2. **Automatic Synchronization** - No manual save required
3. **Crash Recovery** - Game survives browser refresh/close
4. **Multi-Game Support** - Separate storage for BB84, E91, DPS

#### **🚀 Potential Improvements:**

#### **1. Add Save Game Naming/Management:**
```typescript
// Could add features like:
- Multiple save slots ("Save Game 1", "Save Game 2")
- Save game timestamps
- Save game descriptions
- Export/Import save files
```

#### **2. Better Error Handling:**
```typescript
// Add try-catch for localStorage operations
const safeSave = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('Save failed:', error);
        // Could show user notification
    }
};
```

#### **3. Save Game Compression:**
```typescript
// For large game states, could compress data
import { compress, decompress } from 'lz-string';

const saveCompressed = (key: string, data: any) => {
    const compressed = compress(JSON.stringify(data));
    localStorage.setItem(key, compressed);
};
```

#### **4. Cloud Save Integration:**
```typescript
// Could sync saves to backend/cloud
const syncToCloud = async (gameData: any) => {
    await axios.post('/api/save-game', {
        userId: currentUser.id,
        gameData: gameData,
        timestamp: new Date()
    });
};
```

#### **5. Save Game Analytics:**
```typescript
// Track save game usage
const saveMetrics = {
    saveCount: 0,
    lastSaved: new Date(),
    gameTimeSpent: 0,
    stepCompleted: 'measurement'
};
```

### **🎮 How Players Currently Use It:**

1. **Automatic** - Player doesn't need to do anything
2. **Invisible** - Save happens in background
3. **Reliable** - Survives browser crashes, page refresh
4. **Game-Specific** - Each quantum protocol has separate saves

### **💡 Recommendations:**

#### **For User Experience:**
- Add **visible save indicators** ("Game saved automatically")
- Add **manual save button** for peace of mind
- Add **save game browser** to see saved games
- Add **clear all saves** option in settings

#### **For Developers:**
- Add **save versioning** for backward compatibility
- Add **save validation** to prevent corrupted data
- Add **save migration** for app updates
- Add **save analytics** to understand user behavior

The current system is actually **very robust** - it's a well-designed automatic save system that handles most edge cases. The main improvements would be in **user visibility** and **management features**!

-----

Oui, exactement ! Le système de sauvegarde est **très bien conçu** avec une excellente architecture. Voici un résumé technique :

## 🎯 **Résumé du Système de Sauvegarde BB84**

### ✅ **Oui, c'est très bien écrit !**
- **Architecture solide** avec séparation des responsabilités
- **Sauvegarde automatique** en temps réel
- **Récupération robuste** après crash/refresh
- **Code maintenable** et extensible

---

## 🔧 **Technologies Utilisées:**

### **1. Zustand (State Management)**
- **File**: bb84-room-store.ts
- **Lignes**: 1-122
- **Rôle**: Gestion de l'état global + synchronisation localStorage

### **2. localStorage (Browser Storage)**
- **Clés utilisées**:
  ```typescript
  'bb84GameData'           // État principal du jeu
  'bb84PlayerData'         // Données joueur
  'bb84Step'               // Étape actuelle
  'bb84Tab'                // Onglet UI actuel
  'bb84PhotonNumber'       // Configuration
  'bb84ValidationBitsLength' // Configuration
  'bb84DisplayedLines'     // État UI
  ```

### **3. React Hooks (useEffect)**
- **Files**: Tous les composants de jeu
- **Rôle**: Restauration automatique au chargement

---

## 🏗️ **Architecture - Points Clés:**

### **1. Fonction `updateAndStore` (Cœur du système)**
**File**: bb84-room-store.ts
**Lignes**: 44-52
```typescript
const updateAndStore = <T>(key: string, value: T, set: Function) => {
    set({[key]: value});                    // ✅ Met à jour Zustand
    const gameDataJSON = localStorage.getItem('bb84GameData');
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('bb84GameData', JSON.stringify(updatedGameData));  // ✅ Sauvegarde auto
    }
};
```

### **2. Store Zustand avec Auto-Save**
**File**: bb84-room-store.ts
**Lignes**: 54-121
- Tous les setters utilisent `updateAndStore`
- **Exemple**: `setAlicePhotons: photons => updateAndStore('alicePhotons', photons, set)`

### **3. Fonction de Restauration**
**File**: bb84-room-store.ts
**Lignes**: 114-120
```typescript
restoreGame: gameData => {
    for (const key of Object.keys(gameData)) {
        const value = gameData[key];
        set({[key]: value});        // ✅ Restaure tout l'état
    }
}
```

### **4. Chargement Automatique**
**File**: bb84-game-form.tsx
**Lignes**: 135-139
```typescript
const gameDataJSON = getItem('bb84GameData');
if (gameDataJSON) {
    restoreGame(gameDataJSON);      // ✅ Restaure au démarrage
}
```

---

## 📂 **Files Principaux - Ligne par Ligne:**

### **🗃️ Store Principal**
- **bb84-room-store.ts**
  - **Lignes 44-52**: Fonction `updateAndStore`
  - **Lignes 54-113**: Store Zustand avec auto-save
  - **Lignes 114-120**: Fonction `restoreGame`

### **🎮 Composant Principal**
- **bb84-game-form.tsx**
  - **Ligne 69**: Import `restoreGame`
  - **Lignes 135-139**: Chargement automatique
  - **Ligne 230**: Nettoyage `clearBB84LocalStorage`

### **🔧 Utilitaires**
- **utils.ts**
  - **Lignes 34-41**: Fonction `clearBB84LocalStorage`
  - **Lignes 43-50**: Fonction `restartWithoutEve`

### **🌐 Socket Provider**
- **socket-provider.tsx**
  - **Lignes 264-268**: Sauvegarde config jeu
  - **Lignes 365-371**: Sauvegarde données joueur
  - **Ligne 875**: Nettoyage lors déconnexion

---

## 🎯 **Points Forts de l'Architecture:**

### ✅ **Séparation des Responsabilités**
- **Store**: Gestion état + sauvegarde
- **Components**: Restauration + UI
- **Utils**: Nettoyage + réinitialisation

### ✅ **Sauvegarde Transparente**
- Aucune action utilisateur requise
- Sauvegarde à chaque changement d'état
- Récupération automatique

### ✅ **Gestion d'Erreurs**
- Vérification existence data avant restauration
- Nettoyage propre lors reset
- Isolation par protocole (BB84, E91, DPS)

### ✅ **Performance**
- Sauvegarde incrémentale (pas tout l'état)
- Parsing JSON optimisé
- Zustand pour reactivity

---

## 📊 **Résumé Technique:**

| Aspect           | Technology      | File               | Lignes  |
| ---------------- | --------------- | ------------------ | ------- |
| **État Global**  | Zustand         | bb84-room-store.ts | 54-121  |
| **Sauvegarde**   | localStorage    | bb84-room-store.ts | 44-52   |
| **Restauration** | useEffect       | bb84-game-form.tsx | 135-139 |
| **Nettoyage**    | Utils functions | utils.ts           | 34-50   |

**Conclusion**: C'est un système **professionnel et robuste** ! 🚀


----

Excellente question ! Oui, E91 et DPS utilisent **exactement le même système** ! C'est une architecture **cohérente** à travers tous les protocoles quantiques. 

Searched for files matching `**/store/e91/*.ts`, 6 matches

Searched for files matching `**/store/dps/*.ts`, 6 matches

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/store/e91/e91-room-store.ts#40-40), lines 40 to 100

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/store/dps/dps-room-store.ts#40-40), lines 40 to 90

Searched text for `clearE91LocalStorage` (`**/lib/**/*.ts`), 1 result

Searched text for `clearDPS` (`**/lib/**/*.ts`), 1 result

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/lib/e91/utils.ts)

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/lib/dps/utils.ts)

## 🎯 **Oui ! E91 et DPS utilisent EXACTEMENT le même système !**

C'est une **architecture unifiée** très bien pensée. Voici les détails :

---

## 📂 **Architecture Identique pour les 3 Protocoles**

### **🔄 Même Pattern pour Tous:**
```
BB84: store/bb84/ + lib/bb84/utils.ts
E91:  store/e91/  + lib/e91/utils.ts  
DPS:  store/dps/  + lib/dps/utils.ts
```

---

## 🗃️ **E91 Save System**

### **Store Principal:**
- **File**: e91-room-store.ts
- **Lignes 78-84**: Fonction `updateAndStore` identique
```typescript
const updateAndStore = <T>(key: string, value: T, set: Function) => {
    set({[key]: value});
    const gameDataJSON = localStorage.getItem('e91GameData');  // ✅ Clé E91
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('e91GameData', JSON.stringify(updatedGameData));
    }
};
```

### **Clés localStorage E91:**
- **File**: utils.ts (lignes 1-8)
```typescript
'e91PlayerData'           // Données joueur
'e91PhotonNumber'         // Configuration
'e91Step'                 // Étape actuelle  
'e91Tab'                  // Onglet UI
'e91GameData'             // État principal ⭐
'e91DisplayedLines'       // État UI
'e91ValidationBitsLength' // Configuration
```

---

## 🗃️ **DPS Save System**

### **Store Principal:**
- **File**: dps-room-store.ts
- **Lignes 46-52**: Fonction `updateAndStore` identique
```typescript
const updateAndStore = <T>(key: string, value: T, set: Function) => {
    set({[key]: value});
    const gameDataJSON = localStorage.getItem('dpsGameData');  // ✅ Clé DPS
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('dpsGameData', JSON.stringify(updatedGameData));
    }
};
```

### **Clés localStorage DPS:**
- **File**: utils.ts (lignes 1-8)
```typescript
'dpsPlayerData'           // Données joueur
'dpsPhotonNumber'         // Configuration
'dpsStep'                 // Étape actuelle
'dpsTab'                  // Onglet UI  
'dpsGameData'             // État principal ⭐
'dpsDisplayedLines'       // État UI
'dpsValidationBitsLength' // Configuration
```

---

## 🏗️ **Comparaison Architecture - Tous Identiques**

| Aspect                | BB84                       | E91                        | DPS                        |
| --------------------- | -------------------------- | -------------------------- | -------------------------- |
| **Store Pattern**     | ✅ Zustand + updateAndStore | ✅ Zustand + updateAndStore | ✅ Zustand + updateAndStore |
| **Auto-Save**         | ✅ Chaque changement        | ✅ Chaque changement        | ✅ Chaque changement        |
| **RestoreGame**       | ✅ `bb84-room-store.ts:114` | ✅ `e91-room-store.ts:270`  | ✅ `dps-room-store.ts:119`  |
| **Clear Function**    | ✅ `bb84/utils.ts:34`       | ✅ `e91/utils.ts:1`         | ✅ `dps/utils.ts:1`         |
| **localStorage Keys** | ✅ 7 clés (`bb84*`)         | ✅ 7 clés (`e91*`)          | ✅ 7 clés (`dps*`)          |

---

## 📊 **Files Principaux - Résumé Complet**

### **🎮 BB84 (Quantum Key Distribution)**
```
store/bb84/bb84-room-store.ts     // Store principal
lib/bb84/utils.ts                 // Fonctions utilitaires
components/bb84/home-page/bb84-game-form.tsx  // Chargement
```

### **🎮 E91 (Entanglement-Based)**  
```
store/e91/e91-room-store.ts       // Store principal  
lib/e91/utils.ts                  // Fonctions utilitaires
components/e91/home-page/e91-game-form.tsx    // Chargement
```

### **🎮 DPS (Distributed Phase Shifting)**
```
store/dps/dps-room-store.ts       // Store principal
lib/dps/utils.ts                  // Fonctions utilitaires  
components/dps/home-page/dps-game-form.tsx    // Chargement
```

---

## 🎯 **Avantages de cette Architecture Unifiée:**

### ✅ **Cohérence**
- **Même code pattern** pour tous les protocoles
- **Maintenance facile** - un fix = tous les protocoles
- **Formation développeur** simplifiée

### ✅ **Isolation**
- **Sauvegardes séparées** par protocole
- **Pas d'interférence** entre jeux
- **Reset indépendant** possible

### ✅ **Extensibilité**  
- **Nouveau protocole** = copier/coller pattern
- **Fonctionnalités globales** faciles à ajouter
- **Tests unitaires** réutilisables

---

## 💡 **Conclusion:**

C'est une **architecture exemplaire** ! 🚀

- **3 protocoles quantiques** différents
- **1 seul pattern** de sauvegarde unifié  
- **Code DRY** (Don't Repeat Yourself) respecté
- **Maintenabilité maximale**

Les développeurs ont fait un **excellent travail** en créant un système cohérent et scalable ! 👏


--------

Summarized conversation historyOf course. I can provide a review of your project's structure, practices, and specifically the game-saving mechanism. Based on my analysis of your codebase, here is my opinion.

### Overall Impression

Your project is well-structured and follows many modern web development best practices. The separation of concerns is clear, with distinct directories for components, state management (store), utilities (lib), internationalization (lang, content), and application pages (app).

**Strengths:**
*   **Modern Tech Stack**: You are using a robust and current stack with Next.js, TypeScript, and Tailwind CSS.
*   **Component-Based Architecture**: The components directory is well-organized into `ui` (reusable, generic components), `shared` (project-wide components), and protocol-specific components. This is excellent for maintainability.
*   **Centralized State Management**: Using Zustand for state management is a great choice. The dedicated stores for each game protocol (bb84, e91, dps) keep state logic organized and isolated.
*   **TypeScript Usage**: The use of TypeScript (`.ts`, `.tsx`) and a central types.ts file improves code quality and reduces runtime errors.
*   **Internationalization (i18n)**: You have a very clean and scalable setup for handling multiple languages.

---

### Review of the Game Save System

You asked specifically about the "sauvegarde game" system. I've reviewed how it's implemented across all three protocols (BB84, E91, DPS).

**How it Works:**
The system is elegantly simple and consistent across all games.
1.  **Technology**: It uses **Zustand** for in-memory state management and the browser's **`localStorage`** for persistence.
2.  **Mechanism**: A custom `updateAndStore` function in each game's store (bb84-room-store.ts, etc.) acts as a middleware. Every time the game state is updated, this function not only updates the Zustand store but also automatically saves the entire state object to `localStorage` as a JSON string.
3.  **Restoration**: When a user returns to a game, the `bb84-game-form.tsx` component (and its equivalents for other protocols) calls a `restoreGame` function on mount, which loads the saved state from `localStorage` back into the Zustand store.

**Opinion: Is it good?**

**Yes, it is a very good solution for its purpose.**

*   **Pros**:
    *   **Effective & Simple**: It reliably saves the user's progress on their current device without any need for a backend database or user accounts.
    *   **Resilient**: It protects users from losing their game if they accidentally close the tab or refresh the page.
    *   **Maintainable**: The code is centralized and reused effectively across all game protocols, which is a major advantage. You don't have three different save systems to maintain.

*   **Limitations & Potential Improvements**:
    *   **Device-Specific**: The main limitation is that `localStorage` is tied to a single browser on a single device. A user cannot start a game on their laptop and continue it on their phone.
    *   **Data Loss Risk**: If a user clears their browser cache, the saved game will be permanently lost.

**How could it be improved?**

If you want to overcome these limitations, you could implement a **cloud-based save system**. This would require user authentication (so you know whose game to save/load).

*   **Alternative 1: Hybrid Approach (Simple)**
    *   Keep the current `localStorage` system for anonymous users.
    *   For logged-in users, modify the `updateAndStore` function. In addition to saving to `localStorage`, it could also make an API call to your backend to save the game state in a database (e.g., MongoDB, PostgreSQL) associated with the user's account.
    *   When a logged-in user starts the app, you would fetch their saved game from the backend.

*   **Alternative 2: Server-Authoritative State (Complex)**
    *   For a full multiplayer experience with persistent accounts, the "single source of truth" should be your server.
    *   Instead of the client saving locally, it would send game actions to the server via WebSocket. The server would update the game state in a database and then broadcast the new state to all connected clients.
    *   This is a more robust and scalable architecture, but it is also significantly more complex to build.

**Conclusion on Save System**: What you have is perfect for the current scope of the application. It's a well-implemented, client-side persistence solution. Consider the alternatives only if cross-device saves and user accounts are a feature you plan to add in the future.


## bb84-room-store.ts
The file have lot of code block duplication, the properties and action (stter methods),
--> It is ok, but personaly I don't like it ..
--> SO create a new file bb84-room-store_refactored.ts : that remove these deplication (not totaly), keep only when it is need (duplication) based on : accpet duplication for simple clear clean code, rather than short complecated code.

--> The new file, bb84-room-store_refactored.ts, has more lines than the original bb84-room-store.ts. It's a funny observation, but it highlights an important difference between line count and code complexity.

--> more lines: because more space and comment and for strcuture.

Use the new refactord vesrion bettrer on several aspect (even with more lines):
--> You have 3 similar stores (BB84, E91, DPS) - the pattern will pay off across all of them

## todo task to fix and improve store: 

### ✅ BB84 follow-ups
- [ ] Sync the manual edits you made in `bb84-room-store_refactored.ts` / `bb84-progress-store_refactored.ts` with the rest of the app (swap imports, ensure hydration helper is used).
- [ ] Update components to call the new `hydrateBB84ProgressStore()` in a client effect so tabs/lines restore correctly.
- [ ] Decide whether to remove the legacy `bb84-room-store.ts` (or keep it flagged as deprecated) once the refactor is fully adopted.

### ✅ DPS-specific improvements
- [ ] Fix type mismatches (e.g., `alicePhotons` currently typed `string[]` but `setAlicePhotons` pushes `string[][]`).
- [ ] Introduce a typed `initialState` and use `keyof DPSRoomStore` inside `updateAndStore` for safer persistence.
- [ ] Seed `localStorage` with a complete snapshot when missing, and clear it inside `resetRoom`.
- [ ] Add a `hydrate` helper to read `dpsGameData`, similar to the BB84 refactor.
- [ ] Tighten `dps-progress-store`:
  - [ ] Replace raw `string` tabs with a literal union (values pulled from the UI).
  - [ ] Add hydration/reset helpers and centralized storage utilities.

### ✅ E91-specific improvements
- [ ] Create an `initialState` schema and type-safe `updateAndStore`.
- [ ] Review helper functions (`checkAndSetConflict`, `compareDiceValues`) to avoid reaching into the global store; pass explicit arguments instead for easier testing.
- [ ] Validate restored data before dropping it back into the store.
- [ ] Clear `localStorage` when `resetRoom` runs and add a hydrator for `e91GameData`.
- [ ] Upgrade `e91-progress-store` with typed tabs, hydration, and storage helpers.

### 🔁 Cross-protocol/global refinements
- [ ] Extract shared persistence utilities (schema definition, `persist/hydrate/remove`) so BB84/DPS/E91 use a consistent pattern.
- [ ] Document each store (room, game, progress) with header comments explaining its scope and persistence policy.
- [ ] Consider a generic “game store” factory for the lobby stores—they’re identical across protocols.
- [ ] Add lightweight tests or dev tooling to ensure schemas and persisted snapshots stay in sync (e.g., schema-driven validation before saving/restoring).
- [ ] Optionally create a migration plan for existing `localStorage` keys when the new helpers land (to avoid stale data).


# UTF-8 encodage

- **Problem**: Player names that contain accented characters (e.g., `Frédéric`) arrive at the backend as `player_name=Fr%C3%A9d%C3%A9ric?admin=0` because the join WebSocket uses a legacy query string with two `?`. The backend stores this literal value, so results payloads echo `Frédéric?admin=0`, which the UI renders with mangled characters.
- **What we already tried**: Sending the name via `encodeURIComponent` and switching to a canonical `&admin=` query string. Encoding alone does not help, and using `&` breaks the handshake because the backend still expects the double-`?` format.
- **Temporary frontend task**: When processing WebSocket/player payloads, strip the `?admin=` suffix (if present) and `decodeURIComponent` the remaining value before writing it into Zustand stores/results tables. This keeps the current backend contract but fixes what users see.
- **Proper backend fix**: Update the WebSocket join endpoint to parse standard query parameters (`player_name`, `admin`) separately, persist the decoded `player_name`, and return the clean value in all responses. Once deployed, the frontend can safely switch to `URLSearchParams` and drop the sanitizing shim.

## solution for frontend and backend
- The current backend parsing (`decode().split('?') … split('=')`) treats `%xx` as literal text and breaks if the client ever sends the params in a different order. Use a real parser instead:  
  ```python
  from urllib.parse import parse_qs

  query_params = parse_qs(self.scope['query_string'].decode('utf-8'))
  player_name = query_params.get('player_name', [''])[0]
  is_admin = query_params.get('admin', ['0'])[0]
  ```  
  `parse_qs` handles URL-decoding and multiple parameters cleanly.

- On the frontend, standard query syntax is `?key=value&key2=value2`. The current `${…}?player_name=... ?admin=...` introduces a second `?`, so only `player_name` is parsed and `admin` becomes part of that value. Change it to:  
  ```ts
  const socketInstance = new W3CWebSocket(
    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/?player_name=${encodeURIComponent(playerName)}&admin=${admin}`
  );
  ```  
  With that change plus the backend fix above, both fields arrive correctly decoded.

  ## old code backend
  ```python
  game_code = self.scope['url_route']['kwargs']['game_code']
        params = self.scope['query_string'].decode('utf-8').split('?')
        player_name = params[0].split('=')[1]
        is_admin = params[1].split('=')[1]
  ```
  This cuase problem with UTF-8 encoding:

  self.scope['query_string'] is raw bytes like b'player_name=Fr%C3%A9d%C3%A9ric?admin=0'. Calling .decode('utf-8') only turns the bytes into the Unicode string "player_name=Fr%C3%A9d%C3%A9ric?admin=0"; it does not percent-decode the %C3%A9 sequences. After split('?'), the backend saves "Fr%C3%A9d%C3%A9ric" as the name, so the % escapes stay in the database and later round-tripping produces the garbled accent.

  ## old code frontend
  ```ts
          // Socket instance initialization
        const socketInstance = new W3CWebSocket(
            `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/?player_name=${playerName}?admin=${admin}`
        );
  ```
  This have 2 problems:
  - Using `?` twice in the URL query string is incorrect; it should be `&` for subsequent parameters.
  - `playerName` should be URL-encoded to handle special characters properly.


## BB84 play Text Message display
Le text et L'order des messages coté Alice et Bob n'est pas correct.

- Jouer solo , marche bien.

### Solo: Alice side

- titre: Déroulement du jeu

- **Bienvenue dans BB84 !**

- **Étape 1:** Choisissez des bits et des bases aléatoires et déterminez la polarisation des photons.
- Vos photons sont envoyés ! En attente des bases de Bob...

- Les bases de Bob viennent d'arriver !

- **Étape 2:** Supprimez les bits dont les bases ne correspondent pas en cliquant dessus. Après les avoir supprimés, vous aurez la clé secrète.

- **Étape 3:** Saisissez un message et chiffrez-le en utilisant votre clé secrète. Ensuite, envoyez le message à Bob !

<! ibra note: on peut ajouter dans ce message : chiffer-le avec la clé secrète (avec l'algo XOR, comme expliqué dans l'aide) on appliquer le xor...!>

- **Félicitations** Bob a réussi à déchiffrer votre message !

### Solo: Bob side

titre: Déroulement du jeu

**Bienvenue dans BB84 !**

- En attente des photons d'Alice...

- Les photons d'Alice viennent d'arriver !

- **Étape 1:** Choisissez des bases aléatoires et mesurez les photons.
- **Étape 2:** Mesures effectuées ! Partagez vos bases avec Alice pour continuer.

- Les bases d'Alice viennent d'arriver !

- **Étape 3:** Supprimez les bits dont les bases ne correspondent pas en cliquant dessus. Après les avoir supprimés, vous aurez la clé secrète.

- Super travail ! Maintenant, attendons le message chiffré d'Alice...

- Le message chiffré d'Alice est arrivé !

- Utilisez la clé secrète pour déchiffrer le message.

- **Félicitations** Vous avez déchiffré le message d'Alice !

### Multi-joueurs: Alice side message display
- titre: Déroulement du jeu
- **Bienvenue dans BB84 !**
- **Étape 1:** Choisissez des bits et des bases aléatoires et déterminez la polarisation des photons.
- Vos photons sont envoyés ! En attente des bases de Bob...
- Les bases de Bob viennent d'arriver !

- **Étape 2:** Supprimez les bits dont les bases ne correspondent pas en cliquant dessus. Après les avoir supprimés, vous aurez la clé secrète.

- Super travail !

- **Étape 3:** Saisissez un message et chiffrez-le en utilisant votre clé secrète. Ensuite, envoyez le message à Bob !
- Votre message a été envoyé ! Maintenant, attendons le déchiffrement de Bob...

- Félicitations Bob a réussi à déchiffrer votre message !

- Votre Bob était ibra

- un buttom: voir les résultats

### Multi-joueurs: Bob side message display
- titre: Déroulement du jeu
- **Bienvenue dans BB84 !**
- En attente des photons d'Alice...
- Les photons d'Alice viennent d'arriver !
- **Étape 1:** Choisissez des bases aléatoires et mesurez les photons.
- **Étape 2:** Mesures effectuées ! Partagez vos bases avec Alice pour continuer.

- Les bases d'Alice viennent d'arriver !

- **Étape 3:** Supprimez les bits dont les bases ne correspondent pas en cliquant dessus. Après les avoir supprimés, vous aurez la clé secrète.
- Super travail ! Maintenant, attendons le message chiffré d'Alice...
- Le message chiffré d'Alice est arrivé !

- Utilisez la clé secrète pour déchiffrer le message.

- **Félicitations** Vous avez déchiffré le message d'Alice !

- Votre Alice était Frédéric

- un button : voir les résultats

### Multi-joueurs: Eve is present message display
#### Alice:

**Étape de validation**

- En attente des autres bits...

- Les bits sont arrivés !

- Sélectionnez valide ou invalide

- Les bits de la clé sélectionnés de façon aléatoire pour la validation sont: 2 3 6 5

--- 

- **Validé !**

- Bob a déterminé que le canal de communication est valide

- Super travail !

- buttom: Redémarrer
- buttom : Valider et envoyer

- Votre message a été envoyé ! Maintenant, attendons le déchiffrement de Bob...


Félicitations Bob a réussi à déchiffrer votre message !

- button Redémarrer
- Votre Bob était ibra

- buttom : voir les résultats

-----

une autre execution (eve is present) and detected, so we redemarer le jeu:

Étape 2: Supprimez les bits dont les bases ne correspondent pas en cliquant dessus. Après les avoir supprimés, vous aurez la clé secrète.

Étape de validation

En attente des autres bits...

Les bits sont arrivés !

Les bits sélectionnés pour la validation sont

Sélectionnez valide ou invalide

Validé !

Bob a déterminé que le canal de communication est valide

Super travail !

Étape 3: Saisissez un message et chiffrez-le en utilisant votre clé secrète. Ensuite, envoyez le message à Bob !


#### Bob: 

Déroulement du jeu

Bienvenue dans BB84 !

En attente des photons d'Alice...

Les photons d'Alice viennent d'arriver !

Étape 1: Choisissez des bases aléatoires et mesurez les photons.

Étape 2: Mesures effectuées ! Partagez vos bases avec Alice pour continuer.

Les bases d'Alice viennent d'arriver !

Étape 3: Supprimez les bits dont les bases ne correspondent pas en cliquant dessus. Après les avoir supprimés, vous aurez la clé secrète.

Étape de validation

En attente des autres bits...

Les bits sont arrivés !

Les bits sélectionnés pour la validation sont

Les bits de la clé sélectionnés de façon aléatoire pour la validation sont: 2 3 6 5

Sélectionnez valide ou invalide

Validé !

Super travail ! Maintenant, attendons le message chiffré d'Alice...

Le message chiffré d'Alice est arrivé !

Utilisez la clé secrète pour déchiffrer le message.

Félicitations Vous avez déchiffré le message d'Alice !

Votre Alice était Frédéric

voir les résultats

ibra note : {Validé !} dans alice est colorer (en gra), ici non. donc courige cela.


-----

une execution pour la 2 eme fois (eve is present) and detected, so we redemarer le jeu:

En attente des autres bits...

Les bits sont arrivés !

Les bits de la clé sélectionnés de façon aléatoire pour la validation sont: 9 10 5 1 8

Sélectionnez valide ou invalide

### Multi-joueurs: Alice Bob bug fix message display
on utilise le meme structure et text pour corriger les messages d'alice et bob.

---------------------------------

Based on my analysis of BB84 and E91 implementations, I'll create a comprehensive YouTrack card with detailed backend and frontend tasks. 

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/bb84/results-page/bb84-results-table.tsx)

Read [](file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/e91/results-page/e91-results-table.tsx)

Perfect! Now I have all the information needed. Here's the comprehensive YouTrack card:

---

# DPS Result Table: Implémenter l'affichage des résultats pour le protocole DPS

### **Titre**
```
Implémenter l'affichage complet des résultats pour le protocole DPS (Backend + Frontend)
```

### **Type**: Feature / Story
### **Priorité**: Moyenne
### **Composants**: Backend (Django Channels), Frontend (React/TypeScript)

---

### **Description**

Actuellement, le protocole DPS n'affiche aucun résultat aux joueurs après la fin d'une partie. Le switch statement dans `ResultsTable` retourne `null` pour le type 'dps', et l'admin voit seulement "La partie est en cours..." même après la fin du jeu.

**Objectif**: Implémenter un système complet de résultats pour DPS suivant le même pattern que BB84 et E91.

---

### **Analyse Technique**

#### **Structure de données actuelle (BB84/E91)**
```typescript
// WebSocket envoie depuis /games/{gameType}/{gameCode}/results/
{
  rooms: [
    {
      player1: number,        // ID du joueur
      player2: number,        // ID du joueur
      iterations: [
        {
          elapsed_time: number,    // temps en secondes
          eve_present: boolean,
          // E91 spécifique:
          eve_detected?: boolean,
          score?: number
        }
      ]
    }
  ],
  game_type: string  // 'bb84', 'e91', ou 'dps'
}
```

#### **Métriques potentielles pour DPS**
- `elapsed_time`: Temps total du jeu (secondes)
- `success`: Message décrypté avec succès (boolean)
- `eve_present`: Eve était présente (boolean)
- `inference_success`: Alice a correctement inféré les phases (boolean)
- `swap_count`: Nombre d'échanges de rôles (si applicable)

---

### **🔧 BACKEND - Tâches Django/Channels**

#### **1. Créer/Modifier le modèle DPS Room Iteration**
**Fichier**: `backend/models.py` (ou équivalent)

**Actions**:
- [ ] Vérifier si le modèle `DPSRoomIteration` existe
- [ ] Ajouter/vérifier les champs suivants:
  ```python
  class DPSRoomIteration(models.Model):
      room = models.ForeignKey(DPSRoom, on_delete=models.CASCADE, related_name='iterations')
      elapsed_time = models.FloatField(default=0)  # Temps en secondes
      success = models.BooleanField(default=False)  # Décryptage réussi
      eve_present = models.BooleanField(default=False)
      inference_success = models.BooleanField(default=False)  # Alice a bien inféré
      created_at = models.DateTimeField(auto_now_add=True)
  ```
- [ ] Créer les migrations: `python manage.py makemigrations`
- [ ] Appliquer les migrations: `python manage.py migrate`

#### **2. Implémenter le tracking du temps de jeu**
**Fichier**: `backend/consumers.py` (consumer DPS)

**Actions**:
- [ ] Dans `DPS_START_EVENT`: enregistrer `start_time = timezone.now()`
- [ ] Dans `DPS_END_EVENT` ou après décryptage réussi:
  ```python
  elapsed_time = (timezone.now() - start_time).total_seconds()
  DPSRoomIteration.objects.create(
      room=room,
      elapsed_time=elapsed_time,
      success=message_decrypted_successfully,
      eve_present=room.eve_present,
      inference_success=alice_inference_correct
  )
  ```

#### **3. Créer le consumer pour l'endpoint results**
**Fichier**: `backend/consumers.py`

**Actions**:
- [ ] Vérifier si `DPSResultsConsumer` existe
- [ ] Si non, créer en s'inspirant de `BB84ResultsConsumer` / `E91ResultsConsumer`:
  ```python
  class DPSResultsConsumer(AsyncWebsocketConsumer):
      async def connect(self):
          # Join group pour mises à jour en temps réel
          
      async def send_results(self):
          rooms = DPSRoom.objects.filter(game__code=game_code)
          serialized_rooms = [
              {
                  'player1': room.player1.id,
                  'player2': room.player2.id,
                  'iterations': [
                      {
                          'elapsed_time': iter.elapsed_time,
                          'success': iter.success,
                          'eve_present': iter.eve_present,
                          'inference_success': iter.inference_success,
                      }
                      for iter in room.iterations.all()
                  ]
              }
              for room in rooms
          ]
          await self.send(text_data=json.dumps({
              'rooms': serialized_rooms,
              'game_type': 'dps'
          }))
  ```

#### **4. Broadcaster les résultats après fin de partie**
**Fichier**: `backend/consumers.py` (consumer principal DPS)

**Actions**:
- [ ] Après création de `DPSRoomIteration`, broadcaster aux résultats:
  ```python
  # Dans DPS_END_EVENT ou après décryptage
  await channel_layer.group_send(
      f'dps_results_{game_code}',
      {
          'type': 'send_results',
          'message': 'Game completed'
      }
  )
  ```

#### **5. Tester le backend**
- [ ] Jouer une partie DPS complète
- [ ] Vérifier que `DPSRoomIteration` est créé en DB
- [ ] Tester WebSocket `/games/dps/{code}/results/` dans console navigateur
- [ ] Vérifier que les données sont envoyées au bon format

---

### **🎨 FRONTEND - Tâches React/TypeScript**

#### **1. Créer le dossier et fichiers**
**Structure**:
```
components/dps/results-page/
├── dps-results-table.tsx
└── dps-results-row.tsx
```

#### **2. Ajouter les clés de localisation**
**Fichier**: dps-lines.ts

**Actions**:
- [ ] Ajouter pour l'anglais (index 0):
  ```typescript
  'component.dps.results.room': 'Room',
  'component.dps.results.success': 'Success',
  'component.dps.results.evePresent': 'Eve Present',
  'component.dps.results.inferenceSuccess': 'Inference Success',
  'component.dps.results.time': 'Time',
  'component.dps.results.noRooms': 'No rooms have finished playing yet',
  ```
- [ ] Ajouter pour le français (index 1):
  ```typescript
  'component.dps.results.room': 'Salle',
  'component.dps.results.success': 'Succès',
  'component.dps.results.evePresent': 'Eve Présente',
  'component.dps.results.inferenceSuccess': 'Inférence Réussie',
  'component.dps.results.time': 'Temps',
  'component.dps.results.noRooms': 'Aucune salle n\'a terminé de jouer',
  ```
- [ ] Ajouter pour l'espagnol (index 2):
  ```typescript
  'component.dps.results.room': 'Sala',
  'component.dps.results.success': 'Éxito',
  'component.dps.results.evePresent': 'Eve Presente',
  'component.dps.results.inferenceSuccess': 'Inferencia Exitosa',
  'component.dps.results.time': 'Tiempo',
  'component.dps.results.noRooms': 'Ninguna sala ha terminado de jugar',
  ```

#### **3. Créer DpsResultsRow**
**Fichier**: `components/dps/results-page/dps-results-row.tsx`

**Code**:
```tsx
import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';

interface DpsResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const DpsResultsRow = ({room, player1, player2}: DpsResultsRowProps) => {
    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{room.iterations.map(
                ({success}: any, index: number) => <p
                    key={index}>{success ? 'Yes' : 'No'}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({eve_present}: any, index: number) => <p
                    key={index}>{eve_present ? 'Yes' : 'No'}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({inference_success}: any, index: number) => <p
                    key={index}>{inference_success ? 'Yes' : 'No'}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(elapsed_time)}`}</p>)}</TableCell>
        </TableRow>
    );
};

export default DpsResultsRow;
```

#### **4. Créer DpsResultsTable**
**Fichier**: `components/dps/results-page/dps-results-table.tsx`

**Code**:
```tsx
import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DpsResultsRow from '@/components/dps/results-page/dps-results-row';
import { useLanguage } from '@/components/providers/language-provider';

interface ResultsTableProps {
    rooms: any[];
    players: any[];
}

const DpsResultsTable = ({rooms, players}: ResultsTableProps) => {

    const {localize} = useLanguage();

    const getPlayerName = (playerId: number) => {
        return players.filter(player => player.id === playerId)[0]?.name;
    };

    const sortRooms = () => {
        return rooms.sort((a, b) => {
            const shortestA = Math.min(...a.iterations.map((iter: any) => iter.elapsed_time));
            const shortestB = Math.min(...b.iterations.map((iter: any) => iter.elapsed_time));
            return shortestA - shortestB;
        });
    }

    return (
        <div
            className="mt-4 block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table>
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg">
                        <TableHead>{localize('component.dps.results.room')}</TableHead>
                        <TableHead>{localize('component.dps.results.success')}</TableHead>
                        <TableHead>{localize('component.dps.results.evePresent')}</TableHead>
                        <TableHead>{localize('component.dps.results.inferenceSuccess')}</TableHead>
                        <TableHead>{localize('component.dps.results.time') + ' (s)'}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortRooms().map((room, index) => <DpsResultsRow key={index}
                                                                room={room}
                                                                player1={getPlayerName(
                                                                    room.player1)}
                                                                player2={getPlayerName(
                                                                    room.player2)}/>)}
                </TableBody>
            </Table>
            {rooms.length === 0 && <p className='font-bold text-lg text-center py-2'>{localize('component.dps.results.noRooms')}</p>}
        </div>
    );
};

export default DpsResultsTable;
```

#### **5. Mettre à jour ResultsTable**
**Fichier**: page.tsx

**Actions**:
- [ ] Importer le composant:
  ```tsx
  import DpsResultsTable from '@/components/dps/results-page/dps-results-table';
  ```
- [ ] Ajouter le case dans le switch (ligne ~26):
  ```tsx
  case 'dps':
      return <DpsResultsTable rooms={rooms.filter(room => {
          return room.iterations.some(
              (iter: any) => iter.elapsed_time > 0);
      })}
                              players={players} {...props} />;
      break;
  ```

#### **6. Supprimer le message temporaire admin**
**Fichier**: page.tsx

**Actions**:
- [ ] Remplacer la condition ligne 115-121:
  ```tsx
  // AVANT:
  {gameType === 'dps' && isAdmin ? (
       <h1 className="text-3xl font-bold text-center mt-10">
       La partie est en cours...
     </h1>
  ) : (
      <ResultsTable gameType={gameType} rooms={rooms} players={players} />
  )}
  
  // APRÈS:
  <ResultsTable gameType={gameType} rooms={rooms} players={players} />
  ```

#### **7. Tester le frontend**
- [ ] Compiler sans erreurs TypeScript
- [ ] Jouer une partie DPS complète
- [ ] Vérifier que le tableau s'affiche pour admin
- [ ] Vérifier que le tableau s'affiche pour joueurs
- [ ] Tester les 3 langues (EN, FR, ES)
- [ ] Vérifier le tri par temps (plus rapide en premier)
- [ ] Vérifier le message "No rooms finished" quand aucune partie terminée

---

### **✅ Critères d'Acceptation**

1. **Backend**:
   - [ ] Le modèle `DPSRoomIteration` enregistre correctement toutes les données
   - [ ] Le WebSocket `/games/dps/{code}/results/` envoie les données au bon format
   - [ ] Les résultats sont mis à jour en temps réel après chaque partie
   - [ ] Le temps écoulé est calculé correctement (en secondes)

2. **Frontend**:
   - [ ] Le tableau des résultats s'affiche pour tous les joueurs (admin et non-admin)
   - [ ] Les colonnes affichent: Room, Success, Eve Present, Inference Success, Time
   - [ ] Les traductions fonctionnent en EN, FR, ES
   - [ ] Le tri par temps fonctionne (plus rapide en premier)
   - [ ] Le message "No rooms finished" s'affiche quand aucune partie n'est terminée
   - [ ] Le design est cohérent avec BB84 et E91

3. **Intégration**:
   - [ ] Une partie DPS complète enregistre les résultats
   - [ ] Les résultats persistent après rafraîchissement de la page
   - [ ] Plusieurs parties dans le même jeu s'affichent correctement

---

### **🔍 Points d'Attention**

1. **DPS a un workflow différent de BB84/E91**:
   - Échange de rôles possible (Alice/Bob swap)
   - Inférence de phase par Alice (métrique unique)
   - Pas de "validation bits" comme BB84

2. **Quand enregistrer les résultats**:
   - Option A: Après décryptage réussi du message par Alice
   - Option B: À la fin de chaque swap de rôles
   - **À décider avec l'équipe backend**

3. **WebSocket déjà configuré**:
   - L'endpoint `/games/dps/{code}/results/` devrait déjà exister (routing)
   - Vérifier dans `routing.py` backend

---

### **📦 Livrables**

**Backend**:
- Modèle `DPSRoomIteration` avec migrations
- Consumer `DPSResultsConsumer` fonctionnel
- Tests unitaires pour le tracking du temps

**Frontend**:
- `components/dps/results-page/dps-results-table.tsx`
- `components/dps/results-page/dps-results-row.tsx`
- Clés de localisation dans dps-lines.ts
- Mise à jour de page.tsx avec case 'dps'

**Documentation**:
- README ou wiki avec structure des données DPS results
- Commit messages détaillés

---

### **🕒 Estimation**

- **Backend**: 3-4 heures
  - Modèle + migrations: 1h
  - Consumer + tracking: 2h
  - Tests: 1h

- **Frontend**: 2-3 heures
  - Composants table + row: 1.5h
  - Localisation: 0.5h
  - Intégration + tests: 1h

**Total: ~6-7 heures**

---

### **🔗 Dépendances**

- Aucune dépendance bloquante
- S'inspire de l'implémentation existante BB84/E91
- Peut être développé en parallèle (backend/frontend)

---

### **📝 Notes Techniques Supplémentaires**

**Différences avec BB84/E91**:
- BB84 affiche les itérations en colonnes séparées (Iteration 1, 2, 3...)
- E91 affiche toutes les itérations dans une même ligne (plusieurs <p>)
- **Recommandation DPS**: Suivre le pattern E91 (plus compact)

**Filtrage des résultats**:
```tsx
rooms.filter(room => {
    return room.iterations.some((iter: any) => iter.elapsed_time > 0);
})
```
Ce filtre exclut les parties non terminées (elapsed_time = 0).

---

**Créé le**: 12 novembre 2025  
**Assigné à**: [À définir]  
**Sprint**: [Sprint actuel]  
**Tags**: `feature`, `dps`, `results`, `backend`, `frontend`, `full-stack`


## DPS: Implémenter tableau des résultats (YOUTRACK CARD)

**Backend**: Créer modèle `DPSRoomIteration` avec champs `elapsed_time`, `success`, `eve_present`, `inference_success` + consumer WebSocket results

**Frontend**: Créer `dps-results-table.tsx` et `dps-results-row.tsx`, ajouter clés in (EN/FR/ES), ajouter case 'dps' dans ResultsTable switch

**Note**: Pattern identique à BB84/E91, estimation 6-7h total
---------------------------------

# Desplay table Results correctly
In BB84 results page, the results table is not displayed correctly at the end of game.

## Senario work good:
If all players finish the game correctly, then each of them click on "see results" button, then the results table is displayed correctly for admin and players.

## Senario with problem:
If a given player (alice and Bob) do not click on "see results" button, so the result will not be displayed at all, not for admin, not for other players.
Even if the 2 players finish the game correctly.

---------------------------------
# bug and problem to fix

## player joint after the game begin
- ther is no name
- they take automaticaly (maybe) the last palyer begor the game start. so we will have like one bob vs 2 (or all the players come after the game begin) as alice.

==> simple solution: just block the joint after the game begin. with a message: game is in progress, you can't join now.

Solution more complex: allow joint after the game begin:
- and joint play agains the computer random player (alice or bob).

## dps: Results for game ****
The page show the message:
```text
  Results for game Z22UQ
La partie est en cours...
````

But at the end of game, there is no result table. It is still in this state ...
even the game is finished ...

## BB84 player kicked out at the end

Somtimes, At the end of game, Bob is kicked out of the game, without being abale to see the buttom see results.
- this behavior when I directly click on validate on the choice of base concilation, so the system automaticaly clor the incorrect with red, so I see them, and click on them , without the need to realy see the bases and get the correct results.

## BB84 With EVE, alice and bob key mismatch at the end

At the end of game with Eve, sometimes Alice and Bob have different keys, even after validation step.

Alice : 

- key : `1101101` (left to right --> top to bottom as qiskit)
- message d'alice 7 bits: `1111111`
- result xor : `0010010` --> message chiffré

Bob:
- key : `1111111`
- message d'alice chiffré: `0010010`
- result xor : `1101101` --> message déchiffré

Because keys are different, the message is different.

Possible  Cause: it may be eve is here, and we coudn't detect it, since we check only bits that eve doesn't touch during validation step.

Todo: 
- Need to check this , and if this is normal or not.

- Need really check the key match after validation step, if not match, show error message and restart game.

---

# 🐛 Display Results Table Correctly (Backend Bug)

## 📋 **YouTrack Card**

**Title**: `Fix BB84 Results Table - Backend Never Records elapsed_time After Game Completion`

**Type**: Bug (Critical)  
**Priority**: High  
**Component**: Backend (Django Channels - BB84 Consumer)

---

## 🎯 **Abstract**

Players complete BB84 games successfully (receive SUCCESS messages, see congratulations), but the admin results table shows **zero finished rooms**. Root cause: Backend sends `B_SUCCESS` WebSocket event but **never calculates or saves `elapsed_time` to database**, leaving it at default value `0`. Frontend filter correctly excludes rooms with `elapsed_time = 0`, resulting in empty results table.

**Impact**: 
- ❌ Completed games invisible to admin
- ❌ Players cannot see results table even after clicking "Show Results"
- ❌ Game statistics lost (no time tracking)
- ✅ Frontend working correctly (filter logic is correct)

---

## 🔍 **Key Points**

### **What Works**
- ✅ Players receive all game events (PHOTONS → BASES → KEY → CIPHER → SUCCESS)
- ✅ Success messages displayed correctly ("Félicitations!")
- ✅ Backend creates rooms and sends WebSocket data
- ✅ Frontend filter logic correct (`elapsed_time > 0`)

### **What's Broken**
- ❌ Backend never calculates elapsed_time
- ❌ `elapsed_time` stays at default value `0` in database
- ❌ WebSocket closes immediately after B_SUCCESS (code 1006)
- ❌ Results table shows "No rooms finished" even after game completion

---

## 🔬 **Evidence from Console Logs**

### **Player Console (Bob - Frédérique)**
```javascript
socket-provider.tsx:456 B_SUCCESS  ← ✅ Game completed!
socket-provider.tsx:446 CloseEvent {code: 1006}  ← ❌ Connection closed
```

### **Admin Console**
```javascript
Total Rooms Received: 2
Room [154-153]: ❌ NOT FINISHED (1 iterations)  ← elapsed_time = 0
Room [155-152]: ❌ NOT FINISHED (1 iterations)  ← elapsed_time = 0
Rooms After Filter: 0  ← 🚨 EMPTY TABLE
```

**Analysis**: Both players completed game + received SUCCESS, but backend never updated `elapsed_time` field.

---

## 🛠️ **Backend Fix Required**

### **File**: `backend/bb84/consumers.py`

### **Current Flow (Broken)**
```python
async def handle_cipher_decryption(self, event):
    # Bob successfully decrypts Alice's message
    
    # Send SUCCESS to both players
    await self.channel_layer.group_send(
        f"room_{room_id}",
        {"type": "B_SUCCESS", "message": "Congratulations!"}
    )
    
    # ❌ PROBLEM: elapsed_time is NEVER calculated/saved here!
    # iteration.elapsed_time = time.time() - start_time  ← MISSING
    # iteration.save()  ← MISSING
    
    # WebSocket closes shortly after
    await self.close()
```

### **Required Fix**
```python
async def handle_cipher_decryption(self, event):
    """When Bob successfully decrypts Alice's message"""
    
    # ✅ FIX: Calculate and save elapsed_time BEFORE sending B_SUCCESS
    iteration = get_current_iteration(room)
    elapsed_time = time.time() - iteration.start_time  # Calculate duration
    
    iteration.elapsed_time = elapsed_time
    iteration.save()  # ← MUST save to database FIRST
    
    # THEN send success messages
    await self.send_b_success(room, iteration)
    
    # Broadcast to results page
    await self.channel_layer.group_send(
        f'bb84_results_{game_code}',
        {'type': 'send_results'}
    )
```

### **Key Requirements**
1. **Save elapsed_time BEFORE WebSocket events** (prevent race condition)
2. **Use transaction** to ensure database commit before connection closes
3. **Record start_time** when room iteration begins (in `B_START_EVENT` or equivalent)
4. **Broadcast to results group** after successful save

---

## 🧪 **Testing Checklist**

### **Backend Tests**
- [ ] Create BB84 game with 4 players (2 rooms)
- [ ] Complete both games to SUCCESS
- [ ] Query database: verify `elapsed_time > 0` for both rooms
- [ ] Check WebSocket payload has correct `elapsed_time` value
- [ ] Verify results broadcast happens after save

### **Frontend Tests**
- [ ] Play game without clicking "Show Results"
- [ ] Admin should see entry in results table automatically
- [ ] Click "Show Results" - table should show same data
- [ ] Refresh page - results should persist
- [ ] Multiple games in same session - all results visible

### **Edge Cases**
- [ ] WebSocket disconnects mid-game - ensure no partial saves
- [ ] Multiple simultaneous games - correct room pairing
- [ ] Eve present games - elapsed_time still recorded
- [ ] Solo games - elapsed_time recorded for bot games

---

## 📊 **Expected Behavior After Fix**

| Scenario                         | Before Fix                 | After Fix                     |
| -------------------------------- | -------------------------- | ----------------------------- |
| **Players finish game**          | elapsed_time = 0           | elapsed_time = actual_seconds |
| **Admin sees results**           | Empty table                | Shows completed rooms         |
| **Players click "Show Results"** | Empty table                | Shows their result + others   |
| **WebSocket closes**             | Data lost                  | Data saved before close       |
| **Database query**               | All rooms elapsed_time = 0 | Completed rooms > 0           |

---

## 🔗 **Related Issues**

- Frontend debug logs added (already working correctly)
- Results table filter logic validated (works as designed)
- WebSocket connection handling needs review (code 1006 = abnormal close)

---

## 💡 **Additional Improvements** (Optional)

1. **Add start_time tracking**:
   ```python
   # In B_START_EVENT or room creation
   iteration.start_time = timezone.now()
   iteration.save()
   ```

2. **Add error handling**:
   ```python
   try:
       iteration.elapsed_time = calculate_elapsed_time()
       iteration.save()
   except Exception as e:
       logger.error(f"Failed to save elapsed_time: {e}")
       # Don't send B_SUCCESS if save fails
   ```

3. **Add logging**:
   ```python
   logger.info(f"Room {room.id} completed in {elapsed_time}s")
   ```

4. **Add metrics**:
   - Track average game duration
   - Track completion rate
   - Track rooms with elapsed_time = 0 (incomplete games)

---

## 📝 **Commit Message Template**

```
fix(bb84): record elapsed_time before sending B_SUCCESS

Problem: Completed games show elapsed_time=0, causing empty results table

Root cause: Backend sends B_SUCCESS WebSocket event but never calculates
or saves elapsed_time to database. WebSocket closes immediately after,
preventing any post-SUCCESS saves.

Solution:
- Calculate elapsed_time when Bob decrypts message successfully
- Save to database BEFORE sending B_SUCCESS event
- Use transaction to ensure commit before WebSocket close
- Broadcast results update after successful save

Result: Admin sees completed games in real-time, results persist across
page refreshes, players can view results table correctly.

Fixes: Results table showing "No rooms finished" despite completed games
```

---

## 🎫 **Acceptance Criteria**

- [x] Players complete game and receive SUCCESS message
- [ ] Backend saves `elapsed_time > 0` to database BEFORE B_SUCCESS
- [ ] Admin results table shows completed room automatically
- [ ] Players see results table after clicking "Show Results"
- [ ] Results persist after page refresh
- [ ] Multiple games in same session all display correctly
- [ ] WebSocket closes gracefully after data is saved
- [ ] No race conditions between save and WebSocket close

---

**Created**: November 14, 2025  
**Reported by**: User testing (4 player game test)  
**Affects versions**: Current production  
**Fix version**: Next release  
**Estimated effort**: 2-3 hours (backend fix + testing)


### 20. 🔴 Architecture: Proper Offline Restoration for Multiplayer Tabs
**Status**: 🔴 TODO - HIGH PRIORITY
**Context**: Currently, refreshing a completed multiplayer game redirects to the *Results Table* (Issue #14 workaround). It should stay on the *Game Page*.
**Root Cause**: Multiplayer components (`CHSH-tab`, `messaging-tab`) assume "Always Online" WebSocket connection and lack "Offline" restoration logic.

**Implementation Plan**:
1.  **Main Game Container** ([components/e91/play-page/game.tsx](cci:7://file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/e91/play-page/game.tsx:0:0-0:0)):
    *   **Action**: Remove the `useEffect` redirection logic that forces the user to the results page when `gameData.gameSuccess` is true.

2.  **CHSH Tab** ([components/e91/play-page/tabs/CHSH-tab.tsx](cci:7://file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/e91/play-page/tabs/CHSH-tab.tsx:0:0-0:0)):
    *   **Action**: Add `useEffect` to restore state from `localStorage` on mount (offline mode).
    *   **Reference**: Copy logic from [solo-CHSH-tab.tsx](cci:7://file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/e91/play-page/tabs/solo-CHSH-tab.tsx:0:0-0:0) (lines ~60-100).
    *   **Requirement**: Manually set component state (`setAliceBits`, `setSValue`, etc.) from the saved `e91GameData`.

3.  **Messaging Tab** ([components/e91/play-page/tabs/messaging-tab.tsx](cci:7://file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/e91/play-page/tabs/messaging-tab.tsx:0:0-0:0)):
    *   **Action**: Add `useEffect` to restore chat history.
    *   **Reference**: Copy logic from [solo-messaging-tab.tsx](cci:7://file:///Users/chei2402/Documents/github/algolab-quantique/quantumcrypto-frontend/components/e91/play-page/tabs/solo-messaging-tab.tsx:0:0-0:0).

**Goal**: Treat game completion as an "Offline Mode" where the browser's `localStorage` is the source of truth, not the WebSocket.

---

# 🎮 DPS Solo Mode Implementation Plan

**Created**: January 5, 2026  
**Status**: ✅ DONE  
**Completed**: March 2026  
**Priority**: HIGH  
**Reference**: E91 Solo Mode (already implemented and working)

> **Note (March 4, 2026):** All 6 phases are complete. DPS uses a unified `lib/dps/dps-protocol.ts` (916 lines)
> instead of a separate `solo-player.ts` — valid design choice. Solo mode has 5 dedicated tab components,
> a dedicated `/dps/solo` route, and a solo game modal with role selection (Alice/Bob). Tested and working.

---

## 📋 Overview

Implement **solo mode for DPS** following the exact same pattern as E91 solo mode:
- **New files only** - No changes to existing multiplayer code
- **Same interface** for the player - Identical experience to multiplayer
- **Local simulation** - The "partner" is the computer
- **Step-by-step implementation** with testing at each step

---

## 📁 Files to Create

| E91 Solo Mode (Reference)                      | DPS Solo Mode (TO CREATE)                            | Status        |
| ---------------------------------------------- | ---------------------------------------------------- | ------------- |
| `lib/e91/solo-player.ts`                       | `lib/dps/dps-protocol.ts` (unified)                  | ✅ DONE         |
| `components/e91/home-page/solo-game-modal.tsx` | `components/dps/home-page/solo-game-modal.tsx`       | ✅ DONE         |
| `components/e91/play-page/solo-game.tsx`       | `components/dps/play-page/solo-game.tsx`             | ✅ DONE         |
| `solo-measurement-tab.tsx`                     | `solo-alice-exchange-tab.tsx`                        | ✅ DONE         |
| `solo-basis-tab.tsx`                           | `solo-bob-exchange-tab.tsx`                          | ✅ DONE         |
| `solo-CHSH-tab.tsx`                            | `solo-alice-inference-tab.tsx`                       | ✅ DONE         |
| `solo-messaging-tab.tsx`                       | `solo-alice-messaging-tab.tsx`                       | ✅ DONE         |
| N/A (E91 symmetric)                            | `solo-bob-messaging-tab.tsx`                         | ✅ DONE         |
| `app/(main)/e91/solo-results/page.tsx`         | `app/(main)/dps/solo/page.tsx`                       | ✅ DONE         |
| `solo-results-table.tsx`                       | N/A (handled in solo-game.tsx)                       | ✅ DONE         |

---

## 🎮 DPS Protocol Flow (Multiplayer → Solo Mapping)

### Alice's Flow (3 tabs)
| Step | Tab       | Multiplayer Action                | Solo Mode Simulation                            |
| ---- | --------- | --------------------------------- | ----------------------------------------------- |
| 1    | Exchange  | Send phases via WebSocket         | Store locally, simulate Bob's time measurements |
| 2    | Inference | Receive Bob's times via WebSocket | Use simulated Bob's times                       |
| 3    | Messaging | Send encrypted message            | Local encryption/verification                   |

### Bob's Flow (2 tabs)
| Step | Tab       | Multiplayer Action                 | Solo Mode Simulation                         |
| ---- | --------- | ---------------------------------- | -------------------------------------------- |
| 1    | Exchange  | Receive Alice's phases, send times | Simulate Alice's phases, store times locally |
| 2    | Messaging | Decrypt message                    | Local decryption                             |

---

## 📝 Implementation Phases

### Phase 1: Core Simulation (`lib/dps/dps-protocol.ts`)
**Status**: ✅ DONE

Used unified `dps-protocol.ts` (916 lines) instead of a separate solo-player file.
Includes `generateRandomPhases()`, pulse train simulation, Bob time measurement, Alice inference.

---

### Phase 2: Solo Game Modal (`components/dps/home-page/solo-game-modal.tsx`)
**Status**: ✅ DONE (321 lines)

Role selection (Alice/Bob), game settings, navigates to `/dps/solo`.

---

### Phase 3: Solo Game Container (`components/dps/play-page/solo-game.tsx`)
**Status**: ✅ DONE (189 lines)

Renders all 5 solo tabs conditionally by role.

---

### Phase 4: Solo Tab Components
**Status**: ✅ DONE

- `solo-alice-exchange-tab.tsx` (367 lines) ✅
- `solo-bob-exchange-tab.tsx` (258 lines) ✅
- `solo-alice-inference-tab.tsx` (210 lines) ✅
- `solo-alice-messaging-tab.tsx` (237 lines) ✅
- `solo-bob-messaging-tab.tsx` (288 lines) ✅

---

### Phase 5: Route & Navigation
**Status**: ✅ DONE

- `app/(main)/dps/solo/page.tsx` exists (19 lines)
- DPS game form has Play Solo button connected to solo modal

---

### Phase 6: Localization & Polish
**Status**: ✅ DONE

Uses shared localization keys from `lang/quantumcrypto-lines.ts` (EN/FR/ES).

---

## 🔧 Key Differences from E91

| Aspect             | E91                                 | DPS                               |
| ------------------ | ----------------------------------- | --------------------------------- |
| **Role symmetry**  | Alice and Bob symmetric (same tabs) | Alice and Bob have DIFFERENT tabs |
| **Tab count**      | 4 tabs for both                     | Alice: 3 tabs, Bob: 2 tabs        |
| **Data type**      | Bases + bits                        | Phases + time measurements        |
| **Key generation** | Matching bases                      | Phase inference from times        |

---

## ⏱️ Time Estimates

| Phase                          | Estimated Time  |
| ------------------------------ | --------------- |
| Phase 1: Core Simulation       | 2-3 hours       |
| Phase 2: Solo Game Modal       | 1-2 hours       |
| Phase 3: Solo Game Container   | 1 hour          |
| Phase 4: Solo Tab Components   | 4-6 hours       |
| Phase 5: Route & Navigation    | 1-2 hours       |
| Phase 6: Localization & Polish | 1 hour          |
| **Total**                      | **10-15 hours** |

---

## ✅ Testing Strategy

### After Each Phase
1. Verify no multiplayer code affected (run multiplayer game)
2. Test the specific feature implemented
3. Check localStorage persistence (refresh page)

### Full Integration Test
1. Start solo game as Alice → complete all steps → see results
2. Start solo game as Bob → complete all steps → see results
3. Test with Eve enabled → verify detection works
4. Refresh page mid-game → verify restoration works

---

## 📝 Notes

- **Backend reference needed**: Check DPS `consumers.py` for simulation logic (especially time measurement and phase inference)
- **Same pattern as E91**: Keep implementation consistent with E91 solo mode for maintainability
- **No multiplayer changes**: All new files, never modify existing multiplayer components

---

## 🔧 DPS UI/UX Improvements (Low Priority - Protocol Accuracy)

These issues were identified during code review. The current implementation works but doesn't perfectly reflect the DPS protocol conceptually.

### Issue 1: Bob's Time Deletion UI (Protocol Mismatch)

**Current Behavior:**
- Bob sees times T0, T1, T2, T3 in his UI
- Bob is asked to **delete/discard** T0 and T3 manually BEFORE sending to Alice
- After deletion, Bob sends filtered times to Alice

**Correct Protocol Behavior:**
- Bob should send **ALL times** (T0, T1, T2, T3) to Alice
- AFTER sending, both Alice and Bob compute the key using **only T1 and T2**
- T0 and T3 are discarded during KEY COMPUTATION, not before communication

**Why This Matters:**
- The current UI suggests Bob "filters" before sending, which is conceptually wrong
- In the real protocol, Bob publicly announces ALL detection times
- The filtering happens AFTER, during key extraction

**Proposed Fix:**
- [ ] Remove the "discard T0/T3" step from Bob's exchange UI
- [ ] Bob sends all times to Alice
- [ ] Both parties filter T0/T3 when computing the key (not during exchange)
- [ ] Update UI messages to reflect this

**Files to Modify:**
- `components/dps/play-page/tabs/bob-exchange-tab.tsx` - Remove discard step
- `components/dps/play-page/tabs/alice-inference-tab.tsx` - Already correct (filters during key computation)
- `components/dps/play-page/tabs/bob-messaging-tab.tsx` - Already correct

---

### Issue 2: Alice's Time Display Order (T3, T2, T1, T0 vs T0, T1, T2, T3)

**Current Behavior:**
- In Alice's inference tab, times are displayed in reverse order: T3, T2, T1, T0 (right to left)
- This might be intentional to show "arrival order" (T0 arrives first = rightmost)

**Question:**
- Is this the best visual representation?
- Should we show T0, T1, T2, T3 (left to right) for consistency with how we talk about them?

**Proposed Actions:**
- [ ] Evaluate if current display order is pedagogically clear
- [ ] If confusing, change to T0, T1, T2, T3 order (left to right)
- [ ] Add visual labels/legend explaining the time relationship to pulses

**Files to Check:**
- `components/dps/play-page/tabs/alice-inference-tab.tsx` - Table display order

---

### Priority: LOW
These are cosmetic/pedagogical improvements. The protocol works correctly - this is about making the UI better reflect the actual protocol steps.

### When to Address:
- After completing DPS Solo Mode implementation
- After DPS Results Table implementation
- During a "polish" phase

---

### Issue 3: Eve Implementation for DPS (LOW PRIORITY)

**Status:** Not implemented in multiplayer or solo mode

**Design Questions:**
- At which step does Eve intercept?
- What information can Eve learn?
- How do Alice and Bob detect Eve's presence?
- What error rate indicates eavesdropping?

**Proposed Actions:**
- [ ] Research DPS eavesdropping detection mechanism

---

## 🔧 TECH DEBT & TOOLING (February 2026)

**Date Added**: February 11, 2026  
**Priority**: 🟡 MEDIUM

### Issue 1: No Testing Framework

**Status:** ⬜ TODO

Currently the project has **zero** test infrastructure — no Jest, Vitest, Playwright, or Cypress. This means:
- No unit tests for utility functions (e.g., `lib/bb84/utils.ts`, `lib/e91/utils.ts`)
- No component tests for complex UI (play pages, results pages)
- No end-to-end tests for game flows

**Recommendation:** Install **Vitest** (fast, native ESM support, works great with Next.js) for unit/component tests, and optionally **Playwright** for E2E tests later.

**Proposed Actions:**
- [ ] Install Vitest + @testing-library/react
- [ ] Write tests for critical utility functions first
- [ ] Add component tests for key flows
- [ ] Consider Playwright for E2E game flow tests later

---

### Issue 2: ESLint Version Mismatch

**Status:** ⬜ TODO

`eslint-config-next` is at version `14.0.4` while Next.js itself is at `14.2.33`. This won't break anything right now, but the ESLint plugin may miss new rules/fixes introduced in later 14.x versions.

**Fix:** Run `npm install eslint-config-next@14.2.33 --save-dev` to align versions.

**Proposed Actions:**
- [ ] Update eslint-config-next to match Next.js version

---

### Issue 3: Duplicate UI Libraries (@nextui-org/react + Radix UI)

**Status:** ✅ RESOLVED (February 12, 2026)

The project had two UI component libraries: Radix UI (used everywhere) and @nextui-org/react (only used for `Avatar` in 3 waiting-room player-card files).

**What was done:**
- [x] Searched codebase — only `Avatar` was imported from `@nextui-org/react` (3 files)
- [x] Replaced with Tailwind + lucide-react `User` icon (same look)
- [x] Ran `npm uninstall @nextui-org/react` — **removed 232 packages**

---

### Issue 4: Player Avatar System (Future Enhancement)

**Status:** ⬜ TODO — Low priority  
**Date Added**: February 12, 2026

Currently the player avatar in waiting rooms is a simple placeholder icon (User silhouette). In the future, this could be enhanced to give players a visual identity.

**Options (easiest → hardest):**

| Option                     | Description                                                                                                                       | Effort   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **A) Default avatar list** | Provide 8-10 pre-made avatars (quantum-themed icons/animals). Player picks one when creating/joining a game. No upload needed.    | Low      |
| **B) Initials-based**      | Auto-generate avatar from player name initials with random background color (e.g., "AB" in a blue circle). Zero effort from user. | Very Low |
| **C) Gravatar / DiceBear** | Use an external API like DiceBear to auto-generate unique avatars from the player name. Free, no uploads.                         | Low      |
| **D) Image upload**        | Let users upload their own photo. Requires backend storage (S3/cloud), image resizing, moderation.                                | High     |

**Recommendation:** Option **B (initials)** or **C (DiceBear API)** — both are lightweight, require no backend changes, and give players a unique visual identity without any upload complexity.

**Proposed Actions:**
- [ ] Decide on approach (A, B, C, or D)
- [ ] Implement in `PlayerCard` component (shared across BB84, E91, DPS)
- [ ] Optionally store avatar choice in player store (zustand)

---

### Issue 4: No Code Formatter (Prettier)

**Status:** ⬜ TODO

No Prettier or similar formatter is configured. Code formatting is inconsistent across files (mixed quote styles, inconsistent indentation in some places).

**Proposed Actions:**
- [ ] Install Prettier + eslint-config-prettier
- [ ] Add `.prettierrc` with team preferences
- [ ] Run initial format pass on codebase
- [ ] Add Eve option to create-game-modal (multiplayer)
- [ ] Add Eve option to solo-game-modal (solo)
- [ ] Implement Eve interception logic
- [ ] Implement Eve detection/error rate checking

---
---

# 🎮 PLATFORM EVOLUTION PLAN — From "Form" to "Game"

**Date Created**: February 17, 2026  
**Context**: V3 landing page presented to students — positive visual feedback, but students noted the protocol game pages feel like "dead forms" rather than a real game. Below is the full roadmap.

---

## 📌 SHORT-TERM: V3 Visual Upgrade → Protocol Pages (Task 2)

**Status**: ✅ DONE  
**Goal**: Apply V3 landing page design elements to BB84/E91/DPS protocol pages  
**Approach**: Applied directly to live pages (BB84, E91, DPS) — future sandbox routes also created

### What to Apply from V3
- ✅ Atmospheric Background (particles, grain, glow)
- ✅ Green Neon Glow on Hover (`shadow-[0_0_30px_...]`)
- ✅ Glassmorphism Cards (`backdrop-blur`, `bg-card/80`)
- ✅ Section Divider Waves
- ✅ CTA Button Style (border-primary, hover glow)
- ⚠️ Alice/Bob Character Art (decorative, optional)

### What NOT to Apply
- ❌ Hero Section Layout (protocol pages need game form first)
- ❌ Mission Card Grid (already have their own navigation)
- ❌ Landing Page Typography Scale (too large for protocol context)

### Implementation Steps
- [x] Create sandbox route `/bb84_future` ✅
- [x] Apply AtmosphericBackground to protocol pages ✅
- [x] Apply V3 card styles to game form (glassmorphism + glow) ✅
- [x] Apply V3 button styles to all CTAs (Jouer solo, Créer, Rejoindre) ✅
- [x] Apply V3 styles to "How to Play" section ✅ (shared component)
- [x] Style sidebar with V3 active glow ✅
- [x] Verify in browser (Dark + Light mode) ✅
- [x] Replicate for E91 and DPS ✅

---

## 🚀 LONG-TERM: Gamification Roadmap (Task 1)

**Status**: ⬜ PLANNED (ideas phase)  
**Goal**: Transform the platform into an engaging, competitive learning game  
**Last Updated**: March 4, 2026

---

### 🧠 UNIVERSAL QUANTUM CONCEPTS → GAME MECHANICS

All 3 protocols (BB84, E91, DPS) share these core quantum concepts. Each maps naturally to a game mechanic:

| Quantum Concept | Game Mechanic Analogy | Existing Game Reference |
|---|---|---|
| **Photon travels A→B** | Projectile / delivery | *Angry Birds* trajectory, *Guitar Hero* note highway |
| **Basis selection** | Strategic choice under uncertainty | *Rock-Paper-Scissors*, *Poker* blind bets |
| **Same basis = correct info** | Match = reward | *Memory/Concentration* card game, *Candy Crush* matching |
| **Different basis = random** | Miss = penalty/lost turn | *Minesweeper* wrong click |
| **Eve intercepts** | Hidden adversary / spy | *Among Us* impostor, *Spy vs Spy*, *Werewolf* |
| **Error rate reveals Eve** | Detective / forensics | *Clue/Cluedo*, *Papers Please* document inspection |
| **Key generation** | Crafting / building | *Minecraft* crafting from collected resources |

---

### 🎮 GAME CONCEPT IDEAS (Universal — All Protocols)

**Concept 1: "Photon Catcher" (Guitar Hero / Fruit Ninja style)**
- Photons fly across the screen, you must pick the correct basis (filter) *before* they arrive
- Speed + accuracy scoring. Wrong basis = photon lost
- Eve photons are disguised — if you catch one, you get a warning
- Works for all 3 protocols with different visual skins

**Concept 2: "Base Match" (Memory Card Game)**
- Cards face-down, flip pairs to find matching bases
- Same basis pair = you keep the bit → builds your key
- Different basis = cards flip back, you lose a turn
- Eve cards hidden in the deck — if you flip one, she steals a matched pair
- Difficulty: more cards, faster timer, more Eve cards

**Concept 3: "Eve Hunter" (Among Us / Detective mode)**
- After a key exchange round, you see the stats (error rates, mismatches)
- You must decide: "Is Eve present? Yes/No"
- Higher levels = Eve intercepts fewer photons (subtler, harder to detect)
- Score based on correct detection + confidence threshold
- Like *Papers Please* — inspect the data, spot the anomaly

**Concept 4: "Quantum Relay" (Tower Defense)**
- Photons travel a path from Alice to Bob
- Player places basis filters along the channel
- Eve tries to intercept at random points
- Player scores by maximizing correct key bits while detecting Eve
- Could have "shields" and "decoys" as power-ups

**Concept 5: "Speed Exchange" (Typing Test / Speedrun)**
- Complete a full key exchange as fast as possible
- Timer + accuracy = combined score
- Leaderboard per protocol
- Like *TypeRacer* but for quantum operations

---

### 🔬 PROTOCOL-SPECIFIC GAME TWISTS

| Protocol | Unique Mechanic | Game Twist |
|---|---|---|
| **BB84** | Polarization filters (↕ ↔ ↗ ↘) | Rotate a physical filter widget to match — visual/tactile |
| **E91** | Entangled pairs, Bell inequality | Puzzle mode: "Do these measurements violate Bell's inequality?" — logic puzzle |
| **DPS** | Phase differences in pulse trains | Rhythm game: detect phase shifts like beats in music (*Guitar Hero* / *osu!*) |

Each protocol gets its own "flavor" of gamification on top of the universal mechanics.

---

### 📊 DIFFICULTY LEVELS (Per Protocol)

| Level | Name | Description |
|---|---|---|
| 1 | **Tutorial** | Guided walkthrough, no Eve, no timer |
| 2 | **Apprentice** | Solo, no Eve, scored |
| 3 | **Agent** | Solo + Eve present, must detect |
| 4 | **Operative** | Multiplayer, real partner |
| 5 | **Master** | Multiplayer + Eve, coordinate detection |

---

### 🏅 BADGE IDEAS

- **"First Photon"** — Complete your first exchange
- **"Perfect Basis"** — 100% basis match in a round
- **"Eve Hunter"** — Correctly detect Eve 3 times
- **"Ghost Protocol"** — Complete a round with 0 errors
- **"Speed Demon"** — Exchange under 30 seconds
- **"Protocol Master"** — Complete all 3 protocols
- **"Quantum Trio"** — Play BB84 + E91 + DPS in one session
- **"Unbreakable"** — Generate a key with 0% error rate

---

### 🛣️ IMPLEMENTATION PHASES

**Recommended Order**: G3 → G1 → G2 → G4 → G5

#### Phase G3: Progressive Unlocking 🔒→🔓 (Priority 1 — 1-2 days)
Lock E91 and DPS until BB84 is completed. Creates an immediate learning path.

- [ ] Track protocol completion in `localStorage` (`bb84_completed`, etc.)
- [ ] Add lock overlay to E91/DPS cards on landing page
- [ ] Show "Complete BB84 to unlock" message
- [ ] Add progress bar showing overall completion
- [ ] Achievement badges ("First Key Exchange", "Eve Hunter")

#### Phase G1: Player Identity & Avatars 🎭 (Priority 2 — 2-3 days)
Give users a persistent identity and visual representation.

- [ ] Create `player-profile-store.ts` (Zustand)
- [ ] Avatar selection (quantum-themed: Alice, Bob, Eve skins)
- [ ] Persistent profile in `localStorage`
- [ ] Display avatar in game lobby and during gameplay
- [ ] Consider DiceBear API for auto-generated avatars

#### Phase G2: Scoring & Competition 🏆 (Priority 3 — 3-5 days)
Add stakes and competition to each game session.

- [ ] Scoring formula: basis accuracy + Eve detection + speed
- [ ] End-game score screen with breakdown
- [ ] Local leaderboard per protocol
- [ ] Server-side leaderboard via API
- [ ] XP system with titles ("Quantum Apprentice" → "Cryptography Master")

#### Phase G4: Interactive Tutorial / Guided Mode 📖 (Priority 4 — 5-7 days)
Transform the linear form-filling into a guided experience with story.

- [ ] `TutorialOverlay.tsx` component (contextual popups)
- [ ] `tutorial-store.ts` (Zustand, tracks shown tips)
- [ ] Tutorial data in JSON files (supports i18n)
- [ ] Step-by-step highlights (glow/pulse on next action)
- [ ] "Skip Tutorial" button for returning players
- [ ] Animated transitions between protocol steps
- [ ] Dramatic Eve detection reveal (screen shake, red glow)
- [ ] Victory screen with confetti + score + "Next Protocol" CTA

#### Phase G5: Visual Gameplay Enhancements 🎨 (Priority 5 — 7-10 days)
Make the game screens visually exciting, not just functional.

- [ ] Photon animations (fly from Alice to Bob with polarization)
- [ ] Visual basis selection (clickable cards instead of dropdowns)
- [ ] Real-time Eve indicator (flickering, interference pattern)
- [ ] Optional sound effects (photon send/receive, Eve alert)
- [ ] Game-specific themes beyond global dark/light

---

## 🃏 CARD UX REDESIGN — Multi-Scenario Form Problem

**Status**: ⏸️ WAITING — Team meeting needed to pick winning design  
**Date**: February 18, 2026  
**Last Updated**: March 4, 2026  
**Comparison Page**: `/bb84_card` (7 interactive options, all functional)  
**Branch**: Merged into `ibra_development` (commit `60c682c`)  
**Blocked By**: Team meeting to review and vote on the 7 options  
**Problem**: The current game card tries to serve 3 different workflows with 1 form, but each needs different information:

| Workflow         |     Needs Name?     |    Needs PIN?     | Role                |
| ---------------- | :-----------------: | :---------------: | ------------------- |
| **Jouer solo**   | ✅ (+ avatar later?) |         ❌         | Player              |
| **Rejoindre**    |          ✅          |         ✅         | Player              |
| **Créer un jeu** |          ✅          | ❌ (generates one) | Master (can't play) |

The PIN field is useless for Solo and Create, yet always visible. The form feels confused and doesn't satisfy any scenario well.

### 7 Design Options — All Built & Interactive at `/bb84_card`

Ordered by quality ranking:

| Rank | Option        | Name               | Key Idea                                                              |
| ---- | ------------- | ------------------ | --------------------------------------------------------------------- |
| 1    | **Option 1**  | Card Flip          | 3D flip animation, binary Solo/Multiplayer choice — best "wow" factor |
| 2    | **Option 2**  | Tab-Based          | 3 tabs (Solo \| Rejoindre \| Créer), familiar pattern                 |
| 3    | **Option 3**  | Unified Dashboard  | MOBA-style mode selector, single action button                        |
| 4    | **Option 4**  | Progressive Reveal | Solo-first with collapsible multiplayer section                       |
| 4b   | **Option 4b** | Always-Open        | Same as 4 but multiplayer always visible                              |
| 5    | **Option 5**  | Two-Card Split     | Side-by-side Solo + Multiplayer cards                                 |
| 6    | **Option 6**  | Join-First         | Jackbox-style, PIN input front and center                             |
| 7    | **Option 7**  | Wizard / Stepper   | 3-step guided flow (Name → Mode → Action)                             |

### Text Consistency (applied to all 7 cards)
- Label: "Player Name" / Placeholder: "Alice"
- Label: "Game PIN" / Placeholder: "62V2H" / maxLength: 5
- Buttons: "Play Solo" / "Join Game" / "Create Game" (Title Case)

### Technical Notes
- SSR hydration fix: Card Flip uses inline `style` props (not Tailwind arbitrary)
- SSR hydration fix: Tab-Based uses controlled Radix Tabs (`value` + `onValueChange`)
- All cards match real BB84 page width: `w-[350px] md:w-[500px]`

### Next Steps
- [ ] **Team reviews `/bb84_card` and picks the winning design**
- [ ] Implement chosen design in real BB84 game form
- [ ] Replicate to E91 and DPS
- [ ] Remove `/bb84_card` comparison page (or keep as reference)

---

**Priority:** LOW - Focus on solo mode first, then add Eve later
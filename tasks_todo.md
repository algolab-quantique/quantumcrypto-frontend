
# E91 Solo Mode - Complete Issue Tracker & Plan

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

**Status**: 🔴 URGENT - IN PROGRESS  
**Date Started**: December 11, 2025

---

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

---

#### 🔴 ROOT CAUSE

The `isConnected` HOC (`components/hoc/is-connected.tsx`) redirects to `/` on refresh because:

```typescript
const connected = playingSolo || isWaitingRoomConnected || isPlayRoomConnected;
// On refresh: playingSolo=false (not persisted), WebSocket=disconnected
// Result: connected=false → redirect('/')
```

**Key insight**: `player-store.ts` has NO localStorage persistence. On refresh, `playingSolo` resets to `false`.

---

#### 📋 STEP-BY-STEP FIX PLAN

| Step    | Task                                       | Status | Files                                     | Risk   | Time   |
| ------- | ------------------------------------------ | ------ | ----------------------------------------- | ------ | ------ |
| **2.1** | Add `persist` to `player-store.ts`         | ⬜ TODO | `store/player-store.ts`                   | Low    | 15 min |
| **2.2** | Test E91 solo refresh                      | ⬜ TODO | -                                         | -      | 10 min |
| **2.3** | Test BB84 solo refresh                     | ⬜ TODO | -                                         | -      | 10 min |
| **2.4** | Test E91 multiplayer refresh               | ⬜ TODO | -                                         | -      | 10 min |
| **2.5** | Test BB84 multiplayer refresh              | ⬜ TODO | -                                         | -      | 10 min |
| **2.6** | Add auto-restore in play pages (if needed) | ⬜ TODO | `e91/play/page.tsx`, `bb84/play/page.tsx` | Medium | 30 min |
| **2.7** | Final integration test                     | ⬜ TODO | -                                         | -      | 15 min |

**Total Estimated Time**: ~1.5 hours

---

#### 📝 STEP 2.1 DETAILS: Add `persist` to `player-store.ts`

**Current code** (`store/player-store.ts`):
```typescript
import {create} from 'zustand';

const usePlayerStore = create<PlayerStore>((set) => ({
    playerName: '',
    playerId: null,
    playerRole: 'A',
    playingSolo: false,  // ❌ NOT PERSISTED - resets on refresh!
    isAdmin: false,
    partner: '',
    // setters...
}));
```

**Fix needed**: Add Zustand `persist` middleware:
```typescript
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const usePlayerStore = create<PlayerStore>()(
    persist(
        (set) => ({
            playerName: '',
            playerId: null,
            playerRole: 'A',
            playingSolo: false,  // ✅ NOW PERSISTED!
            isAdmin: false,
            partner: '',
            // setters...
        }),
        {
            name: 'player-storage',  // localStorage key
        }
    )
);
```

**Expected result**: On refresh, `playingSolo=true` is restored → `isConnected` HOC passes → user stays on game page.

---

#### 🔗 RELATED: Multiplayer Key Min Check (Issue #6)

During analysis, confirmed that:
- **Solo mode**: Has `E91_MIN_KEY_LENGTH` check ✅
- **Multiplayer mode**: Missing this check ❌

Will fix after state persistence is working.

---

#### 📚 REFERENCE: localStorage Keys Used

**BB84**:
- `bb84GameData` - Room store (game state)
- `bb84PlayerData` - Player info
- `bb84Step` - Current step
- `bb84Tab` - Current tab
- `bb84PhotonNumber` - Config
- `bb84ValidationBitsLength` - Config
- `bb84DisplayedLines` - UI state

**E91**:
- `e91GameData` - Room store (game state)
- `e91PlayerData` - Player info
- `e91Step` - Current step
- `e91Tab` - Current tab
- `e91PhotonNumber` - Config
- `e91ValidationBitsLength` - Config
- `e91DisplayedLines` - UI state

**NEW (to add)**:
- `player-storage` - Player store (playingSolo, playerRole, etc.)

---

### 3. 🏁 Results Page Not Working (Solo Mode)
**Status**: 🔴 URGENT  
**Issue**: At end of game, clicking "Show Results" briefly shows results URL then redirects to home  
**Root Cause**: Results page expects server data / multiplayer room data that doesn't exist in solo mode  
**Files**:
- `app/(main)/e91/results/page.tsx`
- `components/e91/results-page/`

**Solution**: 
- Add solo mode check in results page
- Display local game data (score, key bits, etc.) instead of fetching from server
- OR create separate solo results component

---

## 🟡 MEDIUM PRIORITY

### 4. 🎨 Button Size Inconsistency (E91 Home Page)
**Status**: 🟡 UI Issue  
**Issue**: "Play Solo" button and "Create Game" button have different widths  
**Current**:
- Solo: `w-[50%]` ✅
- Create Game: `w-full` ❌ (should be `w-[50%]`)

**Files**:
- `components/e91/home-page/create-game-modal.tsx` (line 125)
- `components/e91/home-page/solo-game-modal.tsx` (line 472) ✅

**BB84 Reference** (both use `w-[50%]}`:
- `components/bb84/home-page/create-game-modal.tsx` (line 112) ✅
- `components/bb84/home-page/solo-game-modal.tsx` (line 307) ✅

**Fix**: Change E91 create-game-modal button from `w-full` to `w-[50%]`

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

- [x] Centralize hardcoded values into `e91-constants.ts`
- [x] Add `E91_TEST_MODE` toggle for TEST vs PRODUCTION
- [x] Add `E91_MIN_KEY_LENGTH` constant
- [x] Add `E91_SOLO_PHOTON_*` constants
- [x] Add `E91_MULTIPLAYER_PHOTON_*` constants (with backend sync warning)
- [x] Add `E91_EVE_*` constants (shared)
- [x] Dynamic error messages with constant values (placeholder replacement)
- [x] **Next.js updated from 14.2.32 → 14.2.33** (Dec 11, 2025)
- [x] Fixed 2 npm vulnerabilities (glob, js-yaml)
- [x] Created AWS Production Upgrade Plan

---

## 📋 IMPLEMENTATION ORDER

1. **#4** - Button size fix (5 min, easy win)
2. **#5** - Dialog import fix (5 min, easy win)
3. **#6** - Key length check (10 min)
4. **#1** - Next.js upgrade (30 min, needs testing)
5. **#2** - Page reload persistence (1-2 hours)
6. **#3** - Results page for solo (1-2 hours)
7. **#7, #8** - State reset and store defaults (30 min)
8. **#9, #10, #11** - Cleanup (30 min)

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
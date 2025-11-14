# 🧪 TEST Configuration - Reduced Photon Numbers

## ⚠️ TEMPORARY CHANGES FOR TESTING

These files have been modified to use **4 photons minimum** instead of 10/16 for easier testing.

---

## 📝 Modified Files:

### 1. `components/bb84/home-page/create-game-modal.tsx`

**Line ~77-79:** Validation rules
```typescript
// 🧪 CURRENT (TEST):
(schema.photonNumber >= 4 && schema.photonNumber <= 30)

// ✅ ORIGINAL (PRODUCTION):
// With Eve: (schema.photonNumber >= 16 && schema.photonNumber <= 30)
// No Eve:  (schema.photonNumber >= 10 && schema.photonNumber <= 30)
```

**Line ~94:** Default value
```typescript
// 🧪 CURRENT (TEST):
photonNumber: 4

// ✅ ORIGINAL (PRODUCTION):
// photonNumber: 10
```

---

### 2. `components/bb84/home-page/solo-game-modal.tsx`

**Line ~89-91:** Validation rules
```typescript
// 🧪 CURRENT (TEST):
(schema.photonNumber >= 4 && schema.photonNumber <= 30)

// ✅ ORIGINAL (PRODUCTION):
// With Eve: (schema.photonNumber >= 16 && schema.photonNumber <= 30)
// No Eve:  (schema.photonNumber >= 10 && schema.photonNumber <= 30)
```

**Line ~106:** Default value
```typescript
// 🧪 CURRENT (TEST):
photonNumber: 4

// ✅ ORIGINAL (PRODUCTION):
// photonNumber: 10
```

---

## 🔄 How to Restore Production Values

When testing is complete, run:

```bash
git diff components/bb84/home-page/create-game-modal.tsx
git diff components/bb84/home-page/solo-game-modal.tsx
```

Then revert all lines marked with `🧪 TEST:` to their original values:

### Quick Restore Command:
```bash
# Revert specific files
git checkout components/bb84/home-page/create-game-modal.tsx
git checkout components/bb84/home-page/solo-game-modal.tsx

# Or revert all changes
git checkout .
```

---

## 🎯 Testing Scenarios with 4 Photons

### Scenario 1: No Eve (4 photons)
- **Time:** ~30 seconds per game
- **Players needed:** 8 players = 4 rooms
- **Quick test:** ✅ Feasible

### Scenario 2: With Eve (4 photons)
- **Time:** ~45 seconds per game (with validation)
- **Players needed:** 8 players = 4 rooms
- **Quick test:** ✅ Feasible

### Scenario 3: 16 players
- **With 4 photons:** MUCH faster than before
- **Original 16 photons:** ~5 minutes per game
- **Now with 4 photons:** ~1 minute per game

---

## 📊 Comparison Table

| Configuration  | Original Time | Test Time (4 photons) | Speedup     |
| -------------- | ------------- | --------------------- | ----------- |
| **No Eve**     | ~2 min        | ~30 sec               | 🚀 4x faster |
| **With Eve**   | ~5 min        | ~45 sec               | 🚀 6x faster |
| **16 players** | ~30-40 min    | ~6-8 min              | 🚀 5x faster |

---

## ⚠️ Important Notes

1. **Backend compatibility:** ⚠️ **BACKEND ALSO NEEDS MODIFICATION!** See `BACKEND_TEST_CHANGES.md`
2. **Validation bits:** With Eve enabled, max validation bits = `photonNumber / 2` = 2 bits
3. **Key length:** With 4 photons, final key will be ~2 bits (very short!)
4. **DO NOT COMMIT** these test values to production branch

---

## 🔴 ERROR: Backend Validation

If you see this error when creating a game:
```
POST http://localhost:8000/games/bb84/ 400 (Bad Request)
AxiosError: Request failed with status code 400
```

**Cause:** Backend rejects `photon_number < 10`

**Fix:** Modify backend files. See detailed instructions in `BACKEND_TEST_CHANGES.md`

**Quick Backend Fix:**
1. Find: `quantumcrypto-backend/bb84/serializers.py`
2. Change: `min_value=10` → `min_value=4`
3. Change: `min_value=16` → `min_value=4` (for Eve validation)
4. Restart backend: `python manage.py runserver`

---

## 🗑️ Delete This File

When testing is complete and production values are restored:

```bash
git rm TEST_PHOTON_VALUES.md
```

---

**Created:** November 13, 2025  
**Purpose:** Facilitate debugging of results table with multiple players  
**Status:** 🧪 TESTING ONLY - NOT FOR PRODUCTION

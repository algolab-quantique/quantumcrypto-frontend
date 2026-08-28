// ═══════════════════════════════════════════════════════════════════════════
// E91 GAME CONFIGURATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

import {QC_TEST_MODE} from '@/lib/test-mode';

// ─────────────────────────────────────────────────────────────────────────────
// Key Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimum number of valid key bits required to continue the game.
 * If fewer bits are available after basis comparison, game must restart.
 */
export const E91_MIN_KEY_LENGTH = 2;

// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - SOLO MODE
// ─────────────────────────────────────────────────────────────────────────────
// Solo mode only (no backend validation).
//
// Each value is written `QC_TEST_MODE ? <test> : <production>`. Test mode is
// opt-in per developer via NEXT_PUBLIC_QC_TEST_MODE in a git-ignored .env.local;
// absence means production. See lib/test-mode.ts for the full mechanism.

/** Maximum number of photons allowed (solo mode) */
export const E91_SOLO_PHOTON_MAX = 30;

/** Minimum photons when Eve is enabled - solo mode (more needed for CHSH statistics) */
export const E91_SOLO_PHOTON_MIN_WITH_EVE = QC_TEST_MODE ? 8 : 20;

/** Minimum photons when Eve is disabled - solo mode */
export const E91_SOLO_PHOTON_MIN_WITHOUT_EVE = QC_TEST_MODE ? 4 : 10;

/** Default photon number for new solo games */
export const E91_SOLO_PHOTON_DEFAULT = QC_TEST_MODE ? 4 : 10;

// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - MULTIPLAYER MODE
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  WARNING: BACKEND SYNC REQUIRED!
// ⚠️  These values MUST match the backend validation in consumers.py
// ⚠️  If you change these values, update the backend as well or the game
// ⚠️  will fail with validation errors from the server.
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum number of photons allowed (multiplayer) */
export const E91_MULTIPLAYER_PHOTON_MAX = 30;

/** Default number of photons for a new multiplayer game */
export const E91_MULTIPLAYER_PHOTON_DEFAULT = 20;

/** Minimum photons when Eve is enabled (multiplayer) */
export const E91_MULTIPLAYER_PHOTON_MIN_WITH_EVE = 20;

/** Minimum photons when Eve is disabled (multiplayer) */
export const E91_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Eve Configuration (shared between solo and multiplayer)
// ─────────────────────────────────────────────────────────────────────────────

/** Default Eve interception probability */
export const E91_EVE_PERCENTAGE_DEFAULT = 0.5;

/** Minimum Eve interception probability */
export const E91_EVE_PERCENTAGE_MIN = 0.1;

/** Maximum Eve interception probability */
export const E91_EVE_PERCENTAGE_MAX = 1.0;

// ═══════════════════════════════════════════════════════════════════════════
// E91 WEB SOCKET EVENT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const A_MEASURE_EVENT = 'A_MEASURE';
export const B_MEASURE_EVENT = 'B_MEASURE';
export const A_PREFERENCE_EVENT = 'A_PREFERENCE';
export const B_PREFERENCE_EVENT = 'B_PREFERENCE';
export const A_DICE_EVENT = 'A_DICE';
export const B_DICE_EVENT = 'B_DICE';
export const VALIDATION_INDICES_EVENT = 'VALIDATION_INDICES';
export const A_BITS_EVENT = 'A_BITS';
export const B_BITS_EVENT = 'B_BITS';
export const A_DECISION_EVENT = 'A_DECISION';
export const B_DECISION_EVENT = 'B_DECISION';
export const EVE_SPOTTED_EVENT = 'EVE_SPOTTED';
export const SCORE_EVENT = 'SCORE';
export const GAME_ID_EVENT = 'GAME_ID';

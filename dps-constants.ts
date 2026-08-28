import {QC_TEST_MODE} from '@/lib/test-mode';

// DPS Web Socket Event Constants
export const DPS_GAME_ID_EVENT = "DPS_GAME_ID_EVENT";
export const DPS_PLAYER_COUNT_EVENT = "DPS_PLAYER_COUNT_EVENT";
export const DPS_CONNECTED_EVENT = "DPS_CONNECTED_EVENT";
export const DPS_START_EVENT = "DPS_START_EVENT";
export const DPS_END_EVENT = "DPS_END_EVENT";
export const B_TIMES_EVENT='B_TIMES';
export const A_SUCCESS_EVENT='A_SUCCESS';
export const A_PHASES_EVENT = 'A_PHASES';
export const SWAP_ROLES_AND_RESTART_EVENT= 'SWAP_ROLES_AND_RESTART';
export const PLAYER_LEFT_EVENT = 'PLAYER_LEFT';

// ═══════════════════════════════════════════════════════════════════════════
// DPS GAME CONFIGURATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - SOLO MODE
// ─────────────────────────────────────────────────────────────────────────────
// Solo mode only (no backend validation).
//
// Each value is written `QC_TEST_MODE ? <test> : <production>`. Test mode is
// opt-in per developer via NEXT_PUBLIC_QC_TEST_MODE in a git-ignored .env.local;
// absence means production. See lib/test-mode.ts for the full mechanism.
//
// NOTE (Ibra, 2026-08-28): DPS's test and production values are deliberately the
// SAME today — the current numbers are considered fine for production, and DPS's
// old `DPS_TEST_MODE` was dead code (declared, never read), so no production
// values had ever been chosen. The two-value shape is kept anyway so DPS matches
// BB84 and E91: changing a production value later is then a one-line edit rather
// than a refactor. DPS also still has no solo Eve at all — see Task 38.

/** Minimum number of photons allowed (solo mode) */
export const DPS_SOLO_PHOTON_MIN = QC_TEST_MODE ? 4 : 4;

/** Maximum number of photons allowed (solo mode) */
export const DPS_SOLO_PHOTON_MAX = QC_TEST_MODE ? 20 : 20;

/** Default photon number for new solo games */
export const DPS_SOLO_PHOTON_DEFAULT = QC_TEST_MODE ? 6 : 6;

/** localStorage key for draft solo photon number */
export const DPS_SOLO_PHOTON_DRAFT_KEY = 'dpsSoloPhotonNumberDraft';

// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - MULTIPLAYER MODE
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  WARNING: BACKEND SYNC REQUIRED!
// ⚠️  These values MUST match the backend validation
// ⚠️  If you change these values, update the backend as well or the game
// ⚠️  will fail with validation errors from the server.
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum number of photons allowed (multiplayer) */
export const DPS_MULTIPLAYER_PHOTON_MAX = 30;

/** Minimum photons when Eve is enabled (multiplayer) */
export const DPS_MULTIPLAYER_PHOTON_MIN_WITH_EVE = 20;

/** Minimum photons when Eve is disabled (multiplayer) */
export const DPS_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE = 10;

/** Default photon number for new multiplayer games */
export const DPS_MULTIPLAYER_PHOTON_DEFAULT = 10;

/** Default Eve interception probability */
export const DPS_EVE_PERCENTAGE_DEFAULT = 0.5;


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

/**
 * Environment toggle for TEST vs PRODUCTION values (SOLO MODE ONLY).
 * Set to `true` during development for faster testing with fewer photons.
 * Set to `false` for production with realistic quantum simulation values.
 */
export const DPS_TEST_MODE = true;  // TODO: Set to false for production

// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - SOLO MODE
// ─────────────────────────────────────────────────────────────────────────────
// These values are used for solo mode only (no backend validation).
// Controlled by DPS_TEST_MODE toggle above.

/** Minimum number of photons allowed (solo mode) */
export const DPS_SOLO_PHOTON_MIN = 4;

/** Maximum number of photons allowed (solo mode) */
export const DPS_SOLO_PHOTON_MAX = 20;

/** Default photon number for new solo games */
export const DPS_SOLO_PHOTON_DEFAULT = 6;

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


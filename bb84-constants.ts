import {QC_TEST_MODE} from '@/lib/test-mode';

// BB84 Web Socket Event Constants
export const JOIN_EVENT = 'JOIN';
export const START_EVENT = 'START';
export const CONNECTED_EVENT = 'CONNECTED';
export const PLAYER_COUNT_EVENT = 'PLAYER_COUNT';
export const END_EVENT = 'END';
export const END_ADMIN_EVENT = 'END_ADMIN';
export const END_PLAYER_EVENT = 'END_PLAYER';
export const TAKEN_NAME_EVENT = 'TAKEN_NAME';
export const GAME_STARTED_EVENT = 'GAME_STARTED';
export const INVALID_CODE_EVENT = 'INVALID_CODE';
export const PLAYER_JOIN_EVENT = 'PLAYER_JOIN';
export const ROLES_EVENT = 'ROLES';
export const A_PHOTONS_EVENT = 'A_PHOTONS';
export const A_BASES_EVENT = 'A_BASES';
export const B_BASES_EVENT = 'B_BASES';
export const A_CIPHER_EVENT = 'A_CIPHER';
export const A_KEY_EVENT = 'A_KEY';
export const B_KEY_EVENT = 'B_KEY';
export const B_SUCCESS_EVENT = 'B_SUCCESS';
export const A_VALIDATED_EVENT = 'A_VALIDATED';
export const B_VALIDATED_EVENT = 'B_VALIDATED';
export const RESTART_WITHOUT_EVE_EVENT = 'RESTART_WITHOUT_EVE';
// ═══════════════════════════════════════════════════════════════════════════
// BB84 GAME CONFIGURATION CONSTANTS - SOLO MODE
// ═══════════════════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - SOLO MODE
// ─────────────────────────────────────────────────────────────────────────────
// Solo mode only (no backend validation).
//
// Each value is written `QC_TEST_MODE ? <test> : <production>`. Test mode is
// opt-in per developer via NEXT_PUBLIC_QC_TEST_MODE in a git-ignored .env.local;
// absence means production. See lib/test-mode.ts for the full mechanism.

/** Maximum number of photons allowed (solo mode) */
export const BB84_SOLO_PHOTON_MAX = 30;

/** Minimum photons when Eve is enabled (more bits needed for sifting statistics) */
export const BB84_SOLO_PHOTON_MIN_WITH_EVE = QC_TEST_MODE ? 6 : 16;

/** Minimum photons when Eve is disabled */
export const BB84_SOLO_PHOTON_MIN_WITHOUT_EVE = QC_TEST_MODE ? 4 : 10;

/** Default photon number for new solo games */
export const BB84_SOLO_PHOTON_DEFAULT = QC_TEST_MODE ? 4 : 10;

// ─────────────────────────────────────────────────────────────────────────────
// Eve Presence Probability - SOLO MODE (Task 51, ADR §12)
// The checkbox means "Eve POSSIBLE"; actual presence is drawn once at game
// start with this probability — same model as BB84 multiplayer (backend
// eve_percentage), E91 and DPS. Probability 1.0 reproduces the historical
// deterministic behavior.
// ─────────────────────────────────────────────────────────────────────────────
/** Default Eve interception probability (mirrors E91/DPS and the multi create-game default) */
export const BB84_EVE_PERCENTAGE_DEFAULT = 0.5;

/** Minimum Eve interception probability */
export const BB84_EVE_PERCENTAGE_MIN = 0.1;

/** Maximum Eve interception probability */
export const BB84_EVE_PERCENTAGE_MAX = 1.0;

// ─────────────────────────────────────────────────────────────────────────────
// Validation Bits Configuration - SOLO MODE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Default validation bits = ~25% of photon count.
 * This represents the practical sifting phase in BB84:
 * - ~50% of transmitted bits match bases → sifted key
 * - ~50% of sifted key reserved for validation (eavesdropping detection)
 * 
 * Examples:
 *   - 4 photons (test):  → ~2 sifted → 1 validation bit
 *   - 10 photons (prod): → ~5 sifted → 2-3 validation bits
 *   - 20 photons (prod): → ~10 sifted → 5 validation bits
 * 
 * Calculation: Math.floor(photonNumber * 0.25)
 */
export const BB84_VALIDATION_BITS_PERCENTAGE = 0.25;

/** Minimum validation bits required */
export const BB84_VALIDATION_BITS_MIN = 1;

/**
 * Calculate intelligent default validation bits from photon count.
 * Ensures students see sensible defaults without manual calculation.
 * 
 * @param photonCount - Number of photons for the game
 * @returns Default validation bits (minimum 1, ~25% of photons)
 * 
 * @example
 * getDefaultValidationBits(4)  // → 1
 * getDefaultValidationBits(10) // → 2
 * getDefaultValidationBits(20) // → 5
 */
export const getDefaultValidationBits = (photonCount: number): number => {
    return Math.max(
        BB84_VALIDATION_BITS_MIN,
        Math.floor(photonCount * BB84_VALIDATION_BITS_PERCENTAGE)
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Photon Number Limits - MULTIPLAYER MODE
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  WARNING: BACKEND SYNC REQUIRED!
// ⚠️  These values MUST match the backend validation in consumers.py
// ⚠️  If you change these values, update the backend as well or the game
// ⚠️  will fail with validation errors from the server.
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum number of photons allowed (multiplayer) */
export const BB84_MULTIPLAYER_PHOTON_MAX = 30;

/** Minimum photons when Eve is enabled (multiplayer) */
export const BB84_MULTIPLAYER_PHOTON_MIN_WITH_EVE = 16;

/** Minimum photons when Eve is disabled (multiplayer) */
export const BB84_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE = 10;

/** Default photon number for new multiplayer games */
export const BB84_MULTIPLAYER_PHOTON_DEFAULT = 10;

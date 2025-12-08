/**
 * E91 Solo Player Simulation
 * 
 * This module simulates the E91 quantum key distribution protocol.
 * It strictly follows the backend's simulation logic (consumers.py) to ensure
 * consistency between solo and multiplayer modes.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * QUANTUM MECHANICS & SIMULATION MODEL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 1. BELL STATE: |Φ⁺⟩ = (|00⟩ + |11⟩) / √2
 *    - Same basis measurement = Perfect CORRELATION (same bit)
 * 
 * 2. BASES & ANGLES (Original Paper Notation):
 *    
 *    Alice's Bases:
 *    '1' = 0 rad      (0°)
 *    '2' = π/4 rad    (45°)
 *    '3' = π/2 rad    (90°)
 * 
 *    Bob's Bases:
 *    '2' = π/4 rad    (45°)
 *    '3' = π/2 rad    (90°)
 *    '4' = 3π/4 rad   (135°)
 * 
 * 3. SIMPLIFIED PHYSICS MODEL (Backend Logic):
 *    The simulation uses a simplified probabilistic model optimized for the
 *    key generation pairs (2-2, 3-3) and CHSH pairs (1-2, 1-4, 3-2, 3-4).
 * 
 *    - MATCHING BASES (2-2, 3-3): 
 *      Perfect correlation (Probability = 1.0)
 * 
 *    - SPECIAL MISMATCH (1-4): 
 *      Angle diff 3π/4 (135°) → Inverted correlation (Probability ≈ 0.15 for same result)
 *      This provides the negative term in the CHSH inequality.
 * 
 *    - ALL OTHER MISMATCHES (1-2, 3-2, 3-4, etc.):
 *      Treated as π/4 (45°) difference → Standard CHSH correlation (Probability ≈ 0.85)
 *      
 *      NOTE: This simplifies "cross pairs" like 1-3 or 2-4 (physically π/2 or 90°)
 *      by treating them as π/4 pairs. This approximation is acceptable for
 *      the game's purpose as these pairs are not used for Key or CHSH calculation.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * CHSH INEQUALITY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * S = E(1,2) - E(1,4) + E(3,2) + E(3,4)
 * 
 * With this simulation:
 * E(1,2), E(3,2), E(3,4) ≈ 0.707 (from 85% correlation)
 * E(1,4) ≈ -0.707 (from 15% correlation)
 * 
 * S ≈ 0.707 - (-0.707) + 0.707 + 0.707 = 2.828 (2√2)
 * This correctly violates the Bell inequality (S ≤ 2).
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quantum probability threshold for π/4 (45°) angle difference.
 * Used for all non-matching bases (except the 1-4 special case).
 * 
 * P(different) = sin²(π/8) ≈ 0.1464
 * P(same)      = cos²(π/8) ≈ 0.8536
 */
const PROBABILITY_THRESHOLD = Math.sin(Math.PI / 8) ** 2; // ≈ 0.1464

/**
 * Available measurement bases.
 * 
 * Alice: 1 (0), 2 (π/4), 3 (π/2)
 * Bob:   2 (π/4), 3 (π/2), 4 (3π/4)
 * 
 * Overlap (2, 3): Used for Key Generation
 * Non-overlap (1, 4): Used for CHSH Testing
 */
const ALICE_BASES = ['1', '2', '3'];
const BOB_BASES = ['2', '3', '4'];

// ═══════════════════════════════════════════════════════════════════════════
// BASE GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generates random measurement bases for a player.
 * Each photon measurement uses a randomly chosen basis.
 * 
 * @param photonNumber - Number of entangled pairs to measure
 * @param isAlice - True if generating for Alice, false for Bob
 * @returns Array of basis choices: '1','2','3' for Alice or '2','3','4' for Bob
 */
export const generateBases = (photonNumber: number, isAlice: boolean): string[] => {
    const availableBases = isAlice ? ALICE_BASES : BOB_BASES;
    const bases: string[] = [];

    for (let i = 0; i < photonNumber; i++) {
        const randomIndex = Math.floor(Math.random() * availableBases.length);
        bases.push(availableBases[randomIndex]);
    }

    return bases;
};

/**
 * Generates random measurement bases for Alice.
 * Alice uses bases: '1', '2', '3' (3 bases total)
 */
export const generateAliceBases = (photonNumber: number): string[] => {
    return generateBases(photonNumber, true);
};

/**
 * Generates random measurement bases for Bob.
 * Bob uses bases: '2', '3', '4' (3 bases total)
 */
export const generateBobBases = (photonNumber: number): string[] => {
    return generateBases(photonNumber, false);
};

// ═══════════════════════════════════════════════════════════════════════════
// BIT GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generates random initial bits for one party.
 * These represent the "source" measurement results.
 * 
 * @param photonNumber - Number of bits to generate
 * @returns Array of random bits, each element is randomly '0' or '1' (e.g., ['0','1','1','0','1'])
 */
export const generateRandomBits = (photonNumber: number): string[] => {
    const bits: string[] = [];
    for (let i = 0; i < photonNumber; i++) {
        bits.push(Math.random() < 0.5 ? '0' : '1');
    }
    return bits;
};

// ═══════════════════════════════════════════════════════════════════════════
// ENTANGLEMENT SIMULATION (Core Quantum Logic)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simulates entangled measurement outcomes based on quantum correlations.
 * 
 * This is the CORE of the E91 simulation. Given one party's measurement
 * results, it generates the correlated results for the other party based
 * on quantum mechanics (using Bell state |Φ⁺⟩):
 * 
 * - SAME basis: Perfect CORRELATION (same result, since we use |Φ⁺⟩)
 * - DIFFERENT bases: Probabilistic, using sin²(π/8) ≈ 0.1464 threshold
 * 
 * The probability threshold ensures CHSH ≈ 2√2 for entangled pairs.
 * 
 * @param partnerBits - The partner's measurement results, each '0' or '1'
 * @param partnerBases - The partner's measurement bases
 * @param playerBases - The current player's measurement bases
 * @returns Array of correlated measurement results for the player
 * 
 * @example
 * // If Alice measured '0' in basis '2', and Bob also uses basis '2':
 * // Bob will get '0' (same basis = same result with |Φ⁺⟩ state)
 * 
 * // If Alice measured '0' in basis '1', and Bob uses basis '4':
 * // Bob's result follows quantum probability distribution
 */
export const generateEntangledBits = (
    partnerBits: string[],
    partnerBases: string[],
    playerBases: string[]
): string[] => {
    const entangledBits: string[] = [];

    for (let index = 0; index < partnerBits.length; index++) {
        const bit = partnerBits[index];
        const partnerBasis = partnerBases[index];
        const playerBasis = playerBases[index];

        // ═══════════════════════════════════════════════════════════════════
        // CASE 1: Same basis → Perfect CORRELATION (|Φ⁺⟩ state)
        // ═══════════════════════════════════════════════════════════════════
        // When Alice and Bob measure in the same basis with |Φ⁺⟩ state,
        // their results are perfectly CORRELATED (both get the same bit).
        if (partnerBasis === playerBasis) {
            entangledBits.push(bit);
            continue;
        }

        // ═══════════════════════════════════════════════════════════════════
        // CASE 2: Different bases → Quantum probability
        // ═══════════════════════════════════════════════════════════════════
        // The correlation follows quantum mechanics:
        //   P(same) = cos²(θ/2), P(different) = sin²(θ/2)
        // where θ is the angle between measurement bases.
        // 
        // Using sin²(π/8) as threshold produces the correct CHSH statistics.

        const randValue = Math.random();
        let outcome: number;

        if (bit === '0') {
            // Partner got 0: we likely get same result (high probability > threshold)
            outcome = randValue > PROBABILITY_THRESHOLD ? 1 : -1;
        } else {
            // Partner got 1: we likely get same result (high probability > threshold)
            outcome = randValue > PROBABILITY_THRESHOLD ? -1 : 1;
        }

        // ═══════════════════════════════════════════════════════════════════
        // Special case: Basis combinations (1,4) or (4,1)
        // ═══════════════════════════════════════════════════════════════════
        // These specific basis pairs have inverted correlation due to
        // the geometric relationship of the measurement angles.
        if ((playerBasis === '1' && partnerBasis === '4') ||
            (playerBasis === '4' && partnerBasis === '1')) {
            outcome *= -1;
        }

        entangledBits.push(outcome === 1 ? '0' : '1');
    }

    return entangledBits;
};

// ═══════════════════════════════════════════════════════════════════════════
// EVE INTERCEPTION SIMULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simulates Eve's interception of entangled photons.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTE ON SIMULATION STRATEGY (Statistical vs. Physical)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This function uses a "Statistical Shortcut" (Phenomenological Model) rather
 * than a full physical simulation of the Intercept-Resend attack.
 * 
 * In a real physical simulation (like Qiskit):
 * 1. Eve would measure the entangled qubit (collapsing the state).
 * 2. This collapse would depend on whether Alice has already measured.
 * 3. Eve would then prepare a new qubit for Bob.
 * 4. Bob's measurement would depend on the angle between Eve's and Bob's bases.
 * 
 * Since simulating entanglement collapse without a quantum simulator is complex
 * (due to the non-local dependencies), this function instead simulates the
 * **EFFECT** of the attack:
 * - It generates bits that have REDUCED or NO correlation with Alice.
 * - It forces the statistics to follow classical limits (CHSH ≤ 2).
 * 
 * This matches the backend implementation and guarantees the correct game
 * mechanics (Eve is detectable) without the overhead of a full quantum state simulator.
 * 
 * @param bases - The measurement bases being used
 * @returns Array of bits that Eve generates (breaks quantum correlations)
 */
export const eveGenerateBits = (bases: string[]): string[] => {
    const bits: string[] = [];

    for (let index = 0; index < bases.length; index++) {
        const base = bases[index];
        const randValue = Math.random();
        let outcome: number;

        // Eve's measurements follow CLASSICAL probability, not quantum
        // This destroys the entanglement correlations

        if (base === '1' || base === '3') {
            // Bases 1 and 3: Use reduced probability (still some correlation)
            outcome = randValue > PROBABILITY_THRESHOLD ? 1 : -1;
        } else if (base === '2') {
            // Basis 2: Deterministic (always 1)
            outcome = 1;
        } else if (base === '4') {
            // Basis 4: Pure classical 50/50 (maximum disruption)
            outcome = randValue > 0.5 ? 1 : -1;
        } else {
            outcome = 1; // Default fallback
        }

        bits.push(outcome === 1 ? '0' : '1');
    }

    return bits;
};



// ═══════════════════════════════════════════════════════════════════════════
// KEY EXTRACTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extracts the shared key bits where Alice and Bob used matching bases.
 * 
 * In E91, only measurements with the SAME basis produce deterministic
 * correlations and can be used for the secret key.
 * 
 * @param bits - One party's measurement results
 * @param aliceBases - Alice's bases
 * @param bobBases - Bob's bases
 * @returns Array of key bits (only from matching basis measurements)
 */
export const getKeyBits = (
    bits: string[],
    aliceBases: string[],
    bobBases: string[]
): string[] => {
    const keyBits: string[] = [];

    bits.forEach((bit, index) => {
        // Only use bits where bases match (perfect correlation)
        if (aliceBases[index] === bobBases[index]) {
            keyBits.push(bit);
        }
    });

    return keyBits;
};

/**
 * Gets indices where Alice and Bob used matching bases.
 * These positions are used for key generation.
 * 
 * @param aliceBases - Alice's measurement bases
 * @param bobBases - Bob's measurement bases
 * @returns Array of indices where bases match
 */
export const getMatchingBasisIndices = (
    aliceBases: string[],
    bobBases: string[]
): number[] => {
    const indices: number[] = [];

    aliceBases.forEach((basis, index) => {
        if (basis === bobBases[index]) {
            indices.push(index);
        }
    });

    return indices;
};

/**
 * Gets indices where Alice and Bob used different bases.
 * These positions are used for CHSH testing (Eve detection).
 * 
 * @param aliceBases - Alice's measurement bases
 * @param bobBases - Bob's measurement bases
 * @returns Array of indices where bases differ
 */
export const getNonMatchingBasisIndices = (
    aliceBases: string[],
    bobBases: string[]
): number[] => {
    const indices: number[] = [];

    aliceBases.forEach((basis, index) => {
        if (basis !== bobBases[index]) {
            indices.push(index);
        }
    });

    return indices;
};

// ═══════════════════════════════════════════════════════════════════════════
// SOLO GAME SIMULATION (Main Entry Point)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simulates a complete E91 exchange for solo play.
 * 
 * This function generates all the data needed for a solo game,
 * simulating both Alice and Bob or simulating the partner based
 * on the player's role.
 * 
 * @param photonNumber - Number of entangled pairs
 * @param playerRole - 'A' for Alice, 'B' for Bob
 * @param playerBases - The player's chosen measurement bases
 * @param hasEve - Whether to simulate eavesdropping
 * @returns Object containing all game data
 */
export const simulateSoloExchange = (
    photonNumber: number,
    playerRole: 'A' | 'B',
    playerBases: string[],
    hasEve: boolean
): {
    partnerBases: string[];
    playerBits: string[];
    partnerBits: string[];
} => {
    // Generate partner's random bases
    const isPlayerAlice = playerRole === 'A';
    const partnerBases = generateBases(photonNumber, !isPlayerAlice);

    // Generate one party's random initial bits (the "source")
    const sourceBits = generateRandomBits(photonNumber);

    let playerBits: string[];
    let partnerBits: string[];

    if (isPlayerAlice) {
        // Player is Alice: source bits are Alice's, generate Bob's correlated bits
        playerBits = sourceBits;

        if (hasEve) {
            // Eve intercepts → breaks quantum correlations
            partnerBits = eveGenerateBits(partnerBases);
        } else {
            // No Eve → proper quantum correlations
            partnerBits = generateEntangledBits(playerBits, playerBases, partnerBases);
        }
    } else {
        // Player is Bob: source bits are Alice's, generate Bob's (player's) bits
        partnerBits = sourceBits; // Partner (Alice) bits

        if (hasEve) {
            // Eve intercepts → breaks quantum correlations
            playerBits = eveGenerateBits(playerBases);
        } else {
            // No Eve → proper quantum correlations
            playerBits = generateEntangledBits(partnerBits, partnerBases, playerBases);
        }
    }

    return {
        partnerBases,
        playerBits,
        partnerBits,
    };
};

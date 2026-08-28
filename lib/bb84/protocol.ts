/**
 * BB84 protocol physics — the single source of truth (ADR §13.3).
 *
 * Mode-agnostic: solo AND multiplayer import from here. A component that needs
 * physics imports it; it never re-implements it. (Renamed from solo-player.ts —
 * the "solo" name is what hid this file from the multiplayer tabs and let the
 * physics get copy-pasted into components; see docs/protocol-physics.md.)
 *
 * PHOTON ENCODING — one integer packs a bit AND the basis it was prepared in:
 *   1 = |0⟩   Z basis ('+'), bit 0   — prepared with no gate
 *   2 = |1⟩   Z basis ('+'), bit 1   — X
 *   3 = |+⟩   X basis ('x'), bit 0   — H
 *   4 = |−⟩   X basis ('x'), bit 1   — X then H
 * Our '+' is the computational/Z basis; 'x' is the diagonal/X basis. This is
 * the classical shortcut for the real qubit circuit: same inputs and outputs,
 * no quantum simulator needed.
 */

const basesValues = ['+', 'x'];

// ─────────────────────────────────────────────────────────────────────────────
// Primitives — the ONLY place each physical rule is written. Everything below
// is built from these two, so a rule has exactly one implementation.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encode one bit in one basis → photon (1–4). The single encoder: every photon
 * in the app is produced here — Alice's preparation AND Eve's re-emission — so
 * "which photon does this bit+basis make?" has exactly one answer.
 */
export const encodePhoton = (bit: string, basis: string): number =>
    basis === '+' ? (bit === '0' ? 1 : 2) : (bit === '0' ? 3 : 4);

/**
 * Measure one photon in one basis → bit ('0'/'1'). The single measurer.
 * Matching basis → deterministic (recovers the encoded bit). Mismatched basis
 * → a 50/50 coin flip: this is the quantum disturbance BB84 detects.
 * Circuit view: '+' measures in Z directly; 'x' applies H, then measures in Z.
 */
export const measurePhoton = (photon: number, basis: string): string => {
    if (photon === 1 && basis === '+') return '0';
    if (photon === 2 && basis === '+') return '1';
    if (photon === 3 && basis === 'x') return '0';
    if (photon === 4 && basis === 'x') return '1';
    return Math.random() < 0.5 ? '0' : '1';
};

// ─────────────────────────────────────────────────────────────────────────────
// Generators
// ─────────────────────────────────────────────────────────────────────────────

export const generateAliceBits = (photonNumber: number) => {
    const range = ['0', '1'];
    const bits: string[] = [];
    for (let i = 0; i < photonNumber; i++) {
        bits.push(range[Math.floor(Math.random() * 2)]);
    }
    return bits;
};

export const generateAliceBases = (photonNumber: number) => {
    const bases: string[] = [];
    for (let i = 0; i < photonNumber; i++) {
        bases.push(basesValues[Math.floor(Math.random() * 2)]);
    }
    return bases;
};

/** Alice prepares her photons: encode each bit in its chosen basis. */
export const generateAlicePhotons = (bits: string[], bases: string[]) =>
    bits.map((bit, index) => encodePhoton(bit, bases[index]));

// ─────────────────────────────────────────────────────────────────────────────
// Composite protocol steps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bob measures an incoming photon stream in fresh random bases.
 * @returns [bases, measurements]
 */
export const simulateBobExchange = (photons: number[]) => {
    const bases = photons.map(_ => basesValues[Math.floor(Math.random() * 2)]);
    const measurements = photons.map(
        (photon, index) => measurePhoton(photon, bases[index]));
    return [bases, measurements];
};

/**
 * Eve's intercept-resend attack: measure each photon in a random basis, then
 * RE-EMIT a fresh photon encoding her result IN THE BASIS SHE MEASURED IN.
 *
 * Built from the two primitives, which makes Task 57's bug (re-emitting in the
 * wrong basis) inexpressible: encodePhoton is fed the exact basis measurePhoton
 * used. Her disturbance is the textbook 25% per sifted bit — no more, no less.
 */
export const mimicEveIntercept = (photons: number[]): number[] => {
    const eveBases = photons.map(_ => basesValues[Math.floor(Math.random() * 2)]);
    return photons.map((photon, index) =>
        encodePhoton(measurePhoton(photon, eveBases[index]), eveBases[index]));
};

/**
 * Sifting: keep only the positions where Bob's basis matched Alice's. Both
 * players filter on the same condition, so their sifted arrays are aligned.
 */
export const getValidBits = (initialBits: string[], bobBases: string[],
                             aliceBases: string[]) => {
    const bits: string[] = [];
    initialBits.forEach((bit, index) => {
        if (bobBases[index] === aliceBases[index]) {
            bits.push(bit);
        }
    });
    return bits;
};

/**
 * BB84 physics/generation tests (Task 47 phase 1 — docs/testing-strategy.md).
 * Shape and invariant checks on the quantum-simulation helpers; randomness is
 * asserted through properties (lengths, domains) — or, where the physics has an
 * exact contract, by pinning Math.random so the outcome becomes deterministic.
 */

import {afterEach, describe, expect, it, vi} from 'vitest';
import {
    generateAliceBases,
    generateAliceBits,
    generateAlicePhotons,
    getValidBits,
    mimicEveIntercept,
    simulateBobExchange,
} from './solo-player';

describe('generators', () => {
    it('generateAliceBits: n bits, all 0/1', () => {
        const bits = generateAliceBits(16);
        expect(bits).toHaveLength(16);
        bits.forEach(bit => expect(['0', '1']).toContain(bit));
    });

    it('generateAliceBases: n bases, all + or x', () => {
        const bases = generateAliceBases(16);
        expect(bases).toHaveLength(16);
        bases.forEach(basis => expect(['+', 'x']).toContain(basis));
    });

    it('generateAlicePhotons: n photons, values in the 1-4 polarization domain', () => {
        const bits = generateAliceBits(16);
        const bases = generateAliceBases(16);
        const photons = generateAlicePhotons(bits, bases);
        expect(photons).toHaveLength(16);
        photons.forEach(photon => expect([1, 2, 3, 4]).toContain(photon));
    });
});

/**
 * Eve's intercept-resend attack. She draws a random basis, measures in it, then
 * RE-EMITS a new photon encoding her result IN THE BASIS SHE MEASURED IN — a
 * measurement result is meaningless without the basis that produced it.
 *
 * `Math.random()` is called twice per photon in a fixed order: first for Eve's
 * basis (`bases[floor(r * 2)]`), then for the fallback coin flip when her basis
 * mismatches Alice's. Pinning it therefore fixes the whole attack:
 *   0.4 -> basis '+' every photon, fallback measurement '0'
 *   0.6 -> basis 'x' every photon, fallback measurement '1'
 *
 * The domain test below is the ORIGINAL one; it passes on output that ignores
 * Eve's measurement entirely, which is how Task 57's bug survived. The basis
 * tests are the ones that would have caught it.
 */
describe('mimicEveIntercept', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns the same number of photons, still in the valid domain', () => {
        const photons = generateAlicePhotons(
            generateAliceBits(16), generateAliceBases(16));
        const intercepted = mimicEveIntercept(photons);
        expect(intercepted).toHaveLength(16);
        intercepted.forEach(photon => expect([1, 2, 3, 4]).toContain(photon));
    });

    it('measuring in + can only re-emit + photons (1, 2)', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.4);
        mimicEveIntercept([1, 2, 3, 4, 1, 2, 3, 4])
            .forEach(photon => expect([1, 2]).toContain(photon));
    });

    it('measuring in x can only re-emit x photons (3, 4)', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.6);
        mimicEveIntercept([1, 2, 3, 4, 1, 2, 3, 4])
            .forEach(photon => expect([3, 4]).toContain(photon));
    });

    it('measuring in +: matched photons keep their bit, mismatched collapse', () => {
        // 1 -> measured '0' -> 1;  2 -> measured '1' -> 2;
        // 3 and 4 are x photons: basis mismatch -> fallback '0' -> 1.
        vi.spyOn(Math, 'random').mockReturnValue(0.4);
        expect(mimicEveIntercept([1, 2, 3, 4, 1, 2, 3, 4]))
            .toEqual([1, 2, 1, 1, 1, 2, 1, 1]);
    });

    it('measuring in x: matched photons keep their bit, mismatched collapse', () => {
        // 3 -> measured '0' -> 3;  4 -> measured '1' -> 4;
        // 1 and 2 are + photons: basis mismatch -> fallback '1' -> 4.
        vi.spyOn(Math, 'random').mockReturnValue(0.6);
        expect(mimicEveIntercept([1, 2, 3, 4, 1, 2, 3, 4]))
            .toEqual([4, 4, 3, 4, 4, 4, 3, 4]);
    });

    it('no photon position is stuck on a constant value', () => {
        const photons = Array(8).fill(1);
        const seen: Set<number>[] = photons.map(() => new Set<number>());
        for (let run = 0; run < 200; run++) {
            mimicEveIntercept(photons)
                .forEach((photon, index) => seen[index].add(photon));
        }
        seen.forEach(values => expect(values.size).toBeGreaterThan(1));
    });
});

describe('getValidBits (sifting)', () => {
    it('keeps exactly the bits where the bases match', () => {
        const bits = ['1', '0', '1', '0'];
        const bobBases = ['+', 'x', '+', 'x'];
        const aliceBases = ['+', '+', '+', 'x'];
        expect(getValidBits(bits, bobBases, aliceBases)).toEqual(['1', '1', '0']);
    });

    it('returns nothing when no bases match — the insufficient-key scenario', () => {
        expect(getValidBits(['1', '0'], ['+', 'x'], ['x', '+'])).toEqual([]);
    });
});

/**
 * Seeded PRNG (mulberry32) so the statistical contract below is DETERMINISTIC
 * in CI — no flakiness, yet still exercises the real random pipeline.
 */
const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * PHYSICS CONTRACT (Task 57 Slice 4). These pin the PROTOCOL BEHAVIOUR end to
 * end — not a function's shape. Shape-only tests are exactly what let the Eve
 * bug (a valid-looking but physically wrong photon stream) survive 22 months;
 * these are the tests that would have caught it, and the safety net for the
 * upcoming lib/bb84/protocol.ts extraction (Slice 2.5).
 *
 * Full pipeline: bits → bases → photons → [Eve] → Bob measures → sift both
 * sides on matching bases → compare. `getValidBits` filters on the same
 * (bobBases === aliceBases) condition for both players, so the two sifted
 * arrays are index-aligned and can be compared position by position.
 */
describe('BB84 physics contract (end to end)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const runGame = (n: number, withEve: boolean) => {
        const aliceBits = generateAliceBits(n);
        const aliceBases = generateAliceBases(n);
        let photons = generateAlicePhotons(aliceBits, aliceBases);
        if (withEve) {
            photons = mimicEveIntercept(photons);
        }
        const [bobBases, bobBits] = simulateBobExchange(photons);
        const aliceKey = getValidBits(aliceBits, bobBases, aliceBases);
        const bobKey = getValidBits(bobBits, bobBases, aliceBases);
        let sifted = 0;
        let errors = 0;
        for (let i = 0; i < aliceKey.length; i++) {
            sifted++;
            if (aliceKey[i] !== bobKey[i]) errors++;
        }
        return {sifted, errors};
    };

    it('a clean channel (no Eve) yields IDENTICAL sifted keys — zero errors', () => {
        // Deterministic by physics: on a matching basis Bob reproduces Alice's
        // bit exactly, so Alice's and Bob's sifted keys are bit-for-bit equal.
        let sifted = 0;
        let errors = 0;
        for (let trial = 0; trial < 3000; trial++) {
            const r = runGame(16, false);
            sifted += r.sifted;
            errors += r.errors;
        }
        expect(sifted).toBeGreaterThan(0);
        expect(errors).toBe(0);
    });

    it('Eve disturbs ~25% of sifted bits — the BB84 detection signal', () => {
        // Theory: P(error | sifted) = P(Eve's basis ≠ Alice's) × ½ = ¼.
        // (If Eve guesses the basis she re-emits perfectly; if not, Bob — who
        // shares Alice's basis here — gets a coin flip.) The pre-fix bug made
        // this ~50%, over-teaching "Eve always caught". Seeded → stable in CI.
        vi.spyOn(Math, 'random').mockImplementation(mulberry32(0x51ce));
        let sifted = 0;
        let errors = 0;
        for (let trial = 0; trial < 8000; trial++) {
            const r = runGame(16, true);
            sifted += r.sifted;
            errors += r.errors;
        }
        const rate = errors / sifted;
        expect(rate).toBeGreaterThan(0.22);
        expect(rate).toBeLessThan(0.28);
    });

    it('simulateBobExchange is deterministic when Bob measures in the matching basis', () => {
        // random() = 0 → Bob's basis '+', + photons reproduce their bit exactly.
        vi.spyOn(Math, 'random').mockReturnValue(0);
        expect(simulateBobExchange([1, 2, 1, 2])[1]).toEqual(['0', '1', '0', '1']);
        vi.restoreAllMocks();
        // random() = 0.5 → Bob's basis 'x', x photons reproduce their bit exactly.
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        expect(simulateBobExchange([3, 4, 3, 4])[1]).toEqual(['0', '1', '0', '1']);
    });

    it('getValidBits keeps exactly the matching-basis positions, in order', () => {
        const bits = ['1', '0', '1', '0', '1'];
        const bobBases = ['+', 'x', '+', 'x', '+'];
        const aliceBases = ['+', '+', '+', 'x', 'x'];
        // matches at indices 0, 2, 3 → bits '1', '1', '0'
        expect(getValidBits(bits, bobBases, aliceBases)).toEqual(['1', '1', '0']);
    });
});

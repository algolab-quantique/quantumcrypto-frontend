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

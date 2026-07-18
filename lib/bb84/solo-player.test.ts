/**
 * BB84 physics/generation tests (Task 47 phase 1 — docs/testing-strategy.md).
 * Shape and invariant checks on the quantum-simulation helpers; randomness is
 * asserted through properties (lengths, domains), not exact values.
 */

import {describe, expect, it} from 'vitest';
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

describe('mimicEveIntercept', () => {
    it('returns the same number of photons, still in the valid domain', () => {
        const photons = generateAlicePhotons(
            generateAliceBits(16), generateAliceBases(16));
        const intercepted = mimicEveIntercept(photons);
        expect(intercepted).toHaveLength(16);
        intercepted.forEach(photon => expect([1, 2, 3, 4]).toContain(photon));
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

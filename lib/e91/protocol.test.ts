/**
 * E91 protocol physics — the acceptance suite for `docs/protocol-physics.md` §10.
 *
 * Two layers, and the second is the point:
 *   §10.10 — four headline numbers. Necessary, and NOT sufficient.
 *   §10.14 — seven properties a wrong implementation can violate while still
 *            producing all four headline numbers correctly.
 *
 * Statistical assertions run a fixed sample with generous tolerance: they exist
 * to catch a wrong MODEL, not to police the tenth decimal of a coin flip.
 */

import {describe, expect, it} from 'vitest';
import {
    ALICE_ANGLES, BOB_ANGLES, CHSH_COMBINATIONS, EVE_ANGLES,
    type Angle, type Bit, type Round,
    chshTermCounts, chshValue, classifyCombination, correlations, describeRun, runE91Protocol,
    createEntangledPair, createEntangledPairs, createProductPair, eavesdrop,
    generateRandomBases, measureOneSide, measureOtherSide, measurePair,
    probDifferent, siftKeyBits, angleOfBasisId, basisIdOfAngle,
} from './protocol';

const N = 40000;

/** Play `n` rounds at fixed angles and return them. */
const play = (n: number, a: Angle, b: Angle, withEve: boolean): Round[] =>
    Array.from({length: n}, () => {
        const pair = withEve ? eavesdrop(createEntangledPair()).sent : createEntangledPair();
        const {aliceBit, bobBit} = measurePair(pair, a, b);
        return {aliceAngle: a, bobAngle: b, aliceBit, bobBit};
    });

const E = (a: Angle, b: Angle, withEve: boolean, n = N): number =>
    correlations(play(n, a, b, withEve))[`${a}/${b}`];

const S = (withEve: boolean): number => chshValue(
    Object.fromEntries(CHSH_COMBINATIONS.map(([a, b]) => [`${a}/${b}`, E(a, b, withEve)])),
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * A FULL protocol run, the way the reference workshop does it: random bases on
 * both sides, measure, sift, Bell test. Everything else in this file probes one
 * rule at fixed angles — this is the only test that exercises the pipeline
 * end to end, and it is the one that answers "does the module behave like E91?"
 */
const runProtocol = (n: number, withEve: boolean) => {
    const aliceAngles = generateRandomBases(n, ALICE_ANGLES);
    const bobAngles = generateRandomBases(n, BOB_ANGLES);
    const aliceBits: Bit[] = [];
    const bobBits: Bit[] = [];
    const rounds: Round[] = [];

    for (let i = 0; i < n; i++) {
        const pair = withEve ? eavesdrop(createEntangledPair()).sent : createEntangledPair();
        const {aliceBit, bobBit} = measurePair(pair, aliceAngles[i], bobAngles[i]);
        aliceBits.push(aliceBit);
        bobBits.push(bobBit);
        rounds.push({aliceAngle: aliceAngles[i], bobAngle: bobAngles[i], aliceBit, bobBit});
    }

    const aliceKey = siftKeyBits(aliceBits, aliceAngles, bobAngles);
    const bobKey = siftKeyBits(bobBits, aliceAngles, bobAngles);
    const errors = aliceKey.filter((b, i) => b !== bobKey[i]).length;

    return {
        aliceKey, bobKey,
        keyErrorRate: aliceKey.length ? errors / aliceKey.length : 0,
        S: chshValue(correlations(rounds)),
        bellRounds: rounds.filter(r => classifyCombination(r.aliceAngle, r.bobAngle) === 'chsh').length,
    };
};

describe('end to end — the reference workshop’s own run', () => {
    /**
     * 10 000 pairs, not the workshop's 2 000, and the reason is worth stating.
     * At 2 000 each CHSH term rests on ~222 rounds, so σ(S) ≈ 0.134 — and
     * "S > 2.5" is then only a 2.4σ claim, failing roughly 1 run in 100. That
     * is TRUE of the real experiment too, but a suite that reddens at random
     * teaches the team to ignore red. At 10 000, σ(S) ≈ 0.060 and every
     * assertion below clears 5σ.
     *
     * The DETERMINISTIC claims — identical keys, zero errors — hold at any size.
     */
    it('WITHOUT Eve: S reaches 2√2 and the two keys are identical', () => {
        const r = runProtocol(10000, false);

        expect(r.S).toBeGreaterThan(2.5);          // the workshop's own threshold
        expect(r.S).toBeLessThan(3.0);
        expect(r.keyErrorRate).toBe(0);            // matching bases never disagree
        expect(r.aliceKey).toEqual(r.bobKey);      // a shared secret, never exchanged
        expect(r.aliceKey.length).toBeGreaterThan(1800);  // ≈ 2/9 of 10 000
        expect(r.bellRounds).toBeGreaterThan(3900);       // ≈ 4/9 of 10 000
    });

    it('WITH Eve: S collapses below the classical bound and the keys diverge', () => {
        const r = runProtocol(10000, true);

        expect(r.S).toBeLessThan(2);               // Bell inequality restored
        expect(r.S).toBeGreaterThan(1.1);          // ≈ √2, 5σ either side
        expect(r.keyErrorRate).toBeGreaterThan(0.22);
        expect(r.keyErrorRate).toBeLessThan(0.28);
        expect(r.aliceKey).not.toEqual(r.bobKey);
    });

    it('the verdict a student would reach is right in both runs', () => {
        // The whole point of E91: the Bell test, not the key, reveals her.
        expect(runProtocol(10000, false).S > 2.5).toBe(true);
        expect(runProtocol(10000, true).S > 2.5).toBe(false);
    });
});

describe('runE91Protocol — the whole thing in one call', () => {
    it('with no Eve: keys identical, no errors, S above the classical bound', () => {
        const r = runE91Protocol({photons: 2000, eveFraction: 0});
        expect(r.keysMatch).toBe(true);
        expect(r.keyErrorRate).toBe(0);
        expect(r.eveGuessedRightBits).toBe(0);
        expect(r.chsh).toBeGreaterThan(2.5);
    });

    it('with Eve on every pair: keys diverge, ~25% errors, S below 2', () => {
        const r = runE91Protocol({photons: 2000, eveFraction: 1});
        expect(r.keysMatch).toBe(false);
        // ~444 key bits, so σ ≈ 0.021: ±0.05 would be only 2.4σ. ±0.09 is ~4.3σ.
        expect(r.keyErrorRate).toBeGreaterThan(0.16);
        expect(r.keyErrorRate).toBeLessThan(0.34);
        expect(r.chsh).toBeLessThan(2);
        // She measured every pair, but only a matching basis leaves her holding
        // their bit — about 1 key bit in 4. This is the SAME quantity the game
        // reports; an earlier version counted "her bit equals Alice's" instead,
        // which is 62.5% and overstates her by 2.5x (caught 2026-09-17).
        const ratio = r.eveGuessedRightBits / r.aliceKey.length;
        expect(ratio).toBeGreaterThan(0.18);
        expect(ratio).toBeLessThan(0.32);
    });

    /**
     * The lesson the module makes checkable: a HALF-tap keeps S above 2, so the
     * Bell test alone never sees her — while she still learns a large share of
     * the key. S = 2√2(1 − f/2) crosses 2 only at f ≈ 0.586.
     */
    it('an Eve who taps half the pairs hides from the Bell test', () => {
        // 40 000 photons, not 4 000, and the reason is the point of the test:
        // S = 2.12 sits only 0.12 above the classical bound. At 4 000 photons
        // σ(S) ≈ 0.095, so "S > 2" is a 1.3σ claim and fails about one run in
        // ten. At 40 000, σ(S) ≈ 0.030 and the same claim is 4σ. A test that
        // asserts a NARROW margin needs the samples to resolve it.
        const r = runE91Protocol({photons: 40000, eveFraction: 0.5});
        expect(r.chsh).toBeGreaterThan(2);            // invisible — 4σ at this n
        expect(r.chsh).toBeLessThan(2.3);             // ≈ 2.121, and nowhere near 2√2
        expect(r.keyErrorRate).toBeGreaterThan(0.08); // but the errors show
    });

    it('describeRun renders the run without printing it', () => {
        const text = describeRun(runE91Protocol({photons: 200, eveFraction: 0}));
        expect(text).toContain('E91 — 200 entangled pairs');
        expect(text).toContain('keys identical          : YES');
        expect(text).toMatch(/E\( 0°, 45°\) =/);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
/**
 * One game measured the way MULTIPLAYER measures it: Eve's pairs are drawn at
 * START, before anyone measures; then one player's click measures ALL their
 * photons, and the other player's click measures all of theirs against them.
 * Either player may be first. Every other pipeline test goes through
 * `measurePair`, where Alice is always first and pairs go one at a time.
 * (Mirrored in the backend's `e91/test_protocol.py`, which uses this module's
 * Python translation — the same tests hold both copies.)
 */
const multiplayerGame = (n: number, withEve: boolean, first: 'A' | 'B') => {
    const aliceAngles = generateRandomBases(n, ALICE_ANGLES);
    const bobAngles = generateRandomBases(n, BOB_ANGLES);
    const pairs = Array.from({length: n}, () =>
        withEve ? eavesdrop(createEntangledPair()).sent : createEntangledPair());

    const [firstAngles, secondAngles] =
        first === 'A' ? [aliceAngles, bobAngles] : [bobAngles, aliceAngles];
    const firstBits = pairs.map((p, i) => measureOneSide(p, firstAngles[i]));
    const secondBits = pairs.map((p, i) =>
        measureOtherSide(p, secondAngles[i], firstBits[i], firstAngles[i]));
    const [aliceBits, bobBits] =
        first === 'A' ? [firstBits, secondBits] : [secondBits, firstBits];

    const rounds: Round[] = aliceBits.map((aliceBit, i) => ({
        aliceAngle: aliceAngles[i], bobAngle: bobAngles[i], aliceBit, bobBit: bobBits[i],
    }));
    const aliceKey = siftKeyBits(aliceBits, aliceAngles, bobAngles);
    const bobKey = siftKeyBits(bobBits, aliceAngles, bobAngles);
    const ones = (bits: Bit[]) => bits.filter(b => b === '1').length / n;
    return {
        S: chshValue(correlations(rounds)),
        aliceKey, bobKey,
        keyErrorRate: aliceKey.filter((b, i) => b !== bobKey[i]).length / aliceKey.length,
        aliceOnes: ones(aliceBits),
        bobOnes: ones(bobBits),
    };
};

describe('multiplayer shape — the same physics, in both click orders', () => {
    /**
     * Who clicks first must change nothing. 10 000 pairs; every bound is ≥ 4σ
     * from theory (σ(S) ≈ 0.045 without Eve, 0.058 with; σ(key error) ≈ 0.009;
     * σ(share of 1s) = 0.005).
     */
    for (const first of ['A', 'B'] as const) {
        const who = first === 'A' ? 'Alice' : 'Bob';

        it(`without Eve, ${who} clicks first: S ≈ 2√2, keys identical, fair sides`, () => {
            const g = multiplayerGame(10000, false, first);
            expect(g.S).toBeGreaterThan(2.6);
            expect(g.S).toBeLessThan(3.05);
            expect(g.aliceKey).toEqual(g.bobKey);
            for (const share of [g.aliceOnes, g.bobOnes]) {
                expect(share).toBeGreaterThan(0.48);
                expect(share).toBeLessThan(0.52);
            }
        });

        it(`with Eve, ${who} clicks first: S ≈ √2, ~25% key errors, fair sides`, () => {
            const g = multiplayerGame(10000, true, first);
            expect(g.S).toBeGreaterThan(1.15);
            expect(g.S).toBeLessThan(1.7);
            expect(g.keyErrorRate).toBeGreaterThan(0.21);
            expect(g.keyErrorRate).toBeLessThan(0.29);
            for (const share of [g.aliceOnes, g.bobOnes]) {
                expect(share).toBeGreaterThan(0.48);
                expect(share).toBeLessThan(0.52);
            }
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
describe('§10.10 — the four headline numbers', () => {
    it('S = 2√2 on undisturbed pairs', () => {
        expect(S(false)).toBeCloseTo(2 * Math.SQRT2, 1);
    });

    it('S falls to √2 once Eve has been there — below the classical bound of 2', () => {
        const s = S(true);
        expect(s).toBeCloseTo(Math.SQRT2, 1);
        expect(s).toBeLessThan(2);
    });

    it('key rounds never disagree without Eve, and disagree 25% with her', () => {
        for (const angle of [45, 90] as Angle[]) {
            const clean = play(N, angle, angle, false);
            expect(clean.filter(r => r.aliceBit !== r.bobBit)).toHaveLength(0);

            const dirty = play(N, angle, angle, true);
            const errors = dirty.filter(r => r.aliceBit !== r.bobBit).length / N;
            // Explicit bounds, not toBeCloseTo(0.25, 2): that is ±0.005 where
            // σ = 0.0022, i.e. 2.3σ — it failed about 2 runs in 100. A test that
            // fails at random teaches the team to ignore red. ±0.01 is ~4.6σ and
            // still catches any shift of one percentage point.
            expect(errors).toBeGreaterThan(0.24);
            expect(errors).toBeLessThan(0.26);
        }
    });

    it('every outcome is a fair coin — per side AND per angle, with or without Eve', () => {
        for (const withEve of [false, true]) {
            for (const a of ALICE_ANGLES) {
                for (const b of BOB_ANGLES) {
                    const rounds = play(6000, a, b, withEve);
                    const aliceOnes = rounds.filter(r => r.aliceBit === '1').length / 6000;
                    const bobOnes = rounds.filter(r => r.bobBit === '1').length / 6000;
                    expect(aliceOnes).toBeGreaterThan(0.45);
                    expect(aliceOnes).toBeLessThan(0.55);
                    expect(bobOnes).toBeGreaterThan(0.45);
                    expect(bobOnes).toBeLessThan(0.55);
                }
            }
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('§10.14 property 1 — each CHSH term, with its sign', () => {
    /**
     * Summing magnitudes also gives 2.83. Only the individual signs distinguish
     * the real geometry from |E₁|+|E₂|+|E₃|+|E₄|.
     */
    it('E(0,135) is NEGATIVE; the other three are positive', () => {
        expect(E(0, 45, false)).toBeCloseTo(Math.SQRT1_2, 1);
        expect(E(0, 135, false)).toBeCloseTo(-Math.SQRT1_2, 1);
        expect(E(0, 135, false)).toBeLessThan(-0.6);
        expect(E(90, 45, false)).toBeCloseTo(Math.SQRT1_2, 1);
        expect(E(90, 135, false)).toBeCloseTo(Math.SQRT1_2, 1);
    });
});

describe('§10.14 property 2 — the 9 combinations, by ORDERED pair', () => {
    /**
     * THE SUBTLE ONE. cos(45−90) = cos(0−45), so an unordered check that admits
     * (45,90) into a CHSH bucket leaves S at exactly 2√2 — every headline number
     * above still passes while the sifter is corrupt.
     */
    it('(90,45) is a Bell round; (45,90) is discarded', () => {
        expect(classifyCombination(90, 45)).toBe('chsh');
        expect(classifyCombination(45, 90)).toBe('discard');
    });

    it('partitions all nine as 2 key + 4 chsh + 3 discard', () => {
        const seen: Record<string, string[]> = {key: [], chsh: [], discard: []};
        for (const a of ALICE_ANGLES) {
            for (const b of BOB_ANGLES) seen[classifyCombination(a, b)].push(`${a}/${b}`);
        }
        expect(seen.key.sort()).toEqual(['45/45', '90/90']);
        expect(seen.chsh.sort()).toEqual(['0/135', '0/45', '90/135', '90/45']);
        expect(seen.discard.sort()).toEqual(['0/90', '45/135', '45/90']);
    });
});

describe('§10.14 property 3 — no signalling', () => {
    /**
     * Bob's own statistics must not move when Alice changes her angle. A version
     * that biased him per her angle would still average to 50% overall — and
     * would be faster-than-light signalling.
     */
    it("Bob's marginal is 50% for EACH of Alice's angles separately", () => {
        for (const a of ALICE_ANGLES) {
            const rounds = play(20000, a, 45, false);
            const ones = rounds.filter(r => r.bobBit === '1').length / 20000;
            expect(ones).toBeGreaterThan(0.485);
            expect(ones).toBeLessThan(0.515);
        }
    });
});

describe('§10.14 property 4 — Eve forwards what she actually read', () => {
    /**
     * If she drew one bit for herself and a DIFFERENT one into the pair, S would
     * still be √2 and the error rate still 25% — every headline number passes —
     * but her knowledge of the key would be zero. This is the only test that
     * looks at what she knows.
     */
    it('forwards the bit she READ — she relays, she never fabricates', () => {
        // THE one that mutation testing caught. An implementation that measured
        // the pair and then sent an unrelated coin passed every other test here:
        // S still √2, key error still 25 %, marginals still fair. Only her
        // knowledge silently vanished. Comparing her read to what she sent is
        // the only assertion that sees it.
        for (let i = 0; i < 4000; i++) {
            const e = eavesdrop(createEntangledPair());
            expect(e.sent.kind).toBe('product');
            if (e.sent.kind === 'product') {
                expect(e.sent.bit).toBe(e.bit);
                expect(e.sent.angle).toBe(e.angle);
            }
        }
    });

    it('when her angle matches theirs, all three bits are identical, always', () => {
        for (let i = 0; i < 4000; i++) {
            const e = eavesdrop(createEntangledPair());
            const {aliceBit, bobBit} = measurePair(e.sent, e.angle, e.angle);
            expect(aliceBit).toBe(e.bit);
            expect(bobBit).toBe(e.bit);
        }
    });

    it('45° off, on key rounds where they agree, she has their bit 97.1% of the time', () => {
        let agreed = 0;
        let sheKnew = 0;
        for (let i = 0; i < 60000; i++) {
            const sent = createProductPair(0, Math.random() < 0.5 ? '0' : '1');
            const {aliceBit, bobBit} = measurePair(sent, 45, 45);
            if (aliceBit !== bobBit) continue;
            agreed += 1;
            if (sent.kind === 'product' && sent.bit === aliceBit) sheKnew += 1;
        }
        expect(sheKnew / agreed).toBeCloseTo(0.971, 2);
    });
});

describe('§10.14 property 5 — no acute-angle normalisation', () => {
    it('Δ=135° gives 0.854, never 0.146', () => {
        expect(probDifferent(0, 0)).toBe(0);
        expect(probDifferent(0, 45)).toBeCloseTo(0.1464, 3);
        expect(probDifferent(0, 90)).toBeCloseTo(0.5, 10);
        expect(probDifferent(0, 135)).toBeCloseTo(0.8536, 3);
        expect(probDifferent(0, 135)).toBeGreaterThan(0.85);
    });

    it('is symmetric in its two angles', () => {
        expect(probDifferent(0, 135)).toBeCloseTo(probDifferent(135, 0), 10);
    });
});

describe('§10.14 property 6 — each SIDE measures once; the pair may be read twice', () => {
    /**
     * This row of the spec was wrong twice. A product pair IS measured twice,
     * once per side — and so is an entangled one in multiplayer, where the first
     * arrival calls measureOneSide and the second calls measureOtherSide on it.
     * Neither may throw.
     */
    it('both sides may measure the same product pair', () => {
        const pair = createProductPair(45, '1');
        expect(measureOneSide(pair, 45)).toBe('1');
        expect(measureOneSide(pair, 45)).toBe('1');
    });

    it('multiplayer reads one entangled pair twice — one call per side', () => {
        const pair = createEntangledPair();
        const first = measureOneSide(pair, 45);
        const second = measureOtherSide(pair, 45, first, 45);
        expect(second).toBe(first);            // Δ=0 → they must agree
    });
});

describe('§10.14 property 7 — rounds are independent of each other', () => {
    /**
     * State leaking between rounds is the exact shape of the BB84 bug that
     * opened this whole effort, and aggregate statistics hide it completely.
     */
    const lag1 = (xs: number[]): number => {
        const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
        let num = 0;
        let den = 0;
        for (let i = 0; i < xs.length; i++) {
            den += (xs[i] - mean) ** 2;
            if (i > 0) num += (xs[i] - mean) * (xs[i - 1] - mean);
        }
        return num / den;
    };

    it("Alice's outcomes and Eve's angles show no round-to-round correlation", () => {
        const bits: number[] = [];
        const angles: number[] = [];
        for (let i = 0; i < 20000; i++) {
            const e = eavesdrop(createEntangledPair());
            angles.push(e.angle);
            bits.push(measurePair(e.sent, 45, 90).aliceBit === '1' ? 1 : 0);
        }
        expect(Math.abs(lag1(bits))).toBeLessThan(0.03);
        expect(Math.abs(lag1(angles))).toBeLessThan(0.03);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('the two traps found reviewing this file', () => {
    /**
     * `undefined === undefined` is TRUE, so a short angle array silently admits
     * out-of-range bits into the key — the exact shape of the BB84 bug (§6).
     */
    it('siftKeyBits refuses misaligned arrays instead of inventing key bits', () => {
        const bits: Bit[] = ['0', '1', '0', '1', '1', '1'];
        expect(() => siftKeyBits(bits, [0, 45, 90, 0] as Angle[], [0, 90, 90, 45] as Angle[]))
            .toThrow(/length mismatch/);
    });

    it('siftKeyBits keeps exactly the matching-angle rounds when aligned', () => {
        const bits: Bit[] = ['0', '1', '0', '1'];
        const a = [45, 45, 90, 0] as Angle[];
        const b = [45, 90, 90, 45] as Angle[];
        expect(siftKeyBits(bits, a, b)).toEqual(['0', '0']);
    });

    it('the exported angle tables cannot be mutated at runtime', () => {
        expect(() => (ALICE_ANGLES as Angle[]).push(135)).toThrow();
        expect(ALICE_ANGLES).toHaveLength(3);
    });

    /**
     * An empty CHSH term contributes 0, dragging S toward the classical range for
     * a reason that is not physics. At 20 photons this happens in 34% of games.
     */
    it('chshTermCounts exposes a term with no rounds behind it', () => {
        const rounds = play(10, 0, 45, false);
        const counts = chshTermCounts(rounds);
        expect(counts['0/45']).toBe(10);
        expect(counts['0/135']).toBe(0);
        expect(chshValue(correlations(rounds))).toBeLessThan(2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('the plumbing', () => {
    it('makes n identical entangled pairs, carrying nothing', () => {
        const pairs = createEntangledPairs(3);
        expect(pairs).toHaveLength(3);
        expect(pairs.every(p => p.kind === 'entangled')).toBe(true);
    });

    it('draws bases only from the set it was given', () => {
        const bases = generateRandomBases(200, ALICE_ANGLES);
        expect(bases).toHaveLength(200);
        expect(bases.every(b => ALICE_ANGLES.includes(b))).toBe(true);
        expect(new Set(bases).size).toBeGreaterThan(1);
    });

    it('eavesdrop returns a NEW product pair, never the one it was given', () => {
        const original = createEntangledPair();
        const e = eavesdrop(original);
        expect(original.kind).toBe('entangled');       // untouched
        expect(e.sent.kind).toBe('product');
        expect(EVE_ANGLES).toContain(e.angle);
    });

    it('translates the UI basis ids both ways, and rejects nonsense', () => {
        expect(angleOfBasisId('1')).toBe(0);
        expect(angleOfBasisId('4')).toBe(135);
        expect(angleOfBasisId('9')).toBeUndefined();
        expect(basisIdOfAngle(135)).toBe('4');
    });
});

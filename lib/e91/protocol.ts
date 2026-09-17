/**
 * E91 protocol physics — the single source of truth.
 *
 * Specified in `docs/protocol-physics.md` §10, which is the contract: this file
 * is a transcription of §10.9, and §10.10/§10.13 say what it must produce. If
 * the two ever disagree, the document is right and this file is wrong.
 *
 * Mode-agnostic by construction: solo calls `measurePair`, multiplayer calls the
 * two halves it is composed of. Nothing here knows which mode it is in, and
 * nothing here knows about the UI's legacy basis ids (see `angleOfBasisId`).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types and constants (§10.2)
// ─────────────────────────────────────────────────────────────────────────────

/** '0' | '1' — strings, like BB84's, so a key prints as itself. */
export type Bit = '0' | '1';

/**
 * Measurement bases, in DEGREES. These are qubit (Bloch-sphere) angles, not
 * polarizer angles — §10.3. Orthogonal is 180° apart here, which is why the
 * disagreement rule carries the Δ/2.
 */
export type Angle = 0 | 45 | 90 | 135;

// Frozen, not merely `readonly`: that keyword vanishes at compile time, and these
// are module singletons — one stray push would corrupt every game in the tab.
export const ALICE_ANGLES: readonly Angle[] = Object.freeze([0, 45, 90] as Angle[]);
export const BOB_ANGLES: readonly Angle[] = Object.freeze([45, 90, 135] as Angle[]);

/** Eve draws from every angle: she does not know which two will be compared. */
export const EVE_ANGLES: readonly Angle[] = Object.freeze([0, 45, 90, 135] as Angle[]);

/** The four Bell-test combinations, ORDERED (Alice, Bob) — §10.2. */
export const CHSH_COMBINATIONS: ReadonlyArray<readonly [Angle, Angle]> = Object.freeze(
    ([[0, 45], [0, 135], [90, 45], [90, 135]] as [Angle, Angle][]).map(p => Object.freeze(p)),
);

/**
 * A pair between the source and the detectors (§10.8).
 *
 * `entangled` carries nothing: neither particle has a value or a direction
 * until measured, so every intact pair is interchangeable.
 * `product` is an ordinary unentangled pair — both particles definite along one
 * angle. It is what Eve forwards, and those two fields are its whole
 * description.
 */
export type Pair =
    | {readonly kind: 'entangled'}
    | {readonly kind: 'product'; readonly angle: Angle; readonly bit: Bit};

// ─────────────────────────────────────────────────────────────────────────────
// The one physical rule (§10.3)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How often a measurement at one angle disagrees with a state defined at
 * another. The only physics in this file; everything below is built from it.
 *
 * NOT normalised to an acute angle: Δ = 135° must give 0.854, not 0.146.
 */
export const probDifferent = (fromDegrees: number, toDegrees: number): number =>
    Math.sin(((fromDegrees - toDegrees) * Math.PI / 180) / 2) ** 2;

const coin = (): Bit => (Math.random() < 0.5 ? '0' : '1');
const flip = (bit: Bit): Bit => (bit === '0' ? '1' : '0');
const maybeFlip = (bit: Bit, p: number): Bit => (Math.random() < p ? flip(bit) : bit);

// ─────────────────────────────────────────────────────────────────────────────
// Making pairs (§10.9 steps 1)
// ─────────────────────────────────────────────────────────────────────────────

export const createEntangledPair = (): Pair => ({kind: 'entangled'});

/** n of them, all identical — an intact pair carries nothing to differ in. */
export const createEntangledPairs = (n: number): Pair[] =>
    Array.from({length: n}, createEntangledPair);

/** An ordinary pair, both particles definite along `angle`. Eve builds these. */
export const createProductPair = (angle: Angle, bit: Bit): Pair =>
    ({kind: 'product', angle, bit});

// ─────────────────────────────────────────────────────────────────────────────
// Choosing bases (§10.9 step 2)
// ─────────────────────────────────────────────────────────────────────────────

export const generateRandomBases = (n: number, available: readonly Angle[]): Angle[] =>
    Array.from({length: n}, () => available[Math.floor(Math.random() * available.length)]);

// ─────────────────────────────────────────────────────────────────────────────
// Measuring (§10.9 steps 3–4)
// ─────────────────────────────────────────────────────────────────────────────
//
// WHY THERE ARE THREE OF THESE, when a Qiskit notebook needs only one.
//
// A quantum reference has `measure_bell_pair(pair, aliceBasis, bobBasis)` and
// needs no more, because both measurements happen on one line, in one process.
// Ours are split because MULTIPLAYER SPLITS THAT ONE LINE across two HTTP
// requests, minutes apart, from two browsers. Same physics — sliced so it can be
// called at two different times:
//
//     solo                       measurePair          (both sides, one act)
//     multiplayer, first click   measureOneSide       (no other angle known yet)
//     multiplayer, second click  measureOtherSide     (correlate against them)
//     Eve                        measureOneSide       then createProductPair
//
// And yes, `measureOtherSide` cheats: it reads the result the other side already
// got. No real detector does that — Alice's and Bob's are correlated with no
// signal passing between them. We are computing a non-local correlation on one
// machine, so the information has to travel somewhere. It never reaches a player.
//
// "IF THE PAIR IS ENTANGLED, WHY MEASURE — WHY NOT JUST COPY THEIR BIT?"
// Because that is right for 2 of the 9 combinations and wrong for the other 7.
// When the angles match, Δ = 0 and sin²(0/2) = 0, so measureOtherSide DOES copy,
// exactly — the key falls out of the rule instead of being a special case. When
// the angles differ the results are correlated but NOT identical, and copying
// would force E = +1 everywhere:
//
//     S = 1 − 1 + 1 + 1 = 2        ← exactly the classical bound. Never violated.
//
// A game built that way would report "classical" on a perfect channel: the Bell
// test could never fire and Eve would be invisible by making no difference. The
// partial disagreement at mismatched angles is not noise — it IS the signal.
// (And after Eve the pair is a product state, so measureOtherSide ignores their
// bit entirely — copying is wrong there too.)

/**
 * Measure ONE side, with nothing to go on.
 *
 * Used by Eve, and by multiplayer's first arrival — which needs a result before
 * the other player has chosen an angle. An entangled pair gives a fair coin in
 * every basis (§10.5); a product pair is already definite, so the rule applies.
 */
export const measureOneSide = (pair: Pair, angle: Angle): Bit =>
    pair.kind === 'entangled'
        ? coin()
        : maybeFlip(pair.bit, probDifferent(angle, pair.angle));

/**
 * Measure the OTHER side, when one side has already been measured.
 *
 * Used by multiplayer's second arrival. An entangled pair correlates against
 * what the other side actually got; a product pair does not care about them at
 * all — it is local, which is exactly what Eve destroyed to make it so.
 */
export const measureOtherSide = (
    pair: Pair, myAngle: Angle, theirBit: Bit, theirAngle: Angle,
): Bit =>
    pair.kind === 'entangled'
        ? maybeFlip(theirBit, probDifferent(myAngle, theirAngle))
        : measureOneSide(pair, myAngle);

/**
 * Both sides at once — solo, where one call is one act.
 *
 * A COMPOSITION of the two rules above, never a third rule: if it were written
 * out independently, multiplayer's second arrival would have to re-derive the
 * correlation, and a second copy of it is the defect this file exists to
 * prevent (§10.9).
 */
export const measurePair = (
    pair: Pair, aliceAngle: Angle, bobAngle: Angle,
): {aliceBit: Bit; bobBit: Bit} => {
    const aliceBit = measureOneSide(pair, aliceAngle);
    return {aliceBit, bobBit: measureOtherSide(pair, bobAngle, aliceBit, aliceAngle)};
};

/** What Eve did to one pair: what she read, and what she sent on. */
export type Interception = {
    /** The angle she measured at, and prepared the replacement along. */
    readonly angle: Angle;
    /** What she READ. The app shows the student how many of these she got right. */
    readonly bit: Bit;
    /** The ordinary pair she forwards. `sent.bit` is `bit`: she relays, she does
     *  not fabricate — and returning both is what lets a test prove it. */
    readonly sent: Pair;
};

/**
 * Eve: measure what arrived, then prepare and forward a NEW pair (§10.5).
 *
 * Not a primitive — two ordinary operations in the order she performs them.
 * Measuring destroys the pair, so she cannot forward the one she measured.
 *
 * Returns her READ as well as the pair, for two reasons. The app reports
 * "Eve has successfully read this number of bits", which needs it; and without
 * it, an implementation that measured the pair and then forwarded an unrelated
 * coin would be undetectable — S still falls to √2, the key error is still 25 %,
 * every headline number passes, and only her knowledge silently drops to zero.
 * (Found by mutation testing, 2026-09-17: that exact sabotage passed all 23
 * tests until this signature changed.)
 */
export const eavesdrop = (pair: Pair): Interception => {
    const angle = EVE_ANGLES[Math.floor(Math.random() * EVE_ANGLES.length)];
    const bit = measureOneSide(pair, angle);
    return {angle, bit, sent: createProductPair(angle, bit)};
};

// ─────────────────────────────────────────────────────────────────────────────
// Sifting (§10.9 step 5)
// ─────────────────────────────────────────────────────────────────────────────

export type Combination = 'key' | 'chsh' | 'discard';

/**
 * What a round is for. The pair is ORDERED: (90°,45°) is a Bell-test round and
 * (45°,90°) is discarded, because 45° is never one of Alice's CHSH angles. An
 * unordered check silently promotes three discarded rounds into Bell data —
 * and S still comes out at 2√2, so nothing downstream notices (§10.13 test 2).
 */
export const classifyCombination = (alice: Angle, bob: Angle): Combination => {
    if (alice === bob) return 'key';
    return CHSH_COMBINATIONS.some(([a, b]) => a === alice && b === bob)
        ? 'chsh' : 'discard';
};

/**
 * The key: the rounds where both chose the same angle. Automatic.
 *
 * The length check is not defensive noise. Without it, a short angle array makes
 * `aliceAngles[i] === bobAngles[i]` compare `undefined === undefined`, which is
 * TRUE — so out-of-range bits are silently admitted into the key. That is the
 * exact shape of the BB84 bug this whole document exists because of (§6): an
 * out-of-range index read as a value instead of as an error.
 */
export const siftKeyBits = (
    bits: readonly Bit[], aliceAngles: readonly Angle[], bobAngles: readonly Angle[],
): Bit[] => {
    if (bits.length !== aliceAngles.length || bits.length !== bobAngles.length) {
        throw new Error(
            `siftKeyBits: length mismatch — ${bits.length} bits, ` +
            `${aliceAngles.length} Alice angles, ${bobAngles.length} Bob angles. ` +
            'Sifting misaligned arrays silently corrupts the key.',
        );
    }
    return bits.filter((_, i) => aliceAngles[i] === bobAngles[i]);
};

// ─────────────────────────────────────────────────────────────────────────────
// The Bell test (§10.4)
// ─────────────────────────────────────────────────────────────────────────────

export type Round = {
    aliceAngle: Angle; bobAngle: Angle; aliceBit: Bit; bobBit: Bit;
};

const key = (a: Angle, b: Angle) => `${a}/${b}`;

/**
 * E(a,b) = P(same) − P(different), for every combination present.
 *
 * Deliberately knows nothing about which combinations are CHSH ones — it is
 * statistics, `classifyCombination` is protocol, and `chshValue` picks the four
 * it needs. Same separation CMAI has, and it lets a test ask for E(45°,45°).
 */
export const correlations = (rounds: readonly Round[]): Record<string, number> => {
    const tally: Record<string, {same: number; total: number}> = {};
    for (const r of rounds) {
        const k = key(r.aliceAngle, r.bobAngle);
        tally[k] ??= {same: 0, total: 0};
        tally[k].total += 1;
        if (r.aliceBit === r.bobBit) tally[k].same += 1;
    }
    const out: Record<string, number> = {};
    for (const [k, {same, total}] of Object.entries(tally)) {
        out[k] = total > 0 ? (2 * same) / total - 1 : 0;
    }
    return out;
};

/**
 * S = E(0,45) − E(0,135) + E(90,45) + E(90,135), absolute value.
 *
 * ⚠️ A combination with NO rounds contributes 0, which drags S toward the
 * classical range for a reason that has nothing to do with physics. Measured: at
 * 20 photons **34 %** of games have at least one empty term (11 % at 30). This is
 * a SECOND way the small sample misleads, separate from the variance in §10.11 —
 * use `chshTermCounts` to tell the student how many terms actually had data
 * (Task 68).
 */
/** How many rounds stand behind each CHSH term — 0 means that term is a guess. */
export const chshTermCounts = (rounds: readonly Round[]): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const [a, b] of CHSH_COMBINATIONS) counts[key(a, b)] = 0;
    for (const r of rounds) {
        const k = key(r.aliceAngle, r.bobAngle);
        if (k in counts) counts[k] += 1;
    }
    return counts;
};

export const chshValue = (corr: Record<string, number>): number => {
    const at = (a: Angle, b: Angle) => corr[key(a, b)] ?? 0;
    return Math.abs(at(0, 45) - at(0, 135) + at(90, 45) + at(90, 135));
};

// ─────────────────────────────────────────────────────────────────────────────
// The UI boundary
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The app stores bases as the ids '1'..'4'. Physics speaks degrees, so the
 * translation lives here — at the edge — and nothing above this line knows the
 * legacy scheme exists.
 */
export const angleOfBasisId = (id: string): Angle | undefined =>
    ({'1': 0, '2': 45, '3': 90, '4': 135} as const)[id as '1' | '2' | '3' | '4'];

export const basisIdOfAngle = (angle: Angle): string =>
    ({0: '1', 45: '2', 90: '3', 135: '4'} as const)[angle];

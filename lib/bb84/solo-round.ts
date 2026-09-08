import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import usePlayerStore from '@/store/player-store';
import {pushRoundWelcome} from '@/lib/bb84/round-transcript';
import {
    generateAliceBases,
    generateAliceBits,
    generateAlicePhotons,
    mimicEveIntercept,
} from '@/lib/bb84/protocol';

/**
 * The full Eve story of one solo GAME (not round) — written once at game
 * start, `detected` flipped when the Eve-detected dialog fires. It survives
 * the Eve-restart (which wipes the round's `evePresent`), so the solo results
 * page can reveal what actually happened (Task 51 phase 2, ADR §12):
 * absent / present-and-caught / present-and-missed.
 */
export type SoloEveRecord = {
    enabled: boolean;      // the modal checkbox
    percentage: number;    // the modal probability
    drawn: boolean;        // the actual draw at game start
    detected: boolean;     // flipped when the Eve-detected dialog fires
    rounds: number;        // 1 + number of restarts (any trigger)
};

const SOLO_EVE_RECORD_KEY = 'bb84SoloEveRecord';
const GAME_START_TIME_KEY = 'bb84GameStartTime';

/** Persist the game-start facts (Eve record + start time). Solo GAME scope:
 *  called once from the start modal; restarts deliberately do NOT rewrite it. */
export const recordSoloGameStart = (record: Omit<SoloEveRecord, 'detected' | 'rounds'>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SOLO_EVE_RECORD_KEY,
        JSON.stringify({...record, detected: false, rounds: 1} satisfies SoloEveRecord));
    localStorage.setItem(GAME_START_TIME_KEY, JSON.stringify(Date.now()));
};

export const markSoloEveDetected = () => {
    const record = readSoloEveRecord();
    if (!record) return;
    localStorage.setItem(SOLO_EVE_RECORD_KEY,
        JSON.stringify({...record, detected: true}));
};

/** Exported for bb84Adapter.incrementRoundCount (Task 63 Step 1). */
export const incrementSoloRoundCount = () => {
    const record = readSoloEveRecord();
    if (!record) return;
    localStorage.setItem(SOLO_EVE_RECORD_KEY,
        JSON.stringify({...record, rounds: (record.rounds ?? 1) + 1}));
};

export const readSoloEveRecord = (): SoloEveRecord | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(SOLO_EVE_RECORD_KEY);
        return raw ? JSON.parse(raw) as SoloEveRecord : null;
    } catch {
        return null;
    }
};

export const readSoloGameStartTime = (): number | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(GAME_START_TIME_KEY);
        return raw ? Number(JSON.parse(raw)) : null;
    } catch {
        return null;
    }
};

/**
 * Canonical "begin a solo round" (Task 50 F4/F3), and Task 63 Step 4a split it
 * in two. It used to do both jobs at once —
 * generate the partner's side AND write the opening transcript — which is how
 * the mode leaked into a hook named `beginRound`: in solo the two always
 * happen together, so nobody had to notice they were different things.
 *
 * `beginSoloRound` remains as their composition, because a solo game start
 * genuinely wants both, and the start modal calls it. The transcript half now
 * lives in `round-transcript.ts` — it serves multiplayer too, so it had no
 * business in a file named `solo-round`.
 */
export const beginSoloRound = (photonNumber: number, eve: boolean) => {
    prepareSoloRound(photonNumber, eve);
    pushRoundWelcome({prepared: true});
};

/**
 * Generate what a solo round needs before the player can act. SOLO ONLY: in
 * multiplayer the real Alice produces her own photons, and calling this there
 * would overwrite hers with fabricated ones.
 *
 * Only Bob needs it — Alice generates her photons through her own UI in both
 * modes, so for her this is just the stale-input cleanup.
 */
export const prepareSoloRound = (photonNumber: number, eve: boolean) => {
    // A new round must not inherit the previous round's in-progress inputs:
    // bob-exchange-tab re-hydrates its basis form from this key on mount
    // (bob-exchange-tab.tsx ~:84), so a stale value refills the "choose your
    // bases" form and Étape 1 loses its meaning. startFresh clears it via
    // clearProtocolStorage; the restart paths reach a new round through here.
    if (typeof window !== 'undefined') {
        localStorage.removeItem('bb84BobBasisInputs');
    }

    if (usePlayerStore.getState().playerRole !== 'B') return;

    const room = useBB84RoomStore.getState();
    const aliceBits = generateAliceBits(photonNumber);
    const aliceBases = generateAliceBases(photonNumber);
    let alicePhotons = generateAlicePhotons(aliceBits, aliceBases);
    if (eve) {
        alicePhotons = mimicEveIntercept(alicePhotons);
    }
    room.setAliceBits(aliceBits);
    room.setAliceBases(aliceBases);
    room.setAlicePhotons(alicePhotons);
};


/*
 * `restartSoloRound` used to live here. Task 63 Step 1 moved its seven steps
 * into the shared `restartRound(adapter, options)`
 * (lib/protocol-lifecycle/round.ts), and callers now name that function
 * directly — `restartRound(bb84Adapter, {withoutEve: true})`.
 *
 * No BB84-flavoured wrapper was kept, for two reasons. It would have to import
 * bb84Adapter, which imports `beginSoloRound` from this file: a module cycle.
 * And the point of the extraction is that a reader of the call site sees the
 * SHARED function — a wrapper per protocol is how three copies of a restart
 * came to exist in the first place.
 *
 * What stays BB84's own is `prepareSoloRound` above, reached through
 * `bb84Adapter.round.prepareRound`. The behaviour is unchanged: same order, same flag
 * semantics (Task 51: `gameHasEve` is the checkbox and restarts never touch it;
 * `evePresent` is the draw, preserved on a bad-luck restart and cleared by
 * `withoutEve` for the Eve-detected one, Task 49-C).
 */

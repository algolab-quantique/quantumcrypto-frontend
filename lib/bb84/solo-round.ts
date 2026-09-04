import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';
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
 * Canonical "begin a solo round" (Task 50 F4/F3): role-aware — reads the
 * player role from context and does the right thing:
 * - Bob:   generate Alice's bits/bases/photons (intercepted by Eve when `eve`
 *          is on) into the room store, plus Bob's welcome transcript.
 * - Alice: her welcome transcript only — she generates photons via her own UI.
 * Used by the solo start modal, the Eve restart, and the insufficient-key
 * restart. Do not copy these blocks inline.
 */
export const beginSoloRound = (photonNumber: number, eve: boolean) => {
    // A new round must not inherit the previous round's in-progress inputs:
    // bob-exchange-tab re-hydrates its basis form from this key on mount
    // (bob-exchange-tab.tsx ~:84), so a stale value refills the "choose your
    // bases" form and Étape 1 loses its meaning. startFresh clears it via
    // clearProtocolStorage; the restart paths reach a new round through here.
    if (typeof window !== 'undefined') {
        localStorage.removeItem('bb84BobBasisInputs');
    }

    const pushLines = useBB84ProgressStore.getState().pushLines;

    if (usePlayerStore.getState().playerRole === 'B') {
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
        pushLines([
            {title: 'component.exchange.welcome'},
            {content: 'component.bobExchange.waiting'},
            {content: 'component.bobExchange.photonsArrived'},
            {title: 'component.game.step1', content: 'component.bobExchange.choose'},
        ]);
        return;
    }

    pushLines([
        {title: 'component.exchange.welcome'},
        {title: 'component.game.step1', content: 'component.aliceExchange.start'},
    ]);
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
 * What stays BB84's own is `beginSoloRound` above, reached through
 * `bb84Adapter.beginRound`. The behaviour is unchanged: same order, same flag
 * semantics (Task 51: `gameHasEve` is the checkbox and restarts never touch it;
 * `evePresent` is the draw, preserved on a bad-luck restart and cleared by
 * `withoutEve` for the Eve-detected one, Task 49-C).
 */

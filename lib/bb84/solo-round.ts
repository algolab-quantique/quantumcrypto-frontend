import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';
import {
    generateAliceBases,
    generateAliceBits,
    generateAlicePhotons,
    mimicEveIntercept,
} from '@/lib/bb84/solo-player';

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

/**
 * Restart the current SOLO round with the same configuration — photon number,
 * validation length, Eve presence — but fresh randomness (Task 49-A).
 *
 * A bad-luck restart (too few matching bases for a key) is NOT Eve-detection:
 * `evePresent` must survive. `resetRoom()` wipes it (and the persisted
 * checkpoint), so it is re-asserted from the game store's `gameHasEve`; the
 * store mutations then rebuild the checkpoint exactly like a fresh solo start.
 */
export const restartSoloRound = () => {
    const {gameHasEve, photonNumber} = useBB84GameStore.getState();
    useBB84RoomStore.getState().resetRoom();
    useBB84ProgressStore.getState().resetProgress();
    useBB84RoomStore.getState().setEvePresent(gameHasEve);
    beginSoloRound(photonNumber, gameHasEve);
};

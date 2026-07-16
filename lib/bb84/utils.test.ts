/**
 * BB84 utils contract tests (Task 47 phase 1 — docs/testing-strategy.md).
 * sacrificeValidationBits is Task 53's poster child: the publicly-compared
 * validation bits were NEVER removed from the key — this file is the test
 * that would have caught it years ago.
 */

import {beforeEach, describe, expect, it} from 'vitest';
import {restartWithoutEve, sacrificeValidationBits} from './utils';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';

beforeEach(() => {
    localStorage.clear();
    useBB84RoomStore.getState().resetRoom();
});

describe('sacrificeValidationBits (Task 53)', () => {
    it('removes exactly the validation indices from the key', () => {
        const room = useBB84RoomStore.getState();
        room.setKeyBits(['1', '0', '1', '1', '0']);
        room.setValidationIndices([1, 3]);
        sacrificeValidationBits();
        expect(useBB84RoomStore.getState().keyBits).toEqual(['1', '1', '0']);
    });

    it('Ibra\'s 6-photon case: 2 sifted bits, 1 validated => 1 key bit, not 2', () => {
        const room = useBB84RoomStore.getState();
        room.setKeyBits(['0', '1']);
        room.setValidationIndices([0]);
        sacrificeValidationBits();
        expect(useBB84RoomStore.getState().keyBits).toHaveLength(1);
    });

    it('is a no-op when the game has no validation step', () => {
        const room = useBB84RoomStore.getState();
        room.setKeyBits(['1', '0']);
        room.setValidationIndices([]);
        sacrificeValidationBits();
        expect(useBB84RoomStore.getState().keyBits).toEqual(['1', '0']);
    });

    it('documents why the restart trigger is <=: equal counts leave ZERO key bits', () => {
        // Callers must prevent this state via basis-tab's keyBits.length <=
        // validationBitsLength restart; if it ever happened, the key is empty.
        const room = useBB84RoomStore.getState();
        room.setKeyBits(['0', '1']);
        room.setValidationIndices([0, 1]);
        sacrificeValidationBits();
        expect(useBB84RoomStore.getState().keyBits).toHaveLength(0);
    });
});

describe('restartWithoutEve (multi coordinated restart)', () => {
    it('clears the stale basis inputs and zeroes the Eve presence', () => {
        localStorage.setItem('bb84BobBasisInputs', JSON.stringify(['+']));
        useBB84RoomStore.getState().setEvePresent(true);
        restartWithoutEve();
        expect(localStorage.getItem('bb84BobBasisInputs')).toBeNull();
        expect(useBB84RoomStore.getState().evePresent).toBe(false);
    });
});

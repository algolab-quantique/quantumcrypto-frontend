import React from 'react';
import {inputField} from '@/types';
import {toast} from 'sonner';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';

export const onBasisInputChange = (event: React.ChangeEvent<HTMLInputElement>,
                                   index: number, basisInputs: inputField[],
                                   setBasisInputs: React.Dispatch<React.SetStateAction<inputField[]>>,
                                   validatePolar?: (prevStates: {
                                                        polarList?: inputField[],
                                                        basisInputs?: inputField[],
                                                        bitsInputs?: inputField[],
                                                    }, list: boolean,
                                                    index?: number) => void) => {
    const inputValue = event.target.value.toLowerCase();
    const updatedBases = [...basisInputs];
    const updatedBasis = {...updatedBases[index]};
    updatedBasis.touched = true;
    if (inputValue.length === 0 || /^[+x]$/.test(inputValue) &&
        inputValue.length <= 1) {
        updatedBasis.value = inputValue;
    }
    updatedBasis.error = updatedBasis.value === '';
    updatedBases[index] = updatedBasis;
    setBasisInputs(updatedBases);
    if (validatePolar) {
        validatePolar({
            basisInputs: updatedBases,
        }, false, index);
    }
};

export const clearBB84LocalStorage = () => {
    localStorage.removeItem('bb84PlayerData');
    localStorage.removeItem('bb84PhotonNumber')
    localStorage.removeItem('bb84Step');
    localStorage.removeItem('bb84Tab');
    localStorage.removeItem('bb84GameData');
    localStorage.removeItem('bb84DisplayedLines');
    localStorage.removeItem('bb84ValidationBitsLength')
    localStorage.removeItem('bb84GameHasEve')
    localStorage.removeItem('bb84BobBasisInputs')

    if (typeof window !== 'undefined') {
        useBB84RoomStore.getState().resetRoom();
        useBB84ProgressStore.getState().resetProgress();
    }
}

/**
 * Task 55: is the sifted key too short to continue?
 * WITH the Eve mechanic, the validation bits are sacrificed (publicly
 * compared), so the sifted key must be STRICTLY LONGER than the validation
 * count or no message key remains. WITHOUT Eve nothing is sacrificed and only
 * an EMPTY key is unplayable — a 1-bit key is fine (1-bit key → 1-bit
 * message; the XOR lesson still works, and this app is purely educational).
 * The old inline check ignored gameHasEve and wrongly restarted no-Eve games.
 */
export const isKeyTooShort = (
    siftedLength: number,
    gameHasEve: boolean,
    validationBitsLength: number,
): boolean => (
    gameHasEve ? siftedLength <= validationBitsLength : siftedLength === 0
);

/**
 * BB84's sacrifice step (Task 53): the validation bits are compared over the
 * PUBLIC channel — Eve knows them — so after a VALID verdict they must be
 * discarded from the key. The remaining bits are the secret key used for the
 * encrypted message. Canonical for both modes: the verdict-clicker calls this
 * from validation-tab; the partner mirrors it in the A/B_VALIDATED handlers
 * (validationIndices are symmetric on both clients). No-op when the game has
 * no validation step (no Eve mechanic).
 */
export const sacrificeValidationBits = () => {
    const {keyBits, validationIndices, setKeyBits} = useBB84RoomStore.getState();
    if (validationIndices.length === 0) return;
    setKeyBits(keyBits.filter((_, index) => !validationIndices.includes(index)));
};

export const restartWithoutEve = () => {
    localStorage.removeItem('bb84PhotonNumber');
    localStorage.setItem('bb84GameData', JSON.stringify({}));
    localStorage.removeItem('bb84Step');
    localStorage.removeItem('bb84Tab');
    localStorage.removeItem('bb84DisplayedLines');
    // A new round must not inherit the previous round's in-progress basis
    // inputs: bob-exchange-tab re-hydrates its form from this key on mount —
    // without this, the multi Eve-restart refills Bob's bases.
    localStorage.removeItem('bb84BobBasisInputs');
    useBB84RoomStore.getState().resetRoom();
    useBB84RoomStore.getState().setEvePresent(false);
    useBB84ProgressStore.getState().resetProgress();
}
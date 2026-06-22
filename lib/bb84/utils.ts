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

export const restartWithoutEve = () => {
    localStorage.removeItem('bb84PhotonNumber');
    localStorage.setItem('bb84GameData', JSON.stringify({}));
    localStorage.removeItem('bb84Step');
    localStorage.removeItem('bb84Tab');
    localStorage.removeItem('bb84DisplayedLines');
    useBB84RoomStore.getState().resetRoom();
    useBB84RoomStore.getState().setEvePresent(false);
    useBB84ProgressStore.getState().resetProgress();
}
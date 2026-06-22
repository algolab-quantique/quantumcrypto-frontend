import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';

export const clearDPSStorageKeys = () => {
    localStorage.removeItem('dpsPlayerData');
    localStorage.removeItem('dpsPhotonNumber');
    localStorage.removeItem('dpsGameHasEve');
    localStorage.removeItem('dpsSoloPhotonNumberDraft');
    localStorage.removeItem('dpsStep');
    localStorage.removeItem('dpsTab');
    localStorage.removeItem('dpsGameData');
    localStorage.removeItem('dpsDisplayedLines');
    localStorage.removeItem('dpsValidationBitsLength');
    localStorage.removeItem('dpsSoloAliceExchangePhaseInputs');
    localStorage.removeItem('dpsSoloAliceExchangePulseInputs');
    localStorage.removeItem('dpsSoloBobExchangeMeasurements');
    localStorage.removeItem('dpsSoloBobExchangeValidatedTimes');
    localStorage.removeItem('dpsSoloBobExchangeIsValidated');
    localStorage.removeItem('dpsMultiAliceExchangePhaseInputs');
    localStorage.removeItem('dpsMultiAliceExchangePulseInputs');
    localStorage.removeItem('dpsMultiBobExchangeMeasurements');
    localStorage.removeItem('dpsMultiBobExchangeValidatedTimes');
    localStorage.removeItem('dpsMultiBobExchangeIsValidated');
    localStorage.removeItem('dpsSoloAliceInferenceInputs');
    localStorage.removeItem('dpsSoloAliceMessagingDecryptDraft');
    localStorage.removeItem('dpsSoloBobMessagingMessageDraft');
    localStorage.removeItem('dpsSoloBobMessagingCryptoDraft');
};

export const clearDPSLocalStorage = () => {
    clearDPSStorageKeys();

    if (typeof window !== 'undefined') {
        useDPSRoomStore.getState().resetRoom();
        useDPSProgressStore.getState().resetProgress();
    }
};

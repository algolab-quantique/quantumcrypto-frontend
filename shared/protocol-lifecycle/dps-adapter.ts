import useDPSRoomStore, {type DPSRoomStateSchema} from '@/store/dps/dps-room-store';
import {
    hydrateDPSProgressStore,
    useDPSProgressStore,
} from '@/store/dps/dps-progress-store';

import {toSerializableSnapshot} from './lifecycle';
import type {ProtocolAdapter, RoomSnapshot} from './types';

export const dpsAdapter: ProtocolAdapter = {
    protocolId: 'dps',
    gameDataKey: 'dpsGameData',
    playerDataKey: 'dpsPlayerData',
    storageKeys: [
        'dpsPlayerData',
        'dpsPhotonNumber',
        'dpsGameHasEve',
        'dpsSoloPhotonNumberDraft',
        'dpsStep',
        'dpsTab',
        'dpsGameData',
        'dpsDisplayedLines',
        'dpsValidationBitsLength',
        'dpsSoloAliceExchangePhaseInputs',
        'dpsSoloAliceExchangePulseInputs',
        'dpsSoloBobExchangeMeasurements',
        'dpsSoloBobExchangeValidatedTimes',
        'dpsSoloBobExchangeIsValidated',
        'dpsMultiAliceExchangePhaseInputs',
        'dpsMultiAliceExchangePulseInputs',
        'dpsMultiBobExchangeMeasurements',
        'dpsMultiBobExchangeValidatedTimes',
        'dpsMultiBobExchangeIsValidated',
        'dpsSoloAliceInferenceInputs',
        'dpsSoloAliceMessagingDecryptDraft',
        'dpsSoloBobMessagingMessageDraft',
        'dpsSoloBobMessagingCryptoDraft',
    ],
    resetRoom: () => useDPSRoomStore.getState().resetRoom(),
    restoreRoom: data => useDPSRoomStore.getState().restoreGame(data as Partial<DPSRoomStateSchema>),
    resetProgress: () => useDPSProgressStore.getState().resetProgress(),
    hydrateProgress: hydrateDPSProgressStore,
    getRoomSnapshot: () => toSerializableSnapshot(
        useDPSRoomStore.getState() as unknown as RoomSnapshot,
    ),
};

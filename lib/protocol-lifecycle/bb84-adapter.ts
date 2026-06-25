import useBB84RoomStore, {type BB84RoomStateSchema} from '@/store/bb84/bb84-room-store';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {
    hydrateBB84ProgressStore,
    useBB84ProgressStore,
} from '@/store/bb84/bb84-progress-store';

import {toSerializableSnapshot} from './snapshot';
import type {ProtocolAdapter, RoomSnapshot} from './types';

const readConfigValue = (key: string): unknown => {
    if (typeof window === 'undefined') return undefined;

    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;

    try {
        return JSON.parse(raw);
    } catch {
        return undefined;
    }
};

export const bb84Adapter: ProtocolAdapter = {
    protocolId: 'bb84',
    gameDataKey: 'bb84GameData',
    playerDataKey: 'bb84PlayerData',
    storageKeys: [
        'bb84PlayerData',
        'bb84PhotonNumber',
        'bb84Step',
        'bb84Tab',
        'bb84GameData',
        'bb84DisplayedLines',
        'bb84ValidationBitsLength',
        'bb84GameHasEve',
        'bb84BobBasisInputs',
    ],
    resetRoom: () => useBB84RoomStore.getState().resetRoom(),
    restoreRoom: data => useBB84RoomStore.getState().restoreGame(data as Partial<BB84RoomStateSchema>),
    resetProgress: () => useBB84ProgressStore.getState().resetProgress(),
    hydrateProgress: hydrateBB84ProgressStore,
    hydrateConfig: () => {
        const gameStore = useBB84GameStore.getState();
        const photonNumber = readConfigValue('bb84PhotonNumber');
        const gameHasEve = readConfigValue('bb84GameHasEve');
        const validationBitsLength = readConfigValue('bb84ValidationBitsLength');

        if (typeof photonNumber === 'number') gameStore.setPhotonNumber(photonNumber);
        if (typeof gameHasEve === 'boolean') gameStore.setGameHasEve(gameHasEve);
        if (typeof validationBitsLength === 'number') {
            gameStore.setValidationBitsLength(validationBitsLength);
        }
    },
    getRoomSnapshot: () => toSerializableSnapshot(
        useBB84RoomStore.getState() as unknown as RoomSnapshot,
    ),
};

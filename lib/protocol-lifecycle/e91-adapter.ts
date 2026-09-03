import useE91RoomStore, {type E91RoomStateSchema} from '@/store/e91/e91-room-store';
import useE91GameStore from '@/store/e91/e91-game-store';
import {
    hydrateE91ProgressStore,
    useE91ProgressStore,
} from '@/store/e91/e91-progress-store';

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

export const e91Adapter: ProtocolAdapter = {
    protocolId: 'e91',
    gameDataKey: 'e91GameData',
    playerDataKey: 'e91PlayerData',
    storageKeys: [
        'e91PlayerData',
        'e91PhotonNumber',
        'e91Step',
        'e91Tab',
        'e91GameData',
        'e91DisplayedLines',
        'e91ValidationBitsLength',
        'e91GameHasEve',
        'e91GameStartTime',
        'e91OriginalEvePresent',
        'e91EveWasDetected',
    ],
    resetRoom: () => useE91RoomStore.getState().resetRoom(),
    restoreRoom: data => useE91RoomStore.getState().restoreGame(data as Partial<E91RoomStateSchema>),
    resetProgress: () => useE91ProgressStore.getState().resetProgress(),
    hydrateProgress: hydrateE91ProgressStore,
    // Task 40 Phase 3c: the two config values E91's solo restore has always
    // re-read by hand, moved here so restoreCheckpoint covers them and the
    // component does not have to. Mirrors bb84Adapter.hydrateConfig.
    // `e91ValidationBitsLength` joined them in Phase 3d, once the multiplayer
    // restore needed it too. It is a no-op for solo rather than a behaviour
    // change: the key is written only by socket-provider.tsx:318, a
    // multiplayer-only path, so `readConfigValue` returns undefined in solo
    // games and nothing is set.
    hydrateConfig: () => {
        const gameStore = useE91GameStore.getState();
        const photonNumber = readConfigValue('e91PhotonNumber');
        const gameHasEve = readConfigValue('e91GameHasEve');
        const validationBitsLength = readConfigValue('e91ValidationBitsLength');

        if (typeof photonNumber === 'number') gameStore.setPhotonNumber(photonNumber);
        if (typeof gameHasEve === 'boolean') gameStore.setGameHasEve(gameHasEve);
        if (typeof validationBitsLength === 'number') {
            gameStore.setValidationBitsLength(validationBitsLength);
        }
    },
    getRoomSnapshot: () => toSerializableSnapshot(
        useE91RoomStore.getState() as unknown as RoomSnapshot,
    ),
};

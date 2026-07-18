import useE91RoomStore, {type E91RoomStateSchema} from '@/store/e91/e91-room-store';
import {
    hydrateE91ProgressStore,
    useE91ProgressStore,
} from '@/store/e91/e91-progress-store';

import {toSerializableSnapshot} from './snapshot';
import type {ProtocolAdapter, RoomSnapshot} from './types';

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
    getRoomSnapshot: () => toSerializableSnapshot(
        useE91RoomStore.getState() as unknown as RoomSnapshot,
    ),
};

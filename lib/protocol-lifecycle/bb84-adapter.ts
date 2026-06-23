import useBB84RoomStore, {type BB84RoomStateSchema} from '@/store/bb84/bb84-room-store';
import {
    hydrateBB84ProgressStore,
    useBB84ProgressStore,
} from '@/store/bb84/bb84-progress-store';

import {toSerializableSnapshot} from './snapshot';
import type {ProtocolAdapter, RoomSnapshot} from './types';

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
    getRoomSnapshot: () => toSerializableSnapshot(
        useBB84RoomStore.getState() as unknown as RoomSnapshot,
    ),
};

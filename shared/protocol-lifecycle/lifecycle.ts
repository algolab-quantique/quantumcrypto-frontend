import usePlayerStore from '@/store/player-store';

import type {ProtocolAdapter, RoomSnapshot, SessionStatus} from './types';

const isBrowser = () => typeof window !== 'undefined';

const isRecord = (value: unknown): value is RoomSnapshot => (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
);

const readStoredObject = (key: string): RoomSnapshot | null => {
    if (!isBrowser()) return null;

    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        return isRecord(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

export const toSerializableSnapshot = (state: Record<string, unknown>): RoomSnapshot => {
    const snapshot: RoomSnapshot = {};

    Object.entries(state).forEach(([key, value]) => {
        if (typeof value !== 'function') {
            snapshot[key] = value;
        }
    });

    return snapshot;
};

const resetPlayerModeFlags = () => {
    const playerStore = usePlayerStore.getState();
    playerStore.setPlayingSolo(false);
    playerStore.setPlayingMultiplayer(false);
};

export const clearProtocolStorage = (adapter: ProtocolAdapter) => {
    if (!isBrowser()) return;

    adapter.storageKeys.forEach(key => localStorage.removeItem(key));
};

export const startFresh = (adapter: ProtocolAdapter) => {
    clearProtocolStorage(adapter);
    adapter.resetRoom();
    adapter.resetProgress();
    resetPlayerModeFlags();
};

export const saveCheckpoint = (adapter: ProtocolAdapter) => {
    if (!isBrowser()) return;

    localStorage.setItem(adapter.gameDataKey, JSON.stringify(adapter.getRoomSnapshot()));
};

export const restoreCheckpoint = (adapter: ProtocolAdapter): SessionStatus => {
    const playerData = readStoredObject(adapter.playerDataKey);
    if (!playerData) return null;

    const gameData = readStoredObject(adapter.gameDataKey);
    if (gameData) {
        adapter.restoreRoom(gameData);
    }

    adapter.hydrateProgress();

    return adapter.getRoomSnapshot().gameSuccess === true ? 'completed' : 'active';
};

export const complete = (adapter: ProtocolAdapter) => {
    saveCheckpoint(adapter);
};

export const abandon = (adapter: ProtocolAdapter) => {
    clearProtocolStorage(adapter);
    adapter.resetRoom();
    adapter.resetProgress();
    resetPlayerModeFlags();
};

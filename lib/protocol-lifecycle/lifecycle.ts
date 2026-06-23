import usePlayerStore from '@/store/player-store';

import type {
    CheckpointRestoreResult,
    MultiplayerSession,
    MultiplayerSessionIssue,
    ProtocolAdapter,
    RoomSnapshot,
} from './types';

const isBrowser = () => typeof window !== 'undefined';

const isRecord = (value: unknown): value is RoomSnapshot => (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
);

type StoredObjectResult =
    | {kind: 'missing'}
    | {kind: 'corrupted'}
    | {kind: 'found'; data: RoomSnapshot};

const readStoredObject = (key: string): StoredObjectResult => {
    if (!isBrowser()) return {kind: 'missing'};

    const raw = localStorage.getItem(key);
    if (!raw) return {kind: 'missing'};

    try {
        const parsed = JSON.parse(raw);
        return isRecord(parsed)
            ? {kind: 'found', data: parsed}
            : {kind: 'corrupted'};
    } catch {
        return {kind: 'corrupted'};
    }
};

const resetPlayerModeFlags = () => {
    const playerStore = usePlayerStore.getState();
    playerStore.setPlayingSolo(false);
    playerStore.setPlayingMultiplayer(false);
};

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === 'string' &&
    value.trim().length > 0
);

type MultiplayerSessionResult =
    | {kind: 'missing'}
    | {kind: 'valid'; session: MultiplayerSession}
    | {kind: MultiplayerSessionIssue};

const restoreMultiplayerSession = (adapter: ProtocolAdapter): MultiplayerSessionResult => {
    const playerData = readStoredObject(adapter.playerDataKey);

    if (playerData.kind === 'missing') return {kind: 'missing'};
    if (playerData.kind === 'corrupted') return {kind: 'corrupted'};

    const {gameCode, role, room} = playerData.data;

    if (
        !isNonEmptyString(gameCode) ||
        !isNonEmptyString(role) ||
        !isNonEmptyString(room)
    ) {
        return {kind: 'invalid'};
    }

    return {
        kind: 'valid',
        session: {
            ...playerData.data,
            gameCode,
            role,
            room,
        },
    };
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

export const restoreCheckpoint = (adapter: ProtocolAdapter): CheckpointRestoreResult => {
    const gameData = readStoredObject(adapter.gameDataKey);
    if (gameData.kind === 'missing') return {kind: 'missing'};
    if (gameData.kind === 'corrupted') return {kind: 'corrupted'};

    adapter.restoreRoom(gameData.data);

    adapter.hydrateProgress();

    const checkpointKind = adapter.getRoomSnapshot().gameSuccess === true
        ? 'completed'
        : 'active';
    const sessionResult = restoreMultiplayerSession(adapter);

    if (sessionResult.kind === 'valid') {
        return {
            kind: checkpointKind,
            multiplayerSession: sessionResult.session,
        };
    }

    if (sessionResult.kind === 'invalid' || sessionResult.kind === 'corrupted') {
        return {
            kind: checkpointKind,
            multiplayerSessionIssue: sessionResult.kind,
        };
    }

    return {kind: checkpointKind};
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

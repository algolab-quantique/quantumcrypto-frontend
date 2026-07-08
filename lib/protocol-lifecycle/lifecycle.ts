import usePlayerStore from '@/store/player-store';

import type {
    CheckpointRestoreResult,
    DetectedSession,
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

/**
 * Read-only session classifier for route guards (Task 48 / ADR §11).
 *
 * Pure: reads localStorage and classifies. Does NOT hydrate stores, reconnect,
 * reset, or navigate — the caller decides (e.g. reconnect only when
 * `kind === 'multi' && !completed`). `solo` is returned only on POSITIVE evidence;
 * a broken or ambiguous multiplayer state fails closed as `corrupt` rather than
 * silently degrading to SoloGame.
 *
 * Note: currently STRICTER than `restoreCheckpoint` (which restores any found
 * `gameData` locally regardless of identity). Slice D refactors `restoreCheckpoint`
 * to reuse this classifier so guard and page agree.
 *
 * DPS-solo compatibility: DPS solo writes `dpsPlayerData {playingSolo:true}` and NO
 * `dpsGameData`, so a solo-marked playerData (playingSolo && no room) counts as solo.
 * This is migration compatibility (ADR §11) — remove the marker branch once DPS solo
 * is standardized.
 */
export const detectSession = (adapter: ProtocolAdapter): DetectedSession => {
    const gameData = readStoredObject(adapter.gameDataKey);
    if (gameData.kind === 'corrupted') return {kind: 'corrupt'};

    const playerData = readStoredObject(adapter.playerDataKey);
    if (playerData.kind === 'corrupted') return {kind: 'corrupt'};

    const completed = gameData.kind === 'found' && gameData.data.gameSuccess === true;

    // Multiplayer iff a valid identity (gameCode + role + room) exists.
    const multi = restoreMultiplayerSession(adapter);
    if (multi.kind === 'valid') {
        // A valid identity with no local checkpoint is an orphan, not a playable game.
        return gameData.kind === 'found'
            ? {kind: 'multi', completed, session: multi.session}
            : {kind: 'corrupt'};
    }

    // DPS-solo compatibility (migration only, scoped to DPS): DPS solo writes
    // dpsPlayerData {playingSolo:true, no room} and no dpsGameData. Gated to
    // protocolId === 'dps' so this drift stays a DPS-specific compat rule and does
    // NOT become a cross-protocol rule — for BB84/E91 a playingSolo-marked playerData
    // is not a valid solo signal and falls through to corrupt below. Remove when DPS
    // solo is standardized (ADR §11).
    if (
        adapter.protocolId === 'dps' &&
        playerData.kind === 'found' &&
        playerData.data.playingSolo === true &&
        !isNonEmptyString(playerData.data.room)
    ) {
        return {kind: 'solo', completed};
    }

    // BB84/E91 solo: a local checkpoint with no player data at all.
    if (gameData.kind === 'found' && playerData.kind === 'missing') {
        return {kind: 'solo', completed};
    }

    // A checkpoint plus a non-solo, non-multi playerData is a broken session:
    // fail closed rather than guess solo.
    if (gameData.kind === 'found' && playerData.kind === 'found') {
        return {kind: 'corrupt'};
    }

    // No checkpoint and no valid solo marker.
    return {kind: 'none'};
};

export const restoreCheckpoint = (adapter: ProtocolAdapter): CheckpointRestoreResult => {
    const gameData = readStoredObject(adapter.gameDataKey);
    if (gameData.kind === 'missing') return {kind: 'missing'};
    if (gameData.kind === 'corrupted') return {kind: 'corrupted'};

    adapter.restoreRoom(gameData.data);

    adapter.hydrateProgress();
    adapter.hydrateConfig?.();

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

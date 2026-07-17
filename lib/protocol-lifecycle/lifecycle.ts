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

/**
 * Route-guard policy over detectSession (Task 54 F1; ADR §11 rules 1–2).
 * Pure and unit-testable: given the persisted session and a route's
 * requirements, decide whether the route may render (and in which mode) or
 * must be left. The React mechanics (null-gate, redirect, flag bridge) live
 * in useProtocolSessionGuard, which wraps this.
 */
export type RouteSessionRequirement = {
    /** Route needs a COMPLETED session (e.g. results pages). Default: any valid session. */
    completed?: boolean;
    /** Route needs a specific mode (e.g. solo results). Default: either. */
    mode?: 'solo' | 'multi';
};

export type RouteSessionResolution =
    | {action: 'render'; mode: 'solo' | 'multi'}
    | {action: 'leave'};

export const resolveSessionForRoute = (
    adapter: ProtocolAdapter,
    require: RouteSessionRequirement = {},
): RouteSessionResolution => {
    const detected = detectSession(adapter);
    if (detected.kind !== 'solo' && detected.kind !== 'multi') {
        return {action: 'leave'};
    }
    if (require.completed && !detected.completed) {
        return {action: 'leave'};
    }
    if (require.mode && detected.kind !== require.mode) {
        return {action: 'leave'};
    }
    return {action: 'render', mode: detected.kind};
};

export const restoreCheckpoint = (adapter: ProtocolAdapter): CheckpointRestoreResult => {
    // Task 48 D1: classify via the single source of truth (detectSession), then
    // hydrate. This keeps guard and page in agreement. detectSession is stricter
    // than the old inline logic: a broken multiplayer identity now yields
    // 'corrupted' (fail-close) instead of a local 'active' restore carrying a
    // multiplayerSessionIssue. Callers only read kind + multiplayerSession, so the
    // return contract is unchanged.
    const detected = detectSession(adapter);

    if (detected.kind === 'none') return {kind: 'missing'};
    if (detected.kind === 'corrupt') return {kind: 'corrupted'};

    // restoreCheckpoint keeps its contract: it restores an ACTUAL checkpoint.
    // detectSession may classify DPS solo as 'solo' from the dpsPlayerData marker
    // alone (no dpsGameData) as route-detection migration-compat — but restore must
    // NOT synthesize a checkpoint from that marker. Require real gameData first, so
    // "no checkpoint" stays {kind:'missing'} and DPS drift is not baked in here.
    const gameData = readStoredObject(adapter.gameDataKey);
    if (gameData.kind === 'missing') return {kind: 'missing'};
    if (gameData.kind === 'corrupted') return {kind: 'corrupted'};

    adapter.restoreRoom(gameData.data);
    adapter.hydrateProgress();
    adapter.hydrateConfig?.();

    const checkpointKind = detected.completed ? 'completed' : 'active';

    return detected.kind === 'multi'
        ? {kind: checkpointKind, multiplayerSession: detected.session}
        : {kind: checkpointKind};
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

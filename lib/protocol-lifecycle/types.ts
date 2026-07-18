export type ProtocolId = 'bb84' | 'e91' | 'dps';

export type RoomSnapshot = Record<string, unknown>;

export type MultiplayerSessionIssue = 'invalid' | 'corrupted';

export interface MultiplayerSession {
    gameCode: string;
    role: string;
    room: string;
    playerName?: string;
    partner?: string;
    [key: string]: unknown;
}

// Task 54 F4: `multiplayerSessionIssue` was pruned from this public result —
// since D1, a broken multiplayer identity fails closed as {kind: 'corrupted'}
// and can never reach a restored checkpoint. (The internal
// `restoreMultiplayerSession` still uses MultiplayerSessionIssue for its own
// classification.) A public type must not promise states no code can produce.
type RestoredCheckpoint = {
    multiplayerSession?: MultiplayerSession;
};

export type CheckpointRestoreResult =
    | {kind: 'missing'}
    | {kind: 'corrupted'}
    | ({kind: 'active'} & RestoredCheckpoint)
    | ({kind: 'completed'} & RestoredCheckpoint);

/**
 * Read-only session classification for route guards (Task 48 / ADR §11).
 *
 * `detectSession(adapter)` returns this without hydrating stores, reconnecting,
 * resetting, or navigating — callers decide what to do (e.g. reconnect only when
 * `kind === 'multi' && !completed`). `completed` is an attribute, not a separate
 * mode. Converges toward the target `ProtocolSession` shape (ADR §11).
 */
export type DetectedSession =
    | {kind: 'none'}
    | {kind: 'corrupt'}
    | {kind: 'solo'; completed: boolean}
    | {kind: 'multi'; completed: boolean; session: MultiplayerSession};

export interface ProtocolAdapter {
    protocolId: ProtocolId;
    // Keep complete: missing keys can leave stale localStorage after abandon/replay.
    storageKeys: readonly string[];
    gameDataKey: string;
    playerDataKey: string;
    resetRoom: () => void;
    restoreRoom: (data: RoomSnapshot) => void;
    resetProgress: () => void;
    hydrateProgress: () => void;
    hydrateConfig?: () => void;
    // Must return JSON-safe room data. Add an explicit snapshot mapper if a store gains non-serializable values.
    getRoomSnapshot: () => RoomSnapshot;
}

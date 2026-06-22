export type ProtocolId = 'bb84' | 'e91' | 'dps';

export type SessionStatus = 'active' | 'completed' | null;

export type RoomSnapshot = Record<string, unknown>;

export interface ProtocolAdapter {
    protocolId: ProtocolId;
    storageKeys: readonly string[];
    gameDataKey: string;
    playerDataKey: string;
    resetRoom: () => void;
    restoreRoom: (data: RoomSnapshot) => void;
    resetProgress: () => void;
    hydrateProgress: () => void;
    getRoomSnapshot: () => RoomSnapshot;
}

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

    /**
     * Round-level hooks (Task 63). Optional as a GROUP, never individually —
     * see RoundAdapter for why that distinction matters.
     */
    round?: RoundAdapter;
}

/**
 * What a protocol must supply for the shared `restartRound` to restart one of
 * its rounds (Task 63 Step 1).
 *
 * The hooks on ProtocolAdapter own the SESSION — does it exist, does it survive
 * a refresh. These own a ROUND inside that session, so the policy ("does Eve
 * survive this restart?") lives in ONE place for every protocol.
 *
 * ⚠️ ALL-OR-NOTHING, and that is the point. The first draft made each hook
 * independently optional, which meant a protocol that HAS Eve but forgot
 * `getEvePresent` would drop her on every restart — silently, no error. That is
 * precisely the bug this task exists to remove, rebuilt as a trap inside the
 * shared code. Grouping them makes the omission a compile error instead: you
 * either describe your rounds fully, or you have no `round` and `restartRound`
 * refuses loudly.
 *
 * A protocol with no Eve mechanic (DPS today, Task 38) simply omits `round`.
 */
export interface RoundAdapter {
    /**
     * Eve's DRAW for the current round — does she actually intercept? Not the
     * checkbox: that is `gameHasEve`, which restarts never change (Task 51).
     */
    getEvePresent: () => boolean;
    setEvePresent: (value: boolean) => void;

    /**
     * Produce the data a fresh round needs before the player can act — SOLO
     * ONLY. Absent when there is nothing to produce.
     *
     * The asymmetry is the point, and it is not "solo does more": in solo the
     * app plays the partner, so it must generate the partner's side; in
     * multiplayer a real peer or the backend produces it, and there is nothing
     * to call. **In solo we call, in multiplayer we listen** — the multiplayer
     * equivalent of this hook is not a function but the socket event handled in
     * socket-provider.
     *
     * `restartRound` therefore calls this only in solo mode, which is why no
     * adapter has to write an empty else-branch. Reading this protocol's own
     * config (photon count and friends) belongs here.
     *
     * BB84 solo generates Alice's photons for Bob. E91 has none yet — its pair
     * generation is misplaced inside the "Measure" button (**Task 64**), which
     * is why its hook is absent rather than empty.
     */
    prepareRound?: (evePresent: boolean) => void;

    /**
     * Push the round's opening lines.
     *
     * `prepared` says whether `prepareRound` just ran, because the transcript
     * depends on it rather than on the mode as such: BB84's solo Bob is told
     * "Alice's photons have arrived" precisely because they were just
     * generated, while in multiplayer he is told he is waiting for them. The
     * difference in what he reads is CAUSED by the difference in what exists.
     */
    openRoundTranscript: (context: {prepared: boolean}) => void;

    /** Bump the "rounds played" counter shown on the results page. Optional:
     *  a protocol that does not show one has nothing to bump. */
    incrementRoundCount?: () => void;
}

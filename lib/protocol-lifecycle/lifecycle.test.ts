/**
 * Lifecycle contract tests (Task 47 phase 1 — docs/testing-strategy.md).
 *
 * detectSession's matrix was first verified as a throwaway script during
 * Task 48 Slice B; these tests make it permanent. The classification rule:
 * solo only on POSITIVE evidence — a broken multiplayer state must fail
 * closed as corrupt, never silently degrade to SoloGame.
 */

import {beforeEach, describe, expect, it, vi} from 'vitest';
import {
    abandon,
    complete,
    detectSession,
    resolveSessionForRoute,
    restoreCheckpoint,
    startFresh,
} from './lifecycle';
import type {ProtocolAdapter, ProtocolId} from './types';
import usePlayerStore from '@/store/player-store';

// Minimal fake adapter: detectSession only reads storage + protocolId, and
// the lifecycle commands only need resettable hooks — perfect for spies.
const makeAdapter = (protocolId: ProtocolId = 'bb84'): ProtocolAdapter => ({
    protocolId,
    gameDataKey: `${protocolId}GameData`,
    playerDataKey: `${protocolId}PlayerData`,
    storageKeys: [
        `${protocolId}PlayerData`,
        `${protocolId}GameData`,
        `${protocolId}Step`,
    ],
    resetRoom: vi.fn(),
    restoreRoom: vi.fn(),
    resetProgress: vi.fn(),
    hydrateProgress: vi.fn(),
    getRoomSnapshot: vi.fn(() => ({})),
});

const put = (key: string, value: unknown) =>
    localStorage.setItem(key, JSON.stringify(value));

beforeEach(() => {
    localStorage.clear();
    usePlayerStore.getState().resetPlayer();
});

describe('detectSession', () => {
    const adapter = makeAdapter('bb84');

    it('classifies nothing as none', () => {
        expect(detectSession(adapter)).toEqual({kind: 'none'});
    });

    it('classifies a checkpoint with no player data as solo (BB84/E91 solo shape)', () => {
        put('bb84GameData', {evePresent: false});
        expect(detectSession(adapter)).toEqual({kind: 'solo', completed: false});
    });

    it('marks a solo checkpoint with gameSuccess as completed', () => {
        put('bb84GameData', {gameSuccess: true});
        expect(detectSession(adapter)).toEqual({kind: 'solo', completed: true});
    });

    it('classifies a valid multiplayer identity (gameCode+role+room) with a checkpoint as multi', () => {
        put('bb84GameData', {});
        put('bb84PlayerData', {gameCode: 'X1', role: 'A', room: 'r9'});
        const result = detectSession(adapter);
        expect(result.kind).toBe('multi');
        if (result.kind === 'multi') {
            expect(result.session.room).toBe('r9');
            expect(result.completed).toBe(false);
        }
    });

    it('a valid multiplayer identity WITHOUT a checkpoint is corrupt (orphan), not multi', () => {
        put('bb84PlayerData', {gameCode: 'X1', role: 'A', room: 'r9'});
        expect(detectSession(adapter)).toEqual({kind: 'corrupt'});
    });

    it('a BROKEN multiplayer identity (missing room) is corrupt, never fake solo', () => {
        put('bb84GameData', {});
        put('bb84PlayerData', {gameCode: 'X1', role: 'A'});
        expect(detectSession(adapter)).toEqual({kind: 'corrupt'});
    });

    it('unreadable gameData is corrupt', () => {
        localStorage.setItem('bb84GameData', '{oops');
        expect(detectSession(adapter)).toEqual({kind: 'corrupt'});
    });

    it('unreadable playerData is corrupt', () => {
        put('bb84GameData', {});
        localStorage.setItem('bb84PlayerData', 'not-json{');
        expect(detectSession(adapter)).toEqual({kind: 'corrupt'});
    });

    it('a checkpoint plus a non-solo, non-multi playerData is corrupt', () => {
        put('bb84GameData', {});
        put('bb84PlayerData', {});
        expect(detectSession(adapter)).toEqual({kind: 'corrupt'});
    });

    describe('DPS solo compatibility (migration rule, gated to dps)', () => {
        it('dps: playerData marked playingSolo with no room is solo, even without gameData', () => {
            const dps = makeAdapter('dps');
            put('dpsPlayerData', {playingSolo: true, role: 'A', gameCode: 'SOLO'});
            expect(detectSession(dps)).toEqual({kind: 'solo', completed: false});
        });

        it('bb84: the same playingSolo-marked playerData is NOT solo (gate holds)', () => {
            put('bb84GameData', {});
            put('bb84PlayerData', {playingSolo: true, role: 'A', gameCode: 'x'});
            expect(detectSession(adapter)).toEqual({kind: 'corrupt'});
        });

        it('dps: an empty reset artifact {} with no gameData is none', () => {
            const dps = makeAdapter('dps');
            put('dpsPlayerData', {});
            expect(detectSession(dps)).toEqual({kind: 'none'});
        });
    });
});

describe('restoreCheckpoint', () => {
    it('returns missing when there is nothing, without hydrating', () => {
        const adapter = makeAdapter();
        expect(restoreCheckpoint(adapter)).toEqual({kind: 'missing'});
        expect(adapter.restoreRoom).not.toHaveBeenCalled();
    });

    it('returns corrupted for a broken multiplayer identity (strict, fail-close)', () => {
        const adapter = makeAdapter();
        put('bb84GameData', {});
        put('bb84PlayerData', {gameCode: 'X', role: 'A'});
        expect(restoreCheckpoint(adapter)).toEqual({kind: 'corrupted'});
    });

    it('hydrates and returns active for a solo checkpoint', () => {
        const adapter = makeAdapter();
        put('bb84GameData', {evePresent: true});
        expect(restoreCheckpoint(adapter)).toEqual({kind: 'active'});
        expect(adapter.restoreRoom).toHaveBeenCalledWith({evePresent: true});
        expect(adapter.hydrateProgress).toHaveBeenCalled();
    });

    it('carries the multiplayer session and completed kind', () => {
        const adapter = makeAdapter();
        put('bb84GameData', {gameSuccess: true});
        put('bb84PlayerData', {gameCode: 'X1', role: 'B', room: 'r2'});
        const result = restoreCheckpoint(adapter);
        expect(result.kind).toBe('completed');
        if (result.kind === 'completed') {
            expect(result.multiplayerSession?.role).toBe('B');
        }
    });

    it('NEVER synthesizes a restore from the DPS solo marker alone (contract guard)', () => {
        // detectSession says solo (dps compat), but there is no real checkpoint:
        // restoreCheckpoint must stay missing rather than hydrate nothing.
        const dps = makeAdapter('dps');
        put('dpsPlayerData', {playingSolo: true, role: 'A', gameCode: 'SOLO'});
        expect(restoreCheckpoint(dps)).toEqual({kind: 'missing'});
        expect(dps.restoreRoom).not.toHaveBeenCalled();
    });
});

describe('resolveSessionForRoute (the route-guard policy)', () => {
    const adapter = makeAdapter('bb84');

    it('leaves when there is no session at all', () => {
        expect(resolveSessionForRoute(adapter)).toEqual({action: 'leave'});
    });

    it('leaves on a corrupt session (fail-close)', () => {
        localStorage.setItem('bb84GameData', '{oops');
        expect(resolveSessionForRoute(adapter)).toEqual({action: 'leave'});
    });

    it('renders an active solo session in solo mode', () => {
        put('bb84GameData', {});
        expect(resolveSessionForRoute(adapter))
            .toEqual({action: 'render', mode: 'solo'});
    });

    it('renders a multi session in multi mode', () => {
        put('bb84GameData', {});
        put('bb84PlayerData', {gameCode: 'X', role: 'A', room: 'r'});
        expect(resolveSessionForRoute(adapter))
            .toEqual({action: 'render', mode: 'multi'});
    });

    it('require.completed leaves for an ACTIVE session (results-page rule)', () => {
        put('bb84GameData', {});
        expect(resolveSessionForRoute(adapter, {completed: true}))
            .toEqual({action: 'leave'});
    });

    it('require.completed renders a completed session', () => {
        put('bb84GameData', {gameSuccess: true});
        expect(resolveSessionForRoute(adapter, {completed: true}))
            .toEqual({action: 'render', mode: 'solo'});
    });

    it('require.mode leaves when the session mode differs (solo results vs multi game)', () => {
        put('bb84GameData', {gameSuccess: true});
        put('bb84PlayerData', {gameCode: 'X', role: 'A', room: 'r'});
        expect(resolveSessionForRoute(adapter, {completed: true, mode: 'solo'}))
            .toEqual({action: 'leave'});
    });
});

describe('complete (the milestone persistence door — Task 54 F3)', () => {
    it('writes the full room snapshot to the gameDataKey', () => {
        const adapter = makeAdapter();
        (adapter.getRoomSnapshot as ReturnType<typeof vi.fn>)
            .mockReturnValue({gameSuccess: true, keyBits: ['1']});
        complete(adapter);
        expect(JSON.parse(localStorage.getItem('bb84GameData')!))
            .toEqual({gameSuccess: true, keyBits: ['1']});
    });
});

describe('startFresh / abandon', () => {
    it('startFresh clears EVERY adapter storage key and resets the mode flags', () => {
        const adapter = makeAdapter();
        adapter.storageKeys.forEach(key => put(key, {stale: true}));
        usePlayerStore.getState().setPlayingSolo(true);

        startFresh(adapter);

        adapter.storageKeys.forEach(key =>
            expect(localStorage.getItem(key)).toBeNull());
        expect(usePlayerStore.getState().playingSolo).toBe(false);
        expect(adapter.resetRoom).toHaveBeenCalled();
        expect(adapter.resetProgress).toHaveBeenCalled();
    });

    it('abandon clears storage and resets both mode flags', () => {
        const adapter = makeAdapter();
        put('bb84GameData', {});
        usePlayerStore.getState().setPlayingMultiplayer(true);

        abandon(adapter);

        expect(localStorage.getItem('bb84GameData')).toBeNull();
        expect(usePlayerStore.getState().playingMultiplayer).toBe(false);
    });
});

/**
 * Solo round contract tests (Task 47 phase 1 — docs/testing-strategy.md).
 * Encodes the July 2026 hand-found bugs: the Task 49 no-photons restart, the
 * Task 51 flag conflation (gameHasEve = checkbox/flow vs evePresent =
 * draw/physics), the stale bb84BobBasisInputs, and the Eve-record lifecycle.
 */

import {beforeEach, describe, expect, it} from 'vitest';
import {
    beginSoloRound,
    readSoloEveRecord,
    recordSoloGameStart,
    restartSoloRound,
} from './solo-round';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';

beforeEach(() => {
    localStorage.clear();
    usePlayerStore.getState().resetPlayer();
    useBB84RoomStore.getState().resetRoom();
    useBB84ProgressStore.getState().resetProgress();
    useBB84GameStore.setState({gameHasEve: false, photonNumber: 4});
});

describe('beginSoloRound', () => {
    it('as Bob: generates Alice bits/bases/photons of the right length + his transcript', () => {
        usePlayerStore.getState().setPlayerRole('B');
        beginSoloRound(4, false);
        const room = useBB84RoomStore.getState();
        expect(room.aliceBits).toHaveLength(4);
        expect(room.aliceBases).toHaveLength(4);
        expect(room.alicePhotons).toHaveLength(4);
        expect(useBB84ProgressStore.getState().displayedLines).toHaveLength(4);
    });

    it('as Alice: pushes her transcript only — she generates via her own UI', () => {
        usePlayerStore.getState().setPlayerRole('A');
        beginSoloRound(4, false);
        expect(useBB84RoomStore.getState().alicePhotons).toHaveLength(0);
        expect(useBB84ProgressStore.getState().displayedLines).toHaveLength(2);
    });

    it('clears the previous round\'s bb84BobBasisInputs (stale-form bug)', () => {
        localStorage.setItem('bb84BobBasisInputs', JSON.stringify(['+', 'x']));
        usePlayerStore.getState().setPlayerRole('B');
        beginSoloRound(4, false);
        expect(localStorage.getItem('bb84BobBasisInputs')).toBeNull();
    });
});

describe('restartSoloRound (Task 49-A: same config, fresh randomness)', () => {
    it('regenerates photons for Bob — the original stuck-game bug', () => {
        usePlayerStore.getState().setPlayerRole('B');
        useBB84RoomStore.getState().setEvePresent(false);
        restartSoloRound();
        expect(useBB84RoomStore.getState().alicePhotons).toHaveLength(4);
    });

    it('preserves the Eve DRAW across a bad-luck restart (flag split)', () => {
        usePlayerStore.getState().setPlayerRole('B');
        useBB84RoomStore.getState().setEvePresent(true);
        restartSoloRound();
        expect(useBB84RoomStore.getState().evePresent).toBe(true);
    });

    it('withoutEve zeroes the PRESENCE only — the checkbox/flow flag survives', () => {
        usePlayerStore.getState().setPlayerRole('B');
        useBB84GameStore.setState({gameHasEve: true});
        useBB84RoomStore.getState().setEvePresent(true);
        restartSoloRound({withoutEve: true});
        expect(useBB84RoomStore.getState().evePresent).toBe(false);
        // The validation mechanic must stay: skipping it would leak the answer.
        expect(useBB84GameStore.getState().gameHasEve).toBe(true);
    });

    it('does not resurrect Eve after an Eve-detected restart followed by a bad-luck restart', () => {
        usePlayerStore.getState().setPlayerRole('B');
        useBB84GameStore.setState({gameHasEve: true});
        useBB84RoomStore.getState().setEvePresent(true);
        restartSoloRound({withoutEve: true});
        restartSoloRound(); // bad luck in the clean round
        expect(useBB84RoomStore.getState().evePresent).toBe(false);
    });
});

describe('SoloEveRecord (Task 51 ph.2: the game\'s Eve story)', () => {
    it('records the start facts with detected=false and rounds=1', () => {
        recordSoloGameStart({enabled: true, percentage: 0.5, drawn: true});
        expect(readSoloEveRecord()).toEqual({
            enabled: true, percentage: 0.5, drawn: true,
            detected: false, rounds: 1,
        });
    });

    it('increments rounds on every restart, preserving the rest', () => {
        usePlayerStore.getState().setPlayerRole('B');
        recordSoloGameStart({enabled: true, percentage: 1, drawn: true});
        useBB84RoomStore.getState().setEvePresent(true);
        restartSoloRound({withoutEve: true});
        restartSoloRound();
        const record = readSoloEveRecord();
        expect(record?.rounds).toBe(3);
        expect(record?.drawn).toBe(true);
    });
});

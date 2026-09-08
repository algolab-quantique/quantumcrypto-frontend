/**
 * E91's round contract (Task 63 Step 2).
 *
 * Encodes the two defects Ibra found on 2026-09-03 by playing the game, both of
 * which came from the same cause — the restart was hand-written in three places
 * instead of going through shared code:
 *
 *  1. `resetRoom()` wipes `evePresent`, and no copy put it back, so a short-key
 *     restart silently removed Eve from a game that still said she was there.
 *     In solo she stopped intercepting outright.
 *  2. All three copies pushed the welcome line as `{content}` where a fresh
 *     start uses `{title}`. Only `title` gets the highlight span, so the
 *     restarted game's greeting rendered as plain text.
 *
 * Plus one guard against a defect that has not happened yet: the shared code
 * must never touch the Eve CHECKBOX. All three were confirmed by mutation —
 * each fails when its defect is reintroduced.
 */

import {beforeEach, describe, expect, it} from 'vitest';

import {restartRound} from './round';
import {e91Adapter} from './e91-adapter';
import useE91RoomStore from '@/store/e91/e91-room-store';
import usePlayerStore from '@/store/player-store';
import useE91GameStore from '@/store/e91/e91-game-store';
import {useE91ProgressStore} from '@/store/e91/e91-progress-store';

beforeEach(() => {
    localStorage.clear();
    usePlayerStore.getState().resetPlayer();
    // Stated rather than inherited (Task 63 Step 4a). These cases pass in either
    // mode today, because E91 has no `prepareRound` for the mode to gate — but
    // they passed for that reason by ACCIDENT, and the day Task 64 gives E91 one,
    // their meaning would change with nobody noticing. Solo is what they mean.
    usePlayerStore.getState().setPlayingSolo(true);
    useE91RoomStore.getState().resetRoom();
    useE91ProgressStore.getState().resetProgress();
});

describe('restartRound on E91 — Eve across a restart', () => {
    /**
     * The insufficient-key restart is BAD LUCK, not a detection: the student
     * retries the same kind of game, so the draw must survive.
     */
    it('keeps Eve when the restart is not a detection', () => {
        useE91RoomStore.getState().setEvePresent(true);

        restartRound(e91Adapter);

        expect(useE91RoomStore.getState().evePresent).toBe(true);
    });

    /**
     * The Eve-detected restart deliberately switches her off (Task 49-C), so a
     * student who caught her can finish the protocol instead of looping
     * detect→restart forever.
     */
    it('drops Eve when the restart follows a detection', () => {
        useE91RoomStore.getState().setEvePresent(true);

        restartRound(e91Adapter, {withoutEve: true});

        expect(useE91RoomStore.getState().evePresent).toBe(false);
    });

    it('leaves Eve absent when she was never there', () => {
        useE91RoomStore.getState().setEvePresent(false);

        restartRound(e91Adapter);

        expect(useE91RoomStore.getState().evePresent).toBe(false);
    });

    /**
     * The two flags are not interchangeable (Task 51): `gameHasEve` is the
     * CHECKBOX — the game includes the verification step — while `evePresent`
     * is the DRAW. A restart is about the draw; the shared code must never
     * touch the checkbox, in any protocol.
     *
     * Without this test, someone "simplifying" restartRound by also clearing
     * gameHasEve would silently delete BB84's validation step from every round
     * that follows a restart, and no test would notice.
     *
     * A caller may still turn the checkbox off for its own reasons — E91's
     * `handleSoloRestart` does exactly that, deliberately and with the reason
     * written above it. That is the caller's choice, not the shared code's.
     */
    it('never touches the Eve CHECKBOX — that is the caller\'s decision', () => {
        useE91GameStore.getState().setGameHasEve(true);
        useE91RoomStore.getState().setEvePresent(true);

        restartRound(e91Adapter, {withoutEve: true});

        expect(useE91GameStore.getState().gameHasEve).toBe(true);
        expect(useE91RoomStore.getState().evePresent).toBe(false);
    });
});

describe('restartRound on E91 — the opening transcript', () => {
    it('replaces the old transcript rather than appending to it', () => {
        useE91ProgressStore.getState().pushLines([{content: 'stale.line'}]);

        restartRound(e91Adapter);

        const lines = useE91ProgressStore.getState().displayedLines;
        expect(lines.map(l => l.content)).not.toContain('stale.line');
    });

    /**
     * The `content` vs `title` defect, pinned. The renderer highlights `title`
     * only, so a welcome pushed as `content` is the same words in the wrong
     * style — invisible in a diff, visible on screen, and it had already drifted
     * in two separate copies.
     */
    it('pushes the welcome line as a title, so it renders highlighted', () => {
        restartRound(e91Adapter);

        const [welcome] = useE91ProgressStore.getState().displayedLines;
        expect(welcome.title).toBe('component.e91.measurement.welcome');
        expect(welcome.content).toBeUndefined();
    });

    it('follows the welcome with step 1', () => {
        restartRound(e91Adapter);

        const lines = useE91ProgressStore.getState().displayedLines;
        expect(lines).toHaveLength(2);
        expect(lines[1]).toMatchObject({
            title: 'component.game.step1',
            content: 'component.e91.measurement.start',
        });
    });
});

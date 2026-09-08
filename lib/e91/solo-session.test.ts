/**
 * E91 solo game-scope facts (Task 40 Phase 3f).
 *
 * These values outlive a round: a restart must not rewrite them, and the
 * results page reads them after the game is over. The behaviours pinned here
 * are the ones the inline code used to express by hand in four places, where
 * "by hand in four places" is exactly how the `content`/`title` drift in
 * Task 63 happened.
 */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
    incrementSoloRoundCount,
    markSoloEveDetected,
    markSoloGameStarted,
    readSoloEveRecord,
    readSoloGameStartTime,
    recordSoloGameStart,
} from './solo-session';

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('recordSoloGameStart', () => {
    it('stores the draw and starts undetected', () => {
        recordSoloGameStart(true, 0.5);

        expect(readSoloEveRecord()).toMatchObject({drawn: true, detected: false});
    });

    it('records an absent Eve as absent, not as missing data', () => {
        recordSoloGameStart(false, 0.5);

        expect(readSoloEveRecord()).toMatchObject({drawn: false, detected: false});
    });

    /**
     * `enabled` is the modal checkbox and lives in its own key, written by the
     * modal as config. The record reads it so the results page has one source
     * for the whole Eve story instead of three separate reads.
     */
    it('reports the checkbox separately from the draw', () => {
        localStorage.setItem('e91GameHasEve', JSON.stringify(true));
        recordSoloGameStart(false, 0.5);

        expect(readSoloEveRecord()).toMatchObject({
            enabled: true, drawn: false, detected: false,
        });
    });
});

describe('incrementSoloRoundCount', () => {
    /**
     * The counter is what the results table's Iteration column reports, and it
     * must survive the resets a restart performs — which is why it is a key of
     * its own rather than a field of the room snapshot (Task 63).
     */
    /**
     * Written against a STALE counter on purpose. Asserting `rounds === 1` on
     * empty storage proves nothing: the reader falls back to 1 when the key is
     * missing, so that version passed even with the initialisation deleted —
     * caught by mutation, and it is exactly the vacuous test rule 5 warns about.
     * Starting from 4 makes the assertion depend on the write actually happening.
     */
    it('resets the counter when a new game starts', () => {
        localStorage.setItem('e91RoundCount', JSON.stringify(4));

        recordSoloGameStart(true, 0.5);

        expect(readSoloEveRecord().rounds).toBe(1);
    });

    it('counts each restart', () => {
        recordSoloGameStart(true, 0.5);

        incrementSoloRoundCount();
        incrementSoloRoundCount();

        expect(readSoloEveRecord().rounds).toBe(3);
    });

    /**
     * A game that began before this key existed has no counter. It reads as its
     * first round, which is what it was — rather than 0, or NaN from a bad parse.
     */
    it('treats a game with no counter as its first round', () => {
        expect(readSoloEveRecord().rounds).toBe(1);

        incrementSoloRoundCount();

        expect(readSoloEveRecord().rounds).toBe(2);
    });
});

describe('the Eve probability', () => {
    it('is recorded at game start so the results page can show the odds', () => {
        recordSoloGameStart(true, 0.7);

        expect(readSoloEveRecord().percentage).toBe(0.7);
    });
});

describe('markSoloEveDetected', () => {
    it('flips detection without disturbing the draw', () => {
        recordSoloGameStart(true, 0.5);

        markSoloEveDetected();

        expect(readSoloEveRecord()).toMatchObject({drawn: true, detected: true});
    });
});

describe('markSoloGameStarted', () => {
    it('stamps a start time on the first call', () => {
        markSoloGameStarted();

        expect(readSoloGameStartTime()).toBeTypeOf('number');
    });

    /**
     * The guard that used to live inline in solo-measurement-tab. Measuring
     * again — or a refresh that remounts the tab — must NOT restart the clock,
     * or the reported game duration silently shrinks.
     *
     * The clock MUST be moved between the two calls. Without that, both calls
     * land in the same millisecond and the assertion holds even with the guard
     * deleted — a test that passes on broken code, which is no test at all.
     * Verified by mutation: removing the guard turns this red.
     */
    it('is idempotent: a second call does not restart the clock', () => {
        const now = vi.spyOn(Date, 'now');

        now.mockReturnValue(1_000);
        markSoloGameStarted();

        now.mockReturnValue(9_000);
        markSoloGameStarted();

        expect(readSoloGameStartTime()).toBe(1_000);
    });
});

describe('reading before anything was written', () => {
    it('reports no start time rather than a bogus one', () => {
        expect(readSoloGameStartTime()).toBeNull();
    });

    it('reports Eve as absent and undetected', () => {
        expect(readSoloEveRecord()).toMatchObject({
            enabled: false, drawn: false, detected: false,
        });
    });

    it('survives corrupt storage instead of throwing', () => {
        localStorage.setItem('e91OriginalEvePresent', '{not json');
        localStorage.setItem('e91GameStartTime', 'not a number');

        expect(readSoloEveRecord()).toMatchObject({
            enabled: false, drawn: false, detected: false,
        });
        expect(readSoloGameStartTime()).toBeNull();
    });
});

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
        recordSoloGameStart(true);

        expect(readSoloEveRecord()).toMatchObject({drawn: true, detected: false});
    });

    it('records an absent Eve as absent, not as missing data', () => {
        recordSoloGameStart(false);

        expect(readSoloEveRecord()).toMatchObject({drawn: false, detected: false});
    });

    /**
     * `enabled` is the modal checkbox and lives in its own key, written by the
     * modal as config. The record reads it so the results page has one source
     * for the whole Eve story instead of three separate reads.
     */
    it('reports the checkbox separately from the draw', () => {
        localStorage.setItem('e91GameHasEve', JSON.stringify(true));
        recordSoloGameStart(false);

        expect(readSoloEveRecord()).toEqual({
            enabled: true, drawn: false, detected: false,
        });
    });
});

describe('markSoloEveDetected', () => {
    it('flips detection without disturbing the draw', () => {
        recordSoloGameStart(true);

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
        expect(readSoloEveRecord()).toEqual({
            enabled: false, drawn: false, detected: false,
        });
    });

    it('survives corrupt storage instead of throwing', () => {
        localStorage.setItem('e91OriginalEvePresent', '{not json');
        localStorage.setItem('e91GameStartTime', 'not a number');

        expect(readSoloEveRecord()).toEqual({
            enabled: false, drawn: false, detected: false,
        });
        expect(readSoloGameStartTime()).toBeNull();
    });
});

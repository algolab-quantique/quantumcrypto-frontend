/**
 * Eve-story classification tests (Task 56 — docs/testing-strategy.md).
 * Requested by Ibra: several endings cannot be forced manually (the MISSED
 * ending needs Eve present AND validation bits that happen to match — he ran
 * the game "several times hahaha" without hitting it). Here, every
 * combination is exercised deterministically.
 */

import {describe, expect, it} from 'vitest';
import {classifySoloEnding, deriveRoomEnding, deriveRoomEveStory} from './eve-story';
import type {SoloEveRecord} from '@/lib/bb84/solo-round';

/**
 * Task 63 Step 6a: still built from BB84's full record, on purpose. The
 * classifier now takes the structural `EveOutcome` so E91 can pass its own,
 * smaller record — and these cases keep proving that a protocol's richer record
 * is still accepted, with the extra fields ignored.
 */
const record = (overrides: Partial<SoloEveRecord>): SoloEveRecord => ({
    enabled: true,
    percentage: 0.5,
    drawn: false,
    detected: false,
    rounds: 1,
    ...overrides,
});

describe('classifySoloEnding — every solo ending', () => {
    it('no record at all (legacy/no-Eve game) → absent', () => {
        expect(classifySoloEnding(null)).toBe('absent');
    });

    it('Eve enabled but NOT drawn → absent (key secure)', () => {
        expect(classifySoloEnding(record({drawn: false}))).toBe('absent');
    });

    it('drawn and detected → caught (replayed clean)', () => {
        expect(classifySoloEnding(record({drawn: true, detected: true})))
            .toBe('caught');
    });

    it('THE un-forceable one: drawn and NOT detected → missed (compromised key)', () => {
        expect(classifySoloEnding(record({drawn: true, detected: false})))
            .toBe('missed');
    });

    it('checkbox off entirely → absent', () => {
        expect(classifySoloEnding(record({enabled: false, drawn: false})))
            .toBe('absent');
    });
});

describe('deriveRoomEveStory — every multi iteration pattern', () => {
    const eve = {eve_present: true, elapsed_time: 10};
    const clean = {eve_present: false, elapsed_time: 10};

    it('no iterations → secure, not detected (defensive)', () => {
        expect(deriveRoomEveStory([]))
            .toEqual({eveDetected: false, keyCompromised: false});
    });

    it('single clean iteration → secure', () => {
        expect(deriveRoomEveStory([clean]))
            .toEqual({eveDetected: false, keyCompromised: false});
    });

    it("Ibra's verified screenshot: single Eve iteration → MISSED, key compromised", () => {
        expect(deriveRoomEveStory([eve]))
            .toEqual({eveDetected: false, keyCompromised: true});
    });

    it('Eve then clean (the coordinated restart) → CAUGHT, key secure', () => {
        expect(deriveRoomEveStory([eve, clean]))
            .toEqual({eveDetected: true, keyCompromised: false});
    });

    it('Eve, clean, Eve again (defensive weird order) → compromised wins', () => {
        expect(deriveRoomEveStory([eve, clean, eve]))
            .toEqual({eveDetected: false, keyCompromised: true});
    });

    it('clean then Eve (defensive) → compromised, not "caught"', () => {
        expect(deriveRoomEveStory([clean, eve]))
            .toEqual({eveDetected: false, keyCompromised: true});
    });

    it('two Eve iterations (should not happen — restart removes her) → compromised', () => {
        expect(deriveRoomEveStory([eve, eve]))
            .toEqual({eveDetected: false, keyCompromised: true});
    });
});

/**
 * Task 63 Step 6d — the flag-reading classifier, for backends that record the
 * detection. Every case here was a real symptom on Ibra's screen or a real risk:
 * the post-restart mutation is the defect the E91 multiplayer table shipped
 * with, and the empty-iterations case is the crash its row had no guard for.
 */
describe('deriveRoomEnding — a backend that records eve_detected', () => {
    it('Eve drawn and never caught → missed (the key is compromised)', () => {
        expect(deriveRoomEnding([{eve_present: true, eve_detected: false}]))
            .toBe('missed');
    });

    /**
     * THE ONE THAT MATTERS. E91's backend keeps one iteration per room and
     * RESTART_WITHOUT_EVE mutates it to eve_present=false, so the room a
     * winning student leaves behind claims Eve was never there. Reading
     * eve_present alone reports 'absent' here — the table said "Ève présente:
     * Non · Ève détectée: Oui", she was never here and you caught her.
     *
     * Delete the `|| eve_detected` in deriveRoomEnding and only this case
     * fails, which is what makes it a regression test rather than decoration.
     */
    it('caught, then the restart erased her from the record → still caught', () => {
        expect(deriveRoomEnding([{eve_present: false, eve_detected: true}]))
            .toBe('caught');
    });

    it('caught before the record was mutated → caught', () => {
        expect(deriveRoomEnding([{eve_present: true, eve_detected: true}]))
            .toBe('caught');
    });

    it('Eve never drawn → absent', () => {
        expect(deriveRoomEnding([{eve_present: false, eve_detected: false}]))
            .toBe('absent');
    });

    it('a room the backend has not filled in yet → absent, not a crash', () => {
        expect(deriveRoomEnding([])).toBe('absent');
        expect(deriveRoomEnding([{}])).toBe('absent');
    });

    /**
     * Task 28 will make the backend append an iteration per restart instead of
     * overwriting. Pinned now so that change cannot silently alter the verdict:
     * caught in an earlier round, gone in the last, still 'caught'.
     */
    it('survives the day the backend appends rounds instead of mutating', () => {
        expect(deriveRoomEnding([
            {eve_present: true, eve_detected: true},
            {eve_present: false, eve_detected: false},
        ])).toBe('caught');
    });
});

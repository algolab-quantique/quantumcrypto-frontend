/**
 * Eve-story classification tests (Task 56 — docs/testing-strategy.md).
 * Requested by Ibra: several endings cannot be forced manually (the MISSED
 * ending needs Eve present AND validation bits that happen to match — he ran
 * the game "several times hahaha" without hitting it). Here, every
 * combination is exercised deterministically.
 */

import {describe, expect, it} from 'vitest';
import {classifySoloEnding, deriveRoomEveStory} from './eve-story';
import type {SoloEveRecord} from './solo-round';

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

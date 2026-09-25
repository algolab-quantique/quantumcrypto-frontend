/**
 * Placeholder filling (Task 72). A translation keeps one whole sentence per
 * language and marks where each number goes — `{n}`, `{k}` — so no language is
 * forced into another's word order. These pin how the markers are filled.
 */

import {describe, expect, it, vi} from 'vitest';
import {fillPlaceholders} from './utils';

// ⚠️ Why this block exists — read before deleting it.
//
// lib/utils.ts imports the `Language` enum from
// components/providers/language-provider.tsx. That is a React (.tsx) file, and
// the test runner cannot read React files, so without this block the test
// cannot even load lib/utils.ts. Here we hand it a stand-in `Language` instead.
// It exists only inside this test; the game never runs it.
//
// It can be deleted once `Language` moves to a plain .ts file — that is the
// real fix, tracked in tasks_todo.md (Task 72, "untestable lib/utils.ts").
vi.mock('@/components/providers/language-provider', () => ({
    Language: {ENGLISH: 0, FRENCH: 1, SPANISH: 2},
}));

describe('fillPlaceholders', () => {
    it('fills every named marker, wherever the sentence puts it', () => {
        expect(fillPlaceholders(
            'Ève a mesuré {n} photons sur {m} ; elle a deviné {k} bits sur {l}.',
            {n: 20, m: 20, k: 2, l: 5},
        )).toBe('Ève a mesuré 20 photons sur 20 ; elle a deviné 2 bits sur 5.');
    });

    // The case Task 72 exists for: Eve guessed nothing. A falsy-value shortcut
    // would print an empty gap exactly where the student needs to read "0".
    it('writes 0 as "0", never as an empty gap', () => {
        expect(fillPlaceholders('{k} bits sur {l}', {k: 0, l: 5})).toBe('0 bits sur 5');
    });

    it('leaves a sentence with no markers exactly as it was', () => {
        expect(fillPlaceholders('Ève était présente !', {n: 20})).toBe('Ève était présente !');
    });

    it('fills a marker every time it appears', () => {
        expect(fillPlaceholders('{n} sur {n}', {n: 7})).toBe('7 sur 7');
    });

    // A missing number must show on screen, not vanish into a plausible
    // sentence — DPS once shipped a literal "{minWithEve}", and that was
    // visible, which is how it got caught.
    it('leaves a marker with no value visible', () => {
        expect(fillPlaceholders('{n} sur {m}', {n: 20})).toBe('20 sur {m}');
    });

    it('does not mistake built-in object names for values', () => {
        expect(fillPlaceholders('{constructor}', {})).toBe('{constructor}');
    });

    it('returns an empty string when the translation is missing', () => {
        expect(fillPlaceholders(undefined, {n: 1})).toBe('');
    });
});

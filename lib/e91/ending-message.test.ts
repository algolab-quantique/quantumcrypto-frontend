/**
 * The message at the end of an E91 game, shared by solo and multiplayer (M2a).
 */

import {describe, expect, it} from 'vitest';
import {e91Lines} from '@/lang/e91-lines';
import {keysMatch, endingLine} from './ending-message';

describe('keysMatch', () => {
    it('is true only when the two keys agree bit for bit', () => {
        expect(keysMatch(['0', '1', '1'], ['0', '1', '1'])).toBe(true);
        expect(keysMatch(['0', '1', '1'], ['0', '0', '1'])).toBe(false);
    });

    it('is false for keys of different lengths', () => {
        expect(keysMatch(['0', '1'], ['0', '1', '1'])).toBe(false);
    });
});

describe('endingLine', () => {
    it('celebrates with the caller’s own text when the keys match', () => {
        expect(endingLine(true, 'component.messaging.bob.end')).toEqual({
            title: 'component.messaging.congratulations',
            content: 'component.messaging.bob.end',
        });
    });

    it('announces the disturbed key, with the ⓘ, when they do not', () => {
        expect(endingLine(false, 'component.messaging.bob.end')).toEqual({
            title: 'component.e91.messaging.keyPerturbed',
            content: 'component.e91.messaging.keyPerturbed.line',
            info: 'keyPerturbed',
        });
    });

    it('uses only text keys that exist in all three languages', () => {
        const keys = [endingLine(true, 'component.messaging.bob.end'),
            endingLine(true, 'component.messaging.alice.end'), endingLine(false, '')]
            .flatMap(line => [line.title, line.content]);
        for (const block of e91Lines) {
            for (const key of keys) expect(block[key as string], key).toBeTruthy();
        }
    });
});

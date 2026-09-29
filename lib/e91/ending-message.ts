/**
 * The message a student sees when an E91 game ends — decided in ONE place for
 * solo and multiplayer, both roles (Task 71; M2a). Nothing to do with the
 * session lifecycle: this is only "Félicitations" versus "the key was disturbed".
 *
 * The message Bob decrypts is Alice's exactly where their two keys agree
 * (docs/protocol-physics.md §10.15), so comparing the keys decides it.
 *
 * Only the decision and its feed line live here. Each caller still pushes the
 * line, ends the round, and opens the popup when it can: a socket handler has
 * no popup of its own, and the line's ⓘ reopens it from the feed anyway.
 */

import type {Line} from '@/types';

export const keysMatch = (aliceKey: readonly string[], bobKey: readonly string[]): boolean =>
    aliceKey.join('') === bobKey.join('');

export const endingLine = (match: boolean, successContent: string): Line =>
    match
        ? {title: 'component.messaging.congratulations', content: successContent}
        : {
            title: 'component.e91.messaging.keyPerturbed',
            content: 'component.e91.messaging.keyPerturbed.line',
            info: 'keyPerturbed',
        };

/** Eve measured n photons of m, and holds k of the l key bits for certain. */
export type EveSummary = {n: number; m: number; k: number; l: number};

/**
 * The line about Eve, whenever she was there — even when she holds no key bit
 * (Task 72). Solo counts the numbers in the browser; multiplayer receives them
 * from the server, which keeps her angles to itself (backend
 * e91/multiplayer.py eve_summary; M2d). Only the four numbers are kept.
 */
export const eveLine = ({n, m, k, l}: EveSummary): Line => ({
    title: 'component.e91.evePresent',
    content: 'component.e91.evePresent.summary',
    values: {n, m, k, l},
});

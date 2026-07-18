/**
 * The Eve-story classification (Task 56) — ONE pure home for "how did this
 * game end?", consumed by both results pages and fully unit-tested, because
 * several endings are practically impossible to force manually (e.g. the
 * MISSED ending needs Eve present AND validation bits that happen to match).
 */

import type {SoloEveRecord} from './solo-round';

export type EveEnding = 'absent' | 'caught' | 'missed';

/**
 * Solo: the ending comes from the game's persisted Eve record.
 * - not drawn (or no record) → absent (key secure)
 * - drawn + detected → caught (replayed clean, key secure)
 * - drawn + undetected → missed (completed with her listening — compromised)
 */
export const classifySoloEnding = (record: SoloEveRecord | null): EveEnding => {
    if (!record?.drawn) return 'absent';
    return record.detected ? 'caught' : 'missed';
};

export type RoomIteration = {eve_present?: boolean; elapsed_time?: number};

/**
 * Multi: derived from the backend's iterations, no backend change needed.
 * The ONLY thing that removes Eve mid-game is the coordinated Eve-detected
 * restart, which starts a new iteration without her. So:
 * - an eve_present iteration followed by a later one → she was CAUGHT;
 * - eve_present in the LAST iteration → the game completed with her
 *   listening (key compromised — the same "missed" ending as solo);
 * - never present → key secure.
 */
export const deriveRoomEveStory = (
    iterations: RoomIteration[],
): {eveDetected: boolean; keyCompromised: boolean} => {
    const last = iterations[iterations.length - 1];
    const anyEve = iterations.some(iteration => !!iteration?.eve_present);
    const lastHadEve = !!last?.eve_present;
    return {
        eveDetected: anyEve && !lastHadEve,
        keyCompromised: lastHadEve,
    };
};

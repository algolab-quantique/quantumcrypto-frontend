/**
 * The Eve-story classification (Task 56) — ONE pure home for "how did this
 * game end?", consumed by every protocol's results page and fully unit-tested,
 * because several endings are practically impossible to force manually (e.g.
 * the MISSED ending needs Eve present AND validation bits that happen to match).
 *
 * Task 63 Step 6a moved this out of `lib/bb84/`: the question it answers is not
 * BB84's. It sits at the root of `lib/` with the other cross-protocol modules
 * (`utils.ts`, `test-mode.ts`), and E91 now asks it too. Nothing about the
 * logic changed — BB84's existing tests came along unedited and still pass.
 */

export type EveEnding = 'absent' | 'caught' | 'missed';

/**
 * The two facts an ending depends on. Deliberately structural rather than a
 * protocol's own record type: BB84's carries `percentage` and `rounds` as well,
 * E91's does not, and neither matters here. A protocol passes whatever record
 * it keeps, as long as it can answer these two questions.
 */
export type EveOutcome = {
    /** Did Eve actually intercept? The draw, not the checkbox (Task 51). */
    drawn: boolean;
    /** Did the player catch her? */
    detected: boolean;
};

/**
 * Solo: the ending comes from the game's persisted Eve record.
 * - not drawn (or no record) → absent (key secure)
 * - drawn + detected → caught (replayed clean, key secure)
 * - drawn + undetected → missed (completed with her listening — compromised)
 */
export const classifySoloEnding = (record: EveOutcome | null): EveEnding => {
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

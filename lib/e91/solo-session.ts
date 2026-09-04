/**
 * E91 solo game-scope facts (Task 40 Phase 3f).
 *
 * These are the values a finished solo game needs in order to tell its story on
 * the results page: was Eve enabled, did she actually intercept, did the player
 * catch her, and how long did the game take. They are GAME scope, not ROUND
 * scope — a restart deliberately does not rewrite them, which is why they live
 * beside the room checkpoint rather than inside it.
 *
 * Why this module exists: before it, four components and the results page each
 * read and wrote these keys with their own inline `localStorage.getItem` +
 * `JSON.parse`, with no shared shape and no SSR guard. Every key here is
 * already listed in `e91Adapter.storageKeys`, so `abandon()` and `startFresh()`
 * clear them correctly — what was missing was a single owner for reading and
 * writing them. Mirrors `lib/bb84/solo-round.ts`, which does the same job for
 * BB84 and which the results page there already uses.
 *
 * NOT a behaviour change: each function does exactly what the inline code it
 * replaces did, including when it is called. In particular the start time is
 * still written at the FIRST MEASUREMENT rather than at game creation — moving
 * it would change what the results page reports, and that number is Task 62's
 * subject, not this phase's.
 */

const EVE_ENABLED_KEY = 'e91GameHasEve';
const EVE_PRESENT_KEY = 'e91OriginalEvePresent';
const EVE_DETECTED_KEY = 'e91EveWasDetected';
const GAME_START_TIME_KEY = 'e91GameStartTime';

const isBrowser = () => typeof window !== 'undefined';

const readJSON = <T>(key: string): T | null => {
    if (!isBrowser()) return null;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
};

export type SoloEveRecord = {
    /**
     * Was the Eve mechanic switched on? The modal checkbox.
     *
     * Read from `e91GameHasEve`, which the start modal writes as CONFIG (the
     * adapter's hydrateConfig also restores it into the game store). It is read
     * here rather than from that store on purpose: `startFresh` does not reset
     * the game store, so an in-memory value can outlive the game that set it,
     * while this key is cleared with the rest of the session.
     */
    enabled: boolean;
    /** Did Eve actually intercept? The draw made at game start. */
    drawn: boolean;
    /** Did the player catch her? Flipped when they declare the channel unsafe. */
    detected: boolean;
};

/**
 * Persist the game-start Eve facts. Called once from the solo start modal.
 * `detected` starts false; a restart does not rewrite either value.
 */
export const recordSoloGameStart = (evePresent: boolean) => {
    if (!isBrowser()) return;
    localStorage.setItem(EVE_PRESENT_KEY, JSON.stringify(evePresent));
    localStorage.setItem(EVE_DETECTED_KEY, JSON.stringify(false));
};

/** Flip the detection flag. Survives the restart that follows detection. */
export const markSoloEveDetected = () => {
    if (!isBrowser()) return;
    localStorage.setItem(EVE_DETECTED_KEY, JSON.stringify(true));
};

/**
 * Stamp the start time on the first measurement, and only then — a second call
 * is a no-op, so the clock is not restarted by re-measuring or by a refresh.
 */
export const markSoloGameStarted = () => {
    if (!isBrowser()) return;
    if (localStorage.getItem(GAME_START_TIME_KEY)) return;
    localStorage.setItem(GAME_START_TIME_KEY, Date.now().toString());
};

export const readSoloEveRecord = (): SoloEveRecord => ({
    enabled: readJSON<boolean>(EVE_ENABLED_KEY) ?? false,
    drawn: readJSON<boolean>(EVE_PRESENT_KEY) ?? false,
    detected: readJSON<boolean>(EVE_DETECTED_KEY) ?? false,
});

/**
 * The moment the game began, or null if it never started.
 *
 * ⚠️ Callers currently compute `Date.now() - start` at render time, so the
 * reported duration keeps growing after the game is over — see Task 62. That
 * bug is deliberately NOT fixed here: this module only moves the read to one
 * place, which is what makes fixing it a one-line change later.
 */
export const readSoloGameStartTime = (): number | null => {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(GAME_START_TIME_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
};

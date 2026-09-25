/**
 * The shared round restart (Task 63).
 *
 * ONE implementation of "restart the current round" for every protocol. The
 * rule it exists to enforce, in Ibra's words: *a protocol behaviour is changed
 * in one place*. If we later decide that a restart keeps Eve according to the
 * probability instead of dropping her, that decision is the `evePresent` line
 * below — changed once, and BB84, E91 and every future protocol follow.
 *
 * Before this, the same seven steps were hand-written in three places per
 * protocol (the short-key restart, the Eve-detected restart, and the
 * multiplayer socket handler), and they had already drifted apart: E91 lost
 * Eve on a restart while BB84 solo kept her, BB84 multi lost her too, and the
 * welcome transcript was pushed with the wrong field in two E91 copies.
 *
 * WHAT IS COMMON lives here: the Eve policy, the round counter, both resets,
 * re-asserting the draw, and the solo/multiplayer decision. WHAT IS SPECIFIC is
 * behind two adapter hooks — `prepareRound` (produce the round's data) and
 * `openRoundTranscript` (say what just happened). Step 4a split them because
 * fusing them is how the mode leaked into a hook that never modelled it.
 *
 * NOT here yet, on purpose: telling the partner that a restart happened. That
 * needs a backend event and is specified in **Task 28**. Until then each player
 * restarts alone — a known, documented limitation.
 */

import usePlayerStore from '@/store/player-store';

import type {ProtocolAdapter} from './types';

export type RestartRoundOptions = {
    /**
     * Switch Eve's PRESENCE off for the new round — the Eve-detected restart
     * (Task 49-C). Without it the draw is preserved, which is what an
     * insufficient-key restart needs: that one is bad luck, not a detection,
     * so the round the player retries must be the same kind of round.
     *
     * This is the whole difference between the two restarts, and the reason
     * they cannot share a single `restart()` with no argument.
     */
    withoutEve?: boolean;
};

/**
 * Restart the current round, keeping the game's configuration.
 *
 * Throws rather than half-restarting when the adapter cannot support it: a
 * silent partial restart is how Eve disappeared unnoticed in the first place.
 */
export const restartRound = (
    adapter: ProtocolAdapter,
    options?: RestartRoundOptions,
) => {
    const {round} = adapter;

    if (!round) {
        throw new Error(
            `restartRound: ${adapter.protocolId} has no round adapter. A protocol ` +
            'must say how a fresh round starts before it can restart one. ' +
            'DPS has no Eve mechanic yet (Task 38).',
        );
    }

    // THE POLICY. One line, one place, every protocol.
    // `round` is all-or-nothing by type, so there is no partial adapter here
    // that could silently answer "no Eve" and drop her without anyone noticing.
    const evePresent = options?.withoutEve ? false : round.getEvePresent();

    // Before the resets: the counter must live OUTSIDE the room snapshot, or it
    // would be erased by the very reset it is counting. BB84 keeps it in its
    // solo Eve record, which resetRoom does not touch.
    round.incrementRoundCount?.();

    adapter.resetRoom();
    adapter.resetProgress();

    // resetRoom wipes the draw (and the persisted checkpoint) because it resets
    // every field. Re-assert it, then let beginRound rebuild the round; the
    // store writes recreate the checkpoint exactly like a fresh start does.
    round.setEvePresent(evePresent);

    // THE MODE DECISION, in one place (Task 63 Step 4a).
    //
    // Only solo prepares a round's data, because only solo has to play the
    // partner. In multiplayer a real peer or the backend produces it and there
    // is nothing to call — the round begins when an event ARRIVES, not when we
    // ask for it. Keeping this here rather than inside each adapter is what
    // stops the same `if (playingSolo)` from being written once per protocol.
    //
    // `playingSolo` survives a restart: only abandon/startFresh reset the mode
    // flags, and the route guard re-asserts them from the resolved session.
    //
    // NOTE ON ORDER: prepareRound reads this protocol's own config (photon
    // count and friends) AFTER the two resets, whereas BB84's inline version
    // read it before. Identical today — config lives in the game store, which
    // neither reset touches — but if a protocol ever resets its own config
    // store, that reset must not run between here and the read.
    // Structured so the compiler PROVES the guard rather than being told to
    // trust it. The first version computed a boolean and then used a non-null
    // assertion — the construction that crashes the day someone reorders these
    // three lines.
    let prepared = false;
    if (usePlayerStore.getState().playingSolo && round.prepareRound) {
        round.prepareRound(evePresent);
        prepared = true;
    }

    round.openRoundTranscript({prepared});
};

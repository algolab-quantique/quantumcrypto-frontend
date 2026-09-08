/**
 * BB84's round-opening transcript.
 *
 * It lives OUTSIDE `solo-round.ts` because it is not solo. Task 63 Step 4a put
 * it there and then called it from the multiplayer path — repeating, within the
 * hour, the exact naming leak that started this work: a `beginRound` hook that
 * called `beginSoloRound`. A file named `solo-round` holding multiplayer logic
 * is the next reader's trap, so it moved here instead.
 */

import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';

/**
 * The round's opening lines.
 *
 * `prepared` is why Bob reads two different things. When the photons were just
 * generated for him (solo), he is told they have ARRIVED and is sent straight
 * to step 1. When they have not (multiplayer), he is told he is WAITING for
 * them — because he is. Alice's transcript is the same either way: she
 * generates her own photons through her UI in both modes.
 *
 * So the transcript does not branch on the mode; it branches on what exists.
 */
export const pushRoundWelcome = ({prepared}: {prepared: boolean}) => {
    const pushLines = useBB84ProgressStore.getState().pushLines;

    if (usePlayerStore.getState().playerRole === 'B') {
        pushLines(prepared
            ? [
                {title: 'component.exchange.welcome'},
                {content: 'component.bobExchange.waiting'},
                {content: 'component.bobExchange.photonsArrived'},
                {title: 'component.game.step1', content: 'component.bobExchange.choose'},
            ]
            : [
                {title: 'component.exchange.welcome'},
                {content: 'component.bobExchange.waiting'},
            ]);
        return;
    }

    pushLines([
        {title: 'component.exchange.welcome'},
        {title: 'component.game.step1', content: 'component.aliceExchange.start'},
    ]);
};

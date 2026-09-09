/**
 * One room's line in the E91 multiplayer leaderboard.
 *
 * ⚠️ WHAT THE BACKEND CAN AND CANNOT SAY (read from `e91/consumers.py`,
 * 2026-09-09 — do not re-derive this by guessing at the UI):
 *
 *   create_room()          → creates exactly ONE E91Iteration, at room creation
 *   'RESTART_WITHOUT_EVE'  → MUTATES that iteration: eve_present = False
 *   get_iteration(room)    → E91Iteration.objects.get(room=room)  ← .get() raises
 *                            if a room ever had two
 *
 * So an E91 room holds **one iteration for its whole life**, and a restart
 * overwrites it instead of appending. Three consequences live in this file:
 *
 * 1. **No Itération column.** It could only ever print "1". The previous
 *    developer removed it for this reason in Nov 2024 (`64dc201`) — correctly,
 *    though nobody wrote down why, so it was nearly re-added in Sept 2026.
 *    Restoring solo's round counter here needs the backend to create an
 *    iteration per restart → tracked with Task 28.
 *
 * 2. **`deriveRoomEveStory` must NOT be used here.** BB84's classifier infers
 *    detection POSITIONALLY — "Eve in an earlier iteration but not the last ⇒
 *    caught" — which needs several iterations. Fed E91's single mutated one it
 *    reports "Eve was never present" for a student who actually caught her.
 *
 * 3. **`drawn` ORs the two fields.** After a detection the backend leaves
 *    `eve_present=false, eve_detected=true`, so `eve_present` alone made this
 *    table print "Ève présente: No · Ève détectée: Yes" — she was never there
 *    and you caught her. `eve_present || eve_detected` recovers what the
 *    mutation erased.
 *
 * With those two facts the room's ending is the SAME question solo asks, so it
 * goes through the SAME shared classifier (`lib/eve-story.ts`) and prints the
 * same verdict vocabulary — not a second copy of the rule.
 */

import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';
import {classifySoloEnding} from '@/lib/eve-story';

interface E91ResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const E91ResultsRow = ({room, player1, player2}: E91ResultsRowProps) => {
    const {localize} = useLanguage();

    // `?? []` because a room with no iterations reached this component and
    // threw; BB84's row has guarded it since Task 56.
    const iterations: any[] = room.iterations ?? [];

    // `.some` rather than reading `iterations[0]`: correct for the single
    // iteration the backend keeps today, and still correct on the day it can
    // append one per restart. Nothing here assumes the count.
    const drawn = iterations.some(
        ({eve_present, eve_detected}: any) => !!eve_present || !!eve_detected);
    const detected = iterations.some(({eve_detected}: any) => !!eve_detected);

    const keyCompromised = classifySoloEnding({drawn, detected}) === 'missed';

    const yesNo = (value: boolean) => localize(value
        ? 'component.e91.results.yes' : 'component.e91.results.no');

    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{yesNo(drawn)}</TableCell>
            <TableCell>{yesNo(detected)}</TableCell>
            <TableCell className={keyCompromised
                ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                {localize(keyCompromised
                    ? 'component.results.keyCompromised'
                    : 'component.results.keySecure')}
            </TableCell>
            {/* Time and score stay per-iteration lists: they are measurements,
                not a story, and one <p> per iteration is how BB84 renders
                them too. */}
            <TableCell>{iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(
                    elapsed_time)}`}</p>)}</TableCell>
            <TableCell>{iterations.map(
                ({score}: any, index: number) => <p
                    key={index}>{`${Math.ceil(
                    score)}`}</p>)}</TableCell>
        </TableRow>
    );
};

export default E91ResultsRow;

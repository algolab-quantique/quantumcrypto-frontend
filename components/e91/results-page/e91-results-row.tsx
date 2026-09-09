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
 * overwrites it instead of appending. Two consequences:
 *
 * 1. **No Itération column** — it could only ever print "1". The previous
 *    developer removed it for this reason in Nov 2024 (`64dc201`), correctly,
 *    but nobody wrote down why, so it was nearly re-added in Sept 2026.
 *    Restoring solo's round counter here needs the backend to create an
 *    iteration per restart → **Task 28**.
 *
 * 2. **How the flags must be read is NOT decided here.** `deriveRoomEnding`
 *    (`lib/eve-story.ts`) owns it, is unit-tested, and its docstring carries
 *    the reasoning — including why `deriveRoomEveStory`, BB84's positional
 *    classifier, gives the wrong answer for E91. This file only displays.
 */

import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';
import {deriveRoomEnding} from '@/lib/eve-story';

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

    const ending = deriveRoomEnding(iterations);

    // The two flags the columns show are the two the ending was built from, so
    // they are read back OUT of it rather than re-derived here. Recomputing
    // `eve_present || eve_detected` in this file is how the rule would end up
    // living in two places and drifting — the defect this whole task exists to
    // stop. classifySoloEnding's definition makes the inverse exact:
    // absent = not drawn · caught = drawn + detected · missed = drawn, missed.
    const drawn = ending !== 'absent';
    const detected = ending === 'caught';
    const keyCompromised = ending === 'missed';

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

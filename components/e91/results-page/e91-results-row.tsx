/**
 * One room's line in the E91 multiplayer leaderboard — the same columns and the
 * same Eve story as the solo table (Task 63 Step 6d).
 *
 * No Itération column: E91's backend keeps ONE iteration per room and a restart
 * overwrites it, so the column could only ever print "1". It was removed for
 * that reason in Nov 2024 (`64dc201`) and must stay out until Task 28.
 */

import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';
import {classifySoloEnding, deriveRoomEveRecord} from '@/lib/eve-story';

interface E91ResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const E91ResultsRow = ({room, player1, player2}: E91ResultsRowProps) => {
    const {localize} = useLanguage();

    const iterations: any[] = room.iterations ?? [];

    // Same two steps the solo table takes, over the same shared classifier.
    const eveRecord = deriveRoomEveRecord(iterations);
    const keyCompromised = classifySoloEnding(eveRecord) === 'missed';

    const yesNo = (value: boolean) => localize(value
        ? 'component.e91.results.yes' : 'component.e91.results.no');

    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{yesNo(eveRecord.drawn)}</TableCell>
            <TableCell>{yesNo(eveRecord.detected)}</TableCell>
            <TableCell className={keyCompromised
                ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                {localize(keyCompromised
                    ? 'component.results.keyCompromised'
                    : 'component.results.keySecure')}
            </TableCell>
            <TableCell>{iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(elapsed_time)}`}</p>)}</TableCell>
            <TableCell>{iterations.map(
                ({score}: any, index: number) => <p
                    key={index}>{`${Math.ceil(score)}`}</p>)}</TableCell>
        </TableRow>
    );
};

export default E91ResultsRow;

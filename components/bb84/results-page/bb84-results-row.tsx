import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';
import {deriveRoomEveStory} from '@/lib/bb84/eve-story';

interface Bb84ResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const Bb84ResultsRow = ({room, player1, player2}: Bb84ResultsRowProps) => {
    const {localize} = useLanguage();

    // Task 56 — the Eve story is derived from the iterations by the pure,
    // fully unit-tested deriveRoomEveStory (lib/bb84/eve-story.ts).
    const iterations: any[] = room.iterations ?? [];
    const {eveDetected, keyCompromised} = deriveRoomEveStory(iterations);

    const yesNo = (value: boolean) => localize(value
        ? 'component.bb84.results.yes' : 'component.bb84.results.no');

    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{iterations.map(
                (_: any, index: number) => <p key={index}>{index +
                    1}</p>)}</TableCell>
            <TableCell>{iterations.map(
                ({eve_present}: any, index: number) => <p
                    key={index}>{yesNo(!!eve_present)}</p>)}</TableCell>
            <TableCell>{yesNo(eveDetected)}</TableCell>
            <TableCell className={keyCompromised
                ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                {localize(keyCompromised
                    ? 'component.bb84.results.keyCompromised'
                    : 'component.bb84.results.keySecure')}
            </TableCell>
            <TableCell>{iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(
                    elapsed_time)} s`}</p>)}</TableCell>
        </TableRow>
    );
};

export default Bb84ResultsRow;

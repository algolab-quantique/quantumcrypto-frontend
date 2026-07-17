import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';

interface Bb84ResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const Bb84ResultsRow = ({room, player1, player2}: Bb84ResultsRowProps) => {
    const {localize} = useLanguage();

    // Task 56 — derive the Eve story from the iterations (no backend change):
    // the ONLY thing that removes Eve mid-game is the coordinated
    // Eve-detected restart, which starts a new iteration without her. So:
    // - an eve_present iteration followed by a later one => she was CAUGHT;
    // - the LAST iteration eve_present => completed with her listening
    //   (key compromised — the same "missed" ending as the solo reveal);
    // - never present => key secure.
    const iterations: any[] = room.iterations ?? [];
    const lastIteration = iterations[iterations.length - 1];
    const anyEve = iterations.some(({eve_present}: any) => eve_present);
    const lastHadEve = !!lastIteration?.eve_present;
    const eveDetected = anyEve && !lastHadEve;
    const keyCompromised = lastHadEve;

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

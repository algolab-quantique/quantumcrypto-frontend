import React from 'react';
import {TableCell, TableRow} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';

interface DPSResultsRowProps {
    room: any;
    player1: string;
    player2: string;
}

const DPSResultsRow = ({room, player1, player2}: DPSResultsRowProps) => {
    const {localize} = useLanguage();

    return (
        <TableRow>
            <TableCell>{`${player1} - ${player2}`}</TableCell>
            <TableCell>{room.iterations.map(
                (_: any, index: number) => <p key={index}>{index + 1}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({eve_present}: any, index: number) => <p
                    key={index}>{eve_present
                        ? localize('component.e91.results.yes')
                        : localize('component.e91.results.no')}</p>)}</TableCell>
            <TableCell>{room.iterations.map(
                ({elapsed_time}: any, index: number) => <p
                    key={index}>{`${Math.ceil(elapsed_time)}`}</p>)}</TableCell>
        </TableRow>
    );
};

export default DPSResultsRow;

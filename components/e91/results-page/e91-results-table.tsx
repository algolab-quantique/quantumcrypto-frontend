import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import E91ResultsRow from '@/components/e91/results-page/e91-results-row';
import { useLanguage } from '@/components/providers/language-provider';

interface ResultsTableProps {
    rooms: any[];
    players: any[];
}

const E91ResultsTable = ({rooms, players}: ResultsTableProps) => {

    const {localize} = useLanguage();

    const getPlayerName = (playerId: number) => {
        return players.filter(player => player.id === playerId)[0]?.name;
    };

    const sortRooms = () => {
        return rooms.sort((a, b) => {
            const shortestA = Math.min(...a.iterations.map((iter: any) => iter.elapsed_time));
            const shortestB = Math.min(...b.iterations.map((iter: any) => iter.elapsed_time));
            return shortestA - shortestB;
        });
    }

    return (
        <div
            className="mt-4 block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table>
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg">
                        {/* Solo's columns, minus the two the backend cannot
                            supply: Itération (one iteration per room — see
                            e91-results-row.tsx) and Longueur de clé (no such
                            field on E91Iteration). Both need Task 28. */}
                        <TableHead>{localize('component.e91.results.room')}</TableHead>
                        <TableHead>{localize('component.e91.results.evePresent')}</TableHead>
                        <TableHead>{localize('component.e91.results.eveDetected')}</TableHead>
                        <TableHead>{localize('component.results.verdict')}</TableHead>
                        <TableHead>{localize('component.e91.results.time') + ' (s)'}</TableHead>
                        <TableHead>{localize('component.e91.results.score')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortRooms().map((room, index) => <E91ResultsRow key={index}
                                                                room={room}
                                                                player1={getPlayerName(
                                                                    room.player1)}
                                                                player2={getPlayerName(
                                                                    room.player2)}/>)}
                </TableBody>
            </Table>
            {rooms.length === 0 && <p className='font-bold text-lg text-center py-2'>No rooms have finished playing yet</p>}
        </div>
    );
};

export default E91ResultsTable;
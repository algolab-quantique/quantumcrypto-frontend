import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import DPSResultsRow from '@/components/dps/results-page/dps-results-row';
import {useLanguage} from '@/components/providers/language-provider';

interface ResultsTableProps {
    rooms: any[];
    players: any[];
}

const DPSResultsTable = ({rooms, players}: ResultsTableProps) => {

    const {localize} = useLanguage();

    const getPlayerName = (playerId: number) => {
        const player = players.filter(player => player.id === playerId)[0];
        return player?.name || `Unknown-${playerId}`;
    };

    const sortRooms = () => {
        return rooms.sort((a, b) => {
            const shortestA = Math.min(...a.iterations.map((iter: any) => iter.elapsed_time));
            const shortestB = Math.min(...b.iterations.map((iter: any) => iter.elapsed_time));
            return shortestA - shortestB;
        });
    };

    return (
        <div
            className="mt-4 block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table>
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg">
                        <TableHead>{localize('component.e91.results.room')}</TableHead>
                        <TableHead>{localize('component.results.iteration')}</TableHead>
                        <TableHead>{localize('component.e91.results.evePresent')}</TableHead>
                        <TableHead>{localize('component.e91.results.time') + ' (s)'}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortRooms().map((room, index) => <DPSResultsRow key={index}
                        room={room}
                        player1={getPlayerName(room.player1)}
                        player2={getPlayerName(room.player2)}/>)}
                </TableBody>
            </Table>
            {rooms.length === 0 && <p className='font-bold text-lg text-center py-2'>No rooms have finished playing yet</p>}
        </div>
    );
};

export default DPSResultsTable;

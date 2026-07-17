import React from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Bb84ResultsRow from '@/components/bb84/results-page/bb84-results-row';

interface ResultsTableProps {
    rooms: any[];
    players: any[];
}

const Bb84ResultsTable = ({rooms, players}: ResultsTableProps) => {
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
    }
    
    // 🔍 DEBUG: Log rendering info
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎮 BB84 RESULTS TABLE RENDERING:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Rooms to Display:', rooms.length);
    console.log('Players Available for Lookup:', players.length);
    
    // Extract all player IDs from rooms
    const playerIdsInRooms = new Set<number>();
    rooms.forEach(room => {
        playerIdsInRooms.add(room.player1);
        playerIdsInRooms.add(room.player2);
    });
    console.log('Unique Players in Rooms:', playerIdsInRooms.size);
    console.log('Player IDs in Rooms:', Array.from(playerIdsInRooms));
    
    // Find players NOT in any room
    const allPlayerIds = players.map(p => p.id);
    const unpairedPlayerIds = allPlayerIds.filter(id => !playerIdsInRooms.has(id));
    console.log('Unpaired Players:', unpairedPlayerIds.length);
    if (unpairedPlayerIds.length > 0) {
        console.log('Unpaired Player IDs:', unpairedPlayerIds);
        console.log('Unpaired Players Details:', 
            players.filter(p => unpairedPlayerIds.includes(p.id)));
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return (
        <div
            className="mt-4 block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table>
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg">
                        {/* Task 56: localized headers reusing the solo
                            results keys (same dictionary on this route) +
                            the derived Eve story (detected + verdict) so
                            multi tells the same story as solo. */}
                        <TableHead>{localize('component.bb84.results.room')}</TableHead>
                        <TableHead>{localize('component.results.iteration')}</TableHead>
                        <TableHead>{localize('component.bb84.results.evePresent')}</TableHead>
                        <TableHead>{localize('component.bb84.results.eveDetected')}</TableHead>
                        <TableHead>{localize('component.bb84.results.verdict')}</TableHead>
                        <TableHead>{localize('component.bb84.results.time')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortRooms().map((room, index) => <Bb84ResultsRow key={index}
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

export default Bb84ResultsTable;
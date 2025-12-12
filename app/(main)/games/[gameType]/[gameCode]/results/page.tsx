'use client';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Bb84ResultsTable
    from '@/components/bb84/results-page/bb84-results-table';
import axios from '@/commons/http';
import { useRouter } from 'next/navigation';
import E91ResultsTable from '@/components/e91/results-page/e91-results-table';
import usePlayerStore from '@/store/player-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw } from 'lucide-react';


interface ResultsTableProps {
    gameType: string,
    rooms: any[],
    players: any[]
}

const ResultsTable = ({
    gameType,
    rooms,
    players,
    ...props
}: ResultsTableProps) => {

    // 🔍 DEBUG: Log filtering logic
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 RESULTS TABLE FILTERING:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Game Type:', gameType);
    console.log('Rooms Before Filter:', rooms.length);
    console.log('Players Available:', players.length);

    switch (gameType) {
        case 'bb84':
            const filteredBB84Rooms = rooms.filter(room => {
                const hasFinishedIteration = room.iterations.some(
                    (iter: any) => iter.elapsed_time > 0);
                console.log(`Room [${room.player1}-${room.player2}]:`,
                    hasFinishedIteration ? '✅ FINISHED' : '❌ NOT FINISHED',
                    `(${room.iterations.length} iterations)`);
                return hasFinishedIteration;
            });

            console.log('Rooms After Filter:', filteredBB84Rooms.length);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            return <Bb84ResultsTable rooms={filteredBB84Rooms}
                players={players} {...props} />;
            break;
        case 'e91':
            const filteredE91Rooms = rooms.filter(room => {
                const hasFinishedIteration = room.iterations.some(
                    (iter: any) => iter.elapsed_time > 0);
                console.log(`Room [${room.player1}-${room.player2}]:`,
                    hasFinishedIteration ? '✅ FINISHED' : '❌ NOT FINISHED',
                    `(${room.iterations.length} iterations)`);
                return hasFinishedIteration;
            });

            console.log('Rooms After Filter:', filteredE91Rooms.length);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            return <E91ResultsTable rooms={filteredE91Rooms}
                players={players} {...props} />;
            break;
        default:
            return null;
    }
};

interface GameResultsPageProps {
    params: {
        gameType: string;
        gameCode: string;
    };
}

const GameResultsPage = ({ params }: GameResultsPageProps) => {

    const [error, setError] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [players, setPlayers] = useState([]);
    const [gameType, setGameType] = useState('');
    const router = useRouter();
    const { playerName, isAdmin } = usePlayerStore();
    const { localize } = useLanguage();


    const { lastMessage, readyState } = useWebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${params.gameType}/${params.gameCode}/results/`,
        {
            onOpen: () => {
                console.log('Connection opened');
                setError(false);
            },
            onError: (_) => setError(true),
            onMessage: async (event) => {
                const data = await JSON.parse(
                    (await JSON.parse(event.data)).payload.message);

                // 🔍 DEBUG: Log WebSocket data
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📊 WEBSOCKET RESULTS RECEIVED:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Game Type:', data.game_type);
                console.log('Total Rooms Received:', data.rooms?.length || 0);
                console.log('Rooms Data:', data.rooms);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

                setRooms(data.rooms);
                setGameType(data.game_type);
                setError(false);
            },
        });

    useEffect(() => {
        const getPlayers = async () => {
            try {
                const { data } = await axios.get(`/players`, {
                    params: {
                        game_code: params.gameCode,
                    },
                });

                // 🔍 DEBUG: Log players data
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('👥 PLAYERS API RESPONSE:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Total Players Received:', data.length);
                console.log('Players List:', data);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

                setPlayers(data);
            } catch (e) {
                setError(true);
            }
        };
        getPlayers();
    }, [lastMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    // Navigate to game home page (e91, bb84, etc.)
    const handleReplay = () => {
        router.replace(`/${params.gameType}`);
    };

    // Navigate to main home page
    const handleHomeMenu = () => {
        router.replace('/');
    };

    // Check if any rooms have finished playing
    const hasFinishedRooms = rooms.some(room =>
        room.iterations?.some((iter: any) => iter.elapsed_time > 0)
    );

    if (connectionStatus === 'Connecting') return null;

    if (error || connectionStatus === 'Closed') {
        router.replace('/');
    }

    if (!gameType) return null;

    return (
        <div className="mt-5 p-4 space-y-6">
            <h1 className="text-center text-3xl font-bold">
                {localize('component.results.title') || 'Results for game'}{' '}
                <span className="text-highlight">{params.gameCode}</span>
            </h1>
            {gameType === 'dps' && isAdmin ? (
                <h1 className="text-3xl font-bold text-center mt-10">
                    La partie est en cours...
                </h1>
            ) : (
                <>
                    <ResultsTable gameType={gameType} rooms={rooms} players={players} />

                    {/* Admin (Game Monitor) View - Show waiting message when no results yet */}
                    {isAdmin && !hasFinishedRooms && (
                        <div className="text-center">
                            <p className="text-xl text-yellow-500 font-bold">
                                {localize('component.results.waiting') || '⏳ Waiting for players to finish their games...'}
                            </p>
                        </div>
                    )}

                    {/* Success Message - Only show when games are finished */}
                    {hasFinishedRooms && (
                        <div className="text-center">
                            <p className="text-xl text-green-500 font-bold">
                                {isAdmin
                                    ? (localize('component.results.gamesFinished') || '✅ Some games have finished!')
                                    : (localize('component.e91.results.success') || '🎉 Congratulations! Game completed successfully!')}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={handleReplay}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            {localize('component.e91.results.replay') || 'Play Again'}
                        </Button>
                        <Button onClick={handleHomeMenu}>
                            <Home className="mr-2 h-4 w-4" />
                            {localize('component.e91.results.home') || 'Main Menu'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );

};

export default GameResultsPage;
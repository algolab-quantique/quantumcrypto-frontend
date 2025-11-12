'use client';
import React, {useEffect, useState} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import Bb84ResultsTable
    from '@/components/bb84/results-page/bb84-results-table';
import axios from '@/commons/http';
import {useRouter} from 'next/navigation';
import E91ResultsTable from '@/components/e91/results-page/e91-results-table';
import usePlayerStore from '@/store/player-store';


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
    switch (gameType) {
        case 'bb84':
            return <Bb84ResultsTable rooms={rooms.filter(room => {
                return room.iterations.some(
                    (iter: any) => iter.elapsed_time > 0);
            })}
                                     players={players} {...props} />;
            break;
        case 'e91':
            return <E91ResultsTable rooms={rooms.filter(room => {
                return room.iterations.some(
                    (iter: any) => iter.elapsed_time > 0);
            })}
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

const GameResultsPage = ({params}: GameResultsPageProps) => {

    const [error, setError] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [players, setPlayers] = useState([]);
    const [gameType, setGameType] = useState('');
    const router = useRouter();
    const {playerName, isAdmin} = usePlayerStore();


    const {lastMessage, readyState} = useWebSocket(
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
                setRooms(data.rooms);
                setGameType(data.game_type);
                setError(false);
            },
        });

    useEffect(() => {
        const getPlayers = async () => {
            try {
                const {data} = await axios.get(`/players`, {
                    params: {
                        game_code: params.gameCode,
                    },
                });
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

    if (connectionStatus === 'Connecting') return null;

    if (error || connectionStatus === 'Closed') {
        router.replace('/');
    }

    if (!gameType) return null;

    return (
        <div className="mt-5">
            <h1 className="text-center text-3xl font-bold">Results for
                game <span className="text-highlight">{params.gameCode}</span>
            </h1>
            {gameType === 'dps' && isAdmin ? (
                 <h1 className="text-3xl font-bold text-center mt-10">
                 La partie est en cours...
               </h1>
            ) : (
                <ResultsTable gameType={gameType} rooms={rooms} players={players} />
            )}
        </div>
    );

};

export default GameResultsPage;
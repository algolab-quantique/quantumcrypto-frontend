'use client';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Bb84ResultsTable
    from '@/components/bb84/results-page/bb84-results-table';
import axios from '@/commons/http';
import { useRouter } from 'next/navigation';
import E91ResultsTable from '@/components/e91/results-page/e91-results-table';
import DPSResultsTable from '@/components/dps/results-page/dps-results-table';
import usePlayerStore from '@/store/player-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Home, RotateCcw } from 'lucide-react';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import { clearE91LocalStorage } from '@/lib/e91/utils';
import { useSocket } from '@/components/providers/socket-provider';
import { abandon } from '@/lib/protocol-lifecycle/lifecycle';
import { bb84Adapter } from '@/lib/protocol-lifecycle/bb84-adapter';
import { classifySoloEnding, deriveRoomEveRecord } from '@/lib/eve-story';


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
        case 'dps':
            const filteredDPSRooms = rooms.filter(room => {
                const hasFinishedIteration = room.iterations.some(
                    (iter: any) => iter.elapsed_time > 0);
                console.log(`Room [${room.player1}-${room.player2}]:`,
                    hasFinishedIteration ? '✅ FINISHED' : '❌ NOT FINISHED',
                    `(${room.iterations.length} iterations)`);
                return hasFinishedIteration;
            });

            console.log('Rooms After Filter:', filteredDPSRooms.length);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            return <DPSResultsTable rooms={filteredDPSRooms}
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
    const { playerId, isAdmin } = usePlayerStore();
    const { localize } = useLanguage();
    const { disconnectPlayRoom } = useSocket();


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
    const shouldRedirectHome = error || readyState === ReadyState.CLOSED;

    useEffect(() => {
        if (shouldRedirectHome) {
            router.replace('/');
        }
    }, [shouldRedirectHome, router]);

    // Navigate to game home page (e91, bb84, etc.)
    const handleReplay = () => {
        disconnectPlayRoom();
        // Don't clear localStorage here — e91GameData.gameSuccess=true
        // serves as a signal for the form page to clean up properly
        router.replace(`/${params.gameType}`);
    };

    // Navigate to main home page
    const handleHomeMenu = () => {
        disconnectPlayRoom();
        // Clean up the completed game's localStorage based on protocol
        if (params.gameType === 'bb84') {
            abandon(bb84Adapter);
        } else {
            if (params.gameType === 'dps') {
                clearDPSLocalStorage();
            } else if (params.gameType === 'e91') {
                clearE91LocalStorage();
            }
            usePlayerStore.getState().setPlayingSolo(false);
            usePlayerStore.getState().setPlayingMultiplayer(false);
        }
        router.replace('/');
    };

    // Check if any rooms have finished playing
    const hasFinishedRooms = rooms.some(room =>
        room.iterations?.some((iter: any) => iter.elapsed_time > 0)
    );

    // The closing sentence, the same three solo shows (Task 56). This page used
    // to celebrate EVERY finished game, including one Eve had listened to
    // undetected — the defect Step 6b removed from solo, still alive here
    // because the message belongs to the shared page, not the protocol.
    //
    // Which row is the player's: `playerId` is numeric and so are the rooms'
    // `player1`/`player2`, so ownership is an exact match. It must also have
    // FINISHED — `hasFinishedRooms` is true as soon as ANY room in the class is
    // done, and the waiting room routes here too.
    const myRoom = rooms.find(room =>
        (room.player1 === playerId || room.player2 === playerId) &&
        room.iterations?.some((iter: any) => iter.elapsed_time > 0));

    const eveRecord = deriveRoomEveRecord(myRoom?.iterations ?? []);
    const ending = classifySoloEnding(eveRecord);
    const keyCompromised = ending === 'missed';
    const revealKey = {
        absent: 'component.results.revealAbsent',
        caught: 'component.results.revealCaught',
        missed: 'component.results.revealMissed',
    }[ending];

    // No room of one's own (a monitor, or a visitor whose playerId was never
    // set) → keep the neutral message rather than announce "Eve was absent"
    // about a game we know nothing about.
    //
    // ⚠️ DPS gets this sentence too and cannot yet earn it: its iterations have
    // no `eve_detected` because it has no detection mechanic, so a DPS game
    // with Eve always reads "missed". True, but only because catching her is
    // impossible. Left deliberately (Ibra, 2026-09-09) — Task 38 fixes it here
    // with no change to this file.
    const showReveal = !isAdmin && myRoom !== undefined;

    if (connectionStatus === 'Connecting') return null;

    if (shouldRedirectHome) return null;

    if (!gameType) return null;

    return (
        <div className="mt-5 p-4 space-y-6">
            <h1 className="text-center text-3xl font-bold">
                {/* Names the protocol and the mode, like the solo
                    titles do; gameType comes from the backend payload and the
                    page renders nothing until it arrives. */}
                {localize(`component.${gameType}.results.titleMulti`)}{' '}
                <span className="text-highlight">{params.gameCode}</span>
            </h1>
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

                {/* The reveal — one sentence per ending, the same three the
                    solo results pages show, from the same keys. Only the
                    celebration is earned now; it used to be unconditional. */}
                {hasFinishedRooms && (
                    <div className="text-center">
                        {showReveal ? (
                            <p className={`text-xl font-bold ${keyCompromised
                                ? 'text-red-500' : 'text-green-500'}`}>
                                {localize(revealKey)}
                            </p>
                        ) : (
                            <p className="text-xl text-green-500 font-bold">
                                {isAdmin
                                    ? localize('component.results.gamesFinished')
                                    : localize('component.results.gameSuccess')}
                            </p>
                        )}
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
        </div>
    );

};

export default GameResultsPage;

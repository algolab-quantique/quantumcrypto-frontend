'use client';

import E91Progression from '@/components/e91/play-page/e91-progression';
import BasisTab from '@/components/e91/play-page/tabs/basis-tab';
import MeasurementTab from '@/components/e91/play-page/tabs/measurement-tab';
import MessagingTab from '@/components/e91/play-page/tabs/messaging-tab';
import ValidationTab from '@/components/e91/play-page/tabs/validation-tab';
import isConnected from '@/components/hoc/is-connected';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import useE91GameStore from '@/store/e91/e91-game-store';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import usePlayerStore from '@/store/player-store';
import {
    Minus,
    Tally1, Tally2, Tally3, Tally4,
} from 'lucide-react';

import { useEffect, useRef } from 'react';
import CHSHTab from './tabs/CHSH-tab';


const Game = () => {

    const hasInitialized = useRef(false);

    const polarIcons =

        [   // eslint-disable-next-line react/jsx-key
            <Minus />,
            // eslint-disable-next-line react/jsx-key
            <span style={{ fontSize: "24px" }}>a</span>,
            // eslint-disable-next-line react/jsx-key
            <span style={{ fontSize: "24px" }}>b</span>,
            // eslint-disable-next-line react/jsx-key
            <span style={{ fontSize: "24px" }}>a&apos;</span>,
            // eslint-disable-next-line react/jsx-key
            <span style={{ fontSize: "24px" }}>b&apos;</span>
        ];

    const { localize } = useLanguage();
    const { step, displayedLines, e91Tab } = useE91ProgressStore();
    const { pushLines, setE91Tab, setStep, setDisplayedLines } = useE91ProgressStore();
    const { playerRole, playerName, playingMultiplayer, setPlayingMultiplayer } = usePlayerStore();
    const { photonNumber, gameHasEve, setPhotonNumber, setGameHasEve, setGameCode } = useE91GameStore();
    const { utilizeValidBits, restoreGame } = useE91RoomStore();
    const { isPlayRoomConnected, connectToPlayRoom } = useSocket();

    // Restore game state from localStorage on mount (for page refresh)
    // AND reconnect WebSocket if needed
    useEffect(() => {
        // Prevent running twice (React StrictMode)
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        // If we have a multiplayer session but WebSocket is disconnected, try to restore
        if (playingMultiplayer && !isPlayRoomConnected) {
            // Restore E91 game data
            const gameData = getItem('e91GameData');

            if (gameData) {
                restoreGame(gameData);
            }

            // Restore progress (step, tab)
            const savedStep = getItem('e91Step');
            if (savedStep !== null) {
                setStep(savedStep);
            }

            const savedTab = localStorage.getItem('e91Tab');
            if (savedTab) {
                setE91Tab(savedTab);
            }

            // Restore displayed lines
            const savedLines = getItem('e91DisplayedLines');
            if (savedLines && savedLines.length > 0) {
                setDisplayedLines(savedLines);
            }

            // Restore game config
            const savedPhotonNumber = getItem('e91PhotonNumber');
            if (savedPhotonNumber) {
                setPhotonNumber(savedPhotonNumber);
            }

            // Restore player identity and reconnect WebSocket if needed
            const playerData = getItem('e91PlayerData');
            if (playerData && playerData.gameCode && playerData.role && playerData.room) {
                setGameCode(playerData.gameCode);
                // Restore player role and partner from saved data
                if (playerData.role) {
                    usePlayerStore.getState().setPlayerRole(playerData.role);
                }
                if (playerData.partner) {
                    usePlayerStore.getState().setPartner(playerData.partner);
                }
                if (playerData.playerName) {
                    usePlayerStore.getState().setPlayerName(playerData.playerName);
                }
                if (playerData.gameHasEve !== undefined) {
                    setGameHasEve(playerData.gameHasEve);
                }

                // Only reconnect WebSocket if game is still in progress.
                // Completed games restore the félicitations screen locally —
                // the user navigates to results explicitly via "Voir les résultats".
                if (!gameData?.gameSuccess) {
                    connectToPlayRoom('e91', playerData.gameCode, playerData.role, playerData.room);
                }
            } else {
                // No valid session data, reset multiplayer flag
                setPlayingMultiplayer(false);
            }
        } else if (displayedLines.length === 0) {
            // Normal initialization - show welcome messages
            if (playerRole === 'A' || playerRole === 'B') {
                pushLines([
                    {
                        title: 'component.e91.measurement.welcome',
                    },
                    {
                        title: 'component.game.step1',
                        content: 'component.e91.measurement.start',
                    },
                ]);
            }
        }
    }, []);

    return (
        <div
            className="block md:flex w-full h-full p-2 overflow-hidden">
            {playerRole === 'S' ?
                <div className="w-fit m-auto"><p
                    className="font-bold text-xl">{localize(
                        'component.bb84.play.sorry')}</p>
                </div> : <>
                    <div
                        className="w-full md:w-[50%] h-full flex flex-col mr-1">
                        <p className="font-bold text-xl md:text-3xl text-foreground px-4 py-3">{playerName}, {localize(
                            'component.game.playerHeader')} <span
                                className="text-highlight">{playerRole === 'A' ?
                                    'Alice' : 'Bob'}</span></p>
                        <Tabs
                            className="overflow-y-auto max-h-[92%] rounded-lg"
                            value={e91Tab}
                            onValueChange={(value) => setE91Tab(value)}>
                            <TabsList className={cn('w-full grid sticky h-fit',
                                gameHasEve ? 'grid-cols-4' : 'grid-cols-3')}>
                                <TabsTrigger value={'measurement'}><p
                                    className={'text-wrap text-md md:text-lg'}>{localize(
                                        'component.e91.measurement.tab')}</p></TabsTrigger>
                                <TabsTrigger value={'basis'}
                                    disabled={step < 1}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize(
                                        'component.game.tabs2')}</p>
                                </TabsTrigger>
                                {gameHasEve && <TabsTrigger
                                    disabled={step < 2}
                                    value={'validation'}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize(
                                        'component.game.tabValidation')}</p>
                                </TabsTrigger>}
                                <TabsTrigger value={'messaging'}
                                    disabled={step < 3}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize(
                                        'component.game.tabs3')}</p>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value={'measurement'}>
                                <MeasurementTab photonNumber={photonNumber} polarIcons={polarIcons} playerRole={playerRole} />
                            </TabsContent>
                            <TabsContent value={'basis'}>
                                <BasisTab photonNumber={photonNumber} playerRole={playerRole} polarIcons={polarIcons} />
                            </TabsContent>
                            {gameHasEve && <TabsContent value={'validation'}>
                                {utilizeValidBits ? <ValidationTab playerRole={playerRole} /> : <CHSHTab playerRole={playerRole} polarIcons={polarIcons} />}
                            </TabsContent>}
                            <TabsContent value={'messaging'}>
                                <MessagingTab playerRole={playerRole} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div
                        className="hidden md:block md:w-[50%] md:h-full md:ml-1">
                        <E91Progression />
                    </div>
                </>}
        </div>
    );
};

export default isConnected(Game);
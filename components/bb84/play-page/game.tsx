'use client';

/**
 * BB84 Game Container
 * 
 * NOTE: Unlike E91 and DPS, this single component handles both solo and multiplayer modes.
 * The child tab components (e.g. AliceExchangeTab, BobExchangeTab) conditionally branch
 * based on the `playingSolo` flag.
 * 
 * TODO: In the future, this file should be split into `solo-game.tsx` and `multi-game.tsx`
 * to align with the E91 and DPS protocols, separating concerns and lifecycles cleanly.
 * (See Task 25 in tasks_todo.md)
 */


import React, {useEffect, useRef, useCallback} from 'react';
import usePlayerStore from '@/store/player-store';
import AliceExchangeTab
    from '@/components/bb84/play-page/tabs/alice-exchange-tab';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {useLanguage} from '@/components/providers/language-provider';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import BobExchangeTab from '@/components/bb84/play-page/tabs/bob-exchange-tab';
import {
    Minus,
    MoveHorizontal, MoveDiagonal2, MoveDiagonal, MoveVertical,
} from 'lucide-react';
import GameProgression from '@/components/shared/game-progression';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import BasisTab from '@/components/bb84/play-page/tabs/basis-tab';
import MessagingTab from '@/components/bb84/play-page/tabs/messaging-tab';
import isConnected from '@/components/hoc/is-connected';
import ValidationTab from '@/components/bb84/play-page/tabs/validation-tab';
import {cn} from '@/lib/utils';
import Bb84Progression from '@/components/bb84/play-page/bb84-progression';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import { usePreventNavigation } from '@/hooks/use-prevent-navigation';
import { clearBB84LocalStorage } from '@/lib/bb84/utils';


const Game = () => {
    // Track if we've already restored/initialized to prevent duplicate messages
    const hasInitialized = useRef(false);

    const polarIcons =

        [
            // eslint-disable-next-line react/jsx-key
            <Minus/>, <MoveHorizontal/>, <MoveVertical/>, <MoveDiagonal/>,
            // eslint-disable-next-line react/jsx-key
            <MoveDiagonal2/>];

    const {localize} = useLanguage();
    const {step, displayedLines, bb84Tab} = useBB84ProgressStore();
    const {pushLines, setBb84Tab, setStep, setDisplayedLines} = useBB84ProgressStore();
    const {playerRole, playerName} = usePlayerStore();
    const {photonNumber, gameHasEve, setPhotonNumber, setGameHasEve, setValidationBitsLength} = useBB84GameStore();
    const {restoreGame, gameSuccess} = useBB84RoomStore();

    const handleNavCleanup = useCallback(() => {
        clearBB84LocalStorage();
        usePlayerStore.getState().setPlayingSolo(false);
        usePlayerStore.getState().setPlayingMultiplayer(false);
    }, []);

    // Prevent navigation mid-game (warn user on browser back/close/refresh)
    usePreventNavigation(!gameSuccess, handleNavCleanup);

    // Restore game state from localStorage on mount (for page refresh)
    // AND initialize welcome messages if no saved state exists
    useEffect(() => {
        // Prevent running twice (React StrictMode)
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        // Restore BB84 game data
        const gameData = getItem('bb84GameData');
        if (gameData) {
            restoreGame(gameData);
        }

        // Restore progress (step, tab)
        const savedStep = getItem('bb84Step');
        if (savedStep !== null) {
            setStep(savedStep);
        }

        const savedTab = localStorage.getItem('bb84Tab');
        if (savedTab) {
            setBb84Tab(savedTab);
        }

        // Restore displayed lines OR show welcome messages
        const savedLines = getItem('bb84DisplayedLines');
        if (savedLines && savedLines.length > 0) {
            setDisplayedLines(savedLines);
        } else {
            // No saved lines - show welcome messages
            if (playerRole === 'A') {
                pushLines([
                    {
                        title: 'component.exchange.welcome',
                    },
                    {
                        title: 'component.game.step1',
                        content: 'component.aliceExchange.start',
                    },
                ]);
            } else if (playerRole === 'B') {
                pushLines([
                    {
                        title: 'component.exchange.welcome',
                    },
                    {
                        content: 'component.bobExchange.waiting',
                    },
                ]);
            }
        }

        // Restore game config
        const savedPhotonNumber = getItem('bb84PhotonNumber');
        if (savedPhotonNumber) {
            setPhotonNumber(savedPhotonNumber);
        }

        const savedGameHasEve = getItem('bb84GameHasEve');
        if (savedGameHasEve !== null) {
            setGameHasEve(savedGameHasEve);
        }

        const savedValidationBitsLength = getItem('bb84ValidationBitsLength');
        if (savedValidationBitsLength) {
            setValidationBitsLength(savedValidationBitsLength);
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
                            value={bb84Tab}
                            onValueChange={(value) => setBb84Tab(value)}>
                            <TabsList className={cn('w-full grid sticky h-fit',
                                gameHasEve ? 'grid-cols-4' : 'grid-cols-3')}>
                                <TabsTrigger value={'exchange'}><p
                                    className={'text-wrap text-md md:text-lg'}>{localize(
                                    'component.game.tabs1')}</p></TabsTrigger>
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
                            <TabsContent value={'exchange'}>
                                {playerRole === 'A' ?
                                    <AliceExchangeTab photonNumber={photonNumber}
                                                      polarIcons={polarIcons}/> :
                                    <BobExchangeTab photonNumber={photonNumber}/>}
                            </TabsContent>
                            <TabsContent value={'basis'}>
                                <BasisTab playerRole={playerRole}/>
                            </TabsContent>
                            {gameHasEve && <TabsContent value={'validation'}>
                                <ValidationTab playerRole={playerRole}/>
                            </TabsContent>}
                            <TabsContent value={'messaging'}>
                                <MessagingTab playerRole={playerRole}/>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div
                        className="hidden md:block md:w-[50%] md:h-full md:ml-1">
                        <Bb84Progression/>
                    </div>
                </>}
        </div>
    );
};

export default isConnected(Game);
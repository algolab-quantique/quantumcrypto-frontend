'use client';

import React, {useEffect, useCallback, useRef, useState} from 'react';
import usePlayerStore from '@/store/player-store';
import AliceExchangeTab
    from '@/components/dps/play-page/tabs/alice-exchange-tab';
import useDPSGameStore from '@/store/dps/dps-game-store';
import {useLanguage} from '@/components/providers/language-provider';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import BobExchangeTab from '@/components/dps/play-page/tabs/bob-exchange-tab';
import {
    Minus,
    MoveHorizontal, MoveVertical,
} from 'lucide-react';
import {hydrateDPSProgressStore, useDPSProgressStore} from '@/store/dps/dps-progress-store';
// import BasisTab from '@/components/dps/play-page/tabs/basis-tab';
import BobMessagingTab from '@/components/dps/play-page/tabs/bob-messaging-tab';
import AliceMessagingTab from '@/components/dps/play-page/tabs/alice-messaging-tab';
import AliceInferenceTab from '@/components/dps/play-page/tabs/alice-inference-tab';
import isConnected from '@/components/hoc/is-connected';
import Image from 'next/image';
// import ValidationTab from '@/components/dps/play-page/tabs/validation-tab';
import {cn} from '@/lib/utils';
import DPSProgression from '@/components/dps/play-page/dps-progression';
import { useTheme } from "next-themes";
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { usePreventNavigation } from '@/hooks/use-prevent-navigation';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import { useSocket } from '@/components/providers/socket-provider';



const Game = () => {

    const hasInitialized = useRef(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const polarIcons =

    [
        <Minus key="minus"/>,
        <Image
            key="zero"
            src={isDark ? "/images/zero_bb.svg" : "/images/zero_wb.svg"}
            alt="Zero"
            width={50}
            height={50}
        />,
        <Image
            key="pi"
            src={isDark ? "/images/pi_bb.svg" : "/images/pi_wb.svg"}
            alt="Pi"
            width={50}
            height={50}
        />,
        <Image
            key="dual"
            src={isDark ? "/images/dual_bb.svg" : "/images/dual_wb.svg"}
            alt="Dual"
            width={50}
            height={50}
        />,
        
        
    ];

    const {localize} = useLanguage();
    const {step, displayedLines, dpsTab} = useDPSProgressStore();
    const {pushLines, setDPSTab} = useDPSProgressStore();
    const {playerRole, playerName, playingMultiplayer, setPlayingMultiplayer} = usePlayerStore();
    const {photonNumber, gameHasEve, setPhotonNumber, setGameHasEve, setGameCode, setValidationBitsLength} = useDPSGameStore();
    const {gameSuccess, restoreGame} = useDPSRoomStore();
    const {isPlayRoomConnected, playRoomConnecting, connectToPlayRoom} = useSocket();

    const handleNavCleanup = useCallback(() => {
        clearDPSLocalStorage();
        usePlayerStore.getState().setPlayingSolo(false);
        usePlayerStore.getState().setPlayingMultiplayer(false);
    }, []);

    // Prevent navigation mid-game (warn user on browser back/close/refresh)
    usePreventNavigation(!gameSuccess, handleNavCleanup);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            if (!item) return null;

            try {
                return JSON.parse(item);
            } catch {
                localStorage.removeItem(key);
                return null;
            }
        };

        const playerData = getItem('dpsPlayerData');
        const hasSavedMultiplayerSession = Boolean(
            playerData?.gameCode &&
            playerData?.role &&
            playerData?.room
        );

        if ((playingMultiplayer || hasSavedMultiplayerSession) && !isPlayRoomConnected) {
            if (!playerData?.gameCode || !playerData?.role || !playerData?.room) {
                setPlayingMultiplayer(false);

                if (displayedLines.length === 0 && (playerRole === 'A' || playerRole === 'B')) {
                    pushLines([
                        {
                            title: 'component.dps.exchange.welcome',
                        },
                        {
                            title: 'component.game.step1',
                            content: playerRole === 'A'
                                ? 'component.aliceExchange.start'
                                : 'component.bobExchange.waiting',
                        },
                    ]);
                }
                setIsHydrated(true);
                return;
            }

            usePlayerStore.getState().setPlayingMultiplayer(true);
            usePlayerStore.getState().setPlayingSolo(false);

            const gameData = getItem('dpsGameData');
            if (gameData) {
                restoreGame(gameData);
            }

            hydrateDPSProgressStore();

            const savedPhotonNumber = getItem('dpsPhotonNumber') ?? playerData.photonNumber;
            if (typeof savedPhotonNumber === 'number') {
                setPhotonNumber(savedPhotonNumber);
                localStorage.setItem('dpsPhotonNumber', JSON.stringify(savedPhotonNumber));
            }

            const savedGameHasEve = getItem('dpsGameHasEve');
            if (savedGameHasEve !== null) {
                setGameHasEve(savedGameHasEve);
            }

            const savedValidationBitsLength = getItem('dpsValidationBitsLength') ?? playerData.validationBitsLength;
            if (typeof savedValidationBitsLength === 'number') {
                setValidationBitsLength(savedValidationBitsLength);
                localStorage.setItem('dpsValidationBitsLength', JSON.stringify(savedValidationBitsLength));
            }

            setGameCode(playerData.gameCode);
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

            if (!gameData?.gameSuccess && !playRoomConnecting) {
                connectToPlayRoom('dps', playerData.gameCode, playerData.role, playerData.room);
            }
        } else if (displayedLines.length === 0) {
            if (playerRole === 'A') {
                pushLines([
                    {
                        title: 'component.dps.exchange.welcome',
                    },
                    {
                        title: 'component.game.step1',
                        content: 'component.aliceExchange.start',
                    },
                ]);
            } else if (playerRole === 'B') {
                pushLines([
                    {
                        title: 'component.dps.exchange.welcome',
                    },
                    {
                        content: 'component.bobExchange.waiting',
                    },
                ]);
            }
        }

        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return (
            <div className="flex h-full w-full items-center justify-center p-6">
                <p className="text-lg font-medium text-foreground">Loading DPS multiplayer game...</p>
            </div>
        );
    }

    return (
        <div
            className="block md:flex w-full h-full p-2 overflow-hidden">
            {playerRole === 'S' ?
                <div className="w-fit m-auto"><p
                    className="font-bold text-xl">{localize(
                    'component.dps.play.sorry')}</p>
                </div> : <>
                    <div
                        className="w-full md:w-[50%] h-full flex flex-col mr-1">
                        <p className="font-bold text-xl md:text-3xl text-foreground px-4 py-3">{playerName}, {localize(
                            'component.game.playerHeader')} <span
                            className="text-highlight">{playerRole === 'A' ?
                            'Alice' : 'Bob'}</span></p>
                        <Tabs
                            className="overflow-y-auto max-h-[92%] rounded-lg"
                            value={dpsTab}
                            onValueChange={(value) => setDPSTab(value)}>
                            <TabsList className={cn('w-full grid sticky h-fit',
                                playerRole === 'A' ? 'grid-cols-3' : 'grid-cols-2')}>
                                <TabsTrigger value={'exchange'}><p
                                    className={'text-wrap text-md md:text-lg'}>{localize(
                                    'component.game.tabs1')}</p></TabsTrigger>
                                {playerRole === 'A' && <TabsTrigger value={'inference'}
                                             disabled={step < 1}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize(
                                        'component.game.tabs2')}</p>
                                </TabsTrigger>}
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
                                    <BobExchangeTab photonNumber={photonNumber}
                                                    polarIcons={polarIcons}/>}
                            </TabsContent>
                            <TabsContent value={'inference'}>
                                {playerRole === 'A' && <AliceInferenceTab polarIcons={polarIcons} /> }
                            </TabsContent>
                            {gameHasEve && <TabsContent value={'validation'}>
                            </TabsContent>}
                            <TabsContent value={'messaging'}>
                                {
                                    playerRole === 'A' ? 
                                        <AliceMessagingTab /> : 
                                        <BobMessagingTab />
                                }
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div
                        className="hidden md:block md:w-[50%] md:h-full md:ml-1">
                        <DPSProgression/>
                    </div>
                </>}
        </div>
    );
};

export default isConnected(Game);

'use client';

/**
 * BB84 Multiplayer Game Container
 *
 * Extracted from the original game.tsx as part of the solo/multiplayer split
 * to align BB84 with the E91 and DPS protocol structure.
 *
 * Responsibilities:
 * - Restore room state, progress, and game config from localStorage on mount.
 * - Show role-appropriate welcome messages on a fresh session.
 * - On page refresh mid-game: detect a disconnected WebSocket and attempt to
 *   reconnect using the player session saved in `bb84PlayerData`.
 * - Redirect to the results page if the game was already completed before refresh.
 *
 * NOTE: Unlike E91 and DPS, BB84 does not have separate multiplayer tab components.
 * The shared tab components (AliceExchangeTab, BobExchangeTab, etc.) branch
 * internally on the `playingSolo` flag from the player store.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import usePlayerStore from '@/store/player-store';
import AliceExchangeTab from '@/components/bb84/play-page/tabs/alice-exchange-tab';
import BobExchangeTab from '@/components/bb84/play-page/tabs/bob-exchange-tab';
import BasisTab from '@/components/bb84/play-page/tabs/basis-tab';
import MessagingTab from '@/components/bb84/play-page/tabs/messaging-tab';
import ValidationTab from '@/components/bb84/play-page/tabs/validation-tab';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import { useBB84ProgressStore } from '@/store/bb84/bb84-progress-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minus, MoveHorizontal, MoveDiagonal2, MoveDiagonal, MoveVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import isConnected from '@/components/hoc/is-connected';
import Bb84Progression from '@/components/bb84/play-page/bb84-progression';
import { usePreventNavigation } from '@/hooks/use-prevent-navigation';
import { clearBB84LocalStorage } from '@/lib/bb84/utils';


const MultiGame = () => {
    // Guard against React StrictMode double-invocation
    const hasInitialized = useRef(false);

    const router = useRouter();

    const polarIcons = [
        // eslint-disable-next-line react/jsx-key
        <Minus />, <MoveHorizontal />, <MoveVertical />, <MoveDiagonal />,
        // eslint-disable-next-line react/jsx-key
        <MoveDiagonal2 />,
    ];

    const { localize } = useLanguage();
    const { step, displayedLines, bb84Tab } = useBB84ProgressStore();
    const { pushLines, setBb84Tab, setStep, setDisplayedLines } = useBB84ProgressStore();
    const { playerRole, playerName, playingMultiplayer, setPlayingMultiplayer } = usePlayerStore();
    const { photonNumber, gameHasEve, setPhotonNumber, setGameHasEve, setValidationBitsLength, setGameCode } = useBB84GameStore();
    const { restoreGame, gameSuccess } = useBB84RoomStore();
    const { isPlayRoomConnected, connectToPlayRoom } = useSocket();

    const handleNavCleanup = useCallback(() => {
        clearBB84LocalStorage();
        usePlayerStore.getState().setPlayingMultiplayer(false);
    }, []);

    // Warn user on browser back / close / refresh while game is in progress
    usePreventNavigation(!gameSuccess, handleNavCleanup);

    // Restore game state from localStorage on mount (page refresh recovery)
    // OR initialize welcome messages for a fresh session
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        if (playingMultiplayer && !isPlayRoomConnected) {
            // ── Page refresh mid-game: restore state and reconnect ──────────

            const gameData = getItem('bb84GameData');

            // If the game was already completed before the refresh, skip
            // restoration and send the player straight to the results page.
            if (gameData?.gameSuccess) {
                const playerData = getItem('bb84PlayerData');
                if (playerData?.gameCode) {
                    setPlayingMultiplayer(false);
                    router.replace(`/games/bb84/${playerData.gameCode}/results`);
                    return;
                }
            }

            // Restore room state (bases, bits, cipher, etc.)
            if (gameData) restoreGame(gameData);

            // Restore progress: step, active tab, narrative lines
            const savedStep = getItem('bb84Step');
            if (savedStep !== null) setStep(savedStep);

            const savedTab = localStorage.getItem('bb84Tab');
            if (savedTab) setBb84Tab(savedTab);

            const savedLines = getItem('bb84DisplayedLines');
            if (savedLines && savedLines.length > 0) setDisplayedLines(savedLines);

            // Restore game config (set by the lobby before entering this page)
            const savedPhotonNumber = getItem('bb84PhotonNumber');
            if (savedPhotonNumber) setPhotonNumber(savedPhotonNumber);

            const savedGameHasEve = getItem('bb84GameHasEve');
            if (savedGameHasEve !== null) setGameHasEve(savedGameHasEve);

            const savedValidationBitsLength = getItem('bb84ValidationBitsLength');
            if (savedValidationBitsLength) setValidationBitsLength(savedValidationBitsLength);

            // Attempt WebSocket reconnection using the saved player session
            const playerData = getItem('bb84PlayerData');
            if (playerData?.gameCode && playerData?.role && playerData?.room) {
                setGameCode(playerData.gameCode);
                if (playerData.role) usePlayerStore.getState().setPlayerRole(playerData.role);
                if (playerData.partner) usePlayerStore.getState().setPartner(playerData.partner);
                if (playerData.playerName) usePlayerStore.getState().setPlayerName(playerData.playerName);
                if (playerData.gameHasEve !== undefined) setGameHasEve(playerData.gameHasEve);
                connectToPlayRoom('bb84', playerData.gameCode, playerData.role, playerData.room);
            } else {
                // No valid session data — cannot reconnect, reset multiplayer flag
                setPlayingMultiplayer(false);
            }
        } else if (displayedLines.length === 0) {
            // ── Fresh session: show role-appropriate welcome messages ────────
            if (playerRole === 'A') {
                pushLines([
                    { title: 'component.exchange.welcome' },
                    { title: 'component.game.step1', content: 'component.aliceExchange.start' },
                ]);
            } else if (playerRole === 'B') {
                pushLines([
                    { title: 'component.exchange.welcome' },
                    { content: 'component.bobExchange.waiting' },
                ]);
            }
        }
    }, []);

    return (
        <div className="block md:flex w-full h-full p-2 overflow-hidden">
            {playerRole === 'S' ? (
                <div className="w-fit m-auto">
                    <p className="font-bold text-xl">{localize('component.bb84.play.sorry')}</p>
                </div>
            ) : (
                <>
                    <div className="w-full md:w-[50%] h-full flex flex-col mr-1">
                        <p className="font-bold text-xl md:text-3xl text-foreground px-4 py-3">
                            {playerName}, {localize('component.game.playerHeader')}{' '}
                            <span className="text-highlight">
                                {playerRole === 'A' ? 'Alice' : 'Bob'}
                            </span>
                        </p>
                        <Tabs
                            className="overflow-y-auto max-h-[92%] rounded-lg"
                            value={bb84Tab}
                            onValueChange={(value) => setBb84Tab(value)}>
                            <TabsList className={cn('w-full grid sticky h-fit',
                                gameHasEve ? 'grid-cols-4' : 'grid-cols-3')}>
                                <TabsTrigger value={'exchange'}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabs1')}</p>
                                </TabsTrigger>
                                <TabsTrigger value={'basis'} disabled={step < 1}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabs2')}</p>
                                </TabsTrigger>
                                {gameHasEve && (
                                    <TabsTrigger value={'validation'} disabled={step < 2}>
                                        <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabValidation')}</p>
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value={'messaging'} disabled={step < 3}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabs3')}</p>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value={'exchange'}>
                                {playerRole === 'A'
                                    ? <AliceExchangeTab photonNumber={photonNumber} polarIcons={polarIcons} />
                                    : <BobExchangeTab photonNumber={photonNumber} />}
                            </TabsContent>
                            <TabsContent value={'basis'}>
                                <BasisTab playerRole={playerRole} />
                            </TabsContent>
                            {gameHasEve && (
                                <TabsContent value={'validation'}>
                                    <ValidationTab playerRole={playerRole} />
                                </TabsContent>
                            )}
                            <TabsContent value={'messaging'}>
                                <MessagingTab playerRole={playerRole} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="hidden md:block md:w-[50%] md:h-full md:ml-1">
                        <Bb84Progression />
                    </div>
                </>
            )}
        </div>
    );
};

export default isConnected(MultiGame);
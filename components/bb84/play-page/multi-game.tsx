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
 * - On completed game refresh: restore the félicitations screen locally
 *   (no auto-redirect to results; the user navigates there explicitly).
 *
 * NOTE: Unlike E91 and DPS, BB84 does not have separate multiplayer tab components.
 * The shared tab components (AliceExchangeTab, BobExchangeTab, etc.) branch
 * internally on the `playingSolo` flag from the player store.
 */

import React, { useEffect, useRef, useCallback } from 'react';

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
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minus, MoveHorizontal, MoveDiagonal2, MoveDiagonal, MoveVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import isConnected from '@/components/hoc/is-connected';
import Bb84Progression from '@/components/bb84/play-page/bb84-progression';
import { usePreventNavigation } from '@/hooks/use-prevent-navigation';
import { abandon, restoreCheckpoint } from '@/lib/protocol-lifecycle/lifecycle';
import { bb84Adapter } from '@/lib/protocol-lifecycle/bb84-adapter';


const MultiGame = () => {
    // Guard against React StrictMode double-invocation
    const hasInitialized = useRef(false);



    const polarIcons = [
        // eslint-disable-next-line react/jsx-key
        <Minus />, <MoveHorizontal />, <MoveVertical />, <MoveDiagonal />,
        // eslint-disable-next-line react/jsx-key
        <MoveDiagonal2 />,
    ];

    const { localize } = useLanguage();
    const router = useRouter();
    const { step, displayedLines, bb84Tab } = useBB84ProgressStore();
    const { pushLines, setBb84Tab } = useBB84ProgressStore();
    const { playerRole, playerName, playingMultiplayer } = usePlayerStore();
    const { photonNumber, gameHasEve, setGameHasEve, setGameCode } = useBB84GameStore();
    const { gameSuccess } = useBB84RoomStore();
    const { isPlayRoomConnected, connectToPlayRoom } = useSocket();

    const handleNavCleanup = useCallback(() => {
        abandon(bb84Adapter);
    }, []);

    // Warn user on browser back / close / refresh while game is in progress
    usePreventNavigation(!gameSuccess, handleNavCleanup);

    // Restore game state from localStorage on mount (page refresh recovery)
    // OR initialize welcome messages for a fresh session
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (playingMultiplayer && !isPlayRoomConnected) {
            // ── Page refresh: restore state and reconnect if needed ─────────
            const result = restoreCheckpoint(bb84Adapter);
            const session = result.kind === 'active' || result.kind === 'completed'
                ? result.multiplayerSession
                : undefined;

            if (session) {
                setGameCode(session.gameCode);
                usePlayerStore.getState().setPlayerRole(session.role);
                if (typeof session.partner === 'string') usePlayerStore.getState().setPartner(session.partner);
                if (typeof session.playerName === 'string') usePlayerStore.getState().setPlayerName(session.playerName);
                if (typeof session.gameHasEve === 'boolean') setGameHasEve(session.gameHasEve);

                // Only reconnect WebSocket if game is still in progress.
                // Completed games restore the félicitations screen locally —
                // the user navigates to results explicitly via "Voir les résultats".
                if (result.kind === 'active') {
                    connectToPlayRoom('bb84', session.gameCode, session.role, session.room);
                }
            } else {
                abandon(bb84Adapter);
                router.replace('/bb84');
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

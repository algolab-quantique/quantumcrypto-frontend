'use client';

/**
 * BB84 Solo Game Container
 *
 * Extracted from the original game.tsx as part of the solo/multiplayer split
 * to align BB84 with the E91 and DPS protocol structure.
 *
 * Responsibilities:
 * - Restore room state, progress, and game config from localStorage on mount.
 * - Show role-appropriate welcome messages on a fresh session.
 * - No WebSocket logic — solo mode runs fully client-side.
 *
 * NOTE: Unlike E91 and DPS, BB84 does not have separate solo tab components.
 * The shared tab components (AliceExchangeTab, BobExchangeTab, etc.) branch
 * internally on the `playingSolo` flag from the player store.
 */

import React, { useEffect, useRef } from 'react';
import usePlayerStore from '@/store/player-store';
import AliceExchangeTab from '@/components/bb84/play-page/tabs/alice-exchange-tab';
import BobExchangeTab from '@/components/bb84/play-page/tabs/bob-exchange-tab';
import BasisTab from '@/components/bb84/play-page/tabs/basis-tab';
import MessagingTab from '@/components/bb84/play-page/tabs/messaging-tab';
import ValidationTab from '@/components/bb84/play-page/tabs/validation-tab';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import { useBB84ProgressStore } from '@/store/bb84/bb84-progress-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minus, MoveHorizontal, MoveDiagonal2, MoveDiagonal, MoveVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import Bb84Progression from '@/components/bb84/play-page/bb84-progression';
import { restoreCheckpoint } from '@/lib/protocol-lifecycle/lifecycle';
import { bb84Adapter } from '@/lib/protocol-lifecycle/bb84-adapter';



const SoloGame = () => {
    // Guard against React StrictMode double-invocation
    const hasInitialized = useRef(false);

    const polarIcons = [
        // eslint-disable-next-line react/jsx-key
        <Minus />, <MoveHorizontal />, <MoveVertical />, <MoveDiagonal />,
        // eslint-disable-next-line react/jsx-key
        <MoveDiagonal2 />,
    ];

    const { localize } = useLanguage();
    const { step, bb84Tab } = useBB84ProgressStore();
    const { pushLines, setBb84Tab } = useBB84ProgressStore();
    const { playerRole, playerName } = usePlayerStore();
    const { photonNumber, gameHasEve } = useBB84GameStore();

    // Restore game state from localStorage on mount (page refresh recovery)
    // OR initialize welcome messages for a fresh session
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // PlayPage's render-time guard (Task 48 D4a) guarantees a restorable
        // session before SoloGame mounts, so restoreCheckpoint cannot return
        // missing/corrupted here — the old fail-close branch was dead code (D5b).
        restoreCheckpoint(bb84Adapter);

        const restoredLines = useBB84ProgressStore.getState().displayedLines;
        if (restoredLines.length === 0) {
            // Fresh active session with no transcript yet (e.g. Alice) — welcome lines.
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

// Task 48 D4a: the is-connected HOC is removed — /bb84/play (PlayPage) now owns
// the route guard via detectSession, and the HOC could not see a completed-solo
// checkpoint (no bb84PlayerData, flags reset at landing), which would wrongly
// veto valid sessions under the Navigation Invariant (ADR §11).
export default SoloGame;

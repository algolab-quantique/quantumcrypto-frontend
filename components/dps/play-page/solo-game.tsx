/**
 * DPS Solo Game Container
 * 
 * Adapted from game.tsx for solo mode.
 * - Instantiates solo-specific tabs (Phase 3)
 * - Manages solo game state restoration
 * - No WebSocket connection required
 */

'use client';

import React, { useEffect, useRef } from 'react';
import usePlayerStore from '@/store/player-store';
// OPTION B: Will use separate solo files in Phase 3. 
// For now, using placeholders or existing tabs to ensure build passes.
import SoloAliceExchangeTab from '@/components/dps/play-page/tabs/solo-alice-exchange-tab';
import SoloBobExchangeTab from '@/components/dps/play-page/tabs/solo-bob-exchange-tab';
import SoloAliceInferenceTab from '@/components/dps/play-page/tabs/solo-alice-inference-tab';
import SoloBobMessagingTab from '@/components/dps/play-page/tabs/solo-bob-messaging-tab';
import SoloAliceMessagingTab from '@/components/dps/play-page/tabs/solo-alice-messaging-tab';

import useDPSGameStore from '@/store/dps/dps-game-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Minus,
} from 'lucide-react';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import isConnected from '@/components/hoc/is-connected'; // NOT needed for solo, but creating structure first
import Image from 'next/image';
import { cn } from '@/lib/utils';
import DPSProgression from '@/components/dps/play-page/dps-progression';
import { useTheme } from "next-themes";
import useDPSRoomStore from '@/store/dps/dps-room-store';

const SoloGame = () => {
    // Track if we've already restored/initialized
    const hasInitialized = useRef(false);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const polarIcons = [
        <Minus key="minus" />,
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

    const { localize } = useLanguage();
    const { step, displayedLines, dpsTab } = useDPSProgressStore();
    const { pushLines, setDPSTab, setStep, setDisplayedLines } = useDPSProgressStore();
    const { playerRole, playerName } = usePlayerStore();
    const { photonNumber, gameHasEve, setPhotonNumber, setGameCode } = useDPSGameStore();
    const { restoreGame } = useDPSRoomStore();

    // ═══════════════════════════════════════════════════════════════════════
    // STATE RESTORATION (Specific to Solo Mode)
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        // Restore player data if missing (e.g. refresh)
        if (!playerRole) {
            const playerData = getItem('dpsPlayerData');
            if (playerData) {
                usePlayerStore.setState({
                    playerRole: playerData.role,
                    playerName: playerData.playerName,
                    playingSolo: true,
                    partner: 'QuantumCrypto'
                });
                setGameCode(playerData.gameCode);
            }
        }

        // Restore game config
        const savedPhotonNumber = getItem('dpsPhotonNumber');
        if (savedPhotonNumber) setPhotonNumber(savedPhotonNumber);

        // Restore progress
        const savedStep = getItem('dpsStep');
        if (savedStep !== null) setStep(savedStep);

        const savedTab = localStorage.getItem('dpsTab');
        if (savedTab) setDPSTab(savedTab);

        // Restore displayed lines OR show welcome messages
        const savedLines = getItem('dpsDisplayedLines');
        if (savedLines && savedLines.length > 0) {
            setDisplayedLines(savedLines);
        } else {
            // Welcome messages
            if (playerRole === 'A' || getItem('dpsPlayerData')?.role === 'A') {
                pushLines([
                    { title: 'component.dps.exchange.welcome' },
                    { title: 'component.game.step1', content: 'component.aliceExchange.start' },
                ]);
            } else {
                pushLines([
                    { title: 'component.dps.exchange.welcome' },
                    { content: 'component.bobExchange.waiting' },
                ]);
            }
        }
    }, []);

    return (
        <div className="block md:flex w-full h-full p-2 overflow-hidden">
            {playerRole === 'S' ?
                <div className="w-fit m-auto">
                    <p className="font-bold text-xl">{localize('component.dps.play.sorry')}</p>
                </div> :
                <>
                    <div className="w-full md:w-[50%] h-full flex flex-col mr-1">
                        <p className="font-bold text-xl md:text-3xl text-foreground px-4 py-3">
                            {playerName}, {localize('component.game.playerHeader')} <span className="text-highlight">
                                {playerRole === 'A' ? 'Alice' : 'Bob'}
                            </span>
                        </p>
                        <Tabs
                            className="overflow-y-auto max-h-[92%] rounded-lg"
                            value={dpsTab}
                            onValueChange={(value) => setDPSTab(value)}
                        >
                            <TabsList className={cn('w-full grid sticky h-fit',
                                playerRole === 'A' ? 'grid-cols-3' : 'grid-cols-2')}>
                                <TabsTrigger value={'exchange'}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabs1')}</p>
                                </TabsTrigger>
                                {playerRole === 'A' && <TabsTrigger value={'inference'} disabled={step < 1}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabs2')}</p>
                                </TabsTrigger>}
                                {gameHasEve && <TabsTrigger disabled={step < 2} value={'validation'}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabValidation')}</p>
                                </TabsTrigger>}
                                <TabsTrigger value={'messaging'} disabled={step < 3}>
                                    <p className={'text-wrap text-md md:text-lg'}>{localize('component.game.tabs3')}</p>
                                </TabsTrigger>
                            </TabsList>

                            {/* TODO: Replace with Solo*Tabs in Phase 3 */}
                            <TabsContent value={'exchange'}>
                                {playerRole === 'A' ?
                                    <SoloAliceExchangeTab photonNumber={photonNumber} polarIcons={polarIcons} /> :
                                    <SoloBobExchangeTab photonNumber={photonNumber} polarIcons={polarIcons} />}
                            </TabsContent>
                            <TabsContent value={'inference'}>
                                {playerRole === 'A' && <SoloAliceInferenceTab polarIcons={polarIcons} />}
                            </TabsContent>
                            <TabsContent value={'messaging'}>
                                {playerRole === 'A' ? <SoloAliceMessagingTab /> : <SoloBobMessagingTab />}
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="hidden md:block md:w-[50%] md:h-full md:ml-1">
                        <DPSProgression />
                    </div>
                </>
            }
        </div>
    );
};

export default SoloGame;

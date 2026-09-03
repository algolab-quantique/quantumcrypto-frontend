/**
 * E91 Solo Game Component
 * 
 * This component is a copy of game.tsx adapted for solo mode.
 * The structure is IDENTICAL to multiplayer game.tsx.
 * Only the tab components are replaced with solo versions.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPORTANT: E91 solo = E91 multiplayer experience.
 * Same steps, same messages, same UI, just one player is the computer.
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tab Components (solo versions):
 * - SoloMeasurementTab: Player selects bases, local simulation for partner
 * - SoloBasisTab: Classify photon pairs (Key/Bell/Trash)
 * - SoloCHSHTab: Interactive drag-and-drop CHSH validation
 * - SoloMessagingTab: Encrypt/decrypt message with shared key
 */

'use client';

import E91Progression from '@/components/e91/play-page/e91-progression';
import SoloBasisTab from '@/components/e91/play-page/tabs/solo-basis-tab';
import SoloMeasurementTab from '@/components/e91/play-page/tabs/solo-measurement-tab';
import SoloMessagingTab from '@/components/e91/play-page/tabs/solo-messaging-tab';
import SoloCHSHTab from '@/components/e91/play-page/tabs/solo-CHSH-tab';
import isConnected from '@/components/hoc/is-connected';
import { useLanguage } from '@/components/providers/language-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import useE91GameStore from '@/store/e91/e91-game-store';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import usePlayerStore from '@/store/player-store';
import { restoreCheckpoint } from '@/lib/protocol-lifecycle/lifecycle';
import { e91Adapter } from '@/lib/protocol-lifecycle/e91-adapter';
import { Minus } from 'lucide-react';
import { useEffect, useRef } from 'react';

const SoloGame = () => {
    // Track if we've already restored/initialized to prevent duplicate messages
    const hasInitialized = useRef(false);

    const polarIcons = [
        // eslint-disable-next-line react/jsx-key
        <Minus/>, 
        // eslint-disable-next-line react/jsx-key
        <span style={{ fontSize: "24px" }}>a</span>,
        // eslint-disable-next-line react/jsx-key
        <span style={{ fontSize: "24px" }}>b</span>, 
        // eslint-disable-next-line react/jsx-key
        <span style={{ fontSize: "24px" }}>a&apos;</span>,
        // eslint-disable-next-line react/jsx-key
        <span style={{ fontSize: "24px" }}>b&apos;</span>
    ];

    const {localize} = useLanguage();
    const {step, displayedLines, e91Tab} = useE91ProgressStore();
    const {pushLines, setE91Tab} = useE91ProgressStore();
    const {playerRole, playerName} = usePlayerStore();
    const {photonNumber, gameHasEve} = useE91GameStore();
    const {utilizeValidBits} = useE91RoomStore();

    // Restore game state on mount (page refresh recovery)
    // OR initialize welcome messages for a fresh session
    useEffect(() => {
        // Prevent running twice (React StrictMode)
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        // Task 40 Phase 3c: PlayPage's render-time guard (3b-1) has already
        // resolved the session as valid before SoloGame mounts, so
        // restoreCheckpoint cannot return missing/corrupted here — the same
        // reasoning BB84 recorded in D5b. One call now covers what four
        // hand-rolled reads did: the room store, the progress store (step, tab,
        // transcript) and, through the adapter's hydrateConfig, the photon
        // count and the Eve flag.
        restoreCheckpoint(e91Adapter);

        // The old code's implicit `else` — "no saved lines, so this must be a
        // fresh game" — made explicit. The lifecycle restores state; it does
        // not know E91's opening messages, and that is the right split.
        if (useE91ProgressStore.getState().displayedLines.length === 0) {
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
                                <SoloMeasurementTab photonNumber={photonNumber} polarIcons={polarIcons} playerRole={playerRole}/> 
                            </TabsContent>
                            <TabsContent value={'basis'}>
                                <SoloBasisTab photonNumber={photonNumber} playerRole={playerRole} polarIcons={polarIcons}/>
                            </TabsContent>
                            {gameHasEve && <TabsContent value={'validation'}>
                                <SoloCHSHTab playerRole={playerRole} polarIcons={polarIcons}/>
                            </TabsContent>}
                            <TabsContent value={'messaging'}>
                                <SoloMessagingTab playerRole={playerRole}/>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div
                        className="hidden md:block md:w-[50%] md:h-full md:ml-1">
                        <E91Progression/>
                    </div>
                </>}
        </div>
    );
};

export default isConnected(SoloGame);

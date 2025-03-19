'use client';

import React, {useEffect} from 'react';
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
import {useDPSProgressStore} from '@/store/dps/dps-progress-store';
// import BasisTab from '@/components/dps/play-page/tabs/basis-tab';
import MessagingTab from '@/components/dps/play-page/tabs/messaging-tab';
import BobMessagingTab from '@/components/dps/play-page/tabs/bob-messaging-tab';
import AliceMessagingTab from '@/components/dps/play-page/tabs/alice-messaging-tab';
import isConnected from '@/components/hoc/is-connected';
// import ValidationTab from '@/components/dps/play-page/tabs/validation-tab';
import {cn} from '@/lib/utils';
import DPSProgression from '@/components/dps/play-page/dps-progression';
import { GaussianCurve1, InvertedGaussianCurve1 } from '@/components/icons/gaussian-curves';


const Game = () => {

    const polarIcons =

        [
            <Minus/>, 
            <GaussianCurve1/>,
            <InvertedGaussianCurve1/>,
        ];

    const {localize} = useLanguage();
    const {step, displayedLines, dpsTab} = useDPSProgressStore();
    const {pushLines, setDPSTab} = useDPSProgressStore();
    const {playerRole, playerName} = usePlayerStore();
    const {photonNumber, gameHasEve} = useDPSGameStore();

    useEffect(() => {
        if (displayedLines.length === 0) {
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
    }, []);

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
                                {/* <BasisTab playerRole={playerRole}/> */}
                            </TabsContent>
                            {gameHasEve && <TabsContent value={'validation'}>
                                {/* <ValidationTab playerRole={playerRole}/> */}
                            </TabsContent>}
                            <TabsContent value={'messaging'}>
                                {
                                    playerRole === 'A' ? 
                                        <AliceMessagingTab /> : 
                                        <BobMessagingTab />
                                }
                               {/* <MessagingTab playerRole={playerRole}/> */}
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
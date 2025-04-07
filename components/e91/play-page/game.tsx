'use client';

import E91Progression from '@/components/e91/play-page/e91-progression';
import BasisTab from '@/components/e91/play-page/tabs/basis-tab';
import MeasurementTab from '@/components/e91/play-page/tabs/measurement-tab';
import MessagingTab from '@/components/e91/play-page/tabs/messaging-tab';
import ValidationTab from '@/components/e91/play-page/tabs/validation-tab';
import isConnected from '@/components/hoc/is-connected';
import { useLanguage } from '@/components/providers/language-provider';
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
import { useEffect } from 'react';
import CHSHTab from './tabs/CHSH-tab';


const Game = () => {

    const polarIcons =

        [
            <Minus key="minus"/>, 
            <span key="a" style={{ fontSize: "24px" }}>a</span>,
            <span key="b" style={{ fontSize: "24px" }}>b</span>, 
            <span key="a-prime" style={{ fontSize: "24px" }}>a&apos;</span>,
            <span key="b-prime" style={{ fontSize: "24px" }}>b&apos;</span>           
        ];

    const {localize} = useLanguage();
    const {step, displayedLines, e91Tab} = useE91ProgressStore();
    const {pushLines, setE91Tab} = useE91ProgressStore();
    const {playerRole, playerName} = usePlayerStore();
    const {photonNumber, gameHasEve} = useE91GameStore();
    const {utilizeValidBits} = useE91RoomStore();

    useEffect(() => {
        if (displayedLines.length === 0) {
            if (playerRole === 'A') {
                pushLines([
                    {
                        title: 'component.e91.measurement.welcome',
                    },
                    {
                        title: 'component.game.step1',
                        content: 'component.e91.measurement.start',
                    },
                ]);
            } else if (playerRole === 'B') {
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
                                <MeasurementTab photonNumber={photonNumber} polarIcons={polarIcons} playerRole={playerRole}/> 
                            </TabsContent>
                            <TabsContent value={'basis'}>
                                <BasisTab photonNumber={photonNumber} playerRole={playerRole} polarIcons={polarIcons}/>
                            </TabsContent>
                            {gameHasEve && <TabsContent value={'validation'}>
                                {utilizeValidBits ? <ValidationTab playerRole={playerRole}/> : <CHSHTab playerRole={playerRole} polarIcons={polarIcons}/>}
                            </TabsContent>}
                            <TabsContent value={'messaging'}>
                                <MessagingTab playerRole={playerRole}/>
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

export default isConnected(Game);
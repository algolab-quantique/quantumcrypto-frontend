'use client';

import React from 'react';
import GameProgression from '@/components/shared/game-progression';
import usePlayerStore from '@/store/player-store';
import {useDPSProgressStore} from '@/store/dps/dps-progress-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import {useLanguage} from '@/components/providers/language-provider';
import {Button} from '@/components/ui/button';
import {useSocket} from '@/components/providers/socket-provider';
import {useRouter} from 'next/navigation';
import useDPSGameStore from '@/store/dps/dps-game-store';

const DPSProgression = () => {

    const {localize} = useLanguage();
    const {sendEvent, restartGameWithoutEve} = useSocket();
    const router = useRouter();

    const {gameCode} = useDPSGameStore();

    const {playerRole, partner: partnerName} = usePlayerStore();

    const {displayedLines} = useDPSProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
       // eveSpotted,
    } = useDPSRoomStore();


    const getFeed = () => displayedLines.map((line: any, index: number) => {
        return (
            <div key={index} className="w-full h-fit mb-1">
                <p className="text-card-foreground text-md md:text-xl">{line.title &&
                    <span className="font-bold text-highlight">{localize(
                        line.title)}</span>}{line.content ?
                    line.extra ? localize(
                        line.content, line.extra) : localize(
                        line.content) : ''}</p>
            </div>
        );
    });

    const goToResultsPage = () => {
        router.replace(`/games/dps/${gameCode}/results`);
    };

    return (
        <GameProgression className="border-none">
            {getFeed()}
            {/* {evePresent && validated && eveSpotted &&
                <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={restartGameWithoutEve}>{localize('component.dps.restart')}</Button>
                </div>} */}
            {gameSuccess && <div className="w-full h-fit mb-1">
                <p className="text-card-foreground text-md md:text-xl">
                    {playerRole === 'A' ?
                        localize('component.messaging.alice.reveal') :
                        localize('component.messaging.bob.reveal')}
                    <span
                        className="font-bold text-highlight"> {partnerName}</span>
                </p>
                <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToResultsPage}>{localize('component.dps.text.seeResults')}</Button>
                </div>
            </div>}
        </GameProgression>
        
    );
};

export default DPSProgression;
'use client';

import React from 'react';
import GameProgression from '@/components/shared/game-progression';
import usePlayerStore from '@/store/player-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import useDPSGameStore from '@/store/dps/dps-game-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/components/providers/socket-provider';
import { useRouter } from 'next/navigation';
import { clearDPSStorageKeys } from '@/lib/dps/utils';

const DPSProgression = () => {

    const { localize } = useLanguage();
    const { disconnectPlayRoom } = useSocket();
    const router = useRouter();
    const { gameCode } = useDPSGameStore();


    const { playerRole, partner: partnerName, playingSolo } = usePlayerStore();

    const { displayedLines } = useDPSProgressStore();

    const {
        gameSuccess,
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

    const replayFromStart = () => {
        disconnectPlayRoom();
        sessionStorage.setItem('dpsReplayCleanupPending', 'true');
        window.location.replace('/dps');
    };

    const goToMainMenu = () => {
        disconnectPlayRoom();
        clearDPSStorageKeys();
        usePlayerStore.getState().setPlayingSolo(false);
        usePlayerStore.getState().setPlayingMultiplayer(false);
        router.replace('/');
    };

    const goToResultsPage = () => {
        let code = gameCode;
        if (!code) {
            try {
                const playerDataRaw = localStorage.getItem('dpsPlayerData');
                const playerData = playerDataRaw ? JSON.parse(playerDataRaw) : null;
                code = playerData?.gameCode || '';
            } catch {
                code = '';
            }
        }

        if (code) {
            router.replace(`/games/dps/${code}/results`);
        }
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
                {!playingSolo && <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToResultsPage}>{localize('component.results.seeResults')}</Button>
                </div>}
                {playingSolo && <div className="w-full h-fit mb-1 flex justify-center space-x-4">
                    <Button onClick={replayFromStart}>
                        {localize('component.gameRestart.playAgain')}
                    </Button>
                    <Button onClick={goToMainMenu}>
                        {localize('component.return.returnToMain')}
                    </Button>
                </div>}
            </div>}
        </GameProgression>

    );
};

export default DPSProgression;

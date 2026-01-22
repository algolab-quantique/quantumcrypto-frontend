'use client';

import React from 'react';
import GameProgression from '@/components/shared/game-progression';
import usePlayerStore from '@/store/player-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/components/providers/socket-provider';
import { useRouter } from 'next/navigation';
import useDPSGameStore from '@/store/dps/dps-game-store';
import { clearDPSLocalStorage } from '@/lib/dps/utils';

const DPSProgression = () => {

    const { localize } = useLanguage();
    const { restartGameAndSwappedRoles, leftGame } = useSocket();
    const router = useRouter();


    const { playerRole, partner: partnerName, playingSolo, setPlayerRole } = usePlayerStore();

    const { displayedLines } = useDPSProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
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

    const restartWithSwappedRoles = () => {
        if (playingSolo) {
            const currentRole = playerRole;
            const newRole = currentRole === 'A' ? 'B' : 'A';
            setPlayerRole(newRole);

            // Update localStorage
            const playerData = JSON.parse(localStorage.getItem('dpsPlayerData') || '{}');
            playerData.role = newRole;
            localStorage.setItem('dpsPlayerData', JSON.stringify(playerData));

            // Reset Game State
            clearDPSLocalStorage();
            useDPSRoomStore.getState().resetRoom();
            useDPSProgressStore.getState().resetProgress();

            // Push Welcome Messages for New Role
            const { pushLines } = useDPSProgressStore.getState();
            pushLines([
                { title: 'component.dps.exchange.welcome' },
                ...(newRole === 'A'
                    ? [{ title: 'component.game.step1', content: 'component.aliceExchange.start' }]
                    : [{ content: 'component.bobExchange.waiting' }]),
            ]);

            // No need to route change as we are on same page, but state update triggers re-render
        } else {
            restartGameAndSwappedRoles();
            router.replace(`/dps/play`);
        }
    };

    const goToMainMenu = () => {
        if (playingSolo) {
            localStorage.setItem('dpsPlayerData', JSON.stringify({}));
            localStorage.setItem('dpsGameData', JSON.stringify({}));
            localStorage.clear();
            clearDPSLocalStorage();
            useDPSRoomStore.getState().resetRoom();
            useDPSProgressStore.getState().resetProgress();
        } else {
            leftGame();
        }
        router.replace('/');
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
                <div className="w-full h-fit mb-1 flex justify-center space-x-4">
                    <Button onClick={restartWithSwappedRoles}>
                        {localize('component.gameRestart.playAgain')}
                    </Button>
                    <Button onClick={goToMainMenu}>{localize('component.game.leftGame')}</Button>
                </div>
            </div>}
        </GameProgression>

    );
};

export default DPSProgression;
'use client';

import React from 'react';
import GameProgression from '@/components/shared/game-progression';
import usePlayerStore from '@/store/player-store';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/components/providers/socket-provider';
import { RESTART_WITHOUT_EVE_EVENT } from '@/bb84-constants';
import { useRouter } from 'next/navigation';
import useE91GameStore from '@/store/e91/e91-game-store';

const E91Progression = () => {

    const { localize } = useLanguage();
    const { sendEvent, restartGameWithoutEve } = useSocket();
    const router = useRouter();

    const { gameCode, setGameHasEve } = useE91GameStore();

    // playingSolo: true = solo mode (no WebSocket), false = multiplayer mode
    const { playerRole, partner: partnerName, playingSolo } = usePlayerStore();

    const { displayedLines } = useE91ProgressStore();

    // Get reset functions from stores for solo mode restart
    const { resetRoom, setEvePresent } = useE91RoomStore();
    const { resetProgress, pushLines } = useE91ProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
        eveSpotted,
    } = useE91RoomStore();

    /**
     * Handle restart in SOLO mode (no WebSocket connection).
     * 
     * When Eve is detected in solo mode, we restart the game locally:
     * 1. Reset all room state (measurements, bases, bits, etc.)
     * 2. Reset progress (step, tab, displayed messages)
     * 3. Set Eve to false so the new game completes successfully
     * 
     * This mirrors the multiplayer behavior where the server restarts
     * the game without Eve after detection.
     */
    const handleSoloRestart = () => {
        // Reset room state (clears all measurements, bases, bits, etc.)
        resetRoom();
        // Reset progress (back to measurement tab, clear messages)
        resetProgress();
        // Disable Eve for the restart - guarantees successful completion
        setEvePresent(false);
        setGameHasEve(false);
        // Add initial welcome messages (in multiplayer, server sends these)
        pushLines([
            { content: 'component.e91.measurement.welcome' },
            { title: 'component.game.step1', content: 'component.e91.measurement.start' }
        ]);
    };


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
        if (playingSolo) {
            router.replace('/e91/solo-results');
        } else {
            router.replace(`/games/e91/${gameCode}/results`);
        }
    };

    return (
        <GameProgression className="border-none">
            {getFeed()}
            {evePresent && validated && eveSpotted &&
                <div className="w-full h-fit mb-1 flex justify-center">
                    {/* 
                      * Restart button: Different behavior for solo vs multiplayer
                      * - Solo mode: Uses local handleSoloRestart (no WebSocket needed)
                      * - Multiplayer: Uses restartGameWithoutEve from socket provider
                      */}
                    <Button onClick={playingSolo ? handleSoloRestart : restartGameWithoutEve}>
                        {localize('component.e91.restart')}
                    </Button>
                </div>}
            {gameSuccess && <div className="w-full h-fit mb-1">
                <p className="text-card-foreground text-md md:text-xl">
                    {playerRole === 'A' ?
                        localize('component.messaging.alice.reveal') :
                        localize('component.messaging.bob.reveal')}
                    <span
                        className="font-bold text-highlight"> {partnerName}</span>
                </p>
                <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToResultsPage}>{localize('component.e91.text.seeResults')}</Button>
                </div>
            </div>}
        </GameProgression>

    );
};

export default E91Progression;
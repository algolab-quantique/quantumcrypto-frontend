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
import { restartRound } from '@/lib/protocol-lifecycle/round';
import { e91Adapter } from '@/lib/protocol-lifecycle/e91-adapter';

const E91Progression = () => {

    const { localize } = useLanguage();
    const { sendEvent, restartGameWithoutEve } = useSocket();
    const router = useRouter();

    const { gameCode, setGameHasEve } = useE91GameStore();

    // playingSolo: true = solo mode (no WebSocket), false = multiplayer mode
    const { playerRole, partner: partnerName, playingSolo } = usePlayerStore();

    const { displayedLines } = useE91ProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
        eveSpotted,
    } = useE91RoomStore();

    /**
     * Handle restart in SOLO mode (no WebSocket connection), after Eve was
     * detected. Mirrors the multiplayer behaviour, where the server restarts
     * the game without Eve.
     *
     * Task 63 Step 2: the reset + welcome sequence now runs through the shared
     * restartRound, which is also what clears the Eve DRAW. Found late — this
     * was a third hand-written copy of the E91 restart, and the third to carry
     * the `{content}` welcome defect (Ibra spotted it by clicking this button
     * rather than the CHSH dialog, which turned out to be dead code).
     *
     * ⚠️ `setGameHasEve(false)` below is a DELIBERATE DIVERGENCE from BB84, not
     * an oversight. Do not "align" it without reading this.
     *
     * BB84 clears only the DRAW and keeps the CHECKBOX (Task 51 semantics), so
     * its next round re-runs the validation and the student confirms the channel
     * is clean. Copying that here was tried on 2026-09-04 and reverted the same
     * day, because the two verification steps are not the same kind of thing:
     *
     *   BB84's check is DETERMINISTIC — compare the validation bits, they match
     *   or they do not.
     *   E91's check is STATISTICAL — S is noisy at the photon counts this game
     *   offers.
     *
     * With the checkbox kept, the CHSH tab returns for the Eve-free round
     * (`solo-game.tsx:124,142` gate on `gameHasEve`) and the student computes S
     * again. Per Task 52-C's measured table, at 10 photons only 37.5 % of
     * Eve-absent games show |S| > 2 — so ~62 % of the time the student correctly
     * reads S ≤ 2, clicks "not secure", and lands in `onUnsecure`'s else branch,
     * which declares a LOSS and calls `clearE91LocalStorage()`, taking the
     * results page with it (Task 52-G). They reasoned correctly and the game
     * punished them.
     *
     * Turning the checkbox off keeps that path unreachable after a restart. It
     * costs the student the confirmation round; it saves them from being told
     * they lost for being right. Align with BB84 once 52-C and 52-G are fixed —
     * tracked in Task 63.
     */
    const handleSoloRestart = () => {
        restartRound(e91Adapter, {withoutEve: true});
        setGameHasEve(false);
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
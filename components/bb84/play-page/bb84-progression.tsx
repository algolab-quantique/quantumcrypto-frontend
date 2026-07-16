'use client';

import React, {useEffect, useState} from 'react';
import GameProgression from '@/components/shared/game-progression';
import usePlayerStore from '@/store/player-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {useLanguage} from '@/components/providers/language-provider';
import {Button} from '@/components/ui/button';
import {useSocket} from '@/components/providers/socket-provider';
import {RESTART_WITHOUT_EVE_EVENT} from '@/bb84-constants';
import {useRouter} from 'next/navigation';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {abandon} from '@/lib/protocol-lifecycle/lifecycle';
import {bb84Adapter} from '@/lib/protocol-lifecycle/bb84-adapter';
import {toast} from 'sonner';
import {markSoloEveDetected, restartSoloRound} from '@/lib/bb84/solo-round';
import GameRestartDialog from '@/components/bb84/play-page/game-restart-dialog';

const Bb84Progression = () => {

    const {localize} = useLanguage();
    const {sendEvent, disconnectPlayRoom} = useSocket();
    const router = useRouter();

    const {gameCode} = useBB84GameStore();

    const {playerRole, partner: partnerName, playingSolo} = usePlayerStore();

    const {displayedLines} = useBB84ProgressStore();

    const {
        gameSuccess,
        evePresent,
        validated,
        validatedByPartner,
        eveUndetected,
    } = useBB84RoomStore();


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

    // Eve was detected and the round is over: the key is compromised.
    const eveRestartNeeded = evePresent && !eveUndetected &&
        (validated || validatedByPartner);

    // Task 51 ph.2: record the detection in the game's Eve story so the solo
    // results page can reveal "present and caught" even though the Eve-restart
    // wipes the round's evePresent flag.
    useEffect(() => {
        if (playingSolo && eveRestartNeeded) {
            markSoloEveDetected();
        }
    }, [playingSolo, eveRestartNeeded]);

    // Task 49-C: ONE blocking dialog for both modes (Solo/Multi Parity
    // Principle, ADR §11) and ONE semantic: the new round restarts WITHOUT Eve
    // (historical, deliberate design — ADR §12: deterministic BB84 Eve would
    // loop detect→restart forever; students must complete the protocol).
    // Only the coordination differs behind the shared UI: solo resolves
    // locally via the canonical helper; multi asks the backend so BOTH
    // players restart.
    const onEveReplay = () => {
        if (playingSolo) {
            restartSoloRound({withoutEve: true});
            toast.message('Game restarted', {
                description: localize('component.validation.gameRestarted'),
            });
            return;
        }
        sendEvent(RESTART_WITHOUT_EVE_EVENT);
    };

    // The quiet escape hatch: an explicit quit (Navigation Invariant's
    // "explicit user intent"). disconnectPlayRoom is a safe no-op in solo.
    // `exiting` keeps the dialog covering the screen while abandon() wipes
    // the stores and navigation completes (no empty-game flash) — abandon
    // resets the flags that hold `eveRestartNeeded` open.
    const [exiting, setExiting] = useState(false);
    const onEveExit = () => {
        setExiting(true);
        disconnectPlayRoom();
        abandon(bb84Adapter);
        router.replace('/bb84');
    };

    const goToResultsPage = () => {
        router.replace(`/games/bb84/${gameCode}/results`);
    };

    // Task 51 ph.2 (Parity Principle): solo mirrors multi — the félicitation
    // offers ONE action, "Voir les résultats"; Rejouer/Retour live on the
    // results page (like E91). Push (real destination): Back restores the
    // félicitation, per the Navigation Invariant.
    const goToSoloResultsPage = () => {
        router.push('/bb84/solo-results');
    };

    return (
        <GameProgression className="border-none">
            <GameRestartDialog
                restartModalOpen={eveRestartNeeded || exiting}
                title={localize('component.gameRestart.eveTitle')}
                description={localize('component.gameRestart.eveDescription')}
                confirmLabel={localize('component.gameRestart.playAgain')}
                onConfirm={onEveReplay}
                onExit={onEveExit}/>
            {getFeed()}
            {gameSuccess && <div className="w-full h-fit mb-1">
                {!playingSolo && <p className="text-card-foreground text-md md:text-xl">
                    {playerRole === 'A' ?
                        localize('component.messaging.alice.reveal') :
                        localize('component.messaging.bob.reveal')}
                    <span
                        className="font-bold text-highlight"> {partnerName}</span>
                </p>}
                {!playingSolo && <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToResultsPage}>{localize('component.results.seeResults')}</Button>
                </div>}
                {playingSolo && <div className="w-full h-fit mb-1 flex justify-center">
                    <Button onClick={goToSoloResultsPage}>{localize('component.results.seeResults')}</Button>
                </div>}
            </div>}
        </GameProgression>
    );
};

export default Bb84Progression;

'use client';

/**
 * BB84 Solo Results Page (Task 51 phase 2)
 *
 * A view of the persisted completed-solo session (Navigation Invariant: it is
 * URL-addressable, refreshable, and Back/Forward-safe — like the multiplayer
 * results route). Guarded by detectSession (ADR §11): only a COMPLETED solo
 * session may render; anything else fail-closes to /bb84 with nothing painted.
 * This is the template pattern E91/DPS adopt at replication.
 */

import React, {useEffect, useState} from 'react';
import SoloResultsTable from '@/components/bb84/results-page/solo-results-table';
import usePlayerStore from '@/store/player-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {useProtocolSessionGuard} from '@/lib/protocol-lifecycle/use-protocol-session-guard';
import {bb84Adapter} from '@/lib/protocol-lifecycle/bb84-adapter';
import {useLanguage} from '@/components/providers/language-provider';
import {
    readSoloEveRecord,
    readSoloGameStartTime,
    type SoloEveRecord,
} from '@/lib/bb84/solo-round';

const BB84SoloResultsPage = () => {
    const {localize} = useLanguage();
    const {playerName, playerRole} = usePlayerStore();
    const {keyBits} = useBB84RoomStore();

    // Task 54 F1: the shared guard — render nothing until the session resolves
    // as a COMPLETED SOLO game (anything else leaves quietly to /bb84, no
    // flash, and without abandoning: leaving a results page must never destroy
    // an active game). hydrate: restores the stores from the checkpoint so
    // fresh loads / Back / refresh all show the same view.
    const {ready} = useProtocolSessionGuard(bb84Adapter, {
        require: {completed: true, mode: 'solo'},
        failCloseTo: '/bb84',
        hydrate: true,
    });

    const [eveRecord, setEveRecord] = useState<SoloEveRecord | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (!ready) return;
        setEveRecord(readSoloEveRecord());
        const startTime = readSoloGameStartTime();
        if (startTime) {
            setElapsedTime((Date.now() - startTime) / 1000);
        }
    }, [ready]);

    if (!ready) {
        return null;
    }

    return (
        <div className="flex flex-col h-full max-h-full p-6 overflow-y-auto">
            <h1 className="font-bold text-2xl md:text-3xl text-foreground text-center">
                {localize('component.bb84.results.title')}
            </h1>
            <SoloResultsTable
                playerName={playerName}
                playerRole={playerRole}
                eveRecord={eveRecord}
                elapsedTime={elapsedTime}
                keyLength={keyBits.length}
            />
        </div>
    );
};

export default BB84SoloResultsPage;

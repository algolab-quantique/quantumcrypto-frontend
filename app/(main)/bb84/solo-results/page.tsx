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
import {useRouter} from 'next/navigation';
import SoloResultsTable from '@/components/bb84/results-page/solo-results-table';
import usePlayerStore from '@/store/player-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {detectSession, restoreCheckpoint} from '@/lib/protocol-lifecycle/lifecycle';
import {bb84Adapter} from '@/lib/protocol-lifecycle/bb84-adapter';
import {useLanguage} from '@/components/providers/language-provider';
import {
    readSoloEveRecord,
    readSoloGameStartTime,
    type SoloEveRecord,
} from '@/lib/bb84/solo-round';

const BB84SoloResultsPage = () => {
    const router = useRouter();
    const {localize} = useLanguage();
    const {playerName, playerRole} = usePlayerStore();
    const {keyBits} = useBB84RoomStore();

    const [ready, setReady] = useState(false);
    const [eveRecord, setEveRecord] = useState<SoloEveRecord | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        // Render-time gate: nothing paints until the session resolves as a
        // COMPLETED solo game; anything else leaves quietly (no flash).
        const detected = detectSession(bb84Adapter);
        if (detected.kind !== 'solo' || !detected.completed) {
            router.replace('/bb84');
            return;
        }

        // Hydrate the stores from the persisted checkpoint (fresh page load,
        // Back/Forward re-entry, refresh — all restore the same view).
        restoreCheckpoint(bb84Adapter);

        setEveRecord(readSoloEveRecord());
        const startTime = readSoloGameStartTime();
        if (startTime) {
            setElapsedTime((Date.now() - startTime) / 1000);
        }
        setReady(true);
    }, [router]);

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

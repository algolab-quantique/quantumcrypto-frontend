/**
 * E91 Solo Results Page
 * 
 * Displays game results for E91 solo mode.
 * Unlike multiplayer mode, this reads directly from Zustand stores
 * instead of WebSocket connections.
 * 
 * IMPORTANT: We read the INITIAL game configuration from localStorage
 * (e91GameHasEve, e91OriginalEvePresent) because the store state gets
 * reset when the game restarts after Eve detection.
 */

'use client';

import React, { useEffect, useState } from 'react';
import SoloResultsTable from '@/components/e91/results-page/solo-results-table';
import usePlayerStore from '@/store/player-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import {
    readSoloEveRecord,
    readSoloGameStartTime,
} from '@/lib/e91/solo-session';
import { useProtocolSessionGuard } from '@/lib/protocol-lifecycle/use-protocol-session-guard';
import { e91Adapter } from '@/lib/protocol-lifecycle/e91-adapter';
import { useLanguage } from '@/components/providers/language-provider';

const E91SoloResultsPage = () => {
    const { localize } = useLanguage();

    // Task 40 Phase 3b-2: the shared guard replaces the hand-rolled
    // isHydrated + playingSolo redirect. Three differences that matter:
    // the route now requires a COMPLETED SOLO session (a flag alone no longer
    // grants access); `hydrate` restores the stores from the checkpoint, so a
    // refresh here shows the same numbers instead of an empty table; and it
    // does NOT abandon on leave — leaving a results page must never destroy an
    // active game. Same call shape as bb84/solo-results/page.tsx.
    const { ready } = useProtocolSessionGuard(e91Adapter, {
        require: { completed: true, mode: 'solo' },
        failCloseTo: '/e91',
        hydrate: true,
    });

    // Player info
    const { playerName, playerRole } = usePlayerStore();

    // Game state from store (for gameSuccess and keyBits)
    const { gameSuccess, aliceValidBits, eveSpotted } = useE91RoomStore();

    // Task 40 Phase 3f: the game-scope Eve facts and the start time now come
    // from lib/e91/solo-session instead of four inline localStorage reads.
    // This page no longer touches localStorage at all. Same values, same
    // sources — the helper reads the same three keys this effect used to read
    // by hand, so nothing about what the table shows changes.
    const [elapsedTime, setElapsedTime] = useState(0);
    const [originalEveEnabled, setOriginalEveEnabled] = useState(false);
    const [originalEveWasPresent, setOriginalEveWasPresent] = useState(false);
    const [eveWasDetected, setEveWasDetected] = useState(false);

    useEffect(() => {
        // Wait for the guard: until it resolves, the stores are not hydrated
        // and this route may still turn out to be one the visitor may not see.
        if (!ready) return;

        // NOTE: recomputing from `Date.now()` on every mount is what makes the
        // reported time grow on each refresh — Task 62. Left as-is here on
        // purpose; Phase 3f moves the read, it does not change the number.
        const startTime = readSoloGameStartTime();
        if (startTime !== null) {
            setElapsedTime((Date.now() - startTime) / 1000);
        }

        // Set at game start and deliberately NOT reset by a restart.
        const eveRecord = readSoloEveRecord();
        setOriginalEveEnabled(eveRecord.enabled);
        setOriginalEveWasPresent(eveRecord.drawn);
        setEveWasDetected(eveRecord.detected);
    }, [ready]);

    // Render-time gate: nothing paints until the guard resolves the session as
    // a completed solo game. Anything else already left for /e91 from the hook.
    if (!ready) {
        return null;
    }

    const keyLength = aliceValidBits?.length || 0;

    return (
        <div className="mt-5 p-4">
            <h1 className="text-center text-3xl font-bold">
                {localize('component.e91.results.title') || 'E91 Solo Game Results'}
            </h1>

            <SoloResultsTable
                playerName={playerName || 'Player'}
                playerRole={playerRole}
                evePresent={originalEveWasPresent || originalEveEnabled}
                eveSpotted={eveWasDetected || eveSpotted}
                elapsedTime={elapsedTime}
                keyLength={keyLength}
                gameSuccess={gameSuccess}
            />
        </div>
    );
};

export default E91SoloResultsPage;


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

    // State for values read from localStorage
    const [elapsedTime, setElapsedTime] = useState(0);
    const [originalEveEnabled, setOriginalEveEnabled] = useState(false);
    const [originalEveWasPresent, setOriginalEveWasPresent] = useState(false);
    const [eveWasDetected, setEveWasDetected] = useState(false);

    useEffect(() => {
        // Wait for the guard: until it resolves, the stores are not hydrated
        // and this route may still turn out to be one the visitor may not see.
        if (!ready) return;

        // Get game start time from localStorage
        const startTimeStr = localStorage.getItem('e91GameStartTime');
        if (startTimeStr) {
            const startTime = parseInt(startTimeStr, 10);
            const endTime = Date.now();
            const elapsed = (endTime - startTime) / 1000; // seconds
            setElapsedTime(elapsed);
        }

        // Read ORIGINAL Eve configuration from localStorage
        // These are set at game start and NOT reset on game restart
        const gameHasEveStr = localStorage.getItem('e91GameHasEve');
        if (gameHasEveStr) {
            setOriginalEveEnabled(JSON.parse(gameHasEveStr));
        }

        // Check if Eve was actually present (from original game data)
        const originalEveStr = localStorage.getItem('e91OriginalEvePresent');
        if (originalEveStr) {
            setOriginalEveWasPresent(JSON.parse(originalEveStr));
        }

        // Check if Eve was detected (stored when user clicks "not secure")
        const eveDetectedStr = localStorage.getItem('e91EveWasDetected');
        if (eveDetectedStr) {
            setEveWasDetected(JSON.parse(eveDetectedStr));
        }
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


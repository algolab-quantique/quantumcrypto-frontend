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
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';

const E91SoloResultsPage = () => {
    const router = useRouter();
    const { localize } = useLanguage();

    // Player info
    const { playerName, playerRole, playingSolo } = usePlayerStore();

    // Game state from store (for gameSuccess and keyBits)
    const { gameSuccess, aliceValidBits, eveSpotted } = useE91RoomStore();

    // State for values read from localStorage
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
    const [originalEveEnabled, setOriginalEveEnabled] = useState(false);
    const [originalEveWasPresent, setOriginalEveWasPresent] = useState(false);
    const [eveWasDetected, setEveWasDetected] = useState(false);

    useEffect(() => {
        setIsHydrated(true);

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
    }, []);

    // Redirect if not in solo mode or not hydrated yet
    useEffect(() => {
        if (isHydrated && !playingSolo) {
            router.replace('/e91');
        }
    }, [isHydrated, playingSolo, router]);

    // Show nothing while hydrating
    if (!isHydrated) {
        return null;
    }

    // Redirect if not in solo mode
    if (!playingSolo) {
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


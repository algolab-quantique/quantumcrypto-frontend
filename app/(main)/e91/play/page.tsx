'use client';

import React, { useCallback } from 'react';
import Game from '@/components/e91/play-page/game';
import SoloGame from '@/components/e91/play-page/solo-game';
import E91ProgressionSidebar from '@/components/shared/e91-progression-sidebar';
import E91Button from '@/components/e91/play-page/e91-button';
import usePlayerStore from '@/store/player-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { usePreventNavigation } from '@/hooks/use-prevent-navigation';
import { clearE91LocalStorage } from '@/lib/e91/utils';

/**
 * E91 Play Page
 * 
 * Renders either the solo game or multiplayer game based on the playingSolo flag.
 * Solo game uses a dedicated SoloGame component with all logic in one file.
 * Multiplayer game uses the original Game component with WebSocket integration.
 * 
 * Both modes share the same header buttons (E91Button, E91ProgressionSidebar)
 * to maintain consistent UI experience.
 */
const PlayPage = () => {
    const { playingSolo } = usePlayerStore();
    const { gameSuccess } = useE91RoomStore();

    const handleNavCleanup = useCallback(() => {
        clearE91LocalStorage();
        usePlayerStore.getState().setPlayingSolo(false);
        usePlayerStore.getState().setPlayingMultiplayer(false);
    }, []);

    // Prevent navigation mid-game (warn user on browser back/close/refresh)
    usePreventNavigation(!gameSuccess, handleNavCleanup);

    return (
        <div className="flex flex-col h-full max-h-full">
            {/* Header buttons - shown for both solo and multiplayer */}
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <E91Button />
                <E91ProgressionSidebar />
            </div>
            {playingSolo ? <SoloGame /> : <Game />}
        </div>
    );
};

export default PlayPage;
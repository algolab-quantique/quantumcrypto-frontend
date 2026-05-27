'use client';

import React from 'react';
import MultiGame from '@/components/bb84/play-page/multi-game';
import SoloGame from '@/components/bb84/play-page/solo-game';
import BB84ProgressionSidebar from '@/components/shared/bb84-progression-sidebar';
import Bb84Button from '@/components/bb84/play-page/bb84-button';
import usePlayerStore from '@/store/player-store';

const PlayPage = () => {
    const { playingSolo } = usePlayerStore();

    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <Bb84Button />
                <BB84ProgressionSidebar />
            </div>
            {playingSolo ? <SoloGame /> : <MultiGame />}
        </div>
    );
};

export default PlayPage;
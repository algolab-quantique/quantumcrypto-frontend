'use client';

import React from 'react';
import MultiGame from '@/components/dps/play-page/multi-game';
import SoloGame from '@/components/dps/play-page/solo-game';
import DPSPlayShell from '@/components/dps/play-page/dps-play-shell';
import usePlayerStore from '@/store/player-store';

const PlayPage = () => {
    const { playingSolo } = usePlayerStore();

    return (
        <DPSPlayShell>
            {playingSolo ? <SoloGame /> : <MultiGame />}
        </DPSPlayShell>
    );
};

export default PlayPage;

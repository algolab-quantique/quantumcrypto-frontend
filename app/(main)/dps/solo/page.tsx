'use client';

import React from 'react';
import SoloGame from '@/components/dps/play-page/solo-game';
import DPSPlayShell from '@/components/dps/play-page/dps-play-shell';

const PlayPage = () => {

    return (
        <DPSPlayShell>
            <SoloGame />
        </DPSPlayShell>
    );
};

export default PlayPage;

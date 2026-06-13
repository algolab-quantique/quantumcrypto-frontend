import React from 'react';
import MultiGame from '@/components/dps/play-page/multi-game';
import DPSPlayShell from '@/components/dps/play-page/dps-play-shell';

const PlayPage = () => {

    return (
        <DPSPlayShell>
            <MultiGame />
        </DPSPlayShell>
    );
};

export default PlayPage;

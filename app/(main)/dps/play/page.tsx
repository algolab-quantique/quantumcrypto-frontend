import React from 'react';
import Game from '@/components/dps/play-page/game';
import DPSProgressionSidebar from '@/components/shared/dps-progression-sidebar';

const PlayPage = () => {

    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <DPSProgressionSidebar/>
            </div>
            <Game/>
        </div>
    );
};

export default PlayPage;
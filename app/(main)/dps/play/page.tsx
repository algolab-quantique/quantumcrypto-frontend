import React from 'react';
import MultiGame from '@/components/dps/play-page/multi-game';
import DPSProgressionSidebar from '@/components/shared/dps-progression-sidebar';

const PlayPage = () => {

    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <DPSProgressionSidebar/>
            </div>
            <MultiGame/>
        </div>
    );
};

export default PlayPage;
'use client';

import {Button} from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import {MessageCircle} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useDPSProgressStore} from '@/store/dps/dps-progress-store';
import DPSProgression from '@/components/dps/play-page/dps-progression';

const DPSProgressionSidebar = () => {

    const [newMessage, setNewMessage] = useState(false);
    const displayedLinesLength = useDPSProgressStore(
        state => state.displayedLines).length;

    useEffect(() => {
        setNewMessage(true);
    }, [displayedLinesLength]);

    return (
        <div
            className="inline-flex relative md:hidden md:absolute md:top-0 md:z-0 group transition-all">
            {newMessage && <div
                className="absolute top-0 right-0 -mt-1 -mr-1 rounded-full w-2.5 h-2.5 bg-red">
                <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
            </div>}
            <Sheet onOpenChange={() => setNewMessage(false)}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <MessageCircle/>
                    </Button>
                </SheetTrigger>
                <SheetContent className="p-2 border-none">
                    <DPSProgression />
                </SheetContent>
            </Sheet>
        </div>

    );
};

export default DPSProgressionSidebar;

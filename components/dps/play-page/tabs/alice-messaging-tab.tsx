import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody, TableCell,
} from '@/components/ui/table';
import React, { useState, useEffect} from 'react';
import {CheckCircle2, Send} from 'lucide-react';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {clearBB84LocalStorage} from '@/lib/bb84/utils';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/providers/language-provider';
import {useSocket} from '@/components/providers/socket-provider';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {forbiddenSymbols} from '@/lib/utils';
import usePlayerStore from '@/store/player-store';

const AliceMessagingTab = () => {

    

    return(
        <div className="block border
                            text-card-foreground border-secondary bg-card shadow-lg
                            rounded-lg">
            <h1>Alice Messaging</h1>
        </div>            
    );



};

export default AliceMessagingTab;   
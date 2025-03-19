import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody, TableCell,
} from '@/components/ui/table';
import React, { useState} from 'react';
import {CheckCircle2, Send} from 'lucide-react';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
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

const MessagingTab = ({playerRole}: { playerRole: string }) => {

    const {localize} = useLanguage();
    const {sendCipher, sendBobSuccess} = useSocket();

    const {pushLines} = useBB84ProgressStore();

    return(
        <div className="block border
                            text-card-foreground border-secondary bg-card shadow-lg
                            rounded-lg">
                <Table className="w-full">
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow className="text-sm md:text-lg border-secondary">
                            
                            <TableHead className="text-center rounded-tl-lg">
                                <p>{localize('component.messaging.yourKey')}</p>
                            </TableHead>
                            <TableHead className="text-center rounded-tl-lg">
                                <p>{localize('component.messaging.yourKey')}</p>
                            </TableHead>
                            <TableHead className="text-center">
                                <p>{playerRole === 'A' ?
                                    localize('component.messaging.yourMessage') :
                                    localize(
                                        'component.messaging.aliceEncrypted')}</p>
                            </TableHead>
                            <TableHead className="text-center rounded-tr-lg">
                                <p>{playerRole === 'A' ?
                                    localize('component.messaging.yourEncrypted') :
                                    localize(
                                        'component.messaging.aliceDecrypt')}</p>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    
                </Table>
        </div>            
    );



};

export default MessagingTab;    
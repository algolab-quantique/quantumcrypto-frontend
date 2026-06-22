'use client';

import React, { ReactNode, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import DPSButton from '@/components/dps/play-page/dps-button';
import DPSProgressionSidebar from '@/components/shared/dps-progression-sidebar';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useSocket } from '@/components/providers/socket-provider';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import usePlayerStore from '@/store/player-store';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DPSPlayShellProps = {
    children: ReactNode;
};

const DPSPlayShell = ({ children }: DPSPlayShellProps) => {
    const { gameSuccess } = useDPSRoomStore();
    const { disconnectPlayRoom } = useSocket();
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingDestination, setPendingDestination] = useState('/dps');

    const cleanupActiveGame = useCallback(() => {
        setIsLeaving(true);
        setLeaveDialogOpen(false);
        disconnectPlayRoom();
        clearDPSLocalStorage();
        usePlayerStore.getState().setPlayingSolo(false);
        usePlayerStore.getState().setPlayingMultiplayer(false);
    }, [disconnectPlayRoom]);

    const leaveGame = useCallback((destination: string) => {
        cleanupActiveGame();
        router.replace(destination);
    }, [cleanupActiveGame, router]);

    const requestLeave = useCallback((destination: string) => {
        if (gameSuccess) {
            leaveGame(destination);
            return;
        }

        setPendingDestination(destination);
        setLeaveDialogOpen(true);
    }, [gameSuccess, leaveGame]);

    const stayInGame = () => {
        setLeaveDialogOpen(false);
    };

    const quitGame = () => {
        leaveGame(pendingDestination);
    };

    return (
        <div className="flex flex-col h-full max-h-full">
            <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                <AlertDialogContent className="border-primary/30 bg-card/95">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Quitter la partie ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Votre progression de cette partie sera effacée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={stayInGame}>
                            Rester dans la partie
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={quitGame}>
                            Quitter la partie
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex w-full gap-x-3 px-6 pt-5">
                <DPSButton onRequestLeave={() => requestLeave('/dps')} />
                <DPSProgressionSidebar />
            </div>
            {isLeaving ? (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    Déconnexion...
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default DPSPlayShell;

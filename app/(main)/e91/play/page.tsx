'use client';

import React, { useCallback, useState } from 'react';
import MultiGame from '@/components/e91/play-page/multi-game';
import SoloGame from '@/components/e91/play-page/solo-game';
import E91ProgressionSidebar from '@/components/shared/e91-progression-sidebar';
import E91Button from '@/components/e91/play-page/e91-button';
import usePlayerStore from '@/store/player-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { abandon } from '@/lib/protocol-lifecycle/lifecycle';
import { e91Adapter } from '@/lib/protocol-lifecycle/e91-adapter';
import { useSocket } from '@/components/providers/socket-provider';
import { useRouter } from 'next/navigation';
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

/**
 * E91 Play Page
 * 
 * Renders either the solo game or multiplayer game based on the playingSolo flag.
 * Solo game uses a dedicated SoloGame component with all logic in one file.
 * Multiplayer game uses the original Game component with WebSocket integration.
 * 
 * Both modes share the same header buttons (E91Button, E91ProgressionSidebar)
 * to maintain consistent UI experience.
 */
const PlayPage = () => {
    const { playingSolo } = usePlayerStore();
    const { gameSuccess } = useE91RoomStore();
    const { disconnectPlayRoom } = useSocket();
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingDestination, setPendingDestination] = useState('/e91');

    const cleanupActiveGame = useCallback(() => {
        setIsLeaving(true);
        setLeaveDialogOpen(false);
        disconnectPlayRoom();
        // Task 40 Phase 3a: `abandon(e91Adapter)` is exactly what the three
        // lines below it used to be — clear the 11 e91* keys, reset the room
        // and progress stores, then drop both player-mode flags. Same shape
        // BB84 uses on its play route.
        abandon(e91Adapter);
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

            {/* Header buttons - shown for both solo and multiplayer */}
            <div className="flex w-full gap-x-3 px-6 pt-5">
                <E91Button onRequestLeave={() => requestLeave('/e91')} />
                <E91ProgressionSidebar />
            </div>
            {isLeaving ? (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    Déconnexion...
                </div>
            ) : (
                playingSolo ? <SoloGame /> : <MultiGame />
            )}
        </div>
    );
};

export default PlayPage;

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import MultiGame from '@/components/bb84/play-page/multi-game';
import SoloGame from '@/components/bb84/play-page/solo-game';
import BB84ProgressionSidebar from '@/components/shared/bb84-progression-sidebar';
import Bb84Button from '@/components/bb84/play-page/bb84-button';
import usePlayerStore from '@/store/player-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import { abandon, detectSession } from '@/lib/protocol-lifecycle/lifecycle';
import { bb84Adapter } from '@/lib/protocol-lifecycle/bb84-adapter';
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

const PlayPage = () => {
    const { gameSuccess } = useBB84RoomStore();
    const { disconnectPlayRoom } = useSocket();
    const router = useRouter();
    const [isLeaving, setIsLeaving] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingDestination, setPendingDestination] = useState('/bb84');

    // Task 48 D3: choose solo vs multi from detectSession (single source of truth)
    // instead of the drifting playingSolo flag. detectSession reads localStorage,
    // which is empty during SSR, so resolve after mount (null = not resolved yet →
    // render nothing for the game area; the is-connected HOC already gates its child
    // until hydrated, so this adds no new flash). Fall back to playingSolo only when
    // detectSession cannot classify (none/corrupt) — the is-connected HOC still
    // guards access in D3. Mode is fixed at mount: a game's mode never changes
    // mid-session.
    const [mode, setMode] = useState<'solo' | 'multi' | null>(null);
    useEffect(() => {
        const detected = detectSession(bb84Adapter);
        if (detected.kind === 'multi') setMode('multi');
        else if (detected.kind === 'solo') setMode('solo');
        else setMode(usePlayerStore.getState().playingSolo ? 'solo' : 'multi');
    }, []);

    const cleanupActiveGame = useCallback(() => {
        setIsLeaving(true);
        setLeaveDialogOpen(false);
        disconnectPlayRoom();
        abandon(bb84Adapter);
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
                <Bb84Button onRequestLeave={() => requestLeave('/bb84')} />
                <BB84ProgressionSidebar />
            </div>
            {isLeaving ? (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    Déconnexion...
                </div>
            ) : mode === 'solo' ? (
                <SoloGame />
            ) : mode === 'multi' ? (
                <MultiGame />
            ) : null}
        </div>
    );
};

export default PlayPage;

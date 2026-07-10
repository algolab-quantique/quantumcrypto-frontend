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

    // Task 48 D4a: PlayPage owns the route guard AND the mode choice, both from
    // detectSession (single source of truth; ADR §11 Navigation Invariant).
    // detectSession reads localStorage (empty during SSR), so it resolves in a
    // mount effect; until resolved, the WHOLE page renders null — no shell paint,
    // so an invalid entry redirects without any flash (the Slice C failure mode).
    // Valid sessions (active or completed, solo or multi) always render — completed
    // restores the félicitation screen. Fail-close ONLY when there is no session at
    // all (none) or it is unreadable (corrupt): abandon clears any corrupt leftovers
    // (safe no-op for none) and we leave via replace. Target '/' (not '/bb84'):
    // replacing toward '/bb84' can recreate the adjacent-duplicate history jank when
    // the previous entry is '/bb84' (Slice C); revisit after D4b if desired.
    // Mode is fixed at mount: a game's mode never changes mid-session.
    const [mode, setMode] = useState<'solo' | 'multi' | null>(null);
    useEffect(() => {
        const detected = detectSession(bb84Adapter);
        if (detected.kind === 'multi' || detected.kind === 'solo') {
            // Bridge (Task 48 D5a): re-assert the legacy mode flags from the
            // session truth. The landing page resets them, but many components
            // still branch on playingSolo (bb84-progression's ending block, the
            // five tab components, MultiGame's restore gate) — without this, a
            // restored solo félicitation renders the MULTI ending block (wrong
            // buttons + 404 results link). Flags become a derived cache written
            // only here; readers migrate off them later.
            usePlayerStore.getState().setPlayingSolo(detected.kind === 'solo');
            usePlayerStore.getState().setPlayingMultiplayer(detected.kind === 'multi');
            setMode(detected.kind);
        } else {
            abandon(bb84Adapter);
            router.replace('/');
        }
    }, [router]);

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

    // Render-time gate (D4a): nothing paints until the session is resolved as
    // valid — invalid entries redirect from the effect above while this stays null.
    if (mode === null) {
        return null;
    }

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
            ) : (
                <MultiGame />
            )}
        </div>
    );
};

export default PlayPage;

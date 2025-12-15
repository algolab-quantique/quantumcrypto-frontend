'use client';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/components/providers/socket-provider';
import { redirect } from 'next/navigation';
import usePlayerStore from '@/store/player-store';

const isConnected = (Component: any) => {

    return function IsAuth(props: any) {
        const { isWaitingRoomConnected, isPlayRoomConnected } = useSocket();
        const { playingSolo, playingMultiplayer } = usePlayerStore();
        const [isHydrated, setIsHydrated] = useState(false);

        // Wait for Zustand to hydrate from localStorage before checking connection
        useEffect(() => {
            setIsHydrated(true);
        }, []);

        // Allow access if:
        // - playingSolo (solo mode persisted)
        // - playingMultiplayer (multiplayer session persisted, allows reconnection)
        // - isWaitingRoomConnected (WebSocket connected to waiting room)
        // - isPlayRoomConnected (WebSocket connected to play room)
        const connected = playingSolo || playingMultiplayer || isWaitingRoomConnected ||
            isPlayRoomConnected;

        useEffect(() => {
            // Only redirect after hydration is complete
            if (isHydrated && !connected) {
                return redirect('/');
            }
        }, [connected, isHydrated]);

        // Show nothing while hydrating (prevents flash)
        if (!isHydrated) {
            return null;
        }

        if (!connected) {
            return null;
        }

        return <Component {...props} />;
    };
};

export default isConnected;
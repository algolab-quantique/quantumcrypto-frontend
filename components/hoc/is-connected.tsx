'use client';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/components/providers/socket-provider';
import { redirect } from 'next/navigation';
import usePlayerStore from '@/store/player-store';

// Read from localStorage directly (synchronous, no hydration issues)
const checkLocalStorageForSession = (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
        const playerStorage = localStorage.getItem('player-storage');
        if (playerStorage) {
            const data = JSON.parse(playerStorage);
            // Zustand persist stores state under 'state' key
            return data?.state?.playingMultiplayer === true || data?.state?.playingSolo === true;
        }
    } catch {
        return false;
    }
    return false;
};

const isConnected = (Component: any) => {

    return function IsAuth(props: any) {
        const { isWaitingRoomConnected, isPlayRoomConnected } = useSocket();
        const { playingSolo, playingMultiplayer } = usePlayerStore();
        const [isHydrated, setIsHydrated] = useState(false);
        const [hasLocalSession, setHasLocalSession] = useState(false);

        // On mount, immediately check localStorage directly (synchronous)
        useEffect(() => {
            const hasSession = checkLocalStorageForSession();
            setHasLocalSession(hasSession);
            setIsHydrated(true);
        }, []);

        // Allow access if:
        // - hasLocalSession (from direct localStorage check - most reliable)
        // - playingSolo (from Zustand after hydration)
        // - playingMultiplayer (from Zustand after hydration)
        // - isWaitingRoomConnected (WebSocket connected to waiting room)
        // - isPlayRoomConnected (WebSocket connected to play room)
        const connected = hasLocalSession || playingSolo || playingMultiplayer ||
            isWaitingRoomConnected || isPlayRoomConnected;

        useEffect(() => {
            // Only redirect after we've checked localStorage
            if (isHydrated && !connected) {
                return redirect('/');
            }
        }, [connected, isHydrated]);

        // Show nothing while checking localStorage (prevents flash)
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
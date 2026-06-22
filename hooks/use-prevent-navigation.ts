'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook to prevent accidental navigation (browser back, tab close, or refresh)
 * during active game sessions.
 * 
 * @param shouldBlock - Boolean flag to activate/deactivate the lock (e.g. active game)
 * @param onConfirmCleanup - Callback to clean up state/localStorage if user confirms exit
 */
export const usePreventNavigation = (shouldBlock: boolean, onConfirmCleanup?: () => void) => {
    const router = useRouter();

    useEffect(() => {
        if (!shouldBlock) return;

        // 1. [DISABLED] Intercept page refresh, close tab, typing new URL in address bar
        // Currently not needed because localStorage saves and restores game state on refresh.
        // In the future, consider re-enabling selectively for:
        //   - Close tab (game progress lost if user never returns)
        //   - Typing a new URL (unexpected navigation away)
        // const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        //     e.preventDefault();
        //     e.returnValue = ''; // Chrome & other browsers require this
        //     return '';
        // };

        // 2. Intercept browser back button
        // Push a dummy history entry so the first back click pops this entry instead of leaving
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            const confirmed = window.confirm(
                'Quitter la partie ? Votre progression sera perdue.'
            );
            if (confirmed) {
                if (onConfirmCleanup) {
                    onConfirmCleanup();
                }
                router.replace('/');
            } else {
                // If cancelled, re-push the dummy entry to restore the back-button trap
                window.history.pushState(null, '', window.location.href);
            }
        };

        // window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            // window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [shouldBlock, onConfirmCleanup, router]);
};

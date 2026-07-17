'use client';

/**
 * The protocol route guard (Task 54 F1) — ONE implementation of the pattern
 * the BB84 pilot proved (ADR §11): a route renders NOTHING until the persisted
 * session resolves as valid for it (render-time gate, no flash); an invalid
 * entry leaves quietly; mode comes from the session, and the legacy mode flags
 * are re-asserted from it (the D5a bridge) so flag-readers see truth.
 *
 * All policy lives in the pure `resolveSessionForRoute` (unit-tested);
 * this hook only adds the React mechanics. E91/DPS pages adopt this hook at
 * replication instead of hand-copying the pattern.
 *
 * Usage:
 *   const {mode, ready} = useProtocolSessionGuard(bb84Adapter, {
 *       abandonOnLeave: true,          // play page: clear corrupt leftovers
 *   });
 *   if (!ready) return null;
 *
 *   const {ready} = useProtocolSessionGuard(bb84Adapter, {
 *       require: {completed: true, mode: 'solo'},
 *       failCloseTo: '/bb84',
 *       hydrate: true,                 // results page: hydrate stores itself
 *   });
 */

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import usePlayerStore from '@/store/player-store';
import {
    abandon,
    resolveSessionForRoute,
    restoreCheckpoint,
    type RouteSessionRequirement,
} from './lifecycle';
import type {ProtocolAdapter} from './types';

export const useProtocolSessionGuard = (
    adapter: ProtocolAdapter,
    options?: {
        require?: RouteSessionRequirement;
        /** Where to leave to when there is no valid session. Default '/'
         *  (replace toward the protocol home can mint adjacent-duplicate
         *  history when the previous entry IS the protocol home — ADR §11
         *  rule 2). */
        failCloseTo?: string;
        /** Also abandon() before leaving (play pages: clears corrupt
         *  leftovers; safe no-op when there is nothing). Results pages must
         *  NOT abandon — leaving them may not destroy an active game. */
        abandonOnLeave?: boolean;
        /** Hydrate the stores via restoreCheckpoint after a successful
         *  resolution (pages whose children do not restore themselves). */
        hydrate?: boolean;
    },
) => {
    const router = useRouter();
    const [mode, setMode] = useState<'solo' | 'multi' | null>(null);

    useEffect(() => {
        // detectSession reads localStorage (empty during SSR), so resolution
        // happens after mount; until then the caller renders null.
        const resolution = resolveSessionForRoute(adapter, options?.require);

        if (resolution.action === 'leave') {
            if (options?.abandonOnLeave) {
                abandon(adapter);
            }
            router.replace(options?.failCloseTo ?? '/');
            return;
        }

        // The flag bridge (Task 48 D5a): legacy flag-readers see session truth.
        usePlayerStore.getState().setPlayingSolo(resolution.mode === 'solo');
        usePlayerStore.getState().setPlayingMultiplayer(resolution.mode === 'multi');

        if (options?.hydrate) {
            restoreCheckpoint(adapter);
        }
        setMode(resolution.mode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adapter, router]);

    return {mode, ready: mode !== null};
};

/**
 * DPS progress UI store.
 *
 * Tracks the active step, active tab, and transcript lines shown to the player.
 * Stays focused on presentation concerns — protocol state lives in dps-room-store,
 * lobby config in dps-game-store.
 *
 * BUG FIXED: the original setDisplayedLines did not persist to localStorage,
 * meaning a page refresh would silently lose the transcript. Fixed here.
 *
 * All localStorage access is guarded with isBrowser() for Next.js SSR safety.
 *
 * Usage — rehydrate once in a client-only effect:
 *   useEffect(() => { hydrateDPSProgressStore(); }, []);
 */

import {DPSGameStep, Line} from '@/types';
import {create} from 'zustand';

// =========================================================================
// Storage key registry.
// =========================================================================
const STORAGE_KEYS = {
    step:           'dpsStep',
    dpsTab:         'dpsTab',
    displayedLines: 'dpsDisplayedLines',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

// =========================================================================
// State shape and initial values.
// =========================================================================
const initialProgressState = {
    step:           DPSGameStep.EXCHANGE,
    dpsTab:         'exchange',
    displayedLines: [] as Line[],
};

type DPSProgressState = typeof initialProgressState;

interface DPSProgressStore extends DPSProgressState {
    setStep:            (step: DPSGameStep) => void;
    setDPSTab:          (tab: string) => void;
    setDisplayedLines:  (lines: Line[]) => void;
    pushLines:          (lines: Line[]) => void;
    hydrateFromStorage: () => void;
    resetProgress:      () => void;
}

// =========================================================================
// localStorage helpers — all guarded for SSR safety.
// =========================================================================
const isBrowser = () => typeof window !== 'undefined';

const persistValue = <K extends StorageKey>(key: K, value: DPSProgressState[K]) => {
    if (!isBrowser()) return;
    const serialised = key === 'dpsTab' ? String(value) : JSON.stringify(value);
    localStorage.setItem(STORAGE_KEYS[key], serialised);
};

const removePersistedValue = (key: StorageKey) => {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS[key]);
};

const readPersistedValue = <K extends StorageKey>(key: K): DPSProgressState[K] | undefined => {
    if (!isBrowser()) return undefined;

    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    if (stored === null) return undefined;

    try {
        return key === 'dpsTab'
            ? (stored as DPSProgressState[K])
            : (JSON.parse(stored) as DPSProgressState[K]);
    } catch (error) {
        console.warn('[dps-progress-store] Unable to parse localStorage value', {
            key: STORAGE_KEYS[key],
            error,
        });
        removePersistedValue(key);
        return undefined;
    }
};

// =========================================================================
// Store implementation.
// =========================================================================
export const useDPSProgressStore = create<DPSProgressStore>((set, get) => ({
    ...initialProgressState,

    setStep: (step) => {
        persistValue('step', step);
        set({step});
    },

    setDPSTab: (tab) => {
        persistValue('dpsTab', tab);
        set({dpsTab: tab});
    },

    // BUG FIX: original was set({displayedLines: lines}) with no localStorage write.
    setDisplayedLines: (lines) => {
        persistValue('displayedLines', lines);
        set({displayedLines: lines});
    },

    pushLines: (lines) => {
        if (lines.length === 0) return;
        const updatedLines = [...get().displayedLines, ...lines];
        persistValue('displayedLines', updatedLines);
        set({displayedLines: updatedLines});
    },

    hydrateFromStorage: () => {
        const maybeStep  = readPersistedValue('step');
        const maybeTab   = readPersistedValue('dpsTab');
        const maybeLines = readPersistedValue('displayedLines');

        const next: Partial<DPSProgressState> = {};
        if (typeof maybeStep === 'number') next.step           = maybeStep;
        if (typeof maybeTab === 'string')   next.dpsTab         = maybeTab;
        if (Array.isArray(maybeLines))     next.displayedLines = maybeLines;

        if (Object.keys(next).length > 0) set(next);
    },

    resetProgress: () => {
        (Object.keys(STORAGE_KEYS) as StorageKey[]).forEach(removePersistedValue);
        set({...initialProgressState});
    },
}));

// =========================================================================
// Public hydration helper — call this in a client-only useEffect.
// =========================================================================
export const hydrateDPSProgressStore = () => {
    if (!isBrowser()) return;
    useDPSProgressStore.getState().hydrateFromStorage();
};

export const DPS_PROGRESS_INITIAL_STATE = initialProgressState;

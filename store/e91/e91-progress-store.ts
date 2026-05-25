/**
 * E91 progress UI store.
 *
 * Tracks the active step, active tab, and transcript lines shown to the player.
 * Stays focused on presentation concerns — protocol state lives in e91-room-store,
 * lobby config in e91-game-store.
 *
 * All localStorage access is guarded with isBrowser() for Next.js SSR safety.
 *
 * Usage — rehydrate once in a client-only effect:
 *   useEffect(() => { hydrateE91ProgressStore(); }, []);
 */

import {E91GameStep, Line} from '@/types';
import {create} from 'zustand';

// =========================================================================
// Storage key registry.
// =========================================================================
const STORAGE_KEYS = {
    step:           'e91Step',
    e91Tab:         'e91Tab',
    displayedLines: 'e91DisplayedLines',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

// =========================================================================
// Typed tab union — typos in tab names become compile errors.
// Update this union if you add or rename a tab.
// =========================================================================
type E91Tab = 'measurement' | 'bases' | 'validation' | 'messaging';

// =========================================================================
// State shape and initial values.
// =========================================================================
const initialProgressState = {
    step:           E91GameStep.MEASUREMENT,
    e91Tab:         'measurement' as E91Tab,
    displayedLines: [] as Line[],
};

type E91ProgressState = typeof initialProgressState;

interface E91ProgressStore extends E91ProgressState {
    setStep:            (step: E91GameStep) => void;
    setE91Tab:          (tab: E91Tab) => void;
    setDisplayedLines:  (lines: Line[]) => void;
    pushLines:          (lines: Line[]) => void;
    hydrateFromStorage: () => void;
    resetProgress:      () => void;
}

// =========================================================================
// localStorage helpers — all guarded for SSR safety.
// =========================================================================
const isBrowser = () => typeof window !== 'undefined';

const persistValue = <K extends StorageKey>(key: K, value: E91ProgressState[K]) => {
    if (!isBrowser()) return;
    const serialised = key === 'e91Tab' ? String(value) : JSON.stringify(value);
    localStorage.setItem(STORAGE_KEYS[key], serialised);
};

const removePersistedValue = (key: StorageKey) => {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS[key]);
};

const readPersistedValue = <K extends StorageKey>(key: K): E91ProgressState[K] | undefined => {
    if (!isBrowser()) return undefined;

    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    if (stored === null) return undefined;

    try {
        return key === 'e91Tab'
            ? (stored as E91ProgressState[K])
            : (JSON.parse(stored) as E91ProgressState[K]);
    } catch (error) {
        console.warn('[e91-progress-store] Unable to parse localStorage value', {
            key: STORAGE_KEYS[key],
            error,
        });
        removePersistedValue(key);
        return undefined;
    }
};

const isE91Tab = (value: unknown): value is E91Tab =>
    value === 'measurement' || value === 'bases' ||
    value === 'validation'  || value === 'messaging';

// =========================================================================
// Store implementation.
// =========================================================================
export const useE91ProgressStore = create<E91ProgressStore>((set, get) => ({
    ...initialProgressState,

    setStep: (step) => {
        persistValue('step', step);
        set({step});
    },

    setE91Tab: (tab) => {
        persistValue('e91Tab', tab);
        set({e91Tab: tab});
    },

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
        const maybeTab   = readPersistedValue('e91Tab');
        const maybeLines = readPersistedValue('displayedLines');

        const next: Partial<E91ProgressState> = {};
        if (typeof maybeStep === 'number') next.step           = maybeStep;
        if (isE91Tab(maybeTab))            next.e91Tab         = maybeTab;
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
export const hydrateE91ProgressStore = () => {
    if (!isBrowser()) return;
    useE91ProgressStore.getState().hydrateFromStorage();
};

export const E91_PROGRESS_INITIAL_STATE = initialProgressState;
export type {E91Tab};
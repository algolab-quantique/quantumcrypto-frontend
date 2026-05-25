/**
 * BB84 progress UI store.
 *
 * Tracks how far a player has progressed through the walkthrough: active step,
 * active tab, and which narrative transcript lines have been shown. It sits
 * alongside the gameplay stores but stays focused on presentation concerns so
 * the protocol state (bb84-room-store) and the lobby config (bb84-game-store)
 * remain cleanly separated.
 *
 * Key fields are synchronised with `localStorage` so a page refresh keeps the
 * player on the same tab with the same transcript. All reads are guarded with
 * `isBrowser()` so the module is safe to import in a Next.js server context.
 *
 * Usage — rehydrate once in a client-only effect:
 *   useEffect(() => { hydrateBB84ProgressStore(); }, []);
 */

import {BB84GameStep, Line} from '@/types';
import {create} from 'zustand';

// =========================================================================
// Storage key registry — one place to rename a key.
// =========================================================================
const STORAGE_KEYS = {
    step:           'bb84Step',
    bb84Tab:        'bb84Tab',
    displayedLines: 'bb84DisplayedLines',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

// =========================================================================
// State shape and initial values.
// =========================================================================
const initialProgressState = {
    step:           BB84GameStep.EXCHANGE,
    bb84Tab:        'exchange',
    displayedLines: [] as Line[],
};

type BB84ProgressState = typeof initialProgressState;

interface BB84ProgressStore extends BB84ProgressState {
    setStep:            (step: BB84GameStep) => void;
    setBb84Tab:         (tab: string) => void;
    setDisplayedLines:  (lines: Line[]) => void;
    pushLines:          (lines: Line[]) => void;
    hydrateFromStorage: () => void;
    resetProgress:      () => void;
}

// =========================================================================
// localStorage helpers — all guarded for SSR safety.
// =========================================================================
const isBrowser = () => typeof window !== 'undefined';

const persistValue = <K extends StorageKey>(key: K, value: BB84ProgressState[K]) => {
    if (!isBrowser()) return;
    const serialised = key === 'bb84Tab' ? String(value) : JSON.stringify(value);
    localStorage.setItem(STORAGE_KEYS[key], serialised);
};

const removePersistedValue = (key: StorageKey) => {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS[key]);
};

const readPersistedValue = <K extends StorageKey>(key: K): BB84ProgressState[K] | undefined => {
    if (!isBrowser()) return undefined;

    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    if (stored === null) return undefined;

    try {
        return key === 'bb84Tab'
            ? (stored as BB84ProgressState[K])
            : (JSON.parse(stored) as BB84ProgressState[K]);
    } catch (error) {
        console.warn('[bb84-progress-store] Unable to parse localStorage value', {
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
export const useBB84ProgressStore = create<BB84ProgressStore>((set, get) => ({
    ...initialProgressState,

    setStep: (step) => {
        persistValue('step', step);
        set({step});
    },

    setBb84Tab: (tab) => {
        persistValue('bb84Tab', tab);
        set({bb84Tab: tab});
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
        const maybeTab   = readPersistedValue('bb84Tab');
        const maybeLines = readPersistedValue('displayedLines');

        const next: Partial<BB84ProgressState> = {};
        if (typeof maybeStep === 'number') next.step           = maybeStep;
        if (typeof maybeTab === 'string')   next.bb84Tab        = maybeTab;
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
export const hydrateBB84ProgressStore = () => {
    if (!isBrowser()) return;
    useBB84ProgressStore.getState().hydrateFromStorage();
};

export const BB84_PROGRESS_INITIAL_STATE = initialProgressState;

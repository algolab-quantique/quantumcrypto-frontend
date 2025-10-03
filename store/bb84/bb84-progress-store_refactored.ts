
// not used yet... (to be concidered for future refactoring)

/**
 * BB84 progress UI store (refactored version).
 *
 * This alternative implementation keeps the original behaviour—tracking the
 * walkthrough step, the active tab, and the transcript lines—while applying a
 * few quality-of-life improvements:
 *
 * - Centralised storage helpers (`persistValue`, `readPersistedValue`) avoid
 *   sprinkling `localStorage` calls throughout the setters and keep the values
 *   serialised consistently.
 * - A typed `BB84Tab` union documents the supported tabs at the type level and
 *   prevents typos when calling the setters.
 * - `hydrateFromStorage` can be invoked from a client component (e.g. within a
 *   `useEffect`) to restore the persisted state after a refresh without touching
 *   `localStorage` during server rendering.
 * - `resetProgress` now clears the corresponding `localStorage` entries so a new
 *   session always starts from a clean slate.
 */

import {BB84GameStep, Line} from '@/types';
import {create} from 'zustand';

const STORAGE_KEYS = {
    step: 'bb84Step',
    bb84Tab: 'bb84Tab',
    displayedLines: 'bb84DisplayedLines',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

type BB84Tab = 'exchange' | 'basis' | 'validation' | 'messaging';

const initialProgressState = {
    step: BB84GameStep.EXCHANGE,
    bb84Tab: 'exchange' as BB84Tab,
    displayedLines: [] as Line[],
};

type BB84ProgressState = typeof initialProgressState;

interface BB84ProgressStore extends BB84ProgressState {
    setStep: (step: BB84GameStep) => void;
    setBb84Tab: (tab: BB84Tab) => void;
    setDisplayedLines: (lines: Line[]) => void;
    pushLines: (lines: Line[]) => void;
    hydrateFromStorage: () => void;
    resetProgress: () => void;
}

const isBrowser = () => typeof window !== 'undefined';

const persistValue = <K extends StorageKey>(key: K, value: BB84ProgressState[K]) => {
    if (!isBrowser()) {
        return;
    }

    const storageKey = STORAGE_KEYS[key];
    const serialised = key === 'bb84Tab' ? String(value) : JSON.stringify(value);

    localStorage.setItem(storageKey, serialised);
};

const removePersistedValue = (key: StorageKey) => {
    if (!isBrowser()) {
        return;
    }

    localStorage.removeItem(STORAGE_KEYS[key]);
};

const readPersistedValue = <K extends StorageKey>(key: K): BB84ProgressState[K] | undefined => {
    if (!isBrowser()) {
        return undefined;
    }

    const storageKey = STORAGE_KEYS[key];
    const stored = localStorage.getItem(storageKey);

    if (stored === null) {
        return undefined;
    }

    try {
        if (key === 'bb84Tab') {
            return stored as BB84ProgressState[K];
        }

        return JSON.parse(stored) as BB84ProgressState[K];
    } catch (error) {
        console.warn('[bb84-progress-store] Unable to parse localStorage value', {
            key: storageKey,
            error,
        });
        removePersistedValue(key);
        return undefined;
    }
};

const isBb84Tab = (value: unknown): value is BB84Tab =>
    value === 'exchange' || value === 'basis' || value === 'validation' || value === 'messaging';

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
        if (lines.length === 0) {
            return;
        }

        const updatedLines = [...get().displayedLines, ...lines];
        persistValue('displayedLines', updatedLines);
        set({displayedLines: updatedLines});
    },
    hydrateFromStorage: () => {
        const maybeStep = readPersistedValue('step');
        const maybeTab = readPersistedValue('bb84Tab');
        const maybeLines = readPersistedValue('displayedLines');

        const nextState: Partial<BB84ProgressState> = {};

        if (typeof maybeStep === 'number') {
            nextState.step = maybeStep;
        }

        if (isBb84Tab(maybeTab)) {
            nextState.bb84Tab = maybeTab;
        }

        if (Array.isArray(maybeLines)) {
            nextState.displayedLines = maybeLines;
        }

        if (Object.keys(nextState).length > 0) {
            set(nextState);
        }
    },
    resetProgress: () => {
        (Object.keys(STORAGE_KEYS) as StorageKey[]).forEach(removePersistedValue);
        set({...initialProgressState});
    },
}));

/**
 * Helper to hydrate the store from persisted values without importing Zustand
 * internals in your components. Invoke this inside a client-only effect:
 *
 * ```tsx
 * useEffect(() => {
 *     hydrateBB84ProgressStore();
 * }, []);
 * ```
 */
export const hydrateBB84ProgressStore = () => {
    if (!isBrowser()) {
        return;
    }

    useBB84ProgressStore.getState().hydrateFromStorage();
};

export const BB84_PROGRESS_INITIAL_STATE = initialProgressState;

/**
 * BB84 progress UI store.
 *
 * This Zustand store tracks how far a player has progressed through the
 * walkthrough (active step/tab and which narrative lines were shown). It sits
 * alongside the gameplay stores but stays focused on presentation concerns so
 * the actual protocol state (`bb84-room-store`) and the lobby configuration
 * (`bb84-game-store`) remain cleanly separated.
 *
 * We synchronise key fields with `localStorage` whenever they change so a page
 * refresh keeps the player on the same tab with the same transcript. Only the
 * setters touch `localStorage`, which keeps the store compatible with Next.js
 * server rendering—the reads happen in client components via helper hooks.
 */
import {BB84GameStep, Line} from '@/types';
import {create} from 'zustand';

interface BB84ProgressStore {
    step: BB84GameStep;
    bb84Tab: string;
    displayedLines: Line[];
    setStep: (step: BB84GameStep) => void;
    setBb84Tab: (tab: string) => void;
    setDisplayedLines: (lines: Line[]) => void;
    pushLines: (lines: Line[]) => void;
    resetProgress: () => void;
}

export const useBB84ProgressStore = create<BB84ProgressStore>((set) => ({
    step: BB84GameStep.EXCHANGE,
    bb84Tab: 'exchange',
    displayedLines: [],
    setStep: (step) => {
        localStorage.setItem('bb84Step', JSON.stringify(step));
        set({step});
    },
    setBb84Tab: (tab) => {
        localStorage.setItem('bb84Tab', tab);
        set({bb84Tab: tab});
    },
    setDisplayedLines: (lines) => {
        localStorage.setItem('bb84DisplayedLines', JSON.stringify(lines));
        set({displayedLines: lines});
    },
    pushLines: (lines) => set((state) => {
        const updatedLines = [...state.displayedLines, ...lines];
        localStorage.setItem('bb84DisplayedLines',
            JSON.stringify(updatedLines));
        return {
            displayedLines: updatedLines,
        };
    }),
    resetProgress: () => {
        // Clear localStorage to prevent old messages from being restored
        localStorage.removeItem('bb84DisplayedLines');
        localStorage.removeItem('bb84Tab');
        localStorage.removeItem('bb84Step');
        set({
            bb84Tab: 'exchange',
            step: BB84GameStep.EXCHANGE,
            displayedLines: [],
        });
    },
}));
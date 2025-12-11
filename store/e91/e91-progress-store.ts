import {E91GameStep, Line} from '@/types';
import {create} from 'zustand';

interface E91ProgressStore {
    step: E91GameStep;
    e91Tab: string;
    displayedLines: Line[];
    setStep: (step: E91GameStep) => void;
    setE91Tab: (tab: string) => void;
    setDisplayedLines: (lines: Line[]) => void;
    pushLines: (lines: Line[]) => void;
    resetProgress: () => void;
}

export const useE91ProgressStore = create<E91ProgressStore>((set) => ({
    step: E91GameStep.MEASUREMENT,
    e91Tab: 'measurement',
    displayedLines: [],
    setStep: (step) => {
        localStorage.setItem('e91Step', JSON.stringify(step));
        set({step});
    },
    setE91Tab: (tab) => {
        localStorage.setItem('e91Tab', tab);
        set({e91Tab: tab});
    },
    setDisplayedLines: (lines) => {
        localStorage.setItem('e91DisplayedLines', JSON.stringify(lines));
        set({displayedLines: lines});
    },
    pushLines: (lines) => set((state) => {
        const updatedLines = [...state.displayedLines, ...lines];
        localStorage.setItem('e91DisplayedLines',
            JSON.stringify(updatedLines));
        return {
            displayedLines: updatedLines,
        };
    }),
    resetProgress: () => {
        // Clear localStorage to prevent old messages from being restored
        localStorage.removeItem('e91DisplayedLines');
        localStorage.removeItem('e91Tab');
        localStorage.removeItem('e91Step');
        set({
            e91Tab: 'measurement',
            step: E91GameStep.MEASUREMENT,
            displayedLines: [],
        });
    },
}));
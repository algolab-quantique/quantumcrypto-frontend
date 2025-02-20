import {DPSGameStep, Line} from '@/types';
import {create} from 'zustand';

interface DPSProgressStore {
    step: DPSGameStep;
    dpsTab: string;
    displayedLines: Line[];
    setStep: (step: DPSGameStep) => void;
    setDPSTab: (tab: string) => void;
    setDisplayedLines: (lines: Line[]) => void;
    pushLines: (lines: Line[]) => void;
    resetProgress: () => void;
}

export const useDPSProgressStore = create<DPSProgressStore>((set) => ({
    step: DPSGameStep.MEASUREMENT,
    dpsTab: 'measurement',
    displayedLines: [],
    setStep: (step) => {
        localStorage.setItem('dpsStep', JSON.stringify(step));
        set({step});
    },
    setDPSTab: (tab) => {
        localStorage.setItem('dpsTab', tab);
        set({dpsTab: tab});
    },
    setDisplayedLines: (lines) => set({displayedLines: lines}),
    pushLines: (lines) => set((state) => {
        const updatedLines = [...state.displayedLines, ...lines];
        localStorage.setItem('dpsDisplayedLines',
            JSON.stringify(updatedLines));
        return {
            displayedLines: updatedLines,
        };
    }),
    resetProgress: () => set({
        dpsTab: 'measurement',
        step: DPSGameStep.MEASUREMENT,
        displayedLines: [],
    }),
}));
import { create } from 'zustand';
import { bb84Lines } from '@/lang/bb84-lines';
import { e91Lines } from '@/lang/e91-lines';
import { dpsLines } from '@/lang/dps-lines';
import { quantumcryptoLines } from '@/lang/quantumcrypto-lines';
import {LanguageItem, GameLines} from '@/types';


interface GameLinesStore  {
    gameLines: LanguageItem[];
    setGameLines: (game: GameLines) => void;
};

const loadGameLines = (): LanguageItem[] => {
    const savedLines = localStorage.getItem('gameLines');
    return savedLines ? JSON.parse(savedLines) : quantumcryptoLines;
};


export const useGameLinesStore = create<GameLinesStore>((set) => ({
    gameLines: loadGameLines(),
    setGameLines: (game) => {
        let lines;
        switch (game) {
            case GameLines.BB84:
                lines = bb84Lines;
                break;
            case GameLines.E91:
                lines = e91Lines;
                break;
            case GameLines.DPS:
                lines = dpsLines;
                break;
            default:
                lines = quantumcryptoLines;
        }
        localStorage.setItem('gameLines', JSON.stringify(lines));
        set({ gameLines: lines });
    },
}));

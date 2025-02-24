'use client';

import React, { createContext, useContext } from 'react';
import { bb84Lines } from '@/lang/bb84-lines';
import { e91Lines } from '@/lang/e91-lines';
import { dpsLines } from '@/lang/dps-lines';
import { quantumcryptoLines } from '@/lang/quantumcrypto-lines';
import {LanguageItem} from '@/types';

const gameLines: Record<string, LanguageItem[]> = {
    QUANTUMCRYPTO: quantumcryptoLines,
    BB84: bb84Lines,
    E91: e91Lines,
    DPS: dpsLines,
};

// Création du contexte pour stocker les lignes de texte
const GameLinesContext = createContext(gameLines);

// Hook pour utiliser les lignes de texte n'importe où
export const useGameLines = () => {
    return useContext(GameLinesContext);
};

// Composant Provider pour encapsuler l'application
export const GameLinesProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <GameLinesContext.Provider value={gameLines}>
            {children}
        </GameLinesContext.Provider>
    );
};

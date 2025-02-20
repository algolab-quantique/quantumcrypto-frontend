'use client';
import { bb84Lines } from '@/lang/bb84-lines';
import { e91Lines } from '@/lang/e91-lines';
import { quantumcryptoLines } from '@/lang/quantumcrypto-lines';
import { dpsLines } from '@/lang/dps-lines';
// import { useGameLinesStore } from '@/store/game-lines-store';
import React, {
    createContext,
    useContext,
    useState,
} from 'react';

export enum Language {
    ENGLISH,
    FRENCH,
    SPANISH,
    GERMAN,
}

const gameLines = [
    ...quantumcryptoLines,
    ...bb84Lines,
    ...e91Lines,
    ...dpsLines,
];

type LanguageContextType = {
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
    localize: (str: string, extra?: string) => string | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({children}: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState(Language.FRENCH);
    // const { gameLines } = useGameLinesStore();

    const localize = (str: string, extra?: string) => {
        
        const languageItem = gameLines[language];
        let result = languageItem ? (languageItem[str] ?? "") : "";
        if (extra) {
            result = result + " " + extra;
        }
        return result;
    };
    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        localize,
    };
    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};
'use client';

import React, {
    createContext,
    useContext,
    useState,
} from 'react';
import { useGameLines } from '@/components/providers/game-lines-provider';

export enum Language {
    ENGLISH,
    FRENCH,
    SPANISH,
    GERMAN,
}



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
    const gameLines = useGameLines(); // Récupérer toutes les lignes


    const localize = (str: string, extra?: string) => {

        let result = "";
        for (const game in gameLines) {
            const languageItem = gameLines[game][language];
            if (languageItem && languageItem[str]) {
                result = languageItem[str];
                break;
            }
        }
       
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
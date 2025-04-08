'use client';

import React, {
    createContext,
    useContext,
    useState,
} from 'react';
import { usePathname } from "next/navigation";
import { bb84Lines } from '@/lang/bb84-lines';
import { e91Lines } from '@/lang/e91-lines';
import { dpsLines } from '@/lang/dps-lines';
import { quantumcryptoLines } from '@/lang/quantumcrypto-lines';
import { LanguageItem } from '@/types';



export enum Language {
    ENGLISH,
    FRENCH,
    SPANISH,
}

export enum Game {
    QUANTUMCRYPTO = 'quantumcrypto', // default page
    BB84 = 'bb84',
    E91 = 'e91',
    DPS = 'dps',
}

const gameLines: Record<string, LanguageItem[]> = {
    QUANTUMCRYPTO: quantumcryptoLines, //default lines
    BB84: bb84Lines,
    E91: e91Lines,
    DPS: dpsLines,
};


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
    const pathname = usePathname();
    const pathParts = pathname ? pathname.split("/") : [];
 

    const gameType = (pathParts[1] as Game) || Game.QUANTUMCRYPTO;
    const isGameActive = pathParts[2] === 'play';
   

    const currentGame = isGameActive && Object.values(Game).includes(gameType)
    ? gameType.toUpperCase()
    : Game.QUANTUMCRYPTO.toUpperCase();
    const currentGameLines = gameLines[currentGame] || [];



    const localize = (str: string, extra?: string) => {

        const languageItem = currentGameLines[language];
        let result = languageItem?.[str] || str;
       
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
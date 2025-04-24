import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import { Language } from '@/components/providers/language-provider';


export const forbiddenSymbols = ['e', 'E', '+', '-', '.'];

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateUniqueRandomList(min: number, max: number,
                                         length: number) {
    const tempArr: number[] = [];

    for (let i = min; i <= max; i++) {
        tempArr.push(i);
    }

    // Shuffle the array
    for (let i = tempArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = tempArr[i];
        tempArr[i] = tempArr[j];
        tempArr[j] = temp;
    }

    const randomList = tempArr.slice(0, length);

    return randomList;
}


export const getLanguageCode = (language: Language): 'en' | 'fr' | 'eb' => {
  switch (language) {
    case Language.FRENCH:
      return 'fr';
    case Language.SPANISH:
      return 'eb';
    case Language.ENGLISH:
        return 'en';
    default:
      return 'en';
  }
};
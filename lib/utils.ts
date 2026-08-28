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


export const getLanguageCode = (language: Language): 'en' | 'fr' | 'es' => {
  switch (language) {
    case Language.FRENCH:
      return 'fr';
    case Language.SPANISH:
      return 'es';
    case Language.ENGLISH:
        return 'en';
    default:
      return 'en';
  }
};
/**
 * Fill the photon-minimum placeholders in a validation message.
 *
 * The minimums differ per protocol AND per mode, and they move with
 * QC_TEST_MODE — so the numbers must never be written into the translations.
 * They were, in BB84's three languages, and the message then told students
 * "minimum 16" while the form actually accepted 6.
 *
 * Use this instead of hand-written `.replace()` chains: forgetting one is how
 * DPS multiplayer ended up showing a literal "{minWithEve}" on screen.
 *
 * @param template a localized string containing {minWithEve} / {minWithoutEve}
 */
export const fillPhotonMinimums = (
    template: string | undefined,
    minWithEve: number,
    minWithoutEve: number,
): string => (template ?? '')
    .replace('{minWithEve}', String(minWithEve))
    .replace('{minWithoutEve}', String(minWithoutEve));

/**
 * Fill the single-minimum placeholder, for forms with no Eve option
 * (DPS solo today). See `fillPhotonMinimums` for why numbers stay out of the
 * translation files.
 *
 * @param template a localized string containing {min}
 */
export const fillPhotonMinimum = (
    template: string | undefined,
    min: number,
): string => (template ?? '').replace('{min}', String(min));

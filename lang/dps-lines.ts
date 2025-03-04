// Order derived from Language enum defined in the LanguageProvider
// 0: English
// 1: French
// 2: Spanish

import {LanguageItem} from '@/types';

export const dpsLines: LanguageItem[] = [       
    {
        'component.dps.exchange.welcome': 'Welcome to DPS!',
        'component.dps.pulseTrain': 'pulses train',
        'component.dps.phase' : 'phase',
        'component.dps.phaseDesc' : '(0 ou π)',
        'component.dps.modulatedPulseTrain' : 'Modulated Pulse Train',
        'component.dps.aliceExchange.send': 'Send to Bob!',
        'component.dps.aliceExchange.sent': 'Your photons are sent! Waiting for' +
            ' Bob\'s photon reception times...',


    },
    {
        // ... (French translations)
        'component.dps.exchange.welcome': 'Bienvenue dans DPS!',
        'component.dps.pulseTrain': 'Train d\'impulsions',
        'component.dps.phase' : 'phase',
        'component.dps.phaseDesc' : '(0 ou π)',
        'component.dps.modulatedPulseTrain' : 'Train d\'impulsions modulé',
        'component.dps.aliceExchange.send': 'Envoyer à Bob !',
        'component.dps.aliceExchange.sent': 'Vos photons sont envoyés ! En' +
            ' attente des temps de reception des photons chez Bob...',
    },
    {
        // ... (Spanish translations)
    }
];
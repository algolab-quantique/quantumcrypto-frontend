import {create} from 'zustand';

interface E91RoomStore {
    evePresent: boolean;
    eveSpotted: boolean;
    eveReadCount: number;
    compared: boolean;
    validationIndices: number[];
    photons: number[];
    photonsRevealed: boolean;
    step2: boolean;
    basesShared: boolean;
    types: string[];
    bobBases: string[];
    bobBits: string[];
    aliceBases: string[];
    aliceBits: string[];
    keyBits: string[];
    partnerBits: string[];
    aliceCipher: string[];
    aliceCipherSent: boolean;
    gameSuccess: boolean;
    validated: boolean;
    crypto: string[];
    message: string[];
    validatedByPartner: boolean;
    utilizeValidBits: boolean | null;
    conflict: boolean;
    alicePreference: boolean | null;
    bobPreference: boolean | null;
    aliceDiceRoll: number | null;
    bobDiceRoll: number | null;
    reroll: boolean;
    diceRollWinner: string | null;
    aliceValidBits: string[];
    bobValidBits: string[];
    aliceInvalidBits: string[];
    bobInvalidBits: string[];
    aliceInvalidBases: string[];
    bobInvalidBases: string[];
    securedDecision: boolean | null;
    setAliceValidBits: (aliceValidBits: string[]) => void;
    setBobValidBits: (bobValidBits: string[]) => void;
    setAliceInvalidBits: (aliceInvalidBits: string[]) => void;
    setBobInvalidBits: (bobInvalidBits: string[]) => void;
    setAliceInvalidBases: (aliceInvalidBases: string[]) => void;
    setBobInvalidBases: (bobInvalidBases: string[]) => void;
    setCompared: (compared: boolean) => void;
    setConflict: (conflict: boolean) =>void;
    setPhotons: (photons: number[]) => void;
    setPhotonsRevealed: (photonsRevealed: boolean) => void;
    setStep2: (step2: boolean) => void;
    setBasesShared: (basesShared: boolean) => void;
    setTypes: (types: string[]) => void;
    setBobBases: (bases: string[]) => void;
    setBobBits: (bits: string[]) => void;
    setAliceBases: (bases: string[]) => void;
    setAliceBits: (bits: string[]) => void;
    setKeyBits: (bits: string[]) => void;
    setPartnerBits: (bits: string[]) => void;
    setAliceCipher: (bits: string[]) => void;
    setAliceCipherSent: (sent: boolean) => void;
    setValidated: (validated: boolean) => void;
    setValidatedByPartner: (validatedByPartner: boolean) => void;
    setGameSuccess: (success: boolean) => void;
    setCrypto: (cipher: string[]) => void;
    setMessage: (message: string[]) => void;
    setEvePresent: (evePresent: boolean) => void;
    setEveSpotted: (eveSpotted: boolean) => void;
    setEveReadCount: (eveReadCount: number) => void;
    resetRoom: () => void;
    setValidationIndices: (validationIndices: number[]) => void;
    restoreGame: (gameState: any) => void;
    setUtilizeValidBits: (utilizeValidBits: boolean | null) => void;
    setAlicePreference: (alicePreference: boolean | null) => void;
    setBobPreference: (bobPreference: boolean | null) => void;
    setAliceDiceRoll: (aliceDiceRoll: number | null) => void;
    setBobDiceRoll: (bobDiceRoll: number | null) => void;
    setReroll: (reroll: boolean) => void;
    setDiceRollWinner: (diceRollWinner: string | null) => void;
    setSecuredDecision: (securedDecision: boolean | null) => void;
}

const updateAndStore = <T>(key: string, value: T,
                           set: (state: Partial<E91RoomStore>) => void) => {
    set({[key]: value});
    const gameDataJSON = localStorage.getItem('e91GameData');
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('e91GameData', JSON.stringify(updatedGameData));
    } else {
        // Initialize e91GameData if it doesn't exist (e.g., in solo mode)
        localStorage.setItem('e91GameData', JSON.stringify({[key]: value}));
    }
};

const checkAndSetConflict = (
    alicePreference: boolean | null,
    bobPreference: boolean | null,
    set: (state: Partial<E91RoomStore>) => void
) => {
    if (alicePreference !== null && bobPreference !== null) {
        console.log('Comparing alice preference: ' + alicePreference + ' to bob preference : ' + bobPreference);
        const conflict = alicePreference !== bobPreference;
        if (conflict) {
            updateAndStore('conflict', conflict, set);
        } else {
            updateAndStore('utilizeValidBits', alicePreference, set);
        }
        
    }
};

const compareDiceValues = (
    aliceDiceRoll: number | null,
    bobDiceRoll: number | null,
    set: (state: Partial<E91RoomStore>) => void
) => {
    if (aliceDiceRoll !== null && bobDiceRoll !== null) {
        if (aliceDiceRoll === bobDiceRoll) {
            updateAndStore('aliceDiceRoll', null, set);
            updateAndStore('bobDiceRoll', null, set);    
            updateAndStore('reroll', true, set);
        } else if (aliceDiceRoll > bobDiceRoll) {
            const { alicePreference } = useE91RoomStore.getState();
            updateAndStore('utilizeValidBits', alicePreference, set);
            updateAndStore('diceRollWinner', 'A', set);
            console.log('Alice wins dice roll');
        } else {
            const { bobPreference } = useE91RoomStore.getState();
            updateAndStore('utilizeValidBits', bobPreference, set);
            updateAndStore('diceRollWinner', 'B', set);
            console.log('Bob wins dice roll');
        }
    }
};

const useE91RoomStore = create<E91RoomStore>(set => ({
    evePresent: false,
    eveSpotted: false,
    eveReadCount: 0,
    conflict: false,
    compared: false,
    validationIndices: [],
    photons: [],
    photonsRevealed: false,
    step2: false,
    basesShared: false,
    types: [],
    bobBases: [],
    bobBits: [],
    aliceBases: [],
    aliceBits: [],
    keyBits: [],
    partnerBits: [],
    aliceCipher: [],
    aliceCipherSent: false,
    gameSuccess: false,
    validated: false,
    validatedByPartner: false,
    crypto: [],
    message: [],
    utilizeValidBits: null,
    alicePreference: null,
    bobPreference: null,
    aliceDiceRoll: null,
    bobDiceRoll: null,
    reroll: false,
    diceRollWinner: null,
    aliceValidBits: [],
    bobValidBits: [],
    aliceInvalidBits: [],
    bobInvalidBits: [],
    aliceInvalidBases: [],
    bobInvalidBases: [],
    securedDecision: null,
    setCompared: compared => updateAndStore('compared', compared, set),
    setPhotons: photons => updateAndStore('photons', photons, set),
    setPhotonsRevealed: photonsRevealed => updateAndStore('photonsRevealed', photonsRevealed, set),
    setBasesShared: basesShared => updateAndStore('basesShared', basesShared, set),
    setStep2: step2 => updateAndStore('step2', step2, set),
    setBobBases: bases => updateAndStore('bobBases', bases, set),
    setTypes: types => updateAndStore('types', types, set),
    setBobBits: bits => updateAndStore('bobBits', bits, set),
    setAliceBases: bases => updateAndStore('aliceBases', bases, set),
    setAliceBits: bits => updateAndStore('aliceBits', bits, set),
    setAliceValidBits: bits => updateAndStore('aliceValidBits', bits, set),
    setBobValidBits: bits => updateAndStore('bobValidBits', bits, set),
    setAliceInvalidBits: bits => updateAndStore('aliceInvalidBits', bits, set),
    setBobInvalidBits: bits => updateAndStore('bobInvalidBits', bits, set),
    setAliceInvalidBases: bases => updateAndStore('aliceInvalidBases', bases, set),
    setBobInvalidBases: bases => updateAndStore('bobInvalidBases', bases, set),
    setKeyBits: bits => updateAndStore('keyBits', bits, set),
    setPartnerBits: bits => updateAndStore('partnerBits', bits, set),
    setAliceCipher: bits => updateAndStore('aliceCipher', bits, set),
    setAliceCipherSent: sent => updateAndStore('aliceCipherSent', sent, set),
    setGameSuccess: success => updateAndStore('gameSuccess', success, set),
    setValidatedByPartner: validatedByPartner => updateAndStore(
        'validatedByPartner', validatedByPartner, set),
    setValidated: validated => updateAndStore('validated', validated, set),
    setCrypto: crypto => updateAndStore('crypto', crypto, set),
    setMessage: message => updateAndStore('message', message, set),
    setEvePresent: evePresent => updateAndStore('evePresent', evePresent, set),
    setEveSpotted: eveSpotted => updateAndStore('eveSpotted', eveSpotted, set),
    setEveReadCount: eveReadCount => updateAndStore('eveReadCount', eveReadCount, set),
    setConflict: conflict => updateAndStore('conflict', conflict, set),
    setUtilizeValidBits: utilizeValidBits => updateAndStore('utilizeValidBits', utilizeValidBits, set),
    setDiceRollWinner: diceRollWinner => updateAndStore('diceRollWinner', diceRollWinner, set),
    setReroll: reroll => updateAndStore('reroll', reroll, set),
    setSecuredDecision: securedDecision => updateAndStore('securedDecision', securedDecision, set),
    setAlicePreference: alicePreference => {
        updateAndStore('alicePreference', alicePreference, set);
        const { bobPreference } = useE91RoomStore.getState();
        checkAndSetConflict(alicePreference, bobPreference, set); 
    },
    setBobPreference: bobPreference => {
        updateAndStore('bobPreference', bobPreference, set);
        const { alicePreference } = useE91RoomStore.getState();
        checkAndSetConflict(alicePreference, bobPreference, set);
    },
    setAliceDiceRoll: aliceDiceRoll => {
        updateAndStore('aliceDiceRoll', aliceDiceRoll, set);
        const { bobDiceRoll } = useE91RoomStore.getState();
        compareDiceValues(aliceDiceRoll, bobDiceRoll, set); 
    },

    setBobDiceRoll: bobDiceRoll => {
        updateAndStore('bobDiceRoll', bobDiceRoll, set);
        const { aliceDiceRoll } = useE91RoomStore.getState();
        compareDiceValues(aliceDiceRoll, bobDiceRoll, set);
    },
    setValidationIndices: validationIndices => updateAndStore(
        'validationIndices', validationIndices, set),
    resetRoom: () => {
        localStorage.removeItem('e91GameData');
        set({
        photons: [],
        photonsRevealed: false,
        basesShared: false,
        step2: false,
        types: [],
        bobBases: [],
        bobBits: [],
        aliceBases: [],
        aliceBits: [],
        keyBits: [],
        eveSpotted: false,
        eveReadCount: 0,
        partnerBits: [],
        aliceCipher: [],
        aliceCipherSent: false,
        gameSuccess: false,
        validated: false,
        compared: false,
        validatedByPartner: false,
        validationIndices: [],
        crypto: [],
        message: [],
        utilizeValidBits: null,
        alicePreference: null,
        bobPreference: null,
        aliceDiceRoll: null, 
        bobDiceRoll: null,
        reroll: false,
        diceRollWinner: null,
        conflict: false,
        aliceValidBits: [],
        bobValidBits: [],
        aliceInvalidBits: [],
        bobInvalidBits: [],
        aliceInvalidBases: [],
        bobInvalidBases: [],
        securedDecision: null,
    });
    },
    restoreGame: gameData => {
        for (const key of Object.keys(gameData)) {
            const value = gameData[key];
            set({[key]: value});
        }
    },
}));

export default useE91RoomStore;

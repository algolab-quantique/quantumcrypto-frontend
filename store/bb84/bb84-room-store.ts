import {create} from 'zustand';

interface BB84RoomStore {
    evePresent: boolean;
    validationIndices: number[];
    alicePhotons: number[];
    bobBases: string[];
    aliceBases: string[];
    aliceBits: string[];
    bobMeasurements: string[];
    keyBits: string[];
    partnerBits: string[];
    aliceCipher: string[];
    aliceCipherSolo: string[];
    aliceCipherSent: boolean;
    gameSuccess: boolean;
    validated: boolean;
    crypto: string[];
    message: string[];
    validatedByPartner: boolean;
    eveUndetected: boolean;
    setAlicePhotons: (photons: number[]) => void;
    setBobBases: (bases: string[]) => void;
    setAliceBases: (bases: string[]) => void;
    setAliceBits: (bits: string[]) => void;
    setBobMeasurements: (measurements: string[]) => void;
    setKeyBits: (bits: string[]) => void;
    setPartnerBits: (bits: string[]) => void;
    setAliceCipher: (bits: string[]) => void;
    setAliceCipherSolo: (bits: string[]) => void;
    setAliceCipherSent: (sent: boolean) => void;
    setValidated: (validated: boolean) => void;
    setValidatedByPartner: (validatedByPartner: boolean) => void;
    setGameSuccess: (success: boolean) => void;
    setCrypto: (cipher: string[]) => void;
    setMessage: (message: string[]) => void;
    setEvePresent: (evePresent: boolean) => void;
    setEveUndetected: (eveUndetected: boolean) => void;
    resetRoom: () => void;
    setValidationIndices: (validationIndices: number[]) => void;
    restoreGame: (gameState: any) => void;
}

const updateAndStore = <T>(key: string, value: T,
                           set: (state: Partial<BB84RoomStore>) => void) => {
    set({[key]: value});
    const gameDataJSON = localStorage.getItem('bb84GameData');
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('bb84GameData', JSON.stringify(updatedGameData));
    } else {
        // Initialize bb84GameData if it doesn't exist (e.g., in solo mode)
        localStorage.setItem('bb84GameData', JSON.stringify({[key]: value}));
    }
};

const useBB84RoomStore = create<BB84RoomStore>(set => ({
    evePresent: false,
    validationIndices: [],
    alicePhotons: [],
    bobBases: [],
    aliceBases: [],
    aliceBits: [],
    bobMeasurements: [],
    keyBits: [],
    partnerBits: [],
    aliceCipher: [],
    aliceCipherSolo: [],
    aliceCipherSent: false,
    gameSuccess: false,
    validated: false,
    validatedByPartner: false,
    crypto: [],
    message: [],
    eveUndetected: false,
    setAlicePhotons: photons => updateAndStore('alicePhotons', photons, set),
    setBobBases: bases => updateAndStore('bobBases', bases, set),
    setAliceBases: bases => updateAndStore('aliceBases', bases, set),
    setAliceBits: bits => updateAndStore('aliceBits', bits, set),
    setBobMeasurements: measurements => updateAndStore('bobMeasurements',
        measurements, set),
    setKeyBits: bits => updateAndStore('keyBits', bits, set),
    setPartnerBits: bits => updateAndStore('partnerBits', bits, set),
    setAliceCipher: bits => updateAndStore('aliceCipher', bits, set),
    setAliceCipherSolo: bits => updateAndStore('aliceCipherSolo', bits, set),
    setAliceCipherSent: sent => updateAndStore('aliceCipherSent', sent, set),
    setGameSuccess: success => updateAndStore('gameSuccess', success, set),
    setValidatedByPartner: validatedByPartner => updateAndStore(
        'validatedByPartner', validatedByPartner, set),
    setValidated: validated => updateAndStore('validated', validated, set),
    setCrypto: crypto => updateAndStore('crypto', crypto, set),
    setMessage: message => updateAndStore('message', message, set),
    setEvePresent: evePresent => updateAndStore('evePresent', evePresent, set),
    setValidationIndices: validationIndices => updateAndStore(
        'validationIndices', validationIndices, set),
    setEveUndetected: eveUndetected => updateAndStore('eveUndetected',
        eveUndetected, set),
    resetRoom: () => set({
        alicePhotons: [],
        bobBases: [],
        aliceBases: [],
        aliceBits: [],
        bobMeasurements: [],
        keyBits: [],
        partnerBits: [],
        aliceCipher: [],
        aliceCipherSolo: [],
        aliceCipherSent: false,
        gameSuccess: false,
        validated: false,
        validatedByPartner: false,
        validationIndices: [],
        crypto: [],
        message: [],
        eveUndetected: false,
    }),
    restoreGame: gameData => {
        for (const key of Object.keys(gameData)) {
            const value = gameData[key];
            set({[key]: value});
        }
    },
}));

export default useBB84RoomStore;

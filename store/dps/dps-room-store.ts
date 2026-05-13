import {create} from 'zustand';

interface DPSRoomStore {
    evePresent: boolean;
    validationIndices: number[];
    alicePhotons: string[];
    alicePhases: string [];
    bobTimeMeasurements: string[];
    inferredPhases: string[];
    keyBits: string[];
    aliceKeyBits: string[];
    bobKeyBits: string[];
    partnerBits: string[];
    bobCipher: string[],
    bobCipherSent: boolean,
    gameSuccess: boolean;
    validated: boolean;
    crypto: string[];
    decryptedMessage: string[];
    message: string[];
    validatedByPartner: boolean;
    eveUndetected: boolean;
    setDecryptedMessage: (message: string[]) => void;
    setAlicePhotons: (photons: string[][]) => void;
    setAlicePhases: (phases: string [][]) => void;
    setBobTimeMeasurements: (measurements: string[]) => void;
    setInferredPhases: (bits: string[]) => void;
    setKeyBits: (bits: string[]) => void;
    setAliceKeyBits: (bits: string[]) => void;
    setBobKeyBits: (bits: string[]) => void;
    setPartnerBits: (bits: string[]) => void;
    setValidated: (validated: boolean) => void;
    setValidatedByPartner: (validatedByPartner: boolean) => void;
    setBobCipher: (bits: string[]) => void;
    setBobCipherSent: (sent: boolean) => void;
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
                           set: (state: Partial<DPSRoomStore>) => void) => {
    set({[key]: value});
    const gameDataJSON = localStorage.getItem('dpsGameData');
    if (gameDataJSON) {
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('dpsGameData', JSON.stringify(updatedGameData));
    } else {
        // First write in solo: initialize dpsGameData from scratch
        localStorage.setItem('dpsGameData', JSON.stringify({[key]: value}));
    }
};

const useDPSRoomStore = create<DPSRoomStore>(set => ({
    evePresent: false,
    validationIndices: [],
    alicePhotons: [],
    alicePhases: [],
    bobTimeMeasurements: [],
    inferredPhases: [],
    keyBits: [],
    aliceKeyBits: [],
    bobKeyBits: [],
    partnerBits: [],
    bobCipher: [],
    bobCipherSent: false,
    gameSuccess: false,
    validated: false,
    validatedByPartner: false,
    crypto: [],
    message: [],
    decryptedMessage: [],
    eveUndetected: false,
    setAlicePhotons: (photons: string[][]) => updateAndStore('alicePhotons', photons, set),
    setAlicePhases: (phases: string[][]) => updateAndStore('alicePhases', phases, set),
    setBobTimeMeasurements: measurements => updateAndStore('bobTimeMeasurements',
        measurements, set),
    setInferredPhases: bits => updateAndStore('inferredPhases', bits, set),
    setKeyBits: bits => updateAndStore('keyBits', bits, set),
    setAliceKeyBits: bits => updateAndStore('aliceKeyBits', bits, set),
    setBobKeyBits: bits => updateAndStore('bobKeyBits', bits, set),
    setPartnerBits: bits => updateAndStore('partnerBits', bits, set),
    setBobCipher: bits => updateAndStore('bobCipher', bits, set),
    setBobCipherSent: sent => updateAndStore('bobCipherSent', sent, set),
    setGameSuccess: success => updateAndStore('gameSuccess', success, set),
    setValidatedByPartner: validatedByPartner => updateAndStore(
        'validatedByPartner', validatedByPartner, set),
    setValidated: validated => updateAndStore('validated', validated, set),
    setCrypto: crypto => updateAndStore('crypto', crypto, set),
    setMessage: message => updateAndStore('message', message, set),
    setDecryptedMessage: message => updateAndStore( 'decryptedMessage', message, set ),
    setEvePresent: evePresent => updateAndStore('evePresent', evePresent, set),
    setValidationIndices: validationIndices => updateAndStore(
        'validationIndices', validationIndices, set),
    setEveUndetected: eveUndetected => updateAndStore('eveUndetected',
        eveUndetected, set),
    resetRoom: () => {
        localStorage.removeItem('dpsGameData');
        set({
            evePresent: false,
            alicePhotons: [],
            alicePhases: [],
            bobTimeMeasurements: [],
            decryptedMessage: [],
            inferredPhases: [],
            keyBits: [],
            aliceKeyBits: [],
            bobKeyBits: [],
            partnerBits: [],
            bobCipher: [],
            bobCipherSent: false,
            gameSuccess: false,
            validated: false,
            validatedByPartner: false,
            validationIndices: [],
            crypto: [],
            message: [],
            eveUndetected: false,
        });
    },
    restoreGame: gameData => {
        for (const key of Object.keys(gameData)) {
            const value = gameData[key];
            set({[key]: value});
        }
    },
}));

export default useDPSRoomStore;

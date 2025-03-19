import {create} from 'zustand';

interface DPSRoomStore {
    evePresent: boolean;
    validationIndices: number[];
    alicePhotons: string[];
    alicePhases: string [];
    bobTimeMeasurements: string[];
    keyBits: string[];
    partnerBits: string[];
    bobCipher: string[],
    bobCipherSent: boolean,
    gameSuccess: boolean;
    validated: boolean;
    crypto: string[];
    message: string[];
    validatedByPartner: boolean;
    eveUndetected: boolean;
    setAlicePhotons: (photons: string[][]) => void;
    setAlicePhases: (phases: string [][]) => void;
    setBobTimeMeasurements: (measurements: string[]) => void;
    setKeyBits: (bits: string[]) => void;
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
    }
};

const useDPSRoomStore = create<DPSRoomStore>(set => ({
    evePresent: false,
    validationIndices: [],
    alicePhotons: [],
    alicePhases: [],
    bobTimeMeasurements: [],
    keyBits: [],
    partnerBits: [],
    bobCipher: [],
    bobCipherSent: false,
    gameSuccess: false,
    validated: false,
    validatedByPartner: false,
    crypto: [],
    message: [],
    eveUndetected: false,
    setAlicePhotons: (photons: string[][]) => updateAndStore('alicePhotons', photons, set),
    setAlicePhases: (phases: string[][]) => updateAndStore('alicePhases', phases, set),
    setBobTimeMeasurements: measurements => updateAndStore('bobTimeMeasurements',
        measurements, set),
    setKeyBits: bits => updateAndStore('keyBits', bits, set),
    setPartnerBits: bits => updateAndStore('partnerBits', bits, set),
    setBobCipher: bits => updateAndStore('bobCipher', bits, set),
    setBobCipherSent: sent => updateAndStore('bobCipherSent', sent, set),
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
        alicePhases: [],      
        bobTimeMeasurements: [],
        keyBits: [],
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
    }),
    restoreGame: gameData => {
        for (const key of Object.keys(gameData)) {
            const value = gameData[key];
            set({[key]: value});
        }
    },
}));

export default useDPSRoomStore;

import {create} from 'zustand';

// =========================================================================
// STEP 1: Single source of truth for state shape and initial values.
//
// BUG FIXED: the original interface declared setAlicePhotons / setAlicePhases
// as accepting `string[][]`, but the actual state fields are `string[]`.
// Both are corrected here to match the real data shape.
// =========================================================================
const initialState = {
    evePresent:          false,
    validationIndices:   [] as number[],
    alicePhotons:        [] as string[],   // was wrongly typed string[][] in original
    alicePhases:         [] as string[],   // was wrongly typed string[][] in original
    bobTimeMeasurements: [] as string[],
    inferredPhases:      [] as string[],
    keyBits:             [] as string[],
    aliceKeyBits:        [] as string[],
    bobKeyBits:          [] as string[],
    partnerBits:         [] as string[],
    bobCipher:           [] as string[],
    bobCipherSent:       false,
    gameSuccess:         false,
    validated:           false,
    validatedByPartner:  false,
    crypto:              [] as string[],
    message:             [] as string[],
    decryptedMessage:    [] as string[],
    eveUndetected:       false,
};

// =========================================================================
// STEP 2: Types derived from the source of truth.
// =========================================================================
type DPSRoomStateSchema = typeof initialState;

interface DPSActions {
    setAlicePhotons:        (photons: string[]) => void;
    setAlicePhases:         (phases: string[]) => void;
    setBobTimeMeasurements: (measurements: string[]) => void;
    setInferredPhases:      (bits: string[]) => void;
    setKeyBits:             (bits: string[]) => void;
    setAliceKeyBits:        (bits: string[]) => void;
    setBobKeyBits:          (bits: string[]) => void;
    setPartnerBits:         (bits: string[]) => void;
    setValidated:           (validated: boolean) => void;
    setValidatedByPartner:  (validatedByPartner: boolean) => void;
    setBobCipher:           (bits: string[]) => void;
    setBobCipherSent:       (sent: boolean) => void;
    setGameSuccess:         (success: boolean) => void;
    setCrypto:              (cipher: string[]) => void;
    setMessage:             (message: string[]) => void;
    setDecryptedMessage:    (message: string[]) => void;
    setEvePresent:          (evePresent: boolean) => void;
    setEveUndetected:       (eveUndetected: boolean) => void;
    setValidationIndices:   (validationIndices: number[]) => void;
    resetRoom:              () => void;
    restoreGame:            (gameState: Partial<DPSRoomStateSchema>) => void;
}

type DPSRoomStore = DPSRoomStateSchema & DPSActions;

// =========================================================================
// STEP 3: Persistence helper.
//
// FIX C: guard every localStorage access with isBrowser() so the module is
// safe to import in a Next.js server-side context or in unit tests.
// Works identically for both solo mode (no pre-existing key → creates it)
// and multiplayer mode (key exists → merges into it).
// =========================================================================
const isBrowser = () => typeof window !== 'undefined';

const updateAndStore = (
    key: keyof DPSRoomStateSchema,
    value: DPSRoomStateSchema[keyof DPSRoomStateSchema],
    set: (state: Partial<DPSRoomStore>) => void,
) => {
    set({[key]: value} as Partial<DPSRoomStore>);

    if (!isBrowser()) return;

    const stored = localStorage.getItem('dpsGameData');
    const next   = stored ? {...JSON.parse(stored), [key]: value} : {[key]: value};
    localStorage.setItem('dpsGameData', JSON.stringify(next));
};

// =========================================================================
// STEP 4: Store implementation.
// =========================================================================
const useDPSRoomStore = create<DPSRoomStore>(set => ({
    ...initialState,

    // --- Setters ---
    setAlicePhotons:        photons            => updateAndStore('alicePhotons',        photons,            set),
    setAlicePhases:         phases             => updateAndStore('alicePhases',         phases,             set),
    setBobTimeMeasurements: measurements       => updateAndStore('bobTimeMeasurements', measurements,       set),
    setInferredPhases:      bits               => updateAndStore('inferredPhases',      bits,               set),
    setKeyBits:             bits               => updateAndStore('keyBits',             bits,               set),
    setAliceKeyBits:        bits               => updateAndStore('aliceKeyBits',        bits,               set),
    setBobKeyBits:          bits               => updateAndStore('bobKeyBits',          bits,               set),
    setPartnerBits:         bits               => updateAndStore('partnerBits',         bits,               set),
    setBobCipher:           bits               => updateAndStore('bobCipher',           bits,               set),
    setBobCipherSent:       sent               => updateAndStore('bobCipherSent',       sent,               set),
    setGameSuccess:         success            => updateAndStore('gameSuccess',         success,            set),
    setValidatedByPartner:  validatedByPartner => updateAndStore('validatedByPartner',  validatedByPartner, set),
    setValidated:           validated          => updateAndStore('validated',           validated,          set),
    setCrypto:              crypto             => updateAndStore('crypto',              crypto,             set),
    setMessage:             message            => updateAndStore('message',             message,            set),
    setDecryptedMessage:    message            => updateAndStore('decryptedMessage',    message,            set),
    setEvePresent:          evePresent         => updateAndStore('evePresent',          evePresent,         set),
    setEveUndetected:       eveUndetected      => updateAndStore('eveUndetected',       eveUndetected,      set),
    setValidationIndices:   validationIndices  => updateAndStore('validationIndices',   validationIndices,  set),

    // FIX A: set(initialState) resets every field. Also clears the persisted
    // snapshot so restoreGame cannot re-hydrate stale data afterwards.
    resetRoom: () => {
        if (isBrowser()) localStorage.removeItem('dpsGameData');
        set(initialState);
    },

    // FIX B: validate incoming keys against initialState before applying them.
    // Unknown keys from an older save or corrupted storage are dropped.
    restoreGame: gameData => {
        const validated: Partial<DPSRoomStateSchema> = {};
        for (const key in gameData) {
            if (key in initialState) {
                (validated as any)[key] = gameData[key as keyof DPSRoomStateSchema];
            }
        }
        set(validated as Partial<DPSRoomStore>);
    },
}));

export default useDPSRoomStore;
export type {DPSRoomStateSchema};
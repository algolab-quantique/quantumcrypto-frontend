import {create} from 'zustand';

// Stores the live BB84 protocol state (bases, bits, results, etc.).
// Every mutation also writes to localStorage (`bb84GameData`) so a reload can restore the game.


// =========================================================================
// STEP 1: The Single Source of Truth for State
// =========================================================================
// This object is the ONLY place where state properties and their initial
// values are defined. If you need to add/remove a property,
// you only need to change it here.
const initialState = {
    evePresent: false,
    validationIndices: [] as number[],
    alicePhotons: [] as number[],
    bobBases: [] as string[],
    aliceBases: [] as string[],
    aliceBits: [] as string[],
    bobMeasurements: [] as string[],
    keyBits: [] as string[],
    partnerBits: [] as string[],
    aliceCipher: [] as string[],
    aliceCipherSolo: [] as string[],
    aliceCipherSent: false,
    gameSuccess: false,
    validated: false,
    validatedByPartner: false,
    crypto: [] as string[],
    message: [] as string[],
    eveUndetected: false,
};

// =========================================================================
// STEP 2: Define Types (Derived from the Source of Truth)
// =========================================================================
// The `BB84RoomStateSchema` type is automatically created from the `initialState`
// object. 
type BB84RoomStateSchema = typeof initialState;

// This interface defines the functions (actions) available in the store.
interface BB84Actions {
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
    setValidationIndices: (validationIndices: number[]) => void;
    resetRoom: () => void;
    restoreGame: (gameState: Partial<BB84RoomStateSchema>) => void;
}

// Full Zustand store (state + actions)
// combine the state fields and the action methods into the shape that Zustand expects.
type BB84RoomStore = BB84RoomStateSchema & BB84Actions;

// =========================================================================
// STEP 3: The Store Implementation
// =========================================================================

// This helper function updates the in-memory Zustand state and mirrors the change
// inside `localStorage`. Think of it as the single synchronization point between
// the live store and the persisted snapshot on the player's browser.
const updateAndStore = (
    // `key` is the name of the property we want to update, e.g. "aliceBits".
    key: keyof BB84RoomStateSchema,
    // `value` is the new data we want to assign to that property. It can be a
    // boolean, an array of numbers, etc., depending on the key.
    value: any,
    // `set` is Zustand's setter. Passing a partial object updates only the given
    // keys without touching the rest of the store.
    set: (state: Partial<BB84RoomStore>) => void,
) => {
    // 1) Update the live Zustand store so the UI reacts immediately.
    set({[key]: value});

    // 2) Pull the previously persisted state (if any) from localStorage.
    const gameDataJSON = localStorage.getItem('bb84GameData');

    if (gameDataJSON) {
        // Merge the fresh value on top of the stored snapshot and save it back.
        const updatedGameData = {...JSON.parse(gameDataJSON), [key]: value};
        localStorage.setItem('bb84GameData', JSON.stringify(updatedGameData));
    } else {
        // If this is the first write, create a brand-new snapshot containing
        // just the updated key. Other setters will gradually populate it.
        localStorage.setItem('bb84GameData', JSON.stringify({[key]: value}));
    }
};

const useBB84RoomStore = create<BB84RoomStore>(set => ({
    // The initial state is now loaded directly from our single source of truth.
    ...initialState,

    // --- Setters ---
    // This is the "duplication" that is acceptable for clarity. Each setter
    // is clearly defined, and it's obvious what it does.
    setAlicePhotons: photons => updateAndStore('alicePhotons', photons, set),
    setBobBases: bases => updateAndStore('bobBases', bases, set),
    setAliceBases: bases => updateAndStore('aliceBases', bases, set),
    setAliceBits: bits => updateAndStore('aliceBits', bits, set),
    setBobMeasurements: measurements =>
        updateAndStore('bobMeasurements', measurements, set),
    setKeyBits: bits => updateAndStore('keyBits', bits, set),
    setPartnerBits: bits => updateAndStore('partnerBits', bits, set),
    setAliceCipher: bits => updateAndStore('aliceCipher', bits, set),
    setAliceCipherSolo: bits => updateAndStore('aliceCipherSolo', bits, set),
    setAliceCipherSent: sent => updateAndStore('aliceCipherSent', sent, set),
    setGameSuccess: success => updateAndStore('gameSuccess', success, set),
    setValidatedByPartner: validatedByPartner =>
        updateAndStore('validatedByPartner', validatedByPartner, set),
    setValidated: validated => updateAndStore('validated', validated, set),
    setCrypto: crypto => updateAndStore('crypto', crypto, set),
    setMessage: message => updateAndStore('message', message, set),
    setEvePresent: evePresent => updateAndStore('evePresent', evePresent, set),
    setValidationIndices: validationIndices =>
        updateAndStore('validationIndices', validationIndices, set),
    setEveUndetected: eveUndetected =>
        updateAndStore('eveUndetected', eveUndetected, set),

    // --- Other Actions ---

    // The reset function is now simple and clean. It just re-applies the
    // initial state object. No more manual list of properties!
    resetRoom: () => set(initialState),

    // The restore function is also cleaner and more type-safe.
    restoreGame: gameData => {
        // Start from an empty shell and copy only recognized properties into it.
        const validatedData: Partial<BB84RoomStateSchema> = {};

        // This guard prevents unexpected keys from polluting the store. It is
        // especially useful if the saved data comes from an older app version.
        for (const key in gameData) {
            if (key in initialState) {
                (validatedData as any)[key] = gameData[key as keyof BB84RoomStateSchema];
            }
        }

        // Finally, hydrate the Zustand store with the sanitized payload.
        set(validatedData);
    },
}));

export default useBB84RoomStore;
export type { BB84RoomStateSchema };

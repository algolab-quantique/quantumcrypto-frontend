import {create} from 'zustand';

// Stores the live BB84 protocol state (bases, bits, results, etc.).
// Every mutation also writes to localStorage (`bb84GameData`) so a reload can restore the game.

// =========================================================================
// STEP 1: Single source of truth for state shape and initial values.
//
// Adding or removing a field only requires touching this object.
// `resetRoom` and `restoreGame` both derive from it automatically, so they
// can never drift out of sync with the rest of the store.
// =========================================================================
const initialState = {
    evePresent:         false,
    validationIndices:  [] as number[],
    alicePhotons:       [] as number[],
    bobBases:           [] as string[],
    aliceBases:         [] as string[],
    aliceBits:          [] as string[],
    bobMeasurements:    [] as string[],
    keyBits:            [] as string[],
    partnerBits:        [] as string[],
    aliceCipher:        [] as string[],
    aliceCipherSolo:    [] as string[],
    aliceCipherSent:    false,
    gameSuccess:        false,
    validated:          false,
    validatedByPartner: false,
    crypto:             [] as string[],
    message:            [] as string[],
    eveUndetected:      false,
};

// =========================================================================
// STEP 2: Types derived from the source of truth.
// =========================================================================
type BB84RoomStateSchema = typeof initialState;

interface BB84Actions {
    setAlicePhotons:       (photons: number[]) => void;
    setBobBases:           (bases: string[]) => void;
    setAliceBases:         (bases: string[]) => void;
    setAliceBits:          (bits: string[]) => void;
    setBobMeasurements:    (measurements: string[]) => void;
    setKeyBits:            (bits: string[]) => void;
    setPartnerBits:        (bits: string[]) => void;
    setAliceCipher:        (bits: string[]) => void;
    setAliceCipherSolo:    (bits: string[]) => void;
    setAliceCipherSent:    (sent: boolean) => void;
    setValidated:          (validated: boolean) => void;
    setValidatedByPartner: (validatedByPartner: boolean) => void;
    setGameSuccess:        (success: boolean) => void;
    setCrypto:             (cipher: string[]) => void;
    setMessage:            (message: string[]) => void;
    setEvePresent:         (evePresent: boolean) => void;
    setEveUndetected:      (eveUndetected: boolean) => void;
    setValidationIndices:  (validationIndices: number[]) => void;
    resetRoom:             () => void;
    restoreGame:           (gameState: Partial<BB84RoomStateSchema>) => void;
}

type BB84RoomStore = BB84RoomStateSchema & BB84Actions;

// =========================================================================
// STEP 3: Persistence helper.
//
// FIX C: guard every localStorage access with isBrowser() so the module is
// safe to import in a Next.js server-side context or in unit tests.
// =========================================================================
const isBrowser = () => typeof window !== 'undefined';

/**
 * Update the live Zustand state and mirror the change inside `localStorage`
 * under the `bb84GameData` key. All setters funnel through here so persistence
 * is never accidentally omitted for a given field.
 */
const updateAndStore = (
    key: keyof BB84RoomStateSchema,
    value: BB84RoomStateSchema[keyof BB84RoomStateSchema],
    set: (state: Partial<BB84RoomStore>) => void,
) => {
    // 1) Update live store immediately so UI reacts.
    set({[key]: value} as Partial<BB84RoomStore>);

    // 2) Mirror to localStorage (client-only).
    if (!isBrowser()) return;

    const stored = localStorage.getItem('bb84GameData');
    let existing: Record<string, unknown> = {};
    if (stored) {
        try {
            existing = JSON.parse(stored);
        } catch {
            // Corrupted snapshot — discard and start fresh
            localStorage.removeItem('bb84GameData');
        }
    }
    const next = {...existing, [key]: value};
    localStorage.setItem('bb84GameData', JSON.stringify(next));
};

// =========================================================================
// STEP 4: Store implementation.
// =========================================================================
const useBB84RoomStore = create<BB84RoomStore>(set => ({
    ...initialState,

    // --- Setters ---
    setAlicePhotons:       photons            => updateAndStore('alicePhotons',       photons,            set),
    setBobBases:           bases              => updateAndStore('bobBases',           bases,              set),
    setAliceBases:         bases              => updateAndStore('aliceBases',         bases,              set),
    setAliceBits:          bits               => updateAndStore('aliceBits',          bits,               set),
    setBobMeasurements:    measurements       => updateAndStore('bobMeasurements',    measurements,       set),
    setKeyBits:            bits               => updateAndStore('keyBits',            bits,               set),
    setPartnerBits:        bits               => updateAndStore('partnerBits',        bits,               set),
    setAliceCipher:        bits               => updateAndStore('aliceCipher',        bits,               set),
    setAliceCipherSolo:    bits               => updateAndStore('aliceCipherSolo',    bits,               set),
    setAliceCipherSent:    sent               => updateAndStore('aliceCipherSent',    sent,               set),
    setGameSuccess:        success            => updateAndStore('gameSuccess',        success,            set),
    setValidatedByPartner: validatedByPartner => updateAndStore('validatedByPartner', validatedByPartner, set),
    setValidated:          validated          => updateAndStore('validated',          validated,          set),
    setCrypto:             crypto             => updateAndStore('crypto',             crypto,             set),
    setMessage:            message            => updateAndStore('message',            message,            set),
    setEvePresent:         evePresent         => updateAndStore('evePresent',         evePresent,         set),
    setValidationIndices:  validationIndices  => updateAndStore('validationIndices',  validationIndices,  set),
    setEveUndetected:      eveUndetected      => updateAndStore('eveUndetected',      eveUndetected,      set),

    // --- Other actions ---

    // FIX A: `set(initialState)` resets every field defined above, including
    // `evePresent` which the original reset silently omitted.
    // FIX A (cont.): also clear the persisted snapshot so a subsequent
    // `restoreGame` call cannot re-hydrate stale data.
    resetRoom: () => {
        if (isBrowser()) localStorage.removeItem('bb84GameData');
        set(initialState);
    },

    // FIX B: validate incoming keys against `initialState` before applying
    // them. Unknown keys from an older save (or corrupted storage) are dropped
    // rather than silently polluting the live store.
    restoreGame: gameData => {
        const validated: Partial<BB84RoomStateSchema> = {};
        for (const key in gameData) {
            if (key in initialState) {
                (validated as any)[key] = gameData[key as keyof BB84RoomStateSchema];
            }
        }
        set(validated as Partial<BB84RoomStore>);
    },
}));

export default useBB84RoomStore;
export type {BB84RoomStateSchema};
import {create} from 'zustand';

// =========================================================================
// STEP 1: Single source of truth for state shape and initial values.
//
// Adding or removing a field only requires touching this object.
// resetRoom and restoreGame both derive from it automatically, so they
// can never drift out of sync with the rest of the store.
//
// NOTE: the original resetRoom silently omitted `evePresent` — fixed here.
// =========================================================================
const initialState = {
    evePresent:         false,
    eveSpotted:         false,
    eveReadCount:       0,
    conflict:           false,
    compared:           false,
    validationIndices:  [] as number[],
    photons:            [] as number[],
    photonsRevealed:    false,
    step2:              false,
    basesShared:        false,
    types:              [] as string[],
    bobBases:           [] as string[],
    bobBits:            [] as string[],
    aliceBases:         [] as string[],
    aliceBits:          [] as string[],
    keyBits:            [] as string[],
    partnerBits:        [] as string[],
    aliceCipher:        [] as string[],
    aliceCipherSent:    false,
    gameSuccess:        false,
    validated:          false,
    validatedByPartner: false,
    crypto:             [] as string[],
    message:            [] as string[],
    utilizeValidBits:   null as boolean | null,
    alicePreference:    null as boolean | null,
    bobPreference:      null as boolean | null,
    aliceDiceRoll:      null as number | null,
    bobDiceRoll:        null as number | null,
    reroll:             false,
    diceRollWinner:     null as string | null,
    aliceValidBits:     [] as string[],
    bobValidBits:       [] as string[],
    aliceInvalidBits:   [] as string[],
    bobInvalidBits:     [] as string[],
    aliceInvalidBases:  [] as string[],
    bobInvalidBases:    [] as string[],
    securedDecision:    null as boolean | null,
};

// =========================================================================
// STEP 2: Types derived from the source of truth.
// =========================================================================
type E91RoomStateSchema = typeof initialState;

interface E91Actions {
    setAliceValidBits:      (bits: string[]) => void;
    setBobValidBits:        (bits: string[]) => void;
    setAliceInvalidBits:    (bits: string[]) => void;
    setBobInvalidBits:      (bits: string[]) => void;
    setAliceInvalidBases:   (bases: string[]) => void;
    setBobInvalidBases:     (bases: string[]) => void;
    setCompared:            (compared: boolean) => void;
    setConflict:            (conflict: boolean) => void;
    setPhotons:             (photons: number[]) => void;
    setPhotonsRevealed:     (photonsRevealed: boolean) => void;
    setStep2:               (step2: boolean) => void;
    setBasesShared:         (basesShared: boolean) => void;
    setTypes:               (types: string[]) => void;
    setBobBases:            (bases: string[]) => void;
    setBobBits:             (bits: string[]) => void;
    setAliceBases:          (bases: string[]) => void;
    setAliceBits:           (bits: string[]) => void;
    setKeyBits:             (bits: string[]) => void;
    setPartnerBits:         (bits: string[]) => void;
    setAliceCipher:         (bits: string[]) => void;
    setAliceCipherSent:     (sent: boolean) => void;
    setValidated:           (validated: boolean) => void;
    setValidatedByPartner:  (validatedByPartner: boolean) => void;
    setGameSuccess:         (success: boolean) => void;
    setCrypto:              (cipher: string[]) => void;
    setMessage:             (message: string[]) => void;
    setEvePresent:          (evePresent: boolean) => void;
    setEveSpotted:          (eveSpotted: boolean) => void;
    setEveReadCount:        (eveReadCount: number) => void;
    setValidationIndices:   (validationIndices: number[]) => void;
    setUtilizeValidBits:    (utilizeValidBits: boolean | null) => void;
    setAlicePreference:     (alicePreference: boolean | null) => void;
    setBobPreference:       (bobPreference: boolean | null) => void;
    setAliceDiceRoll:       (aliceDiceRoll: number | null) => void;
    setBobDiceRoll:         (bobDiceRoll: number | null) => void;
    setReroll:              (reroll: boolean) => void;
    setDiceRollWinner:      (diceRollWinner: string | null) => void;
    setSecuredDecision:     (securedDecision: boolean | null) => void;
    resetRoom:              () => void;
    restoreGame:            (gameState: Partial<E91RoomStateSchema>) => void;
}

type E91RoomStore = E91RoomStateSchema & E91Actions;

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
    key: keyof E91RoomStateSchema,
    value: E91RoomStateSchema[keyof E91RoomStateSchema],
    set: (state: Partial<E91RoomStore>) => void,
) => {
    set({[key]: value} as Partial<E91RoomStore>);

    if (!isBrowser()) return;

    const stored = localStorage.getItem('e91GameData');
    const next   = stored ? {...JSON.parse(stored), [key]: value} : {[key]: value};
    localStorage.setItem('e91GameData', JSON.stringify(next));
};

// =========================================================================
// STEP 4: E91-specific business logic (unchanged from original).
//
// These two helpers live outside the store so they can be unit-tested
// independently of Zustand.
// =========================================================================

/**
 * After both players submit a preference, decide whether to use the valid
 * bits. If they disagree, raise a conflict flag to prompt a dice-roll tie-break.
 */
const checkAndSetConflict = (
    alicePreference: boolean | null,
    bobPreference: boolean | null,
    set: (state: Partial<E91RoomStore>) => void,
) => {
    if (alicePreference === null || bobPreference === null) return;

    console.log(`Comparing alice preference: ${alicePreference} to bob preference: ${bobPreference}`);

    if (alicePreference !== bobPreference) {
        updateAndStore('conflict', true, set);
    } else {
        updateAndStore('utilizeValidBits', alicePreference, set);
    }
};

/**
 * After both dice rolls are in, resolve the tie-break winner.
 * Equal rolls trigger a re-roll; otherwise the higher roller's preference wins.
 */
const compareDiceValues = (
    aliceDiceRoll: number | null,
    bobDiceRoll: number | null,
    set: (state: Partial<E91RoomStore>) => void,
) => {
    if (aliceDiceRoll === null || bobDiceRoll === null) return;

    if (aliceDiceRoll === bobDiceRoll) {
        updateAndStore('aliceDiceRoll', null, set);
        updateAndStore('bobDiceRoll',   null, set);
        updateAndStore('reroll',        true, set);
    } else if (aliceDiceRoll > bobDiceRoll) {
        const {alicePreference} = useE91RoomStore.getState();
        updateAndStore('utilizeValidBits', alicePreference, set);
        updateAndStore('diceRollWinner',   'A',             set);
        console.log('Alice wins dice roll');
    } else {
        const {bobPreference} = useE91RoomStore.getState();
        updateAndStore('utilizeValidBits', bobPreference, set);
        updateAndStore('diceRollWinner',   'B',           set);
        console.log('Bob wins dice roll');
    }
};

// =========================================================================
// STEP 5: Store implementation.
// =========================================================================
const useE91RoomStore = create<E91RoomStore>(set => ({
    ...initialState,

    // --- Plain setters ---
    setCompared:           compared           => updateAndStore('compared',           compared,           set),
    setPhotons:            photons            => updateAndStore('photons',            photons,            set),
    setPhotonsRevealed:    photonsRevealed    => updateAndStore('photonsRevealed',    photonsRevealed,    set),
    setBasesShared:        basesShared        => updateAndStore('basesShared',        basesShared,        set),
    setStep2:              step2              => updateAndStore('step2',              step2,              set),
    setBobBases:           bases              => updateAndStore('bobBases',           bases,              set),
    setTypes:              types              => updateAndStore('types',              types,              set),
    setBobBits:            bits               => updateAndStore('bobBits',            bits,               set),
    setAliceBases:         bases              => updateAndStore('aliceBases',         bases,              set),
    setAliceBits:          bits               => updateAndStore('aliceBits',          bits,               set),
    setAliceValidBits:     bits               => updateAndStore('aliceValidBits',     bits,               set),
    setBobValidBits:       bits               => updateAndStore('bobValidBits',       bits,               set),
    setAliceInvalidBits:   bits               => updateAndStore('aliceInvalidBits',   bits,               set),
    setBobInvalidBits:     bits               => updateAndStore('bobInvalidBits',     bits,               set),
    setAliceInvalidBases:  bases              => updateAndStore('aliceInvalidBases',  bases,              set),
    setBobInvalidBases:    bases              => updateAndStore('bobInvalidBases',    bases,              set),
    setKeyBits:            bits               => updateAndStore('keyBits',            bits,               set),
    setPartnerBits:        bits               => updateAndStore('partnerBits',        bits,               set),
    setAliceCipher:        bits               => updateAndStore('aliceCipher',        bits,               set),
    setAliceCipherSent:    sent               => updateAndStore('aliceCipherSent',    sent,               set),
    setGameSuccess:        success            => updateAndStore('gameSuccess',        success,            set),
    setValidatedByPartner: validatedByPartner => updateAndStore('validatedByPartner', validatedByPartner, set),
    setValidated:          validated          => updateAndStore('validated',          validated,          set),
    setCrypto:             crypto             => updateAndStore('crypto',             crypto,             set),
    setMessage:            message            => updateAndStore('message',            message,            set),
    setEvePresent:         evePresent         => updateAndStore('evePresent',         evePresent,         set),
    setEveSpotted:         eveSpotted         => updateAndStore('eveSpotted',         eveSpotted,         set),
    setEveReadCount:       eveReadCount       => updateAndStore('eveReadCount',       eveReadCount,       set),
    setConflict:           conflict           => updateAndStore('conflict',           conflict,           set),
    setUtilizeValidBits:   utilizeValidBits   => updateAndStore('utilizeValidBits',   utilizeValidBits,   set),
    setDiceRollWinner:     diceRollWinner     => updateAndStore('diceRollWinner',     diceRollWinner,     set),
    setReroll:             reroll             => updateAndStore('reroll',             reroll,             set),
    setSecuredDecision:    securedDecision    => updateAndStore('securedDecision',    securedDecision,    set),
    setValidationIndices:  validationIndices  => updateAndStore('validationIndices',  validationIndices,  set),

    // --- Setters with business logic side-effects ---
    setAlicePreference: alicePreference => {
        updateAndStore('alicePreference', alicePreference, set);
        const {bobPreference} = useE91RoomStore.getState();
        checkAndSetConflict(alicePreference, bobPreference, set);
    },
    setBobPreference: bobPreference => {
        updateAndStore('bobPreference', bobPreference, set);
        const {alicePreference} = useE91RoomStore.getState();
        checkAndSetConflict(alicePreference, bobPreference, set);
    },
    setAliceDiceRoll: aliceDiceRoll => {
        updateAndStore('aliceDiceRoll', aliceDiceRoll, set);
        const {bobDiceRoll} = useE91RoomStore.getState();
        compareDiceValues(aliceDiceRoll, bobDiceRoll, set);
    },
    setBobDiceRoll: bobDiceRoll => {
        updateAndStore('bobDiceRoll', bobDiceRoll, set);
        const {aliceDiceRoll} = useE91RoomStore.getState();
        compareDiceValues(aliceDiceRoll, bobDiceRoll, set);
    },

    // FIX A: set(initialState) resets every field including evePresent which
    // the original omitted. Also clears the persisted snapshot so restoreGame
    // cannot re-hydrate stale data afterwards.
    resetRoom: () => {
        if (isBrowser()) localStorage.removeItem('e91GameData');
        set(initialState);
    },

    // FIX B: validate incoming keys against initialState before applying them.
    // Unknown keys from an older save or corrupted storage are dropped.
    restoreGame: gameData => {
        const validated: Partial<E91RoomStateSchema> = {};
        for (const key in gameData) {
            if (key in initialState) {
                (validated as any)[key] = gameData[key as keyof E91RoomStateSchema];
            }
        }
        set(validated as Partial<E91RoomStore>);
    },
}));

export default useE91RoomStore;
export type {E91RoomStateSchema};
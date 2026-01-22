/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DPS (Differential Phase Shift) QUANTUM KEY DISTRIBUTION PROTOCOL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file centralizes all DPS protocol simulation logic for both
 * multiplayer and solo modes.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * TERMINOLOGY (Read This First!)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This codebase uses the following naming conventions:
 * 
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  TERMINOLOGY GUIDE                                                     │
 * ├────────────────────────────────────────────────────────────────────────┤
 * │                                                                        │
 * │  VISUAL ANALOGY (like a real train):                                   │
 * │                                                                        │
 * │    ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐                          │
 * │    │ P0   │───│ P1   │───│ P2   │   │ P0   │───...                    │
 * │    │ P1   │   │ P1   │   │ P1   │   │ P1   │                          │
 * │    │ P2   │   │ P2   │   │ P2   │   │ P2   │                          │
 * │    └──────┘   └──────┘   └──────┘   └──────┘                          │
 * │     WAGON 0    WAGON 1    WAGON 2    WAGON 3   ...                    │
 * │    └────────────────────────────────────────────┘                     │
 * │                       THE WHOLE TRAIN                                  │
 * │                                                                        │
 * │                                                                        │
 * │  IN THIS CODE:                                                         │
 * │  ─────────────────────────────────────────────────────────────────     │
 * │                                                                        │
 * │  • WAGON = A group of 3 consecutive pulses with phases [φ₀, φ₁, φ₂]  │
 * │            Each wagon corresponds to one "photon row" in the UI       │
 * │            Scientific literature often calls this a "pulse train"     │
 * │                                                                        │
 * │  • TRAIN = The entire data structure containing all wagons            │
 * │            alicePhases = [[φ₀,φ₁,φ₂], [φ₀,φ₁,φ₂], ...]              │
 * │            For n photons, the train has n wagons                      │
 * │                                                                        │
 * │  • PULSE = A single light pulse within a wagon (P0, P1, or P2)        │
 * │            Each pulse has a phase: 0 or π                             │
 * │                                                                        │
 * │  • PHASE = The phase shift applied to a pulse (0 or π)                │
 * │            Determines interference pattern at Bob's detector          │
 * │                                                                        │
 * │  • TIME SLOT = When Bob's detector fires (T0, T1, T2, or T3)          │
 * │            T1 and T2 are valid (used for key), T0 and T3 discarded   │
 * │                                                                        │
 * │                                                                        │
 * │  WHY "PULSE TRAIN" IN LITERATURE?                                      │
 * │  ─────────────────────────────────────────────────────────────────     │
 * │                                                                        │
 * │  In physics, "pulse train" means a sequence of pulses traveling        │
 * │  together. Each group of 3 pulses is called a "train" because they    │
 * │  travel as one unit through the channel.                              │
 * │                                                                        │
 * │  We prefer "WAGON" in this code because:                              │
 * │  - The whole 2D array looks like a train with many wagons             │
 * │  - Each inner array [φ₀, φ₁, φ₂] is one wagon                        │
 * │  - This matches how we visualize the data structure                   │
 * │                                                                        │
 * └────────────────────────────────────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * PROTOCOL OVERVIEW (Step-by-Step)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        STEP 1: ALICE PREPARES PULSES                   │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  For n photons, Alice creates n "WAGONS" (pulse trains).               │
 * │  Each wagon has 3 PULSES, each with a random phase (0 or π):           │
 * │                                                                         │
 * │     ┌─────────────────────────────────────────────────────────────┐     │
 * │     │  WAGON i:   [φ₀]  ───  [φ₁]  ───  [φ₂]                     │     │
 * │     │              P0        P1         P2                        │     │
 * │     │                                                             │     │
 * │     │  φ = 0 or π (random)                                        │     │
 * │     └─────────────────────────────────────────────────────────────┘     │
 * │                                                                         │
 * │  DATA STRUCTURE (for n photons):                                        │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │    alicePhases = [                                                      │
 * │      [φ₀, φ₁, φ₂]₀,    // Wagon 0                                      │
 * │      [φ₀, φ₁, φ₂]₁,    // Wagon 1                                      │
 * │      ...                                                                │
 * │      [φ₀, φ₁, φ₂]ₙ₋₁   // Wagon n-1                                    │
 * │    ]                                                                    │
 * │                                                                         │
 * │  Example with n=2:                                                      │
 * │    alicePhases = [['0', 'π', '0'], ['π', 'π', '0']]                     │
 * │                                                                         │
 * │                                                                         │
 * │  FUNCTIONS USED (by Alice) - Step by Step:                              │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │  Step 1.1: Generate random phases                                       │
 * │    generateRandomPhases(n)                                              │
 * │      → Input: n (number of wagons/photons)                              │
 * │      → Output: 2D array [n][3] of random phases ('0' or 'π')           │
 * │      → Example: generateRandomPhases(2) → [['0','π','0'],['π','0','π']]│
 * │                                                                         │
 * │  Step 1.2: Convert phases to modulated pulses (for UI display)          │
 * │    generatePulseTrains(phases)                                          │
 * │      → Input: phases array from Step 1.1                                │
 * │      → Output: 2D array of pulse values ('1' or '2')                   │
 * │      → Rule: phase '0' → pulse '1', phase 'π' → pulse '2'              │
 * │      → This is used for visual representation in the UI                │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                      STEP 2: BOB'S INTERFEROMETER                      │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  Bob receives each wagon and passes it through an INTERFEROMETER:      │
 * │                                                                         │
 * │                    ┌───────────────────┐                                │
 * │                    │   SHORT PATH      │───→ ┌────┐                     │
 * │     WAGON ───────→ ├───────────────────┤     │ D0 │ (Detector 0)       │
 * │     (3 pulses)     │   LONG PATH (+Δt) │───→ │ D1 │ (Detector 1)       │
 * │                    └───────────────────┘     └────┘                     │
 * │                                                                         │
 * │  The delay Δt = time between consecutive pulses.                       │
 * │                                                                         │
 * │                                                                         │
 * │  HOW 3 PULSES BECOME 4 TIME SLOTS:                                     │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │  Each pulse splits into SHORT and LONG paths. The LONG path adds       │
 * │  delay Δt. When pulses recombine at the output:                        │
 * │                                                                         │
 * │    Pulse P0 (enters at t=0):                                           │
 * │      - Short path → arrives at T0                                      │
 * │      - Long path  → arrives at T1                                      │
 * │                                                                         │
 * │    Pulse P1 (enters at t=Δt):                                          │
 * │      - Short path → arrives at T1                                      │
 * │      - Long path  → arrives at T2                                      │
 * │                                                                         │
 * │    Pulse P2 (enters at t=2Δt):                                         │
 * │      - Short path → arrives at T2                                      │
 * │      - Long path  → arrives at T3                                      │
 * │                                                                         │
 * │                                                                         │
 * │  TIMING DIAGRAM:                                                        │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │    T0              T1              T2              T3                  │
 * │    │               │               │               │                    │
 * │    ▼               ▼               ▼               ▼                    │
 * │  [P0-short]    [P0-long  +     [P1-long  +     [P2-long]               │
 * │    alone        P1-short]       P2-short]        alone                 │
 * │                                                                         │
 * │    ↓               ↓               ↓               ↓                    │
 * │  NO INTERF.   INTERFERENCE    INTERFERENCE    NO INTERF.              │
 * │  DISCARD      → D0 or D1      → D0 or D1      DISCARD                 │
 * │               (gives key)     (gives key)                              │
 * │                                                                         │
 * │  KEY INSIGHT:                                                          │
 * │  - T0, T3: Only one pulse path → No interference → DISCARDED          │
 * │  - T1: P0-long interferes with P1-short → Phase diff = φ₁ - φ₀        │
 * │  - T2: P1-long interferes with P2-short → Phase diff = φ₂ - φ₁        │
 * │                                                                         │
 * │  Which detector clicks (D0 or D1) depends on the phase difference:    │
 * │  - Same phases (0-0 or π-π) → D0 clicks → Key bit = 0                 │
 * │  - Different phases (0-π or π-0) → D1 clicks → Key bit = 1            │
 * │                                                                         │
 * │                                                                         │
 * │  ⚠️  SIMULATION SIMPLIFICATION:                                        │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │  In the real protocol, the interferometer physics determines which     │
 * │  time slot and which detector fires. In our SIMULATION, we skip the    │
 * │  full physics and directly sample the arrival time probabilistically: │
 * │                                                                         │
 * │    - T0: 1/6 probability (will be discarded)                           │
 * │    - T1: 2/6 probability (valid, used for key)                         │
 * │    - T2: 2/6 probability (valid, used for key)                         │
 * │    - T3: 1/6 probability (will be discarded)                           │
 * │                                                                         │
 * │  The key bit is computed from Alice's PHASE DIFFERENCES (not detector).│
 * │                                                                         │
 * │                                                                         │
 * │  FUNCTIONS USED (by Bob) - Step by Step:                                │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │  Step 2.1: Simulate detector measurement (which time slot fires)        │
 * │    measureArrivalTime(n)                                                │
 * │      → Input: n (number of wagons)                                      │
 * │      → Output: Array of times ['T1', 'T0', 'T2', ...] (one per wagon)   │
 * │      → Uses probability distribution [1/6, 2/6, 2/6, 1/6]               │
 * │                                                                         │
 * │  Step 2.2: Compute key bit from phase differences                       │
 * │    computeDetectorValue(phases, time)                                   │
 * │      → Input: phases = ['0', 'π', '0'], time = 'T1'                     │
 * │      → Output: '1' or '0' (the key bit)                                 │
 * │      → Calculates: are the two relevant phases DIFFERENT?              │
 * │      → T1 checks phases[1] vs phases[2], T2 checks phases[0] vs [1]    │
 * │                                                                         │
 * │      📝 OPTION B DESIGN: We check for T1/T2 directly in UI code        │
 * │      (e.g., time === 'T1' || time === 'T2') because it's pedagogical - │
 * │      developers see immediately that only T1 and T2 are valid.         │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    STEP 3: KEY BIT DETERMINATION                       │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  The detector output depends on the PHASE DIFFERENCE:                  │
 * │                                                                         │
 * │  SAME PHASES (0-0 or π-π):                                             │
 * │    → Constructive interference → Detector D0 clicks → Key bit = 0     │
 * │                                                                         │
 * │  DIFFERENT PHASES (0-π or π-0):                                        │
 * │    → Destructive interference → Detector D1 clicks → Key bit = 1      │
 * │                                                                         │
 * │                                                                         │
 * │  HOW WE COMPUTE THE KEY BIT (Phase Difference):                        │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │  The interferometer physically computes the phase difference.          │
 * │  In our simulation, we do this mathematically:                         │
 * │                                                                         │
 * │    key_bit = (φᵢ - φⱼ) ≠ 0 ? 1 : 0                                     │
 * │                                                                         │
 * │  In code, we check: "Are the two phases DIFFERENT?"                    │
 * │    - If (φᵢ === 'π' && φⱼ === '0') OR (φᵢ === '0' && φⱼ === 'π')      │
 * │      → DIFFERENT → key_bit = '1'                                       │
 * │    - Else → SAME → key_bit = '0'                                       │
 * │                                                                         │
 * │  📝 NOTE: This is equivalent to XOR operation:                          │
 * │     key_bit = φᵢ XOR φⱼ                                                │
 * │  But we write it as explicit comparison for pedagogical clarity -      │
 * │  it shows we're checking if phases are different (interference).       │
 * │                                                                         │
 * │                                                                         │
 * │  BOTH ALICE AND BOB get the same key bit because:                      │
 * │  - Bob: His detector physically measures the phase difference          │
 * │  - Alice: She calculates the same difference from her stored phases    │
 * │                                                                         │
 * │                                                                         │
 * │  FUNCTIONS USED (PEDAGOGICAL DESIGN):                                   │
 * │  ─────────────────────────────────────────────────────────────────────  │
 * │                                                                         │
 * │  We have multiple functions that do similar things because the UI      │
 * │  shows different representations for Alice and Bob:                    │
 * │                                                                         │
 * │  • computeDetectorValue(phase, time) → Returns '0' or '1'              │
 * │    Used by Bob's UI - shows BITS (which detector clicked)              │
 * │                                                                         │
 * │  • computeDetectorPhase(phase, time) → Returns '0' or 'π'              │
 * │    Used by Alice's UI - shows PHASES (her original notation)           │
 * │                                                                         │
 * │  • phaseToKeyBit(phase) → Converts 'π' to '1', '0' to '0'              │
 * │    Bridges the two representations when needed                         │
 * │                                                                         │
 * │  This separation is INTENTIONAL for pedagogical reasons:               │
 * │  Alice thinks in phases, Bob thinks in detector clicks/bits.           │
 * │  The UI mirrors each participant's mental model of the protocol.       │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    STEP 4: BOB ANNOUNCES TIMES                         │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  Bob PUBLICLY announces ALL his measured time slots:                   │
 * │                                                                         │
 * │  Example: "Row 1: T1, Row 2: T0, Row 3: T2, Row 4: T3, Row 5: T1, ..." │
 * │                                                                         │
 * │  📝 IMPORTANT: Bob sends ALL times (T0, T1, T2, T3) to Alice.          │
 * │  The filtering happens AFTER during key computation, not here.         │
 * │                                                                         │
 * │  This is PUBLIC information (Eve can see it too).                      │
 * │  But it does NOT reveal the key bits:                                  │
 * │  - Eve knows which time slot detected but not WHICH detector clicked   │
 * │  - The actual key bit (0 or 1) remains secret                          │
 * │                                                                         │
 * │  AFTER receiving all times, BOTH parties:                              │
 * │  - Filter to keep only T1 and T2 (where interference occurred)        │
 * │  - Discard T0 and T3 (no interference = no usable key bit)            │
 * │                                                                         │
 * │  In UI code: filter with (time === 'T1' || time === 'T2')              │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    STEP 5: ALICE INFERS KEY BITS                       │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  Alice receives Bob's time announcements and calculates key bits:      │
 * │                                                                         │
 * │  For each valid time (T1 or T2):                                       │
 * │    1. Look up the time slot                                            │
 * │    2. Get the corresponding phases from her stored data                │
 * │    3. Calculate: key_bit = (φᵢ - φⱼ) ≠ 0 ? 1 : 0                       │
 * │       (i.e., are the two phases DIFFERENT?)                            │
 * │                                                                         │
 * │  Example:                                                              │
 * │    - Bob says: "Row 5: T1"                                             │
 * │    - Alice has phases: [0, π, 0] for row 5                             │
 * │    - T1 uses P0 and P1 → phase diff = 0 - π ≠ 0 → key_bit = 1          │
 * │                                                                         │
 * │  FUNCTIONS USED:                                                        │
 * │  - computeDetectorPhase(phase, time) → Get phase difference result    │
 * │  - computeDetectorValue(phase, time) → Get key bit ('0' or '1')       │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    STEP 6: SECURE MESSAGING                            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  Now Alice and Bob share a secret key!                                 │
 * │                                                                         │
 * │  BOB encrypts his message:                                             │
 * │    cipher[i] = (message[i] + key[i]) % 2   (XOR)                       │
 * │                                                                         │
 * │  BOB sends cipher to Alice (publicly).                                 │
 * │                                                                         │
 * │  ALICE decrypts:                                                       │
 * │    message[i] = cipher[i] XOR key[i]                                   │
 * │                                                                         │
 * │  FUNCTIONS USED:                                                        │
 * │  - encryptBit(msg, key) / encryptMessage(msg, key) → Bob uses         │
 * │  - decryptBit(cipher, key) / decryptMessage(cipher, key) → Alice uses │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * UI ARRAY INDEXING (IMPORTANT!)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * In the UI (alice-inference-tab.tsx), the phases array is displayed with:
 *   - Column headers: T3, T2, T1, T0 (RIGHT to LEFT)
 *   - Array index: [0], [1], [2]
 * 
 * The mapping appears to be:
 *   - phase[0] = leftmost UI column
 *   - phase[2] = rightmost UI column
 * 
 * The code uses:
 *   - T1: phase[1] and phase[2] (labeled B and A in comments)
 *   - T2: phase[0] and phase[1] (labeled C and B in comments)
 * 
 * This matches the physics if:
 *   - T1 = interference of P0-long + P1-short (phases of pulses 0 and 1)
 *   - T2 = interference of P1-long + P2-short (phases of pulses 1 and 2)
 * 
 * BUT: The array convention [C, B, A] suggests reverse order, which may
 * need verification against the actual UI display.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTION SUMMARY BY ROLE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ALICE uses:
 *   - generateRandomPhases()     → Create pulse phases (solo mode)
 *   - generatePulseTrains()      → Convert to modulated pulses
 *   - computeDetectorPhase()     → Infer key from Bob's times
 *   - DetectorPhase()            → Batch inference
 *   - phasesToKeyBits()          → Convert phases to key
 *   - decryptMessage()           → Decrypt Bob's cipher
 * 
 * BOB uses:
 *   - measureArrivalTime()       → Simulate detector measurement
 *   - computeDetectorValue()     → Get key bit from detection
 *   - encryptMessage()           → Encrypt message for Alice
 * 
 * SHARED:
 *   - buildValidEntries()        → Build data structure for UI
 *   - calculateErrorRate()       → Eve detection
 * 
 * OPTION B NOTE: Time validation (T1/T2 check) is done directly in UI code:
 *   (time === 'T1' || time === 'T2')
 * This is pedagogical - developers see immediately which times are valid.
 * The functions isValidTime() and filterValidTimes() are obsolete and commented out.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SOURCE FILES (Original Locations of Extracted Code)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The following functions were extracted from these multiplayer tab files:
 * 
 * 1. bob-exchange-tab.tsx (lines 63-87):
 *    - measureArrivalTime() - Bob's probabilistic time measurement
 * 
 * 2. bob-messaging-tab.tsx (lines 83-94):
 *    - computeDetectorValue() - Key bit calculation from phases
 * 
 * 3. alice-inference-tab.tsx (lines 75-88):
 *    - DetectorPhase() - Alice's phase inference
 * 
 * 4. alice-messaging-tab.tsx (line 42, lines 84-91):
 *    - Secret key conversion and XOR decryption
 * 
 * 5. bob-messaging-tab.tsx (lines 143-152):
 *    - XOR encryption
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Number of pulses per train (photon row).
 */
export const PULSES_PER_TRAIN = 3;

/**
 * All possible arrival times.
 */
export const ALL_TIMES = ['T0', 'T1', 'T2', 'T3'] as const;

/**
 * Valid arrival times (used for key generation).
 * T0 and T3 are discarded.
 */
export const VALID_TIMES = ['T1', 'T2'] as const;

/**
 * Probability distribution for arrival times.
 * T0: 1/6 probability (~16.7%)
 * T1: 2/6 probability (~33.3%) ← VALID
 * T2: 2/6 probability (~33.3%) ← VALID
 * T3: 1/6 probability (~16.7%)
 * 
 * SOURCE: bob-exchange-tab.tsx, line 64
 * Original code: const probabilities = [1 / 6, 2 / 6, 2 / 6, 1 / 6];
 */
export const TIME_PROBABILITIES = [1 / 6, 2 / 6, 2 / 6, 1 / 6] as const;

// ═══════════════════════════════════════════════════════════════════════════
// BOB'S TIME MEASUREMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Measures arrival times for pulse trains using probabilistic distribution.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: bob-exchange-tab.tsx, lines 63-87                              │
 * │                                                                         │
 * │ Original function name: measureArrivalTime()                           │
 * │                                                                         │
 * │ Called by: Bob clicks the SearchCode button (line 164)                 │
 * │            onClick={measureArrivalTime}                                │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * Uses cumulative probability distribution:
 * - T0: 1/6 probability (~16.7%)
 * - T1: 2/6 probability (~33.3%) ← VALID
 * - T2: 2/6 probability (~33.3%) ← VALID  
 * - T3: 1/6 probability (~16.7%)
 * 
 * @param photonNumber - Number of pulse trains to measure
 * @returns Array of arrival times (e.g., ['T1', 'T0', 'T2', 'T1', ...])
 * 
 * @example
 * // In bob-exchange-tab.tsx (original usage):
 * const newArrivalTimes = Array.from({ length: photonNumber }, () => getRandomTime());
 * setMeasurements(newArrivalTimes);
 */
export const measureArrivalTime = (photonNumber: number): string[] => {
    const times: string[] = [];

    for (let i = 0; i < photonNumber; i++) {
        const random = Math.random();
        let cumulativeProbability = 0;
        let selectedTime = 'T3'; // Default fallback

        for (let j = 0; j < TIME_PROBABILITIES.length; j++) {
            cumulativeProbability += TIME_PROBABILITIES[j];
            if (random < cumulativeProbability) {
                selectedTime = ALL_TIMES[j];
                break;
            }
        }

        times.push(selectedTime);
    }

    return times;
};

// ═══════════════════════════════════════════════════════════════════════════
// TIME VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * OBSOLETE FUNCTIONS (OPTION B REFACTOR)
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * The following functions are COMMENTED OUT because we now use Option B:
 * - Direct T1/T2 check in UI code: (time === 'T1' || time === 'T2')
 * - This is more pedagogical - developers see immediately which times are valid
 * 
 * These functions are kept as reference in case we need to revert.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// /**
//  * Checks if an arrival time is valid for key generation.
//  * Valid times: T1 and T2 (where interference occurs)
//  * Invalid times: T0 and T3 (no interference, discarded)
//  * 
//  * SOURCE: bob-exchange-tab.tsx, validation logic
//  * 
//  * @param time - Arrival time string
//  * @returns true if time is T1 or T2
//  */
// export const isValidTime = (time: string): boolean => {
//     return time === 'T1' || time === 'T2';
// };

// /**
//  * Filters arrival times, replacing invalid ones (T0, T3) with empty string.
//  * 
//  * ⚠️ WARNING: This function is OBSOLETE.
//  * - We now store ALL times (T0, T1, T2, T3) and filter during key computation
//  * - UI code checks directly: (time === 'T1' || time === 'T2')
//  * 
//  * @param times - Raw arrival times
//  * @returns Array with invalid times replaced with ''
//  */
// export const filterValidTimes = (times: string[]): string[] => {
//     return times.map(time => isValidTime(time) ? time : '');
// };

// ═══════════════════════════════════════════════════════════════════════════
// KEY BIT CALCULATION (DETECTOR VALUE)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Computes the detector value (key bit) from phase differences.
 * Returns '0' or '1'.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: bob-messaging-tab.tsx, lines 83-94                             │
 * │                                                                         │
 * │ Original function name: computeDetectorValue()                         │
 * │                                                                         │
 * │ Called by: revealDetectorValues() at line 73-81                        │
 * │            In useEffect at lines 95-99                                 │
 * │                                                                         │
 * │ Original code:                                                          │
 * │ const computeDetectorValue = ({ phase, time }) => {                    │
 * │     if (phase.length !== 3) return "Erreur";                           │
 * │     if (time === "T1") {                                               │
 * │         const [B, A] = phase.slice(-2);                                │
 * │         return (A === "π" && B === "0") ||                             │
 * │                (A === "0" && B === "π") ? "1" : "0";                   │
 * │     }                                                                   │
 * │     if (time === "T2") {                                               │
 * │         const [C, B] = phase.slice(0, 2);                              │
 * │         return (B === "π" && C === "0") ||                             │
 * │                (B === "0" && C === "π") ? "1" : "0";                   │
 * │     }                                                                   │
 * │     return "Erreur";                                                   │
 * │ };                                                                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * Phase array structure: [C, B, A] where:
 * - For T1: Uses positions [1] and [2] (B and A, last two pulses)
 * - For T2: Uses positions [0] and [1] (C and B, first two pulses)
 * 
 * Key bit = 1 if phases are different, 0 if same
 * 
 * @param phase - Array of 3 phases for the pulse train (e.g., ['0', 'π', '0'])
 * @param time - Arrival time (T1 or T2)
 * @returns Key bit as string ('0' or '1'), or 'Error' for invalid input
 */
export const computeDetectorValue = (phase: string[], time: string): string => {
    if (phase.length !== 3) return 'Error';

    if (time === 'T1') {
        // Use last two phases: phase[1] (B) and phase[2] (A)
        const B = phase[1];
        const A = phase[2];
        return ((A === 'π' && B === '0') || (A === '0' && B === 'π')) ? '1' : '0';
    }

    if (time === 'T2') {
        // Use first two phases: phase[0] (C) and phase[1] (B)
        const C = phase[0];
        const B = phase[1];
        return ((B === 'π' && C === '0') || (B === '0' && C === 'π')) ? '1' : '0';
    }

    return 'Error';
};

/**
 * Computes detector phase for Alice's inference.
 * Returns 'π' or '0' instead of '1' or '0' (phase notation).
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-inference-tab.tsx, lines 75-88                           │
 * │                                                                         │
 * │ Original function name: DetectorPhase()                                │
 * │                                                                         │
 * │ Called by: onValidateInference() at line 91                            │
 * │            const expectedValues = DetectorPhase(validEntries);         │
 * │                                                                         │
 * │ Original code:                                                          │
 * │ const DetectorPhase = (entries) => {                                   │
 * │     return entries.map(({ phase, time }) => {                          │
 * │         if (phase.length !== 3) return "Erreur";                       │
 * │         if (time === "T1") {                                           │
 * │             const [B, A] = phase.slice(-2);                            │
 * │             return (A === "π" && B === "0") ||                         │
 * │                    (A === "0" && B === "π") ? "π" : "0";              │
 * │         }                                                               │
 * │         if (time === "T2") {                                           │
 * │             const [C, B] = phase.slice(0, 2);                          │
 * │             return (B === "π" && C === "0") ||                         │
 * │                    (B === "0" && C === "π") ? "π" : "0";              │
 * │         }                                                               │
 * │         return "Erreur";                                               │
 * │     });                                                                 │
 * │ };                                                                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * This is the same logic as computeDetectorValue but returns 'π'/'0' instead of '1'/'0'
 * 
 * @param phase - Array of 3 phases for the pulse train
 * @param time - Arrival time (T1 or T2)
 * @returns Phase as string ('π' or '0'), or 'Error' for invalid input
 */
export const computeDetectorPhase = (phase: string[], time: string): string => {
    if (phase.length !== 3) return 'Error';

    if (time === 'T1') {
        const B = phase[1];
        const A = phase[2];
        return ((A === 'π' && B === '0') || (A === '0' && B === 'π')) ? 'π' : '0';
    }

    if (time === 'T2') {
        const C = phase[0];
        const B = phase[1];
        return ((B === 'π' && C === '0') || (B === '0' && C === 'π')) ? 'π' : '0';
    }

    /**
     * LOGIC NOTE: Unreachable Return "Error"
     * 
     * Why is this here?
     * This function effectively requires `time` to be strictly 'T1' or 'T2'.
     * If `time` is 'T0' or 'T3' (or invalid), we return 'Error'.
     * 
     * Is this safe?
     * Yes. In the UI code (and protocol logic), we strictly filter for VALID_TIMES (T1, T2)
     * *before* calling this function.
     * Example: `validEntries.map(...)` in inference tabs is derived from filtered indices.
     * 
     * Why keep it?
     * 1. TypeScript requires a return value for all code paths.
     * 2. It serves as run-time defensive programming: if a T0/T3 ever leaks in, 
     *    we get an explicit 'Error' string rather than undefined behavior or a wrong phase.
     */
    return 'Error';
};

/**
 * Batch version of DetectorPhase for multiple entries.
 * Matches the original function signature from alice-inference-tab.tsx.
 * 
 * @param entries - Array of {phase, time} objects
 * @returns Array of phase strings ('π' or '0')
 */
export const DetectorPhase = (
    entries: { phase: string[]; time: string }[]
): string[] => {
    return entries.map(({ phase, time }) => computeDetectorPhase(phase, time));
};

// ═══════════════════════════════════════════════════════════════════════════
// KEY CONVERSION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts inferred phase to key bit.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-messaging-tab.tsx, line 42                               │
 * │                                                                         │
 * │ Original code:                                                          │
 * │ const secretKey = inferredPhases.map(phase => (phase === "π" ?         │
 * │                   "1" : "0"));                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param phase - Phase string ('π' or '0')
 * @returns Key bit as string ('1' or '0')
 */
export const phaseToKeyBit = (phase: string): string => {
    return phase === 'π' ? '1' : '0';
};

/**
 * Converts array of phases to array of key bits.
 * 
 * @param phases - Array of phase strings
 * @returns Array of key bit strings
 */
export const phasesToKeyBits = (phases: string[]): string[] => {
    return phases.map(phaseToKeyBit);
};

// ═══════════════════════════════════════════════════════════════════════════
// ENCRYPTION / DECRYPTION (XOR)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Encrypts a message bit with a key bit using XOR (modulo 2 addition).
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: bob-messaging-tab.tsx, lines 143-152                           │
 * │                                                                         │
 * │ Original code in onValidateBits():                                     │
 * │ const keyNumber = parseInt(detectorValue);                             │
 * │ const messageNumber = parseInt(messageValue);                          │
 * │ const result = (keyNumber + messageNumber) % 2;                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param messageBit - Message bit ('0' or '1')
 * @param keyBit - Key bit ('0' or '1')
 * @returns Encrypted bit as string
 */
export const encryptBit = (messageBit: string, keyBit: string): string => {
    return ((parseInt(messageBit) + parseInt(keyBit)) % 2).toString();
};

/**
 * Encrypts entire message with key using XOR.
 * 
 * @param message - Array of message bits
 * @param keyBits - Array of key bits
 * @returns Array of encrypted cipher bits
 */
export const encryptMessage = (message: string[], keyBits: string[]): string[] => {
    return message.map((bit, index) => {
        const keyBit = keyBits[index] || '0';
        return encryptBit(bit, keyBit);
    });
};

/**
 * Decrypts a cipher bit with a key bit using XOR.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-messaging-tab.tsx, lines 84-91                           │
 * │                                                                         │
 * │ Original code in onValidateDecryption():                               │
 * │ const expectedValue = (parseInt(bobCipher[index]) ^                    │
 * │                        parseInt(secretKey[index])).toString();         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param cipherBit - Cipher bit ('0' or '1')
 * @param keyBit - Key bit ('0' or '1')
 * @returns Decrypted bit as string
 */
export const decryptBit = (cipherBit: string, keyBit: string): string => {
    return (parseInt(cipherBit) ^ parseInt(keyBit)).toString();
};

/**
 * Decrypts entire cipher with key using XOR.
 * 
 * @param cipher - Array of cipher bits
 * @param keyBits - Array of key bits
 * @returns Array of decrypted message bits
 */
export const decryptMessage = (cipher: string[], keyBits: string[]): string[] => {
    return cipher.map((bit, index) => {
        const keyBit = keyBits[index] || '0';
        return decryptBit(bit, keyBit);
    });
};

// ═══════════════════════════════════════════════════════════════════════════
// PHASE GENERATION (For Solo Mode)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generates random phases for Alice's pulse trains.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-exchange-tab.tsx (randomize function pattern)            │
 * │                                                                         │
 * │ Note: In multiplayer, Alice manually selects or randomizes phases.     │
 * │ This function simulates computer-controlled Alice for solo mode.       │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param photonNumber - Number of pulse trains
 * @returns 2D array of phases [train][pulse]
 */
export const generateRandomPhases = (photonNumber: number): string[][] => {
    const phases: string[][] = [];

    for (let train = 0; train < photonNumber; train++) {
        const trainPhases: string[] = [];
        for (let pulse = 0; pulse < PULSES_PER_TRAIN; pulse++) {
            trainPhases.push(Math.random() < 0.5 ? '0' : 'π');
        }
        phases.push(trainPhases);
    }

    return phases;
};

/**
 * Generates modulated pulse trains based on phases.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-exchange-tab.tsx, validatePulse() logic                  │
 * │                                                                         │
 * │ Rule: Phase '0' → Pulse '1', Phase 'π' → Pulse '2'                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param phases - 2D array of phases
 * @returns 2D array of pulses
 */
export const generatePulseTrains = (phases: string[][]): string[][] => {
    return phases.map(trainPhases =>
        trainPhases.map(phase => phase === '0' ? '1' : '2')
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gets indices of valid entries (where time is not empty).
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-inference-tab.tsx, lines 43-45                           │
 * │                                                                         │
 * │ Original code:                                                          │
 * │ const validIndices = bobTimeMeasurements                               │
 * │     .map((time, index) => time !== "" ? index : null)                  │
 * │     .filter(index => index !== null);                                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * @param times - Array of times (filtered, with '' for discarded)
 * @returns Array of valid indices
 */
export const getValidIndices = (times: string[]): number[] => {
    return times
        .map((time, index) => time !== '' ? index : null)
        .filter((index): index is number => index !== null);
};

/**
 * Builds valid entries array for display/processing.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SOURCE: alice-inference-tab.tsx, lines 47-51                           │
 * │                                                                         │
 * │ Original code:                                                          │
 * │ const validEntries = validIndices.map(index => ({                      │
 * │     phase: Array.isArray(alicePhases[index]) ?                         │
 * │            alicePhases[index] : alicePhases[index].split(""),         │
 * │     time: bobTimeMeasurements[index],                                  │
 * │     photon: alicePhotons[index] || '-',                                │
 * │ }));                                                                    │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export const buildValidEntries = (
    alicePhases: string[][] | string[],
    bobTimeMeasurements: string[],
    alicePhotons?: string[][]
): { phase: string[]; time: string; photon: string[] | string }[] => {
    const validIndices = getValidIndices(bobTimeMeasurements);

    return validIndices.map(index => ({
        phase: Array.isArray(alicePhases[index])
            ? alicePhases[index] as string[]
            : (alicePhases[index] as string).split(''),
        time: bobTimeMeasurements[index],
        photon: alicePhotons?.[index] || '-',
    }));
};

/**
 * Calculates error rate between two key arrays.
 * Used for Eve detection (if error rate > threshold, Eve detected).
 * 
 * @param key1 - First key array
 * @param key2 - Second key array
 * @returns Error rate as decimal (0.0 to 1.0)
 */
export const calculateErrorRate = (key1: string[], key2: string[]): number => {
    if (key1.length === 0 || key2.length === 0) return 0;

    const minLength = Math.min(key1.length, key2.length);
    let errors = 0;

    for (let i = 0; i < minLength; i++) {
        if (key1[i] !== key2[i]) {
            errors++;
        }
    }

    return errors / minLength;
};

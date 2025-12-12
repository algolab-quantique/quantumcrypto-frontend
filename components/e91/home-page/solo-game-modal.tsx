/**
 * E91 Solo Game Modal
 * 
 * This component provides the entry point for playing E91 in solo mode.
 * It displays a modal dialog that allows the user to:
 * 1. Choose a role (Alice or Bob)
 * 2. Configure game settings (photon count, Eve presence)
 * 3. Start a solo game against a simulated partner
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SOLO MODE STRATEGY: ON-DEMAND GENERATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * In MULTIPLAYER mode:
 *   Alice (Player) <-> WebSocket <-> Backend <-> WebSocket <-> Bob (Player)
 *   - Real-time exchange of data step-by-step
 *   - Each player waits for the other's actions
 * 
 * In SOLO mode:
 *   Player (Alice or Bob) <-> Frontend <-> Simulated Partner (on-demand)
 *   - This modal only sets CONFIGURATION (photon count, Eve, role)
 *   - Data is generated ON-DEMAND in solo-game.tsx as the player progresses
 *   - When player clicks "Measure", their bits + partner data are generated
 *   - This matches the multiplayer flow exactly: action → result
 * 
 * This approach ensures the play page follows the same step-by-step flow
 * as multiplayer mode, generating data at the appropriate moments.
 * 
 * IMPORTANT: E91 solo = E91 multiplayer experience.
 * Same steps, same messages, just one player is the computer.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FLOW
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Step 0: Role Selection
 *   - User clicks Alice or Bob icon to select their role
 *   - Advances to Step 1
 * 
 * Step 1: Game Settings
 *   - Player name (required, 2-10 characters)
 *   - Photon number: Controlled by E91_SOLO_PHOTON_* constants in e91-constants.ts
 *     - TEST MODE (E91_TEST_MODE=true): min 4 without Eve, min 8 with Eve
 *     - PRODUCTION (E91_TEST_MODE=false): min 10 without Eve, min 20 with Eve
 *   - Eve checkbox (enables eavesdropper simulation)
 *   - Eve probability (E91_EVE_PERCENTAGE_MIN to E91_EVE_PERCENTAGE_MAX)
 *   - On submit:
 *     1. Sets game configuration in stores
 *     2. Navigates to /e91/play
 *     3. Data generation happens in solo-game.tsx during gameplay
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This modal sets configuration in:
 * - store/player-store.ts: Player role, name, and solo mode flag
 * - store/e91/e91-game-store.ts: Photon number and Eve settings
 * - store/e91/e91-room-store.ts: Eve presence flag
 * 
 * The solo-game.tsx component handles:
 * - lib/e91/solo-player.ts: Simulation functions called during gameplay
 * - store/e91/e91-room-store.ts: Stores generated bits/bases
 * - store/e91/e91-progress-store.ts: Progress tracking and messages
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cat, Dog } from 'lucide-react';
import { z } from 'zod';
import usePlayerStore from '@/store/player-store';
import { useLanguage } from '@/components/providers/language-provider';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckedState } from '@radix-ui/react-checkbox';
import useE91GameStore from '@/store/e91/e91-game-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { useRouter } from 'next/navigation';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import { clearE91LocalStorage } from '@/lib/e91/utils';
import { recordGameStats } from '@/app/(main)/services/api';
import {
    E91_SOLO_PHOTON_MAX,
    E91_SOLO_PHOTON_MIN_WITH_EVE,
    E91_SOLO_PHOTON_MIN_WITHOUT_EVE,
    E91_SOLO_PHOTON_DEFAULT,
    E91_EVE_PERCENTAGE_DEFAULT,
    E91_EVE_PERCENTAGE_MIN,
    E91_EVE_PERCENTAGE_MAX,
} from '@/e91-constants';
// Note: Simulation functions (generateBases, generateRandomBits, etc.) are NOT imported here
// because data is generated on-demand in solo-game.tsx following the UI flow

/**
 * E91 Solo Game Modal Component
 * 
 * Provides role selection (Alice/Bob) and game settings configuration
 * for playing E91 in solo mode against a simulated partner.
 */
const SoloGameModal = () => {
    // ═══════════════════════════════════════════════════════════════════════
    // STORE HOOKS
    // ═══════════════════════════════════════════════════════════════════════

    const {
        playerRole,
        setPlayerRole,
        setPlayingSolo,
        setPlayerName,
        setPartner,
    } = usePlayerStore();

    const {
        setPhotonNumber,
        setGameHasEve,
        setGameCode,
    } = useE91GameStore();

    const {
        setEvePresent,
        setAliceBits,
        setAliceBases,
        setBobBits,
        setBobBases,
        resetRoom,
    } = useE91RoomStore();

    const { pushLines, resetProgress } = useE91ProgressStore();

    const { localize } = useLanguage();
    const router = useRouter();

    // ═══════════════════════════════════════════════════════════════════════
    // LOCAL STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [formStep, setFormStep] = useState(0);
    const [eveChecked, setEveChecked] = useState(false);

    // ═══════════════════════════════════════════════════════════════════════
    // FORM SCHEMA
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Form validation schema using constants from e91-constants.ts
     * 
     * Photon limits are controlled by E91_TEST_MODE in e91-constants.ts:
     * - TEST MODE: Lower values for faster testing
     * - PRODUCTION MODE: Higher values for realistic simulation
     * 
     * @see e91-constants.ts for E91_SOLO_PHOTON_* and E91_EVE_* constants
     */
    const formSchema = z.object({
        photonNumber: z.coerce.number({
            invalid_type_error: localize('component.createGame.keyError'),
        })
            .int()
            .max(E91_SOLO_PHOTON_MAX, {
                message: localize('component.createGame.keyMax'),
            }),
        eve: z.boolean({
            required_error: localize('component.main.pinRequired'),
        }).default(false),
        evePercentage: z.coerce.number({
            invalid_type_error: localize('component.createGame.evePercentage.invalidType'),
        })
            .positive({
                message: localize('component.createGame.evePercentage.positive'),
            })
            .gte(E91_EVE_PERCENTAGE_MIN, {
                message: localize('component.createGame.evePercentage.greaterThan'),
            })
            .lte(E91_EVE_PERCENTAGE_MAX, {
                message: localize('component.createGame.evePercentage.lessThan'),
            }),
        playerName: z.string({
            required_error: localize('component.main.nameRequired'),
        }).min(2, {
            message: localize('component.main.nameMin'),
        }).max(10, {
            message: localize('component.main.nameMax'),
        }),
    }).refine(schema =>
        // Photon limits controlled by E91_TEST_MODE in e91-constants.ts
        (schema.eve &&
            (schema.photonNumber >= E91_SOLO_PHOTON_MIN_WITH_EVE && schema.photonNumber <= E91_SOLO_PHOTON_MAX)) ||
        (!schema.eve &&
            (schema.photonNumber >= E91_SOLO_PHOTON_MIN_WITHOUT_EVE && schema.photonNumber <= E91_SOLO_PHOTON_MAX)),
        {
            message: (localize('component.e91.createGame.keyMin') || '')
                .replace('{minWithEve}', String(E91_SOLO_PHOTON_MIN_WITH_EVE))
                .replace('{minWithoutEve}', String(E91_SOLO_PHOTON_MIN_WITHOUT_EVE)),
            path: ['photonNumber'],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photonNumber: E91_SOLO_PHOTON_DEFAULT,
            eve: false,
            evePercentage: E91_EVE_PERCENTAGE_DEFAULT,
            playerName: '',
        },
    });

    // Update default photon count when Eve checkbox changes
    useEffect(() => {
        if (eveChecked) {
            form.setValue('photonNumber', E91_SOLO_PHOTON_MIN_WITH_EVE);
        } else {
            form.setValue('photonNumber', E91_SOLO_PHOTON_DEFAULT);
        }
    }, [eveChecked, form]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Starts the solo game with the given configuration.
     * 
     * ON-DEMAND GENERATION APPROACH:
     * This function only sets the game configuration and navigates to the play page.
     * All simulation data (bits, bases) is generated on-demand in solo-game.tsx
     * as the player progresses through each step. This matches the multiplayer
     * flow exactly - data is generated when the player takes action.
     * 
     * IMPORTANT - gameHasEve vs evePresent:
     * - gameHasEve: User setting that ENABLES the possibility of Eve (checkbox).
     *   When true, the CHSH validation step is shown in the game flow.
     * - evePresent: The ACTUAL runtime state - whether Eve is intercepting.
     *   Determined by: gameHasEve && (Math.random() < evePercentage)
     *   This matches the multiplayer behavior where the server decides.
     * 
     * Configuration set here:
     * - photonNumber: Number of entangled pairs
     * - gameHasEve: Whether Eve option is enabled (shows CHSH step)
     * - evePresent: Whether Eve is actually present (probability-based)
     * - playingSolo: Flag for solo mode
     * - playerRole: Alice (A) or Bob (B)
     * - playerName: Player's display name
     */
    const onStartSoloGame = (
        photonNumber: number,
        eve: boolean,
        evePercentage: number,
        playerName: string,
    ) => {
        // Record game stats for analytics
        recordGameStats('e91', 1);

        // Clear previous game state
        clearE91LocalStorage();
        resetRoom();
        resetProgress();

        // Determine if Eve is actually present based on probability
        // This matches multiplayer where server decides with the same probability
        const isEveActuallyPresent = eve && Math.random() < evePercentage;

        // Generate a solo game code (for results page navigation)
        const soloGameCode = 'SOLO-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        // Set game configuration
        setPlayerName(playerName);
        setPlayingSolo(true);
        setPartner('QuantumCrypto');  // Partner name for solo mode (shown in progression)
        setGameCode(soloGameCode);    // Game code for results page navigation
        setGameHasEve(eve);           // Enables CHSH step in game flow
        setEvePresent(isEveActuallyPresent);  // Actual Eve interception state
        setPhotonNumber(photonNumber);

        // Save game config to localStorage for page refresh persistence
        localStorage.setItem('e91PhotonNumber', JSON.stringify(photonNumber));
        localStorage.setItem('e91GameHasEve', JSON.stringify(eve));
        localStorage.setItem('e91OriginalEvePresent', JSON.stringify(isEveActuallyPresent)); // For results page
        localStorage.setItem('e91EveWasDetected', JSON.stringify(false)); // Reset detection flag
        localStorage.setItem('e91GameData', JSON.stringify({ evePresent: isEveActuallyPresent }));

        // Navigate to play page - simulation data generated on-demand there
        router.replace('/e91/play');
    };

    /**
     * Handles Eve checkbox change
     */
    const onEveChecked = (
        onChange: (...event: any[]) => void,
        checked: CheckedState
    ) => {
        setEveChecked(!eveChecked);
        onChange(checked);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER: Step 0 - Role Selection
    // ═══════════════════════════════════════════════════════════════════════

    const roleSelection = (
        <div className="flex flex-col gap-y-4 w-full items-center">
            <p className="text-lg">{localize('component.e91.soloRoleSelect')}</p>
            <div className="flex w-full gap-x-6 justify-center">
                {/* Alice Selection */}
                <div
                    className="bg-background flex flex-col gap-y-2
                        items-center border border-secondary rounded-md
                        p-4 hover:bg-secondary/40 cursor-pointer"
                    onClick={() => {
                        setPlayerRole('A');
                        setFormStep(1);
                    }}
                >
                    <Cat size={50} />
                    <p>Alice</p>
                </div>
                {/* Bob Selection */}
                <div
                    className="flex flex-col gap-y-2 items-center
                        border border-secondary rounded-md p-4
                        hover:bg-secondary/40 cursor-pointer"
                    onClick={() => {
                        setPlayerRole('B');
                        setFormStep(1);
                    }}
                >
                    <Dog size={50} />
                    <p>Bob</p>
                </div>
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER: Step 1 - Game Settings Form
    // ═══════════════════════════════════════════════════════════════════════

    const gameSettings = (
        <Form {...form}>
            <form
                className="flex flex-col gap-y-4"
                onSubmit={form.handleSubmit(
                    ({ photonNumber, eve, evePercentage, playerName }) =>
                        onStartSoloGame(photonNumber, eve, evePercentage, playerName)
                )}
            >
                {/* Player Name Field */}
                <FormField
                    control={form.control}
                    name="playerName"
                    render={({ field }) => (
                        <FormItem className="flex gap-x-5 items-center">
                            <FormLabel className="text-nowrap col-span-1">
                                {localize('component.main.nameLabel')}
                            </FormLabel>
                            <FormControl className="mx-2">
                                <Input
                                    placeholder=""
                                    className="w-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Photon Number Field */}
                <FormField
                    control={form.control}
                    name="photonNumber"
                    render={({ field }) => (
                        <FormItem className="flex gap-x-5 items-center">
                            <FormLabel className="text-nowrap col-span-1">
                                {localize('component.createGame.keyLength')}
                            </FormLabel>
                            <FormControl className="mx-2">
                                <Input
                                    maxLength={2}
                                    placeholder="10"
                                    className="text-center w-[50px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Eve Checkbox */}
                <FormField
                    control={form.control}
                    name="eve"
                    render={({ field }) => (
                        <FormItem className="space-y-0 flex gap-x-5 items-center">
                            <FormLabel className="text-nowrap col-span-1">
                                {localize('component.createGame.eve')}
                            </FormLabel>
                            <FormControl className="mx-2">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checkState) =>
                                        onEveChecked(field.onChange, checkState)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Eve Probability - only shown when Eve is checked */}
                {eveChecked && (
                    <FormField
                        control={form.control}
                        name="evePercentage"
                        render={({ field }) => (
                            <FormItem className="space-y-0 flex gap-x-5 items-center">
                                <FormLabel className="text-nowrap col-span-1">
                                    {localize('component.createGame.evePercentage.label')}
                                </FormLabel>
                                <FormControl className="mx-2">
                                    <Input
                                        maxLength={3}
                                        placeholder="0.5"
                                        className="text-center w-[50px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Submit Button */}
                <DialogFooter>
                    <Button type="submit">
                        {localize('component.waitingRoom.start')}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ═══════════════════════════════════════════════════════════════════════

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) setFormStep(0);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    className="text-md mt-2 w-[50%] p-2"
                >
                    {localize('component.e91.playSolo')}
                </Button>
            </DialogTrigger>
            <DialogContent className="border-secondary w-[90%] md:w-full rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {localize('component.e91.startSolo')}
                    </DialogTitle>
                </DialogHeader>
                {(() => {
                    switch (formStep) {
                        case 0:
                            return roleSelection;
                        case 1:
                            return gameSettings;
                        default:
                            return null;
                    }
                })()}
            </DialogContent>
        </Dialog>
    );
};

export default SoloGameModal;

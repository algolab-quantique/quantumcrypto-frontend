/**
 * DPS Solo Game Modal
 * 
 * Entry point for playing DPS in solo mode.
 * Player chooses role (Alice or Bob), game settings, then plays against computer.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * DESIGN: Same as multiplayer, just computer plays one side
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SOLO mode uses:
 *   - EXACT SAME UI as multiplayer tabs (separate solo-* files)
 *   - lib/dps/dps-protocol.ts for protocol functions
 *   - 2-second delay before computer actions (so user can read messages)
 *   - Eve is NOT implemented yet (future work)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FLOW
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Step 0: Role Selection
 *   - User clicks Alice or Bob icon
 *   → Advances to Step 1
 * 
 * Step 1: Game Settings
 *   - Player name (required)
 *   - Photon number (number of wagons)
 *   → Navigate to /dps/play
 */

'use client';

import { cn, fillPhotonMinimum } from '@/lib/utils';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDPSGameStore from '@/store/dps/dps-game-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useRouter } from 'next/navigation';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import {
    DPS_SOLO_PHOTON_MIN,
    DPS_SOLO_PHOTON_MAX,
    DPS_SOLO_PHOTON_DEFAULT,
    DPS_SOLO_PHOTON_DRAFT_KEY,
} from '@/dps-constants';

const SoloGameModal = ({
    triggerClassName,
    open,
    onOpenChange,
}: {
    triggerClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    // ═══════════════════════════════════════════════════════════════════════
    // STORE HOOKS
    // ═══════════════════════════════════════════════════════════════════════

    const {
        playerRole,
        setPlayerRole,
        setPlayingSolo,
        setPlayingMultiplayer,
        setPlayerName,
        setPartner,
    } = usePlayerStore();

    const {
        setPhotonNumber,
        setGameCode,
    } = useDPSGameStore();

    const {
        resetRoom,
    } = useDPSRoomStore();

    const { resetProgress } = useDPSProgressStore();

    const { localize } = useLanguage();
    const router = useRouter();

    // ═══════════════════════════════════════════════════════════════════════
    // LOCAL STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [formStep, setFormStep] = useState(0);

    // ═══════════════════════════════════════════════════════════════════════
    // FORM SCHEMA
    // ═══════════════════════════════════════════════════════════════════════

    const formSchema = z.object({
        photonNumber: z.coerce.number({
            invalid_type_error: localize('component.createGame.keyError'),
        })
            .int()
            .min(DPS_SOLO_PHOTON_MIN, {
                // Simple form: DPS solo has no Eve option yet, so the shared
                // "X with Eve, Y otherwise" message would point at a control
                // that does not exist. When DPS Eve ships (Task 38), switch to
                // component.createGame.keyMin + fillPhotonMinimums.
                message: fillPhotonMinimum(
                    localize('component.createGame.keyMinSimple'),
                    DPS_SOLO_PHOTON_MIN),
            })
            .max(DPS_SOLO_PHOTON_MAX, {
                message: localize('component.createGame.keyMax'),
            }),
        playerName: z.string({
            required_error: localize('component.main.nameRequired'),
        }).min(2, {
            message: localize('component.main.nameMin'),
        }).max(10, {
            message: localize('component.main.nameMax'),
        }),
    });

    const getDraftPhotonNumber = () => {
        if (typeof window === 'undefined') return DPS_SOLO_PHOTON_DEFAULT;
        const draftPhotonNumber = localStorage.getItem(DPS_SOLO_PHOTON_DRAFT_KEY);
        if (!draftPhotonNumber) return DPS_SOLO_PHOTON_DEFAULT;

        try {
            const parsedPhotonNumber = Number(JSON.parse(draftPhotonNumber));
            return Number.isNaN(parsedPhotonNumber)
                ? DPS_SOLO_PHOTON_DEFAULT
                : parsedPhotonNumber;
        } catch {
            return DPS_SOLO_PHOTON_DEFAULT;
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photonNumber: getDraftPhotonNumber(),
            playerName: '',
        },
    });

    

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Starts the solo game with the given configuration.
     * 
     * Sets game configuration and navigates to /dps/play.
     * Actual gameplay data is generated on-demand in solo tabs.
     */
    const onStartSoloGame = (
        photonNumber: number,
        playerName: string,
    ) => {
        // Clear previous game state
        clearDPSLocalStorage();
        resetRoom();
        resetProgress();

        // Generate a solo game code (for identification)
        const soloGameCode = 'SOLO-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        // Set game configuration
        setPlayerName(playerName);
        setPlayingSolo(true);
        setPlayingMultiplayer(false);
        setPartner('QuantumCrypto');  // Partner name for solo mode
        setGameCode(soloGameCode);
        setPhotonNumber(photonNumber);

        // Save to localStorage for page refresh persistence
        localStorage.setItem('dpsPhotonNumber', JSON.stringify(photonNumber));
        localStorage.setItem(DPS_SOLO_PHOTON_DRAFT_KEY, JSON.stringify(photonNumber));
        localStorage.setItem('dpsPlayerData', JSON.stringify({
            playerName,
            role: playerRole,
            playingSolo: true,
            gameCode: soloGameCode,
        }));

        // Navigate to the shared DPS play page; it chooses solo/multi from the player store.
        router.replace('/dps/play');
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER: Step 0 - Role Selection
    // ═══════════════════════════════════════════════════════════════════════

    const roleSelection = (
        <div className="flex flex-col gap-y-4 w-full items-center">
            <p className="text-lg">{localize('component.main.chooseRole')}</p>
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
                    <div className="relative h-[100px] w-[130px]">
                        <Image
                            fill
                            src="/images/SNE-EnigmesQuantiques_Personnages_Alice_head.png"
                            alt="Alice"
                            sizes="130px"
                            className="object-contain"
                        />
                    </div>
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
                    <div className="relative h-[100px] w-[100px]">
                        <Image
                            fill
                            src="/images/SNE-EnigmesQuantiques_Personnages_Bob_Head.png"
                            alt="Bob"
                            sizes="100px"
                            className="object-contain"
                        />
                    </div>
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
                    ({ photonNumber, playerName }) =>
                        onStartSoloGame(photonNumber, playerName)
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
                                    placeholder="6"
                                    className="text-center w-[50px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setFormStep(0);
                onOpenChange?.(isOpen);
            }}
        >
            {open === undefined && (
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="secondary"
                        className={cn("text-md mt-2 w-[50%] p-2", triggerClassName)}
                    >
                        {localize('component.main.playSoloBtn')}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="border-secondary w-[90%] md:w-full rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {localize('component.main.playSoloBtn')}
                    </DialogTitle>
                </DialogHeader>
                {open !== undefined
                    ? gameSettings
                    : (() => {
                        switch (formStep) {
                            case 0:
                                return roleSelection;
                            case 1:
                                return gameSettings;
                            default:
                                return null;
                        }
                    })()
                }
            </DialogContent>
        </Dialog>
    );
};

export default SoloGameModal;

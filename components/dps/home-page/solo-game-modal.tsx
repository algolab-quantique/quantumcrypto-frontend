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
 *   → Navigate to /dps/solo
 */

'use client';

import { cn } from '@/lib/utils';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDPSGameStore from '@/store/dps/dps-game-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useRouter } from 'next/navigation';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { clearDPSLocalStorage } from '@/lib/dps/utils';

// DPS Solo Mode Constants
const DPS_SOLO_PHOTON_MIN = 4;
const DPS_SOLO_PHOTON_MAX = 20;
const DPS_SOLO_PHOTON_DEFAULT = 6;

const SoloGameModal = ({ triggerClassName }: { triggerClassName?: string }) => {
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
                message: `Minimum ${DPS_SOLO_PHOTON_MIN} photons`,
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photonNumber: DPS_SOLO_PHOTON_DEFAULT,
            playerName: '',
        },
    });

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Starts the solo game with the given configuration.
     * 
     * Sets game configuration and navigates to /dps/solo.
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
        setPartner('QuantumCrypto');  // Partner name for solo mode
        setGameCode(soloGameCode);
        setPhotonNumber(photonNumber);

        // Save to localStorage for page refresh persistence
        localStorage.setItem('dpsPhotonNumber', JSON.stringify(photonNumber));
        localStorage.setItem('dpsPlayerData', JSON.stringify({
            playerName,
            role: playerRole,
            playingSolo: true,
            gameCode: soloGameCode,
        }));

        // Navigate to solo play page
        router.replace('/dps/solo');
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
            onOpenChange={(open) => {
                if (!open) setFormStep(0);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    className={cn("text-md mt-2 w-[50%] p-2", triggerClassName)}
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

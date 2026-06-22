'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
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
    FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckedState } from '@radix-ui/react-checkbox';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import { useRouter } from 'next/navigation';
import {
    generateAliceBases,
    generateAliceBits,
    generateAlicePhotons, mimicEveIntercept,
} from '@/lib/bb84/solo-player';
import { useBB84ProgressStore } from '@/store/bb84/bb84-progress-store';
import { clearBB84LocalStorage } from '@/lib/bb84/utils';
import { recordGameStats } from '@/app/(main)/services/api';
import {
    BB84_TEST_MODE,
    BB84_SOLO_PHOTON_MAX,
    BB84_SOLO_PHOTON_MIN_WITH_EVE,
    BB84_SOLO_PHOTON_MIN_WITHOUT_EVE,
    BB84_SOLO_PHOTON_DEFAULT,
    getDefaultValidationBits,
} from '@/bb84-constants';

const SoloGameModal = ({ triggerClassName, open, onOpenChange }: { triggerClassName?: string; open?: boolean; onOpenChange?: (open: boolean) => void }) => {

    const {
        playerRole,
        setPlayerRole,
        setPlayingSolo,
        setPlayerName,
    } = usePlayerStore();
    const {
        setPhotonNumber,
        setGameHasEve,
        setValidationBitsLength,
    } = useBB84GameStore();
    const {
        setEvePresent,
        setAlicePhotons,
        setAliceBits,
        setAliceBases,
        resetRoom,
    } = useBB84RoomStore();
    const { pushLines, resetProgress } = useBB84ProgressStore();

    const { localize } = useLanguage();
    const router = useRouter();
    const [formStep, setFormStep] = useState(0);
    const [eveChecked, setEveChecked] = useState(false);

    const formSchema = z.object({
        photonNumber: z.coerce.number({
            invalid_type_error: localize('component.createGame.keyError'),
        })
            .int()
            .max(BB84_SOLO_PHOTON_MAX, {
                message: localize('component.createGame.keyMax'),
            }),
        eve: z.boolean({
            required_error: localize('component.main.pinRequired'),
        }).default(false),
        validationBitsLength: z.coerce.number({
            invalid_type_error: localize('component.createGame.numbersOnly'),
        })
            .int(),
        playerName: z.string({
            required_error: localize('component.main.nameRequired'),
        }).min(2, {
            message: localize('component.main.nameMin'),
        }).max(10, {
            message: localize('component.main.nameMax'),
        }),
    }).refine(schema =>
        (schema.eve &&
            (schema.photonNumber >= BB84_SOLO_PHOTON_MIN_WITH_EVE && schema.photonNumber <= BB84_SOLO_PHOTON_MAX)) ||
        (!schema.eve &&
            (schema.photonNumber >= BB84_SOLO_PHOTON_MIN_WITHOUT_EVE && schema.photonNumber <= BB84_SOLO_PHOTON_MAX)),
        {
            message: localize('component.createGame.keyMin'),
            path: ['photonNumber'],
        }).refine(schema => ((schema.eve &&
            (schema.validationBitsLength > 0 && schema.validationBitsLength <=
                schema.photonNumber / 2)) || !schema.eve),
            {
                message: localize('component.createGame.validationLength'),
                path: ['validationBitsLength'],
            });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            /**
             * PRE-FILLED DEFAULTS STRATEGY
             * ════════════════════════════════════════════════════════════
             * 
             * These defaults adapt based on BB84_TEST_MODE:
             * 
             * TEST MODE (BB84_TEST_MODE = true):
             *   - photonNumber: 4 → Quick test iterations, instant feedback
             *   - validationBitsLength: 1 → Minimal sifting overhead
             * 
             * PRODUCTION (BB84_TEST_MODE = false):
             *   - photonNumber: 10 → Realistic quantum key distribution demo
             *                     ~5 bits after basis matching (sifting)
             *                     ~2-3 bits for validation/eavesdropping detection
             *   - validationBitsLength: 2-3 (25% of photons)
             *                     Matches practical BB84 security model:
             *                     • First 50% basis match → sifted key
             *                     • Next 50% of sifted → validation (Eve detection)
             * 
             * RATIONALE:
             * - Using 25% validation ratio reflects real BB84 security proofs
             * - Pre-filled values avoid blank forms (UX best practice)
             * - Students see correct defaults on deploy; devs use low values for speed
             * - Min values with Eve are higher because sifting reduces key further
             */
            photonNumber: BB84_SOLO_PHOTON_DEFAULT,
            eve: false,
            validationBitsLength: getDefaultValidationBits(BB84_SOLO_PHOTON_DEFAULT),
            playerName: '',
        },
    });

    const onStartSoloGame = (
        photonNumber: number,
        eve: boolean,
        validationBitsLength: number,
        playerName: string,
    ) => {
        void recordGameStats('bb84', 1, { silent: true });
        clearBB84LocalStorage();
        resetRoom();
        resetProgress();
        setPlayerName(playerName);
        setPlayingSolo(true);
        setEvePresent(eve);
        setGameHasEve(eve);
        setValidationBitsLength(validationBitsLength);
        setPhotonNumber(photonNumber);

        // Save game config to localStorage for page refresh persistence
        localStorage.setItem('bb84PhotonNumber', JSON.stringify(photonNumber));
        localStorage.setItem('bb84ValidationBitsLength', JSON.stringify(validationBitsLength));
        localStorage.setItem('bb84GameHasEve', JSON.stringify(eve));
        localStorage.setItem('bb84GameData', JSON.stringify({ evePresent: eve }));

        if (playerRole === 'B') {
            const aliceBits = generateAliceBits(photonNumber);
            const aliceBases = generateAliceBases(photonNumber);
            let alicePhotons = generateAlicePhotons(aliceBits, aliceBases);
            if (eve) {
                alicePhotons = mimicEveIntercept(alicePhotons);
            }
            setAliceBits(aliceBits);
            setAliceBases(aliceBases);
            setAlicePhotons(alicePhotons);
            pushLines([
                {
                    title: 'component.exchange.welcome',
                },
                {
                    content: 'component.bobExchange.waiting',
                },
                {
                    content: 'component.bobExchange.photonsArrived',
                },
                {
                    title: 'component.game.step1',
                    content: 'component.bobExchange.choose',
                },
            ]);
        }
        router.replace('/bb84/play');
    };

    const roleSelection = (
        <div className="flex flex-col gap-y-4 w-full items-center">
            <p className="text-lg">{localize('component.bb84.soloRoleSelect')}</p>
            <div className="flex w-full gap-x-6 justify-center">
                <div
                    className="bg-background flex flex-col gap-y-2
                            items-center border border-secondary rounded-md
                            p-4 hover:bg-secondary/40 cursor-pointer"
                    onClick={() => {
                        setPlayerRole('A');
                        setFormStep(1);
                    }}>
                    <div className="relative h-[100px] w-[130px]">
                        <Image
                            fill
                            src="/images/SNE-EnigmesQuantiques_Personnages_Alice_head.png"
                            alt="Alice"
                            className="object-contain"
                        />
                    </div>
                    <p>Alice</p>
                </div>
                <div
                    className="flex flex-col gap-y-2 items-center
                            border border-secondary rounded-md p-4
                            hover:bg-secondary/40 cursor-pointer"
                    onClick={() => {
                        setPlayerRole('B');
                        setFormStep(1);
                    }}>
                    <div className="relative h-[100px] w-[100px]">
                        <Image
                            fill
                            src="/images/SNE-EnigmesQuantiques_Personnages_Bob_Head.png"
                            alt="Bob"
                            className="object-contain"
                        />
                    </div>
                    <p>Bob</p>
                </div>
            </div>
        </div>
    );

    const onEveChecked = (
        onChange: (...event: any[]) => void,
        checked: CheckedState,
        photonNumber: number
    ) => {
        setEveChecked(!eveChecked);
        onChange(checked);
        // Automatically adjust validation bits when Eve is toggled
        form.setValue('validationBitsLength', getDefaultValidationBits(photonNumber));
    };

    const gameSettings = (
        <Form {...form}>
            <form className="flex flex-col gap-y-4"
                onSubmit={form.handleSubmit(
                    ({
                        photonNumber,
                        eve,
                        validationBitsLength,
                        playerName,
                    }) => onStartSoloGame(photonNumber, eve,
                        validationBitsLength, playerName))}
            >
                <FormField
                    control={form.control}
                    name="playerName"
                    render={({ field }) => (
                        <FormItem
                            className="flex gap-x-5 items-center">
                            <FormLabel
                                className="text-nowrap col-span-1"
                            >{localize(
                                'component.main.nameLabel')}</FormLabel>
                            <FormControl className="mx-2">
                                <Input
                                    placeholder=""
                                    className="w-[150px]"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="photonNumber"
                    render={({ field }) => (
                        <FormItem
                            className="flex gap-x-5 items-center">
                            <FormLabel
                                className="text-nowrap col-span-1"
                            >{localize(
                                'component.createGame.keyLength')}</FormLabel>
                            <FormControl className="mx-2">
                                <Input
                                    maxLength={2}
                                    placeholder="10"
                                    className="text-center w-[50px]"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eve"
                    render={({ field }) => (
                        <FormItem
                            className="space-y-0 flex gap-x-5 items-center">
                            <FormLabel
                                className="text-nowrap col-span-1"
                            >{localize(
                                'component.createGame.eve')}</FormLabel>
                            <FormControl className="mx-2">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checkState) => onEveChecked(
                                        field.onChange,
                                        checkState,
                                        form.getValues('photonNumber')
                                    )}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {eveChecked && <FormField
                    control={form.control}
                    name="validationBitsLength"
                    render={({ field }) => (
                        <FormItem
                            className="space-y-0 flex gap-x-5 items-center">
                            <FormLabel
                                className="text-nowrap col-span-1"
                            >{localize(
                                'component.createGame.validationDescription')}</FormLabel>
                            <FormControl className="mx-2">
                                <Input
                                    type={'number'}
                                    maxLength={2}
                                    min="0"
                                    placeholder="10"
                                    className="text-center w-[50px]"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />}
                <DialogFooter>
                    <Button
                        type="submit">{localize('component.waitingRoom.start')}</Button>
                </DialogFooter>
            </form>
        </Form>
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setFormStep(0);
                onOpenChange?.(isOpen);
            }}
        >
            {/* Only show trigger button in legacy/uncontrolled mode */}
            {open === undefined && (
                <DialogTrigger asChild>
                    <Button type="button"
                        variant="secondary"
                        className={cn("text-md mt-2 w-[50%] p-2 border border-transparent hover:border-primary/50 hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)] hover:scale-[1.02] transition-all duration-300", triggerClassName)}>
                        {localize('component.bb84.playSolo')}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent
                className="border-secondary w-[90%] md:w-full rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {localize('component.bb84.startSolo')}
                    </DialogTitle>
                </DialogHeader>
                {/* Controlled mode: skip role selection, go straight to settings */}
                {open !== undefined
                    ? gameSettings
                    : (() => {
                        switch (formStep) {
                            case 0: return roleSelection;
                            case 1: return gameSettings;
                            default: return null;
                        }
                    })()
                }
            </DialogContent>
        </Dialog>
    );
};

export default SoloGameModal;
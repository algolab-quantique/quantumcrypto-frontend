'use client';
import axios from '@/commons/http';
import CreateGameModal from '@/components/dps/home-page/create-game-modal';
import SoloGameModal from '@/components/dps/home-page/solo-game-modal';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import useDPSGameStore from '@/store/dps/dps-game-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import usePlayerStore from '@/store/player-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TailSpin } from 'react-loading-icons';
import { toast } from 'sonner';
import * as z from 'zod';

/**
 * DPSMainV3 — V3 Visual Skin for the DPS Game Form
 * 
 * Isolated copy of DPSMain with V3 styles baked in:
 * - Hero title with green neon glow
 * - Outlined primary button (fills on hover)
 * - V3 hover effects on all buttons (glow, scale, border)
 * - V3 alert dialog styling
 */
const DPSMainV3: React.FC = () => {

    const {
        connectToWaitingRoom,
        isWaitingRoomConnected,
        waitingRoomConnecting,
        isPlayRoomConnected,
        connectToPlayRoom,
    } = useSocket();
    const [creatingGame, setCreatingGame] = useState(false);
    const [rejoinDialogOpen, setRejoinDialogOpen] = useState(false);
    const { localize } = useLanguage();
    const {
        setGameCode,
        setGameHasEve,
        setValidationBitsLength,
        setPhotonNumber
    } = useDPSGameStore();
    const {
        setPlayerName,
        setPlayerRole,
        setPartner,
        setIsAdmin,
    } = usePlayerStore();
    const { setDPSTab, setStep, setDisplayedLines } = useDPSProgressStore();
    const { restoreGame } = useDPSRoomStore();
    const router = useRouter();

    useEffect(() => {
        if (isPlayRoomConnected) {
            router.push('/dps/play');
            return;
        }
        const previousGame = localStorage.getItem('dpsPlayerData');
        if (previousGame) {
            //setRejoinDialogOpen(true);
        }
    }, [isPlayRoomConnected]);

    const getGameProgress = () => {

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        const previousGame = getItem('dpsPlayerData');

        if (previousGame) {
            const {
                gameCode,
                role,
                partner,
                gameHasEve,
                playerName,
            } = previousGame;

            setGameHasEve(gameHasEve);
            setGameCode(gameCode);
            setPartner(partner);
            setPlayerRole(role);
            setPlayerName(playerName);
        }

        const stepJSON = getItem('dpsStep');
        if (stepJSON) {
            setStep(stepJSON);
        }

        const tab = localStorage.getItem('dpsTab');
        if (tab) {
            setDPSTab(tab);
        }

        const photonNumber = getItem('dpsPhotonNumber');
        if (photonNumber) {
            setPhotonNumber(photonNumber)
        }

        const validationBitsLength = getItem('dpsValidationBitsLength');
        if (validationBitsLength) {
            setValidationBitsLength(validationBitsLength);
        }

        const previousDisplayedLines = getItem('dpsDisplayedLines');
        if (previousDisplayedLines) {
            setDisplayedLines(previousDisplayedLines);
        }

        const gameDataJSON = getItem('dpsGameData');
        if (gameDataJSON) {
            restoreGame(gameDataJSON);
        }

        if (previousGame && previousGame.role && previousGame.room) {
            connectToPlayRoom('dps', useDPSGameStore.getState().gameCode, previousGame.role, previousGame.room);
        }
    };

    const formSchema = z.object({
        playerName: z.string({
            required_error: localize('component.main.nameRequired'),
        }).min(2, {
            message: localize('component.main.nameMin'),
        }).max(10, {
            message: localize('component.main.nameMax'),
        }),
        gamePIN: z.string({
            required_error: localize('component.main.pinRequired'),
        }).length(5, {
            message: localize('component.main.pinLength'),
        }).toUpperCase(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            playerName: '',
            gamePIN: '',
        },
    });

    const onJoinGame = async ({
        gamePIN,
        playerName,
    }: z.infer<typeof formSchema>) => {

        if (isWaitingRoomConnected) return;

        setGameCode(gamePIN);
        setPlayerName(playerName);
        setIsAdmin(false);

        const data = {
            gameType: 'dps',
            gameCode: gamePIN,
            playerName,
            admin: 0,
        };

        connectToWaitingRoom(data);
    };

    const onCreateGame = async (photonNumber: number) => {

        if (isWaitingRoomConnected) return;

        setCreatingGame(true);

        try {

            const gameData = {
                photon_number: photonNumber,
                validation_bits_length: 0,
            };

            const response = await axios.post('/games/dps/', gameData);
            const { code: gamePIN } = response.data;

            setGameCode(gamePIN);
            setPlayerName('admin');
            setIsAdmin(true);

            const data = {
                gameType: 'dps',
                gameCode: gamePIN,
                playerName: 'admin',
                admin: 1,
            };
            connectToWaitingRoom(data);

        } catch (e) {
            setCreatingGame(false);
            toast.error(localize('component.main.errorCreating'));
        }
    };

    const onCancelRejoin = () => {
        setRejoinDialogOpen(false);
        clearDPSLocalStorage();
    };

    const onRejoin = () => {
        setRejoinDialogOpen(false);
        getGameProgress();
    };

    return (
        <>
            <AlertDialog open={rejoinDialogOpen}>
                <AlertDialogContent className="border-primary/30 bg-card/90 backdrop-blur-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {localize('component.bb84.gameFound')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {localize('component.bb84.gameFound.desc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancelRejoin}>
                            {localize('general.close')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={onRejoin}>
                            {localize('component.bb84.gameFound.action')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div
                className="h-fit w-fit mx-auto p-2 mt-6 flex flex-col gap-y-16">

                {/* ═══ V3 Hero Title with Glow ═══ */}
                <div className="flex flex-col gap-y-4 text-center">
                    <h1 className="text-5xl font-bold text-primary
                        drop-shadow-[0_0_25px_hsl(152,100%,33%,0.5)]">
                        DPS
                    </h1>
                    <h1 className="text-4xl font-bold">{localize(
                        'component.main.game')}</h1>
                </div>

                {/* ═══ V3 Form Card (Matched to Standard) ═══ */}
                <Card
                    className="pt-4 pb-2 border-none w-[350px] md:w-[500px] mx-auto
                     shadow-md">
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onJoinGame)}
                                className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="playerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-lg">{localize(
                                                    'component.main.nameLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={localize(
                                                        'component.main.name')} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {localize(
                                                    'component.main.nameDescription')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gamePIN"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-lg">{localize(
                                                    'component.main.pinLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="SR117" {...field}
                                                    value={field.value.toUpperCase()} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* ═══ PRIMARY: JOUER SOLO (Outlined → Fills on Hover) ═══ */}
                                <div className="flex gap-x-3 w-full">
                                    <SoloGameModal
                                        triggerClassName="w-full text-md p-2
                                            bg-transparent border-2 border-primary text-primary
                                            hover:bg-primary hover:text-primary-foreground
                                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                            hover:scale-[1.02]
                                            transition-all duration-300"
                                    />
                                </div>
                            </form>
                        </Form>
                        {/* ═══ SECONDARY: Rejoindre + Créer (Outside form, like standard) ═══ */}
                        <div className="flex flex-row justify-center gap-x-2">
                            <Button type="submit"
                                disabled={waitingRoomConnecting}
                                variant="secondary"
                                onClick={form.handleSubmit(onJoinGame)}
                                className="text-md mt-2 w-[50%] p-2
                                    border border-transparent
                                    hover:border-primary/50
                                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                    hover:scale-[1.02]
                                    transition-all duration-300">
                                {creatingGame ? <TailSpin className="w-5 h-5" /> : localize('component.main.join')}
                            </Button>
                            <CreateGameModal
                                connecting={waitingRoomConnecting}
                                creatingGame={creatingGame}
                                onCreateGame={onCreateGame}
                                triggerClassName="text-md mt-2 w-[50%] p-2
                                    border border-transparent
                                    hover:border-primary/50
                                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                    hover:scale-[1.02]
                                    transition-all duration-300"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default DPSMainV3;

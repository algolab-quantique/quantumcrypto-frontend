'use client';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TailSpin } from 'react-loading-icons';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import axios from '@/commons/http';
import { useSocket } from '@/components/providers/socket-provider';
import { useLanguage } from '@/components/providers/language-provider';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import usePlayerStore from '@/store/player-store';
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
import CreateGameModal from '@/components/bb84/home-page/create-game-modal';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useBB84ProgressStore } from '@/store/bb84/bb84-progress-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { clearBB84LocalStorage } from '@/lib/bb84/utils';
import SoloGameModal from '@/components/bb84/home-page/solo-game-modal';
import { Gamepad2, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

/**
 * BB84MainV3 — V3 Visual Skin for the BB84 Game Form
 * 
 * Isolated copy of BB84Main with V3 styles baked in:
 * - Glassmorphism card (backdrop-blur, semi-transparent bg)
 * - Green neon glow on hover
 * - V3 CTA button styles
 * - V3 hero title with glow
 */
const BB84MainV3: React.FC = () => {

    const {
        connectToWaitingRoom,
        isWaitingRoomConnected,
        waitingRoomConnecting,
        isPlayRoomConnected,
        connectToPlayRoom,
    } = useSocket();
    const [creatingGame, setCreatingGame] = useState(false);
    const [rejoinDialogOpen, setRejoinDialogOpen] = useState(false);
    const [flipFace, setFlipFace] = useState<'front' | 'solo' | 'multi'>('front');
    const [soloModalOpen, setSoloModalOpen] = useState(false);
    const { localize } = useLanguage();
    const {
        setGameCode,
        setGameHasEve,
        setValidationBitsLength,
        setPhotonNumber,
    } = useBB84GameStore();
    const {
        setPlayerName,
        setPlayerRole,
        setPartner,
        setIsAdmin,
    } = usePlayerStore();
    const {
        setBb84Tab,
        setStep,
        setDisplayedLines,
        resetProgress,
    } = useBB84ProgressStore();
    const { restoreGame, resetRoom } = useBB84RoomStore();
    const router = useRouter();

    useEffect(() => {
        if (isPlayRoomConnected) {
            router.push('/bb84/play');
            return;
        }
        const previousGame = localStorage.getItem('bb84PlayerData');
        if (previousGame) {
            setRejoinDialogOpen(true);
        }
    }, [isPlayRoomConnected]);

    const getGameProgress = () => {

        const getItem = (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        };

        const previousGame = getItem('bb84PlayerData');

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

        const stepJSON = getItem('bb84Step');
        if (stepJSON) {
            setStep(stepJSON);
        }

        const tab = localStorage.getItem('bb84Tab');
        if (tab) {
            setBb84Tab(tab);
        }

        const photonNumber = getItem('bb84PhotonNumber');
        if (photonNumber) {
            setPhotonNumber(photonNumber);
        }

        const validationBitsLength = getItem('bb84ValidationBitsLength');
        if (validationBitsLength) {
            setValidationBitsLength(validationBitsLength);
        }

        const previousDisplayedLines = getItem('bb84DisplayedLines');
        if (previousDisplayedLines) {
            setDisplayedLines(previousDisplayedLines);
        }

        const gameDataJSON = getItem('bb84GameData');
        if (gameDataJSON) {
            restoreGame(gameDataJSON);
        }

        if (previousGame && previousGame.role && previousGame.room) {
            connectToPlayRoom('bb84', useBB84GameStore.getState().gameCode, previousGame.role, previousGame.room);
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
            gameType: 'bb84',
            gameCode: gamePIN,
            playerName,
            admin: 0,
        };

        connectToWaitingRoom(data);
    };

    const onCreateGame = async (photonNumber: number, eve: boolean,
        validationBits: number,
        evePercentage: number) => {

        if (isWaitingRoomConnected) return;

        setCreatingGame(true);

        try {

            const gameData = {
                photon_number: photonNumber,
                eve,
                validation_bits_length: validationBits,
                eve_percentage: evePercentage,
            };

            const response = await axios.post('/games/bb84/', gameData);
            const { code: gamePIN } = response.data;

            setGameCode(gamePIN);
            setPlayerName('admin');
            setIsAdmin(true);

            const data = {
                gameType: 'bb84',
                gameCode: gamePIN,
                playerName: 'admin',
                admin: 1,
            };
            connectToWaitingRoom(data);

        } catch (e) {
            setCreatingGame(false);
            console.log(e);
            toast.error(localize('component.main.errorCreating'));
        }
    };

    const onCancelRejoin = () => {
        setRejoinDialogOpen(false);
        clearBB84LocalStorage();
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
            <div className="h-fit w-fit mx-auto p-2 mt-6 flex flex-col gap-y-12">

                {/* ═══ V3 Hero Title with Glow ═══ */}
                <div className="flex flex-col gap-y-4 text-center">
                    <h1 className="text-5xl font-bold text-primary
                        drop-shadow-[0_0_25px_hsl(152,100%,33%,0.5)]">
                        BB84
                    </h1>
                    <h1 className="text-4xl font-bold">{localize('component.main.game')}</h1>
                </div>

                {/* ═══ Card Flip ═══ */}
                <div
                    className="w-[350px] md:w-[500px] h-[400px] md:h-[340px] mx-auto"
                    style={{ perspective: '1000px' }}>
                    <div
                        className="relative w-full h-full transition-all duration-700"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: flipFace !== 'front' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>

                        {/* ── Face AVANT ── */}
                        <Card
                            className={cn(
                                'absolute inset-0 w-full h-full',
                                'border border-border/60 bg-card backdrop-blur-sm shadow-lg',
                                'hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]',
                                'transition-all duration-300',
                                flipFace !== 'front' ? 'pointer-events-none' : 'z-10'
                            )}
                            style={{ backfaceVisibility: 'hidden' }}>
                            <CardContent className="h-full flex flex-col items-center justify-center space-y-4 p-6">
                                <h3 className="text-xl font-bold text-muted-foreground mb-2">
                                    Commencer une partie
                                </h3>
                                <Button
                                    type="button"
                                    onClick={() => setFlipFace('solo')}
                                    className="w-full h-20 text-lg font-bold bg-background hover:bg-primary/10
                                        border-2 border-border hover:border-primary/50 text-foreground
                                        transition-all flex justify-between px-8 group cursor-pointer">
                                    <div className="flex items-center">
                                        <Gamepad2 className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                        Jouer Solo
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setFlipFace('multi')}
                                    className="w-full h-20 text-lg font-bold bg-background hover:bg-primary/10
                                        border-2 border-border hover:border-primary/50 text-foreground
                                        transition-all flex justify-between px-8 group cursor-pointer">
                                    <div className="flex items-center">
                                        <Users className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                        Multijoueur
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* ── Face ARRIÈRE ── */}
                        <Card
                            className={cn(
                                'absolute inset-0 w-full h-full flex flex-col',
                                'border border-primary/40 bg-card backdrop-blur-md',
                                'shadow-[0_0_40px_hsl(152,100%,33%,0.1)]',
                                flipFace === 'front' ? 'pointer-events-none' : 'z-10'
                            )}
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <CardContent className="h-full flex flex-col p-6 space-y-4">

                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-primary flex items-center">
                                        {flipFace === 'multi'
                                            ? <><Users className="w-5 h-5 mr-2" /> Multijoueur</>
                                            : <><Gamepad2 className="w-5 h-5 mr-2" /> Jouer Solo</>}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setFlipFace('front')}
                                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center">
                                        <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Retour
                                    </button>
                                </div>

                                {/* Solo */}
                                {flipFace === 'solo' && (
                                    <div className="flex-grow flex flex-col justify-center space-y-3">
                                        <p className="text-sm text-center text-muted-foreground font-medium">
                                            Choisissez votre rôle
                                        </p>
                                        <div className="flex gap-x-4 justify-center">
                                            {/* Alice */}
                                            <div
                                                className="flex flex-col items-center gap-y-2 p-3
                                                    border border-border rounded-md cursor-pointer
                                                    hover:border-primary/50 hover:bg-primary/5
                                                    transition-all duration-200"
                                                onClick={() => { setPlayerRole('A'); setSoloModalOpen(true); }}>
                                                <div className="relative h-[80px] w-[110px]">
                                                    <Image
                                                        fill
                                                        src="/images/SNE-EnigmesQuantiques_Personnages_Alice_head.png"
                                                        alt="Alice"
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold">Alice</p>
                                            </div>
                                            {/* Bob */}
                                            <div
                                                className="flex flex-col items-center gap-y-2 p-3
                                                    border border-border rounded-md cursor-pointer
                                                    hover:border-primary/50 hover:bg-primary/5
                                                    transition-all duration-200"
                                                onClick={() => { setPlayerRole('B'); setSoloModalOpen(true); }}>
                                                <div className="relative h-[80px] w-[80px]">
                                                    <Image
                                                        fill
                                                        src="/images/SNE-EnigmesQuantiques_Personnages_Bob_Head.png"
                                                        alt="Bob"
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-sm font-semibold">Bob</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Multi */}
                                {flipFace === 'multi' && (
                                    <div className="space-y-4 flex-grow flex flex-col justify-center">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1">
                                                {localize('component.main.nameLabel')}
                                            </label>
                                            <Input
                                                placeholder={localize('component.main.name')}
                                                className="bg-background/50 h-10" 
                                                {...form.register('playerName')} 
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            {/* ── Left column: PIN + Join ── */}
                                            <div className="space-y-2 flex-[2]">
                                                <label className="text-xs font-medium text-muted-foreground ml-1">
                                                    {localize('component.main.pinLabel')}
                                                </label>
                                                <Input
                                                    placeholder="SR117"
                                                    maxLength={5}
                                                    className="bg-background/50 h-10 text-center tracking-widest font-mono text-lg" 
                                                    {...form.register('gamePIN')}
                                                    onChange={(e) => form.setValue('gamePIN', e.target.value.toUpperCase())} 
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="secondary"
                                                    disabled={waitingRoomConnecting}
                                                    onClick={form.handleSubmit(onJoinGame)}
                                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10">
                                                    {creatingGame ? <TailSpin className="w-5 h-5" /> : localize('component.main.join')}
                                                </Button>
                                            </div>

                                            {/* ── Center: vertical OR divider ── */}
                                            <div className="flex items-center gap-2 px-1 pb-1">
                                                <div className="h-full border-l border-border/40" />
                                                <span
                                                    className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest"
                                                    style={{ writingMode: 'vertical-rl' }}>
                                                    or
                                                </span>
                                                <div className="h-full border-l border-border/40" />
                                            </div>

                                            {/* ── Right column: placeholder + Create ── */}
                                            <div className="space-y-2 flex-[1] flex flex-col">
                                                <div className="flex-1 flex items-center justify-center rounded-md border border-dashed border-border/50 bg-background/20 text-xs text-muted-foreground p-2 text-center h-10">
                                                    {/* i18n: component.main.createHint → "Create a new game" (en/fr/es) */}
                                                    Create a new game
                                                </div>
                                                <CreateGameModal
                                                    connecting={waitingRoomConnecting}
                                                    creatingGame={creatingGame}
                                                    onCreateGame={onCreateGame}
                                                    triggerClassName="w-full h-10 border-primary/30 hover:bg-primary/10 mt-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
            {/* Controlled SoloGameModal — opened when role selected on card */}
            <SoloGameModal open={soloModalOpen} onOpenChange={setSoloModalOpen} />
        </>
    );
};

export default BB84MainV3;

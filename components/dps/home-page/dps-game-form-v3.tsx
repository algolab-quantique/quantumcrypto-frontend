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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import { cn } from '@/lib/utils';
import useDPSGameStore from '@/store/dps/dps-game-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import usePlayerStore from '@/store/player-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Gamepad2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TailSpin } from 'react-loading-icons';
import { toast } from 'sonner';
import * as z from 'zod';

/**
 * DPSMainV3 — V3 Visual Skin for the DPS Game Form
 *
 * - Card flip UI (front / solo / multi)
 * - Glassmorphism card (backdrop-blur, opaque bg)
 * - Green neon glow on hover
 * - V3 CTA button styles
 * - V3 hero title with glow
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
    const [flipFace, setFlipFace] = useState<'front' | 'solo' | 'multi'>('front');
    const { localize } = useLanguage();
    const {
        setGameCode,
        setGameHasEve,
        setValidationBitsLength,
        setPhotonNumber,
    } = useDPSGameStore();
    const {
        setPlayerName,
        setPlayerRole,
        setPartner,
        setIsAdmin,
        setPlayingSolo,
        setPlayingMultiplayer,
    } = usePlayerStore();
    const { setDPSTab, setStep, setDisplayedLines } = useDPSProgressStore();
    const { restoreGame } = useDPSRoomStore();
    const router = useRouter();

    useEffect(() => {
        const gameDataRaw = localStorage.getItem('dpsGameData');
        const gameData = gameDataRaw ? JSON.parse(gameDataRaw) : null;
        const gameCompleted = gameData && gameData.gameSuccess === true;

        // If the game was already completed, clean up stale data.
        if (gameCompleted) {
            clearDPSLocalStorage();
            setPlayingSolo(false);
            setPlayingMultiplayer(false);
            return;
        }

        if (isPlayRoomConnected) {
            router.push('/dps/play');
            return;
        }
        const previousGame = localStorage.getItem('dpsPlayerData');
        if (previousGame) {
            // Rejoin dialog intentionally disabled for DPS for now.
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
            const { gameCode, role, partner, gameHasEve, playerName } = previousGame;
            setGameHasEve(gameHasEve);
            setGameCode(gameCode);
            setPartner(partner);
            setPlayerRole(role);
            setPlayerName(playerName);
        }

        const stepJSON = getItem('dpsStep');
        if (stepJSON) setStep(stepJSON);

        const tab = localStorage.getItem('dpsTab');
        if (tab) setDPSTab(tab);

        const photonNumber = getItem('dpsPhotonNumber');
        if (photonNumber) setPhotonNumber(photonNumber);

        const validationBitsLength = getItem('dpsValidationBitsLength');
        if (validationBitsLength) setValidationBitsLength(validationBitsLength);

        const previousDisplayedLines = getItem('dpsDisplayedLines');
        if (previousDisplayedLines) setDisplayedLines(previousDisplayedLines);

        const gameDataJSON = getItem('dpsGameData');
        if (gameDataJSON) restoreGame(gameDataJSON);

        if (previousGame && previousGame.role && previousGame.room) {
            connectToPlayRoom('dps', useDPSGameStore.getState().gameCode, previousGame.role, previousGame.room);
        }
    };

    const formSchema = z.object({
        playerName: z.string({
            required_error: localize('component.main.nameRequired'),
        }).min(2, { message: localize('component.main.nameMin') })
          .max(10, { message: localize('component.main.nameMax') }),
        gamePIN: z.string({
            required_error: localize('component.main.pinRequired'),
        }).length(5, { message: localize('component.main.pinLength') })
          .toUpperCase(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { playerName: '', gamePIN: '' },
    });

    const onJoinGame = async ({ gamePIN, playerName }: z.infer<typeof formSchema>) => {
        if (isWaitingRoomConnected) return;

        // Reset solo/multiplayer flags before joining a new game.
        clearDPSLocalStorage();
        setPlayingMultiplayer(false);
        setPlayingSolo(false);

        setGameCode(gamePIN);
        setPlayerName(playerName);
        setIsAdmin(false);
        connectToWaitingRoom({ gameType: 'dps', gameCode: gamePIN, playerName, admin: 0 });
    };

    const onCreateGame = async (photonNumber: number) => {
        if (isWaitingRoomConnected) return;

        // Reset solo/multiplayer flags before creating a new game.
        clearDPSLocalStorage();
        setPlayingMultiplayer(false);
        setPlayingSolo(false);

        setCreatingGame(true);
        try {
            const response = await axios.post('/games/dps/', {
                photon_number: photonNumber,
                validation_bits_length: 0,
            });
            const { code: gamePIN } = response.data;
            setGameCode(gamePIN);
            setPlayerName('admin');
            setIsAdmin(true);
            connectToWaitingRoom({ gameType: 'dps', gameCode: gamePIN, playerName: 'admin', admin: 1 });
        } catch (e) {
            setCreatingGame(false);
            toast.error(localize('component.main.errorCreating'));
        }
    };

    const onCancelRejoin = () => { setRejoinDialogOpen(false); clearDPSLocalStorage(); };
    const onRejoin = () => { setRejoinDialogOpen(false); getGameProgress(); };

    return (
        <>
            <AlertDialog open={rejoinDialogOpen}>
                <AlertDialogContent className="border-primary/30 bg-card/90 backdrop-blur-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{localize('component.bb84.gameFound')}</AlertDialogTitle>
                        <AlertDialogDescription>{localize('component.bb84.gameFound.desc')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancelRejoin}>{localize('general.close')}</AlertDialogCancel>
                        <AlertDialogAction onClick={onRejoin}>{localize('component.bb84.gameFound.action')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="h-fit w-fit mx-auto p-2 mt-6 flex flex-col gap-y-12">

                {/* ═══ V3 Hero Title with Glow ═══ */}
                <div className="flex flex-col gap-y-4 text-center">
                    <h1 className="text-5xl font-bold text-primary drop-shadow-[0_0_25px_hsl(152,100%,33%,0.5)]">
                        DPS
                    </h1>
                    <h1 className="text-4xl font-bold">{localize('component.main.game')}</h1>
                </div>

                {/* ═══ Card Flip ═══ */}
                <div className="w-[350px] md:w-[500px] h-[400px] md:h-[340px] mx-auto" style={{ perspective: '1000px' }}>
                    <div className="relative w-full h-full transition-all duration-700"
                        style={{ transformStyle: 'preserve-3d', transform: flipFace !== 'front' ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                        {/* ── Face AVANT ── */}
                        <Card className={cn(
                            'absolute inset-0 w-full h-full',
                            'border border-border/60 bg-card backdrop-blur-sm shadow-lg',
                            'hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]',
                            'transition-all duration-300',
                            flipFace !== 'front' ? 'pointer-events-none' : 'z-10'
                        )} style={{ backfaceVisibility: 'hidden' }}>
                            <CardContent className="h-full flex flex-col items-center justify-center space-y-4 p-6">
                                <h3 className="text-xl font-bold text-muted-foreground mb-2">Commencer une partie</h3>
                                <Button type="button" onClick={() => setFlipFace('solo')}
                                    className="w-full h-20 text-lg font-bold bg-background hover:bg-primary/10
                                        border-2 border-border hover:border-primary/50 text-foreground
                                        transition-all flex justify-between px-8 group cursor-pointer">
                                    <div className="flex items-center">
                                        <Gamepad2 className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                        Jouer Solo
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Button>
                                <Button type="button" onClick={() => setFlipFace('multi')}
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
                        <Card className={cn(
                            'absolute inset-0 w-full h-full flex flex-col',
                            'border border-primary/40 bg-card backdrop-blur-md',
                            'shadow-[0_0_40px_hsl(152,100%,33%,0.1)]',
                            flipFace === 'front' ? 'pointer-events-none' : 'z-10'
                        )} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <CardContent className="h-full flex flex-col p-6 space-y-4">

                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-primary flex items-center">
                                        {flipFace === 'multi'
                                            ? <><Users className="w-5 h-5 mr-2" /> Multijoueur</>
                                            : <><Gamepad2 className="w-5 h-5 mr-2" /> Jouer Solo</>}
                                    </h3>
                                    <button type="button" onClick={() => setFlipFace('front')}
                                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center">
                                        <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Retour
                                    </button>
                                </div>

                                {/* Solo */}
                                {flipFace === 'solo' && (
                                    <div className="space-y-5 flex-grow flex flex-col justify-center">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1">
                                                {localize('component.main.nameLabel')}
                                            </label>
                                            <Input placeholder={localize('component.main.name')}
                                                className="bg-background/50 h-10"
                                                {...form.register('playerName')} />
                                        </div>
                                        <SoloGameModal
                                            triggerClassName="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90
                                                text-primary-foreground shadow-[0_0_15px_hsl(152,100%,33%,0.3)]"
                                        />
                                    </div>
                                )}

                                {/* Multi */}
                                {flipFace === 'multi' && (
                                    <div className="space-y-4 flex-grow flex flex-col justify-center">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground ml-1">
                                                {localize('component.main.nameLabel')}
                                            </label>
                                            <Input placeholder={localize('component.main.name')}
                                                className="bg-background/50 h-10"
                                                {...form.register('playerName')} />
                                        </div>
                                        <div className="flex gap-3">
                                            {/* ── Left column: PIN + Join ── */}
                                            <div className="space-y-2 flex-[2]">
                                                <label className="text-xs font-medium text-muted-foreground ml-1">
                                                    {localize('component.main.pinLabel')}
                                                </label>
                                                <Input placeholder="SR117" maxLength={5}
                                                    className="bg-background/50 h-10 text-center tracking-widest font-mono text-lg"
                                                    {...form.register('gamePIN')}
                                                    onChange={(e) => form.setValue('gamePIN', e.target.value.toUpperCase())} />
                                                <Button type="submit" variant="secondary"
                                                    disabled={waitingRoomConnecting}
                                                    onClick={form.handleSubmit(onJoinGame)}
                                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10">
                                                    {creatingGame ? <TailSpin className="w-5 h-5" /> : localize('component.main.join')}
                                                </Button>
                                            </div>

                                            {/* ── Center: vertical OR divider ── */}
                                            <div className="flex items-center gap-2 px-1 pb-1">
                                                <div className="h-full border-l border-border/40" />
                                                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest"
                                                    style={{ writingMode: 'vertical-rl' }}>or</span>
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
        </>
    );
};

export default DPSMainV3;
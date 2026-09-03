'use client';
import axios from '@/commons/http';
import CreateGameModal from '@/components/e91/home-page/create-game-modal';
import SoloGameModal from '@/components/e91/home-page/solo-game-modal';
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
import { abandon, startFresh } from '@/lib/protocol-lifecycle/lifecycle';
import { e91Adapter } from '@/lib/protocol-lifecycle/e91-adapter';
import { cn } from '@/lib/utils';
import useE91GameStore from '@/store/e91/e91-game-store';
import usePlayerStore from '@/store/player-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Gamepad2, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TailSpin } from 'react-loading-icons';
import { toast } from 'sonner';
import * as z from 'zod';

/**
 * E91MainV3 — V3 Visual Skin for the E91 Game Form
 *
 * - Card flip UI (front / solo / multi)
 * - Glassmorphism card (backdrop-blur, opaque bg)
 * - Green neon glow on hover
 * - V3 CTA button styles
 * - V3 hero title with glow
 */
const E91MainV3: React.FC = () => {

    const {
        connectToWaitingRoom,
        isWaitingRoomConnected,
        waitingRoomConnecting,
        isPlayRoomConnected,
        disconnectPlayRoom,
    } = useSocket();
    const [creatingGame, setCreatingGame] = useState(false);
    const [rejoinDialogOpen, setRejoinDialogOpen] = useState(false);
    const [flipFace, setFlipFace] = useState<'front' | 'solo' | 'multi'>('front');
    const [soloModalOpen, setSoloModalOpen] = useState(false);
    const { localize } = useLanguage();
    const { setGameCode } = useE91GameStore();
    const {
        setPlayerName,
        setPlayerRole,
        setIsAdmin,
        setPlayingSolo,
        setPlayingMultiplayer,
    } = usePlayerStore();
    const router = useRouter();

    const getSavedItem = (key: string) => {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            return JSON.parse(item);
        } catch {
            return null;
        }
    };

    // Task 40 Phase 3a: identical to the three lines it replaces — clear the
    // 11 e91* keys, reset room + progress, drop both player-mode flags.
    const clearSavedSession = () => abandon(e91Adapter);

    useEffect(() => {
        const previousGameRaw = localStorage.getItem('e91PlayerData');
        const gameDataRaw = localStorage.getItem('e91GameData');
        const previousGame = getSavedItem('e91PlayerData');
        const gameData = getSavedItem('e91GameData');
        const hasCorruptSavedSession = Boolean(
            (previousGameRaw && !previousGame) ||
            (gameDataRaw && !gameData)
        );
        const hasInvalidPlayerData = Boolean(
            previousGame && (
                !previousGame.gameCode ||
                !previousGame.role ||
                !previousGame.room
            )
        );
        const hasOrphanGameData = Boolean(gameData && !previousGame);
        const gameCompleted = gameData && gameData.gameSuccess === true;
        const hasActiveSession = Boolean(
            previousGame?.gameCode &&
            previousGame?.role &&
            previousGame?.room &&
            usePlayerStore.getState().playingMultiplayer
        );

        if (hasCorruptSavedSession || hasInvalidPlayerData || hasOrphanGameData) {
            clearSavedSession();
            return;
        }

        // If the game was already completed, clean up stale data.
        // Do NOT redirect to play page — there's nothing to resume.
        if (gameCompleted) {
            clearSavedSession();
            return;
        }

        // If WebSocket is still connected AND game is NOT completed,
        // redirect to the play page (active game still in progress).
        if (isPlayRoomConnected && hasActiveSession) {
            router.push('/e91/play');
            return;
        }

        if (isPlayRoomConnected && !hasActiveSession) {
            disconnectPlayRoom();
            return;
        }

        // If there's player data from an interrupted game, offer to rejoin.
        if (previousGameRaw) {
            setRejoinDialogOpen(true);
        }
    }, [isPlayRoomConnected]);

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
        // Task 40 Phase 3a: same three steps, now the shared helper — and the
        // same call BB84's onJoinGame makes.
        startFresh(e91Adapter);

        setGameCode(gamePIN);
        setPlayerName(playerName);
        setIsAdmin(false);
        connectToWaitingRoom({ gameType: 'e91', gameCode: gamePIN, playerName, admin: 0 });
    };

    const onCreateGame = async (photonNumber: number, eve: boolean, evePercentage: number) => {
        if (isWaitingRoomConnected) return;

        // Reset solo/multiplayer flags before creating a new game.
        // Task 40 Phase 3a: same three steps, now the shared helper — and the
        // same call BB84's onCreateGame makes.
        startFresh(e91Adapter);

        setCreatingGame(true);
        try {
            const response = await axios.post('/games/e91/', {
                photon_number: photonNumber,
                eve,
                validation_bits_length: 0,
                eve_percentage: evePercentage,
            });
            const { code: gamePIN } = response.data;
            setGameCode(gamePIN);
            setPlayerName('admin');
            setIsAdmin(true);
            connectToWaitingRoom({ gameType: 'e91', gameCode: gamePIN, playerName: 'admin', admin: 1 });
        } catch (e) {
            setCreatingGame(false);
            console.log(e);
            toast.error(localize('component.main.errorCreating'));
        }
    };

    // Task 40 Phase 3a-2: was clearE91LocalStorage() alone, which left
    // playingSolo/playingMultiplayer set after declining a rejoin. abandon()
    // clears them too — the same call BB84's onCancelRejoin makes.
    const onCancelRejoin = () => { setRejoinDialogOpen(false); abandon(e91Adapter); };
    // Task 40 Phase 3e-1: the form page no longer restores anything itself. It
    // sets the mode flags and routes; /e91/play owns restoreCheckpoint and the
    // multiplayer reconnect (wired in 3d), exactly as BB84's onRejoin does.
    // The deleted getGameProgress() hand-read seven keys with no corrupt-data
    // validation and opened the socket from the form page — two owners for one
    // job, and the timing coupling the ADR calls out.
    // push, not replace: /e91 and /e91/play are both real destinations, so
    // replacing would leave a stale forward entry and break Back/Forward.
    const onRejoin = () => {
        setRejoinDialogOpen(false);
        setPlayingMultiplayer(true);
        setPlayingSolo(false);
        router.push('/e91/play');
    };

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
                        E91
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
                                <h3 className="text-xl font-bold text-muted-foreground mb-2">{localize('component.main.startGame')}</h3>
                                <Button type="button" onClick={() => setFlipFace('solo')}
                                    className="w-full h-20 text-lg font-bold bg-background hover:bg-primary/10
                                        border-2 border-border hover:border-primary/50 text-foreground
                                        transition-all flex justify-between px-8 group cursor-pointer">
                                    <div className="flex items-center">
                                        <Gamepad2 className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                        {localize('component.main.playSoloBtn')}
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Button>
                                <Button type="button" onClick={() => setFlipFace('multi')}
                                    className="w-full h-20 text-lg font-bold bg-background hover:bg-primary/10
                                        border-2 border-border hover:border-primary/50 text-foreground
                                        transition-all flex justify-between px-8 group cursor-pointer">
                                    <div className="flex items-center">
                                        <Users className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                        {localize('component.main.multiplayer')}
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
                                            ? <><Users className="w-5 h-5 mr-2" /> {localize('component.main.multiplayer')}</>
                                            : <><Gamepad2 className="w-5 h-5 mr-2" /> {localize('component.main.playSoloBtn')}</>}
                                    </h3>
                                    <button type="button" onClick={() => setFlipFace('front')}
                                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center">
                                        <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> {localize('component.main.back')}
                                    </button>
                                </div>

                                {/* Solo */}
                                {flipFace === 'solo' && (
                                    <div className="flex-grow flex flex-col justify-center space-y-3">
                                        <p className="text-sm text-center text-muted-foreground font-medium">
                                            {localize('component.main.chooseRole')}
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
                                                    {localize('component.main.createHint')}
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

export default E91MainV3;

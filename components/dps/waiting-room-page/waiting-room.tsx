'use client';

import React, {useState} from 'react';
import {useSocket} from '@/components/providers/socket-provider';
import {useEffect} from 'react';
import useDPSGameStore from '@/store/dps/dps-game-store';
import {Card, CardContent} from '@/components/ui/card';
import {useLanguage} from '@/components/providers/language-provider';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';
import usePlayerStore from '@/store/player-store';
// import PlayerCard from '@/components/waiting-room-page/player-card';
import {Copy} from 'lucide-react';
import isConnected from '@/components/hoc/is-connected';
import {JOIN_EVENT} from '@/bb84-constants';
import { recordGameStats } from '@/app/(main)/services/api'

const WaitingRoom: React.FC = () => {

    const {
        waitingRoomSocket,
        isWaitingRoomConnected,
        disconnectDPSWaitingRoom,
        startGame,
        sendEvent
    } = useSocket();
    const {localize} = useLanguage();
    const router = useRouter();
    const {gameCode, playerCount, players} = useDPSGameStore();
    const {playerName, isAdmin} = usePlayerStore();
    const [copied, setCopied] = useState(false);

    const onStartGame = async () => {
        const response = await recordGameStats('dps', playerCount);
        router.replace(`/games/dps/${gameCode}/results`);
        startGame('dps', response.game_id);
    };

    useEffect(() => {
        if (isWaitingRoomConnected && !isAdmin) {
            const payload = {
                event: JOIN_EVENT,
                message: {
                    game_code: gameCode,
                    player_name: playerName,
                },
            };
            waitingRoomSocket.send(JSON.stringify(payload));
        }
    }, []);

    const adminView = (
        <div className="flex flex-col gap-y-10 mt-12">
            <Card className="pt-4 pb-2 border-none w-[350px] md:w-[500px] mx-auto
                 shadow-md">
                <CardContent>
                    <div
                        className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-14 justify-center items-center">
                        <div
                            className="flex flex-col gap-y-2 text-center md:text-left">
                            <h1 className="font-bold text-foreground text-lg">{localize(
                                'component.waitingRoom.joinAt')}</h1>
                            <p className="font-bold text-foreground text-lg">www.quantumcrypto.app</p>
                        </div>
                        <div className="flex flex-col gap-y-4 text-center">
                            <p className="font-bold text-xl text-foreground">{localize(
                                'component.main.pinLabel')}</p>
                            <div className="flex gap-x-1">
                                <p className="font-bold text-5xl text-highlight">{gameCode}</p>
                                <div
                                    className="flex flex-col gap-y-0 relative">
                                    <Button className="p-1" onClick={() => {
                                        setCopied(true);
                                        setTimeout(() => {
                                            setCopied(false);
                                        }, 1000);
                                        navigator.clipboard.writeText(
                                            gameCode);
                                    }}
                                            variant="ghost">
                                        <Copy/>
                                    </Button>
                                    {copied && <div className={'absolute' +
                                        ' top-9' +
                                        ' border' +
                                        ' border-secondary rounded-md p-2' +
                                        ' bg-background opacity-100' +
                                        ' transition-all shadow-lg' +
                                        ' animate-in' +
                                        ' fade-in-0 zoom-in-95'}>
                                        <p className="text-nowrap">{localize(
                                            'component.waitingRoom.copied')}</p>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col gap-y-5">
                <Card className="pt-4 pb-2 border-none w-[350px] md:w-[500px] mx-auto
                 shadow-md">
                    <CardContent>
                        <div className="flex flex-col text-center gap-y-5">
                            <h1 className="font-bold text-3xl text-foreground">{localize(
                                'component.waitingRoom.players')}</h1>
                            <h1 className="font-bold text-5xl text-foreground">{playerCount}</h1>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-x-4 justify-center">
                    <Button onClick={() => {
                        router.replace('/');
                        disconnectDPSWaitingRoom();
                    }
                    } variant="destructive-outline" size="lg">{localize(
                        'component.waitingRoom.exit')}</Button>
                    {playerCount == 0 ?
                        <TooltipProvider>
                            <Tooltip delayDuration={400}>
                                <TooltipTrigger asChild>
                                    <Button size="lg" className={cn(
                                        playerCount == 0 ?
                                            'bg-primary/90 cursor-default' :
                                            '')}
                                    >{localize(
                                        'component.waitingRoom.start')}</Button>
                                </TooltipTrigger>
                                <TooltipContent className="border-none">
                                    <p>{localize(
                                        'component.waitingRoom.atLeastOnePlayer')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider> :
                        <Button onClick={onStartGame} size="lg">{localize(
                            'component.waitingRoom.start')}</Button>}
                </div>
            </div>
            {/*<div*/}
            {/*    className="w-[80%] flex flex-wrap gap-x-5 mx-auto justify-center">*/}
            {/*    {players.map(*/}
            {/*        ({name}) => <PlayerCard key={name} playerName={name}/>)}*/}
            {/*</div>*/}
        </div>
    );

    const playerView = (
        <div className="flex flex-col gap-y-5 mt-20">
            <Card className="pt-4 pb-2 border-none w-[350px] md:w-[500px] mx-auto
                 shadow-md">
                <CardContent>
                    <div className="flex flex-col text-center gap-y-5">
                        <h1 className="font-bold text-3xl text-foreground">{`${localize(
                            'component.waitingRoom.in')} `}<span
                            className="text-highlight">{`${playerName}`}</span>!
                        </h1>
                        <p className="text-lg text-foreground">{localize(
                            'component.waitingRoom.wait')}</p>
                    </div>
                </CardContent>
            </Card>
            <div className="mx-auto">
                <Button onClick={() => {
                    router.replace('/');
                    disconnectDPSWaitingRoom();
                }
                } variant="destructive-outline" size="lg">{localize(
                    'component.waitingRoom.exit')}</Button>
            </div>
        </div>
    );

    return isAdmin ? adminView : playerView;
};

export default isConnected(WaitingRoom);
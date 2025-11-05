'use client';

import React, {createContext, useContext, useState} from 'react';
// @ts-ignore
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import useE91GameStore from '@/store/e91/e91-game-store';
import useDPSGameStore from '@/store/dps/dps-game-store';
import {toast} from 'sonner';
import {useLanguage} from '@/components/providers/language-provider';
import {useRouter} from 'next/navigation';
import usePlayerStore from '@/store/player-store';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {useE91ProgressStore} from '@/store/e91/e91-progress-store';
import {BB84GameStep, DPSGameStep} from '@/types';
import {
    moveToExchangeTab,
} from '@/components/bb84/play-page/tabs/validation-tab';
import {clearE91LocalStorage} from '@/lib/e91/utils';
import {clearDPSLocalStorage} from '@/lib/dps/utils';
import {clearBB84LocalStorage, restartWithoutEve} from '@/lib/bb84/utils';
import {
    A_BASES_EVENT,
    A_CIPHER_EVENT,
    A_KEY_EVENT,
    A_PHOTONS_EVENT,
    A_VALIDATED_EVENT,
    B_BASES_EVENT,
    B_KEY_EVENT,
    B_SUCCESS_EVENT,
    B_VALIDATED_EVENT,
    CONNECTED_EVENT,
    END_ADMIN_EVENT,
    END_EVENT,
    END_PLAYER_EVENT,
    GAME_STARTED_EVENT,
    INVALID_CODE_EVENT, PLAYER_COUNT_EVENT,
    PLAYER_JOIN_EVENT, RESTART_WITHOUT_EVE_EVENT,
    ROLES_EVENT,
    START_EVENT,
    TAKEN_NAME_EVENT,
} from '@/bb84-constants';

import {
    A_BITS_EVENT,
    A_DECISION_EVENT,
    A_DICE_EVENT,
    A_MEASURE_EVENT,
    A_PREFERENCE_EVENT,
    B_BITS_EVENT,
    B_DECISION_EVENT,
    B_DICE_EVENT,
    B_MEASURE_EVENT,
    B_PREFERENCE_EVENT,
    EVE_SPOTTED_EVENT,
    GAME_ID_EVENT,
    SCORE_EVENT,
    VALIDATION_INDICES_EVENT,
} from '@/e91-constants';

import {
    DPS_GAME_ID_EVENT,
    DPS_CONNECTED_EVENT,
    DPS_END_EVENT,
    A_SUCCESS_EVENT,
    A_PHASES_EVENT,
    B_TIMES_EVENT,
    SWAP_ROLES_AND_RESTART_EVENT,
    PLAYER_LEFT_EVENT,  
} from '@/dps-constants';

import { recordIPAddress } from '@/app/(main)/services/api';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';

type SocketContextType = {
    waitingRoomSocket: any | null;
    playRoomSocket: any | null;
    isWaitingRoomConnected: boolean;
    waitingRoomError: boolean;
    waitingRoomConnecting: boolean;
    isPlayRoomConnected: boolean;
    playRoomError: boolean;
    playRoomConnecting: boolean;
    connectToWaitingRoom: (data: { gameType: string, gameCode: string, playerName: string, admin: number }) => void;
    connectToPlayRoom: (gameType:string, gameCode:string, role: string, room: string) => void;
    startGame: (gameType:string, id: number) => void;
    sendEvent: (event: string, message?: any) => void;
    measurePhotons: (bases: string[]) => void;
    sendPhotons: (photons: number[]) => void;
    sendPhases: (photons: string[][], phases: string[][]) => void;
    sendArrivalTimes: (times: string[]) => void;
    sendCipher: (cipher: string[]) => void;
    shareBases: (bases: string[], event: string, socket?: any) => void;
    shareBits: (bits: string[], event: string, socket?: any) => void;
    shareKey: (key: string[]) => void;
    shareIndices: (validationIndices: number[]) => void;
    shareDecision: (decision: boolean) => void;
    sharePreference: (useValidBits: boolean) => void;
    shareValidation: (valid: boolean) => void;
    restartGameWithoutEve: () => void;
    restartGameAndSwappedRoles: () => void;
    leftGame: () => void;
    shareDiceValue: (value: number) => void;
    sendBobSuccess: (gameType: string) => void;
    sendAliceSuccess: () => void;
    disconnectBB84WaitingRoom: () => void;
    disconnectE91WaitingRoom: () => void;
    disconnectDPSWaitingRoom: () => void;
    sendEveSpotted: () => void;
    saveScore: (score: number) => void;
}

const SocketContext = createContext<SocketContextType>({
    waitingRoomSocket: null,
    playRoomSocket: null,
    isWaitingRoomConnected: false,
    waitingRoomError: false,
    waitingRoomConnecting: false,
    isPlayRoomConnected: false,
    playRoomError: false,
    playRoomConnecting: false,
    connectToWaitingRoom: () => {
    },
    connectToPlayRoom: () => {
    },
    startGame: () => {
    },
    sendEvent: () => {
    },
    measurePhotons: () => {
    },
    sendPhotons: () => {
    },
    sendPhases: () => {
    },
    sendArrivalTimes: () => {
    },
    sendCipher: () => {
    },
    shareBases: () => {
    },
    shareBits: () => {
    },
    sharePreference: () => {
    },
    shareKey: () => {
    },
    shareIndices: () => {
    },
    shareDecision: () => {
    },
    sendEveSpotted: () => {
    },
    saveScore: () => {
    },
    restartGameWithoutEve: () => {
    },
    restartGameAndSwappedRoles: () => {
    },
    leftGame: () => {
    },
    shareValidation: () => {
    },
    shareDiceValue: () => {
    },
    disconnectBB84WaitingRoom: () => {
    },
    disconnectE91WaitingRoom: () => {
    },
    disconnectDPSWaitingRoom: () => {
    },
    sendBobSuccess: () => {
    },
    sendAliceSuccess: () => {
    },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}: { children: React.ReactNode }) => {

    const {localize} = useLanguage();
    const router = useRouter();
    const [waitingRoomSocket, setWaitingRoomSocket] = useState(null);
    const [playRoomSocket, setPlayRoomSocket] = useState(null);
    const [isWaitingRoomConnected, setIsWaitingRoomConnected] = useState(
        false);
    const [waitingRoomError, setWaitingRoomError] = useState(false);
    const [waitingRoomConnecting, setWaitingRoomConnecting] = useState(false);
    const [isPlayRoomConnected, setIsPlayRoomConnected] = useState(false);
    const [playRoomError, setPlayRoomError] = useState(false);
    const [playRoomConnecting, setPlayRoomConnecting] = useState(false);

    const connectToWaitingRoom = ({
                                      gameType,
                                      gameCode,
                                      playerName,
                                      admin,
                                  }: { gameType: string, gameCode: string, playerName: string, admin: number }) => {

        setWaitingRoomConnecting(true);

        // Socket instance initialization
        // old code have 2 problems
        // 1) playerName is not encoded, so if it contains special characters, the URL will be invalid
        // 2) not using the standard ?key_1=value_1&key_2=value_2
        //const socketInstance = new W3CWebSocket(
        //    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/?player_name=${playerName}?admin=${admin}`
        //);
        //---------------------------------------
        // new code fixing the above issues
        // very important that the backend can parse it correctly.
        // so the fix must also be made on the backend side
        const socketInstance = new W3CWebSocket(
            `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/?player_name=${encodeURIComponent(playerName)}&admin=${admin}`
        );

        (socketInstance as any).onerror = (error: any) => {
            console.log(error);
            setWaitingRoomError(true);
            setWaitingRoomConnecting(false);
        };

        (socketInstance as any).onclose = () => {
            setIsWaitingRoomConnected(false);
            setWaitingRoomConnecting(false);
            setWaitingRoomError(false);
            if (gameType === 'bb84') {
                useBB84GameStore.setState({players: [], playerCount: 0});
            } else if (gameType === 'e91') {
                useE91GameStore.setState({players: [], playerCount: 0});
            } else if (gameType === 'dps') {
                useDPSGameStore.setState({players: [], playerCount: 0});
            }
        };

        (socketInstance as any).onmessage = (json: any) => {
            setWaitingRoomError(false);

            const data = JSON.parse(json.data)['payload'];
            const message = data['message'];
            const event = data['event'];

            switch (event) {

                case PLAYER_COUNT_EVENT:
                    if (gameType === 'bb84') {
                        useBB84GameStore.setState({playerCount: message['count']});
                    } else if (gameType === 'e91') {
                        useE91GameStore.setState({playerCount: message['count']});
                    } else if (gameType === 'dps'){
                        useDPSGameStore.setState({playerCount:message['count']});
                    }                    
                    break;
                
                case GAME_ID_EVENT:
                    recordIPAddress(message['game_id']);
                    break;

                case CONNECTED_EVENT:
                    if (gameType === 'bb84') {
                        router.push('bb84/waiting-room');
                        setIsWaitingRoomConnected(true);
                        setWaitingRoomConnecting(false);
                        if (!usePlayerStore.getState().isAdmin) {
                            usePlayerStore.setState({playerId: message['player']['id']});
                            useBB84GameStore.setState(
                                {
                                    photonNumber: message['game']['photon_number'],
                                    validationBitsLength: message['game']['validation_bits_length'],
                                });
                            localStorage.setItem('bb84PhotonNumber',
                                JSON.stringify(message['game']['photon_number']));
                            localStorage.setItem('bb84ValidationBitsLength',
                                JSON.stringify(message['game']['validation_bits_length']));
                        }
                    } else if (gameType === 'e91') {
                        router.push('e91/waiting-room');
                        setIsWaitingRoomConnected(true);
                        setWaitingRoomConnecting(false);
                        if (!usePlayerStore.getState().isAdmin) {
                            usePlayerStore.setState({playerId: message['player']['id']});
                            useE91GameStore.setState(
                                {
                                    photonNumber: message['game']['photon_number'],
                                    validationBitsLength: message['game']['validation_bits_length'],
                                });
                            localStorage.setItem('e91PhotonNumber',
                                JSON.stringify(message['game']['photon_number']));
                            localStorage.setItem('e91ValidationBitsLength',
                                JSON.stringify(message['game']['validation_bits_length']));
                        }
                    } else if (gameType === 'dps'){
                        router.push('dps/waiting-room');
                        setIsWaitingRoomConnected(true);
                        setWaitingRoomConnecting(false);
                        if (!usePlayerStore.getState().isAdmin) {
                            usePlayerStore.setState({playerId: message['player']['id']});
                            useDPSGameStore.setState(
                                {
                                    photonNumber: message['game']['photon_number'],
                                    validationBitsLength: message['game']['validation_bits_length'],
                                });
                            localStorage.setItem('dpsPhotonNumber',
                                JSON.stringify(message['game']['photon_number']));
                            localStorage.setItem('dpsValidationBitsLength',
                                JSON.stringify(message['game']['validation_bits_length']));
                        }
                    }                  
                    break;

                case PLAYER_JOIN_EVENT:
                    if (usePlayerStore.getState().isAdmin) {
                        if (gameType === 'bb84') {
                            const updatedPlayers = [...useBB84GameStore.getState().players];
                            const player = { name: message['player']['name'] };
                            updatedPlayers.push(player);
                            useBB84GameStore.setState({players: updatedPlayers});
                        } else if (gameType === 'e91') {
                            const updatedPlayers = [...useE91GameStore.getState().players];
                            const player = { name: message['player']['name'] };
                            updatedPlayers.push(player);
                            useE91GameStore.setState({players: updatedPlayers});
                        } else if (gameType === 'dps') {
                            const updatedPlayers = [...useDPSGameStore.getState().players];
                            const player = { name: message['player']['name'] };
                            updatedPlayers.push(player);
                            useDPSGameStore.setState({players: updatedPlayers});
                        }
                    }
                    break;

                case INVALID_CODE_EVENT:
                    toast.error(localize('component.main.invalidCodeTitle'), {
                        description: localize(
                            'component.main.invalidCodeMessage'),
                    });
                    break;

                case GAME_STARTED_EVENT:
                    toast.error(localize('component.main.gameStarted'), {
                        description: localize(
                            'component.main.gameStartedDescription'),
                    });
                    break;

                case TAKEN_NAME_EVENT:
                    setIsWaitingRoomConnected(false);
                    setWaitingRoomConnecting(false);
                    toast.error(localize('component.main.takenNameTitle'), {
                        description: localize(
                            'component.main.takenNameDescription'),
                    });
                    break;

                case ROLES_EVENT:
                    if (!usePlayerStore.getState().isAdmin) {
                        const { role, partner, room, eve_present: evePresent } = message[`${(usePlayerStore.getState().playerId as number)}`];
                        const {game_has_eve: gameHasEve} = message;
                        usePlayerStore.setState({playerRole: role, partner});
                        const playerData = {
                            gameCode: useBB84GameStore.getState().gameCode,
                            role,
                            room,
                            partner,
                            gameHasEve,
                            playerName: usePlayerStore.getState().playerName,
                        };
                        if (gameType === 'bb84') {
                            useBB84GameStore.setState({gameHasEve: gameHasEve});
                            useBB84RoomStore.setState({evePresent});
                  
                            localStorage.setItem('bb84PlayerData', JSON.stringify(playerData));
                            localStorage.setItem('bb84Step', JSON.stringify(useBB84ProgressStore.getState().step));
                            localStorage.setItem('bb84Tab', useBB84ProgressStore.getState().bb84Tab);
                            localStorage.setItem('bb84GameData', JSON.stringify({evePresent}));
            
                        } else if (gameType === 'e91') {
                            useE91GameStore.setState({gameHasEve: gameHasEve});
                            useE91RoomStore.setState({evePresent});
            
                            localStorage.setItem('e91PlayerData', JSON.stringify(playerData));
                            localStorage.setItem('e91Step', JSON.stringify(useBB84ProgressStore.getState().step));
                            localStorage.setItem('e91Tab', useE91ProgressStore.getState().e91Tab);
                            localStorage.setItem('e91GameData', JSON.stringify({evePresent}));
            
                        } else if (gameType === 'dps') {
                            useDPSGameStore.setState({gameHasEve: gameHasEve});
                            useDPSRoomStore.setState({evePresent});
            
                            localStorage.setItem('dpsPlayerData', JSON.stringify(playerData));
                            localStorage.setItem('dpsStep', JSON.stringify(useBB84ProgressStore.getState().step));
                            localStorage.setItem('dpsTab', useDPSProgressStore.getState().dpsTab);
                            localStorage.setItem('dpsGameData', JSON.stringify({evePresent}));

                        }
                        connectToPlayRoom(gameType, gameCode, role, room);
                        setTimeout(() => socketInstance.close(), 10000);
                    }
                    break;
                case END_EVENT:
                    socketInstance.close();
                    if (gameType === 'bb84') {
                        useBB84GameStore.setState({players: [], playerCount: 0});
                    } else if (gameType === 'e91') {
                        useE91GameStore.setState({players: [], playerCount: 0});
                    } else if (gameType === 'dps') {
                        useDPSGameStore.setState({players: [], playerCount: 0});
                    }
                    
                    if (!usePlayerStore.getState().isAdmin) {
                        toast.warning(
                            localize('component.waitingRoom.gameEndedTitle'), {
                                description: localize(
                                    'component.waitingRoom.gameEndedDescription'),
                            });
                    }
                    break;

                default:
                    console.log('Event: ' + event);
            }
        };
        setWaitingRoomSocket(socketInstance);
    };

    const connectToPlayRoom = (gameType: string, gameCode:string, role: string, room: string) => {

        setPlayRoomConnecting(true);


        const socketInstance = new W3CWebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/games/${gameType}/${gameCode}/rooms/${room}/`);

        setPlayRoomSocket(socketInstance);

        (socketInstance as any).onerror = (error: any) => {
            console.log(error);
            setPlayRoomError(true);
            setPlayRoomConnecting(false);
        };

        socketInstance.onclose = (event: any) => {
            console.log(event);
            setIsPlayRoomConnected(false);
            setPlayRoomConnecting(false);
        };

        socketInstance.onmessage = async (json: any) => {
        
            const data = JSON.parse(json.data)['payload'];
            const message = data['message'];
            const event = data['event'];
            console.log(event);

            switch (event) {
                
                case CONNECTED_EVENT:
                    setIsPlayRoomConnected(true);
                    setPlayRoomConnecting(false);
                    if (gameType === 'bb84') {
                        router.replace('/bb84/play');
                    } else if (gameType === 'e91') {
                        router.replace('/e91/play')
                    } else if (gameType === 'dps') {
                        router.replace('/dps/play')
                    }
                    
                    break;

                case GAME_ID_EVENT:
                    recordIPAddress(message.game_id);
                    break;
                
                case A_MEASURE_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        console.log('receiving bits:' + message.bits)
                        useE91RoomStore.getState().setAliceBits(message.bits.split(''));
                    } else {
                        useE91ProgressStore.getState().pushLines([
                            {
                                content: 'component.e91.aliceMeasured',
                            },
                        ]);
                    }
                    break;
                    
                case B_MEASURE_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useE91RoomStore.getState().setBobBits(message.bits.split(''));
                    } else {
                        useE91ProgressStore.getState().pushLines([
                            {
                                content: 'component.e91.bobMeasured',
                            },
                        ]);
                    }
                    break;

                case A_PREFERENCE_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useE91RoomStore.getState().setAlicePreference(message.useValidBits);
                    }
                    break;
                    
                case B_PREFERENCE_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useE91RoomStore.getState().setBobPreference(message.useValidBits);
                    }
                    break;
                
                case A_DICE_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useE91RoomStore.getState().setAliceDiceRoll(message.value);
                    }
                    break;

                case B_DICE_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useE91RoomStore.getState().setBobDiceRoll(message.value);
                    }
                    break;

                case A_BITS_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useE91RoomStore.getState().setAliceBits(message.bits);
                    }
                    break;

                case B_BITS_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useE91RoomStore.getState().setBobBits(message.bits);
                    }
                    break;

                case A_DECISION_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useE91RoomStore.getState().setSecuredDecision(message.decision);
                    }
                    break;

                case B_DECISION_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useE91RoomStore.getState().setSecuredDecision(message.decision);
                    }
                    break;

                case VALIDATION_INDICES_EVENT:
                    console.log('validation indices: ' + message.validationIndices)
                    useE91RoomStore.getState().setValidationIndices(message.validationIndices)
                    useE91GameStore.getState().setValidationBitsLength(message.validationIndices.length);
                    break;

                case A_PHOTONS_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setAlicePhotons(message.photons);
                        useBB84ProgressStore.getState().pushLines([
                            {
                                content: 'component.bobExchange.photonsArrived',
                            },
                            {
                                title: 'component.game.step1',
                                content: 'component.bobExchange.choose',
                            },
                        ]);
                    }                  
                    break;
                case A_PHASES_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useDPSRoomStore.getState().setAlicePhotons(message.photons);
                        useDPSRoomStore.getState().setAlicePhases(message.phases);

                        useDPSProgressStore.getState().pushLines([
                            {
                                content: 'component.bobExchange.photonsArrived',
                            },
                            {
                                title: 'component.game.step1',
                                content: 'component.bobExchange.Measurement',
                            },
                        ]);
                    }
                    break;
                case B_TIMES_EVENT:
                    console.log("on est rentré dans B_TIMES_EVENT");
                    if(usePlayerStore.getState().playerRole === 'A'){
                            useDPSRoomStore.getState().setBobTimeMeasurements(message.times);
                            useDPSProgressStore.getState().pushLines([
                                    {
                                        content: 'component.aliceInference.timesArrived',
                                    },
                                    {
                                        title: 'component.game.step2',
                                        content: 'component.aliceInference.inferPhaseDifference',
                                    },

                            ]);
                            useDPSProgressStore.getState().setStep(DPSGameStep.INFERENCE);
                            useDPSProgressStore.getState().setDPSTab('inference');
                          
                        }
                    break;
                case B_BASES_EVENT:
                    if (gameType === 'bb84') {
                        if (usePlayerStore.getState().playerRole === 'A') {
                            useBB84RoomStore.getState().setBobBases(message.bases);
                            const aliceBases = useBB84RoomStore.getState().aliceBases;
                            shareBases(aliceBases,
                                A_BASES_EVENT, socketInstance);
                            useBB84ProgressStore.getState().setBb84Tab('basis');
                            useBB84ProgressStore.getState()
                                .setStep(BB84GameStep.BASIS);
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.aliceExchange.basesArrived',
                                },
                                {
                                    title: 'component.game.step2',
                                    content: 'component.basis.validate',
                                },
                            ]);
                        }
                    } else if (gameType === 'e91') {
                        if (usePlayerStore.getState().playerRole === 'A') {
                            useE91RoomStore.getState().setBobBases(message.bases);
                        }
                    } else if (gameType === 'dps') {

                        //This code must be in the 'PLAYER_LEFT_EVENT' box.
                        const myRole = usePlayerStore.getState().playerRole;
                        
                        if (myRole) {
                            toast.warning(localize('component.game.playerLeft'), {
                                description: localize('component.game.playerLeft.desc'),
                            });
                        }
                        setIsPlayRoomConnected(false);
                        setPlayRoomConnecting(false);
                        router.replace('/');
                        localStorage.setItem('dpsPlayerData', JSON.stringify({}));
                        localStorage.setItem('dpsGameData', JSON.stringify({}));    
                        localStorage.clear();     
                        clearDPSLocalStorage();
                        
                    }      
                    break;

                case A_BASES_EVENT:
                    if (gameType === 'bb84') {
                        if (usePlayerStore.getState().playerRole === 'B') {
                            useBB84RoomStore.getState()
                                .setAliceBases(message.bases);
                            useBB84ProgressStore.getState().setBb84Tab('basis');
                            useBB84ProgressStore.getState()
                                .setStep(BB84GameStep.BASIS);
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.bobExchange.basesArrived',
                                },
                                {
                                    title: 'component.game.step3',
                                    content: 'component.basis.validate',
                                },
                            ]);
                        }
                    } else if (gameType === 'e91') {
                        if (usePlayerStore.getState().playerRole === 'B') {
                            useE91RoomStore.getState().setAliceBases(message.bases);
                        }
                    }
                    
                    break;

                case A_KEY_EVENT:
                    const {validation_indices: validationIndices} = message;
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setPartnerBits(message.key);
                        if (useBB84RoomStore.getState().evePresent &&
                            useBB84ProgressStore.getState().step > 1) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.validationTab.arrived',
                                },
                                {
                                    content: 'component.validationTab.start',
                                },
                                {
                                    content: 'component.validation.indices',
                                    extra: validationIndices.reduce(
                                        (result: string,
                                         current: number) => result +
                                            current.toString() + ' ', ''),
                                },
                                {
                                    content: 'component.validationTab.select',
                                },
                            ]);
                        }
                    } else {
                        if (useBB84RoomStore.getState().evePresent) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.validation.indices',
                                    extra: validationIndices.reduce(
                                        (result: string,
                                         current: number) => result +
                                            current.toString() + ' ', ''),
                                },
                            ]);
                        }
                    }
                    useBB84RoomStore.getState()
                        .setValidationIndices(validationIndices);
                    break;

                case B_KEY_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84RoomStore.getState()
                            .setPartnerBits(message.key);
                        if (useBB84ProgressStore.getState().step > 1) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.validationTab.arrived',
                                },
                                {
                                    content: 'component.validationTab.start',
                                },
                                {
                                    content: 'component.validationTab.select',
                                },
                            ]);
                        }
                    }
                    break;

                case A_VALIDATED_EVENT:
                    if (usePlayerStore.getState().playerRole === 'B') {
                        useBB84RoomStore.getState()
                            .setValidatedByPartner(true);
                        if (message['valid']) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.validated',
                                },
                                {
                                    content: 'component.validationTab.aliceValid',
                                },
                            ]);
                            moveToExchangeTab();
                        } else {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.aliceInvalid',
                                },
                                {
                                    content: 'component.validationTab.found',
                                },
                            ]);
                        }
                    }
                    break;

                case B_VALIDATED_EVENT:
                    if (usePlayerStore.getState().playerRole === 'A') {
                        useBB84RoomStore.getState()
                            .setValidatedByPartner(true);
                        if (message['valid']) {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.validated',
                                },
                                {
                                    content: 'component.validationTab.bobValid',
                                },
                            ]);
                            moveToExchangeTab();
                        } else {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.validationTab.bobInvalid',
                                },
                                {
                                    content: 'component.validationTab.found',
                                },
                            ]);
                        }
                    }
                    break;

                case A_CIPHER_EVENT:
                    if (gameType === 'e91') {
                        useE91RoomStore.getState().setAliceCipher(message.cipher);
                        if (usePlayerStore.getState().playerRole === 'A') {
                            useE91ProgressStore.getState().pushLines([
                                {
                                    content: 'component.messaging.alice.sent',
                                },
                            ]);
                        }
                        if (usePlayerStore.getState().playerRole === 'B' &&
                            useE91ProgressStore.getState().e91Tab ===
                            'messaging') {
                            useE91ProgressStore.getState().pushLines([
                                {
                                    content: 'component.messaging.bob.arrived',
                                },
                                {
                                    content: 'component.messaging.bob.decrypt',
                                },
                            ]);
                        }


                    } else if (gameType === 'bb84') {
                        useBB84RoomStore.getState().setAliceCipher(message.cipher);
                        if (usePlayerStore.getState().playerRole === 'A') {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.messaging.alice.sent',
                                },
                            ]);
                        }
                        if (usePlayerStore.getState().playerRole === 'B' &&
                            useBB84ProgressStore.getState().bb84Tab ===
                            'messaging') {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    content: 'component.messaging.bob.arrived',
                                },
                                {
                                    content: 'component.messaging.bob.decrypt',
                                },
                            ]);
                        }
                    } else if (gameType === 'dps') {
                        useDPSRoomStore.getState().setBobCipher(message.cipher);
                        if (usePlayerStore.getState().playerRole === 'B'){
                            useDPSProgressStore.getState().pushLines([
                                {
                                    content: 'component.messaging.bob.sent',
                                },
                            ]);
                        }
                        if (usePlayerStore.getState().playerRole === 'A' &&
                            useDPSProgressStore.getState().dpsTab === 'messaging'){
                                useDPSProgressStore.getState().pushLines([
                                    {
                                        content: 'component.messaging.alice.arrived',
                                    },
                                    {
                                        content: 'component.messaging.alice.decrypt',
                                    },
                                ]);
                            }
                    }
                    
                    break;

                case B_SUCCESS_EVENT:
                    if (gameType === 'e91') {
                        if (usePlayerStore.getState().playerRole === 'A') {
                            useE91ProgressStore.getState().pushLines([
                                {
                                    title: 'component.messaging.congratulations',
                                    content: 'component.messaging.alice.end',
                                },
                            ]);
                        }
                        useE91RoomStore.getState().setGameSuccess(true);
                        clearE91LocalStorage();

                    } else if (gameType === 'bb84') {
                        if (usePlayerStore.getState().playerRole === 'A') {
                            useBB84ProgressStore.getState().pushLines([
                                {
                                    title: 'component.messaging.congratulations',
                                    content: 'component.messaging.alice.end',
                                },
                            ]);
                        }
                        useBB84RoomStore.getState().setGameSuccess(true);
                        clearBB84LocalStorage();
                    } else if(gameType === 'dps'){
                        if (usePlayerStore.getState().playerRole === 'B') {
                            useDPSProgressStore.getState().pushLines([
                                {
                                    title: 'component.messaging.congratulations',
                                    content: 'component.messaging.bob.end',
                                },
                            ]);
                        }
                        useDPSRoomStore.getState().setGameSuccess(true);
                        clearDPSLocalStorage();
                    }
                    
                    break;
                case RESTART_WITHOUT_EVE_EVENT:
                    if (gameType === 'e91') {
                        localStorage.removeItem('e91PhotonNumber');
                        localStorage.setItem('e91GameData', JSON.stringify({}));
                        localStorage.removeItem('e91Step');
                        localStorage.removeItem('e91Tab');
                        localStorage.removeItem('e91DisplayedLines');
                        toast.message('Game restarted', {
                            description: localize(
                                'component.validation.gameRestarted'),
                        });
                        useE91RoomStore.getState().resetRoom();
                        useE91RoomStore.getState().setEvePresent(false);
                        useE91ProgressStore.getState().resetProgress();
                        useE91ProgressStore.getState().pushLines([
                            {
                                title: 'component.e91.measurement.welcome',
                            },
                            {
                                title: 'component.game.step1',
                                content: 'component.e91.measurement.start',
                            },
                        ])
                    } else if (gameType === 'bb84') {
                        localStorage.removeItem('bb84PhotonNumber');
                        localStorage.setItem('bb84GameData', JSON.stringify({}));
                        localStorage.removeItem('bb84Step');
                        localStorage.removeItem('bb84Tab');
                        localStorage.removeItem('bb84DisplayedLines');
                        toast.message('Game restarted', {
                            description: localize(
                                'component.validation.gameRestarted'),
                        });
                        useBB84RoomStore.getState().resetRoom();
                        useBB84RoomStore.getState().setEvePresent(false);
                        useBB84ProgressStore.getState().resetProgress();
                    }
                    restartWithoutEve();
                    break;
                case PLAYER_LEFT_EVENT:
                    if (gameType === 'dps') {
                        const myRole = usePlayerStore.getState().playerRole;

                        if (myRole) {
                            toast.warning(localize('component.game.playerLeft'), {
                                description: localize('component.game.playerLeft.desc'),
                            });
                        }
                        setIsPlayRoomConnected(false);
                        setPlayRoomConnecting(false);
                        router.replace('/');
                        localStorage.setItem('dpsPlayerData', JSON.stringify({}));
                        localStorage.setItem('dpsGameData', JSON.stringify({}));    
                        localStorage.clear();     
                        clearDPSLocalStorage();
                        
                    }
                    break;
                
                case SWAP_ROLES_AND_RESTART_EVENT:
                    if (gameType === 'dps') {                        
                        const currentRole = usePlayerStore.getState().playerRole;
                        const newRole = currentRole === 'A' ? 'B' : 'A';
                        usePlayerStore.setState({ playerRole: newRole });

                        const playerData = {
                            gameCode: useDPSGameStore.getState().gameCode,
                            role: newRole,
                            partner: usePlayerStore.getState().partner,
                            playerName: usePlayerStore.getState().playerName,
                        };

                        localStorage.setItem('dpsPlayerData', JSON.stringify(playerData));
                        localStorage.setItem('dpsGameData', JSON.stringify({}));
                        localStorage.removeItem('dpsStep');
                        localStorage.removeItem('dpsTab');
                        localStorage.removeItem('dpsDisplayedLines');

                        toast.message('Game restarted', {
                            description: localize(
                                'component.validation.gameRestarted'),
                        });

                        useDPSRoomStore.getState().resetRoom();
                        useDPSProgressStore.getState().resetProgress();
                        useDPSProgressStore.getState().pushLines([
                                {
                                    title: 'component.dps.exchange.welcome',
                                },
                                ...(newRole === 'A'
                                    ? [{
                                        title: 'component.game.step1',
                                        content: 'component.aliceExchange.start',
                                    }]
                                    : [{
                                        content: 'component.bobExchange.waiting',
                                    }]),
                            ]);

                    }
                    break; 
                
                
                default:
                    console.log('Event: ' + event);
            }
        };
    };

    const startGame = (gameType: string, id: number) => {
        if (gameType === 'bb84') {
            const payload = {
                event: START_EVENT,
                message: {
                    game_code: useBB84GameStore.getState().gameCode,
                    game_id: id
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
            toast.success('Game started!');
            setTimeout(() => (waitingRoomSocket as any).close(), 5000);
            useBB84GameStore.setState({players: [], playerCount: 0});
        } else if (gameType === 'e91') {
            const payload = {
                event: START_EVENT,
                message: {
                    game_code: useE91GameStore.getState().gameCode,
                    game_id: id
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
            toast.success('Game started!');
            setTimeout(() => (waitingRoomSocket as any).close(), 5000);
            useE91GameStore.setState({players: [], playerCount: 0});
        } else if (gameType === 'dps') {
            clearDPSLocalStorage();
            const payload = {
                event: START_EVENT,
                message: {
                    game_code: useDPSGameStore.getState().gameCode,
                    game_id: id
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
            toast.success('Game started!');
            setTimeout(() => (waitingRoomSocket as any).close(), 5000);
            useDPSGameStore.setState({players: [], playerCount: 0});
        }
       
    };

    /**
     * Sends an event to the play room web socket server.
     * @param message the message that will be sent.
     * @param event the type of event. Event types are defined in the
     * constants.ts file under BB84 Web Socket Event Constants.
     */
    const sendEvent = (event: string, message?: any) => {
        const payload: { event: string, message?: any } = {
            event,
        };
        if (message) {
            payload.message = {...message};
        }
        if ((playRoomSocket as any).readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open. Current state:", (playRoomSocket as any).readyState);
        } else {
            console.log("WebSocket is open, sending message.");
        }
        
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const measurePhotons = (bases: string[]) => {
        const playerRole = usePlayerStore.getState().playerRole;
        if (playerRole === 'A') {
            sendEvent(A_MEASURE_EVENT, {
                bases,
                eve_present: useE91RoomStore.getState().evePresent,
                player_name: usePlayerStore.getState().playerName
            });
        } else {
            sendEvent(B_MEASURE_EVENT, {
                bases,
                eve_present: useE91RoomStore.getState().evePresent,
                player_name: usePlayerStore.getState().playerName
            });
        }
    }

    const sendPhases = (photons: string[][], phases: string[][]) => {
        sendEvent(A_PHASES_EVENT, {photons, phases});
    }
    const sendPhotons = (photons: number[]) => {
        sendEvent(A_PHOTONS_EVENT, {photons});
    };
    const sendArrivalTimes = (times: string[]) => {
        sendEvent(B_TIMES_EVENT, { times });
    };

    const sendCipher = (cipher: string[]) => {
        sendEvent(A_CIPHER_EVENT, {cipher});
    };

    const sendEveSpotted = () => {
        sendEvent(EVE_SPOTTED_EVENT);
    };

    const saveScore = (score: number) => {
        sendEvent(SCORE_EVENT, {
            score,
            player_name: usePlayerStore.getState().playerName,
            game_code: useE91GameStore.getState().gameCode
        });
    };

    const sendBobSuccess = (gameType: string) => {
        sendEvent(B_SUCCESS_EVENT, {
            game_code: gameType === 'e91' ? useE91GameStore.getState().gameCode : useBB84GameStore.getState().gameCode,
            player_name: usePlayerStore.getState().playerName 
        });
    };

    const sendAliceSuccess = () => {
        sendEvent(B_SUCCESS_EVENT, {
            game_code: useDPSGameStore.getState().gameCode,
            player_name: usePlayerStore.getState().playerName
        });
    };


    const shareBases = (bases: string[], event: string, socket?: any) => {
        const payload = {
            event,
            message: {
                bases,
            },
        };
        if (socket) {
            socket.send(JSON.stringify(payload));
            return;
        }
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const shareBits = (bits: string[], event: string, socket?: any) => {
        const payload = {
            event,
            message: {
                bits,
            },
        };
        if (socket) {
            socket.send(JSON.stringify(payload));
            return;
        }
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const shareKey = (key: string[]) => {
        const playerRole = usePlayerStore.getState().playerRole;
        const payload: { event: string, message: any } = {
            event: playerRole === 'A' ? A_KEY_EVENT :
                B_KEY_EVENT,
            message: {
                key,
            },
        };
        if (playerRole === 'A') {
            payload.message.key_length = key.length;
            payload.message.validation_bits_length =
                useBB84GameStore.getState().validationBitsLength;
        }
        (playRoomSocket as any).send(JSON.stringify(payload));
    };

    const shareValidation = (valid: boolean) => {
        const event = usePlayerStore.getState().playerRole === 'A' ?
            A_VALIDATED_EVENT :
            B_VALIDATED_EVENT;
        sendEvent(event, {valid});
    };

    const restartGameWithoutEve = () => {
        sendEvent(RESTART_WITHOUT_EVE_EVENT, {player_name: usePlayerStore.getState().playerName});
    };
    const restartGameAndSwappedRoles = () => {
        sendEvent(SWAP_ROLES_AND_RESTART_EVENT);
    };

    const leftGame = () => {
        sendEvent(B_BASES_EVENT);
    };

    const shareIndices = (validationIndices: number[]) => {
        sendEvent(VALIDATION_INDICES_EVENT, {validationIndices});
    };

    const shareDecision = (decision: boolean) => {
        const event = usePlayerStore.getState().playerRole === 'A' ?
            A_DECISION_EVENT :
            B_DECISION_EVENT;
        sendEvent(event, {decision});
    };

    const sharePreference = (useValidBits: boolean) => {
        const event = usePlayerStore.getState().playerRole === 'A' ?
            A_PREFERENCE_EVENT :
            B_PREFERENCE_EVENT;
        sendEvent(event, {useValidBits: useValidBits});
    };

    const shareDiceValue = (value: number) => {
        const event = usePlayerStore.getState().playerRole === 'A' ?
            A_DICE_EVENT :
            B_DICE_EVENT;
        sendEvent(event, {value});
    };

    const disconnectBB84WaitingRoom = () => {
        if (usePlayerStore.getState().isAdmin) {
            const payload = {
                event: END_ADMIN_EVENT,
                message: {
                    game_code: useBB84GameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        } else {
            const payload = {
                event: END_PLAYER_EVENT,
                message: {
                    game_code: useBB84GameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        }
        (waitingRoomSocket as any).close();
    };

    const disconnectE91WaitingRoom = () => {
        if (usePlayerStore.getState().isAdmin) {
            const payload = {
                event: END_ADMIN_EVENT,
                message: {
                    game_code: useE91GameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        } else {
            const payload = {
                event: END_PLAYER_EVENT,
                message: {
                    game_code: useE91GameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        }
        (waitingRoomSocket as any).close();
    };

    const disconnectDPSWaitingRoom = () => {
        if (usePlayerStore.getState().isAdmin) {
            const payload = {
                event: END_ADMIN_EVENT,
                message: {
                    game_code: useDPSGameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        } else {
            const payload = {
                event: END_PLAYER_EVENT,
                message: {
                    game_code: useDPSGameStore.getState().gameCode,
                    player_name: usePlayerStore.getState().playerName,
                },
            };
            (waitingRoomSocket as any).send(JSON.stringify(payload));
        }
        (waitingRoomSocket as any).close();
    };

    return (
        <SocketContext.Provider
            value={{
                waitingRoomSocket,
                playRoomSocket,
                isWaitingRoomConnected,
                waitingRoomError,
                waitingRoomConnecting,
                isPlayRoomConnected,
                playRoomError,
                playRoomConnecting,
                connectToWaitingRoom,
                connectToPlayRoom: connectToPlayRoom,
                startGame,
                sendEvent,
                measurePhotons,
                sendPhotons,
                sendPhases,
                sendArrivalTimes,
                sendCipher,
                shareBases,
                saveScore,
                shareBits,
                sendEveSpotted,
                shareKey,
                shareIndices,
                sharePreference,
                shareDecision,
                sendBobSuccess,
                sendAliceSuccess,
                shareValidation,
                restartGameWithoutEve,
                restartGameAndSwappedRoles,
                leftGame,
                shareDiceValue,
                disconnectBB84WaitingRoom,
                disconnectE91WaitingRoom,
                disconnectDPSWaitingRoom,
            }}>
            {children}
        </SocketContext.Provider>
    );

};
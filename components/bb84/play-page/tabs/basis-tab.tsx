'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import React, {useState} from 'react';
import {CheckCircle2} from 'lucide-react';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/providers/language-provider';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';
import useBB84GameStore from '@/store/bb84/bb84-game-store';
import {useSocket} from '@/components/providers/socket-provider';
import GameRestartDialog
    from '@/components/bb84/play-page/game-restart-dialog';
import {BB84GameStep} from '@/types';
import {getValidBits, mimicEveIntercept} from '@/lib/bb84/solo-player';
import {restartSoloRound} from '@/lib/bb84/solo-round';
import {generateUniqueRandomList} from '@/lib/utils';

const BasisTab = ({playerRole}: { playerRole: string }) => {

    const [restartModalOpen, setRestartModalOpen] = useState(false);

    const {localize} = useLanguage();
    const {shareKey} = useSocket();

    const {
        setStep,
        pushLines,
        resetProgress,
        setBb84Tab,
    } = useBB84ProgressStore();

    const {resetRoom, setKeyBits} = useBB84RoomStore();
    const {
        validationIndices,
        partnerBits,
        aliceBases,
        aliceCipher,
        bobBases,
        aliceBits,
        bobMeasurements,
        keyBits,
        setPartnerBits,
        setValidationIndices,
        setAliceCipher,
        setAliceCipherSolo,
    } = useBB84RoomStore();

    const {playingSolo} = usePlayerStore();

    const {validationBitsLength, gameHasEve} = useBB84GameStore();

    const [validatedBits, setValidatedBits] = useState(() => {
        if (playerRole === 'A') {
            return [...aliceBits].map(value => ({
                value,
                error: false,
                discarded: false,
            }));
        }
        return [...bobMeasurements].map(value => ({
            value,
            error: false,
            discarded: false,
        }));
    });

    const onToggleDiscardBit = (index: number) => {
        const updatedBits = [...validatedBits];
        const updatedBit = {...updatedBits[index]};
        const prevValue = updatedBit.discarded;
        updatedBit.discarded = !prevValue;
        updatedBits[index] = updatedBit;
        setValidatedBits(updatedBits);
    };

    const onValidateBits = () => {
        let valid = false;
        const updatedBits = [...validatedBits].map((field, index) => ({
            ...field,
            error: !field.discarded && aliceBases[index] !== bobBases[index] ||
                field.discarded && aliceBases[index] === bobBases[index],
        }));
        if (!updatedBits.some(field => field.error)) {
            toast.success(localize('component.basis.correct'));
            valid = true;
        } else {
            toast.error(localize('component.basis.verify'));
        }
        setValidatedBits(updatedBits);
        return valid;
    };

    const restartGame = () => {
        if (playingSolo) {
            // Task 49-A: same config (photon number, validation length, Eve),
            // fresh randomness — the naive resetRoom+resetProgress left solo Bob
            // with no photons (nothing regenerated them) and a stuck game.
            restartSoloRound();
        } else {
            // Multi restart is still uncoordinated (partner is not told) —
            // known desync, tracked as Task 49-B; behavior unchanged here.
            resetRoom();
            resetProgress();
        }
        setRestartModalOpen(false);
    };

    const onSend = () => {
        const isValid = onValidateBits();
        if (isValid) {
            const keyBits = validatedBits.filter(({discarded}) => !discarded)
                .map(({value}) => value);
            if (keyBits.length < validationBitsLength) {
                setRestartModalOpen(true);
                return;
            }
            setKeyBits(keyBits);
            if (!playingSolo) {
                shareKey(keyBits);
            }
            if (gameHasEve) {
                if (playingSolo) {
                    const max = keyBits.length - 1;
                    const min = 0;
                    const validationIndices = generateUniqueRandomList(min,
                        max, validationBitsLength);
                    let partnerBits: string[];
                    if (playerRole === 'A') {
                        partnerBits =
                            getValidBits(bobMeasurements, bobBases,
                                aliceBases);
                    } else {
                        partnerBits =
                            getValidBits(aliceBits, bobBases, aliceBases);
                    }
                    console.log('My bits', keyBits);
                    console.log('Other bits', partnerBits);
                    setPartnerBits(partnerBits);
                    setValidationIndices(validationIndices);
                    const aliceMockCrypto: string[] = [];
                    keyBits.forEach(() => {
                        aliceMockCrypto.push('' + Math.round(Math.random()));
                    });
                    setAliceCipherSolo(aliceMockCrypto);
                }
                setStep(BB84GameStep.VALIDATION);
                setBb84Tab('validation');
                pushLines([
                    {
                        title: 'component.validationTab.title',
                    },
                    {
                        content: 'component.validationTab.waiting',
                    },
                ]);
                // Socket handlers (A_KEY_EVENT and B_KEY_EVENT) will add the rest of the messages
                // based on who clicked first vs second (symmetric logic)
                return;
            }
            if (playerRole === 'B') {
                // If Alice player has already moved to the messaging tab
                // and sent the message.
                const aliceMockCrypto: string[] = [];
                    keyBits.forEach(() => {
                        aliceMockCrypto.push('' + Math.round(Math.random()));
                    });
                    pushLines([
                        {
                            content: 'component.messaging.bob.start',
                        },
                    ]);
                    if (playingSolo) {
                        // Set cipher immediately so it persists to localStorage
                        setAliceCipher(aliceMockCrypto);
                        setTimeout(() => {
                            pushLines([
                                {
                                    content: 'component.messaging.bob.arrived',
                                },
                                {
                                    content: 'component.messaging.bob.decrypt',
                                },
                            ]);
                        }, 2000);
                    } else {
                        if (aliceCipher.length > 0) {
                            pushLines([
                                {
                                    content: 'component.messaging.bob.arrived',
                                },
                                {
                                    content: 'component.messaging.bob.decrypt',
                                },
                            ]);                        
                        }
                    }
            } else {
                pushLines([
                    {
                        content: 'component.messaging.alice.start',
                    },
                    {
                        title: 'component.game.step3',
                        content: 'component.messaging.alice.last',
                    },
                ]);
            }
            setStep(BB84GameStep.MESSAGING);
            setBb84Tab('messaging');
        }
    };

    return (
        <>
            <GameRestartDialog restartModalOpen={restartModalOpen}
                               title={localize(
                                   'component.basisTab.alertTitle')}
                               description={localize(
                                   'component.basisTab.alertDescription')}
                               onConfirm={restartGame}/>
            <div className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
                <Table className="w-full">
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow
                            className="text-sm md:text-lg border-secondary">
                            <TableHead className="text-center rounded-tl-lg">
                                <p className="text-wrap">{playerRole == 'A' ?
                                    localize('component.basis.yourBases') :
                                    localize('component.basis.aliceBases')}</p>
                            </TableHead>
                            <TableHead className="text-center">
                                <p className="text-wrap">{playerRole == 'B' ?
                                    localize('component.basis.yourBases') :
                                    localize('component.basis.bobBases')}</p>
                            </TableHead>
                            <TableHead className="text-center rounded-tr-lg">
                                <p>Bits</p>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {aliceBases.map((_, i) => (
                            <TableRow key={i}
                                      className="text-center border-secondary">
                                <TableCell>
                                    <Input disabled value={aliceBases[i]}
                                           className={'w-10 text-lg text-center' +
                                               ' mx-auto disabled:opacity-100' +
                                               ' disabled:bg-background' +
                                               ' disabled:cursor-default mx-auto'}/>
                                </TableCell>
                                <TableCell>
                                    <Input disabled value={bobBases[i]}
                                           className={'w-10 text-lg text-center' +
                                               ' mx-auto disabled:opacity-100' +
                                               ' disabled:bg-background' +
                                               ' disabled:cursor-default mx-auto'}/>
                                </TableCell>
                                <TableCell>
                                    <div onClick={() => onToggleDiscardBit(i)}
                                         className={cn(
                                             'select-none bg-background' +
                                             ' rounded-md h-10 border' +
                                             ' border-secondary cursor-pointer' +
                                             ' w-10 text-lg text-center' +
                                             ' m-auto align-center pt-1.5 ',
                                             validatedBits[i].discarded ?
                                                 'text-background' :
                                                 '', validatedBits[i].error ?
                                                 'border-red' : '')}>
                                        <p>{validatedBits[i].value}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div
                    className="fixed bottom-5 right-3 md:hidden">
                    <Button size={'icon'} disabled={keyBits.length > 0}
                            onClick={onSend}>
                        <CheckCircle2/>
                    </Button>
                </div>
                <div
                    className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                    <Button size="lg"
                        disabled={keyBits.length > 0}
                            onClick={onSend}
                            className="text-lg font-bold">
                        {localize('component.basis.validateBtn')}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default BasisTab;
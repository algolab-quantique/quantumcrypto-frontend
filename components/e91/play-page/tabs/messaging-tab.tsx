import KeyPerturbedDialog from '@/components/e91/play-page/key-perturbed-dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody, TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { keysMatch, endingLine } from '@/lib/e91/ending-message';
import { cn, forbiddenSymbols } from '@/lib/utils';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const MessagingTab = ({playerRole}: { playerRole: string }) => {

    const {localize} = useLanguage();
    const {sendCipher, sendBobSuccess, saveScore, isPlayRoomConnected} = useSocket();

    const {pushLines} = useE91ProgressStore();

    const {
        aliceValidBits,
        bobValidBits,
        aliceCipher,
        aliceCipherSent,
        gameSuccess,
        evePresent,
        eveGuessedRightBits,
        eveSpotted,
        message: persistedMessage,
        crypto: persistedCrypto,
    } = useE91RoomStore();
    const {
        setMessage: setPersistedMessage,
        setCrypto: setPersistedCrypto,
    } = useE91RoomStore();

    // The key belonging to whoever is at this screen. Alice and Bob hold
    // DIFFERENT keys once Eve has been between them, so reading Alice's for
    // both roles made her damage impossible to compute (Task 71, M2b; the same
    // fix as solo's step 1, physics doc 10.15).
    const localPlayerKeyBits = playerRole === 'A' ? aliceValidBits : bobValidBits;

    const [keyPerturbedOpen, setKeyPerturbedOpen] = useState(false);

    const [message, setMessage] = useState(() => {
        if ((aliceCipherSent || gameSuccess) && persistedMessage.length > 0) {
            return persistedMessage.map(v => ({
                value: v ?? '',
                touched: true,
                error: false,
            }));
        }
        return [...localPlayerKeyBits].map(_ => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const [crypto, setCrypto] = useState(() => {
        if ((aliceCipherSent || gameSuccess) && persistedCrypto.length > 0) {
            return persistedCrypto.map(v => ({
                value: v ?? '',
                touched: true,
                error: false,
            }));
        }
        return [...localPlayerKeyBits].map(_ => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    useEffect(() => {
        if ((aliceCipherSent || gameSuccess) && persistedMessage.length > 0 && message.length === 0) {
            setMessage(persistedMessage.map(v => ({
                value: v ?? '',
                touched: true,
                error: false,
            })));
        }
        if ((aliceCipherSent || gameSuccess) && persistedCrypto.length > 0 && crypto.length === 0) {
            setCrypto(persistedCrypto.map(v => ({
                value: v ?? '',
                touched: true,
                error: false,
            })));
        }
    }, [localPlayerKeyBits, aliceCipherSent, gameSuccess, persistedMessage, persistedCrypto]);

    useEffect(() => {
        if (gameSuccess && isPlayRoomConnected) {
            if (evePresent && eveGuessedRightBits > 0) {
                pushLines([
                    {
                        title: 'component.e91.evePresent',
                        content: 'component.e91.evePresent.stats',
                        extra: `${eveGuessedRightBits}`
                    },
                ]);
            }
            saveScore(calculateScore());

        }
    }, [gameSuccess, isPlayRoomConnected]);

    const calculateScore = () => {
        let score = 0;
    
        score += aliceValidBits.length * 5;

        if (!eveSpotted && evePresent) {
            score -= 10;
        }
    
        return score;
    };

    const onMessageInput = (event: React.ChangeEvent<HTMLInputElement>,
                            index: number) => {
        if (playerRole === 'B') return;
        const newValue = event.target.value;
        const updatedMessage = [...message];
        const updatedBit = {...updatedMessage[index]};
        updatedBit.touched = true;
        if (newValue.length === 0 || /^[01]$/.test(newValue) &&
            newValue.length <= 1) {
            updatedBit.value = newValue;
        }
        updatedBit.error = updatedBit.value === '';
        updatedMessage[index] = updatedBit;
        setMessage(updatedMessage);
    };

    const onCryptoInput = (event: React.ChangeEvent<HTMLInputElement>,
                           index: number) => {
        const newValue = event.target.value;
        const updatedCrypto = [...crypto];
        const updatedBit = {...updatedCrypto[index]};
        if (newValue.length === 0 || /^[01]$/.test(newValue) &&
            newValue.length <= 1) {
            updatedBit.value = newValue;
        }
        updatedCrypto[index] = updatedBit;
        setCrypto(updatedCrypto);
    };

    const onValidateBits = () => {
        setMessage(message => [...message].map(bit => ({
            ...bit,
            touched: true,
        })));
        const updatedCrypto = [...crypto].map((cryptoBit, index) => {
            const keyNumber = parseInt(localPlayerKeyBits[index]);
            const messageNumber = playerRole === 'B' ?
                parseInt(aliceCipher[index]) : parseInt(message[index].value);
            const result = (keyNumber + messageNumber) % 2;
            return {
                ...cryptoBit,
                touched: true,
                error: result.toString() !== cryptoBit.value,
            };
        });
        setCrypto(updatedCrypto);
        const allValid = !updatedCrypto.some(bit => bit.error);
        if (allValid) {
            setPersistedCrypto(updatedCrypto.map(({value}) => value));
            setPersistedMessage(message.map(({value}) => value));
            if (playerRole === 'B' && !gameSuccess) {
                // Bob's arithmetic is right; whether his MESSAGE is right
                // depends only on whether the two keys agree (physics doc
                // 10.15). The same ending as solo (lib/e91/ending-message.ts).
                const match = keysMatch(aliceValidBits, bobValidBits);
                pushLines([endingLine(match, 'component.messaging.bob.end')]);
                if (match) {
                    toast.success(localize('component.basis.correct'));
                } else {
                    setKeyPerturbedOpen(true);
                }
                // The round is over either way: "finished", not "won".
                sendBobSuccess('e91');
            } else {
                const payload = crypto.map(({value}) => value);
                const sent = sendCipher(payload);
                if (!sent) {
                    toast.error(localize('component.waitingRoom.connectionLostTitle'), {
                        description: localize('component.waitingRoom.connectionLostDescription'),
                    });
                    return false;
                }
                toast.success(localize('component.messaging.cipherSent'));
            }
        } else {
            if (playerRole === 'A') {
                toast.error(localize('component.messaging.cipherError'));
            } else {
                toast.error(localize('component.messaging.decryptError'));
            }
        }
        return allValid;
    };

    return (
        <div className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center rounded-tl-lg">
                            <p>{localize('component.messaging.yourKey')}</p>
                        </TableHead>
                        <TableHead className="text-center">
                            <p>{playerRole === 'A' ?
                                localize('component.messaging.yourMessage') :
                                localize(
                                    'component.messaging.aliceEncrypted')}</p>
                        </TableHead>
                        <TableHead className="text-center rounded-tr-lg">
                            <p>{playerRole === 'A' ?
                                localize('component.messaging.yourEncrypted') :
                                localize(
                                    'component.messaging.aliceDecrypt')}</p>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localPlayerKeyBits.map((_, i) => (
                        <TableRow key={i}
                                  className="text-center border-secondary">
                            <TableCell>
                                <Input disabled value={localPlayerKeyBits[i]}
                                       className={'w-10 text-lg text-center' +
                                           ' mx-auto disabled:opacity-100' +
                                           ' disabled:bg-background' +
                                           ' disabled:cursor-default mx-auto'}/>
                            </TableCell>
                            <TableCell>
                                <Input disabled={playerRole === 'B'}
                                       // type="number"
                                       onKeyDown={e => forbiddenSymbols.includes(
                                           e.key) && e.preventDefault()}
                                       value={playerRole === 'B' ?
                                           aliceCipher[i] ?? '' :
                                           aliceCipherSent || gameSuccess ?
                                               persistedMessage[i] :
                                               message[i]?.value}
                                       onChange={(event) => onMessageInput(
                                           event, i)}
                                       className={cn(
                                           'w-10 text-lg text-center' +
                                           ' mx-auto disabled:opacity-100' +
                                           ' disabled:bg-background' +
                                           ' disabled:cursor-default' +
                                           ' mx-auto', playerRole === 'A' &&
                                           message[i]?.error &&
                                           message[i]?.touched ? 'border-red' :
                                               '')}/>
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={playerRole === 'A' ?
                                        (aliceCipherSent || gameSuccess ?
                                            persistedCrypto[i] :
                                            crypto[i]?.value) :
                                        (gameSuccess ?
                                            persistedCrypto[i] :
                                            crypto[i]?.value)}
                                    // type="number"
                                    onKeyDown={e => forbiddenSymbols.includes(
                                        e.key) && e.preventDefault()}
                                    onChange={(event) => onCryptoInput(
                                        event, i)}
                                    className={cn(
                                        'w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default' +
                                        ' mx-auto',
                                        crypto[i]?.error &&
                                        crypto[i]?.touched ? 'border-red' :
                                            '')}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden">
                <Button size={'icon'}
                        disabled={(playerRole === 'A' && aliceCipherSent) ||
                            (playerRole === 'B' && aliceCipher.length == 0) ||
                            gameSuccess}
                        onClick={onValidateBits}>
                    <CheckCircle2/>
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg"
                        disabled={(playerRole === 'A' && aliceCipherSent) ||
                            (playerRole === 'B' && aliceCipher.length == 0) ||
                            gameSuccess}
                        onClick={onValidateBits}
                        className="text-lg font-bold">
                    {playerRole === 'B' ?
                        localize('component.basis.validateBtn') :
                        localize('component.messaging.validateAndSend')}
                </Button>
            </div>
            <KeyPerturbedDialog open={keyPerturbedOpen}
                                onOpenChange={setKeyPerturbedOpen}/>
        </div>
    );
};

export default MessagingTab;

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody, TableCell,
} from '@/components/ui/table';
import React, { useState, useEffect} from 'react';
import {CheckCircle2, Send} from 'lucide-react';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/providers/language-provider';
import {useSocket} from '@/components/providers/socket-provider';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import {forbiddenSymbols} from '@/lib/utils';
import usePlayerStore from '@/store/player-store';

const MessagingTab = ({playerRole}: { playerRole: string }) => {

    const {localize} = useLanguage();
    const {sendCipher, sendBobSuccess} = useSocket();

    const {pushLines} = useBB84ProgressStore();

    const {playingSolo} = usePlayerStore();

    const {
        keyBits,
        aliceCipher,
        aliceCipherSent,
        gameSuccess,
        message: persistedMessage,
        crypto: persistedCrypto,
    } = useBB84RoomStore();
    const {
        setAliceCipher,
        setAliceCipherSent,
        setMessage: setPersistedMessage,
        setCrypto: setPersistedCrypto,
        setGameSuccess,
    } = useBB84RoomStore();

    const [message, setMessage] = useState(() => {
        // On restore: if game is already finished, pre-fill from persisted values
        if ((aliceCipherSent || gameSuccess) && persistedMessage.length > 0) {
            return persistedMessage.map(v => ({
                value: v ?? '',
                touched: true,
                error: false,
            }));
        }
        return [...keyBits].map(_ => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const [crypto, setCrypto] = useState(() => {
        // On restore: if game is already finished, pre-fill from persisted values
        if ((aliceCipherSent || gameSuccess) && persistedCrypto.length > 0) {
            return persistedCrypto.map(v => ({
                value: v ?? '',
                touched: true,
                error: false,
            }));
        }
        return [...keyBits].map(_ => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    // Hydrate local state from store after refresh (store may hydrate after first render)
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
    }, [keyBits, aliceCipherSent, gameSuccess, persistedMessage, persistedCrypto]);

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
            const keyNumber = parseInt(keyBits[index]);
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
            if (playingSolo) {
                if (playerRole === 'A') {
                    toast.success(localize('component.messaging.cipherSent'));
                    setAliceCipherSent(true);
                    pushLines([
                        {
                            title: 'component.messaging.congratulations',
                            content: 'component.messaging.alice.end',
                        },
                    ]);
                } else {
                    pushLines([
                        {
                            title: 'component.messaging.congratulations',
                            content: 'component.messaging.bob.end',
                        },
                    ]);
                    toast.success(localize('component.basis.correct'));
                }
                
                setPersistedCrypto(updatedCrypto.map(({value}) => value));
                setPersistedMessage(message.map(({value}) => value));
                setGameSuccess(true);
            } else {
                setPersistedCrypto(updatedCrypto.map(({value}) => value));
                setPersistedMessage(message.map(({value}) => value));
                if (playerRole === 'B' && !gameSuccess) {
                    pushLines([
                        {
                            title: 'component.messaging.congratulations',
                            content: 'component.messaging.bob.end',
                        },
                    ]);
                    toast.success(localize('component.basis.correct'));
                    sendBobSuccess('bb84');
                } else {
                    const payload = crypto.map(({value}) => value);
                    sendCipher(payload);
                    toast.success(localize('component.messaging.cipherSent'));
                    setAliceCipherSent(true);
                }
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
                    {keyBits.map((_, i) => (
                        <TableRow key={i}
                                  className="text-center border-secondary">
                            <TableCell>
                                <Input disabled value={keyBits[i]}
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
                                                (persistedMessage[i] ?? '') :
                                                (message[i]?.value ?? '')}
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
                                            (persistedCrypto[i] ?? '') :
                                            (crypto[i]?.value ?? '')) :
                                        (gameSuccess ?
                                            (persistedCrypto[i] ?? '') :
                                            (crypto[i]?.value ?? ''))}
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
        </div>
    );
};

export default MessagingTab;

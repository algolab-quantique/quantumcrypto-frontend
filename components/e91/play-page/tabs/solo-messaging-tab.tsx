'use client';

/**
 * Solo Messaging Tab
 * 
 * This is a copy of messaging-tab.tsx adapted for solo mode.
 * The only differences are:
 * 1. No useSocket() - no WebSocket calls (sendCipher, sendBobSuccess, saveScore)
 * 2. Alice's cipher is auto-generated when tab is reached
 * 3. Bob validates locally without server communication
 * 
 * UI is IDENTICAL to multiplayer messaging-tab.tsx
 */

import KeyPerturbedDialog from '@/components/e91/play-page/key-perturbed-dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody, TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn, forbiddenSymbols } from '@/lib/utils';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SoloMessagingTab = ({playerRole}: { playerRole: string }) => {

    const {localize} = useLanguage();
    // NO useSocket() - solo mode

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
        setAliceCipher,
        setAliceCipherSent,
        setMessage: setPersistedMessage,
        setCrypto: setPersistedCrypto,
        setGameSuccess,
    } = useE91RoomStore();

    // The key of the player at THIS screen: Alice's if he plays Alice, Bob's
    // if he plays Bob. The PARTNER holds the other one — the machine in solo, a
    // distant machine via the server in multi. The two are equal only when
    // nobody disturbed the photons, so reading Alice's for both roles made
    // Eve's damage impossible to compute (Task 71, physics doc 10.15).
    //
    // Decide the role once, here, and use this alias everywhere the key means
    // "mine". Where the role is certain instead — the block below IS Alice —
    // name that role's array directly.
    const localPlayerKeyBits = playerRole === 'A' ? aliceValidBits : bobValidBits;

    const [message, setMessage] = useState(() => {
        return [...localPlayerKeyBits].map(_ => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const [crypto, setCrypto] = useState(() => {
        return [...localPlayerKeyBits].map(_ => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const [keyPerturbedOpen, setKeyPerturbedOpen] = useState(false);

    /**
     * SOLO MODE: Auto-generate Alice's cipher when Bob enters tab
     * In multiplayer, Alice sends cipher via socket. In solo, we simulate it.
     * 
     * MESSAGES ADDED (matching multiplayer flow):
     * - Alice's encrypted message has arrived
     * - Use the secret key to decrypt
     */
    useEffect(() => {
        if (playerRole === 'B' && aliceCipher.length === 0) {
            // Here the app IS Alice, so it names her key rather than the local
            // player's: inside this branch the local player is Bob, and
            // encrypting with his key would make every decryption succeed.
            const randomMessage = aliceValidBits.map(() => Math.random() < 0.5 ? '0' : '1');
            // Encrypt: cipher = (message + key) mod 2
            const cipher = randomMessage.map((bit, index) =>
                ((parseInt(bit) + parseInt(aliceValidBits[index])) % 2).toString()
            );
            setAliceCipher(cipher);
            // Add arrival messages (matching multiplayer socket flow)
            pushLines([
                { content: 'component.messaging.bob.arrived' },
                { content: 'component.messaging.bob.decrypt' }
            ]);
        }
    }, [playerRole, aliceCipher.length, aliceValidBits]);

    useEffect(() => {
        if (gameSuccess) {
            if (evePresent && eveGuessedRightBits > 0) {
                pushLines([
                    {
                        title: 'component.e91.evePresent',
                        content: 'component.e91.evePresent.stats',
                        extra: `${eveGuessedRightBits}`
                    },
                ]);
            }
            // In solo mode, no server score saving
            // Score calculation would be done locally if needed
        }
    }, [gameSuccess]);

    const calculateScore = () => {
        let score = 0;
        score += aliceValidBits.length * 5;
        if (!eveSpotted && evePresent) {
            score -= 10;
        }
        return score;
    };

    const onMessageInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (playerRole === 'B') return;
        const newValue = event.target.value;
        const updatedMessage = [...message];
        const updatedBit = {...updatedMessage[index]};
        updatedBit.touched = true;
        if (newValue.length === 0 || /^[01]$/.test(newValue) && newValue.length <= 1) {
            updatedBit.value = newValue;
        }
        updatedBit.error = updatedBit.value === '';
        updatedMessage[index] = updatedBit;
        setMessage(updatedMessage);
    };

    const onCryptoInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = event.target.value;
        const updatedCrypto = [...crypto];
        const updatedBit = {...updatedCrypto[index]};
        if (newValue.length === 0 || /^[01]$/.test(newValue) && newValue.length <= 1) {
            updatedBit.value = newValue;
        }
        updatedCrypto[index] = updatedBit;
        setCrypto(updatedCrypto);
    };

    // How the round ends, for both roles. The student's arithmetic has already
    // been checked; whether Bob's MESSAGE is right depends only on whether the
    // two keys agree (physics doc 10.15). Returns true when they do.
    const endRound = (successContent: string) => {
        const keysMatch = aliceValidBits.join('') === bobValidBits.join('');
        if (keysMatch) {
            pushLines([
                {
                    title: 'component.messaging.congratulations',
                    content: successContent,
                },
            ]);
        } else {
            pushLines([
                {
                    title: 'component.e91.messaging.keyPerturbed',
                    content: 'component.e91.messaging.keyPerturbed.line',
                    info: 'keyPerturbed',
                },
            ]);
            setKeyPerturbedOpen(true);
        }
        // The round is over either way: "finished", not "won".
        setGameSuccess(true);
        return keysMatch;
    };

    /**
     * SOLO MODE: Validate locally without socket calls
     */
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
                if (endRound('component.messaging.bob.end')) {
                    toast.success(localize('component.basis.correct'));
                }
            } else if (playerRole === 'A' && !aliceCipherSent) {
                // Alice sends cipher - in solo mode, just mark as sent
                const payload = crypto.map(({value}) => value);
                setAliceCipher(payload);
                toast.success(localize('component.messaging.cipherSent'));
                // Add "message sent" progression message (matching multiplayer)
                pushLines([
                    { content: 'component.messaging.alice.sent' }
                ]);
                setAliceCipherSent(true);
                
                // SOLO MODE: Simulate Bob's successful decryption after delay
                // In multiplayer, Bob sends a socket event when he decrypts successfully
                // Here we simulate that after a short delay
                setTimeout(() => {
                    pushLines([
                        {
                            title: 'component.messaging.congratulations',
                            content: 'component.messaging.alice.end',
                        },
                    ]);
                    setGameSuccess(true);
                }, 2000);  // 2 second delay to simulate Bob decrypting
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

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER - Identical to multiplayer messaging-tab.tsx
    // ═══════════════════════════════════════════════════════════════════════

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
                                localize('component.messaging.aliceEncrypted')}</p>
                        </TableHead>
                        <TableHead className="text-center rounded-tr-lg">
                            <p>{playerRole === 'A' ?
                                localize('component.messaging.yourEncrypted') :
                                localize('component.messaging.aliceDecrypt')}</p>
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
                                       onKeyDown={e => forbiddenSymbols.includes(e.key) && e.preventDefault()}
                                       value={playerRole === 'B' ?
                                           aliceCipher[i] ?? '' :
                                           aliceCipherSent || gameSuccess ?
                                               persistedMessage[i] :
                                               message[i].value}
                                       onChange={(event) => onMessageInput(event, i)}
                                       className={cn(
                                           'w-10 text-lg text-center' +
                                           ' mx-auto disabled:opacity-100' +
                                           ' disabled:bg-background' +
                                           ' disabled:cursor-default' +
                                           ' mx-auto', playerRole === 'A' &&
                                           message[i].error &&
                                           message[i].touched ? 'border-red' : '')}/>
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={playerRole === 'A' ?
                                        (aliceCipherSent || gameSuccess ?
                                            persistedCrypto[i] :
                                            crypto[i].value) :
                                        (gameSuccess ?
                                            persistedCrypto[i] :
                                            crypto[i].value)}
                                    onKeyDown={e => forbiddenSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(event) => onCryptoInput(event, i)}
                                    className={cn(
                                        'w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default' +
                                        ' mx-auto',
                                        crypto[i].error &&
                                        crypto[i].touched ? 'border-red' : '')}/>
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

export default SoloMessagingTab;

'use client';

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody, TableCell,
} from '@/components/ui/table';
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { forbiddenSymbols } from '@/lib/utils';
import { computeDetectorValue } from '@/lib/dps/dps-protocol';

const SoloAliceMessagingTab = () => {
    const DECRYPT_DRAFT_KEY = 'dpsSoloAliceMessagingDecryptDraft';

    const { localize } = useLanguage();
    const { pushLines } = useDPSProgressStore();

    const {
        inferredPhases,
        bobCipher,
        alicePhases,
        bobTimeMeasurements,
        gameSuccess,
        decryptedMessage: persistedDecryptedMessage,
    } = useDPSRoomStore();

    const {
        setDecryptedMessage: setPersistedDecryptedMessage,
        setGameSuccess,
        setAliceKeyBits,
        setBobKeyBits,
        setMessage: setBobMessage,
        setBobCipher,
        setBobCipherSent,
    } = useDPSRoomStore();

    const secretKey = inferredPhases.map(phase => (phase === "π" ? "1" : "0"));

    // ═══════════════════════════════════════════════════════════════════════
    // SOLO COMPUTER BOB LOGIC
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
        // If Bob hasn't sent a cipher yet, Computer Bob acts
        if (bobCipher.length === 0 && !gameSuccess) {

            // 1. Calculate Bob's Key from measurements
            const validEntries = alicePhases.map((phase, index) => ({
                phase: Array.isArray(phase) ? phase : phase.split(""),
                time: bobTimeMeasurements[index] ?? "",
            })).filter(entry => entry.time === 'T1' || entry.time === 'T2');

            const calculatedKeyBits = validEntries.map(entry => computeDetectorValue(entry.phase, entry.time));
            // Filter out any errors (shouldn't happen with T1/T2 filter but good practice)
            // But since input is typed, we assume strings.
            const bobKey = calculatedKeyBits.filter(k => k !== 'Error');

            setBobKeyBits(bobKey);

            // 2. Generate Random Message (binary, same length as key)
            const generatedMessage = bobKey.map(() => Math.random() < 0.5 ? '1' : '0');
            setBobMessage(generatedMessage);

            // 3. Encrypt (XOR)
            const cipher = generatedMessage.map((msgBit, i) =>
                (parseInt(msgBit) ^ parseInt(bobKey[i])).toString()
            );

            // 4. Send after delay
            setTimeout(() => {
                setBobCipher(cipher);
                setBobCipherSent(true);

                pushLines([
                    { content: 'component.messaging.alice.arrived' },
                    { content: 'component.messaging.alice.decrypt' }
                ]);
            }, 2000);
        } else if (bobCipher.length > 0 && !gameSuccess) {
            // If we revisit tab, just show prompts if not done
            // (Optional, handled by existing logic or just persistent state)
        }
    }, [bobCipher.length, gameSuccess, alicePhases, bobTimeMeasurements, setBobKeyBits, setBobMessage, setBobCipher, setBobCipherSent, pushLines]);

    // ═══════════════════════════════════════════════════════════════════════
    // ALICE PLAYER LOGIC
    // ═══════════════════════════════════════════════════════════════════════

    const [decryptedMessage, setDecryptedMessage] = useState(() => {
        if ((gameSuccess || persistedDecryptedMessage.length > 0) && persistedDecryptedMessage.length === bobCipher.length && bobCipher.length > 0) {
            return persistedDecryptedMessage.map(value => ({
                value: value ?? '',
                touched: true,
                error: false,
            }));
        }

        const draft = localStorage.getItem(DECRYPT_DRAFT_KEY);
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                if (Array.isArray(parsed) && parsed.length === bobCipher.length) {
                    return parsed;
                }
            } catch {
                // Ignore parse errors and use default values
            }
        }

        return bobCipher.map(() => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    // Update state when bobCipher arrives (if initially empty)
    useEffect(() => {
        if (bobCipher.length > 0 && decryptedMessage.length === 0) {
            setDecryptedMessage(bobCipher.map(() => ({
                value: '',
                touched: false,
                error: true,
            })));
        }
    }, [bobCipher, decryptedMessage.length]);

    useEffect(() => {
        if (gameSuccess || persistedDecryptedMessage.length > 0) {
            localStorage.removeItem(DECRYPT_DRAFT_KEY);
            return;
        }

        if (decryptedMessage.length > 0) {
            localStorage.setItem(DECRYPT_DRAFT_KEY, JSON.stringify(decryptedMessage));
        }
    }, [decryptedMessage, gameSuccess, persistedDecryptedMessage.length]);

    useEffect(() => {
        const shouldHydrateFromPersisted =
            (gameSuccess || persistedDecryptedMessage.length > 0) &&
            persistedDecryptedMessage.length === bobCipher.length &&
            bobCipher.length > 0;

        if (!shouldHydrateFromPersisted) return;

        setDecryptedMessage(persistedDecryptedMessage.map(value => ({
            value: value ?? '',
            touched: true,
            error: false,
        })));
    }, [gameSuccess, persistedDecryptedMessage, bobCipher.length]);


    const onDecryptionInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = event.target.value;
        const updatedMessage = [...decryptedMessage];
        const updatedBit = { ...updatedMessage[index] };

        updatedBit.touched = true;

        if (newValue.length === 0 || /^[01]$/.test(newValue) && newValue.length <= 1) {
            updatedBit.value = newValue;
        }

        updatedBit.error = updatedBit.value === '';
        updatedMessage[index] = updatedBit;
        setDecryptedMessage(updatedMessage);
    };

    const onValidateDecryption = () => {

        const updatedMessage = decryptedMessage.map((bit, index) => {
            const expectedValue = (parseInt(bobCipher[index]) ^ parseInt(secretKey[index])).toString();
            return {
                ...bit,
                touched: true,
                error: bit.value !== expectedValue,
            };
        });

        setDecryptedMessage(updatedMessage);

        const allValid = !updatedMessage.some(bit => bit.error);

        if (allValid) {
            setAliceKeyBits(secretKey);
            setPersistedDecryptedMessage(updatedMessage.map(({ value }) => value));
            localStorage.removeItem(DECRYPT_DRAFT_KEY);
            toast.success(localize('component.basis.correct'));
            if (!gameSuccess) {
                setGameSuccess(true); // Local success
                pushLines([
                    {
                        title: 'component.messaging.congratulations',
                        content: 'component.messaging.alice.end',
                    },
                ]);
            }
        } else {
            toast.error(localize('component.messaging.decryptError'));
        }
    };


    return (
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center"><p>{localize('component.aliceInference.phaseDifference')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.messaging.yourKey')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.messaging.bobEncrypted')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.messaging.bobDecrypt')}</p></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inferredPhases.map((phase, index) => (
                        <TableRow key={index} className="text-center border-secondary">
                            <TableCell>{phase}</TableCell>
                            <TableCell>{secretKey[index]}</TableCell>
                            <TableCell>
                                <Input
                                    className={cn('w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default',
                                    )}
                                    disabled={true}
                                    value={bobCipher[index] || ""} />
                            </TableCell>
                            <TableCell>
                                <Input
                                    disabled={bobCipher.length == 0 || gameSuccess}
                                    onKeyDown={e => forbiddenSymbols.includes(e.key) && e.preventDefault()}
                                    value={gameSuccess
                                        ? (persistedDecryptedMessage[index] ?? '')
                                        : (decryptedMessage[index]?.value || "")
                                    }
                                    onChange={(event) => onDecryptionInput(event, index)}
                                    className={cn(
                                        'w-10 text-lg text-center' +
                                        'mx-auto disabled:opacity-100 ' +
                                        ' disabled:bg-background ' +
                                        ' disabled:cursor-default' +
                                        ' mx-auto',
                                        decryptedMessage[index]?.error &&
                                            decryptedMessage[index]?.touched ? 'border-red' : ''
                                    )}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden">
                <Button size={'icon'}
                    disabled={bobCipher.length == 0 || gameSuccess}
                    onClick={onValidateDecryption}>
                    <CheckCircle2 />
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg"
                    disabled={bobCipher.length == 0 || gameSuccess}
                    onClick={onValidateDecryption} className="text-lg font-bold">
                    {localize('component.dps.validateBtn')}
                </Button>
            </div>
        </div>
    );
};

export default SoloAliceMessagingTab;

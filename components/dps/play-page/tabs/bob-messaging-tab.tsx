import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { forbiddenSymbols } from '@/lib/utils';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { toast } from 'sonner';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';

const BobMessagingTab = () => {
    const { localize } = useLanguage();
    const { sendCipher } = useSocket();
    const { pushLines } = useDPSProgressStore();

    const {
        alicePhases,
        bobTimeMeasurements,
        bobCipher,
        bobKeyBits,
        bobCipherSent,
        message: persistedMessage,
        crypto: persistedCrypto,
        gameSuccess,

    } = useDPSRoomStore();

    const {
        setBobCipher,
        setBobKeyBits,
        setBobCipherSent,
        setMessage: setPersistedMessage,
        setCrypto: setPersistedCrypto,
        setGameSuccess,
    } = useDPSRoomStore();

    const bobKeyBitsOn = bobKeyBits?.length > 0;

    // OPTION B REFACTOR: Check for valid times (T1/T2) directly instead of empty string
    // This is more pedagogical - shows exactly which times we use for key generation
    // OLD CODE (commented for safety):
    // const validEntries = alicePhases.map((phase, index) => ({
    //     phase: Array.isArray(phase) ? phase : phase.split(""),
    //     time: bobTimeMeasurements[index] ?? "", 
    // })).filter(entry => entry.time !== "");

    // NEW CODE: Explicitly filter for T1 or T2 (the only valid interference times)
    const validEntries = alicePhases.map((phase, index) => ({
        phase: Array.isArray(phase) ? phase : (phase as any).split(""),
        time: bobTimeMeasurements[index] ?? "",
    })).filter(entry => entry.time === 'T1' || entry.time === 'T2');

    const [message, setMessage] = useState(() => {
        return validEntries.map(() => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const [crypto, setCrypto] = useState(() => {
        return validEntries.map(() => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const [detectorValues, setDetectorValues] = useState<string[]>([]);

    const revealDetectorValues = (entries: { phase: string[]; time: string }[]) => {
        entries.forEach((entry, i) => {
            setDetectorValues(prev => {
                const newValues = [...prev];
                newValues[i] = computeDetectorValue(entry);
                return newValues;
            });
        });
    };

    const computeDetectorValue = ({ phase, time }: { phase: string[]; time: string }) => {
        if (phase.length !== 3) return "Erreur";
        if (time === "T1") {
            const [B, A] = phase.slice(-2);
            return (A === "π" && B === "0") || (A === "0" && B === "π") ? "1" : "0";
        }
        if (time === "T2") {
            const [C, B] = phase.slice(0, 2);
            return (B === "π" && C === "0") || (B === "0" && C === "π") ? "1" : "0";
        }
        return "Erreur";
    };
    useEffect(() => {
        if (validEntries.length > 0 && !bobKeyBitsOn) {
            revealDetectorValues(validEntries);
        }
    }, []);




    const onMessageInput = (event: React.ChangeEvent<HTMLInputElement>,
        index: number) => {
        const newValue = event.target.value;
        const updatedMessage = [...message];
        const updatedBit = { ...updatedMessage[index] };
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
        const updatedBit = { ...updatedCrypto[index] };
        if (newValue.length === 0 || /^[01]$/.test(newValue) &&
            newValue.length <= 1) {
            updatedBit.value = newValue;
        }
        updatedCrypto[index] = updatedBit;
        setCrypto(updatedCrypto);
    };

    const onValidateBits = () => {
        setMessage(message => message.map(bit => ({ ...bit, touched: true })));
        const updatedCrypto = crypto.map((cryptoBit, index) => {
            const detectorValue = detectorValues[index];
            const messageValue = message[index].value;

            if (detectorValue === "Erreur") {
                console.warn(`Erreur dans getDetector pour l'entrée ${index}`);
                return { ...cryptoBit, error: true };
            }

            const keyNumber = parseInt(detectorValue);

            const messageNumber = parseInt(messageValue);

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
            setBobKeyBits(detectorValues);
            setPersistedCrypto(updatedCrypto.map(({ value }) => value));
            setPersistedMessage(message.map(({ value }) => value));
            const payload = crypto.map(({ value }) => value);
            sendCipher(payload);
            toast.success(localize('component.messaging.cipherSent'));
            setBobCipherSent(true);
        } else {
            toast.error(localize('component.messaging.cipherError'));
        }
        return allValid;
    };

    return (
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg border-secondary">

                        <TableHead className="text-center"><p>{localize('component.bobMessaging.arrivalTime')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.detector')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.message')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.encryptedMessage')}</p></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {validEntries.map(({ time }, index) => (
                        <TableRow key={index} className="text-center border-secondary">
                            <TableCell>{time}</TableCell>
                            <TableCell>
                                <Input
                                    disabled={true}
                                    value={detectorValues[index]}
                                    className={cn('w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default',
                                    )} />

                            </TableCell>
                            <TableCell>
                                <Input
                                    value={bobCipherSent || gameSuccess ?
                                        persistedMessage[index] :
                                        message[index].value}
                                    onKeyDown={e => forbiddenSymbols.includes(
                                        e.key) && e.preventDefault()}
                                    onChange={(event) => onMessageInput(event, index)}
                                    className={cn(
                                        'w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default' +
                                        ' mx-auto',
                                        crypto[index].error &&
                                            crypto[index].touched ? 'border-red' :
                                            '')}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={bobCipherSent || gameSuccess ?
                                        persistedCrypto[index] :
                                        crypto[index].value}
                                    onChange={(event) => onCryptoInput(
                                        event, index)}
                                    onKeyDown={e => forbiddenSymbols.includes(
                                        e.key) && e.preventDefault()}
                                    className={cn(
                                        'w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default' +
                                        ' mx-auto',
                                        crypto[index].error &&
                                            crypto[index].touched ? 'border-red' :
                                            '')}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden">
                <Button size={'icon'}

                    disabled={bobCipherSent || gameSuccess}

                    onClick={onValidateBits}>
                    <CheckCircle2 />
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg"
                    disabled={bobCipherSent || gameSuccess}

                    onClick={onValidateBits}

                    className="text-lg font-bold">

                    {localize('component.messaging.validateAndSend')}
                </Button>
            </div>
        </div>
    );
};

export default BobMessagingTab;

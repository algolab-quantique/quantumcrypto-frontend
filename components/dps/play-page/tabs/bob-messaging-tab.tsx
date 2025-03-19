import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody, 
    TableCell
} from '@/components/ui/table';
import React, { useState, useEffect } from 'react';
import {cn} from '@/lib/utils';
import {forbiddenSymbols} from '@/lib/utils';
import {CheckCircle2, Send} from 'lucide-react';
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
    const {pushLines} = useDPSProgressStore();

    const { 
        alicePhases, 
        bobTimeMeasurements,
        bobCipher,
        bobCipherSent,
        keyBits,
        message: persistedMessage,
        crypto: persistedCrypto,
        gameSuccess,

    } = useDPSRoomStore();

    const {
        setBobCipher,
        setBobCipherSent,
        setMessage: setPersistedMessage,
        setCrypto: setPersistedCrypto,
        setGameSuccess,
    } = useDPSRoomStore();
    
    console.log("alicePhases:", alicePhases);
    console.log("bobTimeMeasurements:", bobTimeMeasurements);

    // Filtrer les phases avec un temps valide
    const validEntries = alicePhases.map((phase, index) => ({
        phase: Array.isArray(phase) ? phase : phase.split(""), // S'assurer que c'est un tableau
        time: bobTimeMeasurements[index] ?? "", 
    })).filter(entry => entry.time !== "");

    console.log("validEntries:", validEntries);

    
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
    const generateDetectorValues = (entries: { phase: string[]; time: string }[]) => {
        return entries.map(({ phase, time }) => {
            if (phase.length !== 3) return "Erreur";
            if (time === "t1") {
                const [B, A] = phase.slice(-2);
                return (A === "π" && B === "0") || (A === "0" && B === "π") ? "1" : "0";
            } 
            if (time === "t2") {
                const [C, B] = phase.slice(0, 2);
                return (B === "π" && C === "0") || (B === "0" && C === "π") ? "1" : "0";
            }
            return "Erreur"; 
        });
    };
    useEffect(() => {
        setDetectorValues(generateDetectorValues(validEntries));
    }, []);
        


    const onMessageInput = (event: React.ChangeEvent<HTMLInputElement>,
                                index: number) => {
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
        setMessage(message => message.map(bit => ({ ...bit, touched: true })));
        const updatedCrypto = crypto.map((cryptoBit, index) => {
            const detectorValue = detectorValues[index];
            const messageValue = message[index].value;
    
            console.log(`Detector[${index}]:`, detectorValue);
            console.log(`Message[${index}]:`, messageValue);
    
            if (detectorValue === "Erreur") {
                console.warn(`Erreur dans getDetector pour l'entrée ${index}`);
                return { ...cryptoBit, error: true };
            }

            const keyNumber = parseInt(detectorValue);

            console.log("**message[index].value: ", message[index].value);
            const messageNumber = parseInt(messageValue);
            
            const result = (keyNumber + messageNumber) % 2;
            console.log("result: ", result);
            return {
                ...cryptoBit,
                touched: true,
                error: result.toString() !== cryptoBit.value,
            };
        });

        setCrypto(updatedCrypto);
        const allValid = !updatedCrypto.some(bit => bit.error);
        console.log("**allValid:  ", allValid);

        if (allValid) {
            setPersistedCrypto(updatedCrypto.map(({value}) => value));
            setPersistedMessage(message.map(({value}) => value));
            const payload = crypto.map(({value}) => value);
            sendCipher(payload);
            toast.success(localize('component.messaging.cipherSent'));
            setBobCipherSent(true);
            pushLines([{ 
                content: 'component.messaging.bob.sent'
            }]);
            /*
            pushLines([{ 
                        title: 'component.messaging.congratulations',
                        content: 'component.messaging.bob.end'
                    }]);
            setGameSuccess(true);
            */
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
                        <TableHead className="text-center rounded-tl-lg"><p>{localize('component.bobMessaging.phase')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.arrivalTime')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.detector')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.message')}</p></TableHead>
                        <TableHead className="text-center"><p>{localize('component.bobMessaging.encryptedMessage')}</p></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {validEntries.map(({ phase, time }, index) => (
                        <TableRow key={index} className="text-center border-secondary">
                            <TableCell>{phase.join(" ")}</TableCell>
                            <TableCell>{time}</TableCell>
                            <TableCell>{detectorValues[index]}</TableCell>
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
                                    value = { bobCipherSent || gameSuccess ?
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
                    <CheckCircle2/>
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

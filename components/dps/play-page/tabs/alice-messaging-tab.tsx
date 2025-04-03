import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody, TableCell,
} from '@/components/ui/table';
import React, { useState, useEffect} from 'react';
import {CheckCircle2, Send} from 'lucide-react';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {clearBB84LocalStorage} from '@/lib/bb84/utils';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/providers/language-provider';
import {useSocket} from '@/components/providers/socket-provider';
import {useDPSProgressStore} from '@/store/dps/dps-progress-store';
import {forbiddenSymbols} from '@/lib/utils';
import usePlayerStore from '@/store/player-store';

const AliceMessagingTab = () => {
    const { localize } = useLanguage();
    const {pushLines} = useDPSProgressStore();   
    const {sendAliceSuccess} = useSocket();
    
    const { 
        inferredPhases,
        bobCipher,
        aliceKeyBits,
        gameSuccess,
        decryptedMessage: persistedDecryptedMessage,        
    } = useDPSRoomStore();

    const {
        setDecryptedMessage: setPersistedDecryptedMessage,
        setGameSuccess,
        setAliceKeyBits,
    } = useDPSRoomStore();

    console.log("bobCipher: ", bobCipher.length);
    const secretKey = inferredPhases.map(phase => (phase === "π" ? "1" : "0"));
    

    const [decryptedMessage, setDecryptedMessage] = useState(() => {
        return bobCipher.map(() => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

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
            setPersistedDecryptedMessage(updatedMessage.map(({value}) => value));
            toast.success(localize('component.basis.correct'));
            if(!gameSuccess){
                pushLines([
                    {
                        title: 'component.messaging.congratulations',
                        content: 'component.messaging.alice.end',
                    },
                ]);
            }
            sendAliceSuccess();
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
                                    disabled={bobCipher.length==0 || gameSuccess}
                                    onKeyDown={e => forbiddenSymbols.includes(e.key) && e.preventDefault()}
                                    value={ gameSuccess 
                                            ? persistedDecryptedMessage[index] 
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
                        disabled={bobCipher.length==0 || gameSuccess}
                        onClick={onValidateDecryption}>
                    <CheckCircle2/>
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg" 
                        disabled={bobCipher.length==0 || gameSuccess}
                        onClick={onValidateDecryption} className="text-lg font-bold">
                    {localize('component.dps.validateBtn')}
                </Button>
            </div>
        </div>
    );
};

export default AliceMessagingTab;

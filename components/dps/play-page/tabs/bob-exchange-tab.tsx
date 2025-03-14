'use client';

import React, {useState, useEffect} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner';
import {cn} from '@/lib/utils';
import {Input} from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {useLanguage} from '@/components/providers/language-provider';
import {useSocket} from '@/components/providers/socket-provider';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import {inputPhaseField } from '@/types';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import {CheckCircle2, SearchCode} from 'lucide-react';




const BobExchangeTab = ({photonNumber}: { photonNumber: number }) => {
    const {localize} = useLanguage();
    
    const { pushLines, displayedLines } = useDPSProgressStore();
    //const {shareClicksTimes} = useSocket();

    const {alicePhotons, bobTimeMeasurements} = useDPSRoomStore();
    const {setAlicePhotons, setBobTimeMeasurements} = useDPSRoomStore();

    const measured = bobTimeMeasurements.length > 0;

    const [phaseInputs, setPhaseInputs] = useState(() => {
            const inputs: inputPhaseField[] = [];
            for (let _ = 0; _ < photonNumber; _++) {
                inputs.push({
                    values: ['-', '-', '-'],
                    touched: [false, false, false],
                    error: [true, true, true],
                });
            }
            return inputs;
        });

    const [measurements, setMeasurements] = useState<(string | null)[]>(Array(photonNumber).fill(null));

    const [validatedTimes, setValidatedTimes] = useState(() => {
        return measurements.map(value => ({
            value: value || "",
            error: false,  
            discarded: false,
        }));
    });
    
    
    // Mettre à jour validatedTimes dès que measurements change
    useEffect(() => {
        setValidatedTimes(measurements.map(value => ({
            value: value || "",
            error: false,
            discarded: false,
        })));
    }, [measurements]);

    const onToggleDiscardTime = (index: number) => {
        const updatedTimes = [...validatedTimes];
        const updatedTime = {...updatedTimes[index]};
        const prevTime = updatedTime.discarded;
        updatedTime.discarded = !prevTime;
        updatedTimes[index] = updatedTime;
        setValidatedTimes(updatedTimes);
    };
    

    // Activer le bouton "Envoyer les temps" uniquement si Bob a validé
    const allValid = validatedTimes.some(time => !time.discarded);

    

    console.log("alicePhotons: ", alicePhotons);    


    const measureArrivalTime = () => {
        const probabilities = [1/6, 2/6, 2/6, 1/6];
        const times = ['t0', 't1', 't2', 't3'];
    
        const getRandomTime = () => {
            const random = Math.random();
            let cumulativeProbability = 0;
            for (let i = 0; i < probabilities.length; i++) {
                cumulativeProbability += probabilities[i];
                if (random < cumulativeProbability) {
                    return times[i];
                }
            }
            return times[times.length - 1] || ""; 
        };
    
        const newArrivalTimes = Array.from({ length: photonNumber }, () => getRandomTime());
        setMeasurements(newArrivalTimes);
        setBobTimeMeasurements(newArrivalTimes);
        return newArrivalTimes;
    };


    const onValidateTimes = () => {
        let valid = false;
    
        // Vérifier si Bob a bien rejeté les temps t0 et t3
        const updatedTimes = validatedTimes.map(field => ({
            ...field,
            error: !field.discarded && (field.value === 't0' || field.value === 't3') ||
                    field.discarded && (field.value === 't1' || field.value === 't2'), 
        }));
    
        if (!updatedTimes.some(field => field.error)) {
            toast.success(localize('component.basis.correct'));
            valid = true;
            pushLines([{ content: 'component.bobExchange.shareWithAlice' }]);
        } else {
            toast.error(localize('component.basis.verify'));
        }
    
        setValidatedTimes(updatedTimes);
       
        return valid;
    };

    const onSendTimes = () => {
        const isValid = onValidateTimes();
        if (isValid) {
            const validTimes = validatedTimes.map(({ discarded, value }) => 
                discarded ? "" : value
            );    
            console.log("validTimes: ", validTimes);
            setBobTimeMeasurements(validTimes as string[]);
            setMeasurements(validTimes as string[]);
            
            pushLines([{ content: 'component.bobExchange.sentTimes' }]);
            
            toast.success(localize('component.bobExchange.timesSent'));
        }
    };

    

    
        return (
            <div
                className="block border
                        text-card-foreground border-secondary bg-card shadow-lg
                        rounded-lg">
              
              <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow
                        className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center rounded-tl-lg">
                            <p>{localize('component.bobGame.photons')}</p>
                        </TableHead>
                        <TableHead className="text-center rounded-tr-lg">
                            <div
                                className="flex flex-col gap-y-1 md:flex-row md:gap-x-2 justify-center items-center">
                                <p>{localize(
                                    'component.bobExchange.arrivalTime')}</p>
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger
                                            disabled={ measured }
                                            // disabled={alicePhotons.length ==
                                            //     0 || measured ||
                                            //     basisInputs.some(
                                            //         basis => basis.value ===
                                            //             '')}
                                            onClick={measureArrivalTime}
                                            className={'disabled:opacity-50 disabled:pointer-events-none rounded-md p-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground'}>
                                            <SearchCode/>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="border-secondary">
                                            <p>{localize(
                                                'component.bobExchange.measure')}</p>
                                            <p>{localize(
                                                'component.bobExchange.arrivalTimeDesc')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {Array.from({ length: photonNumber }).map((_, i) => (
                        <TableRow key={i}
                                  className="text-center border-secondary">
                            <TableCell>
                                <Input
                                    disabled
                                    value={alicePhotons.length > 0 ? '*' : ''}
                                    className="disabled:bg-background
                                    disabled:opacity-100
                                    disabled:cursor-default
                                     w-10 text-lg
                                    text-center mx-auto"/>
                            </TableCell>
                            <TableCell>
                                <div 
                                    onClick={() => onToggleDiscardTime(i)}
                                    className={cn(
                                        'select-none bg-background rounded-md h-10 border border-secondary cursor-pointer w-10 text-lg text-center m-auto pt-1.5',
                                        validatedTimes[i]?.discarded ? 'text-background' : '',
                                        validatedTimes[i]?.error ? 'border-red' : ''
                                    )}
                                >
                                    <p>{validatedTimes[i]?.value ?? '-'}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="fixed right-6 bottom-6 shadow-xl">
                <Button size="lg" 
                    disabled={ !measured }
                    onClick={onValidateTimes} className="text-lg font-bold">
                    {localize('component.basis.validateBtn')}
                </Button>           
                <Button size="lg" onClick={onSendTimes} className="text-lg font-bold ml-4">
                    {localize('component.bobExchange.sendTimes')}
                </Button>
            </div>

            </div>
        );
}

export default BobExchangeTab;
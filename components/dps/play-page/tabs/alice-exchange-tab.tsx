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
import {Input} from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {cn, forbiddenSymbols} from '@/lib/utils';
import {useLanguage} from '@/components/providers/language-provider';
import {useSocket} from '@/components/providers/socket-provider';
import {DPSGameStep, inputPhaseField } from '@/types';
import { log } from 'console';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import {useDPSProgressStore} from '@/store/dps/dps-progress-store';
import {CheckCircle2, Info} from 'lucide-react';




const AliceExchangeTab = ({photonNumber, polarIcons}: {
    photonNumber: number;
    polarIcons: any[]
}) => {
    const PHASE_INPUTS_KEY = 'dpsMultiAliceExchangePhaseInputs';
    const PULSE_INPUTS_KEY = 'dpsMultiAliceExchangePulseInputs';

    const {localize} = useLanguage();
    const {sendPhases} = useSocket();
    const {pushLines, setDPSTab, setStep} = useDPSProgressStore();
    const {
        alicePhotons,
        alicePhases,
    } = useDPSRoomStore();
    const {
        setAlicePhotons,
        setAlicePhases,
    } = useDPSRoomStore();
    const possiblePhases = ['0', 'π'];
    const photonsSent = alicePhotons.length > 0;

    const buildEmptyInputRows = () => {
        const inputs: inputPhaseField[] = [];
        for (let _ = 0; _ < photonNumber; _++) {
            inputs.push({
                values: ['-', '-', '-'],
                touched: [false, false, false],
                error: [true, true, true],
            });
        }
        return inputs;
    };

    const getStoredDraft = (key: string): inputPhaseField[] | null => {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length !== photonNumber) return null;
            return parsed;
        } catch {
            return null;
        }
    };

    const [phaseInputs, setPhaseInputs] = useState(() => {
        const draft = getStoredDraft(PHASE_INPUTS_KEY);
        return draft ?? buildEmptyInputRows();
    });

    const [pulseInputs, setPulseInputs] = useState(() => {
        const draft = getStoredDraft(PULSE_INPUTS_KEY);
        return draft ?? buildEmptyInputRows();
    });

    useEffect(() => {
        if (photonsSent) {
            localStorage.removeItem(PHASE_INPUTS_KEY);
            localStorage.removeItem(PULSE_INPUTS_KEY);
            return;
        }

        localStorage.setItem(PHASE_INPUTS_KEY, JSON.stringify(phaseInputs));
        localStorage.setItem(PULSE_INPUTS_KEY, JSON.stringify(pulseInputs));
    }, [phaseInputs, pulseInputs, photonsSent]);

    const randomize = () => {
        const newList = phaseInputs.map(item => {
            const values = Array(3)
                .fill(null)
                .map(() => possiblePhases[Math.floor(Math.random() * possiblePhases.length)]);
    
            return {
                ...item,
                values,
                touched: [true, true, true],
                error: [false, false, false],
            };
        });
    
        setPhaseInputs(newList);

        validatePulse({
            phaseList: newList,
            pulseInputs: pulseInputs,
        }, true);
    };

    const onPhaseClick = (rowIndex: number, buttonIndex: number) => {
        const newPolarList = [...phaseInputs];
        const currentValues = [...newPolarList[rowIndex].values];

        currentValues[buttonIndex] = currentValues[buttonIndex] === '0' ? 'π' : '0';

        const newTouched = [...newPolarList[rowIndex].touched];
        newTouched[buttonIndex] = true;

        const newError = [...newPolarList[rowIndex].error];
        newError[buttonIndex] = false;

        newPolarList[rowIndex] = {
            ...newPolarList[rowIndex],
            values: currentValues,
            touched: newTouched,
            error: newError,
        };
    
        setPhaseInputs(newPolarList);

        validatePulse({
            phaseList: newPolarList,
            pulseInputs: pulseInputs,
        }, false, rowIndex);
    };

    const onModulatedClick = (rowIndex: number, buttonIndex: number) => {
        const newPhaseList = [...phaseInputs];
        const newPulseList = [...pulseInputs];
        const currentPhase = newPhaseList[rowIndex].values[buttonIndex];
        const currentPulse = newPulseList[rowIndex].values[buttonIndex];
        
        let newPulseValue = currentPulse === '1' ? '2' : '1';

        const newValues = [...newPulseList[rowIndex].values];
        newValues[buttonIndex] = newPulseValue;

        const newTouched = [...newPulseList[rowIndex].touched];
        newTouched[buttonIndex] = true;

        newPulseList[rowIndex] = {
            ...newPulseList[rowIndex],
            values: newValues,
            touched: newTouched,
        };
    
        setPulseInputs(newPulseList);

      
        validatePulse({
            phaseList: phaseInputs,
            pulseInputs: newPulseList,
        }, false, rowIndex);
    };

    const validatePulse = (prevStates: {
        phaseList?: inputPhaseField[],
        pulseInputs?: inputPhaseField[],
    },list: boolean, index?: number) => {
        const isValid = (phase: string, pulse: string) => (
            (phase === '0' && pulse === '1') ||
            (phase === 'π' && pulse === '2')
        );
        let newPulseList = prevStates.pulseInputs ?? pulseInputs;
        const phases = prevStates.phaseList ?? [...phaseInputs];
        if (list) {
            newPulseList = newPulseList.map((pulse, rowIndex) => {
                const newErrors = pulse.values.map((pulseValue, buttonIndex) => {
                    const phaseValue = phases[rowIndex].values[buttonIndex];
                    return !isValid(phaseValue, pulseValue);
                });
                return {
                    ...pulse,
                    error: newErrors,
                };
            });
            setPulseInputs(newPulseList);
        } else if (index !== undefined) {
            if (!newPulseList[index].touched) return;
            const newPulse = { ...newPulseList[index] };
            const newErrors = newPulse.values.map((pulseValue, buttonIndex) => {
                const phaseValue = phases[index].values[buttonIndex];
                return !isValid(phaseValue, pulseValue);
            });
            newPulse.error = newErrors;
            newPulseList[index] = newPulse;
            setPulseInputs(newPulseList);
        }
    }

   
    const validateForm = phaseInputs.every((phaseRow, rowIndex) => {
        const arePhasesValid = phaseRow.values.every((phase) => phase === '0' || phase === 'π');
        const arePulsesValid = pulseInputs[rowIndex].values.every((pulse) => pulse === '1' || pulse === '2');
        const areErrorsAbsent = pulseInputs[rowIndex].error.every((error) => !error);

        return arePhasesValid && arePulsesValid && areErrorsAbsent;
    });


    const onSendPulsePhotons = () => {
        
        if (validateForm && !photonsSent) {

          console.log("pulseInputs: ", pulseInputs);
          console.log("phaseInputs", phaseInputs);
          const photonsToSend = pulseInputs.map(({ values }) => values);
          const phasesToSend = phaseInputs.map(({ values }) => values);
  
          setAlicePhotons(photonsToSend);
          setAlicePhases(phasesToSend);
          localStorage.removeItem(PHASE_INPUTS_KEY);
          localStorage.removeItem(PULSE_INPUTS_KEY);
  
          console.log("alicePhotons après mise à jour:", photonsToSend);
          console.log("alicePhases après mise à jour:", phasesToSend);
  
          sendPhases(photonsToSend, phasesToSend);


           pushLines([
                {
                    content: 'component.dps.aliceExchange.sent',
                },
            ]);
    

        }
    };
    
    return (
        <div
            className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center rounded-tl-lg">
                            <div className="flex flex-col gap-y-1 py-1">
                                <div
                                    className="flex flex-col md:flex-row md:gap-x-1 justify-center">
                                    <p>{localize('component.dps.pulseTrain')}</p>
                                </div>
                            </div>
                        </TableHead>
                        <TableHead className="text-center w-[200px]">
                            <div className="flex flex-col gap-y-1 py-1">
                                <div
                                    className="flex flex-col md:flex-row md:gap-x-1 justify-center">
                                    <p>{localize('component.dps.phase')}</p>
                                    <p>{localize('component.dps.phaseDesc')}</p>
                                </div>
                                <Button size="sm"
                                        className="w-fit mx-auto"
                                        onClick={randomize}
                                        variant="outline">{localize(
                                    'component.aliceGame.random')}</Button>
                            </div>
                        </TableHead>
                        <TableHead className="text-center w-[200px]">
                            <div className="flex flex-col gap-y-1 py-1">
                                <div
                                    className="flex flex-col md:flex-row md:gap-x-1 justify-center">
                                    <p>{localize('component.dps.modulatedPulseTrain')}</p>
                                </div>
                            </div>
                        </TableHead>
                               
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {phaseInputs.map((_, i) => (
                        <TableRow key={i}
                            className="text-center border-secondary">
                            <TableCell>
                                <div className="gaussian-container">
                                    {[1, 2, 3].map((_, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="icon"
                                            className="flex items-center justify-center"
                                        >{polarIcons[1]}
                                        </Button>
                                    ))}
                                </div>
                            </TableCell>     
                            <TableCell className="w-[200px]">
                                <div className="gaussian-container">
                                    {phaseInputs[i].values.map((value, buttonIndex) => (
                                    
                                        <Button
                                            key={buttonIndex}
                                            variant="outline"
                                            className={cn('disabled:opacity-100')}
                                            onClick={() => onPhaseClick(i, buttonIndex)}
                                            size="icon"
                                        > {photonsSent ? alicePhases[i][buttonIndex]: value}
                                        </Button>
                                    ))}
                                </div>
                                
                            </TableCell>  
                            <TableCell className="w-[200px]">
                                <div className="gaussian-container">
                                    {pulseInputs[i].values.map((value, buttonIndex) => (
                                        <Button
                                            disabled={photonsSent}
                                            key={buttonIndex}
                                            variant="outline"
                                            className={cn(
                                                'disabled:opacity-100',
                                                'flex items-center justify-center', 
                                                pulseInputs[i].error[buttonIndex] && pulseInputs[i].touched[buttonIndex] ? 'border border-red' : ''
                                            )}
                                            onClick={() => onModulatedClick(i, buttonIndex)}
                                            size="icon"
                                        >
                                            {photonsSent 
                                                ? (alicePhotons[i][buttonIndex] === '1' 
                                                    ? polarIcons[1] 
                                                    : polarIcons[2]) 
                                                : (value === '1' 
                                                    ? polarIcons[1] 
                                                    : value === '2' 
                                                        ? polarIcons[2] 
                                                        : polarIcons[0])
                                            }
                                        </Button>
                                    ))}
                                </div>
                                
                            </TableCell>  
                             
                        </TableRow>
                    ))}
                    
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden">
                <Button 
                    onClick={onSendPulsePhotons} 
                    size={'icon'}
                    disabled={!validateForm || photonsSent}>
                    <CheckCircle2/>
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
            <Button
                disabled={!validateForm || photonsSent}
                size="lg"
                onClick={onSendPulsePhotons}
                className="text-lg font-bold"
                >
                {localize('component.dps.aliceExchange.send')}
            </Button>
            </div>
                    
        </div>
    );
};

export default AliceExchangeTab;

'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/language-provider';
import { DPSGameStep, inputPhaseField } from '@/types';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { CheckCircle2 } from 'lucide-react';
import { measureArrivalTime } from '@/lib/dps/dps-protocol';

const SoloAliceExchangeTab = ({ photonNumber, polarIcons }: {
    photonNumber: number;
    polarIcons: any[]
}) => {
    const PHASE_INPUTS_KEY = 'dpsSoloAliceExchangePhaseInputs';
    const PULSE_INPUTS_KEY = 'dpsSoloAliceExchangePulseInputs';

    const { localize } = useLanguage();
    const { pushLines, setStep, setDPSTab } = useDPSProgressStore();
    const {
        alicePhotons,
        alicePhases,
        setAlicePhotons,
        setAlicePhases,
        setBobTimeMeasurements,
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

    // Initialize inputs
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

    // Randomizes all inputs
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

        // Validate immediately after randomizing
        validatePulse({
            phaseList: newList,
            pulseInputs: pulseInputs,
        }, true);
    };

    // Handle Phase Click (0 <-> π)
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

    // Handle Pulse Modulated Click
    const onModulatedClick = (rowIndex: number, buttonIndex: number) => {
        const newPulseList = [...pulseInputs];
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

    // Validation Logic
    const validatePulse = (prevStates: {
        phaseList?: inputPhaseField[],
        pulseInputs?: inputPhaseField[],
    }, list: boolean, index?: number) => {
        const isValid = (phase: string, pulse: string) => (
            (phase === '0' && pulse === '1') ||
            (phase === 'π' && pulse === '2')
        );
        let newPulseList = prevStates.pulseInputs ? [...prevStates.pulseInputs] : [...pulseInputs];
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
            if (!newPulseList[index].touched.some(t => t)) return;
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

    // Determine if form is valid to send
    const validateForm = phaseInputs.every((phaseRow, rowIndex) => {
        const arePhasesValid = phaseRow.values.every((phase) => phase === '0' || phase === 'π');
        const arePulsesValid = pulseInputs[rowIndex].values.every((pulse) => pulse === '1' || pulse === '2');
        const areErrorsAbsent = pulseInputs[rowIndex].error.every((error) => !error);

        return arePhasesValid && arePulsesValid && areErrorsAbsent;
    });

    const getSentPhaseValue = (rowIndex: number, buttonIndex: number) => {
        return alicePhases[rowIndex]?.[buttonIndex] ?? phaseInputs[rowIndex]?.values[buttonIndex] ?? '-';
    };

    const getSentPulseIcon = (rowIndex: number, buttonIndex: number) => {
        const sentValue = alicePhotons[rowIndex]?.[buttonIndex] ?? pulseInputs[rowIndex]?.values[buttonIndex];
        if (sentValue === '1') return polarIcons[1];
        if (sentValue === '2') return polarIcons[2];
        return polarIcons[0];
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SOLO MODE ACTION: Send Pulses (and Simulate Bob)
    // ═══════════════════════════════════════════════════════════════════════
    const onSendPulsePhotons = () => {

        if (validateForm && !photonsSent) {
            localStorage.removeItem(PHASE_INPUTS_KEY);
            localStorage.removeItem(PULSE_INPUTS_KEY);

            const photonsToSend = pulseInputs.map(({ values }) => values);
            const phasesToSend = phaseInputs.map(({ values }) => values);

            setAlicePhotons(photonsToSend);
            setAlicePhases(phasesToSend);

            // In Solo Mode: Simulate Bob's reception and measurement
            // 1. Notify user that pulses are sent
            pushLines([
                { content: 'component.dps.aliceExchange.sent' }
            ]);

            // 2. Delay to simulate network/Bob's processing time (2 seconds)
            setTimeout(() => {
                // Generate Bob's measurements locally using protocol function
                const bobTimes = measureArrivalTime(photonNumber);

                setBobTimeMeasurements(bobTimes);

                // Advance to next step (Inference)
                setStep(1);
                setDPSTab('inference');

                pushLines([
                    {
                        title: 'component.aliceInference.timesArrived'
                    },
                    {
                        title: 'component.game.step2',
                        content: 'component.aliceInference.inferPhaseDifference'
                    }
                ]);
            }, 2000);
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
                                        > {photonsSent ? getSentPhaseValue(i, buttonIndex) : value}
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
                                                ? getSentPulseIcon(i, buttonIndex)
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
                    <CheckCircle2 />
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

export default SoloAliceExchangeTab;

'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/components/providers/language-provider';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { DPSGameStep } from '@/types';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { SearchCode } from 'lucide-react';
import {
    generateRandomPhases,
    generatePulseTrains,
    measureArrivalTime as protocolMeasureArrivalTime
} from '@/lib/dps/dps-protocol';

const SoloBobExchangeTab = ({ photonNumber, polarIcons }: {
    photonNumber: number,
    polarIcons: any[]
}) => {
    const MEASUREMENTS_KEY = 'dpsSoloBobExchangeMeasurements';
    const VALIDATED_TIMES_KEY = 'dpsSoloBobExchangeValidatedTimes';
    const IS_VALIDATED_KEY = 'dpsSoloBobExchangeIsValidated';

    const { localize } = useLanguage();
    const {
        setStep,
        pushLines,
        setDPSTab,
    } = useDPSProgressStore();

    const {
        alicePhotons,
        alicePhases,
        bobTimeMeasurements,

        setAlicePhotons,
        setAlicePhases,
        setBobTimeMeasurements
    } = useDPSRoomStore();

    const arrivalTimesSent = bobTimeMeasurements.length > 0;
    const alicePhasesArrived = alicePhases.length > 0;

    const [showSendButton, setShowSendButton] = useState(() => {
        if (arrivalTimesSent) return false;
        return localStorage.getItem(IS_VALIDATED_KEY) === 'true';
    });
    const [showValidateButton, setShowValidateButton] = useState(() => {
        if (arrivalTimesSent) return false;
        return localStorage.getItem(IS_VALIDATED_KEY) !== 'true';
    });
    const [isValidated, setIsValidated] = useState(() => {
        if (arrivalTimesSent) return true;
        return localStorage.getItem(IS_VALIDATED_KEY) === 'true';
    });

    const [measurements, setMeasurements] = useState<(string | null)[]>(() => {
        const draft = localStorage.getItem(MEASUREMENTS_KEY);
        if (!draft) return Array(photonNumber).fill(null);
        try {
            const parsed = JSON.parse(draft);
            return Array.isArray(parsed) && parsed.length === photonNumber ? parsed : Array(photonNumber).fill(null);
        } catch {
            return Array(photonNumber).fill(null);
        }
    });
    const [validatedTimes, setValidatedTimes] = useState<{
        value: string | null;
        error: boolean;
        discarded: boolean;
    }[]>(() => {
        if (arrivalTimesSent) {
            return bobTimeMeasurements.map(value => ({ value, error: false, discarded: false }));
        }
        const draft = localStorage.getItem(VALIDATED_TIMES_KEY);
        if (!draft) return [];
        try {
            const parsed = JSON.parse(draft);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    const measured = measurements.some(time => time !== null);

    // ═══════════════════════════════════════════════════════════════════════
    // SOLO COMPUTER LOGIC: Computer Alice sends pulses
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
        if (alicePhotons.length === 0) {
            setTimeout(() => {
                const phases = generateRandomPhases(photonNumber);
                const photons = generatePulseTrains(phases);

                setAlicePhases(phases);
                setAlicePhotons(photons);

                pushLines([{ content: 'component.bobExchange.photonsArrived' }]);
                pushLines([{
                    title: 'component.game.step1',
                    content: 'component.bobExchange.Measurement'
                }]);
            }, 2000);
        }
    }, [alicePhotons.length, photonNumber, setAlicePhases, setAlicePhotons, pushLines]);

    useEffect(() => {
        if (arrivalTimesSent) {
            localStorage.removeItem(MEASUREMENTS_KEY);
            localStorage.removeItem(VALIDATED_TIMES_KEY);
            localStorage.removeItem(IS_VALIDATED_KEY);
            setIsValidated(true);
            setShowValidateButton(false);
            setShowSendButton(false);
            return;
        }

        localStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(measurements));
        localStorage.setItem(VALIDATED_TIMES_KEY, JSON.stringify(validatedTimes));
        localStorage.setItem(IS_VALIDATED_KEY, isValidated ? 'true' : 'false');
    }, [measurements, validatedTimes, isValidated, arrivalTimesSent]);


    // ═══════════════════════════════════════════════════════════════════════
    // BOB ACTIONS
    // ═══════════════════════════════════════════════════════════════════════

    const measureArrivalTime = () => {
        const newArrivalTimes = protocolMeasureArrivalTime(photonNumber);
        setMeasurements(newArrivalTimes);

        setValidatedTimes(newArrivalTimes.map(value => ({
            value,
            error: false,
            discarded: false,
        })));
    };

    const onToggleDiscardTime = (index: number) => {
        setValidatedTimes(prev =>
            prev.map((item, i) => (i === index ? { ...item, discarded: !item.discarded } : item))
        );
    };

    const onValidateTimes = () => {
        if (isValidated) return true;

        let valid = true;
        const updatedTimes = validatedTimes.map(field => ({
            ...field,
            error: (field.discarded && (field.value === 'T1' || field.value === 'T2')) ||
                (!field.discarded && (field.value === 'T0' || field.value === 'T3')),
        }));

        if (updatedTimes.some(field => field.error)) {
            toast.error(localize('component.basis.verify'));
            valid = false;
        } else {
            toast.success(localize('component.basis.correct'));
            pushLines([{ content: 'component.bobExchange.shareWithAlice' }]);

            setIsValidated(true);
            setShowValidateButton(false);
            setTimeout(() => setShowSendButton(true), 500);
        }

        setValidatedTimes(updatedTimes);
        return valid;
    };

    const onSendTimes = () => {
        if (!isValidated) return;

        const allTimes = validatedTimes.map(({ value }) => value);

        setBobTimeMeasurements(allTimes as string[]);
        localStorage.removeItem(MEASUREMENTS_KEY);
        localStorage.removeItem(VALIDATED_TIMES_KEY);
        localStorage.removeItem(IS_VALIDATED_KEY);

        toast.success(localize('component.bobExchange.timesSent'));
        pushLines([{ content: 'component.bobExchange.sentTimes' }]);

        setTimeout(() => {
            setStep(DPSGameStep.MESSAGING);
            setDPSTab('messaging');
            pushLines([
                {
                    title: 'component.game.step2',
                    content: 'component.bobExchange.secretKey',
                },
            ]);
        }, 1000);
    };

    return (
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center rounded-tl-lg">
                            <p>{localize('component.bobGame.photons')}</p>
                        </TableHead>
                        <TableHead className="text-center rounded-tr-lg">
                            <div className="flex flex-col gap-y-1 md:flex-row md:gap-x-2 justify-center items-center">
                                <p>{localize('component.bobExchange.arrivalTime')}</p>
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger
                                            disabled={!alicePhasesArrived || measured || arrivalTimesSent}
                                            onClick={measureArrivalTime}
                                            className="disabled:opacity-50 disabled:pointer-events-none rounded-md p-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <SearchCode />
                                        </TooltipTrigger>
                                        <TooltipContent className="border-secondary">
                                            <p>{localize('component.bobExchange.measure')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {Array.from({ length: photonNumber }).map((_, i) => (
                        <TableRow key={i} className="text-center border-secondary">
                            <TableCell>
                                <div className="gaussian-container">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="flex items-center justify-center"
                                    >{alicePhotons.length > 0 ? polarIcons[3] : ''}
                                    </Button>
                                </div>

                            </TableCell>
                            <TableCell>
                                <div
                                    onClick={() => onToggleDiscardTime(i)}
                                    className={cn(
                                        'select-none bg-background rounded-md h-10 border border-secondary cursor-pointer w-10 text-lg text-center m-auto pt-1.5',
                                        validatedTimes[i]?.discarded ? 'text-background bg-black-300' : '',
                                        validatedTimes[i]?.error ? 'border-red' : ''
                                    )}
                                >
                                    <p>{arrivalTimesSent ? bobTimeMeasurements[i] : (validatedTimes[i]?.value ?? '-')}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="fixed right-6 bottom-6 shadow-xl">
                {showValidateButton && (
                    <Button
                        size="lg"
                        disabled={!measured || arrivalTimesSent}
                        onClick={onValidateTimes}
                        className="text-lg font-bold"
                    >
                        {localize('component.dps.validateBtn')}
                    </Button>
                )}

                {showSendButton && (
                    <Button
                        size="lg"
                        disabled={arrivalTimesSent}
                        onClick={onSendTimes}
                        className="text-lg font-bold ml-4"
                    >
                        {localize('component.bobExchange.sendArrivalTimes')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SoloBobExchangeTab;

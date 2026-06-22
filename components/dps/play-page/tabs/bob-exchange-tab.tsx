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
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { DPSGameStep, inputPhaseField } from '@/types';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { CheckCircle2, SearchCode } from 'lucide-react';



const BobExchangeTab = ({ photonNumber, polarIcons }: {
    photonNumber: number,
    polarIcons: any[]
}) => {
    const MEASUREMENTS_KEY = 'dpsMultiBobExchangeMeasurements';
    const VALIDATED_TIMES_KEY = 'dpsMultiBobExchangeValidatedTimes';
    const IS_VALIDATED_KEY = 'dpsMultiBobExchangeIsValidated';

    const { localize } = useLanguage();
    const { sendArrivalTimes } = useSocket();

    const {
        setStep,
        pushLines,
        setDPSTab,
    } = useDPSProgressStore();

    const { alicePhotons, alicePhases, bobTimeMeasurements, setBobTimeMeasurements } = useDPSRoomStore();
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
            return Array.isArray(parsed) && parsed.length === photonNumber
                ? parsed
                : Array(photonNumber).fill(null);
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


    const measureArrivalTime = () => {
        const probabilities = [1 / 6, 2 / 6, 2 / 6, 1 / 6];
        const times = ['T0', 'T1', 'T2', 'T3'];

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

        // OPTION B REFACTOR: Keep original time values instead of converting to ''
        // This is more pedagogical - other tabs will explicitly check for T1/T2
        // OLD CODE (commented for safety):
        // const validTimes = validatedTimes.map(({ discarded, value }) => 
        //     discarded ? "" : value
        // );

        // NEW CODE: Keep original values (T0, T1, T2, T3)
        // Other components will check: time === 'T1' || time === 'T2'
        const allTimes = validatedTimes.map(({ value }) => value);

        console.log("allTimes: ", allTimes);
        setBobTimeMeasurements(allTimes as string[]);
        localStorage.removeItem(MEASUREMENTS_KEY);
        localStorage.removeItem(VALIDATED_TIMES_KEY);
        localStorage.removeItem(IS_VALIDATED_KEY);

        toast.success(localize('component.bobExchange.timesSent'));
        pushLines([{ content: 'component.bobExchange.sentTimes' }]);

        sendArrivalTimes(allTimes as string[]);

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

export default BobExchangeTab;

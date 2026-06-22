import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DPSGameStep } from '@/types';
import { useLanguage } from '@/components/providers/language-provider';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import { CheckCircle2 } from 'lucide-react';

const emptyInference = () => ({
    value: '',
    touched: false,
    error: true,
});

const isPhaseValue = (value: unknown) => value === '0' || value === 'π';

const normalizePhaseRow = (row: unknown): string[] | null => {
    if (Array.isArray(row) && row.length === 3 && row.every(isPhaseValue)) {
        return row;
    }

    if (typeof row === 'string') {
        const values = row.split('');
        return values.length === 3 && values.every(isPhaseValue) ? values : null;
    }

    return null;
};

const AliceInferenceTab = ({ polarIcons }: { polarIcons: any[] }) => {
    const { localize } = useLanguage();

    const {
        setStep,
        setDPSTab,
        pushLines,
    } = useDPSProgressStore();

    const {
        alicePhases,
        bobTimeMeasurements,
        alicePhotons,
        bobCipher,
    } = useDPSRoomStore();

    const { inferredPhases, setInferredPhases } = useDPSRoomStore();
    const phaseInferred = inferredPhases.length > 0;


    const validTimeCount = bobTimeMeasurements.filter(time => time === 'T1' || time === 'T2').length;

    // Only infer rows that have both Bob's valid time and Alice's saved phases.
    const validEntries = bobTimeMeasurements.flatMap((time, index) => {
        if (time !== 'T1' && time !== 'T2') return [];

        const phase = normalizePhaseRow(alicePhases[index]);
        if (!phase) return [];

        return [{
            phase,
            time,
            photon: alicePhotons[index] || '-',
        }];
    });
    const hasCompleteInferenceData = validEntries.length > 0 && validEntries.length === validTimeCount;


    const [inferences, setInferences] = useState(() => {
        return validEntries.map(() => emptyInference());
    });

    useEffect(() => {
        if (phaseInferred) return;

        setInferences(previous => {
            if (previous.length === validEntries.length) return previous;
            return validEntries.map((_, index) => previous[index] ?? emptyInference());
        });
    }, [phaseInferred, validEntries.length]);

    const onInferenceClick = (index: number) => {
        const updatedInferences = [...inferences];
        if (!updatedInferences[index]) return;

        const updatedInference = { ...updatedInferences[index] };

        updatedInference.value = updatedInference.value === '0' ? 'π' : '0';
        updatedInference.touched = true;
        updatedInference.error = false;

        updatedInferences[index] = updatedInference;
        setInferences(updatedInferences);
    };


    const DetectorPhase = (entries: { phase: string[]; time: string }[]) => {
        return entries.map(({ phase, time }) => {
            if (phase.length !== 3) return "Erreur";
            if (time === "T1") {
                const [B, A] = phase.slice(-2);
                return (A === "π" && B === "0") || (A === "0" && B === "π") ? "π" : "0";
            }
            if (time === "T2") {
                const [C, B] = phase.slice(0, 2);
                return (B === "π" && C === "0") || (B === "0" && C === "π") ? "π" : "0";
            }
            return "Erreur";
        });
    };

    const onValidateInference = () => {
        if (!hasCompleteInferenceData) {
            toast.error(localize('component.aliceInference.error'));
            return;
        }

        const expectedValues = DetectorPhase(validEntries);

        const validatedInferences = validEntries.map((_, index) => ({
            ...(inferences[index] ?? emptyInference()),
            error: (inferences[index]?.value ?? '') !== expectedValues[index],
        }));

        setInferences(validatedInferences);

        const allValid = !validatedInferences.some((inference) => inference.error);


        if (allValid) {
            setInferredPhases(validatedInferences.map(({ value }) => value));
            toast.success(localize('component.aliceInference.success'));


            setTimeout(() => {
                setStep(DPSGameStep.MESSAGING);
                setDPSTab('messaging');

                if (!bobCipher || bobCipher.length === 0) {
                    pushLines([{ content: 'component.messaging.alice.start' }]);
                }

            }, 1000);
        } else {
            toast.error(localize('component.aliceInference.error'));
        }
    };


    return (
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <Table className="w-full">
                <TableHeader className="bg-card top-0 sticky">
                    <TableRow className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center">
                            <p>{localize('component.aliceInference.arrivalTime')}</p>
                        </TableHead>
                        <TableHead className="text-center">
                            <p>{localize('component.aliceInference.correspondence')}</p>
                        </TableHead>
                        <TableHead className="text-center">
                            <p>{localize('component.aliceInference.phaseDifference')}</p>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {validEntries.map(({ time, photon }, index) => (
                        <TableRow key={index} className="text-center border-secondary">
                            <TableCell>{time}</TableCell>
                            <TableCell>
                                <Table>
                                    <TableHeader className="bg-card top-0 sticky">
                                        <TableRow>
                                            <TableHead className="text-xs font-bold p-1 text-center"><span></span></TableHead>
                                            <TableHead className="text-xs font-bold p-1 text-center"><span>T3</span></TableHead>
                                            <TableHead className="text-xs font-bold p-1 text-center"><span>T2</span></TableHead>
                                            <TableHead className="text-xs font-bold p-1 text-center"><span>T1</span></TableHead>
                                            <TableHead className="text-xs font-bold p-1 text-center"><span>T0</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="overflow-y-auto">
                                        <TableRow>
                                            <TableCell className="p-0.5 w-6 h-6 d-flex items-center justify-center pb-3"><span>D</span></TableCell>
                                            <TableCell className="p-0.5 w-6 h-6 d-flex items-center justify-center pb-3"> </TableCell>
                                            {Array.isArray(photon) ? (
                                                photon.map((p, i) => (
                                                    <TableCell key={`row1-${i}`} className="p-0.5 w-6 h-6 d-flex items-center justify-center pb-3">
                                                        {p === '1' ? polarIcons[1] : p === '2' ? polarIcons[2] : polarIcons[0]}
                                                    </TableCell>
                                                ))
                                            ) : (
                                                <TableCell className="p-0.5 w-6 h-6 d-flex items-center justify-center pb-3">{photon}</TableCell>
                                            )}
                                        </TableRow>

                                        <TableRow>
                                            <TableCell className="p-0.5 w-6 h-6 d-flex items-center justify-center pt-3"><span>E</span></TableCell>
                                            {Array.isArray(photon) ? (
                                                photon.map((p, i) => (
                                                    <TableCell key={`row2-${i}`} className="p-0.5 w-6 h-6 d-flex items-center justify-center pt-3">
                                                        {p === '1' ? polarIcons[1] : p === '2' ? polarIcons[2] : polarIcons[0]}
                                                    </TableCell>
                                                ))
                                            ) : (
                                                <TableCell className="p-0.5 w-6 h-6 d-flex items-center justify-center pt-3">{photon}</TableCell>
                                            )}
                                            <TableCell className="p-0.5 w-6 h-6 d-flex items-center justify-center pt-3"> </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default' +
                                        ' mx-auto',
                                        inferences[index]?.error &&
                                            inferences[index]?.touched ? "border-red" :
                                            '')}
                                    onClick={() => onInferenceClick(index)}
                                >
                                    {phaseInferred ? inferredPhases[index] ?? '' : inferences[index]?.value ?? ''}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden">
                <Button onClick={onValidateInference}
                    size={'icon'}
                    disabled={phaseInferred || !hasCompleteInferenceData}>
                    <CheckCircle2 />
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg"
                    disabled={phaseInferred || !hasCompleteInferenceData}
                    onClick={onValidateInference} className="text-lg font-bold">
                    {localize('component.dps.validateBtn')}
                </Button>
            </div>
        </div>
    );
};


export default AliceInferenceTab;

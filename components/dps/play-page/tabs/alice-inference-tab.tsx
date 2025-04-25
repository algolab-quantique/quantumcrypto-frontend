import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from '@/components/ui/table';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {DPSGameStep, inputPhaseField } from '@/types';
import { useLanguage } from '@/components/providers/language-provider';
import useDPSRoomStore from '@/store/dps/dps-room-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDPSProgressStore } from '@/store/dps/dps-progress-store';
import {CheckCircle2, Info} from 'lucide-react';



const AliceInferenceTab = ({polarIcons}: {polarIcons: any[]}) => {
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
        gameSuccess,
        bobCipher,
     } = useDPSRoomStore();

    const { inferredPhases,setInferredPhases } = useDPSRoomStore();
    const phaseInferred = inferredPhases.length > 0;


    const validIndices = bobTimeMeasurements
        .map((time, index) => time !== "" ? index : null)
        .filter(index => index !== null);

    const validEntries = validIndices.map(index => ({
        phase: Array.isArray(alicePhases[index]) ? alicePhases[index] : alicePhases[index].split(""),
        time: bobTimeMeasurements[index],
        photon: alicePhotons[index] || '-',
    }));


    const [inferences, setInferences] = useState(() => {
        return validEntries.map(() => ({
            value: '',
            touched: false,
            error: true,
        }));
    });

    const onInferenceClick = (index: number) => {
        const updatedInferences = [...inferences];
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
        const expectedValues = DetectorPhase(validEntries);

        const validatedInferences = inferences.map((inference, index) => ({
            ...inference,
            error: inference.value !== expectedValues[index],
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
                    {validEntries.map(({phase, time, photon}, index) => (
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
                                            <TableCell className="d-flex justify-content-center align-items-center"> </TableCell>
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
                                                <TableCell className="d-flex justify-content-center align-items-center">{photon}</TableCell>
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
                                            inferences[index].error && 
                                            inferences[index].touched ? "border-red" :
                                                 '')}                                
                                        onClick={() => onInferenceClick(index)}
                                >
                                    {phaseInferred? inferredPhases[index] : inferences[index].value}
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
                        disabled={phaseInferred}>
                    <CheckCircle2/>
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg"
                    disabled={phaseInferred}
                    onClick={onValidateInference} className="text-lg font-bold">
                    {localize('component.dps.validateBtn')}
                </Button>
            </div>
        </div>
    );
};


export default AliceInferenceTab;


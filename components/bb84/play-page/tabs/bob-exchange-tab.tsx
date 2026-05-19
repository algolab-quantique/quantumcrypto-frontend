import React, {useState, useEffect} from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import {BB84GameStep, inputField} from '@/types';
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
import {cn} from '@/lib/utils';
import {onBasisInputChange} from '@/lib/bb84/utils';
import {CheckCircle2, SearchCode} from 'lucide-react';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {useSocket} from '@/components/providers/socket-provider';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';
import {mimicEveIntercept} from '@/lib/bb84/solo-player';

const BobExchangeTab = ({photonNumber}: { photonNumber: number }) => {

    const {localize} = useLanguage();
    const {shareBases} = useSocket();

    const {playingSolo} = usePlayerStore();

    const {pushLines, setBb84Tab, setStep} = useBB84ProgressStore();

    const {alicePhotons, bobBases, bobMeasurements, evePresent} = useBB84RoomStore();
    const {setAlicePhotons, setBobBases, setBobMeasurements} = useBB84RoomStore();

    const shared = bobBases.length > 0;
    const measured = bobMeasurements.length > 0;

    const [basisInputs, setBasisInputs] = useState(() => {
        const inputs: inputField[] = [];
        for (let _ = 0; _ < photonNumber; _++) {
            inputs.push({
                value: '',
                touched: false,
                error: true,
            });
        }
        return inputs;
    });

    const [measurements, setMeasurements] = useState(() => {
        const inputs = [];
        for (let _ = 0; _ < photonNumber; _++) {
            inputs.push({
                value: '',
            });
        }
        return inputs;
    });

    // Fix: Reset local arrays if photonNumber changes (e.g. after refresh/restore)
    // AND hydrate from store values if Bob already completed this step.
    // IMPORTANT: Only depend on photonNumber — NOT bobBases/bobMeasurements.
    // Those change during normal gameplay (measure(), shareBases()) and would
    // wipe basisInputs because bobBases isn't stored until Share is clicked.
    useEffect(() => {
        const currentBases = useBB84RoomStore.getState().bobBases;
        const currentMeasurements = useBB84RoomStore.getState().bobMeasurements;

        if (currentBases.length > 0 && currentBases.length === photonNumber) {
            // Bob already shared bases — restore from store
            setBasisInputs(currentBases.map(v => ({
                value: v,
                touched: true,
                error: false,
            })));
        } else {
            // Check localStorage for bases saved during measure (before share)
            const savedBasisJSON = localStorage.getItem('bb84BobBasisInputs');
            if (savedBasisJSON) {
                try {
                    const parsed: string[] = JSON.parse(savedBasisJSON);
                    if (Array.isArray(parsed) && parsed.length === photonNumber) {
                        setBasisInputs(parsed.map(v => ({
                            value: v,
                            touched: true,
                            error: false,
                        })));
                    }
                } catch { /* ignore parse errors */ }
            } else {
                setBasisInputs(() => {
                    const inputs: inputField[] = [];
                    for (let _ = 0; _ < photonNumber; _++) {
                        inputs.push({ value: '', touched: false, error: true });
                    }
                    return inputs;
                });
            }
        }
        if (currentMeasurements.length > 0 && currentMeasurements.length === photonNumber) {
            // Bob already measured — restore from store
            setMeasurements(currentMeasurements.map(v => ({ value: v })));
        } else {
            setMeasurements(() => {
                const inputs = [];
                for (let _ = 0; _ < photonNumber; _++) {
                    inputs.push({ value: '' });
                }
                return inputs;
            });
        }
    }, [photonNumber]);

    const validateForm = !basisInputs.some(
        ({value, error}) => value === '' || error) && measured;

    const onShareBases = () => {
        const stringBases = basisInputs.map(({value}) => value);
        setBobBases(stringBases);
        if (playingSolo) {
            setBb84Tab('basis');
            setStep(BB84GameStep.BASIS);
            pushLines([
                {
                    content: 'component.bobExchange.basesArrived',
                },
                {
                    title: 'component.game.step3',
                    content: 'component.basis.validate',
                },
            ]);
            return;
        }
        shareBases(stringBases, 'B_BASES');
    };

    const randomize = () => {
        const basis = ['+', 'x'];
        const newBaseInputs = basisInputs.map(item => {
            const newValue =
                basis[Math.floor(Math.random() * 2)];
            return {
                ...item,
                touched: true,
                error: false,
                value: newValue,
            };
        });
        setBasisInputs(newBaseInputs);
    };

    const measure = () => {
        if (alicePhotons.length > 0 &&
            !basisInputs.some(basis => basis.value === '' || basis.error)) {
            const updatedMeasurements = [...measurements].map(
                (measurement, index) => {
                    const basis = basisInputs[index].value;
                    let newMeasurement = (Math.random() < 0.5) ? '0' : '1';
                    const photon = alicePhotons[index];
                    if (photon == 1 && basis == '+')
                        newMeasurement = '0';
                    else if (photon == 2 && basis == '+')
                        newMeasurement = '1';
                    else if (photon == 3 && basis == 'x')
                        newMeasurement = '0';
                    else if (photon == 4 && basis == 'x')
                        newMeasurement = '1';
                    measurement = {...measurement};
                    measurement.value = newMeasurement;
                    return measurement;
                });
            setMeasurements(updatedMeasurements);
            setBobMeasurements(updatedMeasurements.map(({value}) => value));
            // Persist basis inputs so they survive a refresh before sharing
            localStorage.setItem('bb84BobBasisInputs',
                JSON.stringify(basisInputs.map(({value}) => value)));
            pushLines([
                {
                    title: 'component.game.step2',
                    content: 'component.bobExchange.shareWithAlice',
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
                    <TableRow
                        className="text-sm md:text-lg border-secondary">
                        <TableHead className="text-center rounded-tl-lg">
                            <p>{localize('component.bobGame.photons')}</p>
                        </TableHead>
                        <TableHead className="text-center">
                            <div className="flex flex-col gap-y-1 py-1">
                                <div
                                    className="flex flex-col md:flex-row md:gap-x-1 justify-center">
                                    <p>{localize(
                                        'component.aliceGame.basis')}</p>
                                    <p>{localize(
                                        'component.aliceGame.basisDesc')}</p>
                                </div>
                                <Button size="sm"
                                        disabled={measured ||
                                            alicePhotons.length <= 0}
                                        className="w-fit mx-auto"
                                        onClick={() => randomize()}
                                        variant="outline">{localize(
                                    'component.aliceGame.random')}</Button>
                            </div>
                        </TableHead>
                        <TableHead className="text-center rounded-tr-lg">
                            <div
                                className="flex flex-col gap-y-1 md:flex-row md:gap-x-2 justify-center items-center">
                                <p>{localize(
                                    'component.bobExchange.measurements')}</p>
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <TooltipTrigger
                                            disabled={alicePhotons.length ==
                                                0 || measured ||
                                                basisInputs.some(
                                                    basis => basis.value ===
                                                        '')}
                                            onClick={measure}
                                            className={'disabled:opacity-50 disabled:pointer-events-none rounded-md p-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground'}>
                                            <SearchCode/>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="border-secondary">
                                            <p>{localize(
                                                'component.bobExchange.measure')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {basisInputs.map((_, i) => (
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
                                <Input
                                    disabled={measured || shared ||
                                        alicePhotons.length <=
                                        0}
                                    onChange={(event) => onBasisInputChange(
                                        event, i, basisInputs, setBasisInputs)}
                                    value={shared ? bobBases[i] :
                                        basisInputs[i].value.toString()}
                                    className={cn(
                                        'rounded-lg h-10 border' +
                                        ' border-secondary' +
                                        ' disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default' +
                                        ' w-10 text-lg text-center' +
                                        ' mx-auto', basisInputs[i].error &&
                                        basisInputs[i].touched ?
                                            'border border-red' : '')}/>
                            </TableCell>
                            <TableCell>
                                <Input
                                    disabled
                                    value={measured ? bobMeasurements[i] :
                                        measurements[i].value}
                                    className="disabled:bg-background
                                    disabled:opacity-100
                                    disabled:cursor-default
                                     w-10 text-lg
                                    text-center mx-auto"/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden shadow-xl">
                <Button size={'icon'} disabled={!validateForm || shared}
                        onClick={onShareBases}>
                    <CheckCircle2/>
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button size="lg" disabled={!validateForm || shared}
                        onClick={onShareBases}
                        className="text-lg font-bold">
                    {localize('component.bobExchange.shareBases')}
                </Button>
            </div>
        </div>
    );
};

export default BobExchangeTab;
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
import {CheckCircle2, Info} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import PolarizationTable from '@/components/bb84/play-page/polarization-table';
import {useLanguage} from '@/components/providers/language-provider';
import {BB84GameStep, inputField} from '@/types';
import {onBasisInputChange} from '@/lib/bb84/utils';
import {cn, forbiddenSymbols} from '@/lib/utils';
import {useSocket} from '@/components/providers/socket-provider';
import useBB84RoomStore from '@/store/bb84/bb84-room-store';
import {useBB84ProgressStore} from '@/store/bb84/bb84-progress-store';
import usePlayerStore from '@/store/player-store';
import {mimicEveIntercept, simulateBobExchange} from '@/lib/bb84/protocol';

const AliceExchangeTab = ({photonNumber, polarIcons}: {
    photonNumber: number;
    polarIcons: any[]
}) => {

    const {localize} = useLanguage();
    const {sendPhotons} = useSocket();
    const {pushLines, setBb84Tab, setStep} = useBB84ProgressStore();
    const {playingSolo} = usePlayerStore();
    const {
        evePresent,
        alicePhotons,
        aliceBits,
        aliceBases,
    } = useBB84RoomStore();
    const {
        setAlicePhotons,
        setAliceBits,
        setAliceBases,
        setBobMeasurements,
        setBobBases,
    } = useBB84RoomStore();
    const photonsSent = alicePhotons.length > 0;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [bitsInputs, setBitsInputs] = useState(() => {
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

    const [polarList, setPolarList] = useState(() => {
        const polars: inputField[] = [];
        for (let _ = 0; _ < photonNumber; _++) {
            polars.push({
                value: '0',
                touched: false,
                error: true,
            });
        }
        return polars;
    });

    // Fix: Reset local arrays if photonNumber changes (e.g. after refresh/restore)
    useEffect(() => {
        setBitsInputs(() => {
            const inputs: inputField[] = [];
            for (let _ = 0; _ < photonNumber; _++) {
                inputs.push({ value: '', touched: false, error: true });
            }
            return inputs;
        });
        setBasisInputs(() => {
            const inputs: inputField[] = [];
            for (let _ = 0; _ < photonNumber; _++) {
                inputs.push({ value: '', touched: false, error: true });
            }
            return inputs;
        });
        setPolarList(() => {
            const polars: inputField[] = [];
            for (let _ = 0; _ < photonNumber; _++) {
                polars.push({ value: '0', touched: false, error: true });
            }
            return polars;
        });
    }, [photonNumber]);

    const validateForm = !polarList.some(
            ({value, error}) => value === '0' || error) &&
        !bitsInputs.some(({value, error}) => value === '' || error) &&
        !basisInputs.some(({value, error}) => value === '' || error);

    const onBitInputChange = (event: React.ChangeEvent<HTMLInputElement>,
                              index: number) => {
        const inputValue = event.target.value;
        const updatedBits = [...bitsInputs];
        const updatedBit = {...updatedBits[index]};
        updatedBit.touched = true;
        if (inputValue.length === 0 || /^[01]$/.test(inputValue) &&
            inputValue.length <= 1) {
            updatedBit.value = inputValue;
        }
        updatedBit.error = updatedBit.value === '';
        updatedBits[index] = updatedBit;
        setBitsInputs(updatedBits);
        validatePolar({
            bitsInputs: updatedBits,
        }, false, index);
    };

    const onPolarClick = (index: number) => {
        const newPolarList = [...polarList];
        const newPolar = {...newPolarList[index]};
        const nextIndex = ((parseInt(newPolar.value) + 1) % 5);
        newPolar.value = (nextIndex ? nextIndex : nextIndex + 1).toString();
        newPolar.touched = true;
        newPolarList[index] = newPolar;
        validatePolar({
            polarList: newPolarList,
        }, false, index);
    };

    const onSendPhotons = () => {
        if (validateForm && !photonsSent) {
            const photons = polarList.map(({value}) => parseInt(value));
            setAlicePhotons(photons);
            setAliceBits(bitsInputs.map(({value}) => value));
            setAliceBases(basisInputs.map(({value}) => value));
            // The sender simulates the channel (ADR §13.3): if Eve is present
            // she intercepts here, before transmit, using the one shared physics
            // function that solo (as Bob) also uses. The store keeps Alice's
            // original photons; only the transmitted copy is Eve's.
            const sentPhotons = evePresent
                ? mimicEveIntercept(photons) : photons;
            if (playingSolo) {
                const [bobBases, bobMeasurements] = simulateBobExchange(
                    sentPhotons);
                setBobMeasurements(bobMeasurements);
                setBobBases(bobBases);
                pushLines([
                    {
                        content: 'component.aliceExchange.sent',
                    },
                ]);
                setTimeout(() => {
                    pushLines([
                        {
                            content: 'component.aliceExchange.basesArrived',
                        },
                        {
                            title: 'component.game.step2',
                            content: 'component.basis.validate',
                        },
                    ]);
                    setBb84Tab('basis');
                    setStep(BB84GameStep.BASIS);
                }, 2000);               
            } else {
                sendPhotons(sentPhotons);
                pushLines([
                    {
                        content: 'component.aliceExchange.sent',
                    },
                ]);
            }
        }
    };

    const validatePolar = (prevStates: {
        polarList?: inputField[],
        basisInputs?: inputField[],
        bitsInputs?: inputField[],
    }, list: boolean, index?: number) => {
        const isValid = (bit: string, basis: string,
                         polar: string) => ((bit === '0' && basis === '+' &&
                polar ===
                '1') ||
            (bit === '1' && basis === '+' && polar ===
                '2') ||
            (bit === '0' && basis === 'x' && polar ===
                '3') ||
            (bit === '1' && basis === 'x' && polar === '4'));
        let newPolarList = prevStates.polarList ?? [...polarList];
        const bits = prevStates.bitsInputs ?? bitsInputs;
        const bases = prevStates.basisInputs ?? basisInputs;
        if (list) {
            newPolarList = newPolarList.map((polar, index) => {
                const bit = bits[index].value;
                const basis = bases[index].value;
                return {
                    ...polar,
                    error: !isValid(bit, basis, polar.value),
                };
            });
            setPolarList(newPolarList);
        } else if (index !== undefined) {
            if (!newPolarList[index].touched) return;
            const newPolar = {...newPolarList[index]};
            const polar = newPolar.value;
            const bit = bits[index].value;
            const basis = bases[index].value;
            newPolar.error = !isValid(bit, basis, polar);
            newPolarList[index] = newPolar;
            setPolarList(newPolarList);
        }
    };

    const randomize = (bitsOrBase: number) => {
        const bits = ['0', '1'];
        const bases = ['+', 'x'];
        const [list, setList] = bitsOrBase ? [basisInputs, setBasisInputs] :
            [bitsInputs, setBitsInputs];
        const newList = list.map(item => {
            const newValue = bitsOrBase ?
                bases[Math.floor(Math.random() * 2)] :
                bits[Math.floor(Math.random() * 2)];
            return {
                ...item,
                value: newValue,
                error: false,
                touched: true,
            };
        });
        validatePolar({
            [bitsOrBase ? 'basisInputs' : 'bitsInputs']: newList,
        }, true);
        setList(newList);
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
                            <div className="flex flex-col gap-y-1 py-1">
                                <div
                                    className="flex flex-col md:flex-row md:gap-x-1 justify-center">
                                    <p>{localize(
                                        'component.aliceGame.bits')}</p>
                                    <p>{localize(
                                        'component.aliceGame.bitsDesc')}</p>
                                </div>
                                <Button size="sm"
                                        disabled={photonsSent}
                                        className="w-fit mx-auto"
                                        onClick={() => randomize(0)}
                                        variant="outline">{localize(
                                    'component.aliceGame.random')}</Button>
                            </div>
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
                                        disabled={photonsSent}
                                        className="w-fit mx-auto"
                                        onClick={() => randomize(1)}
                                        variant="outline">{localize(
                                    'component.aliceGame.random')}</Button>
                            </div>
                        </TableHead>
                        <TableHead className="rounded-tr-lg">
                            <div
                                className="flex gap-x-1 items-center justify-center">
                                <p>{localize(
                                    'component.aliceGame.polarization')}</p>
                                <TooltipProvider delayDuration={500}>
                                    <Tooltip open={tooltipOpen}>
                                        <TooltipTrigger
                                            onMouseLeave={() => setTooltipOpen(
                                                false)}
                                            onClick={() => setTooltipOpen(
                                                !tooltipOpen)}>
                                            <Info/>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            onMouseEnter={() => setTooltipOpen(
                                                true)}
                                            onMouseLeave={() => setTooltipOpen(
                                                false)}
                                            className="border-secondary p-0">
                                            <PolarizationTable/>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="h-full overflow-y-auto">
                    {bitsInputs.map((_, i) => (
                        <TableRow key={i}
                                  className="text-center border-secondary">
                            <TableCell>
                                <Input
                                    disabled={photonsSent}
                                    // type="number"
                                    onKeyDown={e => forbiddenSymbols.includes(
                                        e.key) && e.preventDefault()}
                                    onChange={(event) => onBitInputChange(
                                        event, i)}
                                    value={photonsSent ? aliceBits[i] :
                                        bitsInputs[i].value.toString()}
                                    className={cn('w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default',
                                        bitsInputs[i].error &&
                                        bitsInputs[i].touched ?
                                            'border border-red' : '')}/>
                            </TableCell>
                            <TableCell>
                                <Input
                                    disabled={photonsSent}
                                    onChange={(event) => onBasisInputChange(
                                        event, i, basisInputs, setBasisInputs,
                                        validatePolar)}
                                    value={photonsSent ? aliceBases[i] :
                                        basisInputs[i].value.toString()}
                                    className={cn('w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default ',
                                        basisInputs[i].error &&
                                        basisInputs[i].touched ?
                                            'border border-red' : '')}/>
                            </TableCell>
                            <TableCell>
                                <Button variant="outline"
                                        disabled={photonsSent}
                                        className={cn('disabled:opacity-100',
                                            polarList[i].error &&
                                            polarList[i].touched ?
                                                'border border-red' : '')}
                                        onClick={() => onPolarClick(i)}
                                        size="icon">
                                    {photonsSent ?
                                        polarIcons[alicePhotons[i]] :
                                        polarIcons[parseInt(
                                            polarList[i].value)]}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div
                className="fixed bottom-3 right-3 md:hidden">
                <Button onClick={onSendPhotons} size={'icon'}
                        disabled={!validateForm || photonsSent}>
                    <CheckCircle2/>
                </Button>
            </div>
            <div className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                <Button disabled={!validateForm || photonsSent} size="lg"
                        onClick={onSendPhotons}
                        className="text-lg font-bold">
                    {localize('component.aliceExchange.send')}
                </Button>
            </div>
        </div>
    );
};

export default AliceExchangeTab;
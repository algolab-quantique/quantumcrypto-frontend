'use client';

import GameRestartDialog from '@/components/bb84/play-page/game-restart-dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import useE91GameStore from '@/store/e91/e91-game-store';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import { E91GameStep, inputField } from '@/types';
import { Bell, CheckCircle2, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Info, Key, Minus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { moveToExchangeTab } from './validation-tab';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PhotonCategories from '@/components/e91/play-page/photon-types';

const BasisTab = ({photonNumber, playerRole, polarIcons}: { photonNumber: number, playerRole: string, polarIcons: any[]}) => {

    const [restartModalOpen, setRestartModalOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

    const {localize} = useLanguage();
    const {sharePreference, shareDiceValue, shareIndices} = useSocket();

    const {
        setStep,
        pushLines,
        resetProgress,
        setE91Tab,
    } = useE91ProgressStore();

    const {
        resetRoom, 
        setCompared, 
        setAlicePreference, 
        setBobPreference, 
        setAliceDiceRoll, 
        setBobDiceRoll, 
        setAliceBases, 
        setBobBases,
        setAliceBits,
        setBobBits,
        setStep2,
        setAliceValidBits,
        setBobValidBits,
        setAliceInvalidBits,
        setBobInvalidBits,
        setAliceInvalidBases,
        setBobInvalidBases,
        setTypes,
        setReroll,
        setEveReadCount,
    } = useE91RoomStore();
    const {
        validationIndices,
        step2,
        aliceBases,
        bobBases,
        aliceBits,
        bobBits,
        types,
        keyBits,
        compared,
        utilizeValidBits,
        diceRollWinner,
        alicePreference,
        bobPreference,
        aliceDiceRoll,
        bobDiceRoll,
        reroll,
        evePresent,
        conflict
    } = useE91RoomStore();

    const { setValidationBitsLength } = useE91GameStore();

    const {gameHasEve} = useE91GameStore();
    const bits = playerRole === 'A' ? aliceBits : bobBits;
    const bases = playerRole === 'A' ? aliceBases : bobBases;
    const bothBasesSet = aliceBases.length > 0 && bobBases.length > 0;
    

    const CategoryIcons = 

    [
        <Minus key="minus"/>, <Bell key="bell"/>, <Trash key="trash"/>, <Key key="key"/>
    ];
    

    const [validatedBits, setValidatedBits] = useState(() => {
        return [...bits].map(value => ({
            value,
            error: false,
        }));
    });


    const restartGame = () => {
        resetRoom();
        resetProgress();
        setRestartModalOpen(false);
    };

    useEffect(() => {
        if (!bothBasesSet) {
            if (playerRole === 'A'){
                pushLines([
                    {
                        content: 'component.e91.basis.waitingOn.bob'
                    }
                ])
            } else {
                pushLines([
                    {
                        content: 'component.e91.basis.waitingOn.alice'
                    }
                ])
            }
            
        } else if (!step2) {
            if (playerRole === 'A'){
                pushLines([
                    {
                        content: 'component.e91.basis.arrivedFrom.bob'
                    }
                ])
            } else {
                pushLines([
                    {
                        content: 'component.e91.basis.arrivedFrom.alice'
                    }
                ])
            }
            pushLines([
                {
                    title: 'component.game.step2',
                    content: 'component.e91.classifyBases'
                }
            ])  
            setStep2(true);
        }
    }, [bothBasesSet]);

    const [categoryList, setCategoryList] = useState(() => {
        const categories: inputField[] = [];
        for (let _ = 0; _ < photonNumber; _++) {
            categories.push({
                value: '0',
                touched: false,
                error: true,
            });
        }
        return categories;
    });

    const onCategoryClick = (index: number) => {
        const newCategoryList = [...categoryList];
        const newCategory = {...newCategoryList[index]};
        const nextIndex = ((parseInt(newCategory.value) + 1) % 4);
        newCategory.value = (nextIndex ? nextIndex : nextIndex + 1).toString();
        newCategory.touched = true;
        newCategoryList[index] = newCategory;
        validateCategory( newCategoryList, false, index);
    };

    const validateCategory = (categoryList: inputField[], list: boolean, index?: number) => {
        const isValid = (bobBase: string, aliceBase: string,
                         category: string) => ((
                            (bobBase === '2' && aliceBase === '2' && category === '3') || 
                            (bobBase === '3' && aliceBase === '3' && category === '3') ||
                            (bobBase === '3' && aliceBase !== '3' && category === '2') ||
                            (bobBase !== '2' && aliceBase === '2' && category === '2') ||
                            (bobBase === '2' && aliceBase === '1' && category === '1') ||
                            (bobBase === '2' && aliceBase === '3' && category === '1') ||
                            (bobBase === '4' && aliceBase === '3' && category === '1') ||
                            (bobBase === '4' && aliceBase === '1' && category === '1') 
                         ));
        let newCategoryList = categoryList ?? [...categoryList];
        if (list) {
            newCategoryList = newCategoryList.map((category, index) => {
                return {
                    ...category,
                    error: !isValid(bobBases[index], aliceBases[index], category.value),
                };
            });
            setCategoryList(newCategoryList);
        } else if (index !== undefined) {
            if (!newCategoryList[index].touched) return;
            const newCategory = {...newCategoryList[index]};
            const category = newCategory.value;
            newCategory.error = !isValid(bobBases[index], aliceBases[index], category);
            newCategoryList[index] = newCategory;
            setCategoryList(newCategoryList);
        }
    };

    const validateForm = !categoryList.some(
        ({value, error}) => value === '0' || error);

    const onValidate = () => {
        if (validateForm) { 
            const validBitIndices = categoryList
                .map((field, index) => (field.value === '3' ? index : -1))
                .filter(index => index !== -1); 
    
            const invalidBitIndices = categoryList
                .map((field, index) => (field.value === '1' ? index : -1))
                .filter(index => index !== -1); 
    
            
            setAliceValidBits(validBitIndices.map(i => aliceBits[i]));
            setBobValidBits(validBitIndices.map(i => bobBits[i]));
            setAliceInvalidBits(invalidBitIndices.map(i => aliceBits[i]));
            setAliceInvalidBases(invalidBitIndices.map(i => aliceBases[i]));
            setBobInvalidBits(invalidBitIndices.map(i => bobBits[i]));
            setBobInvalidBases(invalidBitIndices.map(i => bobBases[i]));

            let typeList: string[] = []           
            categoryList.map((field) => (typeList.push(field.value)));
            setTypes(typeList);
            
            if (validBitIndices.length < 2) {
                pushLines([{content: 'component.e91.shortKey.restart'}]);
                setRestartModalOpen(true);
                return;
            }
            if (evePresent) {
                let eveReadAmount = 0;
                aliceBases.forEach((base, index) => {
                    if (base === '2' && bobBases[index] === '2') {
                        eveReadAmount += 1;
                    }
                });
                setEveReadCount(eveReadAmount);
            }
            pushLines([
                {
                    title: 'component.game.step3',
                    content: 'component.e91.validation.invalid.start'
                }
            ])
            setStep(E91GameStep.VALIDATION);
            setE91Tab('validation');  
        }      
    };

    const onMoveToMessaging = () => {
        const validBitIndices = categoryList
                .map((field, index) => (field.value === '3' ? index : -1))
                .filter(index => index !== -1); 
    
            const invalidBitIndices = categoryList
                .map((field, index) => (field.value === '1' ? index : -1))
                .filter(index => index !== -1); 
    
            
        setAliceValidBits(validBitIndices.map(i => aliceBits[i]));
        setBobValidBits(validBitIndices.map(i => bobBits[i]));
        moveToExchangeTab();
    }
    

    return (
        <>
            <GameRestartDialog restartModalOpen={restartModalOpen}
                               title={localize(
                                   'component.basisTab.alertTitle')}
                               description={localize(
                                   'component.basisTab.alertDescription')}
                               onConfirm={restartGame}/>
            <div className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
                <Table className="w-full">
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow
                            className="text-sm md:text-lg border-secondary">
                            <TableHead className="text-center rounded-tl-lg">
                                <p className="text-wrap">{playerRole == 'A' ?
                                    localize('component.basis.yourBases') :
                                    localize('component.basis.aliceBases')}</p>
                            </TableHead>
                            <TableHead className="text-center">
                                <p className="text-wrap">{playerRole == 'B' ?
                                    localize('component.basis.yourBases') :
                                    localize('component.basis.bobBases')}</p>
                            </TableHead>
                            <TableHead className="text-center rounded-tr-lg">
                                <p>Bits</p>
                            </TableHead>
                            <TableHead className="text-center rounded-tr-lg">
                                <div className="flex gap-x-1 items-center justify-center">
                                    <p>Type</p>
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
                                                className="border-secondary p-0 origin-top-right table-head"
                                                align='end'>
                                                <PhotonCategories/>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bases.map((_, i) => (
                            <TableRow key={i}
                                      className="text-center border-secondary">
                                <TableCell>
                                    <Button variant="outline"
                                        disabled={true}
                                        className={cn('disabled:opacity-100')}
                                        size="icon">
                                        {polarIcons[parseInt(aliceBases[i])]}                 
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline"
                                        disabled={true}
                                        className={cn('disabled:opacity-100')}
                                        size="icon">        
                                        {polarIcons[parseInt(bobBases[i])]}                   
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <div
                                         className={cn(
                                             'select-none bg-background' +
                                             ' rounded-md h-10 border' +
                                             ' border-secondary' +
                                             ' w-10 text-lg text-center' +
                                             ' m-auto align-center pt-1.5 ',
                                             validatedBits[i].error ?
                                                 'border-red' : '')}>
                                        <p>{validatedBits[i].value}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline"
                                            className={cn('disabled:opacity-100',
                                                categoryList[i].error &&
                                                categoryList[i].touched ?
                                                    'border border-red' : '')}
                                                disabled={!bothBasesSet || types.length > 0}
                                            onClick={() => onCategoryClick(i)}
                                            size="icon">
                                        {types.length > 0 ? CategoryIcons[parseInt(types[i])] : CategoryIcons[parseInt(categoryList[i].value)]}
                                    </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {gameHasEve && (
                    <div>
                        <div
                            className="hidden md:block fixed right-6 bottom-6 shadow-xl">
                            <Button size="lg"
                                    disabled={!validateForm}
                                    onClick={onValidate}
                                    className="text-lg font-bold">
                                {localize('component.basis.validateBtn')}
                            </Button>
                        </div>
                        <div
                            className="fixed bottom-3 right-3 md:hidden">
                            <Button onClick={onValidate} size={'icon'}
                                    disabled={!validateForm}>
                                <CheckCircle2/>
                            </Button>
                        </div>
                    </div>
                    
                )}
                {!gameHasEve && (
                    <div
                        className="md:block fixed right-6 bottom-6 shadow-xl">
                        <Button size="lg"
                                onClick={onMoveToMessaging}
                                disabled={!validateForm}
                                className="text-lg font-bold">
                            {localize('component.e91.moveToMessaging')}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default BasisTab;

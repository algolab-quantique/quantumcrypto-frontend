'use client';

/**
 * Solo CHSH Tab
 * 
 * This is a copy of CHSH-tab.tsx adapted for solo mode.
 * The only differences are:
 * 1. No useSocket() - no WebSocket calls (shareDecision, saveScore, restartGameWithoutEve)
 * 2. onSecure/onUnsecure directly navigate or set state
 * 
 * UI is IDENTICAL to multiplayer CHSH-tab.tsx
 */

import GameRestartDialog from '@/components/bb84/play-page/game-restart-dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import usePlayerStore from '@/store/player-store';
import { E91GameStep, Line } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { clearE91LocalStorage } from '@/lib/e91/utils';

// Helper function to move to messaging tab
const moveToExchangeTab = (playerRole: string, pushLines: (lines: Line[]) => void, setE91Tab: (tab: string) => void, setStep: (step: E91GameStep) => void) => {
    if (playerRole === 'B') {
        pushLines([{ 
            title: 'component.game.step4',
            content: 'component.messaging.bob.start' 
        }]);
    } else {
        pushLines([{ 
            title: 'component.game.step4', 
            content: 'component.messaging.alice.last' 
        }]);
    }
    setE91Tab('messaging');
    setStep(E91GameStep.MESSAGING);
};

const DraggableButton = ({ index, value, setIsDragging}: { index: number, value: any, setIsDragging: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'BUTTON',
        item: { index, value },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    useEffect(() => {
        setIsDragging(isDragging);  
    }, [isDragging, setIsDragging]);

    return (
        <Button
            ref={(node) => {
                if (node) drag(node);
              }}
            variant="outline"
            className={`w-10 h-10 mx-1 bg-gray-600 rounded-full text-lg text-center cursor-move ${isDragging ? "opacity-50" : ""}`}
            size="icon"
        >
            {value}
        </Button>
    );
};


const SoloCHSHTab = ({playerRole, polarIcons}: { playerRole: string, polarIcons: any[]}) => {
    const [sValues, setSValues] = useState<number[]>([]);
    const [restartModalOpen, setRestartModalOpen] = useState(false);
    const [sValueStarted, setSvalueStarted] = useState(false);

    const [espAB, setEspAB] = useState<number[]>([]);  
    const [espApB, setEspApB] = useState<number[]>([]); 
    const [espApBp, setEspApBp] = useState<number[]>([]); 
    const [espABp, setEspABp] = useState<number[]>([]); 

    const [isDragging, setIsDragging] = useState(false);

    const [isPopupVisible, setPopupVisible] = useState(false);

    const [buttonsActivated, setButtonsActivated] = useState(true);
    const formatNumber = (value: number) => (value % 1 === 0 ? value : value.toFixed(2));

    const GraphPopup = dynamic(() => import('../graphPopup'), { ssr: false });

    const onShowGraph = () => {
      setPopupVisible(true);
    };
  
    const closePopup = () => {
      setPopupVisible(false);
    };

    const calculateAverage = (arr: number[]) => {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((acc, value) => acc + value, 0);
        return sum / arr.length; 
    };
    const sValue = calculateAverage(espAB) + calculateAverage(espApB) + calculateAverage(espApBp) - calculateAverage(espABp);

    const [buttonState, setButtonState] = useState<{ [key: number]: { color: string, value: string } }>({});

    const {localize} = useLanguage();
    // NO useSocket() - solo mode

    const {
        aliceInvalidBits,
        bobInvalidBits,
        aliceInvalidBases,
        bobInvalidBases,
        evePresent,
        eveSpotted,
    } = useE91RoomStore();

    const {
        resetRoom,
        setGameSuccess,
        setEveSpotted,
        setValidated
    } = useE91RoomStore();

    const {
        pushLines,
        resetProgress,
        setE91Tab,
        setStep,
    } = useE91ProgressStore();

    useEffect(() => {
        if (sValueStarted) {
            const sValue = calculateAverage(espAB) 
                        + calculateAverage(espApB) 
                        + calculateAverage(espApBp) 
                        - calculateAverage(espABp);
        
            setSValues((prevSValues) => [...prevSValues, Math.abs(sValue)]);
        }
      }, [espAB, espApB, espApBp, espABp]);

    const DropZone = ({ onDrop, backgroundColor, label }: { onDrop: (index: number, value: number) => void, backgroundColor: string, label: string }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: 'BUTTON',
            drop: (item: { index: number, value: string }) => onDrop(item.index, item.value === '+1' ? 1 : -1),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));
    
        return (
            <div
            ref={(node) => {
                if (node) drop(node);
              }}
              style={{
                backgroundColor: isOver ? '#d1d5db' : backgroundColor, 
                border: '2px solid var(--border-color)',
              }}
              className="flex flex-col justify-center items-center w-full h-full rounded-lg shadow-lg p-2 transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
                <span className="text-gray-700 font-medium text-xl">{label}</span>
              </div>
              <span className="mt-2 text-sm font-semibold text-gray-800">{localize('component.e91.dropHere')}</span>
            </div>
          );
        };

    /**
     * SOLO MODE: No socket calls, direct state updates
     */
    const onSecure = () => {
        moveToExchangeTab(playerRole, pushLines, setE91Tab, setStep);
    };

    /**
     * SOLO MODE: No socket calls, direct state updates
     */
    const onUnsecure = () => {
        if (evePresent) {
            pushLines([
                {
                    title: 'component.e91.restart.unsecured',
                    content: 'component.e91.restart.unsecured.description'
                }
            ]);
            setButtonsActivated(false);
            setEveSpotted(true);
            setValidated(true);
        } else {
            pushLines([
                {
                    title: 'component.e91.gameLoss.title',
                    content: 'component.e91.gameLoss'
                }
            ]);
            setButtonsActivated(false);
            // In solo mode, we just mark game as failed - no server score saving
            setGameSuccess(true);
            clearE91LocalStorage();
        }
    };

    /**
     * SOLO MODE: Restart game without Eve (no socket call)
     */
    const restartGameWithoutEve = () => {
        resetRoom();
        resetProgress();
        setRestartModalOpen(false);
    };

    const handleDrop = (zone: string, index: number, value: number) => {
        let correctValue = aliceInvalidBits[index] === bobInvalidBits[index] ? 1 : -1;
        setIsDragging(false);  
        setSvalueStarted(true);
        switch (zone) {
            case 'AB':
                if ((aliceInvalidBases[index] === '1' && bobInvalidBases[index] === '2') && (value === correctValue)) {
                    setEspAB((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'bg-green-800', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
            case 'ApB':
                if ((aliceInvalidBases[index] === '3' && bobInvalidBases[index] === '2') && (value === correctValue)) {
                    setEspApB((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'bg-green-300', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
            case 'ApBp':
                if ((aliceInvalidBases[index] === '3' && bobInvalidBases[index] === '4') && (value === correctValue)) {
                    setEspApBp((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'bg-blue-800', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
            case 'ABp':
                if ((aliceInvalidBases[index] === '1' && bobInvalidBases[index] === '4') && (value === correctValue)) {
                    setEspABp((prev) => [...prev, value]);
                    setButtonState((prev) => ({
                        ...prev,
                        [index]: { color: 'bg-blue-300', value: value === 1 ? '+1' : '-1' },
                    }));
                }
                break;
        }
    };
    

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER - Identical to multiplayer CHSH-tab.tsx
    // ═══════════════════════════════════════════════════════════════════════

    return (
        <>
        <GameRestartDialog restartModalOpen={restartModalOpen}
                               title={localize('component.e91.restart.unsecured')}
                               description={localize('component.e91.restart.unsecured.description')}
                               onConfirm={restartGameWithoutEve}/>
        <div className="block border text-card-foreground border-secondary bg-card shadow-lg rounded-lg">
            <DndProvider backend={HTML5Backend}>
                <div className="chsh-table" style={{overflow: isDragging ? "hidden" : "auto"}}>
                    <Table className="w-full">
                        <TableHeader className="bg-card top-0 sticky">
                            <TableRow className="text-sm md:text-md border-secondary">
                                <TableHead colSpan={2} className="text-center rounded-tl-lg">
                                    Alice
                                </TableHead>
                                <TableHead colSpan={2} className="text-center rounded-tr-lg">
                                    Bob
                                </TableHead>
                                <TableHead colSpan={2} className="text-center rounded-tr-lg">
                                </TableHead>
                            </TableRow>
                            <TableRow className="text-sm md:text-md border-secondary">
                                <TableHead className="text-center">Base</TableHead>
                                <TableHead className="text-center">Photon</TableHead>
                                <TableHead className="text-center">Base</TableHead>
                                <TableHead className="text-center">Photon</TableHead>
                                <TableHead className="text-center">{localize('component.e91.text.values')}</TableHead>
                            </TableRow>
                        </TableHeader>               
                        <TableBody>
                            {aliceInvalidBases.map((_, index) => (
                                <TableRow key={index} className={`text-center border-secondary`}>
                                    <TableCell>           
                                        <Button variant="outline"
                                            disabled={true}
                                            className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"
                                            size="icon">
                                            {polarIcons[parseInt(aliceInvalidBases[index])]}                 
                                        </Button>                          
                                    </TableCell>
                                    <TableCell>
                                        <Input disabled value={aliceInvalidBits[index]} className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"/>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline"
                                            disabled={true}
                                            className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"
                                            size="icon">
                                            {polarIcons[parseInt(bobInvalidBases[index])]}                 
                                        </Button> 
                                    </TableCell>
                                    <TableCell>
                                        <Input disabled value={bobInvalidBits[index]} className="w-10 text-lg text-center mx-auto disabled:opacity-100 disabled:bg-background disabled:cursor-default"/>
                                    </TableCell>
                                    <TableCell className="flex gap-1 justify-center">
                                        {buttonState[index] ? (
                                            <Button
                                                variant="outline"
                                                className={clsx(`w-10 h-10 mx-1 rounded-full text-lg text-center`, `${buttonState[index].color}`)}
                                                size="icon"
                                            >
                                                {buttonState[index].value}
                                            </Button>
                                        ) : (
                                            <>
                                                 <DraggableButton index={index} value="+1" setIsDragging={setIsDragging}/>
                                                 <DraggableButton index={index} value="-1" setIsDragging={setIsDragging}/>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>               
                    </Table>
                </div>
                <div className="flex justify-center p-4">                          
                    <Button onClick={onShowGraph} variant="secondary">{localize('component.e91.button.showGraph')}</Button>
                    <GraphPopup isVisible={isPopupVisible} onClose={closePopup} sValues={sValues} photonNumber={aliceInvalidBases.length}/>
                </div>
                <div className="flex justify-end p-2 gap-2">
                    <Button
                        onClick={onSecure}
                        variant="outline"
                        className="bg-green-500 bg-opacity-80 text-gray-800 hover:bg-green-800 disabled:opacity-50"
                        disabled={!buttonsActivated}
                    >
                        {localize('component.e91.button.secure')}
                    </Button>
                    <Button
                        onClick={onUnsecure}
                        variant="outline"
                        className="bg-rose-500 bg-opacity-80 text-gray-800 hover:bg-rose-800 disabled:opacity-50"
                        disabled={!buttonsActivated}
                    >
                        {localize('component.e91.button.unsecure')}
                    </Button>
                </div>
                <div className="flex justify-around items-center h-40 w-full border border-secondary rounded-lg mt-4 gap-4">
                    <DropZone 
                        onDrop={(index, value) => handleDrop('AB', index, value)} 
                        backgroundColor="#2C6E49" 
                        label="a|b" 
                    />
                    <DropZone 
                        onDrop={(index, value) => handleDrop('ApB', index, value)} 
                        backgroundColor="#88D4AB" 
                        label="a'|b" 
                    />
                    <DropZone 
                        onDrop={(index, value) => handleDrop('ABp', index, value)} 
                        backgroundColor="#80d1ef" 
                        label="a|b'" 
                    />
                    <DropZone 
                        onDrop={(index, value) => handleDrop('ApBp', index, value)} 
                        backgroundColor="#0a629e" 
                        label="a'|b'" 
                    />
                </div>
            </DndProvider>
            <div className="p-6 bg-background border-t border-secondary rounded-b-lg text-center mt-4">
                <Table className="w-full table-auto border-collapse border border-secondary">
                    <TableHeader>
                        <TableRow className="bg-secondary text-white text-lg">
                            <TableHead className="border border-secondary text-center">E(a, b)</TableHead>
                            <TableHead className="border border-secondary text-center">E(a&apos;, b)</TableHead>
                            <TableHead className="border border-secondary text-center">E(a, b&apos;)</TableHead>
                            <TableHead className="border border-secondary text-center">E(a&apos;, b&apos;)</TableHead>
                            <TableHead className="border border-secondary text-center">S</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="text-xl">
                            <TableCell className="border border-secondary p-2 text-3xl" style={{ color: '#2C6E49' }}>
                                {formatNumber(calculateAverage(espAB))}
                            </TableCell>
                            <TableCell className="border border-secondary p-2 text-3xl" style={{ color: '#88D4AB' }}>
                                {formatNumber(calculateAverage(espApB))}
                            </TableCell>
                            <TableCell className="border border-secondary p-2 text-3xl" style={{ color: '#80d1ef' }}>
                                {formatNumber(calculateAverage(espABp))}
                            </TableCell>
                            <TableCell className="border border-secondary p-2 text-3xl" style={{ color: '#0a629e' }}>
                                {formatNumber(calculateAverage(espApBp))}
                            </TableCell>
                            <TableCell className="border border-secondary p-2 text-3xl font-bold">
                                {formatNumber(sValue)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
        </>
    );
};

export default SoloCHSHTab;

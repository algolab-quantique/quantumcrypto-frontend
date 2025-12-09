'use client';

/**
 * Solo Measurement Tab
 * 
 * This is a copy of measurement-tab.tsx adapted for solo mode.
 * The only differences are:
 * 1. No useSocket() - no WebSocket calls
 * 2. onMeasurement() uses local simulation instead of server
 * 3. onShare() directly navigates to next tab (no partner to share with)
 * 
 * UI is IDENTICAL to multiplayer measurement-tab.tsx
 */

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { cn, forbiddenSymbols } from '@/lib/utils';
import { useE91ProgressStore } from '@/store/e91/e91-progress-store';
import useE91RoomStore from '@/store/e91/e91-room-store';
import useE91GameStore from '@/store/e91/e91-game-store';
import { E91GameStep, inputField } from '@/types';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
// Solo simulation functions
import {
    generateBases,
    generateRandomBits,
    generateEntangledBits,
    eveGenerateBits,
} from '@/lib/e91/solo-player';

const SoloMeasurementTab = ({photonNumber, polarIcons, playerRole}: {
    photonNumber: number,
    polarIcons: any[],
    playerRole: string
}) => {

    const {localize} = useLanguage();
    // NO useSocket() - solo mode uses local simulation
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [isClient, setIsClient] = useState(false);
    const {pushLines, setStep, setE91Tab} = useE91ProgressStore();
    const { gameHasEve } = useE91GameStore();
    const {
        evePresent,
        photonsRevealed,
        photons,
        aliceBases,
        bobBases,
        aliceBits,
        bobBits,
        basesShared,
    } = useE91RoomStore();
    const {
        setPhotons, 
        setAliceBases, 
        setBobBases, 
        setAliceBits,
        setBobBits,
        setPhotonsRevealed, 
        setBasesShared,
        setEvePresent,
    } = useE91RoomStore();
    const bits = playerRole === 'A' ? aliceBits : bobBits;
    const bases = playerRole === 'A' ? aliceBases : bobBases;
    const setBases = playerRole === 'A' ? setAliceBases : setBobBases;
    const setBits = playerRole === 'A' ? setAliceBits : setBobBits;
    const photonsMeasured = bits.length > 0;
    const availableBases = playerRole === 'A' ? ['1', '2', '3'] : ['2', '3', '4'];
    const [revealedBits, setRevealedBits] = useState<string[]>(Array(photonNumber).fill('*'));
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [basisInputs, setBasisInputs] = useState(() => {
        const inputs: inputField[] = [];
        for (let _ = 0; _ < photonNumber; _++) {
            inputs.push({
                value: '0',
                touched: false,
                error: true,
            });
        }
        return inputs;
    });

    const onPolarClick = (index: number) => {
        const newPolarList = [...basisInputs];
        const currentIconValue = newPolarList[index].value;
        const currentIconIndex = availableBases.indexOf(currentIconValue);

        const nextIconIndex = currentIconIndex === -1 ? 0 : (currentIconIndex + 1) % availableBases.length;

        newPolarList[index] = {
            ...newPolarList[index],
            value: availableBases[nextIconIndex], 
            error: false,
            touched: true,
        };

        setBasisInputs(newPolarList);
    };

    /**
     * SOLO MODE: Local simulation instead of measurePhotons() WebSocket call
     * 
     * When player clicks "Measure":
     * 1. Player's bases = what they selected
     * 2. Generate player's bits and partner's data locally
     * 3. Apply Eve interception if gameHasEve is true
     */
    const onMeasurement = () => {
        const playerBases = basisInputs.map(({ value }) => value);
        let playerBits: string[];
        let partnerBases: string[];
        let partnerBits: string[];

        if (playerRole === 'A') {
            // Alice measures first → gets random bits
            playerBits = generateRandomBits(photonNumber);
            partnerBases = generateBases(photonNumber, false); // Bob's bases

            if (gameHasEve && evePresent) {
                // Eve intercepts → Bob gets uncorrelated bits
                partnerBits = eveGenerateBits(partnerBases);
            } else {
                // No Eve → Bob gets quantum-correlated bits
                partnerBits = generateEntangledBits(playerBits, playerBases, partnerBases);
            }

            // Store in state
            setAliceBases(playerBases);
            setAliceBits(playerBits);
            setBobBases(partnerBases);
            setBobBits(partnerBits);
        } else {
            // Bob waits for Alice → Alice's data generated now
            const aliceBasesGen = generateBases(photonNumber, true);
            const aliceBitsGen = generateRandomBits(photonNumber);

            partnerBases = aliceBasesGen;

            if (gameHasEve && evePresent) {
                // Eve intercepts → Bob gets uncorrelated bits
                playerBits = eveGenerateBits(playerBases);
            } else {
                // No Eve → Bob gets quantum-correlated bits
                playerBits = generateEntangledBits(aliceBitsGen, aliceBasesGen, playerBases);
            }
            partnerBits = aliceBitsGen;

            // Store in state
            setAliceBases(aliceBasesGen);
            setAliceBits(aliceBitsGen);
            setBobBases(playerBases);
            setBobBits(playerBits);
        }

        // Push progress message (same as multiplayer)
        setTimeout(() => {
            if (playerRole === 'A') {
                pushLines([
                    {content: 'component.e91.shareBases.alice'}
                ]);
            } else if (playerRole === 'B') {
                pushLines([
                    {content: 'component.e91.shareBases.bob'}
                ]);
            }
        }, 2000);
    };

    /**
     * SOLO MODE: Direct navigation instead of shareBases/shareBits WebSocket calls
     * In solo mode, there's no partner to share with - just move to next tab
     * 
     * MESSAGES ADDED (matching multiplayer flow):
     * - Partner completed measurements (simulated)
     * - Partner's bases have arrived
     */
    const onShare = () => {
        // Add partner completed message (simulating what socket would send)
        if (playerRole === 'A') {
            pushLines([
                { content: 'component.e91.bobMeasured' },
                { content: 'component.e91.basis.arrivedFrom.bob' }
            ]);
        } else {
            pushLines([
                { content: 'component.e91.aliceMeasured' },
                { content: 'component.e91.basis.arrivedFrom.alice' }
            ]);
        }
        
        // No WebSocket calls needed - data is already in store
        setBasesShared(true);
        setStep(E91GameStep.BASIS);
        setE91Tab('basis');
    };

    const validateForm = 
        !basisInputs.some(({value, error}) => value === '0' || error);

    const randomize = (base: number) => {
        const [list, setList] = [basisInputs, setBasisInputs];
        const newList = list.map(item => {
            const newValue = availableBases[Math.floor(Math.random() * availableBases.length)];
            return {
                ...item,
                value: newValue,
                error: false,
                touched: true,
            };
        });
        setList(newList);
    };

    const revealPhotons = () => {
        const bitsToReveal = playerRole === 'A' ? aliceBits : bobBits;
        bitsToReveal.forEach((bit, i) => {
            setTimeout(() => {
                setRevealedBits(prev => {
                    const newRevealedBits = [...prev];
                    newRevealedBits[i] = bit; 
                    return newRevealedBits;
                });
                setHighlightedIndex(i);
            }, i * (2000/photonNumber));  
        });
        setTimeout(() => {
            setHighlightedIndex(null);
            setPhotonsRevealed(true); 
        }, bitsToReveal.length * (2000 / photonNumber));
    };
    
    useEffect(() => {
        if (photonsMeasured && !photonsRevealed) {
            revealPhotons(); 
        }
    }, [photonsMeasured]);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER - Identical to multiplayer measurement-tab.tsx
    // ═══════════════════════════════════════════════════════════════════════

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
                                        'component.e91.photons')}</p>
                                </div>
                            </div>
                        </TableHead>
                        <TableHead className="text-center">
                            <div className="flex flex-col gap-y-1 py-1">
                                <div
                                    className="flex flex-col md:flex-row md:gap-x-2 justify-center">
                                    <p>{localize(
                                        'component.e91.basis')}</p>
                                    <p>{localize(
                                        'component.e91.basisDesc')}</p>
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
                                                side='bottom'
                                                className="border-secondary p-0">
                                                {isClient ? (
                                                    <Image 
                                                        src={isDark ? "/images/e91_bases_black.png" : "/images/e91_bases_white.png"}
                                                        alt="Polarization bases" 
                                                        width={400}
                                                        height={300}
                                                        className="w-52 h-52 xl:w-64 xl:h-64 rounded" 
                                                    />
                                                ) : (
                                                    <Image 
                                                        src="/images/e91_bases_white.png"
                                                        alt="Polarization bases" 
                                                        width={400}
                                                        height={300}
                                                        className="w-52 h-52 xl:w-64 xl:h-64 rounded" 
                                                    />
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Button size="sm"
                                        disabled={photonsMeasured}
                                        className="w-fit mx-auto"
                                        onClick={() => randomize(1)}
                                        variant="outline">{localize(
                                    'component.e91.random')}</Button>
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
                                    disabled={true}
                                    style={{
                                        borderColor: highlightedIndex === i ? 'rgba(0, 255, 0, 0.6)' : undefined,   
                                        transition: 'border-color 0.5s easeOut'                             
                                    }}
                                    onKeyDown={e => forbiddenSymbols.includes(
                                        e.key) && e.preventDefault()}
                                    value={!photonsRevealed ? revealedBits[i] || '*' : bits[i]} 
                                    className={cn('w-10 text-lg text-center' +
                                        ' mx-auto disabled:opacity-100' +
                                        ' disabled:bg-background' +
                                        ' disabled:cursor-default',
                                        )}/>
                            </TableCell>
                            <TableCell>
                                <Button variant="outline"
                                        disabled={photonsMeasured}
                                        className={cn('disabled:opacity-100')}
                                        onClick={() => onPolarClick(i)}
                                        size="icon">
                                    {photonsMeasured ?
                                        polarIcons[parseInt(bases[i])] :
                                        polarIcons[parseInt(
                                            basisInputs[i].value)]}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!basesShared && (
                <div className="md:block fixed right-6 bottom-6 shadow-xl">
                    <Button disabled={!validateForm || photonsMeasured} size="lg"
                            onClick={onMeasurement}
                            className="text-lg font-bold">
                        {localize('component.e91.measure')}
                    </Button>
                </div>
            )}           
            {photonsRevealed && (
                <div className="md:block fixed right-6 bottom-6 shadow-xl">
                    <Button size="lg" className="text-lg font-bold"
                            onClick={onShare}
                            disabled={basesShared}>
                        {localize('component.e91.shareBases')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SoloMeasurementTab;

/**
 * BB84 Solo Results Table (Task 51 phase 2)
 *
 * Displays the results of a completed BB84 solo game, read from local state —
 * mirrors E91's solo results table for a consistent experience, plus the Eve
 * REVEAL: the pedagogical heart of probabilistic Eve (ADR §12). A student who
 * validated a compromised key learns here that Eve fooled them.
 */

'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {useLanguage} from '@/components/providers/language-provider';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {Home, RotateCcw} from 'lucide-react';
import type {SoloEveRecord} from '@/lib/bb84/solo-round';
import {classifySoloEnding} from '@/lib/bb84/eve-story';

const SoloResultsTable = ({
    playerName,
    playerRole,
    eveRecord,
    elapsedTime,
    keyLength,
}: {
    playerName: string,
    playerRole: string,
    eveRecord: SoloEveRecord | null,
    elapsedTime: number,
    keyLength: number,
}) => {
    const {localize} = useLanguage();
    const router = useRouter();

    const partnerName = playerRole === 'A' ? 'Bob (Ordinateur)' : 'Alice (Ordinateur)';
    const roomDisplay = playerRole === 'A'
        ? `${playerName} - ${partnerName}`
        : `${partnerName} - ${playerName}`;

    // Same simple score formula as E91's solo results.
    const score = Math.max(0, Math.round((keyLength * 10) - (elapsedTime / 10)));

    const eveDrawn = eveRecord?.drawn === true;
    const eveDetected = eveRecord?.detected === true;
    // The ending classification is pure and fully unit-tested (eve-story.ts)
    // — several endings cannot be forced manually (the MISSED one needs Eve
    // present AND lucky matching validation bits).
    const ending = classifySoloEnding(eveRecord);
    const keyCompromised = ending === 'missed';
    const revealKey = {
        absent: 'component.bb84.results.revealAbsent',
        caught: 'component.bb84.results.revealCaught',
        missed: 'component.bb84.results.revealMissed',
    }[ending];

    // Navigation Invariant: plain navigation, no clearing — completed data is
    // destroyed only by the next startFresh (new game / replay) or quit.
    const handleReplay = () => {
        router.push('/bb84');
    };

    const handleHomeMenu = () => {
        router.push('/');
    };

    return (
        <div className="mt-4 space-y-6">
            <div
                className="block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
                <Table>
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow className="text-sm md:text-lg">
                            {/* Task 56 polish: same column anatomy and order
                                as the multiplayer table (Joueurs, Itération,
                                présente, détectée, Verdict, Temps) + the solo
                                extras (Longueur de la clé, Score). */}
                            <TableHead>{localize('component.bb84.results.room')}</TableHead>
                            <TableHead>{localize('component.results.iteration')}</TableHead>
                            <TableHead>{localize('component.bb84.results.evePresent')}</TableHead>
                            <TableHead>{localize('component.bb84.results.eveDetected')}</TableHead>
                            <TableHead>{localize('component.bb84.results.verdict')}</TableHead>
                            <TableHead>{localize('component.bb84.results.time')}</TableHead>
                            <TableHead>{localize('component.bb84.results.keyLength')}</TableHead>
                            <TableHead>{localize('component.bb84.results.score')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{roomDisplay}</TableCell>
                            <TableCell>{eveRecord?.rounds ?? 1}</TableCell>
                            <TableCell>
                                {eveDrawn
                                    ? localize('component.bb84.results.yes')
                                    : localize('component.bb84.results.no')}
                            </TableCell>
                            <TableCell>
                                {eveDetected
                                    ? localize('component.bb84.results.yes')
                                    : localize('component.bb84.results.no')}
                            </TableCell>
                            <TableCell className={keyCompromised
                                ? 'text-red-500 font-bold'
                                : 'text-green-500 font-bold'}>
                                {localize(keyCompromised
                                    ? 'component.bb84.results.keyCompromised'
                                    : 'component.bb84.results.keySecure')}
                            </TableCell>
                            <TableCell>{`${Math.ceil(elapsedTime)} s`}</TableCell>
                            <TableCell>{keyLength}</TableCell>
                            <TableCell>{score}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* The reveal — the pedagogical point of probabilistic Eve.
                One reveal-led phrase per ending (polish after Task 56):
                celebration integrated where it is EARNED — the missed ending
                stays sobering instead of congratulating a compromised key. */}
            <div className="text-center space-y-1">
                <p className={`text-xl font-bold ${
                    keyCompromised ? 'text-red-500' : 'text-green-500'}`}>
                    {localize(revealKey)}
                </p>
                {eveRecord?.enabled && (
                    <p className="text-sm text-muted-foreground">
                        {localize('component.createGame.evePercentage.label')}
                        {' : '}{eveRecord.percentage}
                    </p>
                )}
            </div>

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReplay}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {localize('component.bb84.results.replay')}
                </Button>
                <Button onClick={handleHomeMenu}>
                    <Home className="mr-2 h-4 w-4" />
                    {localize('component.bb84.results.home')}
                </Button>
            </div>
        </div>
    );
};

export default SoloResultsTable;

/**
 * E91 Solo Results Table
 * 
 * Displays game results for E91 solo mode, reading from local Zustand stores.
 * Mirrors the multiplayer results table format for consistent user experience.
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
import { useLanguage } from '@/components/providers/language-provider';
import { classifySoloEnding } from '@/lib/eve-story';
import type { SoloEveRecord } from '@/lib/e91/solo-session';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home, RotateCcw } from 'lucide-react';
import { clearE91LocalStorage } from '@/lib/e91/utils';
import usePlayerStore from '@/store/player-store';

interface SoloResultsTableProps {
    playerName: string;
    playerRole: string;
    /**
     * The game's Eve story, as recorded at start and updated on detection.
     * Task 63 Step 6b replaced two loose booleans with it: the old props were
     * `evePresent = drawn || enabled` and `eveSpotted = detected || storeFlag`,
     * and the first ORed the DRAW with the CHECKBOX — so a game whose checkbox
     * was on but whose draw came up empty reported "Eve present: yes". That is
     * the Task 51 conflation the two flags exist to prevent.
     */
    eveRecord: SoloEveRecord;
    elapsedTime: number;
    keyLength: number;
}

const SoloResultsTable = ({
    playerName,
    playerRole,
    eveRecord,
    elapsedTime,
    keyLength,
}: SoloResultsTableProps) => {
    const { localize } = useLanguage();
    const router = useRouter();

    const partnerName = playerRole === 'A' ? 'Bob (Computer)' : 'Alice (Computer)';
    const roomDisplay = playerRole === 'A'
        ? `${playerName} - ${partnerName}`
        : `${partnerName} - ${playerName}`;

    // Calculate a simple score based on key length and time
    // Faster completion + more key bits = higher score
    const score = Math.max(0, Math.round((keyLength * 10) - (elapsedTime / 10)));

    // Task 63 Step 6b: the same shared, unit-tested classifier BB84's results
    // page uses (lib/eve-story.ts) — one answer to "how did this game end?" for
    // every protocol, kept out of the view so it can be tested.
    //
    // How E91 reaches each ending differs from BB84's, though the endings are
    // the same three. BB84's MISSED comes from a validation draw that happens
    // to agree; E91's comes from a DECISION — the student reads S, judges the
    // channel safe, and finishes the game with Eve still listening.
    const ending = classifySoloEnding(eveRecord);
    const keyCompromised = ending === 'missed';
    const revealKey = {
        absent: 'component.results.revealAbsent',
        caught: 'component.results.revealCaught',
        missed: 'component.results.revealMissed',
    }[ending];

    // ⚠️ Both handlers still diverge from BB84's, and the comment that used to
    // justify the first is now stale: it said the completed checkpoint "serves
    // as a signal for the form page to clean up properly", but since Phase 3e-2
    // the form page KEEPS a completed session instead of clearing it.
    //
    // BB84 pushes to /bb84 and its Home button navigates without clearing
    // anything (ADR §11: session data dies by user intent, not as a side effect
    // of navigation). E91 replaces, and its Home button destroys the session —
    // so a finished E91 game cannot be reached again with browser Forward, while
    // a BB84 one can. Left alone here on purpose: this slice is about what the
    // table SAYS, and changing navigation is its own change with its own test.
    // Recorded in Task 63 Step 6.
    const handleReplay = () => {
        router.replace('/e91');
    };

    const handleHomeMenu = () => {
        clearE91LocalStorage();
        router.replace('/');
    };

    return (
        <div className="mt-4 space-y-6">
            {/* Results Table */}
            <div
                className="block border w-fit mx-auto min-w-[50%]
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
                <Table>
                    <TableHeader className="bg-card top-0 sticky">
                        <TableRow className="text-sm md:text-lg">
                            <TableHead>{localize('component.e91.results.room')}</TableHead>
                            <TableHead>{localize('component.e91.results.evePresent')}</TableHead>
                            <TableHead>{localize('component.e91.results.eveDetected')}</TableHead>
                            <TableHead>{localize('component.results.verdict')}</TableHead>
                            <TableHead>{localize('component.e91.results.time')} (s)</TableHead>
                            <TableHead>{localize('component.e91.results.keyLength')}</TableHead>
                            <TableHead>{localize('component.e91.results.score')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{roomDisplay}</TableCell>
                            <TableCell>
                                {eveRecord.drawn
                                    ? localize('component.e91.results.yes') || 'Yes'
                                    : localize('component.e91.results.no') || 'No'}
                            </TableCell>
                            <TableCell>
                                {eveRecord.detected
                                    ? localize('component.e91.results.yes') || 'Yes'
                                    : localize('component.e91.results.no') || 'No'}
                            </TableCell>
                            <TableCell className={keyCompromised
                                ? 'text-red-500 font-bold'
                                : 'text-green-500 font-bold'}>
                                {localize(keyCompromised
                                    ? 'component.results.keyCompromised'
                                    : 'component.results.keySecure')}
                            </TableCell>
                            <TableCell>{Math.ceil(elapsedTime)}</TableCell>
                            <TableCell>{keyLength}</TableCell>
                            <TableCell>{score}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* The reveal — one sentence per ending, and the pedagogical point
                of a probabilistic Eve (ADR §12). This used to celebrate any
                finished game, so a student who never spotted Eve was told
                "Congratulations!" over a compromised key. Now the celebration
                only appears where it is earned. Same three sentences BB84
                shows, from the same shared keys. */}
            <div className="text-center">
                <p className={`text-xl font-bold ${
                    keyCompromised ? 'text-red-500' : 'text-green-500'}`}>
                    {localize(revealKey)}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReplay}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {localize('component.e91.results.replay') || 'Play Again'}
                </Button>
                <Button onClick={handleHomeMenu}>
                    <Home className="mr-2 h-4 w-4" />
                    {localize('component.e91.results.home') || 'Main Menu'}
                </Button>
            </div>
        </div>
    );
};

export default SoloResultsTable;

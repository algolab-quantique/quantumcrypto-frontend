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
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home, RotateCcw } from 'lucide-react';
import { clearE91LocalStorage } from '@/lib/e91/utils';
import usePlayerStore from '@/store/player-store';

interface SoloResultsTableProps {
    playerName: string;
    playerRole: string;
    evePresent: boolean;
    eveSpotted: boolean;
    elapsedTime: number;
    keyLength: number;
    gameSuccess: boolean;
}

const SoloResultsTable = ({
    playerName,
    playerRole,
    evePresent,
    eveSpotted,
    elapsedTime,
    keyLength,
    gameSuccess,
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

    const handleReplay = () => {
        // Clean up all game state before starting a new game
        clearE91LocalStorage();
        usePlayerStore.getState().setPlayingSolo(false);
        router.replace('/e91');
    };

    const handleHomeMenu = () => {
        // Clean up all game state before going to main menu
        clearE91LocalStorage();
        usePlayerStore.getState().setPlayingSolo(false);
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
                            <TableHead>{localize('component.e91.results.time')} (s)</TableHead>
                            <TableHead>{localize('component.e91.results.keyLength')}</TableHead>
                            <TableHead>{localize('component.e91.results.score')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{roomDisplay}</TableCell>
                            <TableCell>
                                {evePresent
                                    ? localize('component.e91.results.yes') || 'Yes'
                                    : localize('component.e91.results.no') || 'No'}
                            </TableCell>
                            <TableCell>
                                {eveSpotted
                                    ? localize('component.e91.results.yes') || 'Yes'
                                    : localize('component.e91.results.no') || 'No'}
                            </TableCell>
                            <TableCell>{Math.ceil(elapsedTime)}</TableCell>
                            <TableCell>{keyLength}</TableCell>
                            <TableCell>{score}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Game Status Message */}
            <div className="text-center">
                {gameSuccess ? (
                    <p className="text-xl text-green-500 font-bold">
                        {localize('component.e91.results.success') || '🎉 Congratulations! Game completed successfully!'}
                    </p>
                ) : (
                    <p className="text-xl text-red-500 font-bold">
                        {localize('component.e91.results.failure') || '❌ Game ended.'}
                    </p>
                )}
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

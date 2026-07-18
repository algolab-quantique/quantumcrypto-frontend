'use client';

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {useLanguage} from '@/components/providers/language-provider';

/**
 * Blocking restart dialog (Task 49-C: "one place to configure, one button to
 * replay"). The primary action (replay, big) is the natural flow; the optional
 * `onExit` renders a smaller, quieter escape hatch for the changed-mind case —
 * settings changes live at the protocol menu, not here. Callers that pass no
 * `onExit`/`confirmLabel` (e.g. E91 tabs) get the historical single-button
 * dialog unchanged.
 */
const GameRestartDialog = ({
                               restartModalOpen,
                               onConfirm,
                               onExit,
                               title,
                               description,
                               confirmLabel,
                           }: {
    restartModalOpen: boolean,
    onConfirm: any,
    onExit?: () => void,
    title: string | undefined,
    description: string | undefined,
    confirmLabel?: string,
}) => {

    const {localize} = useLanguage();

    return (
        <AlertDialog open={restartModalOpen}>
            <AlertDialogContent className="border-secondary">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {onExit && (
                        <AlertDialogCancel
                            className="h-9 text-sm text-muted-foreground"
                            onClick={() => onExit()}>
                            {localize('component.gameRestart.backToMenu')}
                        </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        className={onExit ? 'px-8 text-base font-semibold' : undefined}
                        onClick={() => onConfirm()}>
                        {confirmLabel ?? localize('component.gameRestart.restart')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default GameRestartDialog;
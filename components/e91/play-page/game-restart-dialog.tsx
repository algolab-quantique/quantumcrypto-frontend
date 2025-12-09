'use client';

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {useLanguage} from '@/components/providers/language-provider';

const GameRestartDialog = ({
                               restartModalOpen,
                               onConfirm,
                               title,
                               description,
                           }: { restartModalOpen: boolean, onConfirm: any, title: string | undefined, description: string | undefined }) => {

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
                    <AlertDialogAction onClick={() => onConfirm()}>{localize(
                        'component.e91.gameRestart.restart')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default GameRestartDialog;
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';
import useE91RoomStore from '@/store/e91/e91-room-store';

// Shown when Alice's and Bob's keys differ (Task 71). Everything on it comes
// from the store, so it can be reopened later with nothing to pass. Each
// side's message is the cipher XOR that side's key, so the two messages differ
// exactly where the two keys do (physics doc 10.15).
const xorBits = (bits: string[], key: string[]) =>
    bits.map((bit, i) => ((parseInt(bit) + parseInt(key[i])) % 2).toString());

const KeyPerturbedDialog = ({open, onOpenChange}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
}) => {

    const {localize} = useLanguage();
    const {aliceCipher, aliceValidBits, bobValidBits} = useE91RoomStore();

    // Effect first (the messages), then cause (the keys).
    const rows = [
        {label: 'component.e91.messaging.keyPerturbed.aliceMessage',
            bits: xorBits(aliceCipher, aliceValidBits)},
        {label: 'component.e91.messaging.keyPerturbed.bobMessage',
            bits: xorBits(aliceCipher, bobValidBits)},
        {label: 'component.e91.messaging.keyPerturbed.aliceKey',
            bits: aliceValidBits},
        {label: 'component.e91.messaging.keyPerturbed.bobKey',
            bits: bobValidBits},
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-secondary w-[90%] md:w-full rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        {localize('component.e91.messaging.keyPerturbed')}
                    </DialogTitle>
                    <DialogDescription>
                        {localize('component.e91.messaging.keyPerturbed.explanation')}
                    </DialogDescription>
                </DialogHeader>
                <table className="mx-auto text-lg">
                    <tbody>
                        {rows.map(({label, bits}, row) => (
                            <tr key={label}>
                                <td className={cn('pr-4 text-left text-base',
                                    row === 2 && 'pt-4')}>
                                    {localize(label)}
                                </td>
                                {bits.map((bit, i) => (
                                    <td key={i} className={cn(
                                        'px-1 text-center font-mono',
                                        row === 2 && 'pt-4',
                                        aliceValidBits[i] !== bobValidBits[i] &&
                                            'text-red font-bold')}>
                                        {bit}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>
                            {localize('component.e91.messaging.keyPerturbed.close')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default KeyPerturbedDialog;

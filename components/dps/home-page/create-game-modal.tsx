'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/providers/language-provider';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, fillPhotonMinimums } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel, FormMessage,
} from '@/components/ui/form';
import { TailSpin } from 'react-loading-icons';
import { CheckedState } from '@radix-ui/react-checkbox';
import {
    DPS_MULTIPLAYER_PHOTON_MAX,
    DPS_MULTIPLAYER_PHOTON_MIN_WITH_EVE,
    DPS_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE,
    DPS_MULTIPLAYER_PHOTON_DEFAULT,
    DPS_EVE_PERCENTAGE_DEFAULT,
} from '@/dps-constants';

const CreateGameModal = ({
    connecting,
    creatingGame,
    onCreateGame,
    triggerClassName,
}: {
    connecting: boolean,
    creatingGame: boolean, onCreateGame: (photonNumber: number
    ) => void,
    triggerClassName?: string

}) => {

    const { localize } = useLanguage();

    const formSchema = z.object({
        photonNumber: z.coerce.number({
            invalid_type_error: localize('component.createGame.keyError'),
        })
            .int()
            .max(DPS_MULTIPLAYER_PHOTON_MAX, {
                message: localize('component.createGame.keyMax'),
            }),
        eve: z.boolean({
            required_error: localize('component.main.pinRequired'),
        }).default(false),
        evePercentage: z.coerce.number({
            invalid_type_error: localize(
                'component.createGame.evePercentage.invalidType'),
        })
            .positive({
                message: localize(
                    'component.createGame.evePercentage.positive'),
            })
            .gte(0.1, {
                message: localize(
                    'component.createGame.evePercentage.greaterThan'),
            })
            .lte(1, {
                message: localize(
                    'component.createGame.evePercentage.lessThan'),
            }),
    }).refine(schema =>
        (schema.eve &&
            (schema.photonNumber >= DPS_MULTIPLAYER_PHOTON_MIN_WITH_EVE && schema.photonNumber <= DPS_MULTIPLAYER_PHOTON_MAX)) ||
        (!schema.eve &&
            (schema.photonNumber >= DPS_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE && schema.photonNumber <= DPS_MULTIPLAYER_PHOTON_MAX)),
        {
            // Was borrowing E91's key, which says "photon PAIRS" — DPS does not
            // use entangled pairs. Now uses the shared photon-based message.
            message: fillPhotonMinimums(
                localize('component.createGame.keyMin'),
                DPS_MULTIPLAYER_PHOTON_MIN_WITH_EVE,
                DPS_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE),
            path: ['photonNumber'],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photonNumber: DPS_MULTIPLAYER_PHOTON_DEFAULT,
            eve: false,
            evePercentage: DPS_EVE_PERCENTAGE_DEFAULT,
        },
    });

    useEffect(() => {

        form.setValue('photonNumber', 10);
    }, [form]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'secondary'} type="button"
                    className={cn("text-md w-[50%] mt-2", triggerClassName)}>{localize(
                        'component.main.createGame')}</Button>
            </DialogTrigger>
            <DialogContent
                className="w-[325px] md:w-full h-auto border-none">
                {creatingGame ?
                    <TailSpin stroke={'#00a85a'} className="m-auto text-primary" /> :
                    <><DialogHeader>
                        <DialogTitle>{localize(
                            'component.main.createGame')}</DialogTitle>
                        <DialogDescription>
                            {localize('component.main.createGame.descriptionNoEve')}
                        </DialogDescription>
                    </DialogHeader>
                        <Form {...form}>
                            <form className="flex flex-col gap-y-4"
                                onSubmit={form.handleSubmit(
                                    ({
                                        photonNumber,
                                    }) => onCreateGame(
                                        photonNumber))}
                            >
                                <FormField
                                    control={form.control}
                                    name="photonNumber"
                                    render={({ field }) => (
                                        <FormItem
                                            className="flex gap-x-5 items-center">
                                            <FormLabel
                                                className="text-nowrap col-span-1"
                                            >{localize(
                                                'component.createGame.keyLength')}</FormLabel>
                                            <FormControl className="mx-2">
                                                <Input
                                                    maxLength={2}
                                                    placeholder="10"
                                                    className="text-center w-[50px]"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button
                                        disabled={connecting || creatingGame}
                                        type="submit">{connecting ?
                                            <TailSpin className="p-2" /> :
                                            localize(
                                                'component.createGame.ready')}</Button>
                                </DialogFooter>
                            </form>
                        </Form></>}
            </DialogContent>
        </Dialog>

    )
}

export default CreateGameModal;

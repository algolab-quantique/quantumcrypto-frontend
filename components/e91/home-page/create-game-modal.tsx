'use client';

import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {useLanguage} from '@/components/providers/language-provider';
import {Checkbox} from '@/components/ui/checkbox';
import React, {useEffect, useState} from 'react';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel, FormMessage,
} from '@/components/ui/form';
import {TailSpin} from 'react-loading-icons';
import {CheckedState} from '@radix-ui/react-checkbox';
import {
    E91_MULTIPLAYER_PHOTON_MAX,
    E91_MULTIPLAYER_PHOTON_MIN_WITH_EVE,
    E91_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE,
    E91_MULTIPLAYER_PHOTON_DEFAULT,
    E91_EVE_PERCENTAGE_DEFAULT,
    E91_EVE_PERCENTAGE_MIN,
    E91_EVE_PERCENTAGE_MAX,
} from '@/e91-constants';

const CreateGameModal = ({
                             connecting,
                             creatingGame,
                             onCreateGame,
                         }: {
    connecting: boolean, creatingGame: boolean, onCreateGame: (photonNumber: number,
                                                               eve: boolean,
                                                               evePercentage: number) => void
}) => {

    const {localize} = useLanguage();
    const [eveChecked, setEveChecked] = useState(false);

    /**
     * Form validation schema using constants from e91-constants.ts
     * 
     * ⚠️  WARNING: These values MUST match backend validation!
     * ⚠️  See e91-constants.ts for E91_MULTIPLAYER_* constants
     */
    const formSchema = z.object({
        photonNumber: z.coerce.number({
            invalid_type_error: localize('component.createGame.keyError'),
        })
            .int()
            .max(E91_MULTIPLAYER_PHOTON_MAX, {
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
            .gte(E91_EVE_PERCENTAGE_MIN, {
                message: localize(
                    'component.createGame.evePercentage.greaterThan'),
            })
            .lte(E91_EVE_PERCENTAGE_MAX, {
                message: localize(
                    'component.createGame.evePercentage.lessThan'),
            }),
    }).refine(schema =>
            (schema.eve &&
                (schema.photonNumber >= E91_MULTIPLAYER_PHOTON_MIN_WITH_EVE && schema.photonNumber <= E91_MULTIPLAYER_PHOTON_MAX)) ||
            (!schema.eve &&
                (schema.photonNumber >= E91_MULTIPLAYER_PHOTON_MIN_WITHOUT_EVE && schema.photonNumber <= E91_MULTIPLAYER_PHOTON_MAX)),
        {
            message: localize('component.e91.createGame.keyMin'),
            path: ['photonNumber'],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photonNumber: E91_MULTIPLAYER_PHOTON_DEFAULT,
            eve: false,
            evePercentage: E91_EVE_PERCENTAGE_DEFAULT,
        },
    });

    const onEveChecked = (onChange: (...event: any[]) => void,
                          checked: CheckedState) => {
        setEveChecked(!eveChecked);
        onChange(checked);
    };

    useEffect(() => {
        if (eveChecked) {
            form.setValue('photonNumber', E91_MULTIPLAYER_PHOTON_MIN_WITH_EVE); 
        } else {
            form.setValue('photonNumber', E91_MULTIPLAYER_PHOTON_DEFAULT); 
        }
    }, [eveChecked, form]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'} type="button"
                    className="text-md w-full mt-2">{localize(
                    'component.main.createGame')}</Button>
            </DialogTrigger>
            <DialogContent
                className="w-[325px] md:w-full h-auto border-none">
                {creatingGame ?
                    <TailSpin stroke={'#00a85a'} className="m-auto text-primary"/> :
                    <><DialogHeader>
                        <DialogTitle>{localize(
                            'component.main.createGame')}</DialogTitle>
                        <DialogDescription>
                            {localize('component.main.createGame.description')}
                        </DialogDescription>
                    </DialogHeader>
                        <Form {...form}>
                            <form className="flex flex-col gap-y-4"
                                  onSubmit={form.handleSubmit(
                                      ({
                                           photonNumber,
                                           eve,
                                           evePercentage,
                                       }) => onCreateGame(
                                          photonNumber,
                                          eve,
                                          evePercentage))}
                            >
                                <FormField
                                    control={form.control}
                                    name="photonNumber"
                                    render={({field}) => (
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
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="eve"
                                    render={({field}) => (
                                        <FormItem
                                            className="space-y-0 flex gap-x-5 items-center">
                                            <FormLabel
                                                className="text-nowrap col-span-1"
                                            >{localize(
                                                'component.createGame.eve')}</FormLabel>
                                            <FormControl className="mx-2">
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checkState) => onEveChecked(
                                                        field.onChange,
                                                        checkState)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {eveChecked && <FormField
                                    control={form.control}
                                    name="evePercentage"
                                    render={({field}) => (
                                        <FormItem
                                            className="space-y-0 flex gap-x-5 items-center">
                                            <FormLabel
                                                className="text-nowrap col-span-1"
                                            >{localize(
                                                'component.createGame.evePercentage.label')}</FormLabel>
                                            <FormControl className="mx-2">
                                                <Input
                                                    // type={'number'}
                                                    maxLength={3}
                                                    placeholder="0.5"
                                                    className="text-center w-[50px]"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />}
                                <DialogFooter>
                                    <Button
                                        disabled={connecting || creatingGame}
                                        type="submit">{connecting ?
                                        <TailSpin className="p-2"/> :
                                        localize(
                                            'component.createGame.ready')}</Button>
                                </DialogFooter>
                            </form>
                        </Form></>}
            </DialogContent>
        </Dialog>
    );
};

export default CreateGameModal;

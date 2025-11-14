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
import React, {useState} from 'react';
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

const CreateGameModal = ({
                             connecting,
                             creatingGame,
                             onCreateGame,
                         }: {
    connecting: boolean, creatingGame: boolean, onCreateGame: (photonNumber: number,
                                                               eve: boolean,
                                                               validationBits: number,
                                                               evePercentage: number) => void
}) => {

    const {localize} = useLanguage();
    const [eveChecked, setEveChecked] = useState(false);

    const formSchema = z.object({
        photonNumber: z.coerce.number({
            invalid_type_error: localize('component.createGame.keyError'),
        })
            .int()
            .max(30, {
                message: localize('component.createGame.keyMax'),
            }),
        eve: z.boolean({
            required_error: localize('component.main.pinRequired'),
        }).default(false),
        validationBits: z.coerce.number({
            invalid_type_error: localize('component.createGame.numbersOnly'),
        })
            .int(),
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
                (schema.photonNumber >= 4 && schema.photonNumber <= 30)) ||  // 🧪 TEST: Changed from 16 to 4
            (!schema.eve &&
                (schema.photonNumber >= 4 && schema.photonNumber <= 30)),  // 🧪 TEST: Changed from 10 to 4
        {
            message: localize('component.createGame.keyMin'),
            path: ['photonNumber'],
        }).refine(schema => ((schema.eve &&
            (schema.validationBits > 0 && schema.validationBits <=
                schema.photonNumber / 2)) || !schema.eve),
        {
            message: localize('component.createGame.validationLength'),
            path: ['validationBits'],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photonNumber: 4,  // 🧪 TEST: Changed from 10 to 4 for quick testing
            eve: false,
            validationBits: 0,
            evePercentage: 0.5,
        },
    });

    const onEveChecked = (onChange: (...event: any[]) => void,
                          checked: CheckedState) => {
        setEveChecked(!eveChecked);
        onChange(checked);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'secondary'} type="button"
                    className="text-md w-[50%] mt-2">{localize(
                    'component.main.createGame')}</Button>
            </DialogTrigger>
            <DialogContent
                className="w-[325px] md:w-full h-auto border-none">
                {creatingGame ?
                    <TailSpin stroke={'#00a85a'}
                              className="m-auto text-primary"/> :
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
                                           validationBits,
                                           evePercentage,
                                       }) => onCreateGame(
                                          photonNumber,
                                          eve,
                                          validationBits,
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
                                    name="validationBits"
                                    render={({field}) => (
                                        <FormItem
                                            className="space-y-0 flex gap-x-5 items-center">
                                            <FormLabel
                                                className="text-nowrap col-span-1"
                                            >{localize(
                                                'component.createGame.validationDescription')}</FormLabel>
                                            <FormControl className="mx-2">
                                                <Input
                                                    // type={'number'}
                                                    maxLength={2}
                                                    min="0"
                                                    placeholder="10"
                                                    className="text-center w-[50px]"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />}
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
                                                    min="0"
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

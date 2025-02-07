'use client';

import CreateGameModal from '@/components/dps/home-page/create-game-modal';
import { useLanguage } from '@/components/providers/language-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {TailSpin} from 'react-loading-icons';

const DPSMain: React.FC = () => {

    const {
            connectToWaitingRoom,
            isWaitingRoomConnected,
            waitingRoomConnecting,
            isPlayRoomConnected,
            connectToPlayRoom,
    } = useSocket();
    const [creatingGame, setCreatingGame] = useState(false);
    

    const {localize} = useLanguage();

    const formSchema = z.object({
            playerName: z.string({
                required_error: localize('component.main.nameRequired'),
            }).min(2, {
                message: localize('component.main.nameMin'),
            }).max(10, {
                message: localize('component.main.nameMax'),
            }),
            gamePIN: z.string({
                required_error: localize('component.main.pinRequired'),
            }).length(5, {
                message: localize('component.main.pinLength'),
            }).toUpperCase(),
        });

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                playerName: '',
                gamePIN: '',
            },
        });

    return (
        <>
            <div className="h-fit w-fit mx-auto p-2 mt-6 flex flex-col gap-y-16">
                <div className="flex flex-col gap-y-4 text-center">
                    <h1 className="text-5xl font-bold text-primary">DPS</h1>
                    <h1 className="text-4xl font-bold">{localize(
                        'component.main.game')}</h1>
                </div>
                <Card
                    className="pt-4 pb-2 border-none w-[350px] md:w-[500px] mx-auto
                    shadow-md">
                    <CardContent>
                        <Form {...form}>
                            {/* <form onSubmit={form.handleSubmit(onJoinGame)} */}
                            <form
                                    className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="playerName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-lg">{localize(
                                                'component.main.nameLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={localize(
                                                        'component.main.name')} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {localize(
                                                    'component.main.nameDescription')}
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gamePIN"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-lg">{localize(
                                                'component.main.pinLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="SR117" {...field}
                                                    value={field.value.toUpperCase()}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-x-3 mx-auto w-full">
                                    <Button type="submit"
                                            disabled={waitingRoomConnecting}
                                            className="text-md w-full p-2">{creatingGame ?
                                        <TailSpin className="p-2"/> :
                                        localize(
                                            'component.main.join')}</Button>
                                </div>
                            </form>
                        </Form>
                          
                        <CreateGameModal connecting={waitingRoomConnecting}
                                        creatingGame={creatingGame}
                                        />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default DPSMain;

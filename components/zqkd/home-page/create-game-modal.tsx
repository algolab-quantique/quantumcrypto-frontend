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



const CreateGameModal = ({
                            connecting, 
                            creatingGame,
                            
                        } : {
                            connecting: boolean,
                            creatingGame: boolean,
                            
                            
                        }) => {

        const {localize} = useLanguage();
                              
        return (
            <Dialog>
                <DialogTrigger asChild>
                                <Button
                                    variant={'outline'} type="button"
                                    className="text-md w-full mt-2">{localize(
                                    'component.main.createGame')}</Button>
                            </DialogTrigger>
            </Dialog>
            
        )
}

export default CreateGameModal;

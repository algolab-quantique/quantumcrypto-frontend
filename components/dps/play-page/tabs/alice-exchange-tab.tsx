'use client';

import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {useLanguage} from '@/components/providers/language-provider';
import {useSocket} from '@/components/providers/socket-provider';


const AliceExchangeTab = ({photonNumber, polarIcons}: {
    photonNumber: number;
    polarIcons: any[]
}) => {
    const {localize} = useLanguage();

    return (
        <div
            className="block border
                    text-card-foreground border-secondary bg-card shadow-lg
                    rounded-lg">
          
            <h1>Alice-exchange-tab</h1>
        </div>
    );
}
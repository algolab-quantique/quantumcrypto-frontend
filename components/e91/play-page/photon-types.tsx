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
import {useLanguage} from '@/components/providers/language-provider';
import { Bell, CheckCircle2, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices, Info, Key, Minus, Trash } from 'lucide-react';

const PhotonCategories = () => {
    const {localize} = useLanguage();

    const categoryIcons: Record<string, JSX.Element> = {
        '3': <Key />,     
        '2': <Trash />,   
        '1': <Bell />,    
    };

    const polarIcons: Record<string, JSX.Element> = {
        '1': <span style={{ fontSize: "24px" }}>a</span>,
        '2': <span style={{ fontSize: "24px" }}>b</span>,
        '3': <span style={{ fontSize: "24px" }}>a&apos;</span>,
        '4': <span style={{ fontSize: "24px" }}>b&apos;</span>,
    };

    
    const cases = [
        {bobBase: '2', aliceBase: '2', category: '3', label: localize('component.tooltip.key')},
        {bobBase: '3', aliceBase: '3', category: '3', label: localize('component.tooltip.key')}, 
        {bobBase: '3', aliceBase: '1', category: '2', label: localize('component.tooltip.discard')}, 
        {bobBase: '3', aliceBase: '2', category: '2', label: localize('component.tooltip.discard')},
        {bobBase: '4', aliceBase: '2', category: '2', label: localize('component.tooltip.discard')}, 
        {bobBase: '2', aliceBase: '1', category: '1', label: localize('component.tooltip.bell')}, 
        {bobBase: '2', aliceBase: '3', category: '1', label: localize('component.tooltip.bell')}, 
        {bobBase: '4', aliceBase: '3', category: '1', label: localize('component.tooltip.bell')}, 
        {bobBase: '4', aliceBase: '1', category: '1', label: localize('component.tooltip.bell')}, 
    ];

    return (
        <Table className="table-auto">
            <TableHeader>
                <TableRow className="text-center">
                    <TableHead>
                        <p className='text-center'>{localize('component.tooltip.aliceBase')}</p>
                    </TableHead>
                    <TableHead>
                        <p className='text-center'>{localize('component.tooltip.bobBase')}</p>
                    </TableHead>
                    <TableHead>
                        <p className='text-center'>{localize('component.tooltip.category')}</p>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cases.map((item, index) => (
                    <TableRow key={index} className="text-center border-secondary">
                        <TableCell>
                            <p className="text-lg">{polarIcons[item.aliceBase]}</p>
                        </TableCell>
                        <TableCell>
                            <p className="text-lg">{polarIcons[item.bobBase]}</p>
                        </TableCell>
                        <TableCell className='flex justify-center items-center'>
                            <p className="text-lg item">{categoryIcons[item.category]}</p>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PhotonCategories;

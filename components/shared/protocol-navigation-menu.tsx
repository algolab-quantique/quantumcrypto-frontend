'use client';

import React from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {protocols} from '@/components/shared/protocol-data';
import Link from 'next/link';
import {useLanguage} from '@/components/providers/language-provider';

const ProtocolNavigationMenu = () => {

    const {localize} = useLanguage();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        className="font-normal text-md">{localize('component.header.protocols')}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="flex flex-col gap-y-3 p-6 md:w-[200px]">
                            {protocols.map(
                                ({name, href}, index) => (
                                    <li key={index}
                                        className="w-full rounded-md px-2 py-1 row-span-1 hover:bg-secondary/80 focus:shadow-md">
                                        <NavigationMenuLink
                                            asChild>
                                            <Link href={href}>
                                                <p className="text-md">{name}</p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default ProtocolNavigationMenu;
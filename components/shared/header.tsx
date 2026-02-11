'use client';
import React, { useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import Image from 'next/image';
import ProtocolNavigationMenu
    from '@/components/shared/protocol-navigation-menu';
import GuideNavigationMenu
    from '@/components/shared/guide-navigation-menu';
import Sidebar from '@/components/shared/sidebar';
import Link from 'next/link';

const Header = () => {

    const { localize, setLanguage } = useLanguage();

    useEffect(() => {
        const language = localStorage.getItem('language');
        if (language) {
            // @ts-ignore
            setLanguage(JSON.parse(language));
        }
    }, [])

    return (
        <>
            <div
                className="hidden md:block h-fit bg-primary px-6 py-1
            text-primary-foreground">
                <div className="flex gap-x-11 items-center">
                    <Link href={'/'}>
                        <Image className="my-2" priority={true}
                            src={'/institut-quantique.svg'}
                            alt={'Institut' +
                                ' Quantique Logo'}
                            width={250} height={79} />
                    </Link>
                    <ProtocolNavigationMenu />
                    <GuideNavigationMenu />
                    <Link href="/#about">
                        <p className="text-md cursor-pointer
                           hover:text-primary-foreground/90 transition-all">
                            {localize('component.header.about')}
                        </p>
                    </Link>
                </div>
            </div>
            <Sidebar />
        </>
    );
};

export default Header;
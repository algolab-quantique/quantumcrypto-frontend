'use client';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import Image from 'next/image';
import ProtocolNavigationMenu from '@/components/shared/protocol-navigation-menu';
import GuideNavigationMenu from '@/components/shared/guide-navigation-menu';
import SidebarV3 from '@/components/home-page/v3/sidebar-v3';
import Link from 'next/link';
import { getLanguageCode } from '@/lib/utils';

/**
 * HeaderV3 - V3 landing and protocol page header.
 * Uses Wide QuantumCrypto logo to match V3 aesthetic.
 */
const HeaderV3 = () => {

    const { localize, setLanguage, language } = useLanguage();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            // @ts-ignore
            setLanguage(JSON.parse(savedLanguage));
        }
    }, []);

    // Get language code for logo variant
    const langCode = getLanguageCode(language);
    const logoLang = isClient ? (langCode === 'es' ? 'en' : langCode) : 'en';

    return (
        <>
            <div
                className="hidden md:block h-fit bg-primary px-6 py-0.5
            text-primary-foreground">
                <div className="flex gap-x-11 items-center">
                    <div className="w-[250px] flex items-center">
                        <Link href={'/'}>
                            <Image className="my-1 h-12 w-auto object-contain" priority={true}
                                src={`/images/QuantumCrypto_white_${logoLang}.png`}
                                alt={'QuantumCrypto'}
                                width={250} height={60} />
                        </Link>
                    </div>
                    <ProtocolNavigationMenu />
                    <GuideNavigationMenu />
                    <Link href="#about">
                        <p className="text-md cursor-pointer
                           hover:text-primary-foreground/90 transition-all">
                            {localize('component.header.about')}
                        </p>
                    </Link>
                </div>
            </div>
            <SidebarV3 />
        </>
    );
};

export default HeaderV3;

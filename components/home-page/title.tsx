'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { getLanguageCode } from '@/lib/utils';
import Image from 'next/image';

const Title = () => {
    const { localize, language } = useLanguage();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Get language code, use 'en' for Spanish
    const langCode = getLanguageCode(language);
    const logoLang = isClient ? (langCode === 'es' ? 'en' : langCode) : 'en';

    return (
        <div className="h-fit w-fit flex flex-col gap-y-3 mt-20 mx-auto text-center">
            {/* 
              CSS-based theme switching: render BOTH logos, CSS shows correct one instantly.
              This prevents the hydration flash because dark: classes work immediately.
            */}

            {/* Light mode logo (visible in light mode, hidden in dark mode) */}
            <Image
                src={`/images/QuantumCrypto_black_${logoLang}.png`}
                alt="QuantumCrypto"
                width={500}
                height={100}
                className="block dark:hidden h-24 md:h-32 w-auto object-contain"
                priority
            />

            {/* Dark mode logo (hidden in light mode, visible in dark mode) */}
            <Image
                src={`/images/QuantumCrypto_white_${logoLang}.png`}
                alt="QuantumCrypto"
                width={500}
                height={100}
                className="hidden dark:block h-24 md:h-32 w-auto object-contain"
                priority
            />

            <p className="text-md md:text-2xl">{localize('component.homePage.title.description')}</p>
        </div>
    );
};

export default Title;
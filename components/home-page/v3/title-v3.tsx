'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { getLanguageCode } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * TitleV3 - Enhanced Hero with theme-aware glow
 * 
 * Changes vs V2:
 * - Stronger radial glow that works in BOTH light and dark mode
 * - Slightly larger glow radius for "spotlight" effect
 * - Alice/Bob drop-shadows tuned per theme
 */
const TitleV3 = () => {
    const { localize, language } = useLanguage();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const langCode = getLanguageCode(language);
    const logoLang = isClient ? (langCode === 'es' ? 'en' : langCode) : 'en';

    return (
        <div className="relative w-full max-w-6xl mx-auto pt-16 pb-6 px-4">

            {/* Hero Glow — light mode needs more intensity */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[400px] h-[400px]
                bg-primary/25 dark:bg-primary/15
                blur-[140px] rounded-full -z-10" />
            {/* Secondary wider halo — softer, larger */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[700px] h-[500px]
                bg-primary/8 dark:bg-primary/6
                blur-[180px] rounded-full -z-10" />

            <div className="flex items-center justify-center gap-6 md:gap-10">

                {/* Alice mascot — left */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hidden lg:block flex-shrink-0"
                >
                    <Image
                        src="/images/Alice_mascottes.png"
                        alt="Alice"
                        width={180}
                        height={240}
                        className="object-contain
                            drop-shadow-[0_0_18px_hsl(152,100%,33%,0.3)]
                            dark:drop-shadow-[0_0_12px_hsl(152,100%,33%,0.25)]"
                    />
                </motion.div>

                {/* Center: Logo + subtitle + narrative */}
                <div className="flex flex-col items-center text-center max-w-[500px]">

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Image
                            src={`/images/QuantumCrypto_black_${logoLang}.png`}
                            alt="QuantumCrypto"
                            width={500}
                            height={100}
                            className="block dark:hidden h-32 md:h-44 w-auto object-contain mx-auto"
                            priority
                        />
                        <Image
                            src={`/images/QuantumCrypto_white_${logoLang}.png`}
                            alt="QuantumCrypto"
                            width={500}
                            height={100}
                            className="hidden dark:block h-32 md:h-44 w-auto object-contain mx-auto"
                            priority
                        />
                    </motion.div>

                    {/* Localized subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-md md:text-2xl"
                    >
                        {localize('component.homePage.title.description')}
                    </motion.p>

                    {/* Narrative quote */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-foreground/70 text-sm md:text-base italic"
                    >
                        {`"Alice et Bob doivent sécuriser leurs communications. Suivez leurs aventures à travers les protocoles cryptographiques les plus avancés de l'univers."`}
                    </motion.p>
                </div>

                {/* Bob mascot — right */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hidden lg:block flex-shrink-0"
                >
                    <Image
                        src="/images/Bob_mascottes.png"
                        alt="Bob"
                        width={180}
                        height={240}
                        className="object-contain
                            drop-shadow-[0_0_18px_hsl(152,100%,33%,0.3)]
                            dark:drop-shadow-[0_0_12px_hsl(152,100%,33%,0.25)]"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default TitleV3;

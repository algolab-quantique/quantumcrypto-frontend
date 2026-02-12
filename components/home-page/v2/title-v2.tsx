'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * TitleV2 - Narrative Signature Version
 * Keeps the original green theme.
 * Alice & Bob as mascots, narrative intro, NO scroll-down CTA.
 */
const TitleV2 = () => {
    const { localize } = useLanguage();

    return (
        <div className="relative w-full max-w-6xl mx-auto pt-16 pb-6 px-4">
            {/* Background Glow - using our green */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/15 blur-[120px] rounded-full -z-10" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Alice */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hidden lg:block w-1/5"
                >
                    <Image
                        src="/images/alice_bb_en.png"
                        alt="Alice"
                        width={260}
                        height={360}
                        className="drop-shadow-[0_0_12px_hsl(152,100%,33%,0.3)] object-contain"
                    />
                </motion.div>

                {/* Main Text */}
                <div className="flex-1 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                            QUANTUM MISSION
                        </h1>
                        <p className="mt-3 text-lg md:text-2xl text-primary font-mono tracking-widest uppercase">
                            {localize('component.homePage.title.description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-xl mx-auto"
                    >
                        <p className="text-muted-foreground text-base md:text-lg italic">
                            &ldquo;Alice et Bob doivent sécuriser leurs communications.
                            Suivez leurs aventures à travers les protocoles cryptographiques
                            les plus avancés de l&apos;univers.&rdquo;
                        </p>
                    </motion.div>
                </div>

                {/* Bob */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hidden lg:block w-1/5"
                >
                    <Image
                        src="/images/bob_bb_en.png"
                        alt="Bob"
                        width={260}
                        height={360}
                        className="drop-shadow-[0_0_12px_hsl(152,100%,33%,0.3)] object-contain"
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default TitleV2;

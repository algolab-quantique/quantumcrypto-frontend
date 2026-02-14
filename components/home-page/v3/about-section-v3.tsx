'use client';

import React, { forwardRef, ReactNode } from 'react';
import { Blocks, PackageOpen, Smile, UsersRound } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    index: number;
}

/**
 * FeatureCardV3 — Glassmorphism + smooth hover
 *
 * Same two-layer technique as protocol cards:
 * - Outer motion.div: Framer entrance animation only
 * - Inner div: pure CSS hover (scale + glow) — GPU-accelerated, no Framer conflict
 */
const FeatureCardV3 = ({ icon, title, description, index }: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
        >
            <div className="h-full items-center p-5 rounded-md drop-shadow-2xl flex flex-col gap-y-2
                border border-white/10 dark:border-white/[0.08]
                bg-card/60 backdrop-blur-md
                hover:scale-[1.03] hover:border-primary/40
                hover:shadow-[0_0_24px_hsl(152,100%,33%,0.18)]
                transition-all duration-200 cursor-default">
                <div>
                    {React.cloneElement(icon as React.ReactElement<any>,
                        { className: 'mb-2', size: 70 })}
                </div>
                <div>
                    <p className="font-bold text-2xl mb-3 text-primary">{title}</p>
                    <p className="text-foreground/70">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

/**
 * AboutSectionV3 — Glass cards matching protocol section style
 *
 * Uses CSS grid (same as protocol section) so that:
 * - All cards in a row are the same height automatically
 * - Two-layer card nesting works (grid propagates height, flex-wrap does not)
 */
const AboutSectionV3 = forwardRef<HTMLElement>((_, ref) => {

    const { localize } = useLanguage();

    return (
        <section ref={ref}
            className="w-full h-full mt-5 px-5 md:px-20"
            id={'aboutSection'}>
            <h1 className="font-bold text-3xl md:text-5xl mb-3">{localize(
                'component.header.about')}</h1>
            <p className="text-lg">{localize(
                'component.homePage.aboutSection')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mt-10 gap-5 mx-auto">
                <FeatureCardV3 index={0} icon={<Smile />} title={localize(
                    'component.homePage.userFriendlyTitle') ?? ''}
                    description={localize(
                        'component.homePage.userFriendly') ?? ''} />
                <FeatureCardV3 index={1} icon={<UsersRound />}
                    title={localize(
                        'component.homePage.multiplayerTitle') ?? ''}
                    description={localize(
                        'component.homePage.multiplayer') ?? ''} />
                <FeatureCardV3 index={2} icon={<Blocks />} title={localize(
                    'component.homePage.extensibleTitle') ?? ''}
                    description={localize(
                        'component.homePage.extensible') ?? ''} />
                <FeatureCardV3 index={3} icon={<PackageOpen />} title={'Open-source'}
                    description={localize(
                        'component.homePage.openSource') ?? ''} />
            </div>
        </section>
    );
});

AboutSectionV3.displayName = 'AboutSectionV3';

export default AboutSectionV3;

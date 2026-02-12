'use client';

import React, {forwardRef, ReactNode} from 'react';
import {Blocks, PackageOpen, Smile, UsersRound} from 'lucide-react';
import {useLanguage} from '@/components/providers/language-provider';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    index: number;
}

const FeatureCardV2 = ({icon, title, description, index}: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            className="w-[300px] border border-secondary items-center p-5 rounded-md drop-shadow-2xl flex flex-col gap-y-2
                hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_20px_hsl(152,100%,33%,0.15)]
                transition-all duration-200 cursor-default"
        >
            <div>
                {React.cloneElement(icon as React.ReactElement<any>,
                    {className: 'mb-2', size: 70})}
            </div>
            <div>
                <p className="font-bold text-2xl mb-3 text-primary">{title}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
        </motion.div>
    );
};

const AboutSectionV2 = forwardRef<HTMLElement>((_, ref) => {

    const {localize} = useLanguage();

    return (
        <section ref={ref}
                 className="w-full h-full mt-5 px-5 md:px-20"
                 id={'aboutSection'}>
            <h1 className="font-bold text-3xl md:text-5xl mb-3">{localize(
                'component.header.about')}</h1>
            <p className="text-lg">{localize(
                'component.homePage.aboutSection')}</p>
            <div
                className="flex flex-wrap mt-10 gap-5 justify-center mx-auto w-fit">
                <FeatureCardV2 index={0} icon={<Smile/>} title={localize(
                    'component.homePage.userFriendlyTitle') ?? ''}
                             description={localize(
                                 'component.homePage.userFriendly') ?? ''}/>
                <FeatureCardV2 index={1} icon={<UsersRound/>}
                             title={localize(
                                 'component.homePage.multiplayerTitle') ?? ''}
                             description={localize(
                                 'component.homePage.multiplayer') ?? ''}/>
                <FeatureCardV2 index={2} icon={<Blocks/>} title={localize(
                    'component.homePage.extensibleTitle') ?? ''}
                             description={localize(
                                 'component.homePage.extensible') ?? ''}/>
                <FeatureCardV2 index={3} icon={<PackageOpen/>} title={'Open-source'}
                             description={localize(
                                 'component.homePage.openSource') ?? ''}/>
            </div>
        </section>
    );
});

AboutSectionV2.displayName = 'AboutSectionV2';

export default AboutSectionV2;

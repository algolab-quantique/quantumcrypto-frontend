'use client';

import React from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent} from '@/components/ui/card';

const HowToPlaySection = React.forwardRef<HTMLElement>((_, ref) => {

    const {localize} = useLanguage();

    return (
        <section ref={ref}
                 className="w-full text-lg h-fit mt-20 px-5 md:px-20">
            <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize(
                'component.dps.howToPlayTitle')}</h1>
            <p>{localize('component.dps.howToPlayDescription')}</p>
            
        </section>
    );
});

HowToPlaySection.displayName = 'HowToPlaySection';

export default HowToPlaySection;
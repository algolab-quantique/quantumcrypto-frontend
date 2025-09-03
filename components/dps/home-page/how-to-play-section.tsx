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
            <Tabs defaultValue={'alice'} className="mt-4">
                <TabsList className="grid w-full grid-cols-2 h-fit">
                    <TabsTrigger value={'alice'}
                                 className="text-lg md:text-xl">Alice</TabsTrigger>
                    <TabsTrigger value={'bob'}
                                 className="text-lg md:text-xl">Bob</TabsTrigger>
                </TabsList>
                <TabsContent value={'alice'}>
                    <Card className="border-secondary">
                        <CardContent className="p-5">
                            <div className="flex flex-row gap-x-2">
                                <span>1.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Alice.step1.part0')}</span>
                                    {localize('component.dps.howToPlay.Alice.step1.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>2.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Alice.step2.part0')}</span>
                                    {localize('component.dps.howToPlay.Alice.step2.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>3.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Alice.step3.part0')}</span>
                                    {localize('component.dps.howToPlay.Alice.step3.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>4.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Alice.step4.part0')}</span>
                                    {localize('component.dps.howToPlay.Alice.step4.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>5.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Alice.step5.part0')}</span>
                                    {localize('component.dps.howToPlay.Alice.step5.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>6.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Alice.step6.part0')}</span>
                                    {localize('component.dps.howToPlay.Alice.step6.part1')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value={'bob'}>
                    <Card className="border-secondary">
                        <CardContent className="p-5">
                            <div className="flex flex-row gap-x-2">
                                <span>1.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Bob.step1.part0')}</span>
                                    {localize('component.dps.howToPlay.Bob.step1.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>2.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Bob.step2.part0')}</span>
                                    {localize('component.dps.howToPlay.Bob.step2.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>3.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Bob.step3.part0')}</span>
                                    {localize('component.dps.howToPlay.Bob.step3.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>4.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Bob.step4.part0')}</span>
                                    {localize('component.dps.howToPlay.Bob.step4.part1')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>5.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.dps.howToPlay.Bob.step5.part0')}</span>
                                    {localize('component.dps.howToPlay.Bob.step5.part1')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>
    );
});

HowToPlaySection.displayName = 'HowToPlaySection';

export default HowToPlaySection;
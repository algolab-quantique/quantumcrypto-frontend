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
                'component.bb84.howToPlayTitle')}</h1>
            <p>{localize('component.bb84.howToPlayDescription')}</p>
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
                                    'component.bb84.highlights.highlight1Alice')}</span>
                                    {localize(
                                        'component.bb84.steps.step1Alice')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>2.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight2Alice')}</span>{localize(
                                    'component.bb84.steps.step2Alice')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>3.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight3Alice')}</span>{localize(
                                    'component.bb84.steps.step3Alice')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>4.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight4Alice')}</span>{localize(
                                    'component.bb84.steps.step4Alice')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>5.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight5Alice')}</span>{localize(
                                    'component.bb84.steps.step5Alice')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2 mt-2">
                                <p>{localize('component.bb84.rawKeyInfo')}</p>
                            </div>
                            <p>{localize('component.bb84.additionalStep')}</p>
                            <div className="flex flex-row gap-x-2">
                                <span>6.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight6Alice')}</span>{localize(
                                    'component.bb84.steps.step6Alice')}
                                </p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>7.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight7Alice')}</span>{localize(
                                    'component.bb84.steps.step7Alice')}</p>
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
                                    'component.bb84.highlights.highlight1Bob')}</span>{localize(
                                    'component.bb84.steps.step1Bob')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>2.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight2Bob')}</span>{localize(
                                    'component.bb84.steps.step2Bob')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>3.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight3Bob')}</span>{localize(
                                    'component.bb84.steps.step3Bob')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>4.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight4Bob')}</span>{localize(
                                    'component.bb84.steps.step4Bob')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2 mt-2">
                                <p>{localize('component.bb84.rawKeyInfo')}</p>
                            </div>
                            <p>{localize('component.bb84.additionalStep')}</p>
                            <div className="flex flex-row gap-x-2">
                                <span>5.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight5Bob')}</span>{localize(
                                    'component.bb84.steps.step5Bob')}</p>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <span>6.</span>
                                <p><span className="text-highlight">{localize(
                                    'component.bb84.highlights.highlight6Bob')}</span>{localize(
                                    'component.bb84.steps.step6Bob')}</p>
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
'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const HowToPlaySectionV3 = React.forwardRef<HTMLElement>((_, ref) => {

    const { localize } = useLanguage();

    return (
        <section ref={ref}
            className="w-full text-lg h-fit mt-8 px-5 md:px-20">
            {/* ═══ V3 Glassmorphism Wrapper ═══ */}
            <div className="bg-card/60 backdrop-blur-md border border-border/40 
                rounded-2xl p-6 md:p-10 
                shadow-lg
                hover:border-primary/30 transition-all duration-500">
                <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize(
                    'component.e91.howToPlayTitle')}</h1>
                <p className="text-muted-foreground mb-6">{localize('component.e91.howToPlayDescription')}</p>
                <Tabs defaultValue={'alice'} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2 h-fit
                    bg-muted/60 backdrop-blur-sm border border-border/30 rounded-lg p-1">
                        <TabsTrigger value={'alice'}
                            className="text-lg md:text-xl cursor-pointer
                                     transition-all duration-200
                                     hover:text-primary hover:bg-primary/10
                                     data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                     data-[state=active]:border-primary/30">Alice</TabsTrigger>
                        <TabsTrigger value={'bob'}
                            className="text-lg md:text-xl cursor-pointer
                                     transition-all duration-200
                                     hover:text-primary hover:bg-primary/10
                                     data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                     data-[state=active]:border-primary/30">Bob</TabsTrigger>
                    </TabsList>
                    <TabsContent value={'alice'}>
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm mt-4">
                            <CardContent className="p-5">
                                <div className="space-y-4">
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">1.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight1')}</span>
                                            {localize(
                                                'component.e91.steps.step1')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">2.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight2')}</span>{localize(
                                                'component.e91.steps.step2Alice')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">3.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight3')}</span>{localize(
                                                'component.e91.steps.step3')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">4.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight4')}</span>{localize(
                                                'component.e91.steps.step4')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">5.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight5Alice')}</span>{localize(
                                                'component.e91.steps.step5Alice')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value={'bob'}>
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm mt-4">
                            <CardContent className="p-5">
                                <div className="space-y-4">
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">1.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight1')}</span>{localize(
                                                'component.e91.steps.step1')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">2.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight2')}</span>{localize(
                                                'component.e91.steps.step2Bob')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">3.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight3')}</span>{localize(
                                                'component.e91.steps.step3')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">4.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight4')}</span>{localize(
                                                'component.e91.steps.step4')}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-3">
                                        <span className="font-bold text-primary">5.</span>
                                        <p><span className="text-primary font-medium">{localize(
                                            'component.e91.highlights.highlight5Bob')}</span>{localize(
                                                'component.e91.steps.step5Bob')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
});

HowToPlaySectionV3.displayName = 'HowToPlaySectionV3';

export default HowToPlaySectionV3;

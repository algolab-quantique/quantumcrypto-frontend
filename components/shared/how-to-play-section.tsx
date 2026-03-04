'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

/* ─────────────────────────────────────────────────────────
   Shared "How to Play" section — V3 Glassmorphism design.
   Used identically by BB84, E91 and DPS protocol pages.
   ───────────────────────────────────────────────────────── */

/** A single numbered step inside a tab (Alice / Bob). */
export interface HowToPlayStep {
    /** Localisation key for the highlighted (bold) prefix text. */
    highlightKey: string;
    /** Localisation key for the rest of the sentence. */
    contentKey: string;
}

/** Optional block of extra text inserted between two numbered steps. */
export interface ExtraBlock {
    /** Insert *after* this 1-based step number (e.g. 5 → appears between step 5 and step 6). */
    afterStep: number;
    /** Localisation keys for the extra paragraphs. */
    paragraphKeys: string[];
}

export interface HowToPlaySectionProps {
    /** Localisation key for the section title. */
    titleKey: string;
    /** Localisation key for the description paragraph below the title. */
    descriptionKey: string;
    /** Ordered steps shown under the "Alice" tab. */
    aliceSteps: HowToPlayStep[];
    /** Ordered steps shown under the "Bob" tab. */
    bobSteps: HowToPlayStep[];
    /** Optional extra-content blocks for the Alice tab. */
    aliceExtras?: ExtraBlock[];
    /** Optional extra-content blocks for the Bob tab. */
    bobExtras?: ExtraBlock[];
}

const HowToPlaySection = React.forwardRef<HTMLElement, HowToPlaySectionProps>(
    ({ titleKey, descriptionKey, aliceSteps, bobSteps, aliceExtras = [], bobExtras = [] }, ref) => {
        const { localize } = useLanguage();

        /** Render a list of numbered steps with optional extra blocks in-between. */
        const renderSteps = (steps: HowToPlayStep[], extras: ExtraBlock[]) => {
            const elements: React.ReactNode[] = [];

            steps.forEach((step, index) => {
                const stepNumber = index + 1;

                elements.push(
                    <div key={`step-${stepNumber}`} className="flex flex-row gap-x-3">
                        <span className="font-bold text-primary">{stepNumber}.</span>
                        <p>
                            <span className="text-primary font-medium">
                                {localize(step.highlightKey)}
                            </span>
                            {localize(step.contentKey)}
                        </p>
                    </div>,
                );

                // Insert any extra blocks that belong after this step number.
                extras
                    .filter((e) => e.afterStep === stepNumber)
                    .forEach((extra, ei) =>
                        extra.paragraphKeys.forEach((key, pi) =>
                            elements.push(
                                <p key={`extra-${stepNumber}-${ei}-${pi}`} className="text-muted-foreground">
                                    {localize(key)}
                                </p>,
                            ),
                        ),
                    );
            });

            return elements;
        };

        return (
            <section ref={ref} className="w-full text-lg h-fit mt-8 px-5 md:px-20">
                {/* ═══ V3 Glassmorphism Wrapper ═══ */}
                <div
                    className="bg-card/60 backdrop-blur-md border border-border/40
                        rounded-2xl p-6 md:p-10
                        shadow-lg
                        hover:border-primary/30 transition-all duration-500"
                >
                    <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize(titleKey)}</h1>
                    <p className="text-muted-foreground mb-6">{localize(descriptionKey)}</p>

                    <Tabs defaultValue="alice" className="mt-4">
                        <TabsList
                            className="grid w-full grid-cols-2 h-fit
                                bg-muted/60 backdrop-blur-sm border border-border/30 rounded-lg p-1"
                        >
                            <TabsTrigger
                                value="alice"
                                className="text-lg md:text-xl cursor-pointer
                                    transition-all duration-200
                                    hover:text-primary hover:bg-primary/10
                                    data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                    data-[state=active]:border-primary/30"
                            >
                                Alice
                            </TabsTrigger>
                            <TabsTrigger
                                value="bob"
                                className="text-lg md:text-xl cursor-pointer
                                    transition-all duration-200
                                    hover:text-primary hover:bg-primary/10
                                    data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                    data-[state=active]:border-primary/30"
                            >
                                Bob
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="alice">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-sm mt-4">
                                <CardContent className="p-5">
                                    <div className="space-y-4">
                                        {renderSteps(aliceSteps, aliceExtras)}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="bob">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-sm mt-4">
                                <CardContent className="p-5">
                                    <div className="space-y-4">
                                        {renderSteps(bobSteps, bobExtras)}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        );
    },
);

HowToPlaySection.displayName = 'HowToPlaySection';

export default HowToPlaySection;

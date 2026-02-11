'use client';

import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import React, { useRef } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { protocols } from '@/components/shared/protocol-data';

export default function GuidePage() {

    const { localize } = useLanguage();
    const howToPlayRef = useRef(null);
    const terminologyRef = useRef(null);
    const contextRef = useRef(null);




    // Collect unique glossary terms from all protocols
    const glossaryTerms = [
        // BB84 terms
        {
            titleKey: 'component.bb84.about.photon.title',
            contentKey: 'component.bb84.about.photon',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.encryptionKey.title',
            contentKey: 'component.bb84.about.encryptionKey.part1',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.publicPrivate.title',
            contentKey: 'component.bb84.about.publicPrivate',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.classicalQuantum.title',
            contentKey: 'component.bb84.about.classicalQuantum',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.encoding.title',
            contentKey: 'component.bb84.about.encoding',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.orthogonal.title',
            contentKey: 'component.bb84.about.orthogonal',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.disturbance.title',
            contentKey: 'component.bb84.about.disturbance',
            protocol: 'BB84',
        },
        {
            titleKey: 'component.bb84.about.eve.title',
            contentKey: 'component.bb84.about.eve',
            protocol: 'BB84',
        },
        // E91 terms
        {
            titleKey: 'component.e91.about.polarization.title',
            contentKey: 'component.e91.about.polarization',
            protocol: 'E91',
        },
        {
            titleKey: 'component.e91.about.maximallyEntangled.title',
            contentKey: 'component.e91.about.maximallyEntangled.part1',
            protocol: 'E91',
        },
        {
            titleKey: 'component.e91.about.bellPairs.title',
            contentKey: 'component.e91.about.bellPairs.part1',
            protocol: 'E91',
        },
        {
            titleKey: 'component.e91.about.measurementBasis.title',
            contentKey: 'component.e91.about.measurementBasis',
            protocol: 'E91',
        },
        {
            titleKey: 'component.e91.about.bellInequalities.title',
            contentKey: 'component.e91.about.bellInequalities',
            protocol: 'E91',
        },
        {
            titleKey: 'component.e91.about.chshInequality.title',
            contentKey: 'component.e91.about.chshInequality',
            protocol: 'E91',
        },
        // DPS terms
        {
            titleKey: 'component.dps.about.phases.title',
            contentKey: 'component.dps.about.phases.part1',
            protocol: 'DPS',
        },
        {
            titleKey: 'component.dps.about.train-impulsions.title',
            contentKey: 'component.dps.about.train-impulsions',
            protocol: 'DPS',
        },
        {
            titleKey: 'component.dps.about.miroirs-semi-reflechissants.title',
            contentKey: 'component.dps.about.miroirs-semi-reflechissants',
            protocol: 'DPS',
        },
        {
            titleKey: 'component.dps.about.etat-superposition.title',
            contentKey: 'component.dps.about.etat-superposition',
            protocol: 'DPS',
        },
        {
            titleKey: 'component.dps.about.interferometre.title',
            contentKey: 'component.dps.about.interferometre',
            protocol: 'DPS',
        },
    ];

    return (
        <div>
            <Header />
            <div className="w-full h-full flex flex-col gap-y-8 px-5 md:px-20 mt-10 mb-20">

                {/* Page Title */}
                <div className="text-center mb-4">
                    <h1 className="font-bold text-4xl md:text-5xl mb-2">
                        {localize('component.header.guide')}
                    </h1>
                </div>

                {/* ====================== Comment Jouer Section ====================== */}
                <section ref={howToPlayRef} id="comment-jouer">
                    <h2 className="font-bold text-2xl md:text-3xl mb-4">
                        {localize('component.header.guide.howToPlay')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {localize('component.header.guide.howToPlayDesc')}
                    </p>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
                        {protocols.map(({ name, href }) => (
                            <Link key={name} href={href} target="_blank">
                                <Card className="p-6 border-none shadow-md hover:shadow-lg 
                                    hover:scale-[1.02] transition-all cursor-pointer h-full">
                                    <CardContent className="flex flex-col items-center justify-center gap-y-3 p-0">
                                        <div className="w-14 h-14 rounded-full bg-primary/10 
                                            flex items-center justify-center">
                                            <span className="text-primary font-bold text-lg">{name}</span>
                                        </div>
                                        <h3 className="font-semibold text-lg text-center">
                                            {localize('component.header.guide.howToPlay')} {name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                            {localize(`component.homePage.protocolsSection.${name.toLowerCase()}.description`)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ====================== Terminologie Section ====================== */}
                <section ref={terminologyRef} id="terminologie" className="mt-8">
                    <h2 className="font-bold text-2xl md:text-3xl mb-4">
                        {localize('component.header.guide.terminology')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {localize('component.header.guide.terminologyDesc')}
                    </p>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {glossaryTerms.map(({ titleKey, contentKey, protocol }, index) => (
                            <Card key={index}
                                className="pt-4 pb-2 border-none shadow-md h-[350px]">
                                <CardContent className="h-full flex flex-col overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full 
                                            bg-primary/10 text-primary">
                                            {protocol}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">
                                        {localize(titleKey)}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {localize(contentKey)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* ====================== Contexte Section ====================== */}
                <section ref={contextRef} id="contexte" className="mt-8">
                    <h2 className="font-bold text-2xl md:text-3xl mb-4">
                        {localize('component.header.guide.context')}
                    </h2>
                    <Card className="p-8 border-none shadow-md">
                        <CardContent className="flex flex-col items-center justify-center gap-y-4 p-0 py-10">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 
                                flex items-center justify-center">
                                <span className="text-2xl">🚧</span>
                            </div>
                            <h3 className="font-semibold text-xl text-center">
                                {localize('component.header.guide.comingSoon')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                                {localize('component.header.guide.comingSoonDesc')}
                            </p>
                        </CardContent>
                    </Card>
                </section>

            </div>
            <Footer />
        </div>
    );
}

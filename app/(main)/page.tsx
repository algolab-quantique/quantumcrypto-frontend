'use client';

import Header from '@/components/shared/header';
import ProtocolsSection from '@/components/home-page/protocols-section';
import React from 'react';
import AboutSection from '@/components/home-page/about-section';
import Title from '@/components/home-page/title';
import Footer from '@/components/shared/footer';

export default function Home() {

    return (
        <div>
            <Header />
            <div className="w-full h-full flex flex-col gap-y-4">
                <Title />
                <ProtocolsSection />
                <div id="about">
                    <AboutSection />
                </div>
            </div>
            <Footer />
        </div>
    );
}

'use client';

import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import TitleV2 from '@/components/home-page/v2/title-v2';
import ProtocolsSectionV2 from '@/components/home-page/v2/protocols-section-v2';
import AboutSection from '@/components/home-page/about-section';

/**
 * Visual Signature V2 - Progress Page
 * This is a playground for the new design inspired by Enigmes Quantiques.
 * Accessible at /landingpagegame_progress
 *
 * Same green/dark theme as the main site.
 * Title + Protocol cards are immediately visible (no scroll needed).
 */
export default function LandingPageV2() {

    return (
        <div className="v2-theme-root min-h-screen">
            <Header />
            <div className="w-full flex flex-col">
                {/* Hero: Title + Alice/Bob + narrative — compact */}
                <TitleV2 />

                {/* Protocol mission cards — directly visible, no gap */}
                <ProtocolsSectionV2 />

                <div id="about" className="mt-12">
                    <AboutSection />
                </div>
            </div>
            <Footer />
        </div>
    );
}

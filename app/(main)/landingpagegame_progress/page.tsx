'use client';

import HeaderV2 from '@/components/home-page/v2/header-v2';
import FooterV2 from '@/components/home-page/v2/footer-v2';
import TitleV2 from '@/components/home-page/v2/title-v2';
import ProtocolsSectionV2 from '@/components/home-page/v2/protocols-section-v2';
import AboutSection from '@/components/home-page/about-section';
import Image from 'next/image';

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
        <div className="v2-theme-root min-h-screen relative">
            <HeaderV2 />
            <div className="w-full flex flex-col">
                {/* Hero: Title + Alice/Bob + narrative — compact */}
                <TitleV2 />

                {/* Protocol mission cards — directly visible, no gap */}
                <ProtocolsSectionV2 />

                <div id="about" className="mt-12">
                    <AboutSection />
                </div>
            </div>
            
            {/* Brand Signature Watermark — subtle decor in bottom left */}
            <div className="fixed bottom-8 left-8 pointer-events-none opacity-10 hidden xl:block select-none">
                <Image
                    src="/images/QC_icon.png"
                    alt="QC Watermark"
                    width={80}
                    height={80}
                    className="grayscale"
                />
            </div>

            <FooterV2 />
        </div>
    );
}

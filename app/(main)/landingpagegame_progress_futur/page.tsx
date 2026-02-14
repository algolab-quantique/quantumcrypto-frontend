'use client';

import HeaderV2 from '@/components/home-page/v2/header-v2';
import FooterV2 from '@/components/home-page/v2/footer-v2';
import TitleV3 from '@/components/home-page/v3/title-v3';
import ProtocolsSectionV2 from '@/components/home-page/v2/protocols-section-v2';
import AboutSectionV2 from '@/components/home-page/v2/about-section-v2';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';
import Image from 'next/image';

/**
 * Visual Signature V3 - Futuristic Experience
 * Playground for advanced atmospheric design.
 * Accessible at /landingpagegame_progress_futur
 */
export default function LandingPageV3() {

    return (
        <div className="v2-theme-root min-h-screen relative">
            <AtmosphericBackground />
            <HeaderV2 />
            <div className="w-full flex flex-col">
                {/* Hero: Title + Alice/Bob + narrative — enhanced glow */}
                <TitleV3 />

                {/* Protocol mission cards — directly visible, no gap */}
                <ProtocolsSectionV2 />

                <div id="about" className="mt-12">
                    <AboutSectionV2 />
                </div>
            </div>

            {/* Brand Signature Watermark — subtle decor in bottom left */}
            <div className="fixed bottom-8 left-8 pointer-events-none opacity-10 hidden xl:block select-none">
                <Image
                    src="/images/QC_icon_black.svg"
                    alt="QC Watermark"
                    width={80}
                    height={80}
                    className="block dark:hidden"
                />
                <Image
                    src="/images/QC_icon_white.svg"
                    alt="QC Watermark"
                    width={80}
                    height={80}
                    className="hidden dark:block"
                />
            </div>

            <FooterV2 />
        </div>
    );
}

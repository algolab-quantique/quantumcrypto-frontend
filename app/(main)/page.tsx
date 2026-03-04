'use client';

import HeaderV3 from '@/components/home-page/v3/header-v3';
import FooterV3 from '@/components/home-page/v3/footer-v3';
import TitleV3 from '@/components/home-page/v3/title-v3';
import ProtocolsSectionV3 from '@/components/home-page/v3/protocols-section-v3';
import AboutSectionV3 from '@/components/home-page/v3/about-section-v3';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';
import Image from 'next/image';

/**
 * Landing Page - V3 Futuristic Experience
 * Main landing page with atmospheric background and glassmorphism.
 */
export default function LandingPageV3() {

    return (
        <div className="v2-theme-root min-h-screen relative">
            <AtmosphericBackground />
            <HeaderV3 />
            <div className="w-full flex flex-col">
                {/* Hero: Title + Alice/Bob + narrative — enhanced glow */}
                <TitleV3 />

                {/* Protocol mission cards — glassmorphism + live pulse */}
                <ProtocolsSectionV3 />

                <div id="about" className="mt-12">
                    <AboutSectionV3 />
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

            <FooterV3 />
        </div>
    );
}

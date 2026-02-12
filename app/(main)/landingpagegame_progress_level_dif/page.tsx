'use client';

import HeaderV2 from '@/components/home-page/v2/header-v2';
import FooterV2 from '@/components/home-page/v2/footer-v2';
import TitleV2 from '@/components/home-page/v2/title-v2';
import ProtocolsSectionV2Locks from '@/components/home-page/v2/protocols-section-v2-locks';
import AboutSection from '@/components/home-page/about-section';
import Image from 'next/image';

/**
 * Visual Signature V2 - QC Lock Icons Variant
 * Same as landingpagegame_progress but uses QC lock icons for difficulty.
 * Accessible at /landingpagegame_progress_level_dif
 */
export default function LandingPageV2Locks() {

    return (
        <div className="v2-theme-root min-h-screen relative">
            <HeaderV2 />
            <div className="w-full flex flex-col">
                {/* Hero: Title + Alice/Bob + narrative — compact */}
                <TitleV2 />

                {/* Protocol mission cards — QC Lock icons for difficulty */}
                <ProtocolsSectionV2Locks />

                <div id="about" className="mt-12">
                    <AboutSection />
                </div>
            </div>
            
            {/* Brand Signature Watermark — subtle decor in bottom left */}
            <div className="fixed bottom-8 left-8 pointer-events-none opacity-10 hidden xl:block select-none">
                {/* Light mode watermark */}
                <Image
                    src="/images/QC_icon_black.svg"
                    alt="QC Watermark"
                    width={80}
                    height={80}
                    className="block dark:hidden"
                />
                {/* Dark mode watermark */}
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

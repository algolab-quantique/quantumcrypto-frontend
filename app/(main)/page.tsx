'use client';

import HeaderV3 from '@/components/home-page/v3/header-v3';
import FooterV3 from '@/components/home-page/v3/footer-v3';
import TitleV3 from '@/components/home-page/v3/title-v3';
import ProtocolsSectionV3 from '@/components/home-page/v3/protocols-section-v3';
import AboutSectionV3 from '@/components/home-page/v3/about-section-v3';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';
import Image from 'next/image';
import { useEffect } from 'react';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import usePlayerStore from '@/store/player-store';

/**
 * Landing Page - V3 Futuristic Experience
 * Main landing page with atmospheric background and glassmorphism.
 */
export default function LandingPageV3() {
    useEffect(() => {
        // 1. Reset player active game flags
        const { setPlayingSolo, setPlayingMultiplayer } = usePlayerStore.getState();
        setPlayingSolo(false);
        setPlayingMultiplayer(false);

        // 2. BB84 **and now E91** completed data is deliberately NOT cleared here
        // (Task 48 D4b, ADR §11 Navigation Invariant): session data is destroyed
        // only by explicit user intent — startFresh (new game / replay) or quit —
        // never as a side-effect of navigation. Keeping the completed checkpoint
        // lets browser Forward back into /{protocol}/play restore the félicitation
        // screen instead of fail-closing.
        //
        // E91 joined BB84 here in Task 40 Phase 3e-3, which is exactly what the
        // previous version of this comment said would happen ("E91/DPS below keep
        // the old clearing until their migration"). Its migration is that phase.
        // Without this, the work in 3e-2 was defeated from here: /e91 kept the
        // completed checkpoint, then Back to '/' wiped it and Forward fail-closed.
        //
        // DPS still clears below — its migration is Phase 4.

        // 3. Check and clean up completed DPS game data
        try {
            const dpsGameRaw = localStorage.getItem('dpsGameData');
            const dpsGame = dpsGameRaw ? JSON.parse(dpsGameRaw) : null;
            if (dpsGame?.gameSuccess === true) {
                clearDPSLocalStorage();
            }
        } catch (e) {
            console.error('Error cleaning DPS storage on landing mount:', e);
        }
    }, []);

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

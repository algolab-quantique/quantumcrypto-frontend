'use client';

import HeaderV3 from '@/components/home-page/v3/header-v3';
import FooterV3 from '@/components/home-page/v3/footer-v3';
import TitleV3 from '@/components/home-page/v3/title-v3';
import ProtocolsSectionV3 from '@/components/home-page/v3/protocols-section-v3';
import AboutSectionV3 from '@/components/home-page/v3/about-section-v3';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';
import Image from 'next/image';
import { useEffect } from 'react';
import { clearBB84LocalStorage } from '@/lib/bb84/utils';
import { clearDPSLocalStorage } from '@/lib/dps/utils';
import { clearE91LocalStorage } from '@/lib/e91/utils';
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

        // 2. Check and clean up completed BB84 game data
        try {
            const bb84GameRaw = localStorage.getItem('bb84GameData');
            const bb84Game = bb84GameRaw ? JSON.parse(bb84GameRaw) : null;
            if (bb84Game?.gameSuccess === true) {
                clearBB84LocalStorage();
            }
        } catch (e) {
            console.error('Error cleaning BB84 storage on landing mount:', e);
        }

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

        // 4. Check and clean up completed E91 game data
        try {
            const e91GameRaw = localStorage.getItem('e91GameData');
            const e91Game = e91GameRaw ? JSON.parse(e91GameRaw) : null;
            if (e91Game?.gameSuccess === true) {
                clearE91LocalStorage();
            }
        } catch (e) {
            console.error('Error cleaning E91 storage on landing mount:', e);
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

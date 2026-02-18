'use client';

import HeaderV3 from '@/components/home-page/v3/header-v3';
import FooterV3 from '@/components/home-page/v3/footer-v3';
import BB84MainV3 from '@/components/bb84/home-page/bb84-game-form-v3';
import { useEffect, useRef, useState } from 'react';
import HowToPlaySection from '@/components/bb84/home-page/how-to-play-section';
import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import ProtocolPageSidebar from '@/components/shared/protocol-page-sidebar';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';
import Image from 'next/image';

export default function BB84Future() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const gameRef = useRef(null);
    const terminologyRef = useRef(null);
    const { localize } = useLanguage();

    const [activeSection, setActiveSection] = useState<string | null>(null);


    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement).closest('a[href]');
            if (target) {
                const sectionId = target.getAttribute('href');
                if (sectionId) {
                    scrollToSection(sectionId);
                }
            }
        };

        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    // Remove highlight after 2 seconds
    useEffect(() => {
        if (activeSection) {
            const timer = setTimeout(() => setActiveSection(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [activeSection]);

    const parseLocalizedText = (text: string | undefined): string => {
        if (!text) return '';

        const processedText = text
            .replace('<link1>', `<a href="#photon" class="text-primary hover:underline font-medium">`)
            .replace('</link1>', `</a>`)
            .replace('<link2>', `<a href="#encryption-key" class="text-primary hover:underline font-medium">`)
            .replace('</link2>', `</a>`)
            .replace('<link3>', `<a href="#public-private" class="text-primary hover:underline font-medium">`)
            .replace('</link3>', `</a>`)
            .replace('<link4>', `<a href="#classical-quantum" class="text-primary hover:underline font-medium">`)
            .replace('</link4>', `</a>`)
            .replace('<link5>', `<a href="#encoding-bit" class="text-primary hover:underline font-medium">`)
            .replace('</link5>', `</a>`)
            .replace('<link6>', `<a href="#orthogonal-basis" class="text-primary hover:underline font-medium">`)
            .replace('</link6>', `</a>`)
            .replace('<link7>', `<a href="#state-disturbance" class="text-primary hover:underline font-medium">`)
            .replace('</link7>', `</a>`)
            .replace('<link8>', `<a href="#detecting-eve" class="text-primary hover:underline font-medium">`)
            .replace('</link8>', `</a>`)

        return processedText;
    };

    const sections = [
        {
            id: '#photon',
            title: localize('component.bb84.about.photon.title'),
            content: localize('component.e91.about.photon'),
        },
        {
            id: '#encryption-key',
            title: localize('component.bb84.about.encryptionKey.title'),
            content: localize('component.bb84.about.encryptionKey'),
        },
        {
            id: '#public-private',
            title: localize('component.bb84.about.publicPrivate.title'),
            content: localize('component.bb84.about.publicPrivate'),
        },
        {
            id: '#classical-quantum',
            title: localize('component.bb84.about.classicalQuantum.title'),
            content: localize('component.bb84.about.classicalQuantum'),
        },
        {
            id: '#encoding-bit',
            title: localize('component.bb84.about.encoding.title'),
            content: localize('component.bb84.about.encoding'),
        },
        {
            id: '#orthogonal-basis',
            title: localize('component.bb84.about.orthogonal.title'),
            content: localize('component.bb84.about.orthogonal'),
        },
        {
            id: '#state-disturbance',
            title: localize('component.bb84.about.disturbance.title'),
            content: localize('component.bb84.about.disturbance'),
        },
        {
            id: '#detecting-eve',
            title: localize('component.bb84.about.eve.title'),
            content: localize('component.bb84.about.eve'),
        },
    ];

    const sidebarItems = [
        { label: 'component.sidebar.play', ref: gameRef },
        { label: 'component.header.howToPlay', ref: howToPlayRef },
        { label: 'component.header.about.bb84', ref: aboutRef },
        { label: 'component.header.guide.terminology', ref: terminologyRef },
    ];

    return (
        <div className="v2-theme-root min-h-screen relative">
            {/* V3 Atmospheric Background — Quantum Photons */}
            <AtmosphericBackground />

            <HeaderV3 />

            <div className="relative">
                <ProtocolPageSidebar items={sidebarItems} />
                <div className="w-full flex flex-col">

                    {/* ═══════════════════════════════════════════
                        GAME FORM SECTION  
                        ═══════════════════════════════════════════ */}
                    <div ref={gameRef}>
                        <BB84MainV3 />
                    </div>

                    <div className="lg:pl-40">

                        {/* ═══════════════════════════════════════════
                            SECTION DIVIDER — Quantum Wave
                            ═══════════════════════════════════════════ */}
                        <div className="relative w-full h-px my-12 mx-auto max-w-4xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
                        </div>

                        {/* ═══════════════════════════════════════════
                            HOW TO PLAY SECTION
                            ═══════════════════════════════════════════ */}
                        <HowToPlaySection ref={howToPlayRef} />

                        {/* ═══════════════════════════════════════════
                            SECTION DIVIDER — Quantum Wave
                            ═══════════════════════════════════════════ */}
                        <div className="relative w-full h-px my-12 mx-auto max-w-4xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
                        </div>

                        {/* ═══════════════════════════════════════════
                            ABOUT SECTION — V3 Glassmorphism
                            ═══════════════════════════════════════════ */}
                        <section ref={aboutRef}
                            className="w-full h-fit mt-8 px-5 md:px-20">
                            <Card className="p-6 md:p-8 mx-auto
                                border border-border/60 bg-card/80 backdrop-blur-sm
                                shadow-lg
                                hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
                                transition-all duration-300">
                                <h1 className="font-bold text-3xl md:text-5xl mb-4">
                                    {localize('component.bb84.aboutTitle')}
                                </h1>
                                <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                                    __html: parseLocalizedText(
                                        localize('component.bb84.about.part1') +
                                        ' <a href="#ref1" class="text-primary hover:underline font-medium">[1]</a>' +
                                        localize('component.bb84.about.part2')
                                    )
                                }} />
                            </Card>
                        </section>

                        {/* ═══════════════════════════════════════════
                            SECTION DIVIDER — Quantum Wave
                            ═══════════════════════════════════════════ */}
                        <div className="relative w-full h-px my-12 mx-auto max-w-4xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
                        </div>

                        {/* ═══════════════════════════════════════════
                            TERMINOLOGY SECTION — V3 Glassmorphism Cards
                            ═══════════════════════════════════════════ */}
                        <section ref={terminologyRef}
                            className="w-full h-fit mt-8 px-5 md:px-20">
                            <h2 className="font-bold text-2xl md:text-3xl mb-8">
                                {localize('component.header.guide.terminology')}
                            </h2>
                            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {sections.map(({ id, title, content }) => (
                                    <Card
                                        key={id}
                                        id={id}
                                        className={cn(
                                            'pt-4 pb-2 mx-auto h-[400px]',
                                            'border border-border/60 bg-card/80 backdrop-blur-sm',
                                            'hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]',
                                            'transition-all duration-300',
                                            activeSection === id && 'ring-2 ring-primary shadow-[0_0_30px_hsl(152,100%,33%,0.3)]'
                                        )}
                                    >
                                        <CardContent className="h-full flex flex-col overflow-y-auto">
                                            <h2 className="text-2xl font-bold mb-4">{title}</h2>

                                            {id === '#encryption-key' ? (
                                                <>
                                                    <p className="text-muted-foreground mb-4">{localize('component.bb84.about.encryptionKey.part1')}</p>
                                                    <div className="mb-4">
                                                        <table className="table-auto border-collapse border border-border/60">
                                                            <thead>
                                                                <tr>
                                                                    <th className="px-4 py-2 border border-border/60 text-left">b0</th>
                                                                    <th className="px-4 py-2 border border-border/60 text-left">b1</th>
                                                                    <th className="px-4 py-2 border border-border/60 text-left">b0 XOR b1 </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <p className="text-muted-foreground mb-4">{localize('component.bb84.about.encryptionKey.part2')}</p>
                                                    <div className="mb-4">
                                                        <table className="table-auto border-collapse border border-border/60">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">{localize('component.bb84.about.encryptionKey.message')}</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">{localize('component.bb84.about.encryptionKey.key')}</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-2 border border-border/60">{localize('component.bb84.about.encryptionKey.cypher')}</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                    <td className="px-4 py-2 border border-border/60">1</td>
                                                                    <td className="px-4 py-2 border border-border/60">0</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <p className="text-muted-foreground mb-4">{localize('component.bb84.about.encryptionKey.part3')}</p>
                                                </>

                                            ) : (
                                                <p className="text-muted-foreground">{content}</p>
                                            )}

                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════
                            REFERENCE SECTION — V3 Styled
                            ═══════════════════════════════════════════ */}
                        <section className="w-full h-fit mt-20 px-5 md:px-20 mb-12" id="references">
                            <div id="ref1" className="border border-border/60 bg-card/80 backdrop-blur-sm p-4 rounded-lg mb-4">
                                <h3 className="font-semibold text-lg mb-2">Référence</h3>
                                <p className="text-sm text-muted-foreground">
                                    <strong>[1]</strong> Bennett C H, Brassard G. &quot;Quantum cryptography: Public key distribution and coin tossing.&quot; In <em>Proceedings of the IEEE International Conference on Computers, Systems and Signal Processing</em>, Bangalore, India, 1984, pp. 175-179.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Brand Signature Watermark — matching V3 landing page */}
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

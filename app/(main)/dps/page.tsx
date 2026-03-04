'use client';

import HeaderV3 from '@/components/home-page/v3/header-v3';
import FooterV3 from '@/components/home-page/v3/footer-v3';
import DPSMainV3 from '@/components/dps/home-page/dps-game-form-v3';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import HowToPlaySectionV3 from '@/components/dps/home-page/how-to-play-section-v3';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { cn, getLanguageCode } from '@/lib/utils';
import Image from 'next/image';
import ProtocolPageSidebar from '@/components/shared/protocol-page-sidebar';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';



export default function DPSFuture() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const gameRef = useRef(null);
    const terminologyRef = useRef(null);
    const { localize } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure MathJax only renders on client side to avoid hydration errors
    useEffect(() => {
        setIsClient(true);
    }, []);

    const scrollToSection = (id: string) => {
        const elementId = id.startsWith('#') ? id.substring(1) : id;
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(elementId); // Trigger glow effect
        }
    };

    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement).closest('a[href]');
            if (target) {
                const sectionId = target.getAttribute('href');
                if (sectionId && sectionId.startsWith('#')) {
                    event.preventDefault();
                    scrollToSection(sectionId);
                }
            }
        };

        // Attach event listener to the document
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

    interface LocalizedImageProps {
        name: string;
        localized?: boolean;
        width?: number;
        height?: number;
        className?: string;
    }

    const LocalizedImage = ({ name, localized = false, width = 500, height = 500, className }: LocalizedImageProps) => {
        const { language } = useLanguage();
        const lang = getLanguageCode(language);
        const themeSuffix = isClient ? (isDark ? 'bb' : 'wb') : 'wb';

        const src = localized
            ? `/images/${name}_${themeSuffix}_${lang}.png`
            : `/images/${name}_${themeSuffix}.svg`;

        return <Image src={src} alt={name} width={width} height={height} className={`${className} object-contain`} />;
    };

    const mathJaxConfig = {
        loader: { load: ['[tex]/color'] },
        tex: { packages: { '[+]': ['color'] } },
    };

    const parseLocalizedText = (text: string | undefined): string => {
        if (!text) return '';

        const processedText = text
            .replace('<link1>', `<a href="#encryption-keys" class="text-primary hover:underline font-medium">`)
            .replace('</link1>', `</a>`)
            .replace('<link2>', `<a href="#polarization" class="text-primary hover:underline font-medium">`)
            .replace('</link2>', `</a>`)
            .replace('<link3>', `<a href="#photons" class="text-primary hover:underline font-medium">`)
            .replace('</link3>', `</a>`)
            .replace('<link4>', `<a href="#phase" class="text-primary hover:underline font-medium">`)
            .replace('</link4>', `</a>`)
            .replace('<link5>', `<a href="#pulse-train" class="text-primary hover:underline font-medium">`)
            .replace('</link5>', `</a>`)
            .replace('<link6>', `<a href="#pulse" class="text-primary hover:underline font-medium">`)
            .replace('</link6>', `</a>`)
            .replace('<link7>', `<a href="#beamsplitter" class="text-primary hover:underline font-medium">`)
            .replace('</link7>', `</a>`)
            .replace('<link8>', `<a href="#quantum-superposition" class="text-primary hover:underline font-medium">`)
            .replace('</link8>', `</a>`)
            .replace('<link9>', `<a href="#phase-shift" class="text-primary hover:underline font-medium">`)
            .replace('</link9>', `</a>`)
            .replace('<link10>', `<a href="#interferometer" class="text-primary hover:underline font-medium">`)
            .replace('</link10>', `</a>`)
            .replace('<link11>', `<a href="#unitary-operator" class="text-primary hover:underline font-medium">`)
            .replace('</link11>', `</a>`);

        return processedText;
    };

    const sections = [
        {
            id: 'encryption-keys',
            title: localize('component.dps.about.cles-chiffrement.title'),
            content: localize('component.e91.about.encryptionKey'),
        },
        {
            id: 'polarization',
            title: localize('component.dps.about.polarisation.title'),
            content: localize('component.dps.about.polarisation'),
        },
        {
            id: 'photons',
            title: localize('component.dps.about.photons.title'),
            content: localize('component.e91.about.photon'),
        },
        {
            id: 'phase',
            title: localize('component.dps.about.phases.title'),
            content: isClient ? (
                <div className="space-y-4">
                    <p>{localize('component.dps.about.phases.part1')}</p>

                    <div className="text-center my-4">
                        <MathJax>{localize('component.dps.about.phases.equation')}</MathJax>
                    </div>

                    <p>{localize('component.dps.about.phases.part2')}</p>
                </div>
            ) : null,
        },
        {
            id: 'pulse-train',
            title: localize('component.dps.about.train-impulsions.title'),
            content: localize('component.dps.about.train-impulsions'),
        },
        {
            id: 'pulse',
            title: localize('component.dps.about.impulsion_definition.title'),
            content: localize('component.dps.about.impulsion_definition.content'),
        },
        {
            id: 'beamsplitter',
            title: localize('component.dps.about.miroirs-semi-reflechissants.title'),
            content: localize('component.dps.about.miroirs-semi-reflechissants'),
        },
        {
            id: 'quantum-superposition',
            title: localize('component.dps.about.etat-superposition.title'),
            content: localize('component.dps.about.etat-superposition'),
        },
        {
            id: 'phase-shift',
            title: localize('component.dps.about.dephasage.title'),
            content: localize('component.dps.about.dephasage'),
        },
        {
            id: 'interferometer',
            title: localize('component.dps.about.interferometre.title'),
            content: localize('component.dps.about.interferometre'),
        },
        {
            id: 'unitary-operator',
            title: localize('component.dps.about.operateur-unitaire.title'),
            content: localize('component.dps.about.operateur-unitaire'),
        },
    ];




    const sidebarItems = [
        { label: 'component.sidebar.play', ref: gameRef },
        { label: 'component.header.howToPlay', ref: howToPlayRef },
        { label: 'component.header.about.dps', ref: aboutRef },
        { label: 'component.header.guide.terminology', ref: terminologyRef },
    ];

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="v2-theme-root min-h-screen relative">
                <AtmosphericBackground />
                <HeaderV3 />
                <div className="relative">
                    <ProtocolPageSidebar items={sidebarItems} />
                    <div className="w-full flex flex-col">
                        <div ref={gameRef}>
                            <DPSMainV3 />
                        </div>
                        <div className="lg:pl-40">
                            {/* ═══════════════════════════════════════════
                            SECTION DIVIDER — Quantum Wave
                            ═══════════════════════════════════════════ */}
                            <div className="relative w-full h-px my-12 mx-auto max-w-4xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
                            </div>

                            <HowToPlaySectionV3 ref={howToPlayRef} />

                            {/* ═══════════════════════════════════════════
                            SECTION DIVIDER — Quantum Wave
                            ═══════════════════════════════════════════ */}
                            <div className="relative w-full h-px my-12 mx-auto max-w-4xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
                            </div>
                            <section ref={aboutRef} className="w-full h-fit mt-8 px-5 md:px-20">
                                <Card className="p-6 md:p-8 mx-auto border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)] transition-all duration-300">
                                    <CardContent>
                                        <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize('component.header.about.dps')}</h1>
                                        <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                                            __html: parseLocalizedText(
                                                localize('component.dps.about.part1.0') +
                                                '<a href="#ref1" class="text-primary hover:underline font-medium">[1]</a>' +
                                                localize('component.dps.about.part1.1') +
                                                localize('component.dps.about.part1.2') +
                                                localize('component.dps.about.part1.3')
                                            )
                                        }} />
                                        <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                                            __html: parseLocalizedText(localize('component.dps.about.part2'))
                                        }} />
                                    </CardContent>
                                </Card>
                                <Card className="p-6 md:p-8 mx-auto border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)] transition-all duration-300">
                                    <CardContent>
                                        <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                                            __html: parseLocalizedText(localize('component.dps.about.part3'))
                                        }} />
                                        <div className='flex justify-center mb-4 mt-4'>
                                            <LocalizedImage
                                                name="alice"
                                                localized
                                                width={650}
                                                height={450}
                                                className="w-90 h-90 xl:w-85 xl:h-85 rounded"
                                            />
                                        </div>
                                        <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                                            __html: parseLocalizedText(
                                                localize('component.dps.about.part4') +
                                                '<span class="italic font-bold">A</span>' +
                                                localize('component.dps.about.and') +
                                                '<span class="italic font-bold"> B</span>' +
                                                localize('component.dps.about.part5') +
                                                '<span class="italic font-bold">B</span>' +
                                                localize('component.dps.about.and') +
                                                '<span class="italic font-bold"> C. </span>' +
                                                localize('component.dps.about.part6') +
                                                '<span class="italic font-bold"> B </span>' +
                                                '<span> &#40; </span>' +
                                                '<span class="italic font-bold"> C </span>' +
                                                '<span> &#41; </span>' +
                                                localize('component.dps.about.part7') +
                                                '<span class="italic font-bold"> A</span>' +
                                                '<span> &#40; </span>' +
                                                '<span class="italic font-bold"> B </span>' +
                                                '<span> &#41;. </span>'
                                            )
                                        }} />
                                    </CardContent>
                                </Card>
                                <Card className="p-6 md:p-8 mx-auto border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)] transition-all duration-300">
                                    <CardContent>
                                        <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                                            __html: parseLocalizedText(localize('component.dps.about.part8'))
                                        }} />

                                        <MathJax className="text-lg mb-4">
                                            {`\\[
                                \\left| \\psi_{\\text{photon}} \\right\\rangle = \\frac{1}{\\sqrt{3}} \\left( \\left| \\psi_A \\right\\rangle + \\left| \\psi_B \\right\\rangle + \\left| \\psi_C \\right\\rangle \\right),
                            \\]`}
                                        </MathJax>

                                        <p className="text-lg mb-4">{localize('component.dps.about.part9')}</p>
                                        <MathJax className="text-lg mb-4">
                                            {`\\[
                                \\lvert \\psi \\rangle = \\frac{1}{\\sqrt{3}}\\left( \\lvert 0 \\rangle + \\lvert 1 \\rangle + \\lvert 2 \\rangle \\right),
                                \\]`}
                                        </MathJax>
                                        <p className="text-lg mb-4">{localize('component.dps.about.with')}

                                            <MathJax inline>{`\\( \\left| 0 \\right\\rangle \\)`}</MathJax>
                                            {localize('component.dps.about.part10')}

                                            <MathJax inline>{`\\( \\left| 1 \\right\\rangle \\)`}</MathJax>
                                            {localize('component.dps.about.part11')}

                                            <MathJax inline>{`\\( \\left| 2 \\right\\rangle \\)`}</MathJax>
                                            <span dangerouslySetInnerHTML={{ __html: parseLocalizedText(localize('component.dps.about.part12')) }} />
                                        </p>
                                        <div className="mb-4 flex justify-center">
                                            <table className="table-auto border-collapse border border-border/60 text-center">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-2 py-1">bit 2</th>
                                                        <th className="border px-2 py-1">bit 1</th>
                                                        <th className="border px-2 py-1">bit 0</th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 2</th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 1</th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 0</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="zero" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="zero" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="zero" width={50} height={50} /></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="zero" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="pi" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="zero" width={50} height={50} /></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="pi" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="pi" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="zero" width={50} height={50} /></div></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="pi" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="pi" width={50} height={50} /></div></td>
                                                        <td className="border px-2 py-1"><div className="flex justify-center"><LocalizedImage name="pi" width={50} height={50} /></div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-lg mt-4">
                                            {localize('component.dps.about.part13')}
                                            <MathJax inline>
                                                {`\\( (-1)^0 = 1 \\)`}
                                            </MathJax>
                                            {localize('component.dps.about.and')}
                                            <MathJax inline>
                                                {`\\( (-1)^1 = -1, \\)`}
                                            </MathJax>
                                            {localize('component.dps.about.part14')}
                                            <span className='italic font-bold'>b<sub>0</sub></span>
                                            <span>, </span>
                                            <span className='italic font-bold'>b<sub>1</sub></span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>b<sub>2</sub></span>
                                            {localize('component.dps.about.part15')}
                                        </p>
                                        <MathJax>
                                            {`\\[
                                \\left| \\psi_{\\text{photon}} \\right\\rangle = \\frac{1}{\\sqrt{3}} 
                                \\left( (-1)^{b_0} \\left| 0 \\right\\rangle + (-1)^{b_1} \\left| 1 \\right\\rangle + (-1)^{b_2} \\left| 2 \\right\\rangle \\right).
                            \\]`}
                                        </MathJax>
                                    </CardContent>
                                </Card>
                                <Card className="p-6 md:p-8 mx-auto border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)] transition-all duration-300">
                                    <CardContent>
                                        <div className="text-lg mb-4 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: parseLocalizedText(localize('component.dps.about.part16')) }} />
                                        <div className='flex justify-center mb-4 mt-4'>
                                            <LocalizedImage
                                                name="bob"
                                                localized
                                                width={650}
                                                height={450}
                                                className="w-90 h-90 xl:w-85 xl:h-85 rounded"
                                            />
                                        </div>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part17')}
                                            <span className='italic font-bold'>D</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>E</span>
                                            {localize('component.dps.about.part18')}
                                            <span className='italic font-bold'>E</span>
                                            {localize('component.dps.about.part19')}
                                            <span className='italic font-bold'>D. </span>
                                            {localize('component.dps.about.part20')}
                                        </p>
                                        <MathJax className="text-lg mb-4">
                                            {`\\[
                                \\left| \\psi_D \\right\\rangle = \\frac{1}{\\sqrt{3}} 
                                \\left( (-1)^{b_0} \\left| 0 \\right\\rangle + (-1)^{b_1} \\left| 1 \\right\\rangle + (-1)^{b_2} \\left| 2 \\right\\rangle \\right)
                            \\]`}
                                        </MathJax>

                                        <MathJax className="text-lg mb-4">
                                            {`\\[
                                \\left| \\psi_E \\right\\rangle = \\frac{1}{\\sqrt{3}} 
                                \\left( (-1)^{b_0} \\left| 1 \\right\\rangle + (-1)^{b_1} \\left| 2 \\right\\rangle + (-1)^{b_2} \\left| 3 \\right\\rangle \\right)
                            \\]`}
                                        </MathJax>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part21')}
                                            <span className='italic font-bold'>b<sub>0</sub> = 0</span>
                                            <span>, </span>
                                            <span className='italic font-bold'>b<sub>1</sub> = 0</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>b<sub>2</sub> = 1. </span>
                                            {localize('component.dps.about.part22')}
                                        </p>
                                        <div className="mb-4 flex justify-center">
                                            <table className="table-auto border-collapse border border-border/60 text-center">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-2 py-1"></th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 3</th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 2</th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 1</th>
                                                        <th className="border px-2 py-1">{localize('component.dps.about.impulsion_word')} 0</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-2 py-1 italic">{localize('component.dps.about.route')} D</td>
                                                        <td className="border"></td>
                                                        <td className="border px-2 py-1">
                                                            <div className="flex justify-center">
                                                                <LocalizedImage name="pi" width={50} height={50} />
                                                            </div>
                                                        </td>
                                                        <td className="border px-2 py-1">
                                                            <div className="flex justify-center">
                                                                <LocalizedImage name="zero" width={50} height={50} />
                                                            </div>
                                                        </td>
                                                        <td className="border px-2 py-1">
                                                            <div className="flex justify-center">
                                                                <LocalizedImage name="zero" width={50} height={50} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1 italic">{localize('component.dps.about.route')} E</td>
                                                        <td className="border px-2 py-1">
                                                            <div className="flex justify-center">
                                                                <LocalizedImage name="pi" width={50} height={50} />
                                                            </div>
                                                        </td>
                                                        <td className="border px-2 py-1">
                                                            <div className="flex justify-center">
                                                                <LocalizedImage name="zero" width={50} height={50} />
                                                            </div>
                                                        </td>
                                                        <td className="border px-2 py-1">
                                                            <div className="flex justify-center">
                                                                <LocalizedImage name="zero" width={50} height={50} />
                                                            </div>
                                                        </td>
                                                        <td className="border"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part23')}
                                            <span className='italic font-bold'>A</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>B</span>
                                            {localize('component.dps.about.part24')}
                                        </p>
                                        <div className='flex justify-center mb-4 mt-4'>
                                            {/* TODO: Black image background is white, similar to white image, so theme switching is barely noticeable - need to change maybe */}
                                            {isClient ? (
                                                <Image
                                                    key="beamsplitter"
                                                    src={isDark ? "/images/beamsplitter_bb.png" : "/images/beamsplitter_wb.png"}
                                                    alt="beamsplitter"
                                                    width={300}
                                                    height={200}
                                                />
                                            ) : (
                                                <Image
                                                    key="beamsplitter-fallback"
                                                    src="/images/beamsplitter_wb.png"
                                                    alt="beamsplitter"
                                                    width={300}
                                                    height={200}
                                                />
                                            )}
                                        </div>
                                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{
                                            __html: parseLocalizedText(
                                                localize('component.dps.about.part25') +
                                                '<span class="italic font-bold">U<sub>bs</sub></span>' +
                                                localize('component.dps.about.part26')
                                            )
                                        }} />
                                        <MathJax className="text-lg mb-4">
                                            {`\\[
                            U_{\\text{bs}} \\left| \\psi_{\\text{in}} \\right\\rangle = \\left| \\psi_{\\text{out}} \\right\\rangle
                        \\]`}
                                        </MathJax>

                                        <MathJax className="text-lg mb-4">
                                            {`\\[
                            \\frac{1}{\\sqrt{2}} 
                            \\begin{bmatrix}
                            1 & 1 \\\\
                            1 & -1
                            \\end{bmatrix}
                            \\begin{bmatrix}
                            a \\\\
                            b
                            \\end{bmatrix}
                            =
                            \\begin{bmatrix}
                            c \\\\
                            d
                            \\end{bmatrix}
                        \\]`}
                                        </MathJax>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.where')}
                                            <span className='italic font-bold'>a</span>
                                            <span>, </span>
                                            <span className='italic font-bold'>b</span>
                                            <span>, </span>
                                            <span className='italic font-bold'> c</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'> d</span>
                                            {localize('component.dps.about.part27')}
                                            <MathJax inline>{`\\( \\left| A \\right\\rangle \\)`}</MathJax>
                                            <span>, </span>
                                            <MathJax inline>{`\\( \\left| B \\right\\rangle \\)`}</MathJax>
                                            <span>, </span>
                                            <MathJax inline>{`\\( \\left| C \\right\\rangle \\)`}</MathJax>
                                            {localize('component.dps.about.and')}
                                            <MathJax inline>{`\\( \\left| D \\right\\rangle \\)`}</MathJax>
                                            {localize('component.dps.about.part28')}
                                        </p>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part29')}
                                            <span className="text-3xl">
                                                <MathJax inline>{`\\( c = \\frac{a + b}{\\sqrt{2}} \\)`}</MathJax>
                                            </span>
                                            {localize('component.dps.about.and')}
                                            <span className="text-3xl">
                                                <MathJax inline>{`\\( d = \\frac{a - b}{\\sqrt{2}} \\)`}</MathJax>.
                                            </span>
                                        </p>

                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part30')}  <MathJax inline>{`\\( \\left| \\psi_D \\right\\rangle \\)`}</MathJax> {localize('component.dps.about.and')}
                                            <MathJax inline>{`\\( \\left| \\psi_E \\right\\rangle \\)`}</MathJax> {localize('component.dps.about.part31')}
                                        </p>
                                        <div className="mb-4 flex justify-center">
                                            <table className="table-auto border-collapse border border-border/60 text-center text-sm mb-6">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-2 py-1"></th>
                                                        <th className="border px-2 py-1" colSpan={2}>
                                                            <MathJax inline>{`\\( \\left| \\psi_{\\text{in}} \\right\\rangle \\)`}</MathJax>
                                                        </th>
                                                        <th className="border px-2 py-1" colSpan={2}>
                                                            <MathJax inline>{`\\( \\left| \\psi_{\\text{out}} \\right\\rangle \\)`}</MathJax>
                                                        </th>

                                                    </tr>
                                                    <tr>
                                                        <th className="border px-2 py-1">Temps</th>
                                                        <th className="border px-2 py-1">D</th>
                                                        <th className="border px-2 py-1">E</th>
                                                        <th className="border px-2 py-1">DET0</th>
                                                        <th className="border px-2 py-1">DET1</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-2 py-1">T0</td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( (-1)^{b_0} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_0} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( -\\frac{1}{\\sqrt{2}} (-1)^{b_0} \\)`}</MathJax></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">T1</td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_1} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_0} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{2} ((-1)^{b_0} + (-1)^{b_1}) \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{2} ((-1)^{b_0} - (-1)^{b_1}) \\)`}</MathJax></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">T2</td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_2} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_1} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{2} ((-1)^{b_1} + (-1)^{b_2}) \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{2} ((-1)^{b_1} - (-1)^{b_2}) \\)`}</MathJax></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">T3</td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_2} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_2} \\)`}</MathJax></td>
                                                        <td className="border px-2 py-1"><MathJax inline>{`\\( \\frac{1}{\\sqrt{2}} (-1)^{b_2} \\)`}</MathJax></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part32')}
                                            <span className='italic font-bold'>T0</span>
                                            {localize('component.dps.about.or')}
                                            <span className='italic font-bold'>T3</span>
                                            <span>, </span>
                                            {localize('component.dps.about.part33')}
                                            {localize('component.dps.about.part34')}
                                            {localize('component.dps.about.part35')}
                                        </p>

                                        <MathJax className="text-2xl mb-4">
                                            {`\\[
                                \\left( \\frac{(-1)^{b_0}}{\\sqrt{2}} \\right)^2 = 
                                \\left( \\frac{-(-1)^{b_0}}{\\sqrt{2}} \\right)^2 = 
                                \\left( \\frac{(-1)^{b_2}}{\\sqrt{2}} \\right)^2 = 
                                \\left( \\frac{-(-1)^{b_2}}{\\sqrt{2}} \\right)^2 = \\frac{1}{2}.
                            \\]`}
                                        </MathJax>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part36')}
                                            <span className='italic font-bold'>T1</span>
                                            {localize('component.dps.about.or')}
                                            <span className='italic font-bold'>T2 , </span>
                                            {localize('component.dps.about.part37')}
                                            <MathJax inline>{`\\( b_0 \\)`}</MathJax>
                                            <span> , </span>
                                            <MathJax inline>{`\\( b_1 \\)`}</MathJax>
                                            {localize('component.dps.about.and')}
                                            <MathJax inline>{`\\( b_2 \\)`}</MathJax>
                                            {localize('component.dps.about.part38')}
                                            <span className='italic font-bold'>T1</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>T2 </span>
                                            {localize('component.dps.about.part39')}
                                            <span className='italic font-bold'>T0</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>T3 </span>
                                            {localize('component.dps.about.part40')}.
                                        </p>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part41')} <MathJax inline>{`\\( b_0 = 0,\\ b_1 = 0,\\ b_2 = 1 \\)`}</MathJax>.
                                            {localize('component.dps.about.part42')}  <span> :</span>
                                        </p>
                                        <div className="mb-4 flex justify-center">
                                            <table className="table-auto border-collapse border border-border/60 text-center mb-4 text-sm">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-2 py-1"></th>
                                                        <th className="border px-2 py-1" colSpan={2}>
                                                            <MathJax inline>{`\\( \\left| \\psi_{\\text{out}} \\right\\rangle \\)`}</MathJax>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className="border px-2 py-1">Temps</th>
                                                        <th className="border px-2 py-1">DET0</th>
                                                        <th className="border px-2 py-1">DET1</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-2 py-1">T1</td>
                                                        <td className="border px-2 py-1">1</td>
                                                        <td className="border px-2 py-1">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-2 py-1">T2</td>
                                                        <td className="border px-2 py-1">0</td>
                                                        <td className="border px-2 py-1">-1</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-lg">
                                            {localize('component.dps.about.part43')}
                                            <MathJax inline>{`\\( b_0 = b_1 \\)`}</MathJax>
                                            <span>, </span>
                                            {localize('component.dps.about.part44')}

                                            <span className='italic font-bold'>T1</span>
                                            <span>, </span>
                                            {localize('component.dps.about.part45')}
                                            <MathJax inline>{`\\( b_0 \\neq b_1 \\)`}</MathJax>

                                            {localize('component.dps.about.part46')}
                                            <MathJax inline>{`\\( \\pm\\pi \\)`}</MathJax>
                                            {localize('component.dps.about.part47')}

                                            <span className='italic font-bold'>T1 </span>
                                            <span>, </span>
                                            {localize('component.dps.about.part48')}


                                        </p>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part49')}
                                            <span className='italic font-bold'>T2 </span>
                                            <span>, </span>
                                            {localize('component.dps.about.part50')}
                                            <MathJax inline>{`\\( b_1 = b_2 \\)`}</MathJax>
                                            {localize('component.dps.about.part51')}
                                        </p>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part52')}
                                        </p>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part53')}
                                            <span className='italic font-bold'>b<sub>0</sub></span>
                                            <span>, </span>
                                            <span className='italic font-bold'>b<sub>1</sub></span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>b<sub>2</sub></span>
                                            {localize('component.dps.about.part54')}
                                        </p>

                                    </CardContent>
                                </Card>
                                <Card className="p-6 md:p-8 mx-auto border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)] transition-all duration-300">
                                    <CardContent>
                                        <p className="text-lg mb-4 text-muted-foreground leading-relaxed">
                                            {localize('component.dps.about.part55')}
                                        </p>
                                        <div className="mb-4 flex justify-center">
                                            <table className="table-auto border-collapse border border-border/60 text-center mb-4 text-sm">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-border/60 px-2 py-1">{localize('component.dps.about.photon')}</th>
                                                        <th className="border border-border/60 px-2 py-1">
                                                            <span className='italic font-bold'>b<sub>2</sub></span>
                                                        </th>
                                                        <th className="border border-border/60 px-2 py-1">
                                                            <span className='italic font-bold'>b<sub>1</sub></span>
                                                        </th>
                                                        <th className="border border-border/60 px-2 py-1">
                                                            <span className='italic font-bold'>b<sub>0</sub></span>
                                                        </th>
                                                        <th className="border border-border/60 px-2 py-1">{localize('component.dps.about.detectionTime')}</th>
                                                        <th className="border border-border/60 px-2 py-1">{localize('component.dps.about.keyBit')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="bg-muted/60">
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">T0</td>
                                                        <td className="border border-border/60 px-2 py-1">–</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-border/60 px-2 py-1">2</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">T2</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-border/60 px-2 py-1">3</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">T1</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-border/60 px-2 py-1">4</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">T1</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                    </tr>
                                                    <tr className="bg-muted/60">
                                                        <td className="border border-border/60 px-2 py-1">5</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">T3</td>
                                                        <td className="border border-border/60 px-2 py-1">–</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-border/60 px-2 py-1">6</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">1</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                        <td className="border border-border/60 px-2 py-1">T2</td>
                                                        <td className="border border-border/60 px-2 py-1">0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-lg mb-4">
                                            {localize('component.dps.about.part56')}
                                            <span className='italic font-bold'>T0</span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>T3 </span>
                                            {localize('component.dps.about.part57')}
                                            <span className='italic font-bold'>T2</span>
                                            <span>, </span>
                                            {localize('component.dps.about.part58')}
                                            <span>, </span>
                                            <span className='italic font-bold'>b<sub>1</sub></span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>b<sub>2</sub></span>
                                            {localize('component.dps.about.part59')}
                                            <span className='italic font-bold'>T1</span>
                                            <span>, </span>
                                            {localize('component.dps.about.part60')}
                                            <span className='italic font-bold'>b<sub>0</sub></span>
                                            {localize('component.dps.about.and')}
                                            <span className='italic font-bold'>b<sub>1</sub></span>
                                            {localize('component.dps.about.part61')}


                                        </p>
                                    </CardContent>
                                </Card>

                            </section>
                            {/* Definitions grid section */}
                            <section ref={terminologyRef}
                                className="w-full h-fit mt-16 px-5 md:px-20 mb-12">
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
                                                <div className="text-muted-foreground">
                                                    {typeof content === 'string' ? <p>{content}</p> : content}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            {/* ═══════════════════════════════════════════
                            SECTION DIVIDER — Quantum Wave
                            ═══════════════════════════════════════════ */}
                            <div className="relative w-full h-px my-12 mx-auto max-w-4xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
                            </div>

                            {/* ═══════════════════════════════════════════
                            REFERENCE SECTION — V3 Styled
                            ═══════════════════════════════════════════ */}
                            <section className="w-full h-fit mt-8 px-5 md:px-20 mb-12" id="references">
                                <div id="ref1" className="border border-border/60 bg-card/80 backdrop-blur-sm p-4 rounded-lg mb-4 hover:border-primary/30 transition-all duration-300">
                                    <h3 className="font-semibold text-lg mb-2 text-primary">Référence</h3>
                                    <p className="text-sm text-muted-foreground">
                                        <strong>[1]</strong> K. Inoue, E. Waks, and Y. Yamamoto, &quot;Differential-phase-shift quantum key distribution,&quot; <em>Phys. Rev. Lett.</em>, vol. 89, no. 3, p. 037902, Jul. 2002.
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
        </MathJaxContext>
    );
}
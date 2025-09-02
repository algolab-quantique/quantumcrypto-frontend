'use client';

import Header from '@/components/shared/header';
import DPSMain from '@/components/dps/home-page/dps-game-form';
import Footer from '@/components/shared/footer';
import {useEffect, useRef, useState} from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import HowToPlaySection from '@/components/dps/home-page/how-to-play-section';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { cn, getLanguageCode } from '@/lib/utils';



export default function DPS() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
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
            element.scrollIntoView({behavior: 'smooth', block: 'start'});
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

    interface LocalizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    name: string;
    localized?: boolean;
    }
      
    const LocalizedImage = ({ name, localized = false, ...props }: LocalizedImageProps) => {
        const { language } = useLanguage();
        const lang = getLanguageCode(language);
        const themeSuffix = isClient ? (isDark ? 'bb' : 'wb') : 'wb';
        
        const src = localized
            ? `/images/${name}_${themeSuffix}_${lang}.png`
            : `/images/${name}_${themeSuffix}.svg`;
        
        return <img src={src} alt={name} {...props} />;
    };

    const mathJaxConfig = {
        loader: { load: ['[tex]/color'] },
        tex: { packages: { '[+]': ['color'] } },
    };

    const parseLocalizedText = (text: string | undefined): string => {
        if (!text) return '';

        const processedText = text
            .replace('<link1>', `<a href="#encryption-keys" class="text-blue-500 hover:underline">`)
            .replace('</link1>', `</a>`)
            .replace('<link2>', `<a href="#polarization" class="text-blue-500 hover:underline">`)
            .replace('</link2>', `</a>`)
            .replace('<link3>', `<a href="#photons" class="text-blue-500 hover:underline">`)
            .replace('</link3>', `</a>`)
            .replace('<link4>', `<a href="#phase" class="text-blue-500 hover:underline">`)
            .replace('</link4>', `</a>`)
            .replace('<link5>', `<a href="#pulse-train" class="text-blue-500 hover:underline">`)
            .replace('</link5>', `</a>`)
            .replace('<link6>', `<a href="#pulse" class="text-blue-500 hover:underline">`)
            .replace('</link6>', `</a>`)
            .replace('<link7>', `<a href="#beamsplitter" class="text-blue-500 hover:underline">`)
            .replace('</link7>', `</a>`)
            .replace('<link8>', `<a href="#quantum-superposition" class="text-blue-500 hover:underline">`)
            .replace('</link8>', `</a>`)
            .replace('<link9>', `<a href="#phase-shift" class="text-blue-500 hover:underline">`)
            .replace('</link9>', `</a>`)
            .replace('<link10>', `<a href="#interferometer" class="text-blue-500 hover:underline">`)
            .replace('</link10>', `</a>`)
            .replace('<link11>', `<a href="#unitary-operator" class="text-blue-500 hover:underline">`)
            .replace('</link11>', `</a>`);

        return processedText;
    };

    const sections = [
        {
            id: 'encryption-keys',
            title: localize('component.dps.about.cles-chiffrement.title'),
            content: localize('component.dps.about.cles-chiffrement'),
        },
        {
            id: 'polarization',
            title: localize('component.dps.about.polarisation.title'),
            content: localize('component.dps.about.polarisation'),
        },
        {
            id: 'photons',
            title: localize('component.dps.about.photons.title'),
            content: localize('component.dps.about.photons'),
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

    const headerLinks = [
        {
            label: 'component.header.howToPlay',
            ref: howToPlayRef,
        },
        {
            label: 'component.header.about.dps',
            ref: aboutRef,
        },
    ]

    return (
        <MathJaxContext config={mathJaxConfig}>
            <Header links={headerLinks} />
            <DPSMain/>
            <HowToPlaySection ref={howToPlayRef} />
            <section ref={aboutRef} className="w-full h-fit mt-20 px-5 md:px-20">
                <Card className='pb-2 border-none mx-auto shadow-md'>
                    <CardContent>
                        <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize('component.header.about.dps')}</h1>
                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{
                            __html: parseLocalizedText(
                                localize('component.dps.about.part1.0') +
                                '<a href="#ref1" class="text-blue-500 hover:underline">[1]</a>' +
                                ', ' +
                                localize('component.dps.about.part1.1') +
                                '<span class="italic font-bold">' + localize('component.dps.about.part1.2') + '</span>' +                            
                                ', ' +
                                localize('component.dps.about.part1.3')
                            )
                        }} />
                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{
                            __html: parseLocalizedText(localize('component.dps.about.part2'))
                        }} />
                    </CardContent>   
                </Card>
                <Card className='pb-2 border-none mx-auto shadow-md'>
                    <CardContent>
                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{
                            __html: parseLocalizedText(localize('component.dps.about.part3'))
                        }} />
                        <div className="text-lg mb-4">
                            <span className='italic font-bold'>A,</span>
                            <span className='italic font-bold'> B</span>
                            {localize('component.dps.about.and')}
                            <span className='italic font-bold'> C</span>
                        </div>
                        <div className='flex justify-center mb-4 mt-4'>
                            <LocalizedImage name="alice" localized className="w-90 h-90 xl:w-85 xl:h-85 rounded" />
                        </div>
                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{
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
                <Card className='pb-2 border-none mx-auto shadow-md'>
                    <CardContent>
                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{
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
                            <table className="table-auto border-collapse border border-gray-300 text-center">
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
                <Card className='pb-2 border-none mx-auto shadow-md'>
                    <CardContent>
                        <div className="text-lg mb-4" dangerouslySetInnerHTML={{ __html: parseLocalizedText(localize('component.dps.about.part16')) }} />
                        <div className='flex justify-center mb-4 mt-4'>
                            <LocalizedImage name="bob" localized className="w-90 h-90 xl:w-85 xl:h-85 rounded" />
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
                            <table className="table-auto border-collapse border border-gray-300 text-center">
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
                                <img
                                    key="beamsplitter"
                                    src={isDark ? "/images/beamsplitter_bb.png" : "/images/beamsplitter_wb.png"}
                                    alt="beamsplitter"
                                />
                            ) : (
                                <img
                                    key="beamsplitter-fallback"
                                    src="/images/beamsplitter_wb.png"
                                    alt="beamsplitter"
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
                            <table className="table-auto border-collapse border border-black text-center text-sm mb-6">
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
                            <table className="table-auto border-collapse border border-black text-center mb-4 text-sm">
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
                <Card  className='pb-2 border-none mx-auto shadow-md'>
                    <CardContent>
                        <p className="text-lg mb-4">
                            {localize('component.dps.about.part55')}
                        </p>
                        <div className="mb-4 flex justify-center">
                            <table className="table-auto border-collapse border border-black text-center mb-4 text-sm">
                                <thead>
                                    <tr>
                                    <th className="border border-black px-2 py-1">{localize('component.dps.about.photon')}</th>
                                    <th className="border border-black px-2 py-1">
                                        <span className='italic font-bold'>b<sub>2</sub></span>
                                    </th>
                                    <th className="border border-black px-2 py-1">
                                        <span className='italic font-bold'>b<sub>1</sub></span>
                                    </th>
                                    <th className="border border-black px-2 py-1">
                                        <span className='italic font-bold'>b<sub>0</sub></span>
                                    </th>
                                    <th className="border border-black px-2 py-1">{localize('component.dps.about.detectionTime')}</th>
                                    <th className="border border-black px-2 py-1">{localize('component.dps.about.keyBit')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-500">
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">T0</td>
                                    <td className="border border-black px-2 py-1">–</td>
                                    </tr>
                                    <tr>
                                    <td className="border border-black px-2 py-1">2</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">T2</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    </tr>
                                    <tr>
                                    <td className="border border-black px-2 py-1">3</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">T1</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    </tr>
                                    <tr>
                                    <td className="border border-black px-2 py-1">4</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">T1</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    </tr>
                                    <tr className="bg-gray-500">
                                    <td className="border border-black px-2 py-1">5</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">T3</td>
                                    <td className="border border-black px-2 py-1">–</td>
                                    </tr>
                                    <tr>
                                    <td className="border border-black px-2 py-1">6</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">1</td>
                                    <td className="border border-black px-2 py-1">0</td>
                                    <td className="border border-black px-2 py-1">T2</td>
                                    <td className="border border-black px-2 py-1">0</td>
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
                
                {/* Definitions grid section - like E91 */}
                <div className="pt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {sections.map(({id, title, content}) => (
                        <Card
                            key={id}
                            id={id}
                            className={cn(
                                'pt-4 pb-2 border-none mx-auto shadow-md h-[400px]',
                                activeSection === id && 'ring-4 ring-blue-400'
                            )}
                        >
                            <CardContent className="h-full flex flex-col overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                                <div className="text-gray-400">
                                    {typeof content === 'string' ? <p>{content}</p> : content}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            <section className="w-full h-fit mt-20 px-5 md:px-20" id="references">
                <div id="ref1" className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-lg mb-2">Référence</h3>
                    <p className="text-sm">
                        <strong>[1]</strong> Inoue K, Waks E, Yamamoto Y. "Differential phase shift quantum key distribution." 
                        <em> PRL</em> 89.3 (2002): 037902.
                        <a 
                            href="https://doi.org/10.1103/PhysRevLett.89.037902" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                        >
                            https://doi.org/10.1103/PhysRevLett.89.037902
                        </a>
                    </p>
                </div>
            </section>
            <Footer />
    </MathJaxContext>
    )

}
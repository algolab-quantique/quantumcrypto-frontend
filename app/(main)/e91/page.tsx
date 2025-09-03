'use client';

import Header from '@/components/shared/header';
import E91Main from '@/components/e91/home-page/e91-game-form';
import Footer from '@/components/shared/footer';
import {useEffect, useRef, useState} from 'react';
import HowToPlaySection from '@/components/e91/home-page/how-to-play-section';
import {useLanguage} from '@/components/providers/language-provider';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';

export default function E91() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const {localize} = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const mathJaxConfig = {
        loader: { load: ['[tex]/color'] },
        tex: { packages: { '[+]': ['color'] } },
      };

    // Ensure MathJax only renders on client side to avoid hydration errors
    useEffect(() => {
        setIsClient(true);
    }, []);

    const headerLinks = [
        {
            label: 'component.header.howToPlay',
            ref: howToPlayRef,
        },
        {
            label: 'component.header.about.e91',
            ref: aboutRef,
        },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'start'});
            setActiveSection(id); // Trigger glow effect
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

    const parseLocalizedText = (text: string | undefined): string => {
        if (!text) return '';

        const processedText = text
            .replace('<link1>', `<a href="#photon" class="text-blue-500 hover:underline">`)
            .replace('</link1>', `</a>`)
            .replace('<link2>', `<a href="#encryption-key" class="text-blue-500 hover:underline">`)
            .replace('</link2>', `</a>`)
            .replace('<link3>', `<a href="#public-private" class="text-blue-500 hover:underline">`)
            .replace('</link3>', `</a>`)
            .replace('<link4>', `<a href="#polarization" class="text-blue-500 hover:underline">`)
            .replace('</link4>', `</a>`)
            .replace('<link5>', `<a href="#maximally-entangled" class="text-blue-500 hover:underline">`)
            .replace('</link5>', `</a>`)
            .replace('<link6>', `<a href="#bell-pairs" class="text-blue-500 hover:underline">`)
            .replace('</link6>', `</a>`)
            .replace('<link7>', `<a href="#measurement-basis" class="text-blue-500 hover:underline">`)
            .replace('</link7>', `</a>`)
            .replace('<link8>', `<a href="#bell-inequalities" class="text-blue-500 hover:underline">`)
            .replace('</link8>', `</a>`)
            .replace('<link9>', `<a href="#chsh-inequality" class="text-blue-500 hover:underline">`)
            .replace('</link9>', `</a>`);

        return processedText;
    };

    const sections = [
        {
            id: '#photon',
            title: localize('component.e91.about.photon.title'),
            content: localize('component.e91.about.photon'),
        },
        {
            id: '#encryption-key',
            title: localize('component.e91.about.encryptionKey.title'),
            content: localize('component.e91.about.encryptionKey'),
        },
        {
            id: '#public-private',
            title: localize('component.e91.about.publicPrivate.title'),
            content: localize('component.e91.about.publicPrivate'),
        },
        {
            id: '#polarization',
            title: localize('component.e91.about.polarization.title'),
            content: localize('component.e91.about.polarization'),
        },
        {
            id: '#maximally-entangled',
            title: localize('component.e91.about.maximallyEntangled.title'),
            content: (
                <div className="space-y-4">
                    <p>{localize('component.e91.about.maximallyEntangled.part1')}</p>
                    
                    <p>{localize('component.e91.about.maximallyEntangled.part2')}</p>
                    
                    {isClient && (
                        <div className="text-center my-4">
                            <MathJax>{localize('component.e91.about.maximallyEntangled.equation1')}</MathJax>
                        </div>
                    )}
                    
                    <p>{localize('component.e91.about.maximallyEntangled.part3')}</p>
                    {isClient && <p>
                        <MathJax dynamic>{localize('component.e91.about.maximallyEntangled.part4')}</MathJax>
                    </p>}
                    <p>{localize('component.e91.about.maximallyEntangled.part5')}</p>
                </div>
            ),
        },
        {
            id: '#bell-pairs',
            title: localize('component.e91.about.bellPairs.title'),
            content: (
                <div className="space-y-4">
                    <p>{localize('component.e91.about.bellPairs.part1')}</p>
                    
                    {isClient && (
                        <div className="space-y-2 my-4">
                            <div className="text-center">
                                <MathJax>{localize('component.e91.about.bellPairs.equation1')}</MathJax>
                            </div>
                            <div className="text-center">
                                <MathJax>{localize('component.e91.about.bellPairs.equation2')}</MathJax>
                            </div>
                            <div className="text-center">
                                <MathJax>{localize('component.e91.about.bellPairs.equation3')}</MathJax>
                            </div>
                            <div className="text-center">
                                <MathJax>{localize('component.e91.about.bellPairs.equation4')}</MathJax>
                            </div>
                        </div>
                    )}
                    
                    <p>{localize('component.e91.about.bellPairs.part2')}</p>
                </div>
            ),
        },
        {
            id: '#measurement-basis',
            title: localize('component.e91.about.measurementBasis.title'),
            content: localize('component.e91.about.measurementBasis'),
        },
        {
            id: '#bell-inequalities',
            title: localize('component.e91.about.bellInequalities.title'),
            content: localize('component.e91.about.bellInequalities'),
        },
        {
            id: '#chsh-inequality',
            title: localize('component.e91.about.chshInequality.title'),
            content: localize('component.e91.about.chshInequality'),
        },
    ];

    return (
        <MathJaxContext config={mathJaxConfig}>
            <Header links={headerLinks}/>
            <E91Main/>
            <HowToPlaySection ref={howToPlayRef}/>
            <section ref={aboutRef}
                     className="w-full h-fit mt-20 px-5 md:px-20">
                <Card className="p-6 md:p-8 border-none mx-auto shadow-md">
                    <h1 className="font-bold text-3xl md:text-5xl mb-4">
                        {localize('component.bb84.aboutTitle')}
                    </h1>
                    <p
                        className="mb-4 text-lg text-gray-400"
                    >
                        {localize('component.e91.about.part1.0')}
                        <a href="#reference-1" className="text-blue-500 hover:underline ml-1">[1]</a>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: parseLocalizedText(localize('component.e91.about.part1.1') ?? ''),
                            }}
                        />
                    </p>
                </Card>
                
                {/* Main content card with detailed explanation, figures, and tables */}
                <Card className='pt-4 pb-2 border-none mx-auto shadow-md mt-6'>
                    <CardContent>
                        <div className='flex justify-center mb-4 mt-4'>
                            {isClient ? (
                                <img 
                                    src={isDark ? "/images/e91_bases_black.png" : "/images/e91_bases_white.png"}
                                    alt="E91 Polarization measurement bases for Alice and Bob" 
                                    className="w-52 h-52 xl:w-64 xl:h-64 rounded" 
                                />
                            ) : (
                                <img 
                                    src="/images/e91_bases_white.png"
                                    alt="E91 Polarization measurement bases for Alice and Bob" 
                                    className="w-52 h-52 xl:w-64 xl:h-64 rounded" 
                                />
                            )}
                        </div>
                        
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part1')}</p>
                        
                        {/* Base combinations table */}
                        <div className="mb-4 flex justify-center">
                            <table className="table-auto border-collapse border border-gray-300">
                                <thead className="">
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300 text-left">Alice</th>
                                        <th className="px-4 py-2 border border-gray-300 text-left">Bob</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">a</td>
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                        </tr>
                                        <tr>
                                            <td style={{color:"#88D4AB"}} className="italic font-bold px-4 py-2 border border-gray-300">a&apos;</td>
                                            <td style={{color:"#88D4AB"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                        </tr>
                                        <tr>
                                            <td style={{color:"#80d1ef"}} className="italic font-bold px-4 py-2 border border-gray-300">a</td>
                                            <td style={{color:"#80d1ef"}} className="italic font-bold px-4 py-2 border border-gray-300">b&apos;</td>
                                        </tr>
                                        <tr>
                                            <td style={{color:"#0a629e"}} className="italic font-bold px-4 py-2 border border-gray-300">a&apos;</td>
                                            <td style={{color:"#0a629e"}} className="italic font-bold px-4 py-2 border border-gray-300">b&apos;</td>
                                        </tr>
                                    </tbody>
                                </table>
                        </div>
                        
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part2')}</p>
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part3')}</p>
                        
                        <div className="mb-4 flex justify-center">
                            <table className="table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300" colSpan={2}>Alice</th>
                                        <th className="px-4 py-2 border border-gray-300" colSpan={2}>Bob</th>
                                        <th className="px-4 py-2 border border-gray-300" rowSpan={2}>mA × mB</th>
                                    </tr>
                                    <tr>
                                        <th className="px-4 py-2 border border-gray-300">Base</th>
                                        <th className="px-4 py-2 border border-gray-300">mA</th>
                                        <th className="px-4 py-2 border border-gray-300">Base</th>
                                        <th className="px-4 py-2 border border-gray-300">mB</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">a</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center font-medium">+1</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">a</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">-1</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center font-medium">-1</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">a</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">-1</td>
                                            <td style={{color:"#2C6E49"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">-1</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center font-medium">+1</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td style={{color:"#88D4AB"}} className="italic font-bold px-4 py-2 border border-gray-300">a′</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td style={{color:"#88D4AB"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center font-medium">+1</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td style={{color:"#88D4AB"}} className="italic font-bold px-4 py-2 border border-gray-300">a′</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">-1</td>
                                            <td style={{color:"#88D4AB"}} className="italic font-bold px-4 py-2 border border-gray-300">b</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center font-medium">-1</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td style={{color:"#0a629e"}} className="italic font-bold px-4 py-2 border border-gray-300">a′</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td style={{color:"#0a629e"}} className="italic font-bold px-4 py-2 border border-gray-300">b′</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">+1</td>
                                            <td className="px-4 py-2 border border-gray-300 text-center font-medium">+1</td>
                                        </tr>
                                    </tbody>
                                </table>
                        </div>
                        
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part4')}</p>
                        
                        {/* Mathematical equations */}
                        {isClient && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
                                <div className="space-y-4">
                                    <MathJax>
                                        {`
                                        \\[
                                        E_{a,b} = \\frac{1 - 1 + 1}{3} = \\frac{1}{3} \\approx 0.33
                                        \\]
                                        `}
                                    </MathJax>
                                    <MathJax>
                                        {`
                                        \\[
                                        E_{a',b} = \\frac{1 - 1}{2} = 0
                                        \\]
                                        `}
                                    </MathJax>
                                    <MathJax>
                                        {`
                                        \\[
                                        E_{a',b'} = \\frac{1}{1} = 1
                                        \\]
                                        `}
                                    </MathJax>
                                    <div className="flex items-center justify-center space-x-2">
                                        <MathJax>
                                            {`
                                            \\[
                                            E_{a,b'} = 0
                                            \\]
                                            `}
                                        </MathJax>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                                            ({localize('component.e91.about.figures.noMeasurements')})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part5')}</p>
                        
                        {/* CHSH inequality equation */}
                        {isClient && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
                                <div className="mb-4">
                                    <MathJax>
                                        {`
                                        \\[
                                        S = \\lvert E_{a,b} + E_{a',b} + E_{a',b'} - E_{a,b'} \\rvert \\leq 2
                                        \\]
                                        `}
                                    </MathJax>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p>{localize('component.e91.about.figures.chsh.classical')}</p>
                                    <p>{localize('component.e91.about.figures.chsh.quantum')}</p>
                                    <p>{localize('component.e91.about.figures.chsh.example')}</p>
                                </div>
                            </div>
                        )}
                        
                        <p className="text-lg mb-4">{localize('component.e91.about.figures.part6')}</p>
                        
                        <p className="text-lg mb-6">{localize('component.e91.about.figures.part7.1')}
                            <span>&#40;</span>
                            <span className='italic font-bold'>a</span>
                            <span>, </span>
                            <span className='italic font-bold'>a&apos;</span>
                            <span>&#41;</span>
                            <span>, </span>
                            <span>&#40;</span>
                            <span className='italic font-bold'>b</span>
                            <span>, </span>
                            <span className='italic font-bold'>b&apos;</span>
                            <span>&#41;, and </span>
                            <span>&#40;</span>
                            <span className='italic font-bold'>b</span>
                            <span>, </span>
                            <span className='italic font-bold'>a&apos;</span>
                            <span>&#41;. </span>
                            {localize('component.e91.about.figures.part7.2')}
                        </p>
                        
                        {/* Reference section */}
                        <div id="reference-1" className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-lg mb-2">Reference</h3>
                            <p className="text-sm">
                                <strong>[1]</strong> Ekert, A. K. (1991). "Quantum cryptography based on Bell's theorem." 
                                <em> Physical Review Letters</em>, 67(6), 661. 
                                <a 
                                    href="https://doi.org/10.1103/PhysRevLett.67.661" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                                >
                                    https://doi.org/10.1103/PhysRevLett.67.661
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
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
            <Footer/>
        </MathJaxContext>
    );
}

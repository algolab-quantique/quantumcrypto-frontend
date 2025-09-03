'use client';

import Header from '@/components/shared/header';
import BB84Main from '@/components/bb84/home-page/bb84-game-form';
import Footer from '@/components/shared/footer';
import {useEffect, useRef, useState} from 'react';
import HowToPlaySection from '@/components/bb84/home-page/how-to-play-section';
import {useLanguage} from '@/components/providers/language-provider';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function BB84() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const {localize} = useLanguage();

    const [activeSection, setActiveSection] = useState<string | null>(null);

    const headerLinks = [
        {
            label: 'component.header.howToPlay',
            ref: howToPlayRef,
        },
        {
            label: 'component.header.about.bb84',
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
            .replace('<link4>', `<a href="#classical-quantum" class="text-blue-500 hover:underline">`)
            .replace('</link4>', `</a>`)
            .replace('<link5>', `<a href="#encoding-bit" class="text-blue-500 hover:underline">`)
            .replace('</link5>', `</a>`)
            .replace('<link6>', `<a href="#orthogonal-basis" class="text-blue-500 hover:underline">`)
            .replace('</link6>', `</a>`)
            .replace('<link7>', `<a href="#state-disturbance" class="text-blue-500 hover:underline">`)
            .replace('</link7>', `</a>`)
            .replace('<link8>', `<a href="#detecting-eve" class="text-blue-500 hover:underline">`)
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

    return (
        <>
            <Header links={headerLinks}/>
            <BB84Main/>
            <HowToPlaySection ref={howToPlayRef}/>
            <section ref={aboutRef}
                     className="w-full h-fit mt-20 px-5 md:px-20">
                 <Card className="p-6 md:p-8 border-none mx-auto shadow-md">
                    <h1 className="font-bold text-3xl md:text-5xl mb-4">
                        {localize('component.bb84.aboutTitle')}
                    </h1>
                    <div className="text-lg mb-4" dangerouslySetInnerHTML={{
                        __html: parseLocalizedText(
                            localize('component.bb84.about.part1') +
                            ' <a href="#ref1" class="text-blue-500 hover:underline">[1]</a>' +
                            localize('component.bb84.about.part2')
                        )
                    }} />
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
                                
                                {id === '#encryption-key' ? (
                                    <>
                                        <p className="text-gray-400 mb-4">{localize('component.bb84.about.encryptionKey.part1')}</p>
                                        <div className="mb-4">
                                            <table className="table-auto border-collapse border border-gray-300">
                                                <thead className="">
                                                    <tr>
                                                        <th className="px-4 py-2 border border-gray-300 text-left">b0</th>
                                                        <th className="px-4 py-2 border border-gray-300 text-left">b1</th>
                                                        <th className="px-4 py-2 border border-gray-300 text-left">b0 XOR b1 </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <p className="text-gray-400 mb-4">{localize('component.bb84.about.encryptionKey.part2')}</p>
                                        <div className="mb-4">
                                            <table className="table-auto border-collapse border border-gray-300">
                                                <tbody>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">{localize('component.bb84.about.encryptionKey.message')}</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">{localize('component.bb84.about.encryptionKey.key')}</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 border border-gray-300">{localize('component.bb84.about.encryptionKey.cypher')}</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                        <td className="px-4 py-2 border border-gray-300">1</td>
                                                        <td className="px-4 py-2 border border-gray-300">0</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <p className="text-gray-400 mb-4">{localize('component.bb84.about.encryptionKey.part3')}</p>
                                    </>
                                    
                                ) : (
                                    <p className="text-gray-400">{content}</p>
                                )}
                                
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            {/* Reference section (mirroring DPS style) */}
            <section className="w-full h-fit mt-20 px-5 md:px-20" id="references">
                <div id="ref1" className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-lg mb-2">Référence</h3>
                    <p className="text-sm">
                        <strong>[1]</strong> Bennett C H, Brassard G. &quot;Quantum cryptography: Public key distribution and coin tossing.&quot; In <em>Proceedings of the IEEE International Conference on Computers, Systems and Signal Processing</em>, Bangalore, India, 1984, pp. 175-179.
                    </p>
                </div>
            </section>
            <Footer/>
        </>
    );
}


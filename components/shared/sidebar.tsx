'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/language-provider';
import Link from 'next/link';
import { protocols } from '@/components/shared/protocol-data';
import { getLanguageCode } from '@/lib/utils';

const Sidebar = () => {

    const { localize, language } = useLanguage();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const langCode = getLanguageCode(language);
    const logoLang = isClient ? (langCode === 'es' ? 'en' : langCode) : 'en';

    return (
        <Sheet>
            <SheetTrigger className="inline-block md:hidden">
                <div
                    className="border border-secondary rounded-md mx-5 mt-7">
                    <Menu size={30} />
                </div>
            </SheetTrigger>
            <SheetContent className="bg-primary" side={'left'}>
                <div className="flex flex-col gap-y-4 h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <Image priority={true} src={`/images/QuantumCrypto_white-text_transp-cadna_${logoLang}.png`}
                            alt={'QuantumCrypto'}
                            width={200} height={50} className="h-10 w-auto object-contain" />
                    </div>

                    {/* Protocoles section */}
                    <div>
                        <p className="text-lg font-semibold text-primary-foreground/70 mb-1">
                            {localize('component.header.protocols')}
                        </p>
                        <div className="flex flex-col gap-y-1 pl-3">
                            {protocols.map(({ name, href }) => (
                                <Link key={name} href={href}>
                                    <p className="text-md cursor-pointer flex items-center gap-1
                                        hover:text-primary-foreground/90 transition-all">
                                        <ChevronRight size={14} /> {name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Guide section */}
                    <div>
                        <p className="text-lg font-semibold text-primary-foreground/70 mb-1">
                            {localize('component.header.guide')}
                        </p>
                        <div className="flex flex-col gap-y-1 pl-3">
                            <Link href="/guide#comment-jouer">
                                <p className="text-md cursor-pointer flex items-center gap-1
                                    hover:text-primary-foreground/90 transition-all">
                                    <ChevronRight size={14} /> {localize('component.header.guide.howToPlay')}
                                </p>
                            </Link>
                            <Link href="/guide#terminologie">
                                <p className="text-md cursor-pointer flex items-center gap-1
                                    hover:text-primary-foreground/90 transition-all">
                                    <ChevronRight size={14} /> {localize('component.header.guide.terminology')}
                                </p>
                            </Link>
                            <Link href="/guide#contexte">
                                <p className="text-md cursor-pointer flex items-center gap-1
                                    hover:text-primary-foreground/90 transition-all">
                                    <ChevronRight size={14} /> {localize('component.header.guide.context')}
                                </p>
                            </Link>
                        </div>
                    </div>

                    {/* À propos */}
                    <Link href="/">
                        <p className="text-lg cursor-pointer
                            hover:text-primary-foreground/90 transition-all">
                            {localize('component.header.about')}
                        </p>
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Sidebar;

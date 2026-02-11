'use client';

import React, { MutableRefObject, useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';

export interface SidebarItem {
    label: string;
    ref: MutableRefObject<any>;
}

interface ProtocolPageSidebarProps {
    items: SidebarItem[];
}

const ProtocolPageSidebar = ({ items }: ProtocolPageSidebarProps) => {
    const { localize } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            let currentIndex = 0;

            for (let i = items.length - 1; i >= 0; i--) {
                if (items[i].ref.current) {
                    const top = items[i].ref.current.offsetTop;
                    if (scrollPosition >= top) {
                        currentIndex = i;
                        break;
                    }
                }
            }
            setActiveIndex(currentIndex);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [items]);

    const handleClick = (item: SidebarItem) => {
        if (item.ref.current) {
            item.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="hidden lg:block sticky top-20 h-fit w-56 shrink-0">
            <div className="flex flex-col gap-y-1">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(item)}
                        className={cn(
                            'text-left text-sm px-3 py-2 rounded-md transition-all',
                            'hover:bg-secondary/50',
                            activeIndex === index
                                ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                                : 'text-muted-foreground'
                        )}
                    >
                        {localize(item.label)}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default ProtocolPageSidebar;

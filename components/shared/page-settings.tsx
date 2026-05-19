'use client';
import React from 'react';
import {ModeToggle} from '@/components/shared/mode-toggle';
import LanguageToggle from '@/components/shared/language-toggle';
import {cn} from '@/lib/utils';

const PageSettings = ({className}: { className?: string }) => {

    return (
        <div className={cn(className,
            'flex p-2 fixed gap-x-1 right-2 top-3 z-50')}>
            <LanguageToggle/>
            <ModeToggle/>
        </div>
    );
};

export default PageSettings;
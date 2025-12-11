import type {Metadata} from 'next';
import {Roboto} from 'next/font/google';

import './globals.css';
import {ThemeProvider} from '@/components/providers/theme-provider';
import {cn} from '@/lib/utils';
import PageSettings from '@/components/shared/page-settings';
import {LanguageProvider} from '@/components/providers/language-provider';
import {SocketProvider} from '@/components/providers/socket-provider';
import {Toaster} from '@/components/ui/sonner';

const font = Roboto({
    weight: ['100', '300', '400', '500', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'QuantumCrypto',
    description: 'An interactive game based on the BB84 quantum key' +
        ' distribution protocol',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, 'bg-background')}>
        <ThemeProvider attribute="class" defaultTheme="dark"
                       enableSystem={false} storageKey="bb84-theme">
            <LanguageProvider>
                <SocketProvider>
                    <PageSettings/>
                    {children}
                </SocketProvider>
            </LanguageProvider>
            <Toaster position="top-right" richColors closeButton
                     visibleToasts={1}/>
        </ThemeProvider>
        </body>
        </html>
    );
}

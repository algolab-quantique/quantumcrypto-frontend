import React from 'react';
import { Github } from 'lucide-react';
import Image from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * FooterV3 - V3 "Future" landing and protocol page footer.
 * Matches V3 layout with IQ logo on the far right.
 * Isolated from FooterV2 for safe future modifications.
 */
const FooterV3 = () => {
    return (
        <footer
            className="mt-20 w-full h-fit px-10 py-3 bg-primary flex flex-row items-center">
            <h1 className='my-auto text-4xl font-bold text-foreground'>QuantumCrypto</h1>
            <div className='justify-center flex flex-row gap-x-4 ml-10'>
                <a href="https://github.com/algolab-quantique/quantumcrypto-backend" target="_blank" rel="noopener noreferrer">
                    <div
                        className="flex flex-col gap-y-2 items-center p-3 hover:text-white transition-all duration-300 cursor-pointer">
                        <Github size={30} />
                        <p>Backend</p>
                    </div>
                </a>
                <a href="https://github.com/algolab-quantique/quantumcrypto-frontend" target="_blank" rel="noopener noreferrer">
                    <div
                        className="flex flex-col gap-y-2 items-center p-3 hover:text-white transition-all duration-300 cursor-pointer">
                        <Github size={30} />
                        <p>Frontend</p>
                    </div>
                </a>
            </div>

            {/* Institut Quantique — far right with tooltip */}
            <div className="ml-auto">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href="https://www.usherbrooke.ca/iq"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    src="/institut-quantique.svg"
                                    alt="Institut Quantique"
                                    width={200}
                                    height={63}
                                    className="hover:scale-105 transition-transform duration-200"
                                />
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Institut Quantique — Université de Sherbrooke</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </footer>
    );
};

export default FooterV3;

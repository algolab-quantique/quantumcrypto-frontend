import React from 'react';
import {Github} from 'lucide-react';

const Footer = () => {
    return (
        <footer
            className="mt-20 w-full h-fit px-10 py-3 bg-primary flex flex-row gap-x-10">
            <h1 className='my-auto text-4xl font-bold text-foreground'>QuantumCrypto</h1>
            <div className='justify-center flex flex-row gap-x-4'>
                <a href="https://github.com/algolab-quantique/quantumcrypto-backend" target="_blank" rel="noopener noreferrer">
                    <div
                        className="flex flex-col gap-y-2 items-center p-3 hover:text-white transition-all duration-300 cursor-pointer">
                        <Github size={30}/>
                        <p>Backend</p>
                    </div>
                </a>
                <a href="https://github.com/algolab-quantique/quantumcrypto-frontend" target="_blank" rel="noopener noreferrer">
                    <div
                        className="flex flex-col gap-y-2 items-center p-3 hover:text-white transition-all duration-300 cursor-pointer">
                        <Github size={30}/>
                        <p>Frontend</p>
                    </div>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
'use client';

import Header from '@/components/shared/header';
import ZQKDMain from '@/components/dps/home-page/zqkd-game-form';
import Footer from '@/components/shared/footer';
import {useEffect, useRef, useState} from 'react';
import {useLanguage} from '@/components/providers/language-provider';
import HowToPlaySection from '@/components/dps/home-page/how-to-play-section';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from "next-themes";
import { getLanguageCode } from '@/lib/utils';



export default function DPS() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);
    const { localize } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    

    interface LocalizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    name: string;
    localized?: boolean;
    }
      
    const LocalizedImage = ({ name, localized = false, ...props }: LocalizedImageProps) => {
        const { language } = useLanguage();
        const lang = getLanguageCode(language);
        const themeSuffix = !isDark ? 'wb' : 'bb';
        
        const src = localized
            ? `/images/${name}_${themeSuffix}_${lang}.png`
            : `/images/${name}_${themeSuffix}.svg`;
        
        return <img src={src} alt={name} {...props} />;
    };
   

    const mathJaxConfig = {
        loader: { load: ['[tex]/color'] },
        tex: { packages: { '[+]': ['color'] } },
    };

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
        <ZQKDMain />
        <HowToPlaySection ref={howToPlayRef} />
        <section ref={aboutRef} className="w-full h-fit mt-20 px-5 md:px-20">
            <Card className='pb-2 border-none mx-auto shadow-md'>
                <CardContent>
                    <h1 className="font-bold text-3xl md:text-5xl mb-4">{localize('component.dps.aboutTitle')}</h1>
                    <p className="text-lg mb-4">
                        {localize('component.dps.about.part1')}
                    </p>
                    <p className="text-lg mb-4">
                        {localize('component.dps.about.part2')}
                    </p>
                </CardContent>   
            </Card>
            <Card className='pb-2 border-none mx-auto shadow-md'>
                <CardContent>
                    <p className="text-lg mb-4">
                        {localize('component.dps.about.part3')}
                    </p>
                    <div className='flex justify-center mb-4 mt-4'>
                        <LocalizedImage name="alice" localized className="w-90 h-90 xl:w-85 xl:h-85 rounded" />
                    </div>
                    <p className="text-lg mb-4">{localize('component.dps.about.part4')}
                        <span className='italic font-bold'>A</span>
                        {localize('component.dps.about.and')}
                        <span className='italic font-bold'> B</span>
                        {localize('component.dps.about.part5')}
                        <span className='italic font-bold'>B</span>
                        {localize('component.dps.about.and')}
                        <span className='italic font-bold'> C. </span> 
                        {localize('component.dps.about.part6')}
                        <span className='italic font-bold'> B </span>
                        <span> &#40; </span>
                        <span className='italic font-bold'> C </span> 
                        <span> &#41; </span> 
                        {localize('component.dps.about.part7')}
                        <span className='italic font-bold'> A</span>
                        <span> &#40; </span>
                        <span className='italic font-bold'> B </span> 
                        <span> &#41;. </span> 
                    </p>
                </CardContent>
            </Card>
            <Card className='pb-2 border-none mx-auto shadow-md'>
                <CardContent>
                    <p className="text-lg mb-4">{localize('component.dps.about.part8')}</p>

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
                        {localize('component.dps.about.part12')}
                    </p>
                    <div className="mb-4 flex justify-center">
                        <table className="table-auto border-collapse border border-gray-300 text-center">
                            <thead>
                                <tr>
                                <th className="border px-2 py-1">bit 2</th>
                                <th className="border px-2 py-1">bit 1</th>
                                <th className="border px-2 py-1">bit 0</th>
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 2</th>
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 1</th>
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 0</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="border px-2 py-1">0</td>
                                <td className="border px-2 py-1">0</td>
                                <td className="border px-2 py-1">0</td>
                                <td className="border px-2 py-1"><LocalizedImage name="zero" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="zero" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="zero" width={50} height={50} /></td>
                                </tr>
                                <tr>
                                <td className="border px-2 py-1">0</td>
                                <td className="border px-2 py-1">1</td>
                                <td className="border px-2 py-1">0</td>
                                <td className="border px-2 py-1"><LocalizedImage name="zero" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="pi" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="zero" width={50} height={50} /></td>
                                </tr>
                                <tr>
                                <td className="border px-2 py-1">1</td>
                                <td className="border px-2 py-1">1</td>
                                <td className="border px-2 py-1">0</td>
                                <td className="border px-2 py-1"><LocalizedImage name="pi" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="pi" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="zero" width={50} height={50} /></td>
                                </tr>
                                <tr>
                                <td className="border px-2 py-1">1</td>
                                <td className="border px-2 py-1">1</td>
                                <td className="border px-2 py-1">1</td>
                                <td className="border px-2 py-1"><LocalizedImage name="pi" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="pi" width={50} height={50} /></td>
                                <td className="border px-2 py-1"><LocalizedImage name="pi" width={50} height={50} /></td>
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
                            \\left( (-1)^{b_0} \\left| 0 \\right\\rangle + (-1)^{b_1} \\left| 1 \\right\\rangle + (-1)^{b_2} \\left| 2 \\right\\rangle \\right)
                        \\]`}
                    </MathJax>
                </CardContent>
            </Card>
            <Card className='pb-2 border-none mx-auto shadow-md'>
                <CardContent>
                    <p className="text-lg mb-4">{localize('component.dps.about.part16')}</p>
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
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 3</th>
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 2</th>
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 1</th>
                                <th className="border px-2 py-1">{localize('component.dps.about.impulsion')} 0</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-2 py-1 italic">{localize('component.dps.about.route')} D</td>
                                    <td></td>
                                    <td className="border">
                                        <LocalizedImage name="pi" width={50} height={50} />
                                    </td>
                                    <td className="border">
                                        <LocalizedImage name="zero" width={50} height={50} />
                                    </td>
                                    <td className="border">
                                        <LocalizedImage name="zero" width={50} height={50} />
                                    </td>
                                    </tr>
                                    <tr>
                                    <td className="border px-2 py-1 italic">{localize('component.dps.about.route')} E</td>
                                    <td className="border">
                                        <LocalizedImage name="pi" width={50} height={50} />
                                    </td>
                                    <td className="border">
                                        <LocalizedImage name="zero" width={50} height={50} />
                                    </td>
                                    <td className="border">
                                        <LocalizedImage name="zero" width={50} height={50} />
                                    </td>
                                    <td></td>
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
                        <img
                            key="beamsplitter"
                            src={isDark ? "/images/beamsplitter_bb.png" : "/images/beamsplitter_wb.png"}
                            alt="beamsplitter"
                        />
                    </div>
                    <p className="text-lg mb-4">
                        {localize('component.dps.about.part25')}
                        <span className='italic font-bold'>U<sub>msr</sub></span>
                        {localize('component.dps.about.part26')}
                    </p>
                    <MathJax className="text-lg mb-4">
                    {`\\[
                        U_{\\text{msr}} \\left| \\psi_{\\text{in}} \\right\\rangle = \\left| \\psi_{\\text{out}} \\right\\rangle
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
                            <MathJax inline>{`\\( c = \\frac{a - b}{\\sqrt{2}} \\)`}</MathJax>.
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
                        <span className='italic font-bold'>T<sub>0</sub></span>
                        {localize('component.dps.about.or')}
                        <span className='italic font-bold'>T<sub>3</sub> , </span>
                        {localize('component.dps.about.part33')}
                        <span className="bg-green-300 font-bold px-1 rounded ml-2">{localize('component.dps.about.part34')}</span> 
                        {localize('component.dps.about.part35')}
                    </p>

                    <MathJax className="text-2xl mb-4">
                        {`\\[
                            \\left( \\frac{(-1)^{b_0}}{\\sqrt{2}} \\right)^2 = 
                            \\left( \\frac{-(-1)^{b_0}}{\\sqrt{2}} \\right)^2 = 
                            \\left( \\frac{(-1)^{b_2}}{\\sqrt{2}} \\right)^2 = 
                            \\left( \\frac{-(-1)^{b_2}}{\\sqrt{2}} \\right)^2 = \\frac{1}{2}
                        \\]`}
                    </MathJax>
                    <p className="text-lg mb-4">
                        {localize('component.dps.about.part36')}
                        <span className='italic font-bold'>T<sub>1</sub></span>
                        {localize('component.dps.about.or')}
                        <span className='italic font-bold'>T<sub>2</sub> , </span>
                        {localize('component.dps.about.part37')}
                        <MathJax inline>{`\\( b_0 \\)`}</MathJax>
                        <span> , </span> 
                        <MathJax inline>{`\\( b_1 \\)`}</MathJax>
                        {localize('component.dps.about.and')}
                        <MathJax inline>{`\\( b_2 \\)`}</MathJax> 
                        {localize('component.dps.about.part38')}
                        <span className='italic font-bold'>T<sub>1</sub></span>
                        {localize('component.dps.about.and')}
                        <span className='italic font-bold'>T<sub>2</sub> </span>
                        {localize('component.dps.about.part39')}
                        <span className='italic font-bold'>T<sub>0</sub></span>
                        {localize('component.dps.about.and')}
                        <span className='italic font-bold'>T<sub>3</sub> </span>
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
                        
                        <span className='italic font-bold'>T<sub>1</sub></span>
                        <span>, </span>
                        {localize('component.dps.about.part45')}                         
                        <MathJax inline>{`\\( b_0 \\neq b_1 \\)`}</MathJax>

                        {localize('component.dps.about.part46')}
                        <MathJax inline>{`\\( \\pm\\pi \\)`}</MathJax>
                        {localize('component.dps.about.part47')}

                        <span className='italic font-bold'>T<sub>1</sub> </span>
                        <span>, </span>
                        {localize('component.dps.about.part48')}
                        
                       
                    </p>
                    <p className="text-lg mb-4">
                        {localize('component.dps.about.part49')}
                        <span className='italic font-bold'>T<sub>2</sub> </span>
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
        </section>
        <Footer />
    </MathJaxContext>
    )

}
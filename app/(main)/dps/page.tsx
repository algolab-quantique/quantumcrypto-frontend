'use client';

import Header from '@/components/shared/header';
import DPSMain from '@/components/dps/home-page/dps-game-form';
import Footer from '@/components/shared/footer';
import {useEffect, useRef, useState} from 'react';
import HowToPlaySection from '@/components/dps/home-page/how-to-play-section';

export default function DPS() {

    const howToPlayRef = useRef(null);
    const aboutRef = useRef(null);

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
       <>
        <Header links={headerLinks}/>
        <DPSMain/>
        <HowToPlaySection ref={howToPlayRef}/>
        <section ref={aboutRef}
                className="w-full h-fit mt-20 px-5 md:px-20">
                    <h1 className="font-bold text-3xl md:text-5xl mb-4">Le Protocole DPS</h1>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>
                    <p className="text-lg">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure velit eos, quos aliquid maxime expedita accusamus pariatur assumenda sapiente laudantium voluptate quasi minima autem delectus ducimus aspernatur quo ex eius.</p>

        </section>
        <Footer/>
       </>
    )

}
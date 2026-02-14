'use client';

import React, { useMemo } from 'react';

/**
 * AtmosphericBackground - V3 Signature Experience
 * 
 * "If you can't tell it's there on first glance, it's the right amount."
 * 
 * 1. Film Grain (SVG feTurbulence) — tactile premium feel
 * 2. Floating Photon Particles — pure CSS animations (always visible, no refresh needed)
 * 3. Soft radial glow — centered on hero area
 */

interface Particle {
    id: number;
    size: number;
    x: number;
    y: number;
    driftX: number;
    duration: number;
    delay: number;
}

const AtmosphericBackground = () => {
    // Memoize particles so they don't re-randomize on re-render
    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: 18 }, (_, i) => ({
            id: i,
            size: 3 + (i % 5) * 1.5,               // 3px to 9px — visible dots
            x: (i * 17 + 7) % 100,                  // deterministic spread
            y: (i * 23 + 13) % 100,
            driftX: ((i % 3) - 1) * 15,             // -15, 0, or +15
            duration: 12 + (i % 4) * 4,             // 12s to 24s — slow drift
            delay: (i % 6) * 1.2,                   // staggered start
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">

            {/* Inline keyframes for particles — CSS animations always run */}
            <style jsx>{`
                @keyframes photonFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(var(--drift-x), -50px) scale(1.3); opacity: 0.5; }
                }
            `}</style>

            {/* 1. Film Grain Overlay — higher contrast in light mode */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.045] dark:opacity-[0.04]">
                <filter id="v3NoiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#v3NoiseFilter)" />
            </svg>

            {/* 2. Central Radial Glow — hero area spotlight */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2
                w-[600px] h-[400px] rounded-full
                bg-primary/8 dark:bg-primary/12
                blur-[140px]" />

            {/* 3. Floating Photon Particles — pure CSS, always visible */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-primary/30 dark:bg-primary/20 blur-[1.5px]"
                    style={{
                        width: p.size + 'px',
                        height: p.size + 'px',
                        left: p.x + '%',
                        top: p.y + '%',
                        '--drift-x': p.driftX + 'px',
                        animation: `photonFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    } as React.CSSProperties}
                />
            ))}

            {/* 4. Edge fade — integrates into page edges */}
            <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-background to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-background to-transparent opacity-50" />
        </div>
    );
};

export default AtmosphericBackground;

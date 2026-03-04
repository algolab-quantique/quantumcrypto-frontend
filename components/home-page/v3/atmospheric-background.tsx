'use client';

import React, { useMemo } from 'react';

/**
 * AtmosphericBackground — V3 Signature Signature Experience
 * 
 * Features:
 * 1. 3-Layer Depth (Parallax-like energy field)
 * 2. Readability Zones (Protects center 40% of screen)
 * 3. Quantum Photons (Bright white core + Neon green glow)
 * 4. Film Grain Overlay (Subtle tactile texture)
 */

interface Particle {
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    blur: number;
    opacity: number;
    layer: 'far' | 'mid' | 'near';
}

const AtmosphericBackground = () => {
    const particles = useMemo<Particle[]>(() => {
        const p: Particle[] = [];
        const count = 45; // Enhanced density

        for (let i = 0; i < count; i++) {
            // Placement Logic: Avoid center 40% (between 30% and 70%)
            const side = Math.random() > 0.5 ? 'left' : 'right';
            const xBase = side === 'left' ? Math.random() * 30 : 70 + Math.random() * 30;

            let layer: 'far' | 'mid' | 'near';
            if (i < 25) layer = 'far';
            else if (i < 40) layer = 'mid';
            else layer = 'near';

            p.push({
                id: i,
                layer,
                x: xBase,
                y: Math.random() * 100,
                size: layer === 'far' ? 2 + Math.random() * 3 :
                    layer === 'mid' ? 6 + Math.random() * 5 :
                        12 + Math.random() * 6,
                blur: layer === 'far' ? 4 : layer === 'mid' ? 2 : 1,
                duration: layer === 'far' ? 15 + Math.random() * 10 :
                    layer === 'mid' ? 10 + Math.random() * 5 :
                        7 + Math.random() * 3,
                delay: Math.random() * 5,
                opacity: layer === 'far' ? 0.15 : layer === 'mid' ? 0.25 : 0.35,
            });
        }
        return p;
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">

            {/* Inline keyframes — Pulse & Drift */}
            <style jsx>{`
                @keyframes quantumPulse {
                    0%, 100% { transform: translateY(0) scale(1); opacity: var(--base-op); }
                    50% { transform: translateY(-30px) scale(1.1); opacity: calc(var(--base-op) * 1.4); }
                }
                .photon {
                    animation: quantumPulse var(--dur) ease-in-out var(--del) infinite;
                    box-shadow: 0 0 20px hsl(152, 100%, 33%, 0.4);
                    background: radial-gradient(circle at center, #fff 0%, hsl(152, 100%, 33%) 40%, transparent 100%);
                }
                .photon::after {
                    content: '';
                    position: absolute;
                    inset: 25%;
                    background: white;
                    border-radius: 50%;
                    filter: blur(2px);
                    opacity: 0.8;
                }
            `}</style>

            {/* 1. Film Grain Overlay — Tactile feel */}
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

            {/* 2. Ambient Background Glows */}
            <div className="absolute top-[10%] left-0 w-1/3 h-1/2 bg-primary/8 dark:bg-primary/12 blur-[150px] rounded-full" />
            <div className="absolute bottom-[20%] right-0 w-1/3 h-1/2 bg-primary/5 dark:bg-primary/8 blur-[150px] rounded-full" />

            {/* 3. Floating Quantum Photons */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full photon"
                    style={{
                        width: p.size + 'px',
                        height: p.size + 'px',
                        left: p.x + '%',
                        top: p.y + '%',
                        filter: `blur(${p.blur}px)`,
                        '--dur': `${p.duration}s`,
                        '--del': `${p.delay}s`,
                        '--base-op': p.opacity,
                        color: 'hsl(152, 100%, 33%)' // Brand Green
                    } as React.CSSProperties}
                />
            ))}

            {/* 4. Edge fade — integrates into page flow */}
            <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-background to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-background to-transparent opacity-60" />
        </div>
    );
};

export default AtmosphericBackground;

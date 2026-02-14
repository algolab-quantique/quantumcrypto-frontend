'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { protocols } from '@/components/shared/protocol-data';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';

/** Difficulty rating (1-3 key icons) per protocol */
const protocolMeta: Record<string, { mission: string; difficulty: number }> = {
    BB84:  { mission: 'Mission 01', difficulty: 1 },
    E91:   { mission: 'Mission 02', difficulty: 2 },
    DPS:   { mission: 'Mission 03', difficulty: 3 },
};

const DifficultyKeys = ({ level }: { level: number }) => (
    <div className="flex items-center gap-1" title={`Difficulty ${level}/3`}>
        {[1, 2, 3].map((i) => (
            <KeyRound
                key={i}
                size={14}
                className={i <= level ? 'text-primary' : 'text-muted-foreground/30'}
            />
        ))}
    </div>
);

/** Pulsing green dot — "live" indicator */
const LiveDot = () => (
    <span className="relative inline-flex h-2 w-2 mr-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
    </span>
);

/**
 * ProtocolsSectionV3 — Glassmorphism variant
 * 
 * Changes vs V2:
 * - backdrop-blur-md (stronger glass)
 * - thin white/dark glass border
 * - live pulse dot on stats
 * - slightly stronger hover glow
 * Same layout, same data — just visual refinement.
 */
const ProtocolsSectionV3 = () => {

    const { localize } = useLanguage();
    const [protocolStats, setProtocolStats] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get_protocol_stats/`);
                const stats = response.data.protocols.reduce((acc: Record<string, number>, stat: { protocol_type: string, total_games: number }) => {
                    acc[stat.protocol_type] = stat.total_games;
                    return acc;
                }, {});
                setProtocolStats(stats);
            } catch (error) {
                console.error("Error fetching protocol stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <section id="protocols" className="py-8 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {protocols.map(({ name, description, href }, index) => {
                        const meta = protocolMeta[name] || { mission: `Mission 0${index + 1}`, difficulty: 1 };
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.12, duration: 0.5 }}
                            >
                                <Link href={href}>
                                    <div className="group hover:scale-[1.03] cursor-pointer transition-all duration-200
                                        rounded-lg
                                        border border-white/10 dark:border-white/[0.08]
                                        bg-card/60 backdrop-blur-md
                                        p-5 h-[260px] flex flex-col justify-between
                                        hover:border-primary/40 hover:shadow-[0_0_24px_hsl(152,100%,33%,0.18)]">

                                        {/* Header: Mission label + Difficulty */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-mono uppercase tracking-widest text-primary">
                                                    {meta.mission}
                                                </span>
                                                <DifficultyKeys level={meta.difficulty} />
                                            </div>

                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                                {name}
                                            </h3>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {localize(description)}
                                            </p>
                                        </div>

                                        {/* Footer: Stats with live pulse */}
                                        {protocolStats[name.toLowerCase()] !== undefined && (
                                            <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground flex items-center">
                                                <LiveDot />
                                                {localize('component.quantumCrypto.gamesPlayed')} {protocolStats[name.toLowerCase()] || 0}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProtocolsSectionV3;

'use client';

import React, { useState } from 'react';
import HeaderV3 from '@/components/home-page/v3/header-v3';
import FooterV3 from '@/components/home-page/v3/footer-v3';
import AtmosphericBackground from '@/components/home-page/v3/atmospheric-background';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    User, Users, Shield, ChevronDown, ChevronRight,
    Zap, ArrowRight, Check, Gamepad2, UserPlus, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════
   BB84 Card Design Comparison — Preview Page
   
   Shows 4 card design options side-by-side so the team can pick
   the best UX for the game form (Solo / Join / Create).
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   OPTION 1 — Tab-Based Card
   3 tabs (Solo | Rejoindre | Créer), each shows only relevant fields.
   ───────────────────────────────────────────────────────────── */
function Option1_TabBased() {
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [activeTab, setActiveTab] = useState('solo');

    return (
        <Card className="w-[350px] md:w-[500px] mx-auto pt-4 pb-2
            border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg
            hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
            transition-all duration-300">
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-fit
                        bg-muted/60 backdrop-blur-sm border border-border/30 rounded-lg p-1 mb-6">
                        <TabsTrigger value="solo"
                            className="text-sm md:text-base cursor-pointer transition-all duration-200
                                hover:text-primary hover:bg-primary/10
                                data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                data-[state=active]:border-primary/30">
                            <Gamepad2 className="w-4 h-4 mr-1.5" />
                            Solo
                        </TabsTrigger>
                        <TabsTrigger value="join"
                            className="text-sm md:text-base cursor-pointer transition-all duration-200
                                hover:text-primary hover:bg-primary/10
                                data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                data-[state=active]:border-primary/30">
                            <UserPlus className="w-4 h-4 mr-1.5" />
                            Rejoindre
                        </TabsTrigger>
                        <TabsTrigger value="create"
                            className="text-sm md:text-base cursor-pointer transition-all duration-200
                                hover:text-primary hover:bg-primary/10
                                data-[state=active]:shadow-[0_0_12px_hsl(152,100%,33%,0.25)]
                                data-[state=active]:border-primary/30">
                            <Settings className="w-4 h-4 mr-1.5" />
                            Créer
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Solo Tab ── */}
                    <TabsContent value="solo" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Player Name</label>
                            <Input placeholder="Alice" value={name}
                                onChange={(e) => setName(e.target.value)} />
                            <p className="text-xs text-muted-foreground">
                                This will be your public display name</p>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.3)]
                            transition-all duration-300">
                            <Zap className="w-4 h-4 mr-2" />
                            Play Solo
                        </Button>
                    </TabsContent>

                    {/* ── Join Tab ── */}
                    <TabsContent value="join" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Player Name</label>
                            <Input placeholder="Alice" value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Game PIN</label>
                            <Input placeholder="62V2H" value={pin}
                                onChange={(e) => setPin(e.target.value.toUpperCase())}
                                maxLength={5} className="tracking-widest font-mono text-center" />
                        </div>
                        <Button variant="secondary" className="w-full
                            border border-transparent hover:border-primary/50
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                            transition-all duration-300">
                            <Users className="w-4 h-4 mr-2" />
                            Join Game
                        </Button>
                    </TabsContent>

                    {/* ── Create Tab ── */}
                    <TabsContent value="create" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Number of photons</label>
                            <Input type="number" placeholder="16" min={16} max={30} />
                        </div>
                        <div className="flex items-center gap-x-3">
                            <input type="checkbox" className="accent-primary w-4 h-4" />
                            <label className="text-sm">Is Eve present?</label>
                        </div>
                        <Button variant="secondary" className="w-full
                            border border-transparent hover:border-primary/50
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                            transition-all duration-300">
                            <Shield className="w-4 h-4 mr-2" />
                            Create Game
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────────────────────────
   OPTION 2 — Progressive Reveal (Recommended in todo)
   Name + "Play Solo" as default fast path.
   Collapsible "Multiplayer" section below.
   ───────────────────────────────────────────────────────────── */
function Option2_ProgressiveReveal() {
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [multiOpen, setMultiOpen] = useState(false);

    return (
        <Card className="w-[350px] md:w-[500px] mx-auto pt-4 pb-2
            border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg
            hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
            transition-all duration-300">
            <CardContent className="space-y-5">
                {/* ── Name (always visible) ── */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Player Name</label>
                    <Input placeholder="Alice" value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                        This will be your public display name</p>
                </div>

                {/* ── Primary CTA: Solo ── */}
                <Button className="w-full bg-primary hover:bg-primary/90
                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.3)]
                    transition-all duration-300 text-base py-5">
                    <Zap className="w-5 h-5 mr-2" />
                    Play Solo
                </Button>

                {/* ── Divider with collapsible toggle ── */}
                <button
                    onClick={() => setMultiOpen(!multiOpen)}
                    className="w-full flex items-center gap-2 text-sm text-muted-foreground
                        hover:text-primary transition-colors duration-200 group cursor-pointer"
                >
                    <div className="flex-1 h-px bg-border/60 group-hover:bg-primary/30 transition-colors" />
                    <span className="flex items-center gap-1 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                        Multiplayer
                        {multiOpen
                            ? <ChevronDown className="w-3.5 h-3.5" />
                            : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex-1 h-px bg-border/60 group-hover:bg-primary/30 transition-colors" />
                </button>

                {/* ── Multiplayer fields (collapsible) ── */}
                <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    multiOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                )}>
                    <div className="space-y-4 pt-1">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Game PIN</label>
                            <Input placeholder="62V2H" value={pin}
                                onChange={(e) => setPin(e.target.value.toUpperCase())}
                                maxLength={5} className="tracking-widest font-mono text-center" />
                        </div>
                        <div className="flex gap-x-2">
                            <Button variant="secondary" className="flex-1
                                border border-transparent hover:border-primary/50
                                hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                transition-all duration-300">
                                <UserPlus className="w-4 h-4 mr-1.5" />
                                Join Game
                            </Button>
                            <Button variant="secondary" className="flex-1
                                border border-transparent hover:border-primary/50
                                hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                transition-all duration-300">
                                <Shield className="w-4 h-4 mr-1.5" />
                                Create Game
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────────────────────────
   OPTION 2b — Always-Open (Progressive Reveal without collapse)
   Same layout as Option 2, but multiplayer is always visible.
   Solo stays the primary CTA, multiplayer sits below the divider.
   ───────────────────────────────────────────────────────────── */
function Option2b_AlwaysOpen() {
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');

    return (
        <Card className="w-[350px] md:w-[500px] mx-auto pt-4 pb-2
            border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg
            hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
            transition-all duration-300">
            <CardContent className="space-y-5">
                {/* ── Name (always visible) ── */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Player Name</label>
                    <Input placeholder="Alice" value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                        This will be your public display name</p>
                </div>

                {/* ── Primary CTA: Solo ── */}
                <Button className="w-full bg-primary hover:bg-primary/90
                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.3)]
                    transition-all duration-300 text-base py-5">
                    <Zap className="w-5 h-5 mr-2" />
                    Play Solo
                </Button>

                {/* ── Divider (static, not clickable) ── */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex-1 h-px bg-border/60" />
                    <span className="flex items-center gap-1 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                        Multiplayer
                    </span>
                    <div className="flex-1 h-px bg-border/60" />
                </div>

                {/* ── Multiplayer fields (always visible) ── */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Game PIN</label>
                        <Input placeholder="62V2H" value={pin}
                            onChange={(e) => setPin(e.target.value.toUpperCase())}
                            maxLength={5} className="tracking-widest font-mono text-center" />
                    </div>
                    <div className="flex gap-x-2">
                        <Button variant="secondary" className="flex-1
                            border border-transparent hover:border-primary/50
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                            transition-all duration-300">
                            <UserPlus className="w-4 h-4 mr-1.5" />
                            Join Game
                        </Button>
                        <Button variant="secondary" className="flex-1
                            border border-transparent hover:border-primary/50
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                            transition-all duration-300">
                            <Shield className="w-4 h-4 mr-1.5" />
                            Create Game
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────────────────────────
   OPTION 3 — Two-Card Split
   Separate Solo card and Multiplayer card side-by-side.
   ───────────────────────────────────────────────────────────── */
function Option3_TwoCardSplit() {
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');

    const cardClass = `flex-1 min-w-[260px] pt-4 pb-2
        border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg
        hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
        transition-all duration-300`;

    return (
        <div className="flex flex-col md:flex-row gap-4 max-w-[700px] mx-auto px-4">
            {/* ── Solo Card ── */}
            <Card className={cardClass}>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold">Solo Mission</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Practice the protocol on your own against a simulated partner.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Player Name</label>
                        <Input placeholder="Alice" value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90
                        hover:shadow-[0_0_20px_hsl(152,100%,33%,0.3)]
                        transition-all duration-300">
                        <Zap className="w-4 h-4 mr-2" />
                        Play Solo
                    </Button>
                </CardContent>
            </Card>

            {/* ── Multiplayer Card ── */}
            <Card className={cardClass}>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold">Multiplayer</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Create or join a game to play with a real partner.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Player Name</label>
                        <Input placeholder="Alice" value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Game PIN</label>
                        <Input placeholder="62V2H" value={pin}
                            onChange={(e) => setPin(e.target.value.toUpperCase())}
                            maxLength={5} className="tracking-widest font-mono text-center" />
                    </div>
                    <div className="flex gap-x-2">
                        <Button variant="secondary" className="flex-1
                            border border-transparent hover:border-primary/50
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                            transition-all duration-300">
                            <UserPlus className="w-4 h-4 mr-1.5" />
                            Join Game
                        </Button>
                        <Button variant="secondary" className="flex-1
                            border border-transparent hover:border-primary/50
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                            transition-all duration-300">
                            <Shield className="w-4 h-4 mr-1.5" />
                            Create Game
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   OPTION 4 — Wizard / Stepper (Best practice addition)
   Step 1: Enter name → Step 2: Choose path → Step 3: Action
   ───────────────────────────────────────────────────────────── */
function Option4_Wizard() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [mode, setMode] = useState<'solo' | 'join' | 'create' | null>(null);
    const [pin, setPin] = useState('');

    const isNameValid = name.length >= 2;

    const modeOptions = [
        {
            key: 'solo' as const,
            icon: Zap,
            title: 'Solo Mission',
            desc: 'Practice against a simulated partner',
        },
        {
            key: 'join' as const,
            icon: UserPlus,
            title: 'Join Game',
            desc: 'Enter a PIN to join an existing game',
        },
        {
            key: 'create' as const,
            icon: Settings,
            title: 'Create Game',
            desc: 'Configure and host a new game',
        },
    ];

    return (
        <Card className="w-[350px] md:w-[500px] mx-auto pt-4 pb-2
            border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg
            hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
            transition-all duration-300">
            <CardContent className="space-y-5">
                {/* ── Step indicators ── */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                                step > s
                                    ? 'bg-primary text-primary-foreground'
                                    : step === s
                                        ? 'bg-primary/20 text-primary border-2 border-primary'
                                        : 'bg-muted/60 text-muted-foreground border border-border/60'
                            )}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={cn(
                                    'w-10 h-0.5 transition-all duration-300',
                                    step > s ? 'bg-primary' : 'bg-border/60'
                                )} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Step 1: Name ── */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold text-center">Who are you?</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Player Name</label>
                            <Input placeholder="Alice" value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus />
                            <p className="text-xs text-muted-foreground">
                                This will be your public display name</p>
                        </div>
                        <Button
                            disabled={!isNameValid}
                            onClick={() => setStep(2)}
                            className="w-full bg-primary hover:bg-primary/90
                            hover:shadow-[0_0_20px_hsl(152,100%,33%,0.3)]
                            transition-all duration-300">
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

                {/* ── Step 2: Choose mode ── */}
                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold text-center">
                            Choose your path, <span className="text-primary">{name}</span>
                        </h3>
                        <div className="grid gap-3">
                            {modeOptions.map(({ key, icon: Icon, title, desc }) => (
                                <button
                                    key={key}
                                    onClick={() => { setMode(key); setStep(3); }}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg border text-left',
                                        'hover:border-primary/50 hover:bg-primary/5',
                                        'hover:shadow-[0_0_15px_hsl(152,100%,33%,0.1)]',
                                        'transition-all duration-200 cursor-pointer',
                                        'border-border/60 bg-card/50'
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{title}</p>
                                        <p className="text-xs text-muted-foreground">{desc}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep(1)}
                            className="text-xs text-muted-foreground hover:text-primary
                                transition-colors cursor-pointer mx-auto block">
                            ← Back
                        </button>
                    </div>
                )}

                {/* ── Step 3: Action ── */}
                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {mode === 'solo' && (
                            <>
                                <h3 className="text-lg font-bold text-center">
                                    Ready, <span className="text-primary">{name}</span>?
                                </h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    You&apos;ll play against a simulated partner to learn the BB84 protocol.
                                </p>
                                <Button className="w-full bg-primary hover:bg-primary/90
                                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.3)]
                                    transition-all duration-300 text-base py-5">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Play Solo
                                </Button>
                            </>
                        )}

                        {mode === 'join' && (
                            <>
                                <h3 className="text-lg font-bold text-center">
                                    Enter the game PIN
                                </h3>
                                <div className="space-y-2">
                                    <Input placeholder="62V2H" value={pin}
                                        onChange={(e) => setPin(e.target.value.toUpperCase())}
                                        maxLength={5}
                                        className="tracking-[0.3em] font-mono text-center text-lg py-5"
                                        autoFocus />
                                </div>
                                <Button variant="secondary" className="w-full
                                    border border-transparent hover:border-primary/50
                                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                    transition-all duration-300 text-base py-5">
                                    <Users className="w-5 h-5 mr-2" />
                                    Join Game
                                </Button>
                            </>
                        )}

                        {mode === 'create' && (
                            <>
                                <h3 className="text-lg font-bold text-center">
                                    Configure a new game
                                </h3>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Number of photons</label>
                                        <Input type="number" placeholder="16" min={16} max={30} />
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input type="checkbox" className="accent-primary w-4 h-4" />
                                        <label className="text-sm">Is Eve present?</label>
                                    </div>
                                </div>
                                <Button variant="secondary" className="w-full
                                    border border-transparent hover:border-primary/50
                                    hover:shadow-[0_0_20px_hsl(152,100%,33%,0.25)]
                                    transition-all duration-300 text-base py-5">
                                    <Shield className="w-5 h-5 mr-2" />
                                    Create Game
                                </Button>
                            </>
                        )}

                        <button onClick={() => { setStep(2); setMode(null); }}
                            className="text-xs text-muted-foreground hover:text-primary
                                transition-colors cursor-pointer mx-auto block">
                            ← Back
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────────────────────────
   GAME CONCEPT 1 — The "Jackbox" Join-First
   Prioritizes joining a game with a massive PIN input.
   ───────────────────────────────────────────────────────────── */
function GameConcept1_JoinFirst() {
    return (
        <Card className="w-[350px] md:w-[500px] mx-auto pt-4 pb-2
            border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg
            hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)]
            transition-all duration-300">
            <CardContent className="space-y-5">
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-foreground">Join a Game</h3>
                    <p className="text-muted-foreground text-xs">Enter the code on the host&apos;s screen</p>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Player Name</label>
                        <Input 
                            placeholder="Alice" 
                            className="bg-background/50 border border-border"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Game PIN</label>
                        <Input 
                            placeholder="62V2H" 
                            className="h-12 text-center text-xl font-bold tracking-[0.2em] bg-background/50 border-2 border-primary/40 focus-visible:ring-primary uppercase font-mono"
                            maxLength={5}
                        />
                    </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(152,100%,33%,0.3)] transition-all">
                    <Users className="w-4 h-4 mr-2" />
                    Join Game
                </Button>

                <div className="relative flex py-2 items-center w-full">
                    <div className="flex-grow border-t border-border/50"></div>
                    <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs font-medium uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-border/50"></div>
                </div>

                <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                        <Shield className="w-4 h-4 mr-2" />
                        Create Game
                    </Button>
                    <Button variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Solo
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────────────────────────
   GAME CONCEPT 2 — The "Smash Bros" Card Flip
   Binary choice, entire UI flips contexts.
   ───────────────────────────────────────────────────────────── */
function GameConcept2_CardFlip() {
    const [flipFace, setFlipFace] = useState<'front' | 'solo' | 'multi'>('front');
    const isFlipped = flipFace !== 'front';
    
    return (
        <div className="w-[350px] md:w-[500px] h-[320px] mx-auto" style={{ perspective: '1000px' }}>
            <div 
                className="relative w-full h-full transition-all duration-700"
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>
                {/* FRONT (Main Menu) */}
                <Card 
                    className={cn("absolute inset-0 w-full h-full border border-border/60 bg-card/80 backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-[0_0_30px_hsl(152,100%,33%,0.15)] transition-all duration-300",
                        isFlipped ? "pointer-events-none" : "z-10"
                    )}
                    style={{ backfaceVisibility: 'hidden' }}>
                    <CardContent className="h-full flex flex-col items-center justify-center space-y-4 p-6">
                        <h3 className="text-xl font-bold text-muted-foreground mb-2">Select Game Mode</h3>
                        <Button 
                            onClick={() => setFlipFace('solo')}
                            className="w-full h-20 text-lg font-bold bg-background hover:bg-primary/10 border-2 border-border hover:border-primary/50 text-foreground transition-all flex justify-between px-8 group cursor-pointer">
                            <div className="flex items-center">
                                <Gamepad2 className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                Play Solo
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Button>
                        <Button 
                            onClick={() => setFlipFace('multi')}
                            className="cursor-pointer w-full h-20 text-lg font-bold bg-background hover:bg-primary/10 border-2 border-border hover:border-primary/50 text-foreground transition-all flex justify-between px-8 group">
                            <div className="flex items-center">
                                <Users className="w-6 h-6 mr-4 text-primary group-hover:drop-shadow-[0_0_8px_hsl(152,100%,33%,0.8)] transition-all" />
                                Multiplayer
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Button>
                    </CardContent>
                </Card>

                {/* BACK (Dynamic Solo or Multiplayer Menu) */}
                <Card 
                    className={cn("absolute inset-0 w-full h-full border border-primary/40 bg-card/90 backdrop-blur-md shadow-[0_0_40px_hsl(152,100%,33%,0.1)] flex flex-col",
                        !isFlipped ? "pointer-events-none" : "z-10"
                    )}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <CardContent className="h-full flex flex-col p-6 space-y-4">
                        <div className="flex items-center justify-between pointer-events-auto">
                            <h3 className="text-xl font-bold text-primary flex items-center">
                                {flipFace === 'multi' ? (
                                    <><Users className="w-5 h-5 mr-2" /> Multiplayer</>
                                ) : (
                                    <><Gamepad2 className="w-5 h-5 mr-2" /> Play Solo</>
                                )}
                            </h3>
                            <button 
                                onClick={() => setFlipFace('front')}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer flex items-center">
                                <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back
                            </button>
                        </div>
                        
                        {flipFace === 'multi' ? (
                            <div className="space-y-4 flex-grow flex flex-col justify-center">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1">Player Name</label>
                                    <Input placeholder="Alice" className="bg-background/50 h-10" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="space-y-2 flex-grow">
                                        <label className="text-xs font-medium text-muted-foreground ml-1">Game PIN</label>
                                        <Input placeholder="62V2H" className="bg-background/50 h-10 text-center tracking-widest font-mono text-lg" maxLength={5} />
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10">Join Game</Button>
                                    </div>
                                    <div className="flex items-center gap-2 px-1 pb-1">
                                        <div className="h-full border-l border-border/40"></div>
                                        <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest" style={{writingMode: 'vertical-rl'}}>or</span>
                                        <div className="h-full border-l border-border/40"></div>
                                    </div>
                                    <div className="space-y-2 flex-grow flex flex-col">
                                        <div className="flex-1 flex items-center justify-center rounded-md border border-dashed border-border/50 bg-background/20 text-xs text-muted-foreground p-2 text-center h-10">
                                            Create a new game
                                        </div>
                                        <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 h-10">Create Game</Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 flex-grow flex flex-col justify-center">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground ml-1">Player Name</label>
                                    <Input placeholder="Alice" className="bg-background/50 h-10" />
                                </div>
                                <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(152,100%,33%,0.3)]">
                                    Play Solo
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   GAME CONCEPT 3 — The "MOBA" Unified Button
   One dashboard, mode selector changes context, one START button.
   ───────────────────────────────────────────────────────────── */
function GameConcept3_MOBA() {
    const [mode, setMode] = useState<'solo' | 'join' | 'create'>('solo');
    
    return (
        <Card className="w-[350px] md:w-[500px] mx-auto overflow-hidden
            border border-border/60 bg-card/80 backdrop-blur-sm shadow-xl
            hover:border-primary/50 transition-all duration-300 relative group">
            
            {/* Visual background noise */}
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-all duration-700"></div>

            <CardContent className="p-0 flex flex-col h-[380px]">
                {/* Header / Mode Selector */}
                <div className="p-6 pb-2 border-b border-border/30 bg-background/30 flex justify-between items-center z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest mb-1.5">Game Mode</span>
                        <div className="flex space-x-1 bg-background/80 p-1 rounded-md border border-border/50">
                            <button onClick={() => setMode('solo')} 
                                className={cn("px-3 py-1 text-sm font-medium rounded-sm transition-all cursor-pointer", 
                                mode === 'solo' ? "bg-primary/20 text-primary shadow-sm ring-1 ring-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                                Solo
                            </button>
                            <button onClick={() => setMode('join')} 
                                className={cn("px-3 py-1 text-sm font-medium rounded-sm transition-all cursor-pointer", 
                                mode === 'join' ? "bg-primary/20 text-primary shadow-sm ring-1 ring-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                                Join
                            </button>
                            <button onClick={() => setMode('create')} 
                                className={cn("px-3 py-1 text-sm font-medium rounded-sm transition-all cursor-pointer", 
                                mode === 'create' ? "bg-primary/20 text-primary shadow-sm ring-1 ring-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                                Create
                            </button>
                        </div>
                    </div>
                    {mode === 'solo' && <Gamepad2 className="w-8 h-8 text-primary/40 mr-2" />}
                    {mode === 'join' && <UserPlus className="w-8 h-8 text-primary/40 mr-2" />}
                    {mode === 'create' && <Shield className="w-8 h-8 text-primary/40 mr-2" />}
                </div>

                {/* Main Content Area */}
                <div className="p-6 flex-grow flex flex-col justify-center space-y-4 z-10">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground pl-1 tracking-wider">Player Name</label>
                        <Input placeholder="Alice" className="bg-background/80 border-border/50 focus-visible:ring-primary/50" />
                    </div>
                    
                    <div className={cn("transition-all duration-300 overflow-hidden", 
                        mode === 'join' ? "h-[80px] opacity-100" : "h-0 opacity-0")}>
                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-bold text-muted-foreground pl-1 tracking-wider">Game PIN</label>
                            <Input placeholder="62V2H" className="bg-background/80 border-border/50 text-center tracking-[0.3em] font-mono focus-visible:ring-primary/50" maxLength={5} />
                        </div>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-4 bg-background/60 border-t border-border/40 z-10">
                    <Button className="w-full h-12 text-lg font-bold tracking-widest relative overflow-hidden group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(152,100%,33%,0.3)] border border-primary/50">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-200 ease-out"></div>
                        <span className="relative flex items-center z-10">
                            {mode === 'solo' && "Play Solo"}
                            {mode === 'join' && "Join Game"}
                            {mode === 'create' && "Create Game"}
                            <Zap className="w-5 h-5 ml-3 opacity-70 group-hover/btn:scale-110 transition-transform" />
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPARISON PAGE
   ═══════════════════════════════════════════════════════════════ */

/* ── Reusable separator between options ── */
function OptionSeparator() {
    return (
        <div className="py-4">
            <div className="w-full border-t border-border/30"></div>
        </div>
    );
}

export default function BB84CardComparison() {
    return (
        <div className="v2-theme-root min-h-screen relative">
            <AtmosphericBackground />
            <HeaderV3 />

            <div className="max-w-5xl mx-auto px-4 pt-8 pb-20 space-y-16">

                {/* ── Page Header ── */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        <span className="text-primary drop-shadow-[0_0_25px_hsl(152,100%,33%,0.5)]">
                            BB84
                        </span>{' '}
                        Game Card — Design Comparison
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        7 design options for the game form (Solo / Join / Create).
                        Each card is interactive — try them and pick the best UX.
                    </p>
                </div>

                {/* ═══ OPTION 1 — Card Flip ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary bg-primary/10">
                            Option 1
                        </Badge>
                        <h2 className="text-2xl font-bold">Card Flip</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Forces a clean binary choice. Clicking Multiplayer physically flips the UI context. 
                        Feels premium and application-like. Separates concerns perfectly without navigating to a new page.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <GameConcept2_CardFlip />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Incredible &quot;wow&quot; factor</li>
                                    <li>+ Cleanest top-level menu</li>
                                    <li>+ Strong visual metaphors</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− Animation can feel heavy</li>
                                    <li>− Name field must be managed globally</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 2 — Tab-Based ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 2
                        </Badge>
                        <h2 className="text-2xl font-bold">Tab-Based Card</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        3 tabs (Solo | Rejoindre | Créer), each shows only relevant fields.
                        Clean and familiar — each scenario is focused.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <Option1_TabBased />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Each scenario is focused</li>
                                    <li>+ Familiar tab pattern</li>
                                    <li>+ No hidden fields</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− 3 tabs can feel heavy</li>
                                    <li>− Name duplicated in each tab</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 3 — MOBA Lobby ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 3
                        </Badge>
                        <h2 className="text-2xl font-bold">Unified Dashboard</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Fixed layout with a single action button. Changing modes alters the fields above 
                        and the button&apos;s text. Similar logic to Tab-Based but more compact — 
                        one master button, no tab content switching.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <GameConcept3_MOBA />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Strict, predictable layout</li>
                                    <li>+ Very compact vertical height</li>
                                    <li>+ Single master START button</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− Very dense visually</li>
                                    <li>− Small mode selector targets</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 4 — Progressive Reveal ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 4
                        </Badge>
                        <h2 className="text-2xl font-bold">Progressive Reveal</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Name + &quot;Play Solo&quot; as default fast path. Collapsible &quot;Multiplayer&quot;
                        section below reveals PIN + Join/Create. Solo path is instant and clean.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <Option2_ProgressiveReveal />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Solo path is instant</li>
                                    <li>+ Clean default state</li>
                                    <li>+ Works with gamification</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− Multiplayer slightly hidden</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 4b — Always-Open ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 4b
                        </Badge>
                        <h2 className="text-2xl font-bold">Always-Open</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Same layout as Option 4, but multiplayer is always visible — no click
                        needed. Solo stays the primary CTA, multiplayer sits below the divider.
                        Everything is visible at a glance.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <Option2b_AlwaysOpen />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Everything visible at once</li>
                                    <li>+ Solo is still primary</li>
                                    <li>+ No hidden interactions</li>
                                    <li>+ Simple, no state to manage</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− Card is taller</li>
                                    <li>− PIN field always visible (even if unused)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 5 — Two-Card Split ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 5
                        </Badge>
                        <h2 className="text-2xl font-bold">Two-Card Split</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Separate Solo card and Multiplayer card side-by-side.
                        Crystal clear separation, scalable for adding avatar/difficulty settings.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <Option3_TwoCardSplit />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Crystal clear separation</li>
                                    <li>+ Scalable for extras</li>
                                    <li>+ Both visible at once</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− More page space</li>
                                    <li>− Name field duplicated</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 6 — Join-First ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 6
                        </Badge>
                        <h2 className="text-2xl font-bold">Join-First</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Optimized for classrooms where 1 person hosts and many join. 
                        The absolute fastest way to get students into a room. 
                        No tabs, no cognitive load. PIN input is front and center.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <GameConcept1_JoinFirst />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Ultimate UX for classrooms</li>
                                    <li>+ Zero tabs, zero confusion</li>
                                    <li>+ Massively prioritizes joining</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− Solo play is secondary</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <OptionSeparator />

                {/* ═══ OPTION 7 — Wizard / Stepper ═══ */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline"
                            className="text-sm px-3 py-1 border-primary/50 text-primary">
                            Option 7
                        </Badge>
                        <h2 className="text-2xl font-bold">Wizard / Stepper</h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl">
                        Step 1: Enter name → Step 2: Choose path (Solo / Join / Create) →
                        Step 3: Action. Guided onboarding pattern used by Stripe, Vercel, etc.
                        Name entered once, zero irrelevant fields.
                    </p>
                    <div className="py-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <div className="flex-1 min-w-[350px]">
                                <Option4_Wizard />
                            </div>
                            <div className="w-60 space-y-2 text-sm shrink-0 hidden lg:block">
                                <p className="font-medium text-primary">Pros</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>+ Zero irrelevant fields</li>
                                    <li>+ Name entered once</li>
                                    <li>+ Guided &amp; educational</li>
                                    <li>+ Scalable for extras</li>
                                </ul>
                                <p className="font-medium text-primary mt-3">Cons</p>
                                <ul className="text-muted-foreground space-y-1">
                                    <li>− More clicks for experts</li>
                                    <li>− Requires back navigation</li>
                                    <li>− Feels like a form, not a game</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Brand Signature Watermark */}
            <div className="fixed bottom-8 left-8 pointer-events-none opacity-10 hidden xl:block select-none">
                <Image
                    src="/images/QC_icon_black.svg" alt="QC Watermark"
                    width={80} height={80} className="block dark:hidden" />
                <Image
                    src="/images/QC_icon_white.svg" alt="QC Watermark"
                    width={80} height={80} className="hidden dark:block" />
            </div>

            <FooterV3 />
        </div>
    );
}

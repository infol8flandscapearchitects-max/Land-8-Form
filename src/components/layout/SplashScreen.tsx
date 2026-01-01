'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
    companyNameColor?: string;
    duration?: number;
}

// Static splash logo - independent from admin panel
const SPLASH_LOGO = '/splash-logo.png';

// Principles that scroll RIGHT (from left side towards center)
const LEFT_PRINCIPLES = [
    { text: 'Rhythm', top: '8%', startX: '20%', size: 'large' },
    { text: 'Emphasis', top: '22%', startX: '5%', size: 'large' },
    { text: 'Variety', top: '75%', startX: '10%', size: 'large' },
    { text: 'Transition', top: '62%', startX: '3%', size: 'large' },
];

// Principles that scroll LEFT (from right side towards center)
const RIGHT_PRINCIPLES = [
    { text: 'Balance', top: '4%', startX: '70%', size: 'large' },
    { text: 'Simplicity', top: '18%', startX: '78%', size: 'large' },
    { text: 'Proportion', top: '82%', startX: '73%', size: 'large' },
    { text: 'Unity', top: '68%', startX: '85%', size: 'large' },
];

export default function SplashScreen({ companyNameColor = '#D4782C', duration = 7000 }: SplashScreenProps) {
    const [phase, setPhase] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [isMorphing, setIsMorphing] = useState(false);
    const [scrollActive, setScrollActive] = useState(false);

    useEffect(() => {
        // Check if splash was already shown this session
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
        if (hasSeenSplash) {
            setIsVisible(false);
            return;
        }

        // Phase 1: Logo appears (0-1500ms)
        const phase1Timer = setTimeout(() => setPhase(1), 100);

        // Phase 2: LAND + FORM + center logo appear (1500-3500ms)
        const phase2Timer = setTimeout(() => {
            setPhase(2);
            setScrollActive(true); // Start scrolling when principles appear
        }, 1500);

        // Phase 3: Tagline drops in (3500-5500ms)
        const phase3Timer = setTimeout(() => setPhase(3), 3500);

        // Phase 4: Hold (5500-6000ms)
        const phase4Timer = setTimeout(() => setPhase(4), 5500);

        // Phase 5: Morphing transition (6000-7500ms)
        const phase5Timer = setTimeout(() => {
            setPhase(5);
            setIsMorphing(true);
        }, 6000);

        // Start exit
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration);

        // Complete exit
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('hasSeenSplash', 'true');
        }, duration + 1000);

        return () => {
            clearTimeout(phase1Timer);
            clearTimeout(phase2Timer);
            clearTimeout(phase3Timer);
            clearTimeout(phase4Timer);
            clearTimeout(phase5Timer);
            clearTimeout(exitTimer);
            clearTimeout(hideTimer);
        };
    }, [duration]);

    if (!isVisible) return null;

    const phaseClass = `phase-${phase}`;
    const exitClass = isExiting ? 'splash-exiting' : '';
    const morphClass = isMorphing ? 'splash-morphing' : '';

    // Helper to get size class
    const getSizeClass = (size: string) => {
        switch (size) {
            case 'large': return 'splash-principle-large';
            case 'medium': return 'splash-principle-medium';
            case 'small': return 'splash-principle-small';
            default: return 'splash-principle-medium';
        }
    };

    return (
        <div className={`landform-splash ${phaseClass} ${exitClass} ${morphClass}`}>
            {/* Background Principles */}
            <div className="splash-principles-bg">
                {/* LEFT SIDE principles - scroll RIGHT towards center */}
                {LEFT_PRINCIPLES.map((principle, index) => (
                    <span
                        key={`left-${index}`}
                        className={`splash-principle ${getSizeClass(principle.size)} splash-scroll-right ${scrollActive ? 'scrolling' : ''}`}
                        style={{
                            top: principle.top,
                            left: principle.startX,
                            animationDelay: `${index * 150}ms`,
                        }}
                    >
                        {principle.text}
                    </span>
                ))}

                {/* RIGHT SIDE principles - scroll LEFT towards center */}
                {RIGHT_PRINCIPLES.map((principle, index) => (
                    <span
                        key={`right-${index}`}
                        className={`splash-principle ${getSizeClass(principle.size)} splash-scroll-left ${scrollActive ? 'scrolling' : ''}`}
                        style={{
                            top: principle.top,
                            left: principle.startX,
                            animationDelay: `${index * 150}ms`,
                        }}
                    >
                        {principle.text}
                    </span>
                ))}
            </div>

            {/* Main Content */}
            <div className="splash-content">
                {/* Initial Big Logo - Phase 1 */}
                <div className="splash-logo-initial">
                    <Image
                        src={SPLASH_LOGO}
                        alt="LAND 8 FORM Logo"
                        width={280}
                        height={280}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                {/* Brand Row: LAND + Logo + FORM */}
                <div className="splash-brand-row">
                    {/* LAND */}
                    <span className="splash-text splash-land" style={{ color: companyNameColor }}>
                        <span className="letter letter-cap letter-L">L</span>
                        <span className="letter letter-A">A</span>
                        <span className="letter letter-N">N</span>
                        <span className="letter letter-D">D</span>
                    </span>

                    {/* Center Logo */}
                    <div className="splash-logo-center">
                        <Image
                            src={SPLASH_LOGO}
                            alt="LAND 8 FORM Logo"
                            width={120}
                            height={120}
                            className="splash-svg-logo-small"
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    {/* FORM */}
                    <span className="splash-text splash-form" style={{ color: companyNameColor }}>
                        <span className="letter letter-cap letter-F">F</span>
                        <span className="letter letter-O">O</span>
                        <span className="letter letter-R">R</span>
                        <span className="letter letter-M">M</span>
                    </span>
                </div>

                {/* Tagline */}
                <div className="splash-tagline" style={{ color: companyNameColor }}>
                    <span className="tagline-word">
                        {'LANDSCAPE'.split('').map((letter, i) => (
                            <span key={`l-${i}`} className="tl">{letter}</span>
                        ))}
                    </span>
                    <span className="tagline-space" />
                    <span className="tagline-word">
                        {'ARCHITECTS'.split('').map((letter, i) => (
                            <span key={`a-${i}`} className="tl">{letter}</span>
                        ))}
                    </span>
                </div>
            </div>

            {/* Inline styles for scrolling animations */}
            <style jsx>{`
                /* Scrolling animations for principles */
                .splash-scroll-right {
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                
                .splash-scroll-left {
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                
                /* When scrolling is active */
                .splash-scroll-right.scrolling {
                    opacity: 1;
                    animation: scroll-to-right 5s ease-out forwards;
                }
                
                .splash-scroll-left.scrolling {
                    opacity: 1;
                    animation: scroll-to-left 5s ease-out forwards;
                }
                
                /* Scroll RIGHT - from current position towards center (move right) */
                @keyframes scroll-to-right {
                    0% {
                        transform: translateX(0);
                        opacity: 0.5;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(15vw);
                        opacity: 0.5;
                    }
                }
                
                /* Scroll LEFT - from current position towards center (move left) */
                @keyframes scroll-to-left {
                    0% {
                        transform: translateX(0);
                        opacity: 0.5;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-15vw);
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
}

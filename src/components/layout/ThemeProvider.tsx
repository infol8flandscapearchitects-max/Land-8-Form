'use client';

import { useEffect } from 'react';

interface ThemeProviderProps {
    backgroundColor?: string;
    primaryAccentColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    fontFamily?: string;
    children: React.ReactNode;
}

// Helper to calculate secondary background (slightly lighter)
function calculateSecondaryBg(hex: string): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Lighten by 15%
    const lighten = (c: number) => Math.min(255, Math.round(c + (255 - c) * 0.15));

    return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
}

// Helper to calculate hover color (slightly lighter/brighter)
function calculateHoverColor(hex: string): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Brighten by 10%
    const brighten = (c: number) => Math.min(255, Math.round(c * 1.1));

    return `#${brighten(r).toString(16).padStart(2, '0')}${brighten(g).toString(16).padStart(2, '0')}${brighten(b).toString(16).padStart(2, '0')}`;
}

export default function ThemeProvider({
    backgroundColor,
    primaryAccentColor,
    textColor,
    secondaryTextColor,
    fontFamily,
    children,
}: ThemeProviderProps) {
    useEffect(() => {
        const root = document.documentElement;

        // Apply background color
        if (backgroundColor) {
            root.style.setProperty('--background', backgroundColor);
            root.style.setProperty('--background-secondary', calculateSecondaryBg(backgroundColor));
        }

        // Apply primary accent color
        if (primaryAccentColor) {
            root.style.setProperty('--primary-accent', primaryAccentColor);
            root.style.setProperty('--primary-accent-hover', calculateHoverColor(primaryAccentColor));
        }

        // Apply text colors
        if (textColor) {
            root.style.setProperty('--text-primary', textColor);
        }

        if (secondaryTextColor) {
            root.style.setProperty('--text-secondary', secondaryTextColor);
        }

        // Apply font family
        if (fontFamily) {
            root.style.setProperty('--font-primary', `"${fontFamily}", "Nunito", sans-serif`);
        }

        // Cleanup on unmount
        return () => {
            root.style.removeProperty('--background');
            root.style.removeProperty('--background-secondary');
            root.style.removeProperty('--primary-accent');
            root.style.removeProperty('--primary-accent-hover');
            root.style.removeProperty('--text-primary');
            root.style.removeProperty('--text-secondary');
            root.style.removeProperty('--font-primary');
        };
    }, [backgroundColor, primaryAccentColor, textColor, secondaryTextColor, fontFamily]);

    return <>{children}</>;
}

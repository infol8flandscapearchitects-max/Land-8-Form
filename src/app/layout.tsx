import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'LAND 8 FORM | Building Tomorrow\'s Vision',
    description: 'Award-winning architecture firm specializing in sustainable design, residential, commercial, and landscape architecture. Creating spaces that inspire.',
    keywords: 'architecture, design, construction, sustainable architecture, residential, commercial, landscape design',
    authors: [{ name: 'LAND 8 FORM' }],
    openGraph: {
        title: 'LAND 8 FORM | Building Tomorrow\'s Vision',
        description: 'Award-winning architecture firm specializing in sustainable design and innovative architecture solutions.',
        type: 'website',
        locale: 'en_US',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#2D2D2D" />
            </head>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}

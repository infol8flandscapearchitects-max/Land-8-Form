'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2 } from 'lucide-react';

interface HeaderProps {
    logoUrl?: string;
    companyName?: string;
    companyNameColor?: string;
}

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
];

export default function Header({
    logoUrl,
    companyName = 'LAND 8 FORM',
    companyNameColor = '#CC5500'
}: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
                style={{
                    background: isScrolled
                        ? 'rgba(45, 45, 45, 0.95)'
                        : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
                }}
            >
                <div className="container mx-auto px-0 lg:px-2">
                    <nav className="flex items-center justify-between h-20">
                        {/* Logo from Admin */}
                        <Link href="/" className="flex items-center gap-0 group ml-0 lg:-ml-4">
                            {logoUrl ? (
                                <div className="relative w-[300px] h-[150px] overflow-hidden rounded-lg flex items-center justify-start transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src={logoUrl}
                                        alt={companyName}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Building2 size={32} className="text-[var(--primary-accent)]" />
                                    <span
                                        className="text-xl font-bold"
                                        style={{ color: companyNameColor }}
                                    >
                                        {companyName}
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <ul className="hidden lg:flex items-center gap-8">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`relative py-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${pathname === item.href
                                            ? 'text-[var(--primary-accent)]'
                                            : 'text-[var(--text-primary)] hover:text-[var(--primary-accent)]'
                                            }`}
                                    >
                                        {item.name}
                                        {pathname === item.href && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--primary-accent)]"
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-[var(--text-primary)] hover:text-[var(--primary-accent)] transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu size={28} />
                        </button>
                    </nav>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 w-[80%] max-w-[320px] h-full bg-[var(--background-secondary)] z-[1000] p-8 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <span
                                    className="text-lg font-bold"
                                    style={{ color: companyNameColor }}
                                >
                                    {companyName}
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-[var(--text-primary)] hover:text-[var(--primary-accent)] transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <nav className="flex-1">
                                <ul className="space-y-6">
                                    {navItems.map((item, index) => (
                                        <motion.li
                                            key={item.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`block text-xl font-semibold transition-colors duration-300 ${pathname === item.href
                                                    ? 'text-[var(--primary-accent)]'
                                                    : 'text-[var(--text-primary)] hover:text-[var(--primary-accent)]'
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="pt-8 border-t border-[var(--glass-border)]">
                                <p className="text-sm text-[var(--text-secondary)]">
                                    © {new Date().getFullYear()} {companyName}. All rights reserved.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

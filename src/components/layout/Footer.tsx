'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Linkedin,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Building2
} from 'lucide-react';

// Custom Pinterest icon component since lucide-react doesn't have one
const PinterestIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345c-.091.378-.293 1.194-.332 1.361-.053.218-.174.265-.402.16-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378 0 0-.602 2.291-.748 2.853-.271 1.042-1.002 2.349-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
);

interface FooterProps {
    logoUrl?: string;
    companyName?: string;
    companyNameColor?: string;
    contactInfo?: {
        linkedin_url?: string | null;
        instagram_url?: string | null;
        youtube_url?: string | null;
        pinterest_url?: string | null;
        email?: string;
        phone?: string;
        telephone?: string | null;
        address?: string;
        map_url?: string | null;
    };
}

export default function Footer({
    logoUrl,
    companyName = 'LAND 8 FORM',
    companyNameColor = '#CC5500',
    contactInfo = {},
}: FooterProps) {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Linkedin, url: contactInfo.linkedin_url, label: 'LinkedIn' },
        { icon: Instagram, url: contactInfo.instagram_url, label: 'Instagram' },
        { icon: Youtube, url: contactInfo.youtube_url, label: 'YouTube' },
        { icon: PinterestIcon, url: contactInfo.pinterest_url, label: 'Pinterest' },
        { icon: Mail, url: `mailto:${contactInfo.email}`, label: 'Email' },
    ].filter(link => link.url);

    const quickLinks = [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-[var(--background-secondary)] to-[#1a1a1a] border-t border-[var(--glass-border)] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-accent)]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--primary-accent)]/3 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 lg:px-8 pt-32 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Logo and Company Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <Link href="/" className="flex items-center gap-4 group mb-6">
                            <div className="relative w-[300px] h-[150px] overflow-hidden rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                {logoUrl ? (
                                    <Image
                                        src={logoUrl}
                                        alt={companyName}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <Building2 size={32} className="text-[var(--primary-accent)]" />
                                )}
                            </div>
                        </Link>
                        <p className="text-[var(--text-secondary)] text-center lg:text-left max-w-xs">
                            Building dreams into reality with innovative architecture and design excellence.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <h4 className="text-lg font-bold mb-6 text-[var(--text-primary)] relative">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[var(--primary-accent)] to-transparent rounded-full" />
                        </h4>
                        <nav className="flex flex-col gap-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-[var(--text-secondary)] hover:text-[var(--primary-accent)] hover:translate-x-1 transition-all duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <h4 className="text-lg font-bold mb-6 text-[var(--text-primary)] relative">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[var(--primary-accent)] to-transparent rounded-full" />
                        </h4>
                        <div className="space-y-4">
                            {contactInfo.phone && (
                                <a
                                    href={`tel:${contactInfo.phone}`}
                                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-accent)]/10 flex items-center justify-center group-hover:bg-[var(--primary-accent)]/20 transition-colors">
                                        <Phone size={16} className="text-[var(--primary-accent)]" />
                                    </div>
                                    <span>{contactInfo.phone}</span>
                                </a>
                            )}
                            {contactInfo.telephone && (
                                <a
                                    href={`tel:${contactInfo.telephone}`}
                                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-accent)]/10 flex items-center justify-center group-hover:bg-[var(--primary-accent)]/20 transition-colors">
                                        <Phone size={16} className="text-[var(--primary-accent)]" />
                                    </div>
                                    <span>{contactInfo.telephone}</span>
                                </a>
                            )}
                            {contactInfo.email && (
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-accent)]/10 flex items-center justify-center group-hover:bg-[var(--primary-accent)]/20 transition-colors">
                                        <Mail size={16} className="text-[var(--primary-accent)]" />
                                    </div>
                                    <span>{contactInfo.email}</span>
                                </a>
                            )}
                            {contactInfo.address && (
                                <a
                                    href={contactInfo.map_url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-accent)]/10 flex items-center justify-center group-hover:bg-[var(--primary-accent)]/20 transition-colors flex-shrink-0">
                                        <MapPin size={16} className="text-[var(--primary-accent)]" />
                                    </div>
                                    <span className="max-w-xs">{contactInfo.address}</span>
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center lg:items-end"
                    >
                        <h4 className="text-lg font-bold mb-6 text-[var(--text-primary)] relative">
                            Follow Us
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[var(--primary-accent)] to-transparent rounded-full" />
                        </h4>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.url!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary-accent)] hover:border-[var(--primary-accent)] hover:shadow-lg hover:shadow-[var(--primary-accent)]/20 transition-all duration-300"
                                    aria-label={link.label}
                                >
                                    <link.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                        <div className="mt-8">
                            <Link
                                href="/contact"
                                className="btn-primary text-sm"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Copyright and Developer Credit */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 pt-8 border-t border-[var(--glass-border)]/50"
                >
                    <div className="flex flex-col items-center justify-center gap-4 text-center pb-16">
                        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary-accent)]/50 to-transparent rounded-full mb-3" />
                        <p className="text-[var(--text-secondary)] text-sm">
                            © {currentYear} {companyName}. All rights reserved.
                        </p>
                        <p className="text-[var(--text-muted)] text-xs mb-8">
                            Website designed & developed by <a href="https://binarybridge.in" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-colors cursor-pointer">BinaryBridge</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}

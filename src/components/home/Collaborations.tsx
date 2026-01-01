'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Collaboration } from '@/lib/types/database';

interface CollaborationsProps {
    collaborations: Collaboration[];
}

export default function Collaborations({ collaborations }: CollaborationsProps) {
    if (collaborations.length === 0) return null;

    return (
        <section className="section collaboration-section relative overflow-hidden bg-gradient-to-br from-[#3a3a3a] via-[#2d2d2d] to-[#252525]">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-accent)]/5 via-transparent to-[var(--primary-accent)]/5 pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {/* Trusted Partners Badge */}
                    <span className="inline-block px-4 py-1.5 rounded-full bg-transparent border border-[var(--primary-accent)]/50 text-[var(--primary-accent)] font-semibold text-xs uppercase tracking-wider mb-6">
                        Trusted Partners
                    </span>
                    <h2 className="section-title centered text-center mx-auto text-3xl md:text-4xl lg:text-5xl font-bold italic heading-glow">
                        Our Collaborations
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mt-4">
                        We work with industry-leading partners to deliver exceptional results for our clients.
                    </p>
                </motion.div>

                {/* Glossy Card Container for Marquee */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative rounded-2xl p-6 overflow-hidden
                        bg-gradient-to-br from-[rgba(58,58,58,0.6)] via-[rgba(45,45,45,0.5)] to-[rgba(35,35,35,0.6)]
                        backdrop-blur-xl border border-[rgba(255,255,255,0.08)]
                        shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                    {/* Top shine effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/3 to-transparent rounded-t-2xl" />
                    </div>

                    {/* Subtle accent border */}
                    <div className="absolute inset-0 rounded-2xl border border-[var(--primary-accent)]/10 pointer-events-none" />

                    {/* Auto-Scrolling Logo Marquee */}
                    <div className="relative overflow-hidden">
                        {/* Gradient overlays for fade effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[rgba(45,45,45,0.95)] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[rgba(45,45,45,0.95)] to-transparent z-10 pointer-events-none" />

                        {/* Scrolling container - continuous scroll */}
                        <div className="flex animate-scroll-continuous py-4">
                            {/* First set of logos */}
                            <div className="flex gap-12 items-center shrink-0 px-6">
                                {collaborations.map((collab) => (
                                    <a
                                        key={collab.id}
                                        href={collab.website_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 flex-shrink-0 hover:scale-110"
                                    >
                                        <Image
                                            src={collab.logo_url}
                                            alt={collab.name || 'Partner'}
                                            fill
                                            className="object-contain drop-shadow-md"
                                        />
                                    </a>
                                ))}
                            </div>
                            {/* Duplicate set for seamless loop */}
                            <div className="flex gap-12 items-center shrink-0 px-6">
                                {collaborations.map((collab) => (
                                    <a
                                        key={`dup-${collab.id}`}
                                        href={collab.website_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 flex-shrink-0 hover:scale-110"
                                    >
                                        <Image
                                            src={collab.logo_url}
                                            alt={collab.name || 'Partner'}
                                            fill
                                            className="object-contain drop-shadow-md"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}


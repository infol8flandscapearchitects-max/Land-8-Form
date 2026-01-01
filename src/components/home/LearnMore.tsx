'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LearnMoreSection as LearnMoreSectionType } from '@/lib/types/database';

interface LearnMoreProps {
    data: LearnMoreSectionType | null;
}

export default function LearnMore({ data }: LearnMoreProps) {
    // Default data if none from database
    const defaultData: LearnMoreSectionType = {
        id: '1',
        heading: 'Crafting Spaces That Inspire',
        image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
        description: 'For over two decades, we have been at the forefront of architectural innovation. Our multidisciplinary team of architects, designers, and engineers work collaboratively to create spaces that not only meet functional requirements but also evoke emotion and inspire those who inhabit them. From concept to completion, we are committed to excellence in every detail.',
        button_text: 'Learn More About Us',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const section = data || defaultData;

    return (
        <section className="section bg-[var(--background)] overflow-hidden glossy-section relative">
            {/* Decorative blur orbs */}
            <div className="blur-orb blur-orb-accent w-96 h-96 top-1/2 -right-48" />
            <div className="blur-orb blur-orb-white w-64 h-64 bottom-0 left-1/4" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="order-2 lg:order-1"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="section-title mb-8 heading-glow"
                        >
                            {section.heading}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8"
                        >
                            {section.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Link href="/about" className="btn-primary btn-glow">
                                {section.button_text}
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="order-1 lg:order-2 relative flex justify-center lg:justify-end"
                    >
                        <div className="relative aspect-square w-[280px] md:w-[320px] lg:w-[350px]">
                            {/* Background decorative elements with glow */}
                            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[var(--primary-accent)] rounded-2xl opacity-30 shadow-[0_0_30px_rgba(224,123,57,0.2)]" />
                            <div className="absolute -bottom-4 -left-4 w-3/4 h-3/4 bg-gradient-to-br from-[var(--primary-accent)] to-transparent rounded-2xl opacity-10" />

                            {/* Main Image with glossy card */}
                            <div className="relative h-full rounded-2xl overflow-hidden glossy-card shadow-2xl">
                                {section.image_url && (
                                    <Image
                                        src={section.image_url}
                                        alt={section.heading}
                                        fill
                                        className="object-contain relative z-10"
                                    />
                                )}
                                {/* Glossy overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/40 via-transparent to-white/5 z-20" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CeoSection as CeoSectionType } from '@/lib/types/database';

interface CeoSectionProps {
    data: CeoSectionType | null;
}

export default function CeoSection({ data }: CeoSectionProps) {
    // Default data if none from database
    const defaultData: CeoSectionType = {
        id: '1',
        photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
        name: 'Alexander Mitchell',
        title: 'Chief Executive Officer & Founder',
        vision: '"Architecture is the thoughtful making of space."',
        description: 'With over 25 years of experience in architectural design and urban planning, Alexander has led our firm to become a leading force in sustainable and innovative architecture. His vision combines aesthetic excellence with environmental responsibility, creating spaces that inspire and endure.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const ceo = data || defaultData;

    return (
        <section className="section bg-[var(--background)] glossy-section relative">
            {/* Decorative blur orbs */}
            <div className="blur-orb blur-orb-accent w-96 h-96 -top-48 -left-48" />
            <div className="blur-orb blur-orb-white w-64 h-64 top-1/2 right-0" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* CEO Photo */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
                            {/* Glossy photo container */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl transform rotate-3 opacity-20" />
                            <div className="relative h-full rounded-2xl overflow-hidden glossy-card">
                                <Image
                                    src={ceo.photo_url}
                                    alt={ceo.name}
                                    fill
                                    className="object-cover relative z-10"
                                />
                                {/* Glossy overlay on image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5 z-20" />
                            </div>
                            {/* Decorative Element with glow */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gray-500 rounded-2xl -z-10 shadow-[0_0_30px_rgba(107,114,128,0.3)]" />
                        </div>
                    </motion.div>

                    {/* CEO Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-[var(--text-primary)] heading-glow"
                        >
                            {ceo.name}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-[var(--primary-accent)] font-semibold text-2xl md:text-3xl mb-8"
                        >
                            {ceo.title}
                        </motion.p>

                        <motion.blockquote
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="relative pl-6 border-l-4 border-[var(--primary-accent)] mb-8 shadow-[inset_4px_0_15px_-5px_rgba(224,123,57,0.3)]"
                        >
                            <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] italic">
                                {ceo.vision}
                            </p>
                        </motion.blockquote>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-[var(--text-secondary)] text-lg leading-relaxed"
                        >
                            {ceo.description}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

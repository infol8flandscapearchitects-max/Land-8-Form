'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/lib/types/database';

interface FeaturedProjectsProps {
    projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
    // Default projects if none from database
    const defaultProjects: Project[] = [
        {
            id: '1',
            title: 'Skyline Residences',
            description: 'A luxury high-rise residential complex featuring panoramic city views and sustainable design.',
            short_description: 'Luxury residential complex with panoramic views',
            image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            gallery_images: null,
            category_id: '1',
            status: 'completed',
            is_featured: true,
            display_order: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            title: 'Green Valley Villas',
            description: 'Eco-friendly villas with integrated smart home technology and natural landscaping.',
            short_description: 'Eco-friendly smart villas',
            image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
            gallery_images: null,
            category_id: '2',
            status: 'ongoing',
            is_featured: true,
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '3',
            title: 'Horizon Business Park',
            description: 'Modern commercial complex designed for the future of work with flexible spaces.',
            short_description: 'Modern commercial complex',
            image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
            gallery_images: null,
            category_id: '3',
            status: 'upcoming',
            is_featured: true,
            display_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    const displayProjects = projects.length > 0 ? projects : defaultProjects;

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'badge-upcoming';
            case 'ongoing':
                return 'badge-ongoing';
            case 'completed':
                return 'badge-completed';
            default:
                return 'badge-category';
        }
    };

    return (
        <section className="section bg-[var(--background-secondary)] glossy-section relative">
            {/* Decorative blur orbs */}
            <div className="blur-orb blur-orb-accent w-80 h-80 -top-40 right-1/4" />
            <div className="blur-orb blur-orb-white w-96 h-96 bottom-0 -left-48" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title centered text-center mx-auto heading-glow">
                        Featured Projects
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mt-6">
                        Explore our most distinguished architectural achievements that showcase
                        innovation, sustainability, and timeless design.
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid-responsive">
                    {displayProjects.slice(0, 6).map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Link href={`/projects/${project.id}`}>
                                <article className="glossy-card group cursor-pointer hover:scale-[1.02] transition-transform duration-300 h-full">
                                    <div className="relative aspect-[4/3] img-zoom overflow-hidden rounded-t-[1.5rem]">
                                        <Image
                                            src={project.image_url}
                                            alt={project.title}
                                            fill
                                            className="object-cover relative z-10 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                    </div>

                                    <div className="p-6 relative z-10">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary-accent)] transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                                            {project.short_description}
                                        </p>
                                        <div className="flex items-center text-[var(--primary-accent)] font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                                            <span>View Project</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link href="/projects" className="btn-primary btn-glow">
                        View All Projects
                        <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

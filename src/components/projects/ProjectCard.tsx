'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/lib/types/database';

interface ProjectCardProps {
    project: Project;
    index?: number;
    categoryName?: string;
}

export default function ProjectCard({ project, index = 0, categoryName }: ProjectCardProps) {
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'ongoing':
                return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'completed':
                return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    return (
        <Link href={`/projects/${project.id}`}>
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="premium-card group cursor-pointer h-full"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Arrow Icon on Hover */}
                    <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary-accent)] to-[var(--primary-accent-hover)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-50 shadow-lg shadow-[var(--primary-accent)]/30">
                        <ArrowUpRight size={22} className="text-white" />
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-sm text-white/80 line-clamp-2">
                            {project.short_description || project.description}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 relative">
                    {/* Accent line */}
                    <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[var(--primary-accent)] via-[var(--primary-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--primary-accent)] transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2">
                        {project.short_description || project.description}
                    </p>

                    {/* View Project Link */}
                    <div className="mt-4 flex items-center gap-2 text-[var(--primary-accent)] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Project</span>
                        <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}


'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import StatusFilter from './StatusFilter';
import ProjectCard from './ProjectCard';
import { Project, ProjectCategory } from '@/lib/types/database';

interface ProjectGridProps {
    initialProjects: Project[];
    initialCategories: ProjectCategory[];
    projectsPerPage?: number;
}

type ProjectStatus = 'upcoming' | 'ongoing' | 'completed';

export default function ProjectGrid({
    initialProjects,
    initialCategories,
    projectsPerPage = 10,
}: ProjectGridProps) {
    const [projects] = useState<Project[]>(initialProjects);
    const [categories] = useState<ProjectCategory[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(null);
    const [isLoading] = useState(false);

    // Default projects if none provided
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
        {
            id: '4',
            title: 'Serene Gardens Estate',
            description: 'Luxurious landscape design with water features and sustainable gardening.',
            short_description: 'Premium landscape design',
            image_url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&q=80',
            gallery_images: null,
            category_id: '4',
            status: 'completed',
            is_featured: false,
            display_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '5',
            title: 'Cinema Magic Studios',
            description: 'State-of-the-art  construction for major film productions.',
            short_description: 'Professional  design',
            image_url: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&q=80',
            gallery_images: null,
            category_id: '5',
            status: 'ongoing',
            is_featured: false,
            display_order: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '6',
            title: 'Urban Oasis Park',
            description: 'Community park design featuring recreational spaces and green architecture.',
            short_description: 'Community recreational park',
            image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
            gallery_images: null,
            category_id: '6',
            status: 'upcoming',
            is_featured: false,
            display_order: 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    // Only show real projects from the database, not fallback defaults
    // This prevents broken links when clicking on fake project IDs
    const displayProjects = projects;

    // Filter projects on client side
    const filteredProjects = displayProjects.filter((project) => {
        const categoryMatch = selectedCategory === null || project.category_id === selectedCategory;
        const statusMatch = selectedStatus === null || project.status === selectedStatus;
        return categoryMatch && statusMatch;
    });

    const getCategoryName = (categoryId: string | null): string | undefined => {
        if (!categoryId) return undefined;
        const category = categories.find((c) => c.id === categoryId);
        return category?.name;
    };

    return (
        <div>
            {/* Filters */}
            <div className="mb-8 space-y-4">
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
                <StatusFilter
                    selectedStatus={selectedStatus}
                    onSelectStatus={setSelectedStatus}
                />
            </div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
                {isLoading && projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid-responsive"
                    >
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card">
                                <div className="aspect-[4/3] skeleton" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 skeleton w-3/4" />
                                    <div className="h-4 skeleton w-full" />
                                    <div className="h-4 skeleton w-2/3" />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : filteredProjects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-20"
                    >
                        <p className="text-[var(--text-secondary)] text-lg">
                            No projects found matching your criteria.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid-responsive"
                    >
                        {filteredProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                categoryName={getCategoryName(project.category_id)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

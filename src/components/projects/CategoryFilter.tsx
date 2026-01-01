'use client';

import { motion } from 'framer-motion';
import { ProjectCategory } from '@/lib/types/database';

interface CategoryFilterProps {
    categories: ProjectCategory[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    // Default categories if none from database
    const defaultCategories: Partial<ProjectCategory>[] = [
        { id: '1', name: 'Apartments', slug: 'apartments', display_order: 0, is_active: true },
        { id: '2', name: 'Villas', slug: 'villas', display_order: 1, is_active: true },
        { id: '3', name: 'Flats', slug: 'flats', display_order: 2, is_active: true },
        { id: '4', name: 'Landscapes', slug: 'landscapes', display_order: 3, is_active: true },
        { id: '5', name: 'Farmhouse', slug: 'farmhouse', display_order: 4, is_active: true },
        { id: '6', name: 'Parks', slug: 'parks', display_order: 5, is_active: true },
    ];

    const displayCategories = categories.length > 0 ? categories : defaultCategories;

    return (
        <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 min-w-max"
            >
                {/* All Tab */}
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${selectedCategory === null
                        ? 'bg-[var(--primary-accent)] text-white shadow-lg shadow-[var(--primary-accent)]/30'
                        : 'bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)] border border-[var(--glass-border)]'
                        }`}
                >
                    All
                </button>

                {/* Category Tabs */}
                {displayCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id || null)}
                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${selectedCategory === category.id
                            ? 'bg-[var(--primary-accent)] text-white shadow-lg shadow-[var(--primary-accent)]/30'
                            : 'bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-secondary)] border border-[var(--glass-border)]'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </motion.div>
        </div>
    );
}

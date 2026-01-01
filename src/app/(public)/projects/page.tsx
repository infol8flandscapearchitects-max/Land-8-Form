import { Metadata } from 'next';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { getProjects, getProjectCategories, getPortfolioHeader } from '@/lib/queries';

export const metadata: Metadata = {
    title: 'Our Projects | LAND 8 FORM',
    description: 'Explore our portfolio of architectural achievements including apartments, villas, commercial spaces, landscapes, and more.',
};

export default async function ProjectsPage() {
    // Fetch data from Supabase
    const [projectsResult, categories, portfolioHeader] = await Promise.all([
        getProjects(),
        getProjectCategories(),
        getPortfolioHeader(),
    ]);

    // Default header if none from database
    const header = portfolioHeader || {
        heading: 'Our Portfolio',
        subheading: 'Discover our collection of architectural masterpieces, each designed with passion, precision, and purpose.',
        heading_color: null,
        default_items_count: 10,
    };

    return (
        <div className="pt-20">
            {/* Portfolio Header Section - Enhanced */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)]" />

                {/* Decorative blur orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-accent)]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--primary-accent)]/5 rounded-full blur-3xl" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
                    {/* Main heading with gradient text option */}
                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                        style={{
                            color: header.heading_color || 'var(--text-primary)',
                            textShadow: '0 4px 30px rgba(0,0,0,0.3)'
                        }}
                    >
                        {header.heading}
                    </h1>

                    {header.subheading && (
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-8">
                            {header.subheading}
                        </p>
                    )}

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[var(--primary-accent)]" />
                        <div className="w-3 h-3 bg-[var(--primary-accent)] rounded-full" />
                        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[var(--primary-accent)]" />
                    </div>
                </div>
            </section>

            {/* Projects Grid with Filters */}
            <section className="section">
                <div className="container mx-auto px-6 lg:px-8">
                    <ProjectGrid
                        initialProjects={projectsResult.projects}
                        initialCategories={categories}
                        projectsPerPage={header.default_items_count || 10}
                    />
                </div>
            </section>
        </div>
    );
}

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/queries';
import { ArrowLeft, Calendar, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectGallery from '@/components/projects/ProjectGallery';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        return { title: 'Project Not Found' };
    }

    return {
        title: `${project.title} | LAND 8 FORM`,
        description: project.short_description || project.description || 'View project details',
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    // Get related projects (same category)
    const relatedResult = await getProjects(project.category_id || undefined, undefined, 4, 0);
    const relatedProjects = relatedResult.projects.filter(p => p.id !== project.id).slice(0, 3);

    const galleryImages = project.gallery_images || [];
    const allImages = [project.image_url, ...galleryImages];

    const statusColors = {
        upcoming: 'bg-blue-500/20 text-blue-400',
        ongoing: 'bg-yellow-500/20 text-yellow-400',
        completed: 'bg-green-500/20 text-green-400',
    };

    return (
        <div className="pt-20 min-h-screen pb-20">
            {/* Back Button */}
            <div className="container mx-auto px-6 lg:px-8 py-6">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Projects
                </Link>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-6 lg:px-8">
                <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
                    <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            {project.title}
                        </h1>
                        {project.short_description && (
                            <p className="text-lg text-white/80 max-w-3xl">
                                {project.short_description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {project.description && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                    Project Description
                                </h2>
                                <div className="prose prose-lg max-w-none text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </div>
                            </div>
                        )}

                        {/* Gallery with Lightbox */}
                        {galleryImages.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                    Project Gallery
                                </h2>
                                <ProjectGallery
                                    images={allImages}
                                    projectTitle={project.title}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass p-6 rounded-2xl sticky top-28">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">
                                Project Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                    <Building2 size={20} className="text-[var(--primary-accent)]" />
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Category</p>
                                        <p className="font-medium">{project.category?.name || 'Uncategorized'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                    <Calendar size={20} className="text-[var(--primary-accent)]" />
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Status</p>
                                        <p className="font-medium capitalize">{project.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--glass-border)]">
                                <Link
                                    href="/contact"
                                    className="btn-primary w-full justify-center"
                                >
                                    Inquire About This Project
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <section className="container mx-auto px-6 lg:px-8 mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                            Related Projects
                        </h2>
                        <Link
                            href="/projects"
                            className="text-[var(--primary-accent)] hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProjects.map((related) => (
                            <Link
                                key={related.id}
                                href={`/projects/${related.id}`}
                                className="group card overflow-hidden"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={related.image_url}
                                        alt={related.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-accent)] transition-colors">
                                        {related.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        {related.category?.name}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

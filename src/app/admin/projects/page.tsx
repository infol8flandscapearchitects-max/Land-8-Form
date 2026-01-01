'use client';

import { useState, useEffect } from 'react';
import { getProjects, deleteProject, toggleProjectFeatured, getProjectCategories } from '@/lib/actions/projects';
import { Project, ProjectCategory } from '@/lib/types/database';
import {
    Plus,
    Trash2,
    Edit2,
    Star,
    StarOff,
    Eye,
    Search,
    Filter,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<ProjectCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loadingTime, setLoadingTime] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    // Track loading time
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingTime(t => t + 1);
            }, 1000);
        } else {
            setLoadingTime(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const loadData = async () => {
        setIsLoading(true);
        setLoadError(null);
        setLoadingTime(0);

        try {
            const [projectsData, categoriesData] = await Promise.all([
                getProjects(),
                getProjectCategories(),
            ]);
            setProjects(projectsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load projects:', error);
            setLoadError('Failed to connect to database. Please check your connection and try again.');
            toast.error('Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const result = await deleteProject(id);
        if (result.success) {
            toast.success('Project deleted!');
            loadData();
        } else {
            toast.error('Failed to delete project');
        }
    };

    const handleToggleFeatured = async (project: Project) => {
        const result = await toggleProjectFeatured(project.id, !project.is_featured);
        if (result.success) {
            toast.success(project.is_featured ? 'Removed from featured' : 'Added to featured');
            loadData();
        } else {
            toast.error('Failed to update project');
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filterCategory || project.category_id === filterCategory;
        const matchesStatus = !filterStatus || project.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="badge badge-success">Completed</span>;
            case 'ongoing':
                return <span className="badge badge-warning">Ongoing</span>;
            case 'upcoming':
                return <span className="badge badge-info">Upcoming</span>;
            default:
                return <span className="badge badge-default">{status}</span>;
        }
    };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-description">Manage your portfolio projects.</p>
                </div>
                <Link href="/admin/projects/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Project
                </Link>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: 1,
                        minWidth: '250px',
                        background: 'var(--admin-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        padding: '0 16px',
                        color: 'var(--admin-text-muted)'
                    }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--admin-text)',
                                padding: '12px 0',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--admin-text-muted)' }}>
                        <Filter size={16} />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="">All Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            {loadError ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <AlertCircle size={48} style={{ color: 'var(--admin-error)', marginBottom: '16px' }} />
                    <h3 style={{ color: 'var(--admin-text)', marginBottom: '8px' }}>Connection Error</h3>
                    <p style={{ color: 'var(--admin-text-muted)', marginBottom: '24px' }}>{loadError}</p>
                    <button onClick={loadData} className="btn btn-primary">
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            ) : isLoading ? (
                <div>
                    {/* Loading time indicator */}
                    <div style={{
                        textAlign: 'center',
                        padding: '16px',
                        marginBottom: '16px',
                        background: 'var(--admin-card)',
                        borderRadius: '8px',
                        border: '1px solid var(--admin-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <RefreshCw size={18} className="animate-spin" style={{ color: 'var(--admin-accent)' }} />
                            <span style={{ color: 'var(--admin-text)' }}>
                                Loading projects... {loadingTime > 0 && `(${loadingTime}s)`}
                            </span>
                        </div>
                        {loadingTime > 5 && (
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8125rem', marginTop: '8px' }}>
                                ⚠️ Database is taking longer than usual. This may happen if the project was paused.
                            </p>
                        )}
                        {loadingTime > 15 && (
                            <p style={{ color: 'var(--admin-warning)', fontSize: '0.8125rem', marginTop: '4px' }}>
                                Still waiting... Check your Supabase dashboard to ensure the project is active.
                            </p>
                        )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
                        ))}
                    </div>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {filteredProjects.map(project => (
                        <div key={project.id} className="admin-card project-card-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ position: 'relative', aspectRatio: '16/10' }}>
                                <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {project.is_featured && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '6px 12px',
                                        background: 'var(--admin-accent)',
                                        color: 'white',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        <Star size={14} />
                                        Featured
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)', flex: 1 }}>{project.title}</h3>
                                    {getStatusBadge(project.status)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.7rem',
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        color: '#818cf8',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontWeight: 500
                                    }}>Order: {project.display_order}</span>
                                    {project.category && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-accent)' }}>{project.category.name}</span>
                                    )}
                                </div>
                                {project.short_description && (
                                    <p style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--admin-text-muted)',
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>{project.short_description}</p>
                                )}
                                {/* Action buttons always visible at bottom */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid var(--admin-border)'
                                }}>
                                    <Link
                                        href={`/admin/projects/${project.id}`}
                                        style={{
                                            flex: 1,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            padding: '10px 16px',
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                                        }}
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleToggleFeatured(project); }}
                                        title={project.is_featured ? 'Remove from featured' : 'Add to featured'}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            background: project.is_featured
                                                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                                : 'rgba(245, 158, 11, 0.1)',
                                            color: project.is_featured ? 'white' : '#f59e0b',
                                            border: project.is_featured ? 'none' : '1px solid rgba(245, 158, 11, 0.3)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: project.is_featured ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            if (!project.is_featured) {
                                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            if (!project.is_featured) {
                                                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                                            }
                                        }}
                                    >
                                        {project.is_featured ? <StarOff size={16} /> : <Star size={16} />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                                        title="Delete project"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.border = 'none';
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                            e.currentTarget.style.color = '#ef4444';
                                            e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="admin-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Eye size={32} />
                        </div>
                        <h3 className="empty-state-title">No projects found</h3>
                        <p className="empty-state-description">
                            {searchQuery || filterCategory || filterStatus
                                ? 'Try adjusting your filters.'
                                : 'Add your first project to get started.'}
                        </p>
                        {!searchQuery && !filterCategory && !filterStatus && (
                            <Link href="/admin/projects/new" className="btn btn-primary">
                                <Plus size={18} />
                                Add Project
                            </Link>
                        )}
                    </div>
                </div>
            )
            }

        </div >
    );
}

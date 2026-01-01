'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addProject, getProjectCategories } from '@/lib/actions/projects';
import { uploadImage } from '@/lib/actions/storage';
import { ProjectCategory } from '@/lib/types/database';
import { Save, ArrowLeft, Upload, Image as ImageIcon, X, Plus } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function NewProjectPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<ProjectCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        description: '',
        image_url: '',
        gallery_images: [] as string[],
        category_id: '',
        status: 'ongoing' as 'upcoming' | 'ongoing' | 'completed',
        is_featured: false,
        display_order: 0,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await getProjectCategories(true);
        setCategories(data);
        setIsLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            const result = await uploadImage(base64, file.name, 'project-images', file.type);

            if (result.success && result.url) {
                setFormData(prev => ({ ...prev, image_url: result.url! }));
                toast.success('Image uploaded!');
            } else {
                toast.error('Failed to upload image');
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const result = await uploadImage(base64, file.name, 'project-images', file.type);

                if (result.success && result.url) {
                    setFormData(prev => ({
                        ...prev,
                        gallery_images: [...prev.gallery_images, result.url!]
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
        toast.success('Gallery images uploaded!');
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.image_url) {
            toast.error('Please fill in required fields');
            return;
        }

        setIsSaving(true);

        const result = await addProject({
            title: formData.title,
            short_description: formData.short_description || null,
            description: formData.description || null,
            image_url: formData.image_url,
            gallery_images: formData.gallery_images.length > 0 ? formData.gallery_images : null,
            category_id: formData.category_id || null,
            status: formData.status,
            is_featured: formData.is_featured,
            display_order: formData.display_order,
        });

        if (result.success) {
            toast.success('Project created!');
            router.push('/admin/projects');
        } else {
            toast.error(result.error || 'Failed to create project');
        }
        setIsSaving(false);
    };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <Link href="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '16px' }}>
                    <ArrowLeft size={18} />
                    Back to Projects
                </Link>
                <h1 className="page-title">New Project</h1>
                <p className="page-description">Add a new project to your portfolio.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">Project Details</h2>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter project title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Short Description</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.short_description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                    placeholder="Brief description for cards/previews"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Full Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Detailed project description..."
                                    rows={6}
                                />
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">
                                    <ImageIcon size={20} style={{ marginRight: '8px' }} />
                                    Main Image *
                                </h2>
                            </div>

                            {formData.image_url ? (
                                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                                    <img src={formData.image_url} alt="Project preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                    <label className="btn btn-secondary" style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                                        <Upload size={16} />
                                        Change Image
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            ) : (
                                <label className="upload-area">
                                    {uploading ? (
                                        <span className="spinner" />
                                    ) : (
                                        <>
                                            <ImageIcon size={48} />
                                            <span>Click to upload main image</span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Recommended: 1200x800px</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>

                        {/* Gallery */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">Gallery Images</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                                {formData.gallery_images.map((url, index) => (
                                    <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={url} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '6px',
                                                right: '6px',
                                                width: '24px',
                                                height: '24px',
                                                background: 'var(--admin-error)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <label style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: 'var(--admin-bg)',
                                    border: '2px dashed var(--admin-border)',
                                    borderRadius: '8px',
                                    color: 'var(--admin-text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem'
                                }}>
                                    <Plus size={24} />
                                    <span>Add Images</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '88px' }}>
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2 className="admin-card-title">Settings</h2>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                >
                                    <option value="">No Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as typeof formData.status }))}
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                    placeholder="0"
                                    min="0"
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '6px' }}>Lower numbers appear first on the website.</p>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                                    />
                                    <span>Featured Project</span>
                                </label>
                                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '6px' }}>Featured projects appear on the home page.</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/admin/projects" className="btn btn-secondary" style={{ width: '100%' }}>
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={isSaving || !formData.title || !formData.image_url}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Create Project
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

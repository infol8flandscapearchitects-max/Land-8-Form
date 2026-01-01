'use client';

import { useState, useEffect } from 'react';
import { getHeroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } from '@/lib/actions/home';
import { uploadImage } from '@/lib/actions/storage';
import { HeroSlide } from '@/lib/types/database';
import {
    Plus,
    Trash2,
    Edit2,
    GripVertical,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Save,
    X,
    Upload,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function HeroSlidesPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({
        image_url: '',
        title: '',
        subtitle: '',
        is_active: true,
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        setIsLoading(true);
        const data = await getHeroSlides();
        setSlides(data);
        setIsLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            const result = await uploadImage(base64, file.name, 'hero-images', file.type);

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

    const handleAdd = async () => {
        if (!formData.image_url) {
            toast.error('Please upload an image');
            return;
        }

        const result = await addHeroSlide({
            image_url: formData.image_url,
            title: formData.title || null,
            subtitle: formData.subtitle || null,
            is_active: formData.is_active,
            display_order: slides.length,
        });

        if (result.success) {
            toast.success('Slide added!');
            setIsAddingNew(false);
            resetForm();
            loadSlides();
        } else {
            toast.error('Failed to add slide');
        }
    };

    const handleUpdate = async () => {
        if (!editingSlide) return;

        const result = await updateHeroSlide(editingSlide.id, {
            image_url: formData.image_url,
            title: formData.title || null,
            subtitle: formData.subtitle || null,
            is_active: formData.is_active,
        });

        if (result.success) {
            toast.success('Slide updated!');
            setEditingSlide(null);
            resetForm();
            loadSlides();
        } else {
            toast.error('Failed to update slide');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;

        const result = await deleteHeroSlide(id);
        if (result.success) {
            toast.success('Slide deleted!');
            loadSlides();
        } else {
            toast.error('Failed to delete slide');
        }
    };

    const handleToggleActive = async (slide: HeroSlide) => {
        const result = await updateHeroSlide(slide.id, { is_active: !slide.is_active });
        if (result.success) {
            toast.success(slide.is_active ? 'Slide hidden' : 'Slide visible');
            loadSlides();
        }
    };

    const startEdit = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setFormData({
            image_url: slide.image_url,
            title: slide.title || '',
            subtitle: slide.subtitle || '',
            is_active: slide.is_active,
        });
        setIsAddingNew(false);
    };

    const resetForm = () => {
        setFormData({
            image_url: '',
            title: '',
            subtitle: '',
            is_active: true,
        });
    };

    const cancelEdit = () => {
        setEditingSlide(null);
        setIsAddingNew(false);
        resetForm();
    };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Hero Slides</h1>
                    <p className="page-description">Manage the hero slideshow on your home page.</p>
                </div>
                {!isAddingNew && !editingSlide && (
                    <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                        <Plus size={18} />
                        Add Slide
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingSlide) && (
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                        </h2>
                        <button className="btn btn-ghost btn-icon" onClick={cancelEdit}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-group">
                            <label className="form-label">Slide Image *</label>
                            <div style={{ aspectRatio: '16/9', maxHeight: '300px' }}>
                                {formData.image_url ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                                        <img src={formData.image_url} alt="Slide preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <label className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                                            <Upload size={14} />
                                            Change
                                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="upload-area">
                                        {uploading ? (
                                            <span className="spinner" />
                                        ) : (
                                            <>
                                                <ImageIcon size={32} />
                                                <span>Click to upload image</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="form-group">
                                <label className="form-label">Title (Optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter slide title"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Subtitle (Optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    placeholder="Enter slide subtitle"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    />
                                    <span>Active (visible on website)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={editingSlide ? handleUpdate : handleAdd}
                            disabled={!formData.image_url || uploading}
                        >
                            <Save size={18} />
                            {editingSlide ? 'Update Slide' : 'Add Slide'}
                        </button>
                    </div>
                </div>
            )}

            {/* Slides List */}
            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ aspectRatio: '16/9', borderRadius: '12px' }} />
                    ))}
                </div>
            ) : slides.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="admin-card" style={{ opacity: slide.is_active ? 1 : 0.6, padding: 0, overflow: 'hidden' }}>
                            <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                                <img src={slide.image_url} alt={slide.title || `Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    opacity: 0,
                                    transition: 'opacity 0.15s ease'
                                }} className="slide-overlay">
                                    <button className="btn btn-ghost btn-icon" onClick={() => startEdit(slide)}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button className="btn btn-ghost btn-icon" onClick={() => handleToggleActive(slide)}>
                                        {slide.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <button className="btn btn-ghost btn-icon" style={{ color: 'var(--admin-error)' }} onClick={() => handleDelete(slide.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
                                    <GripVertical size={16} />
                                    <span>#{index + 1}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '2px' }}>
                                        {slide.title || 'Untitled Slide'}
                                    </h3>
                                    {slide.subtitle && <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>{slide.subtitle}</p>}
                                </div>
                                {!slide.is_active && <span className="badge badge-default">Hidden</span>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="admin-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <ImageIcon size={32} />
                        </div>
                        <h3 className="empty-state-title">No hero slides</h3>
                        <p className="empty-state-description">Add your first hero slide to get started.</p>
                        <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                            <Plus size={18} />
                            Add Slide
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .slide-overlay:hover {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}

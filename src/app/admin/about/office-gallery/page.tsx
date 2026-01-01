'use client';

import { useState, useEffect } from 'react';
import { getOfficeGalleryImages, addOfficeGalleryImage, updateOfficeGalleryImage, deleteOfficeGalleryImage } from '@/lib/actions/about';
import { uploadImage } from '@/lib/actions/storage';
import { OfficeGalleryImage } from '@/lib/types/database';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function OfficeGalleryPage() {
    const [images, setImages] = useState<OfficeGalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getOfficeGalleryImages();
        setImages(data as OfficeGalleryImage[]);
        setIsLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            const result = await uploadImage(base64, file.name, 'general', file.type);

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

        const result = await addOfficeGalleryImage({
            title: formData.title || null,
            description: formData.description || null,
            image_url: formData.image_url,
            is_active: true,
        });

        if (result.success) {
            toast.success('Image added to gallery!');
            setIsAddingNew(false);
            setFormData({ title: '', description: '', image_url: '' });
            loadData();
        } else {
            toast.error(result.error || 'Failed to add image');
        }
    };

    const handleUpdate = async () => {
        if (!editingId || !formData.image_url) return;

        const result = await updateOfficeGalleryImage(editingId, {
            title: formData.title || null,
            description: formData.description || null,
            image_url: formData.image_url,
        });

        if (result.success) {
            toast.success('Image updated!');
            setEditingId(null);
            setFormData({ title: '', description: '', image_url: '' });
            loadData();
        } else {
            toast.error(result.error || 'Failed to update image');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        const result = await deleteOfficeGalleryImage(id);
        if (result.success) {
            toast.success('Image deleted!');
            loadData();
        } else {
            toast.error(result.error || 'Failed to delete image');
        }
    };

    const startEdit = (image: OfficeGalleryImage) => {
        setEditingId(image.id);
        setFormData({
            title: image.title || '',
            description: image.description || '',
            image_url: image.image_url
        });
        setIsAddingNew(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsAddingNew(false);
        setFormData({ title: '', description: '', image_url: '' });
    };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Link href="/admin/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '16px' }}>
                        <ArrowLeft size={18} />
                        Back to About Manager
                    </Link>
                    <h1 className="page-title">Office Gallery</h1>
                    <p className="page-description">Manage your office photos and workspace images.</p>
                </div>
                {!isAddingNew && !editingId && (
                    <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                        <Plus size={18} />
                        Add Image
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingId) && (
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">{editingId ? 'Edit Image' : 'Add New Image'}</h2>
                        <button className="btn btn-ghost btn-icon" onClick={cancelEdit}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                        {/* Image Upload */}
                        <div>
                            <label className="form-label">Image *</label>
                            {formData.image_url ? (
                                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                                    <label className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                                        {uploading ? <span className="spinner" /> : <Upload size={14} />}
                                        Change
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            ) : (
                                <label style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '48px',
                                    background: 'var(--admin-bg)',
                                    border: '2px dashed var(--admin-border)',
                                    borderRadius: '12px',
                                    color: 'var(--admin-text-muted)',
                                    cursor: 'pointer'
                                }}>
                                    {uploading ? <span className="spinner" /> : <ImageIcon size={32} />}
                                    <span>Upload Image</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div>
                            <div className="form-group">
                                <label className="form-label">Title (Optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Our Main Office"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description (Optional)</label>
                                <textarea
                                    className="form-input"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="A brief description of this image..."
                                    rows={3}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={editingId ? handleUpdate : handleAdd}
                            disabled={!formData.image_url}
                        >
                            <Save size={18} />
                            {editingId ? 'Update' : 'Add'} Image
                        </button>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            <div className="admin-card">
                {isLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '12px' }} />
                        ))}
                    </div>
                ) : images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                        {images.map((image) => (
                            <div
                                key={image.id}
                                style={{
                                    background: 'var(--admin-bg)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <img
                                    src={image.image_url}
                                    alt={image.title || 'Office image'}
                                    style={{
                                        width: '100%',
                                        height: '160px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '12px' }}>
                                    {image.title && (
                                        <h4 style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            color: 'var(--admin-text)',
                                            marginBottom: '4px'
                                        }}>
                                            {image.title}
                                        </h4>
                                    )}
                                    {image.description && (
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--admin-text-muted)',
                                            lineHeight: 1.4
                                        }}>
                                            {image.description.length > 60
                                                ? image.description.substring(0, 60) + '...'
                                                : image.description}
                                        </p>
                                    )}
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    display: 'flex',
                                    gap: '4px',
                                    background: 'rgba(0,0,0,0.5)',
                                    padding: '4px',
                                    borderRadius: '8px'
                                }}>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        style={{ width: '28px', height: '28px', color: 'white' }}
                                        onClick={() => startEdit(image)}
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        style={{ width: '28px', height: '28px', color: '#ef4444' }}
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <ImageIcon size={48} style={{ color: 'var(--admin-text-muted)', marginBottom: '16px' }} />
                        <h3 className="empty-state-title">No images yet</h3>
                        <p className="empty-state-description">Add office photos to showcase your workspace on the about page.</p>
                        <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                            <Plus size={18} />
                            Add First Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

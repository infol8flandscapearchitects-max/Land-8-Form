'use client';

import { useState, useEffect } from 'react';
import { getCeoSection, updateCeoSection } from '@/lib/actions/home';
import { uploadImage } from '@/lib/actions/storage';
import { CeoSection } from '@/lib/types/database';
import { User, Save, Camera } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CeoSectionPage() {
    const [data, setData] = useState<CeoSection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const result = await getCeoSection();
        // Initialize with default values if no data exists
        setData(result || {
            id: '',
            name: '',
            title: '',
            photo_url: '',
            vision: '',
            description: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setIsLoading(false);
    };

    const handleChange = (field: keyof CeoSection, value: string) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            const result = await uploadImage(base64, file.name, 'team-photos', file.type);

            if (result.success && result.url) {
                handleChange('photo_url', result.url);
                toast.success('Photo uploaded!');
            } else {
                toast.error('Failed to upload photo');
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updateCeoSection({
            photo_url: data.photo_url,
            name: data.name,
            title: data.title,
            vision: data.vision || undefined,
            description: data.description || undefined,
        });

        if (result.success) {
            toast.success('CEO section updated!');
        } else {
            toast.error('Failed to update CEO section');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <Toaster position="top-right" />
                <div className="page-header">
                    <h1 className="page-title">CEO Section</h1>
                    <p className="page-description">Manage the CEO/Founder section on your home page.</p>
                </div>
                <div className="admin-card skeleton" style={{ height: '500px' }} />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <h1 className="page-title">CEO Section</h1>
                <p className="page-description">Manage the CEO/Founder section on your home page.</p>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">
                        <User size={20} style={{ marginRight: '8px' }} />
                        CEO Information
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
                    {/* Photo Upload - Rectangular to match main website */}
                    <div style={{ textAlign: 'center' }}>
                        <label className="form-label">Photo</label>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            {/* Rectangular Photo Container */}
                            <div style={{
                                width: '220px',
                                height: '280px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                position: 'relative',
                                border: '2px solid var(--admin-border)',
                                background: 'var(--admin-bg-secondary)'
                            }}>
                                {data?.photo_url ? (
                                    <img
                                        src={data.photo_url}
                                        alt="CEO Photo"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--admin-text-muted)',
                                        gap: '8px'
                                    }}>
                                        <User size={64} />
                                        <span style={{ fontSize: '0.875rem' }}>No photo</span>
                                    </div>
                                )}
                            </div>

                            {/* Delete and Upload Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                {data?.photo_url && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleChange('photo_url', '')}
                                        style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                                    >
                                        Delete
                                    </button>
                                )}
                                <label
                                    className="btn btn-secondary"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        margin: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {uploading ? (
                                        <span className="spinner" />
                                    ) : (
                                        <Camera size={16} />
                                    )}
                                    {data?.photo_url ? 'Change' : 'Upload'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                                Recommended: 400x500px
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div>
                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data?.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="CEO/Founder Name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={data?.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="e.g., CEO & Founder"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Vision Statement</label>
                            <textarea
                                className="form-textarea"
                                value={data?.vision || ''}
                                onChange={(e) => handleChange('vision', e.target.value)}
                                placeholder="Share the company vision..."
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={data?.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Brief bio or description..."
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleSave}
                        disabled={isSaving || !data?.name || !data?.photo_url}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

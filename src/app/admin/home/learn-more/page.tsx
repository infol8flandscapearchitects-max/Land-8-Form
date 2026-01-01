'use client';

import { useState, useEffect } from 'react';
import { getLearnMoreSection, updateLearnMoreSection } from '@/lib/actions/home';
import { uploadImage } from '@/lib/actions/storage';
import { LearnMoreSection } from '@/lib/types/database';
import { Info, Save, Upload, Image as ImageIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function LearnMorePage() {
    const [data, setData] = useState<LearnMoreSection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const result = await getLearnMoreSection();
        // Initialize with default values if no data exists
        setData(result || {
            id: '',
            heading: 'Learn More About Us',
            description: '',
            image_url: '',
            button_text: 'Learn More',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setIsLoading(false);
    };

    const handleChange = (field: keyof LearnMoreSection, value: string) => {
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
            const result = await uploadImage(base64, file.name, 'general', file.type);

            if (result.success && result.url) {
                handleChange('image_url', result.url);
                toast.success('Image uploaded!');
            } else {
                toast.error('Failed to upload image');
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updateLearnMoreSection({
            heading: data.heading,
            description: data.description || undefined,
            image_url: data.image_url || undefined,
            button_text: data.button_text,
        });

        if (result.success) {
            toast.success('Learn More section updated!');
        } else {
            toast.error('Failed to update section');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <Toaster position="top-right" />
                <div className="page-header">
                    <h1 className="page-title">Learn More Section</h1>
                    <p className="page-description">Manage the &quot;Learn More&quot; section on your home page.</p>
                </div>
                <div className="admin-card skeleton" style={{ height: '400px' }} />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <h1 className="page-title">Learn More Section</h1>
                <p className="page-description">Manage the &quot;Learn More&quot; section on your home page.</p>
            </div>

            <div className="grid-2">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <Info size={20} style={{ marginRight: '8px' }} />
                            Content
                        </h2>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Heading *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={data?.heading || ''}
                            onChange={(e) => handleChange('heading', e.target.value)}
                            placeholder="Learn More About Us"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={data?.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe what visitors will learn about your company..."
                            rows={5}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Button Text *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={data?.button_text || ''}
                            onChange={(e) => handleChange('button_text', e.target.value)}
                            placeholder="Learn More"
                        />
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <ImageIcon size={20} style={{ marginRight: '8px' }} />
                            Section Image
                        </h2>
                    </div>

                    <div style={{ minHeight: '300px' }}>
                        {data?.image_url ? (
                            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
                                <img
                                    src={data.image_url}
                                    alt="Learn More Section"
                                    style={{ width: '100%', height: 'auto', display: 'block', minHeight: '200px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const errorDiv = target.nextElementSibling as HTMLElement;
                                        if (errorDiv) errorDiv.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    display: 'none',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '200px',
                                    color: 'var(--admin-text-muted)',
                                    gap: '8px'
                                }}>
                                    <ImageIcon size={48} />
                                    <span>Image failed to load</span>
                                    <span style={{ fontSize: '0.75rem' }}>URL: {data.image_url.substring(0, 50)}...</span>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    right: '16px',
                                    display: 'flex',
                                    gap: '8px'
                                }}>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleChange('image_url', '')}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Delete
                                    </button>
                                    <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                                        {uploading ? <span className="spinner" /> : <Upload size={16} />}
                                        Change
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="upload-area" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                minHeight: '300px',
                                cursor: 'pointer',
                                border: '2px dashed var(--admin-border)',
                                borderRadius: '12px',
                                backgroundColor: 'var(--admin-bg-secondary)'
                            }}>
                                {uploading ? (
                                    <span className="spinner" />
                                ) : (
                                    <>
                                        <ImageIcon size={48} style={{ color: 'var(--admin-text-muted)' }} />
                                        <span style={{ color: 'var(--admin-text)' }}>Click to upload image</span>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Recommended: 800x600px</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        )}
                    </div>

                    {/* Image URL Input (optional manual entry) */}
                    <div className="form-group" style={{ marginTop: '16px' }}>
                        <label className="form-label">Image URL (or paste URL directly)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={data?.image_url || ''}
                            onChange={(e) => handleChange('image_url', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSave}
                    disabled={isSaving || !data?.heading || !data?.button_text}
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
    );
}

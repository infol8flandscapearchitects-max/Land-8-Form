'use client';

import { useState, useEffect } from 'react';
import { getAboutIntro, updateAboutIntro } from '@/lib/actions/about';
import { AboutIntro } from '@/lib/types/database';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function AboutIntroPage() {
    const [data, setData] = useState<AboutIntro | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const result = await getAboutIntro();
        // Initialize with default values if no data exists
        setData(result || {
            id: '',
            heading: 'About Us',
            subheading: '',
            description: '',
            heading_color: '',
            description_color: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setIsLoading(false);
    };

    const handleChange = (field: keyof AboutIntro, value: string) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updateAboutIntro({
            heading: data.heading,
            subheading: data.subheading || undefined,
            description: data.description || undefined,
        });

        if (result.success) {
            toast.success('About intro updated!');
        } else {
            toast.error('Failed to update about intro');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">About Intro</h1>
                </div>
                <div className="admin-card skeleton" style={{ height: '500px' }} />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <Link href="/admin/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '16px' }}>
                    <ArrowLeft size={18} />
                    Back to About Manager
                </Link>
                <h1 className="page-title">About Intro</h1>
                <p className="page-description">Edit the introduction section of your about page.</p>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">Content</h2>
                </div>

                <div className="form-group">
                    <label className="form-label">Heading *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.heading || ''}
                        onChange={(e) => handleChange('heading', e.target.value)}
                        placeholder="Who Are We"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Subheading</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.subheading || ''}
                        onChange={(e) => handleChange('subheading', e.target.value)}
                        placeholder="Building dreams since 1990"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        value={data?.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Tell your company story..."
                        rows={6}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleSave}
                        disabled={isSaving || !data?.heading}
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

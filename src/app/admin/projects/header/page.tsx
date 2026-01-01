'use client';

import { useState, useEffect } from 'react';
import { getPortfolioHeader, updatePortfolioHeader } from '@/lib/actions/projects';
import { PortfolioHeader } from '@/lib/types/database';
import { FileText, Save, Palette } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PortfolioHeaderPage() {
    const [data, setData] = useState<PortfolioHeader | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const result = await getPortfolioHeader();
        // Initialize with default values if no data exists
        setData(result || {
            id: '',
            heading: 'Our Projects',
            subheading: '',
            description: '',
            heading_color: '#ffffff',
            subheading_color: '',
            description_color: '',
            default_items_count: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setIsLoading(false);
    };

    const handleChange = (field: keyof PortfolioHeader, value: string | number) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updatePortfolioHeader({
            heading: data.heading,
            subheading: data.subheading || undefined,
            heading_color: data.heading_color || undefined,
            default_items_count: data.default_items_count || 10,
        });

        if (result.success) {
            toast.success('Portfolio header updated!');
        } else {
            toast.error('Failed to update portfolio header');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <Toaster position="top-right" />
                <div className="page-header">
                    <h1 className="page-title">Portfolio Header</h1>
                    <p className="page-description">Customize the projects page header settings.</p>
                </div>
                <div className="admin-card skeleton" style={{ height: '400px' }} />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <h1 className="page-title">Portfolio Header</h1>
                <p className="page-description">Customize the projects page header settings.</p>
            </div>

            <div className="grid-2">
                {/* Content Settings */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <FileText size={20} style={{ marginRight: '8px' }} />
                            Header Content
                        </h2>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Heading *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={data?.heading || ''}
                            onChange={(e) => handleChange('heading', e.target.value)}
                            placeholder="Our Projects"
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            Main title displayed on the projects page
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subheading</label>
                        <textarea
                            className="form-textarea"
                            value={data?.subheading || ''}
                            onChange={(e) => handleChange('subheading', e.target.value)}
                            placeholder="Explore our portfolio of innovative architecture projects..."
                            rows={3}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            Description text that appears below the heading
                        </p>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <Palette size={20} style={{ marginRight: '8px' }} />
                            Display Settings
                        </h2>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Heading Color</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                                type="color"
                                value={data?.heading_color || '#ffffff'}
                                onChange={(e) => handleChange('heading_color', e.target.value)}
                                style={{
                                    width: '60px',
                                    height: '40px',
                                    padding: '4px',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: 'var(--admin-bg-secondary)'
                                }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                value={data?.heading_color || '#ffffff'}
                                onChange={(e) => handleChange('heading_color', e.target.value)}
                                placeholder="#ffffff"
                                style={{ flex: 1 }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            Color of the heading text
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Projects Per Page</label>
                        <select
                            className="form-select"
                            value={data?.default_items_count || 10}
                            onChange={(e) => handleChange('default_items_count', parseInt(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'var(--admin-bg-secondary)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '8px',
                                color: 'var(--admin-text)',
                                fontSize: '0.9375rem'
                            }}
                        >
                            <option value={6}>6 projects</option>
                            <option value={8}>8 projects</option>
                            <option value={10}>10 projects</option>
                            <option value={12}>12 projects</option>
                            <option value={16}>16 projects</option>
                            <option value={20}>20 projects</option>
                        </select>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                            Number of projects to display per page
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="form-group" style={{ marginTop: '24px' }}>
                        <label className="form-label">Preview</label>
                        <div style={{
                            padding: '24px',
                            background: 'var(--admin-bg)',
                            borderRadius: '12px',
                            border: '1px solid var(--admin-border)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{
                                color: data?.heading_color || '#ffffff',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                marginBottom: '8px'
                            }}>
                                {data?.heading || 'Our Projects'}
                            </h3>
                            <p style={{
                                color: 'var(--admin-text-muted)',
                                fontSize: '0.875rem'
                            }}>
                                {data?.subheading || 'Your subheading will appear here...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
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
    );
}

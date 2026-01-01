'use client';

import { useState, useEffect } from 'react';
import { getStaffIntro, updateStaffIntro } from '@/lib/actions/team';
import { StaffIntro } from '@/lib/types/database';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function StaffIntroPage() {
    const [data, setData] = useState<StaffIntro | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const result = await getStaffIntro();
        // Initialize with default values if no data exists
        setData(result || {
            id: '',
            heading: 'Our Team',
            subheading: '',
            description: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setIsLoading(false);
    };

    const handleChange = (field: keyof StaffIntro, value: string) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updateStaffIntro({
            heading: data.heading,
            subheading: data.subheading || undefined,
            description: data.description || undefined,
        });

        if (result.success) {
            toast.success('Staff intro updated!');
        } else {
            toast.error('Failed to update staff intro');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Staff Page Intro</h1>
                </div>
                <div className="admin-card skeleton" style={{ height: '400px' }} />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <Link href="/admin/team" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '16px' }}>
                    <ArrowLeft size={18} />
                    Back to Team
                </Link>
                <h1 className="page-title">Staff Page Intro</h1>
                <p className="page-description">Edit the introduction section of your staff page.</p>
            </div>

            <div className="admin-card">
                <div className="form-group">
                    <label className="form-label">Heading *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.heading || ''}
                        onChange={(e) => handleChange('heading', e.target.value)}
                        placeholder="Meet Our Team"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Subheading</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.subheading || ''}
                        onChange={(e) => handleChange('subheading', e.target.value)}
                        placeholder="The talented people behind our success"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        value={data?.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Describe your team and company culture..."
                        rows={5}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                    <button
                        className="btn btn-primary"
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

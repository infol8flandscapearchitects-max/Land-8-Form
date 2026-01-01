'use client';

import { useState, useEffect } from 'react';
import { getJoinTeamCTA, updateJoinTeamCTA } from '@/lib/actions/team';
import { JoinTeamCTA } from '@/lib/types/database';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function JoinTeamCtaPage() {
    const [data, setData] = useState<JoinTeamCTA | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const result = await getJoinTeamCTA();
        // Initialize with default values if no data exists
        setData(result || {
            id: '',
            heading: 'Join Our Team',
            description: '',
            button_text: 'View Openings',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        setIsLoading(false);
    };

    const handleChange = (field: keyof JoinTeamCTA, value: string) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updateJoinTeamCTA({
            heading: data.heading,
            description: data.description || undefined,
            button_text: data.button_text,
        });

        if (result.success) {
            toast.success('Join Team CTA updated!');
        } else {
            toast.error('Failed to update CTA');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Join Team CTA</h1>
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
                <h1 className="page-title">Join Team CTA</h1>
                <p className="page-description">Edit the &quot;Join Our Team&quot; call-to-action section.</p>
            </div>

            <div className="admin-card">
                <div className="form-group">
                    <label className="form-label">Heading *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.heading || ''}
                        onChange={(e) => handleChange('heading', e.target.value)}
                        placeholder="Join Our Team"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        value={data?.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="We're always looking for talented individuals..."
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Button Text *</label>
                    <input
                        type="text"
                        className="form-input"
                        value={data?.button_text || ''}
                        onChange={(e) => handleChange('button_text', e.target.value)}
                        placeholder="View Careers"
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                    <button
                        className="btn btn-primary"
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
        </div>
    );
}

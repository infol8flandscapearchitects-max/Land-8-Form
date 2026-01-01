'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTeamMember, updateTeamMember } from '@/lib/actions/team';
import { uploadImage } from '@/lib/actions/storage';
import { TeamMember } from '@/lib/types/database';
import { Save, ArrowLeft, User, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function EditTeamMemberPage() {
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        bio: '',
        photo_url: '',
        email: '',
        phone: '',
        is_ceo: false,
        is_leadership: false,
        display_order: 0,
    });

    useEffect(() => {
        loadData();
    }, [memberId]);

    const loadData = async () => {
        setIsLoading(true);
        const member = await getTeamMember(memberId);
        if (member) {
            setFormData({
                name: member.name,
                position: member.position,
                bio: member.bio || '',
                photo_url: member.photo_url || '',
                email: member.email || '',
                phone: member.phone || '',
                is_ceo: member.is_ceo,
                is_leadership: member.is_leadership,
                display_order: member.display_order || 0,
            });
        }
        setIsLoading(false);
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
                setFormData(prev => ({ ...prev, photo_url: result.url! }));
                toast.success('Photo uploaded!');
            } else {
                toast.error('Failed to upload photo');
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.position) {
            toast.error('Please fill in required fields');
            return;
        }

        setIsSaving(true);

        // Determine role based on checkboxes
        const role = formData.is_ceo
            ? 'ceo'
            : formData.is_leadership
                ? 'leadership'
                : 'staff';

        const result = await updateTeamMember(memberId, {
            name: formData.name,
            position: formData.position,
            role: role as 'ceo' | 'leadership' | 'manager' | 'staff',
            bio: formData.bio || null,
            photo_url: formData.photo_url || null,
            email: formData.email || null,
            phone: formData.phone || null,
            is_ceo: formData.is_ceo,
            is_leadership: formData.is_leadership || formData.is_ceo,
            display_order: formData.display_order,
        });

        if (result.success) {
            toast.success('Team member updated!');
            router.push('/admin/team');
        } else {
            toast.error(result.error || 'Failed to update team member');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Edit Team Member</h1>
                </div>
                <div className="skeleton" style={{ height: '500px', borderRadius: '12px' }} />
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
                <h1 className="page-title">Edit Team Member</h1>
                <p className="page-description">Update team member details.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
                    {/* Photo Upload */}
                    <div className="admin-card" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '200px',
                                height: '240px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                position: 'relative',
                                border: '2px solid var(--admin-border)',
                                background: 'var(--admin-bg)'
                            }}>
                                {formData.photo_url ? (
                                    <img src={formData.photo_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--admin-text-muted)'
                                    }}>
                                        <User size={48} />
                                    </div>
                                )}
                            </div>

                            {/* Upload and Delete Buttons */}
                            <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
                                <label style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    background: 'var(--admin-accent)',
                                    color: 'white',
                                    borderRadius: '6px',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    opacity: uploading ? 0.7 : 1,
                                    transition: 'opacity 0.2s'
                                }}>
                                    {uploading ? <span className="spinner" /> : <Upload size={16} />}
                                    {uploading ? 'Uploading...' : 'Upload'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                </label>

                                {formData.photo_url && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 16px',
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h2 className="admin-card-title">Member Details</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Position / Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.position}
                                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                    placeholder="e.g., Senior Architect"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio</label>
                            <textarea
                                className="form-textarea"
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Brief biography..."
                                rows={4}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                            <Link href="/admin/team" className="btn btn-secondary">Cancel</Link>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaving || !formData.name || !formData.position}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Update Member
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

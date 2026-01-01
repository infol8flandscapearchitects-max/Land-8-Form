'use client';

import { useState, useEffect } from 'react';
import { getHiringStatus, updateHiringStatus } from '@/lib/actions/contact';
import { getJobPositionsAdmin, addJobPosition, updateJobPosition, deleteJobPosition } from '@/lib/actions/careers';
import { HiringStatus, JobPosition } from '@/lib/types/database';
import { Briefcase, Save, Plus, Edit2, Trash2, X, MapPin, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CareersAdminPage() {
    const [data, setData] = useState<HiringStatus | null>(null);
    const [positions, setPositions] = useState<JobPosition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state for new/edit position
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        job_type: 'Full-time',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [status, jobPositions] = await Promise.all([
            getHiringStatus(),
            getJobPositionsAdmin(),
        ]);
        setData(status);
        setPositions(jobPositions);
        setIsLoading(false);
    };

    const handleChange = (field: keyof HiringStatus, value: string | boolean) => {
        if (data) {
            setData({ ...data, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!data) return;

        setIsSaving(true);
        const result = await updateHiringStatus({
            is_hiring: data.is_hiring,
            hiring_title: data.hiring_title || undefined,
            hiring_description: data.hiring_description || undefined,
            not_hiring_title: data.not_hiring_title || undefined,
            not_hiring_description: data.not_hiring_description || undefined,
        });

        if (result.success) {
            toast.success('Hiring status updated!');
        } else {
            toast.error('Failed to update hiring status');
        }
        setIsSaving(false);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            job_type: 'Full-time',
            display_order: positions.length,
            is_active: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleAddPosition = async () => {
        if (!formData.title.trim()) {
            toast.error('Please enter a job title');
            return;
        }

        const result = await addJobPosition({
            title: formData.title,
            description: formData.description || null,
            location: formData.location || null,
            job_type: formData.job_type,
            display_order: formData.display_order,
            is_active: formData.is_active,
        });

        if (result.success) {
            toast.success('Job position added!');
            resetForm();
            loadData();
        } else {
            toast.error(result.error || 'Failed to add position');
        }
    };

    const handleUpdatePosition = async () => {
        if (!editingId || !formData.title.trim()) return;

        const result = await updateJobPosition(editingId, {
            title: formData.title,
            description: formData.description || null,
            location: formData.location || null,
            job_type: formData.job_type,
            display_order: formData.display_order,
            is_active: formData.is_active,
        });

        if (result.success) {
            toast.success('Job position updated!');
            resetForm();
            loadData();
        } else {
            toast.error(result.error || 'Failed to update position');
        }
    };

    const handleDeletePosition = async (id: string) => {
        if (!confirm('Are you sure you want to delete this position?')) return;

        const result = await deleteJobPosition(id);
        if (result.success) {
            toast.success('Job position deleted');
            loadData();
        } else {
            toast.error(result.error || 'Failed to delete position');
        }
    };

    const startEdit = (position: JobPosition) => {
        setFormData({
            title: position.title,
            description: position.description || '',
            location: position.location || '',
            job_type: position.job_type,
            display_order: position.display_order,
            is_active: position.is_active,
        });
        setEditingId(position.id);
        setShowForm(true);
    };

    if (isLoading) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Careers Settings</h1>
                </div>
                <div className="admin-card skeleton" style={{ height: '500px' }} />
            </div>
        );
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <h1 className="page-title">Careers Settings</h1>
                <p className="page-description">Manage your careers page, hiring status, and job openings.</p>
            </div>

            {/* Hiring Status Card */}
            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div className="admin-card-header">
                    <h2 className="admin-card-title">
                        <Briefcase size={20} style={{ marginRight: '8px' }} />
                        Hiring Status
                    </h2>
                </div>

                {/* Toggle */}
                <div style={{
                    padding: '20px',
                    background: data?.is_hiring ? 'rgba(34, 197, 94, 0.1)' : 'var(--admin-bg)',
                    border: `1px solid ${data?.is_hiring ? 'rgba(34, 197, 94, 0.3)' : 'var(--admin-border)'}`,
                    borderRadius: '12px',
                    marginBottom: '24px'
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '4px' }}>
                                {data?.is_hiring ? "We're Hiring!" : 'Not Currently Hiring'}
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>
                                {data?.is_hiring ? 'Open positions are displayed on the careers page.' : 'The careers page will show that no positions are available.'}
                            </p>
                        </div>
                        <div style={{
                            width: '56px',
                            height: '32px',
                            background: data?.is_hiring ? 'var(--admin-success)' : 'var(--admin-border)',
                            borderRadius: '16px',
                            padding: '4px',
                            transition: 'background 0.2s ease'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                background: 'white',
                                borderRadius: '50%',
                                transform: data?.is_hiring ? 'translateX(24px)' : 'translateX(0)',
                                transition: 'transform 0.2s ease'
                            }} />
                        </div>
                        <input
                            type="checkbox"
                            checked={data?.is_hiring || false}
                            onChange={(e) => handleChange('is_hiring', e.target.checked)}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                {/* When Hiring */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '16px' }}>
                        When Hiring (Active)
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={data?.hiring_title || ''}
                            onChange={(e) => handleChange('hiring_title', e.target.value)}
                            placeholder="We're Hiring!"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={data?.hiring_description || ''}
                            onChange={(e) => handleChange('hiring_description', e.target.value)}
                            placeholder="We have open positions available..."
                            rows={3}
                        />
                    </div>
                </div>

                {/* When Not Hiring */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '16px' }}>
                        When Not Hiring
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={data?.not_hiring_title || ''}
                            onChange={(e) => handleChange('not_hiring_title', e.target.value)}
                            placeholder="No Current Openings"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={data?.not_hiring_description || ''}
                            onChange={(e) => handleChange('not_hiring_description', e.target.value)}
                            placeholder="We don't have any open positions at the moment..."
                            rows={3}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
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

            {/* Job Positions Card */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">
                        <Briefcase size={20} style={{ marginRight: '8px' }} />
                        Job Positions
                    </h2>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        <Plus size={16} />
                        Add Position
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div style={{
                        padding: '20px',
                        background: 'var(--admin-bg-secondary)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                {editingId ? 'Edit Position' : 'New Position'}
                            </h3>
                            <button
                                onClick={resetForm}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Title *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Senior Landscape Architect"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Job responsibilities and requirements..."
                                rows={3}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Hyderabad"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Job Type</label>
                                <select
                                    className="form-input"
                                    value={formData.job_type}
                                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <span style={{ color: 'var(--admin-text)' }}>Active</span>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={editingId ? handleUpdatePosition : handleAddPosition}
                            >
                                <Save size={16} />
                                {editingId ? 'Update' : 'Add'} Position
                            </button>
                            <button className="btn btn-ghost" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Positions List */}
                {positions.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="empty-state-title">No job positions</h3>
                        <p className="empty-state-description">Add your first job position to show on the careers page.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {positions.map((position) => (
                            <div
                                key={position.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 20px',
                                    background: position.is_active ? 'var(--admin-bg)' : 'var(--admin-bg-secondary)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '12px',
                                    opacity: position.is_active ? 1 : 0.6,
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                            {position.title}
                                        </h4>
                                        {!position.is_active && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '2px 8px',
                                                background: 'var(--admin-text-muted)',
                                                color: 'white',
                                                borderRadius: '4px'
                                            }}>
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    {position.description && (
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--admin-text-muted)',
                                            marginBottom: '8px',
                                            maxWidth: '600px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {position.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        {position.location && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                                                <MapPin size={14} />
                                                {position.location}
                                            </span>
                                        )}
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                                            <Clock size={14} />
                                            {position.job_type}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => startEdit(position)}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleDeletePosition(position.id)}
                                        style={{ color: 'var(--admin-error)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

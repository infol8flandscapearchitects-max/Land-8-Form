'use client';

import { useState, useEffect } from 'react';
import { getCollaborations, addCollaboration, updateCollaboration, deleteCollaboration } from '@/lib/actions/about';
import { uploadImage } from '@/lib/actions/storage';
import { Collaboration } from '@/lib/types/database';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function CollaborationsPage() {
    const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ name: '', logo_url: '', website_url: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getCollaborations();
        setCollaborations(data);
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
                setFormData(prev => ({ ...prev, logo_url: result.url! }));
                toast.success('Logo uploaded!');
            } else {
                toast.error('Failed to upload logo');
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleAdd = async () => {
        if (!formData.logo_url) {
            toast.error('Please upload a logo');
            return;
        }

        const result = await addCollaboration({
            name: formData.name || null,
            logo_url: formData.logo_url,
            website_url: formData.website_url || null,
            display_order: collaborations.length,
            is_active: true,
        });

        if (result.success) {
            toast.success('Collaboration added!');
            setIsAddingNew(false);
            setFormData({ name: '', logo_url: '', website_url: '' });
            loadData();
        } else {
            toast.error('Failed to add collaboration');
        }
    };

    const handleUpdate = async () => {
        if (!editingId || !formData.logo_url) return;

        const result = await updateCollaboration(editingId, {
            name: formData.name || null,
            logo_url: formData.logo_url,
            website_url: formData.website_url || null,
        });

        if (result.success) {
            toast.success('Collaboration updated!');
            setEditingId(null);
            setFormData({ name: '', logo_url: '', website_url: '' });
            loadData();
        } else {
            toast.error('Failed to update collaboration');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collaboration?')) return;

        const result = await deleteCollaboration(id);
        if (result.success) {
            toast.success('Collaboration deleted!');
            loadData();
        } else {
            toast.error('Failed to delete collaboration');
        }
    };

    const startEdit = (collab: Collaboration) => {
        setEditingId(collab.id);
        setFormData({ name: collab.name || '', logo_url: collab.logo_url, website_url: collab.website_url || '' });
        setIsAddingNew(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsAddingNew(false);
        setFormData({ name: '', logo_url: '', website_url: '' });
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
                    <h1 className="page-title">Collaborations</h1>
                    <p className="page-description">Manage your partner and collaboration logos.</p>
                </div>
                {!isAddingNew && !editingId && (
                    <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                        <Plus size={18} />
                        Add Collaboration
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingId) && (
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">{editingId ? 'Edit Collaboration' : 'Add New Collaboration'}</h2>
                        <button className="btn btn-ghost btn-icon" onClick={cancelEdit}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
                        {/* Logo Upload */}
                        <div>
                            <label className="form-label">Logo *</label>
                            {formData.logo_url ? (
                                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--admin-border)', padding: '16px', background: 'white' }}>
                                    <img src={formData.logo_url} alt="Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
                                    padding: '32px',
                                    background: 'var(--admin-bg)',
                                    border: '2px dashed var(--admin-border)',
                                    borderRadius: '12px',
                                    color: 'var(--admin-text-muted)',
                                    cursor: 'pointer'
                                }}>
                                    {uploading ? <span className="spinner" /> : <Upload size={24} />}
                                    <span>Upload Logo</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div>
                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Partner Company"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Website URL</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={editingId ? handleUpdate : handleAdd}
                            disabled={!formData.logo_url}
                        >
                            <Save size={18} />
                            {editingId ? 'Update' : 'Add'} Collaboration
                        </button>
                    </div>
                </div>
            )}

            {/* Collaborations Grid */}
            <div className="admin-card">
                {isLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '8px' }} />
                        ))}
                    </div>
                ) : collaborations.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                        {collaborations.map((collab) => (
                            <div
                                key={collab.id}
                                style={{
                                    padding: '16px',
                                    background: 'white',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '12px',
                                    position: 'relative'
                                }}
                            >
                                <img src={collab.logo_url} alt={collab.name || 'Partner'} style={{ width: '100%', height: '60px', objectFit: 'contain' }} />
                                {collab.name && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textAlign: 'center', marginTop: '8px' }}>{collab.name}</p>
                                )}
                                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                                    <button className="btn btn-ghost btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => startEdit(collab)}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn btn-ghost btn-icon" style={{ width: '28px', height: '28px', color: 'var(--admin-error)' }} onClick={() => handleDelete(collab.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3 className="empty-state-title">No collaborations</h3>
                        <p className="empty-state-description">Add your partner logos to showcase on the about page.</p>
                        <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                            <Plus size={18} />
                            Add Collaboration
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

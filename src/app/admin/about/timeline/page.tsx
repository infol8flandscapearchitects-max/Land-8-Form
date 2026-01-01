'use client';

import { useState, useEffect } from 'react';
import { getTimelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } from '@/lib/actions/about';
import { PracticeTimeline } from '@/lib/types/database';
import { Plus, Trash2, Edit2, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function TimelinePage() {
    const [events, setEvents] = useState<PracticeTimeline[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({ year: '', title: '', description: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getTimelineEvents();
        setEvents(data);
        setIsLoading(false);
    };

    const handleAdd = async () => {
        if (!formData.year || !formData.title) {
            toast.error('Please fill in required fields');
            return;
        }

        const result = await addTimelineEvent({
            year: formData.year,
            title: formData.title,
            description: formData.description || null,
            display_order: events.length,
        });

        if (result.success) {
            toast.success('Event added!');
            setIsAddingNew(false);
            setFormData({ year: '', title: '', description: '' });
            loadData();
        } else {
            toast.error('Failed to add event');
        }
    };

    const handleUpdate = async () => {
        if (!editingId || !formData.year || !formData.title) return;

        const result = await updateTimelineEvent(editingId, {
            year: formData.year,
            title: formData.title,
            description: formData.description || null,
        });

        if (result.success) {
            toast.success('Event updated!');
            setEditingId(null);
            setFormData({ year: '', title: '', description: '' });
            loadData();
        } else {
            toast.error('Failed to update event');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        const result = await deleteTimelineEvent(id);
        if (result.success) {
            toast.success('Event deleted!');
            loadData();
        } else {
            toast.error('Failed to delete event');
        }
    };

    const startEdit = (event: PracticeTimeline) => {
        setEditingId(event.id);
        setFormData({ year: String(event.year), title: event.title || '', description: event.description || '' });
        setIsAddingNew(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsAddingNew(false);
        setFormData({ year: '', title: '', description: '' });
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
                    <h1 className="page-title">Company Timeline</h1>
                    <p className="page-description">Manage your company history milestones.</p>
                </div>
                {!isAddingNew && !editingId && (
                    <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                        <Plus size={18} />
                        Add Event
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingId) && (
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
                        <button className="btn btn-ghost btn-icon" onClick={cancelEdit}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Year *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.year}
                                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                placeholder="2020"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Major milestone..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe this milestone..."
                            rows={3}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={editingId ? handleUpdate : handleAdd}
                            disabled={!formData.year || !formData.title}
                        >
                            <Save size={18} />
                            {editingId ? 'Update' : 'Add'} Event
                        </button>
                    </div>
                </div>
            )}

            {/* Events List */}
            <div className="admin-card">
                {isLoading ? (
                    <div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: '80px', marginBottom: '12px', borderRadius: '8px' }} />
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    <div>
                        {events.map((event) => (
                            <div
                                key={event.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '20px',
                                    padding: '20px',
                                    background: 'var(--admin-bg)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: '8px',
                                    marginBottom: '12px'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    padding: '8px 16px',
                                    background: 'var(--admin-accent)',
                                    color: 'white',
                                    borderRadius: '999px',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    flexShrink: 0
                                }}>
                                    {event.year}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '4px' }}>{event.title || 'Untitled'}</h3>
                                    {event.description && (
                                        <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>{event.description}</p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-ghost btn-icon" onClick={() => startEdit(event)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn btn-ghost btn-icon" style={{ color: 'var(--admin-error)' }} onClick={() => handleDelete(event.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3 className="empty-state-title">No timeline events</h3>
                        <p className="empty-state-description">Add your first milestone to build your company timeline.</p>
                        <button className="btn btn-primary" onClick={() => setIsAddingNew(true)}>
                            <Plus size={18} />
                            Add Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

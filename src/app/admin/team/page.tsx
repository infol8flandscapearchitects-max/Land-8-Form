'use client';

import { useState, useEffect } from 'react';
import { getTeamMembers, deleteTeamMember } from '@/lib/actions/team';
import { TeamMember } from '@/lib/types/database';
import { Plus, Trash2, Edit2, User, Crown } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getTeamMembers();
        setMembers(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        const result = await deleteTeamMember(id);
        if (result.success) {
            toast.success('Team member deleted!');
            loadData();
        } else {
            toast.error('Failed to delete team member');
        }
    };

    const ceo = members.find(m => m.is_ceo);
    const otherMembers = members.filter(m => !m.is_ceo);

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Team Members</h1>
                    <p className="page-description">Manage your team and staff profiles.</p>
                </div>
                <Link href="/admin/team/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Member
                </Link>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <Link href="/admin/team/intro" className="btn btn-secondary">
                    Edit Staff Page Intro
                </Link>
                <Link href="/admin/team/cta" className="btn btn-secondary">
                    Edit Join Team CTA
                </Link>
            </div>

            {/* CEO Section */}
            {ceo && (
                <div className="admin-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <Crown size={20} style={{ marginRight: '8px', color: 'var(--admin-accent)' }} />
                            CEO / Founder
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: 'var(--admin-bg)',
                            border: '2px solid var(--admin-accent)'
                        }}>
                            {ceo.photo_url ? (
                                <img src={ceo.photo_url} alt={ceo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={32} />
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text)' }}>{ceo.name}</h3>
                            <p style={{ color: 'var(--admin-accent)', fontSize: '0.875rem' }}>{ceo.position}</p>
                        </div>
                        <Link href={`/admin/team/${ceo.id}`} className="btn btn-secondary btn-sm">
                            <Edit2 size={14} />
                            Edit
                        </Link>
                    </div>
                </div>
            )}

            {/* Team Grid */}
            {isLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '12px' }} />
                    ))}
                </div>
            ) : otherMembers.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {otherMembers.map(member => (
                        <div key={member.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    background: 'var(--admin-bg)',
                                    flexShrink: 0
                                }}>
                                    {member.photo_url ? (
                                        <img src={member.photo_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
                                            <User size={24} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '2px' }}>{member.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-accent)' }}>{member.position}</p>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            fontSize: '0.7rem',
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            color: '#818cf8',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontWeight: 500
                                        }}>Order: {member.display_order}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                padding: '12px 20px',
                                background: 'var(--admin-bg)',
                                borderTop: '1px solid var(--admin-border)',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '8px'
                            }}>
                                <Link href={`/admin/team/${member.id}`} className="btn btn-ghost btn-sm">
                                    <Edit2 size={14} />
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    style={{ color: 'var(--admin-error)' }}
                                    onClick={() => handleDelete(member.id)}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="admin-card">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <User size={32} />
                        </div>
                        <h3 className="empty-state-title">No team members</h3>
                        <p className="empty-state-description">Add your first team member to get started.</p>
                        <Link href="/admin/team/new" className="btn btn-primary">
                            <Plus size={18} />
                            Add Member
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

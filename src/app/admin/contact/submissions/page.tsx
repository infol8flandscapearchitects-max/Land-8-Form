'use client';

import { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission, markAsRead } from '@/lib/actions/contact';
import { ContactSubmission } from '@/lib/types/database';
import {
    Trash2,
    Eye,
    EyeOff,
    Mail,
    Phone,
    Calendar,
    ArrowLeft,
    Share2,
    Copy,
    Check,
    User,
    MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await getContactSubmissions();
        setSubmissions(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;

        const result = await deleteContactSubmission(id);
        if (result.success) {
            toast.success('Submission deleted!');
            setSelectedSubmission(null);
            loadData();
        } else {
            toast.error('Failed to delete submission');
        }
    };

    const handleMarkAsRead = async (submission: ContactSubmission) => {
        const result = await markAsRead(submission.id, !submission.is_read);
        if (result.success) {
            toast.success(submission.is_read ? 'Marked as unread' : 'Marked as read');
            loadData();
        } else {
            toast.error('Failed to update submission');
        }
    };

    const handleShare = async (submission: ContactSubmission) => {
        const shareText = `Contact Submission from ${submission.name}
---
Email: ${submission.email}
Phone: ${submission.phone}
Subject: ${submission.subject}
Message: ${submission.message}
Date: ${format(new Date(submission.created_at), 'PPP')}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Contact from ${submission.name}`,
                    text: shareText,
                });
                toast.success('Shared successfully!');
            } catch {
                // User cancelled share
            }
        } else {
            // Fallback to copy
            await navigator.clipboard.writeText(shareText);
            setCopiedId(submission.id);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const unreadCount = submissions.filter(s => !s.is_read).length;

    return (
        <div>
            <Toaster position="top-right" />
            <div className="page-header">
                <Link href="/admin/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '16px' }}>
                    <ArrowLeft size={18} />
                    Back to Contact
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">
                            Contact Submissions
                            {unreadCount > 0 && (
                                <span className="badge badge-error" style={{ marginLeft: '12px' }}>
                                    {unreadCount} new
                                </span>
                            )}
                        </h1>
                        <p className="page-description">View and manage contact form submissions.</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1.2fr' : '1fr', gap: '24px' }}>
                {/* Submissions List */}
                <div className="admin-card" style={{ padding: 0 }}>
                    {isLoading ? (
                        <div style={{ padding: '20px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton" style={{ height: '80px', marginBottom: '12px', borderRadius: '8px' }} />
                            ))}
                        </div>
                    ) : submissions.length > 0 ? (
                        <div>
                            {submissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    onClick={() => setSelectedSubmission(submission)}
                                    style={{
                                        padding: '16px 20px',
                                        borderBottom: '1px solid var(--admin-border)',
                                        cursor: 'pointer',
                                        background: selectedSubmission?.id === submission.id ? 'var(--admin-bg)' : 'transparent',
                                        transition: 'background 0.15s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        {!submission.is_read && (
                                            <div style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                background: 'var(--admin-accent)',
                                                marginTop: '6px',
                                                flexShrink: 0
                                            }} />
                                        )}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                <h3 style={{
                                                    fontSize: '0.9375rem',
                                                    fontWeight: submission.is_read ? 400 : 600,
                                                    color: 'var(--admin-text)',
                                                }}>
                                                    {submission.name}
                                                </h3>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', flexShrink: 0 }}>
                                                    {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p style={{
                                                fontSize: '0.8125rem',
                                                color: 'var(--admin-accent)',
                                                marginBottom: '4px',
                                                fontWeight: 500
                                            }}>
                                                {submission.subject}
                                            </p>
                                            <p style={{
                                                fontSize: '0.8125rem',
                                                color: 'var(--admin-text-muted)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {submission.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '60px 24px' }}>
                            <div className="empty-state-icon">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="empty-state-title">No submissions yet</h3>
                            <p className="empty-state-description">Contact form submissions will appear here.</p>
                        </div>
                    )}
                </div>

                {/* Submission Detail */}
                {selectedSubmission && (
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '4px' }}>
                                    {selectedSubmission.subject}
                                </h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
                                    {format(new Date(selectedSubmission.created_at), 'PPP \'at\' p')}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn btn-ghost btn-icon"
                                    onClick={() => handleMarkAsRead(selectedSubmission)}
                                    title={selectedSubmission.is_read ? 'Mark as unread' : 'Mark as read'}
                                >
                                    {selectedSubmission.is_read ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button
                                    className="btn btn-ghost btn-icon"
                                    onClick={() => handleShare(selectedSubmission)}
                                    title="Share"
                                >
                                    {copiedId === selectedSubmission.id ? <Check size={18} /> : <Share2 size={18} />}
                                </button>
                                <button
                                    className="btn btn-ghost btn-icon"
                                    style={{ color: 'var(--admin-error)' }}
                                    onClick={() => handleDelete(selectedSubmission.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            padding: '20px',
                            background: 'var(--admin-bg)',
                            borderRadius: '12px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'var(--admin-accent-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--admin-accent)'
                                }}>
                                    <User size={18} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Name</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--admin-text)' }}>{selectedSubmission.name}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'var(--admin-accent-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--admin-accent)'
                                }}>
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Email</p>
                                    <a href={`mailto:${selectedSubmission.email}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--admin-accent)' }}>
                                        {selectedSubmission.email}
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'var(--admin-accent-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--admin-accent)'
                                }}>
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Phone</p>
                                    <a href={`tel:${selectedSubmission.phone}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--admin-accent)' }}>
                                        {selectedSubmission.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '12px' }}>
                                Message
                            </h3>
                            <div style={{
                                padding: '20px',
                                background: 'var(--admin-bg)',
                                borderRadius: '12px',
                                fontSize: '0.9375rem',
                                color: 'var(--admin-text-secondary)',
                                lineHeight: 1.7,
                                whiteSpace: 'pre-wrap'
                            }}>
                                {selectedSubmission.message}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-border)' }}>
                            <a
                                href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                                className="btn btn-primary"
                            >
                                <Mail size={16} />
                                Reply via Email
                            </a>
                            <a
                                href={`tel:${selectedSubmission.phone}`}
                                className="btn btn-secondary"
                            >
                                <Phone size={16} />
                                Call
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

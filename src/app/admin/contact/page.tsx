'use client';

import Link from 'next/link';
import { Mail, Settings, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactManagerPage() {
    const sections = [
        {
            title: 'Contact Info Settings',
            description: 'Manage phone, email, address, and social media links',
            href: '/admin/contact/settings',
            icon: Settings,
            color: '#3b82f6',
        },
        {
            title: 'Contact Submissions',
            description: 'View and manage messages from contact form',
            href: '/admin/contact/submissions',
            icon: MessageSquare,
            color: '#22c55e',
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Contact Manager</h1>
                <p className="page-description">Manage contact information and view form submissions.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px'
            }}>
                {sections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            padding: '24px',
                            background: 'var(--admin-bg-secondary)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            background: `${section.color}20`
                        }}>
                            <section.icon size={28} style={{ color: section.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'var(--admin-text)',
                                marginBottom: '4px'
                            }}>
                                {section.title}
                            </h2>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--admin-text-muted)'
                            }}>
                                {section.description}
                            </p>
                        </div>
                        <ArrowRight size={20} style={{ color: 'var(--admin-text-muted)' }} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

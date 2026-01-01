import { getDashboardStats, getRecentSubmissions } from '@/lib/actions/dashboard';
import {
    FolderKanban,
    Users,
    MessageSquare,
    Star,
    Image as ImageIcon,
    Mail,
    ArrowUpRight,
    Clock,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const recentSubmissions = await getRecentSubmissions(5);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">Welcome back! Here&apos;s an overview of your website content.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <FolderKanban size={24} style={{ color: '#3b82f6' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalProjects}+</div>
                        <div className="stat-label">Total Projects</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                        <Users size={24} style={{ color: '#22c55e' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalTeamMembers}</div>
                        <div className="stat-label">Team Members</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
                        <Star size={24} style={{ color: '#f97316' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.featuredProjects}+</div>
                        <div className="stat-label">Completed Projects</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                        <Clock size={24} style={{ color: '#a855f7' }} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.yearsOfExperience}+</div>
                        <div className="stat-label">Office Journey</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Recent Submissions */}
                <div className="admin-card submissions-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">
                            <MessageSquare size={20} style={{ marginRight: '8px', color: 'var(--admin-accent)' }} />
                            Recent Submissions
                            {stats.unreadSubmissions > 0 && (
                                <span className="badge badge-error" style={{ marginLeft: '8px' }}>
                                    {stats.unreadSubmissions} new
                                </span>
                            )}
                        </h2>
                        <Link href="/admin/contact/submissions" className="btn btn-ghost btn-sm">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    {recentSubmissions.length > 0 ? (
                        <div className="submissions-list">
                            {recentSubmissions.map((submission) => (
                                <div key={submission.id} className="submission-item">
                                    <div className="submission-info">
                                        <div className="submission-header">
                                            <span className="submission-name">{submission.name}</span>
                                            {!submission.is_read && (
                                                <span className="badge badge-info">New</span>
                                            )}
                                        </div>
                                        <p className="submission-subject">{submission.subject}</p>
                                        <p className="submission-preview">{submission.message.substring(0, 80)}...</p>
                                    </div>
                                    <div className="submission-meta">
                                        <Clock size={14} />
                                        <span>{formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: '40px 24px' }}>
                            <div className="empty-state-icon">
                                <Mail size={32} />
                            </div>
                            <p className="empty-state-title">No submissions yet</p>
                            <p className="empty-state-description">Contact form submissions will appear here.</p>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Quick Actions</h2>
                    </div>

                    <div className="quick-links">
                        <Link href="/admin/projects/new" className="quick-link">
                            <FolderKanban size={20} />
                            <span>Add New Project</span>
                            <ArrowUpRight size={16} />
                        </Link>
                        <Link href="/admin/team/new" className="quick-link">
                            <Users size={20} />
                            <span>Add Team Member</span>
                            <ArrowUpRight size={16} />
                        </Link>
                        <Link href="/admin/home/hero" className="quick-link">
                            <ImageIcon size={20} />
                            <span>Manage Hero Slides</span>
                            <ArrowUpRight size={16} />
                        </Link>
                        <Link href="/admin/site-settings" className="quick-link">
                            <Star size={20} />
                            <span>Site Settings</span>
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

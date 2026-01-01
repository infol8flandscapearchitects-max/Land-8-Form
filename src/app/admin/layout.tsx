'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from '@/lib/actions/auth';
import {
    LayoutDashboard,
    Settings,
    FolderKanban,
    Users,
    Briefcase,
    Image as ImageIcon,
    Building2,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Info,
    Layers,
    Clock,
    Handshake,
    UserPlus,
    MessageSquare,
    Palette,
    SlidersHorizontal,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navigation: NavGroup[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
            { label: 'Site Settings', href: '/admin/site-settings', icon: <Palette size={18} /> },
            { label: 'Site Stats', href: '/admin/stats', icon: <SlidersHorizontal size={18} /> },
        ],
    },
    {
        title: 'Home Page',
        items: [
            { label: 'Hero Slides', href: '/admin/home/hero', icon: <ImageIcon size={18} /> },
            { label: 'CEO Section', href: '/admin/home/ceo', icon: <Users size={18} /> },
            { label: 'Learn More', href: '/admin/home/learn-more', icon: <Info size={18} /> },
        ],
    },
    {
        title: 'Projects',
        items: [
            { label: 'All Projects', href: '/admin/projects', icon: <FolderKanban size={18} /> },
            { label: 'Categories', href: '/admin/projects/categories', icon: <Layers size={18} /> },
            { label: 'Portfolio Header', href: '/admin/projects/header', icon: <SlidersHorizontal size={18} /> },
        ],
    },
    {
        title: 'About Page',
        items: [
            { label: 'Introduction', href: '/admin/about/intro', icon: <Info size={18} /> },
            { label: 'Office Gallery', href: '/admin/about/office-gallery', icon: <ImageIcon size={18} /> },
            { label: 'Collaborations', href: '/admin/about/collaborations', icon: <Handshake size={18} /> },
        ],
    },
    {
        title: 'Team',
        items: [
            { label: 'Team Members', href: '/admin/team', icon: <Users size={18} /> },
            { label: 'Staff Intro', href: '/admin/team/intro', icon: <Info size={18} /> },
            { label: 'Join Team CTA', href: '/admin/team/cta', icon: <UserPlus size={18} /> },
        ],
    },
    {
        title: 'Other',
        items: [
            { label: 'Careers', href: '/admin/careers', icon: <Briefcase size={18} /> },
            { label: 'Contact Info', href: '/admin/contact/settings', icon: <Settings size={18} /> },
            { label: 'Submissions', href: '/admin/contact/submissions', icon: <MessageSquare size={18} /> },
        ],
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('Admin Panel');

    // Fetch logo from database
    useEffect(() => {
        const fetchLogoData = async () => {
            try {
                const response = await fetch('/api/logo');
                const data = await response.json();
                if (data?.logo_url) {
                    setLogoUrl(data.logo_url);
                }
                if (data?.company_name) {
                    setCompanyName(data.company_name);
                }
            } catch (error) {
                console.error('Error fetching logo:', error);
            }
        };
        fetchLogoData();
    }, []);

    const handleSignOut = async () => {
        setIsLoggingOut(true);
        await signOut();
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="admin-layout">
            <Toaster position="top-right" />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt="Logo"
                                width={120}
                                height={60}
                                style={{ objectFit: 'contain' }}
                            />
                        ) : (
                            <Building2 size={40} />
                        )}
                    </div>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navigation.map((group) => (
                        <div key={group.title} className="nav-group">
                            <span className="nav-group-title">{group.title}</span>
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="nav-item logout-btn"
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                    >
                        <LogOut size={18} />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="header-breadcrumb">
                        {pathname.split('/').filter(Boolean).slice(1).map((segment, index, arr) => (
                            <span key={segment}>
                                {index > 0 && <ChevronDown size={14} className="breadcrumb-separator" />}
                                <span className={index === arr.length - 1 ? 'current' : ''}>
                                    {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
                                </span>
                            </span>
                        ))}
                    </div>

                    <div className="header-actions">
                        <Link href="/" target="_blank" className="btn btn-ghost btn-sm">
                            View Site
                        </Link>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>

            <style jsx>{`
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 35;
          display: none;
        }
        
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-bottom: 1px solid var(--admin-border);
        }
        
        .sidebar-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--admin-accent);
        }
        
        .sidebar-brand {
          flex: 1;
          overflow: hidden;
        }
        
        .brand-name {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: var(--admin-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .brand-type {
          display: block;
          font-size: 0.75rem;
          color: var(--admin-text-muted);
        }
        
        .sidebar-close {
          display: none;
          background: none;
          border: none;
          color: var(--admin-text-secondary);
          cursor: pointer;
          padding: 8px;
        }
        
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }
        
        .nav-group {
          margin-bottom: 8px;
        }
        
        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid var(--admin-border);
        }
        
        .logout-btn {
          color: var(--admin-error) !important;
          width: 100%;
        }
        
        .logout-btn:hover {
          background: var(--admin-error-light) !important;
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--admin-text);
          cursor: pointer;
          padding: 8px;
        }
        
        .header-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--admin-text-muted);
        }
        
        .header-breadcrumb .current {
          color: var(--admin-text);
          font-weight: 500;
        }
        
        .breadcrumb-separator {
          transform: rotate(-90deg);
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        @media (max-width: 768px) {
          .mobile-overlay {
            display: block;
          }
          
          .sidebar-close {
            display: block;
          }
          
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
        </div>
    );
}

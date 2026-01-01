// Public Data Queries
// These are used by the frontend to fetch content from Supabase

import { createClient } from '@/lib/supabase/server';
import {
    SiteSettings,
    LogoAndName,
    HeroSlide,
    CeoSection,
    Project,
    ProjectCategory,
    LearnMoreSection,
    ContactInfo,
    PortfolioHeader,
    AboutIntro,
    PhilosophyPrinciple,
    TeamMember,
    Collaboration,
    PracticeTimeline,
    StaffIntro,
    JoinTeamCTA,
    HiringStatus,
    SiteStats,
    OfficeGalleryImage,
    JobPosition,
} from '@/lib/types/database';

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching site settings:', error);
        return null;
    }
    return data;
}

// Logo and Company Name
export async function getLogoAndName(): Promise<LogoAndName | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('logo_and_name')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching logo and name:', error);
        return null;
    }
    return data;
}

// Hero Slides (active only, ordered)
export async function getHeroSlides(): Promise<HeroSlide[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }
    return data || [];
}

// CEO Section
export async function getCeoSection(): Promise<CeoSection | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('ceo_section')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching CEO section:', error);
        return null;
    }
    return data;
}

// Featured Projects
export async function getFeaturedProjects(): Promise<Project[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .select('*, category:project_categories(*)')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(6);

    if (error) {
        console.error('Error fetching featured projects:', error);
        return [];
    }
    return data || [];
}

// All Projects with optional filters
export async function getProjects(
    categoryId?: string,
    status?: 'upcoming' | 'ongoing' | 'completed',
    limit: number = 10,
    offset: number = 0
): Promise<{ projects: Project[]; count: number }> {
    const supabase = await createClient();

    let query = supabase
        .from('projects')
        .select('*, category:project_categories(*)', { count: 'exact' });

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error, count } = await query
        .order('display_order', { ascending: true })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error fetching projects:', error);
        return { projects: [], count: 0 };
    }
    return { projects: data || [], count: count || 0 };
}

// Single Project by ID
export async function getProject(id: string): Promise<Project | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .select('*, category:project_categories(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching project:', error);
        return null;
    }
    return data;
}

// Project Categories (active only)
export async function getProjectCategories(): Promise<ProjectCategory[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching project categories:', error);
        return [];
    }
    return data || [];
}

// Learn More Section
export async function getLearnMoreSection(): Promise<LearnMoreSection | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('learn_more_section')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching learn more section:', error);
        return null;
    }
    return data;
}

// Contact Info
export async function getContactInfo(): Promise<ContactInfo | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching contact info:', error);
        return null;
    }
    return data;
}

// Portfolio Header
export async function getPortfolioHeader(): Promise<PortfolioHeader | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('portfolio_header')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching portfolio header:', error);
        return null;
    }
    return data;
}

// About Intro
export async function getAboutIntro(): Promise<AboutIntro | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('about_intro')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching about intro:', error);
        return null;
    }
    return data;
}

// Philosophy Principles (active only)
export async function getPhilosophyPrinciples(): Promise<PhilosophyPrinciple[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('philosophy_principles')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching philosophy principles:', error);
        return [];
    }
    return data || [];
}

// Team Members (active only, optional role filter)
export async function getTeamMembers(role?: 'ceo' | 'leadership' | 'manager' | 'staff'): Promise<TeamMember[]> {
    const supabase = await createClient();

    let query = supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true);

    if (role) {
        query = query.eq('role', role);
    }

    const { data, error } = await query
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }
    return data || [];
}

// Collaborations (active only)
export async function getCollaborations(): Promise<Collaboration[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching collaborations:', error);
        return [];
    }
    return data || [];
}

// Practice Timeline
export async function getPracticeTimeline(): Promise<PracticeTimeline[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('practice_timeline')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching practice timeline:', error);
        return [];
    }
    return data || [];
}

// Staff Intro
export async function getStaffIntro(): Promise<StaffIntro | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('staff_intro')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching staff intro:', error);
        return null;
    }
    return data;
}

// Join Team CTA
export async function getJoinTeamCta(): Promise<JoinTeamCTA | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('join_team_cta')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching join team CTA:', error);
        return null;
    }
    return data;
}

// Hiring Status
export async function getHiringStatus(): Promise<HiringStatus | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('hiring_status')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching hiring status:', error);
        return null;
    }
    return data;
}

// Submit Contact Form
export async function submitContactForm(formData: {
    name: string;
    email: string;
    phone: string;
    alternative_phone?: string;
    subject: string;
    message: string;
}): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('contact_submissions')
        .insert([formData] as never);

    if (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// Site Stats (for About page)
export async function getSiteStats(): Promise<SiteStats | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('site_stats' as never)
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching site stats:', error);
        return null;
    }
    return data as SiteStats | null;
}

// Office Gallery Images (active only, ordered by display_order)
export async function getOfficeGalleryImages(): Promise<OfficeGalleryImage[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('office_gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching office gallery images:', error);
        return [];
    }
    return (data as OfficeGalleryImage[]) || [];
}

// Job Positions (active only, ordered by display_order)
export async function getJobPositions(): Promise<JobPosition[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('job_positions' as never)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching job positions:', error);
        return [];
    }
    return (data as JobPosition[]) || [];
}

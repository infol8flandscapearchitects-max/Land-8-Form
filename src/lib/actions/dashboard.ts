'use server';

import { createClient } from '@/lib/supabase/server';
import { DashboardStats, ContactSubmission } from '@/lib/types/database';

export async function getDashboardStats(): Promise<DashboardStats> {
    const supabase = await createClient();

    // Get total projects
    const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

    // Get total team members
    const { count: totalTeamMembers } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });

    // Get total contact submissions
    const { count: totalContactSubmissions } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });

    // Get unread submissions
    const { count: unreadSubmissions } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

    // Get featured projects (for completed projects count)
    const { count: featuredProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

    // Get years of experience from practice timeline
    const { data: timelineData } = await supabase
        .from('practice_timeline')
        .select('year')
        .order('year', { ascending: true })
        .limit(1);

    const currentYear = new Date().getFullYear();
    const startYear = timelineData && timelineData.length > 0 ? (timelineData[0] as { year: number }).year : currentYear;
    const yearsOfExperience = currentYear - startYear;

    return {
        totalProjects: totalProjects || 0,
        totalTeamMembers: totalTeamMembers || 0,
        totalContactSubmissions: totalContactSubmissions || 0,
        unreadSubmissions: unreadSubmissions || 0,
        featuredProjects: featuredProjects || 0,
        yearsOfExperience: yearsOfExperience > 0 ? yearsOfExperience : 0,
    };
}

export async function getRecentSubmissions(limit = 5): Promise<ContactSubmission[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent submissions:', error);
        return [];
    }

    return data as ContactSubmission[];
}

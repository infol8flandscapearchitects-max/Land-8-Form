'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { SiteStats, SiteStatsInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// Get Site Stats
export async function getSiteStats(): Promise<SiteStats | null> {
    const supabase = await createServiceClient();

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

// Update Site Stats
export async function updateSiteStats(input: Partial<SiteStatsInput>): Promise<{ success: boolean; error?: string; data?: SiteStats }> {
    const supabase = await createServiceClient();

    // First check if a record exists
    const { data: existing } = await supabase
        .from('site_stats' as never)
        .select('id')
        .single();

    const existingRecord = existing as { id: string } | null;

    if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
            .from('site_stats' as never)
            .update(input as never)
            .eq('id', existingRecord.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating site stats:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/about');
        revalidatePath('/admin/stats');
        return { success: true, data: data as SiteStats };
    } else {
        // Insert new record
        const { data, error } = await supabase
            .from('site_stats' as never)
            .insert({
                total_projects: input.total_projects ?? 0,
                team_members: input.team_members ?? 0,
                completed_projects: input.completed_projects ?? 0,
                years_of_experience: input.years_of_experience ?? 0,
            } as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating site stats:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/about');
        revalidatePath('/admin/stats');
        return { success: true, data: data as SiteStats };
    }
}

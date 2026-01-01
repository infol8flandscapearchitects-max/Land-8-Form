'use server';

import { createClient } from '@/lib/supabase/server';
import { JobPosition, JobPositionInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// Get all job positions (for admin)
export async function getJobPositionsAdmin(): Promise<JobPosition[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('job_positions' as never)
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching job positions:', error);
        return [];
    }
    return (data as JobPosition[]) || [];
}

// Add a new job position
export async function addJobPosition(position: JobPositionInput): Promise<{ success: boolean; error?: string; data?: JobPosition }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('job_positions' as never)
        .insert([position] as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding job position:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    return { success: true, data: data as JobPosition };
}

// Update a job position
export async function updateJobPosition(id: string, position: Partial<JobPositionInput>): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('job_positions' as never)
        .update({ ...position, updated_at: new Date().toISOString() } as never)
        .eq('id', id);

    if (error) {
        console.error('Error updating job position:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    return { success: true };
}

// Delete a job position
export async function deleteJobPosition(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('job_positions' as never)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting job position:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    return { success: true };
}

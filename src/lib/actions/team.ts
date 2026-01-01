'use server';

import { createClient } from '@/lib/supabase/server';
import { TeamMember, TeamMemberInput, StaffIntroInput, JoinTeamCTAInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// Team Members
export async function getTeamMembers(role?: string, activeOnly = false): Promise<TeamMember[]> {
    const supabase = await createClient();

    let query = supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

    if (role) {
        query = query.eq('role', role);
    }

    if (activeOnly) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching team members:', error);
        return [];
    }

    return (data as TeamMember[]) || [];
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching team member:', error);
        return null;
    }

    return data as TeamMember;
}

export async function addTeamMember(input: TeamMemberInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('team_members')
        .insert(input as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding team member:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/team');
    revalidatePath('/staff');
    revalidatePath('/about');
    return { success: true, data };
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('team_members')
        .update(input as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating team member:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/team');
    revalidatePath(`/admin/team/${id}`);
    revalidatePath('/staff');
    revalidatePath('/about');
    return { success: true, data };
}

export async function deleteTeamMember(id: string) {
    const supabase = await createClient();

    // First, get the team member to retrieve photo URL
    const { data: member } = await supabase
        .from('team_members')
        .select('photo_url')
        .eq('id', id)
        .single() as { data: { photo_url: string | null } | null };

    // Delete photo from storage
    if (member?.photo_url) {
        const { deleteImageByUrl } = await import('./storage');
        await deleteImageByUrl(member.photo_url, 'team-photos');
    }

    // Delete the team member record
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting team member:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/team');
    revalidatePath('/staff');
    revalidatePath('/about');
    return { success: true };
}

export async function reorderTeamMembers(memberIds: string[]) {
    const supabase = await createClient();

    for (let i = 0; i < memberIds.length; i++) {
        const { error } = await supabase
            .from('team_members')
            .update({ display_order: i } as never)
            .eq('id', memberIds[i]);

        if (error) {
            console.error('Error reordering team members:', error);
            return { success: false, error: error.message };
        }
    }

    revalidatePath('/admin/team');
    revalidatePath('/staff');
    return { success: true };
}

// Staff Intro
export async function getStaffIntro() {
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

export async function updateStaffIntro(input: Partial<StaffIntroInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('staff_intro')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('staff_intro')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating staff intro:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/team/intro');
        revalidatePath('/staff');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('staff_intro')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating staff intro:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/team/intro');
    revalidatePath('/staff');
    return { success: true, data };
}

// Join Team CTA
export async function getJoinTeamCTA() {
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

export async function updateJoinTeamCTA(input: Partial<JoinTeamCTAInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('join_team_cta')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('join_team_cta')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating join team CTA:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/team/cta');
        revalidatePath('/staff');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('join_team_cta')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating join team CTA:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/team/cta');
    revalidatePath('/staff');
    return { success: true, data };
}

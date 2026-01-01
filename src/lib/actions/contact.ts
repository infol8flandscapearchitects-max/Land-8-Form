'use server';

import { createClient } from '@/lib/supabase/server';
import { ContactInfo, ContactInfoInput, ContactSubmissionInput, HiringStatusInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// Hiring Status
export async function getHiringStatus() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('hiring_status')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching hiring status:', error);
        // Return default values if no record exists
        return {
            id: '',
            is_hiring: false,
            hiring_title: "We're Hiring!",
            hiring_description: 'We have open positions available. Check out our career opportunities.',
            not_hiring_title: 'No Current Openings',
            not_hiring_description: 'We don\'t have any open positions at the moment, but feel free to send us your resume.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }

    return data;
}

export async function updateHiringStatus(input: Partial<HiringStatusInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('hiring_status')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        // Create new record
        const { data, error } = await supabase
            .from('hiring_status')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating hiring status:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/careers');
        revalidatePath('/careers');
        return { success: true, data };
    }

    // Update existing record
    const { data, error } = await supabase
        .from('hiring_status')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating hiring status:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/careers');
    revalidatePath('/careers');
    return { success: true, data };
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

    return data as ContactInfo;
}

export async function updateContactInfo(input: Partial<ContactInfoInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('contact_info')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('contact_info')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating contact info:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/contact');
        revalidatePath('/contact');
        revalidatePath('/');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('contact_info')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating contact info:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/contact');
    revalidatePath('/contact');
    revalidatePath('/');
    return { success: true, data };
}

// Contact Submissions
export async function submitContactForm(input: ContactSubmissionInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_submissions')
        .insert(input as never)
        .select()
        .single();

    if (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getContactSubmissions(unreadOnly = false) {
    const supabase = await createClient();

    let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (unreadOnly) {
        query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching contact submissions:', error);
        return [];
    }

    return data;
}

export async function getContactSubmission(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching contact submission:', error);
        return null;
    }

    return data;
}

export async function markSubmissionAsRead(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true } as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error marking submission as read:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/contact/submissions');
    return { success: true, data };
}

export async function markSubmissionAsUnread(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_submissions')
        .update({ is_read: false } as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error marking submission as unread:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/contact/submissions');
    return { success: true, data };
}

export async function deleteSubmission(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting submission:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/contact/submissions');
    return { success: true };
}

export async function getUnreadSubmissionCount() {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

    if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }

    return count || 0;
}

// Alias functions for consistency
export async function markAsRead(id: string, isRead: boolean = true) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('contact_submissions')
        .update({ is_read: isRead } as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating submission:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/contact/submissions');
    return { success: true, data };
}

export async function deleteContactSubmission(id: string) {
    return deleteSubmission(id);
}

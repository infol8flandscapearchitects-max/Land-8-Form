'use server';

import { createClient } from '@/lib/supabase/server';
import { SiteSettingsInput, LogoAndNameInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
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

export async function updateSiteSettings(input: Partial<SiteSettingsInput>) {
    const supabase = await createClient();

    // Get the existing settings first
    const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        // Create new settings if none exist
        const { data, error } = await supabase
            .from('site_settings')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating site settings:', error);
            return { success: false, error: error.message };
        }

        // Revalidate all public pages to apply new colors
        revalidatePath('/', 'layout');
        revalidatePath('/admin/site-settings');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('site_settings')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating site settings:', error);
        return { success: false, error: error.message };
    }

    // Revalidate all public pages to apply new colors
    revalidatePath('/', 'layout');
    revalidatePath('/projects');
    revalidatePath('/about');
    revalidatePath('/careers');
    revalidatePath('/contact');
    revalidatePath('/staff');
    revalidatePath('/admin/site-settings');
    return { success: true, data };
}

export async function getLogoAndName() {
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

export async function updateLogoAndName(input: Partial<LogoAndNameInput>) {
    const supabase = await createClient();

    // Get the existing record first
    const { data: existing } = await supabase
        .from('logo_and_name')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        // Create new record if none exists
        const { data, error } = await supabase
            .from('logo_and_name')
            .insert({ logo_url: input.logo_url || '/logo.png', ...input } as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating logo and name:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/site-settings');
        revalidatePath('/');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('logo_and_name')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating logo and name:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/site-settings');
    revalidatePath('/');
    return { success: true, data };
}

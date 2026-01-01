'use server';

import { createClient } from '@/lib/supabase/server';
import { AboutIntroInput, PhilosophyPrincipleInput, CollaborationInput, PracticeTimelineInput, OfficeGalleryImageInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// About Intro
export async function getAboutIntro() {
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

export async function updateAboutIntro(input: Partial<AboutIntroInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('about_intro')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('about_intro')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating about intro:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/about/intro');
        revalidatePath('/about');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('about_intro')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating about intro:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/intro');
    revalidatePath('/about');
    return { success: true, data };
}

// Philosophy Principles
export async function getPhilosophyPrinciples() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('philosophy_principles')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching philosophy principles:', error);
        return [];
    }

    return data;
}

export async function getPhilosophy() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('philosophy_principles')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching philosophy:', error);
        return null;
    }

    return data;
}

export async function updatePhilosophy(input: Partial<PhilosophyPrincipleInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('philosophy_principles')
        .select('id')
        .limit(1)
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('philosophy_principles')
            .insert({ ...input, title: input.title || 'Our Philosophy', display_order: 0, is_active: true } as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating philosophy:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/about/philosophy');
        revalidatePath('/about');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('philosophy_principles')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating philosophy:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/philosophy');
    revalidatePath('/about');
    return { success: true, data };
}

export async function addPhilosophyPrinciple(input: { title: string; description: string | null }) {
    const supabase = await createClient();

    // Get the highest display_order
    const { data: existing } = await supabase
        .from('philosophy_principles')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1) as { data: { display_order: number }[] | null };

    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const { data, error } = await supabase
        .from('philosophy_principles')
        .insert({
            title: input.title,
            description: input.description,
            display_order: nextOrder,
            is_active: true
        } as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding philosophy principle:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/philosophy');
    revalidatePath('/about');
    return { success: true, data };
}

export async function updatePhilosophyPrinciple(id: string, input: { title: string; description: string | null }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('philosophy_principles')
        .update({ title: input.title, description: input.description } as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating philosophy principle:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/philosophy');
    revalidatePath('/about');
    return { success: true, data };
}

export async function deletePhilosophyPrinciple(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('philosophy_principles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting philosophy principle:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/philosophy');
    revalidatePath('/about');
    return { success: true };
}

// Timeline Events
export async function getTimelineEvents() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('practice_timeline')
        .select('*')
        .order('year', { ascending: false });

    if (error) {
        console.error('Error fetching timeline events:', error);
        return [];
    }

    return data;
}

export async function addTimelineEvent(input: { year: string; title: string; description: string | null; display_order: number }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('practice_timeline')
        .insert({ year: parseInt(input.year), title: input.title, description: input.description || input.title, display_order: input.display_order } as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding timeline event:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/timeline');
    revalidatePath('/about');
    return { success: true, data };
}

export async function updateTimelineEvent(id: string, input: { year: string; title: string; description: string | null }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('practice_timeline')
        .update({ year: parseInt(input.year), title: input.title, description: input.description || input.title } as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating timeline event:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/timeline');
    revalidatePath('/about');
    return { success: true, data };
}

export async function deleteTimelineEvent(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('practice_timeline')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting timeline event:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/timeline');
    revalidatePath('/about');
    return { success: true };
}

// Collaborations
export async function getCollaborations() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching collaborations:', error);
        return [];
    }

    return data;
}

export async function addCollaboration(input: Partial<CollaborationInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('collaborations')
        .insert(input as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding collaboration:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/collaborations');
    revalidatePath('/about');
    return { success: true, data };
}

export async function updateCollaboration(id: string, input: Partial<CollaborationInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('collaborations')
        .update(input as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating collaboration:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/collaborations');
    revalidatePath('/about');
    return { success: true, data };
}

export async function deleteCollaboration(id: string) {
    const supabase = await createClient();

    // First, get the collaboration to retrieve logo URL
    const { data: collab } = await supabase
        .from('collaborations')
        .select('logo_url')
        .eq('id', id)
        .single() as { data: { logo_url: string | null } | null };

    // Delete logo from storage
    if (collab?.logo_url) {
        const { deleteImageByUrl } = await import('./storage');
        await deleteImageByUrl(collab.logo_url, 'collaborations');
    }

    // Delete the collaboration record
    const { error } = await supabase
        .from('collaborations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting collaboration:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/collaborations');
    revalidatePath('/about');
    return { success: true };
}

export async function updateCollaborations(input: { heading?: string; description?: string }) {
    // This is a placeholder since collaborations table doesn't have heading/description
    // We'll just return success for now
    revalidatePath('/admin/about/collaborations');
    revalidatePath('/about');
    return { success: true };
}

// Office Gallery
export async function getOfficeGalleryImages() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('office_gallery')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching office gallery images:', error);
        return [];
    }

    return data;
}

export async function addOfficeGalleryImage(input: Partial<OfficeGalleryImageInput>) {
    const supabase = await createClient();

    // Get the highest display_order
    const { data: existing } = await supabase
        .from('office_gallery')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1) as { data: { display_order: number }[] | null };

    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

    const { data, error } = await supabase
        .from('office_gallery')
        .insert({
            ...input,
            display_order: nextOrder,
            is_active: true,
        } as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding office gallery image:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/office-gallery');
    revalidatePath('/about');
    return { success: true, data };
}

export async function updateOfficeGalleryImage(id: string, input: Partial<OfficeGalleryImageInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('office_gallery')
        .update(input as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating office gallery image:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/office-gallery');
    revalidatePath('/about');
    return { success: true, data };
}

export async function deleteOfficeGalleryImage(id: string) {
    const supabase = await createClient();

    // First, get the image to retrieve URL for storage cleanup
    const { data: image } = await supabase
        .from('office_gallery')
        .select('image_url')
        .eq('id', id)
        .single() as { data: { image_url: string | null } | null };

    // Delete image from storage if exists
    if (image?.image_url) {
        const { deleteImageByUrl } = await import('./storage');
        await deleteImageByUrl(image.image_url, 'office-gallery');
    }

    // Delete the record
    const { error } = await supabase
        .from('office_gallery')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting office gallery image:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/about/office-gallery');
    revalidatePath('/about');
    return { success: true };
}

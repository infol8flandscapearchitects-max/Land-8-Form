'use server';

import { createClient } from '@/lib/supabase/server';
import { HeroSlideInput, CeoSectionInput, LearnMoreSectionInput } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// Hero Slides
export async function getHeroSlides(activeOnly = false) {
    const supabase = await createClient();

    let query = supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

    if (activeOnly) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }

    return data;
}

export async function getHeroSlide(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching hero slide:', error);
        return null;
    }

    return data;
}

export async function addHeroSlide(input: HeroSlideInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('hero_slides')
        .insert(input as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding hero slide:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/home/hero');
    revalidatePath('/');
    return { success: true, data };
}

export async function updateHeroSlide(id: string, input: Partial<HeroSlideInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('hero_slides')
        .update(input as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating hero slide:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/home/hero');
    revalidatePath('/');
    return { success: true, data };
}

export async function deleteHeroSlide(id: string) {
    const supabase = await createClient();

    // First, get the slide to retrieve image URL
    const { data: slide } = await supabase
        .from('hero_slides')
        .select('image_url')
        .eq('id', id)
        .single() as { data: { image_url: string | null } | null };

    // Delete image from storage
    if (slide?.image_url) {
        const { deleteImageByUrl } = await import('./storage');
        await deleteImageByUrl(slide.image_url, 'hero-images');
    }

    // Delete the slide record
    const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting hero slide:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/home/hero');
    revalidatePath('/');
    return { success: true };
}

export async function reorderHeroSlides(slideIds: string[]) {
    const supabase = await createClient();

    const updates = slideIds.map((id, index) => ({
        id,
        display_order: index,
    }));

    for (const update of updates) {
        const { error } = await supabase
            .from('hero_slides')
            .update({ display_order: update.display_order } as never)
            .eq('id', update.id);

        if (error) {
            console.error('Error reordering hero slides:', error);
            return { success: false, error: error.message };
        }
    }

    revalidatePath('/admin/home/hero');
    revalidatePath('/');
    return { success: true };
}

// CEO Section
export async function getCeoSection() {
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

export async function updateCeoSection(input: Partial<CeoSectionInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('ceo_section')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const insertData = {
            photo_url: input.photo_url || '/ceo-placeholder.jpg',
            name: input.name || 'CEO Name',
            title: input.title || 'CEO',
            ...input
        };
        const { data, error } = await supabase
            .from('ceo_section')
            .insert(insertData as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating CEO section:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/home/ceo');
        revalidatePath('/');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('ceo_section')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating CEO section:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/home/ceo');
    revalidatePath('/');
    return { success: true, data };
}

// Learn More Section
export async function getLearnMoreSection() {
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

export async function updateLearnMoreSection(input: Partial<LearnMoreSectionInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('learn_more_section')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('learn_more_section')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating learn more section:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/home/learn-more');
        revalidatePath('/');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('learn_more_section')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating learn more section:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/home/learn-more');
    revalidatePath('/');
    return { success: true, data };
}

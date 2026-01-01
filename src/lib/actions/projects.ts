'use server';

import { createClient } from '@/lib/supabase/server';
import { ProjectInput, ProjectCategoryInput, ProjectFilters, PortfolioHeaderInput, Project } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

// Projects
export async function getProjects(filters?: ProjectFilters) {
    const supabase = await createClient();

    let query = supabase
        .from('projects')
        .select('*, category:project_categories(*)')
        .order('display_order', { ascending: true });

    if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    if (filters?.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data;
}

export async function getFeaturedProjects() {
    return getProjects({ isFeatured: true });
}

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

    return data as unknown as Project;
}

export async function addProject(input: ProjectInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .insert(input as never)
        .select('*, category:project_categories(*)')
        .single();

    if (error) {
        console.error('Error adding project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, data };
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('projects')
        .update(input as never)
        .eq('id', id)
        .select('*, category:project_categories(*)')
        .single();

    if (error) {
        console.error('Error updating project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, data };
}

export async function deleteProject(id: string) {
    const supabase = await createClient();

    // First, get the project to retrieve image URLs
    const { data: project } = await supabase
        .from('projects')
        .select('image_url, gallery_images')
        .eq('id', id)
        .single() as { data: { image_url: string | null; gallery_images: string[] | null } | null };

    // Delete images from storage
    if (project) {
        const { deleteImageByUrl, deleteMultipleImagesByUrl } = await import('./storage');

        // Delete main image
        if (project.image_url) {
            await deleteImageByUrl(project.image_url, 'project-images');
        }

        // Delete gallery images
        if (project.gallery_images && Array.isArray(project.gallery_images)) {
            await deleteMultipleImagesByUrl(project.gallery_images, 'project-images');
        }
    }

    // Delete the project record
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean) {
    return updateProject(id, { is_featured: isFeatured });
}

// Project Categories
export async function getProjectCategories(activeOnly = false) {
    const supabase = await createClient();

    let query = supabase
        .from('project_categories')
        .select('*')
        .order('display_order', { ascending: true });

    if (activeOnly) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching project categories:', error);
        return [];
    }

    return data;
}

export async function getProjectCategory(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching project category:', error);
        return null;
    }

    return data;
}

export async function addProjectCategory(input: ProjectCategoryInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('project_categories')
        .insert(input as never)
        .select()
        .single();

    if (error) {
        console.error('Error adding project category:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects/categories');
    revalidatePath('/projects');
    return { success: true, data };
}

export async function updateProjectCategory(id: string, input: Partial<ProjectCategoryInput>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('project_categories')
        .update(input as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating project category:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects/categories');
    revalidatePath('/projects');
    return { success: true, data };
}

export async function deleteProjectCategory(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('project_categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting project category:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects/categories');
    revalidatePath('/projects');
    return { success: true };
}

// Portfolio Header
export async function getPortfolioHeader() {
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

export async function updatePortfolioHeader(input: Partial<PortfolioHeaderInput>) {
    const supabase = await createClient();

    const { data: existing } = await supabase
        .from('portfolio_header')
        .select('id')
        .single() as { data: { id: string } | null };

    if (!existing) {
        const { data, error } = await supabase
            .from('portfolio_header')
            .insert(input as never)
            .select()
            .single();

        if (error) {
            console.error('Error creating portfolio header:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/projects/header');
        revalidatePath('/projects');
        return { success: true, data };
    }

    const { data, error } = await supabase
        .from('portfolio_header')
        .update(input as never)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating portfolio header:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/projects/header');
    revalidatePath('/projects');
    return { success: true, data };
}

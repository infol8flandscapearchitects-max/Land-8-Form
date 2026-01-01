'use server';

import { createClient, createServiceClient } from '@/lib/supabase/server';

type BucketName = 'logos' | 'hero-images' | 'project-images' | 'team-photos' | 'collaborations' | 'office-gallery' | 'general';

export async function uploadImage(
    fileData: string, // Base64 encoded file data
    fileName: string,
    bucket: BucketName,
    contentType: string
) {
    try {
        const supabase = await createServiceClient();

        // Convert base64 to buffer
        const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Check file size (max 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
            return { success: false, error: 'File size exceeds 5MB limit' };
        }

        // Generate unique filename
        const timestamp = Date.now();
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${timestamp}-${cleanFileName}`;

        console.log(`Uploading to bucket: ${bucket}, file: ${uniqueFileName}, size: ${buffer.length} bytes`);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(uniqueFileName, buffer, {
                contentType,
                upsert: false,
            });

        if (error) {
            console.error('Supabase storage error:', error);
            // Provide more helpful error messages
            if (error.message.includes('Bucket not found')) {
                return { success: false, error: `Storage bucket "${bucket}" does not exist. Please create it in Supabase dashboard.` };
            }
            if (error.message.includes('Invalid key')) {
                return { success: false, error: 'Invalid file name. Please use a simpler file name.' };
            }
            if (error.message.includes('Payload too large')) {
                return { success: false, error: 'File size is too large. Maximum allowed is 5MB.' };
            }
            return { success: false, error: error.message };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        console.log('Upload successful:', publicUrl);
        return { success: true, url: publicUrl, path: data.path };
    } catch (err) {
        console.error('Upload exception:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
}

export async function deleteImage(path: string, bucket: BucketName) {
    const supabase = await createClient();

    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error('Error deleting image:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function listImages(bucket: BucketName, folder?: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
        });

    if (error) {
        console.error('Error listing images:', error);
        return [];
    }

    // Add public URLs to each file
    const filesWithUrls = data
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);

            return {
                ...file,
                publicUrl,
            };
        });

    return filesWithUrls;
}

export async function getPublicUrl(path: string, bucket: BucketName) {
    const supabase = await createClient();

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return publicUrl;
}

/**
 * Extract the file path from a Supabase storage URL
 * URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[file-path]
 */
export async function extractPathFromUrl(url: string | null | undefined): Promise<string | null> {
    if (!url) return null;

    try {
        // Match the pattern after /storage/v1/object/public/[bucket]/
        const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }
        return null;
    } catch {
        console.error('Error extracting path from URL:', url);
        return null;
    }
}

/**
 * Delete an image from storage using its public URL
 */
export async function deleteImageByUrl(url: string | null | undefined, bucket: BucketName) {
    if (!url) return { success: true }; // Nothing to delete

    const path = await extractPathFromUrl(url);
    if (!path) {
        console.warn('Could not extract path from URL:', url);
        return { success: true }; // Return success to not block deletion
    }

    return deleteImage(path, bucket);
}

/**
 * Delete multiple images from storage using their public URLs
 */
export async function deleteMultipleImagesByUrl(urls: (string | null | undefined)[], bucket: BucketName) {
    const pathPromises = urls.map(url => extractPathFromUrl(url));
    const resolvedPaths = await Promise.all(pathPromises);
    const paths = resolvedPaths.filter((path): path is string => path !== null);

    if (paths.length === 0) return { success: true };

    const supabase = await createClient();

    const { error } = await supabase.storage
        .from(bucket)
        .remove(paths);

    if (error) {
        console.error('Error deleting multiple images:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

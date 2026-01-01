'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signIn(email: string, password: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true, user: data.user };
}

export async function signOut() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/admin/login');
}

export async function getCurrentUser() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

export async function resetPassword(email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password`,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updatePassword(newPassword: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

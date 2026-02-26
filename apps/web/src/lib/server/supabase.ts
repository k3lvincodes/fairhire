import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

/**
 * Server-side Supabase admin client using the service role key.
 * This bypasses RLS — only use in trusted server-side code.
 */
export function getAdminSupabase() {
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }
    return createClient(PUBLIC_SUPABASE_URL, serviceRoleKey, {
        auth: { persistSession: false }
    });
}

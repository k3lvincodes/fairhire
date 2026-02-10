import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    // Warn or maybe throw error if critical
    console.warn('Supabase environment variables are missing!');
}

export const supabase = createClient(
    PUBLIC_SUPABASE_URL || '',
    PUBLIC_SUPABASE_ANON_KEY || ''
);

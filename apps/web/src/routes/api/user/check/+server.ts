import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminSupabase } from '$lib/server/supabase';

/**
 * GET /api/user/check?wallet=<address>
 * Returns the onboarding status of a user (username, email, email_verified).
 * Uses the service role key to bypass RLS.
 */
export const GET: RequestHandler = async ({ url }) => {
    const wallet = url.searchParams.get('wallet');

    if (!wallet) {
        return json({ error: 'wallet parameter is required' }, { status: 400 });
    }

    try {
        const adminSupabase = getAdminSupabase();
        const { data, error } = await adminSupabase
            .from('users')
            .select('username, email, email_verified, cached_fair_score, cached_tier')
            .eq('wallet_address', wallet)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[user/check] DB error:', error);
            return json({ error: error.message }, { status: 500 });
        }

        return json({ user: data || null });
    } catch (err: any) {
        console.error('[user/check] Server error:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

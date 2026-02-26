import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAdminSupabase } from '$lib/server/supabase';

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Server-side user profile update endpoint.
 * Accepts partial updates for profile fields.
 * Uses the service role key to bypass RLS.
 * Enforces: username can only be changed once per month.
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { wallet_address, ...updates } = body;

        if (!wallet_address || typeof wallet_address !== 'string') {
            return json({ error: 'wallet_address is required' }, { status: 400 });
        }

        const adminSupabase = getAdminSupabase();

        // Whitelist allowed fields to prevent injection
        const allowedFields = ['email', 'email_verified', 'username', 'display_name', 'bio', 'skills', 'cached_fair_score', 'cached_tier'];
        const safeUpdates: Record<string, any> = {};
        for (const key of allowedFields) {
            if (key in updates) {
                safeUpdates[key] = updates[key];
            }
        }

        if (Object.keys(safeUpdates).length === 0) {
            return json({ error: 'No valid fields to update' }, { status: 400 });
        }

        // Enforce username change rate limit (once per month)
        if ('username' in safeUpdates && safeUpdates.username) {
            const { data: existing } = await adminSupabase
                .from('users')
                .select('username, username_changed_at')
                .eq('wallet_address', wallet_address)
                .single();

            if (existing && existing.username && existing.username !== safeUpdates.username) {
                // Username is actually changing — check the cooldown
                if (existing.username_changed_at) {
                    const lastChanged = new Date(existing.username_changed_at).getTime();
                    const now = Date.now();
                    if (now - lastChanged < FOURTEEN_DAYS_MS) {
                        const daysLeft = Math.ceil((FOURTEEN_DAYS_MS - (now - lastChanged)) / (24 * 60 * 60 * 1000));
                        return json(
                            { error: `Username can only be changed once every 14 days. Try again in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.` },
                            { status: 429 }
                        );
                    }
                }
                // Mark the change timestamp
                safeUpdates.username_changed_at = new Date().toISOString();
            }
        }

        safeUpdates.updated_at = new Date().toISOString();

        const { error } = await adminSupabase
            .from('users')
            .update(safeUpdates)
            .eq('wallet_address', wallet_address);

        if (error) {
            console.error('[user/update] DB error:', error);

            if (error.code === '23505') {
                return json({ error: 'Username is already taken.' }, { status: 409 });
            }

            return json({ error: error.message }, { status: 500 });
        }

        return json({ success: true });
    } catch (err: any) {
        console.error('[user/update] Server error:', err);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};


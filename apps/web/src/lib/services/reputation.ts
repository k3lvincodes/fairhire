import { supabase } from '$lib/supabase';

/**
 * Sync a wallet's reputation score to the Supabase `users` table.
 * Only writes if the score or tier actually changed.
 */
export async function syncReputationToDb(
    walletAddress: string,
    score: number,
    tier: 'alpha' | 'trusted' | 'builder'
): Promise<void> {
    try {
        // Check current cached values first to avoid unnecessary writes
        const { data: existing } = await supabase
            .from('users')
            .select('cached_fair_score, cached_tier')
            .eq('wallet_address', walletAddress)
            .single();

        // Skip write if nothing changed
        if (
            existing &&
            existing.cached_fair_score === score &&
            existing.cached_tier === tier
        ) {
            return;
        }

        const { error } = await supabase
            .from('users')
            .update({
                cached_fair_score: score,
                cached_tier: tier,
                updated_at: new Date().toISOString()
            })
            .eq('wallet_address', walletAddress);

        if (error) {
            console.error('[reputation] DB sync failed:', error.message);
        }
    } catch (err) {
        // Non-critical — don't break the app if DB sync fails
        console.error('[reputation] DB sync error:', err);
    }
}

/**
 * Read the cached reputation from Supabase (fallback when API is unavailable).
 */
export async function getCachedReputation(
    walletAddress: string
): Promise<{ score: number; tier: 'alpha' | 'trusted' | 'builder' } | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('cached_fair_score, cached_tier')
            .eq('wallet_address', walletAddress)
            .single();

        if (error || !data) return null;

        return {
            score: data.cached_fair_score ?? 0,
            tier: (data.cached_tier as 'alpha' | 'trusted' | 'builder') ?? 'builder'
        };
    } catch {
        return null;
    }
}

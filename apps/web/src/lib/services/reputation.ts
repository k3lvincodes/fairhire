/**
 * Read the cached reputation from the server (fallback when FairScale API is unavailable).
 * Routes through the server-side /api/user/check endpoint which bypasses RLS.
 */
export async function getCachedReputation(
    walletAddress: string
): Promise<{ score: number; tier: 'alpha' | 'trusted' | 'builder' } | null> {
    try {
        const res = await fetch(`/api/user/check?wallet=${encodeURIComponent(walletAddress)}`);
        if (!res.ok) return null;

        const { user } = await res.json();
        if (!user || user.cached_fair_score == null) return null;

        return {
            score: user.cached_fair_score ?? 0,
            tier: (user.cached_tier as 'alpha' | 'trusted' | 'builder') ?? 'builder'
        };
    } catch {
        return null;
    }
}


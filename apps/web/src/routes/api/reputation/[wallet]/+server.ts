import { json } from '@sveltejs/kit';
import { fetchScore } from '$lib/services/fairscale';
import type { RequestEvent } from '@sveltejs/kit';

/** Solana base58 address: 32-44 alphanumeric chars (no 0, O, I, l) */
const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const GET = async ({ params }: RequestEvent) => {
    const wallet = (params as Record<string, string>).wallet ?? '';

    // Validate wallet address format
    if (!wallet || !SOLANA_ADDRESS_RE.test(wallet)) {
        return json(
            { error: 'Invalid Solana wallet address' },
            { status: 400 }
        );
    }

    try {
        const result = await fetchScore(wallet);

        return json({
            score: result.score,
            tier: result.tier,
            badges: result.badges,
            lastUpdated: result.lastUpdated,
            cached: result.cached
        });
    } catch (err) {
        console.error('[reputation] FairScale fetch failed:', err);

        return json(
            { error: 'Failed to fetch reputation score' },
            { status: 502 }
        );
    }
};

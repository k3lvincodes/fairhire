import { writable, derived } from 'svelte/store';
import { syncReputationToDb, getCachedReputation } from '$lib/services/reputation';

// Types
export interface WalletState {
    connected: boolean;
    address: string | null;
    shortAddress: string | null;
    balance: {
        sol: number;
        usdc: number;
    };
}

export interface UserState {
    fairScore: number;
    tier: 'alpha' | 'trusted' | 'builder';
    reputationLoading: boolean;
    reputationError: string | null;
}

// Initial states
const initialWalletState: WalletState = {
    connected: false,
    address: null,
    shortAddress: null,
    balance: {
        sol: 0,
        usdc: 0
    }
};

const initialUserState: UserState = {
    fairScore: 0,
    tier: 'builder',
    reputationLoading: false,
    reputationError: null
};

// Stores
export const wallet = writable<WalletState>(initialWalletState);
export const user = writable<UserState>(initialUserState);

// Derived stores
export const isConnected = derived(wallet, $wallet => $wallet.connected);
export const userTier = derived(user, $user => $user.tier);
export const reputationLoading = derived(user, $user => $user.reputationLoading);
export const reputationError = derived(user, $user => $user.reputationError);

// Calculate tier from score
export function calculateTier(score: number): 'alpha' | 'trusted' | 'builder' {
    if (score >= 85) return 'alpha';
    if (score >= 70) return 'trusted';
    return 'builder';
}

// ── Reputation fetching ────────────────────────────────────────────────

let refreshInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Fetch reputation from the server-side proxy and update the store + DB cache.
 * Falls back to Supabase cached score if the API is unavailable.
 */
export async function fetchAndSetReputation(walletAddress: string): Promise<void> {
    user.update(u => ({ ...u, reputationLoading: true, reputationError: null }));

    try {
        const res = await fetch(`/api/reputation/${encodeURIComponent(walletAddress)}`);

        if (!res.ok) {
            throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();

        user.update(u => ({
            ...u,
            fairScore: data.score,
            tier: data.tier,
            reputationLoading: false,
            reputationError: null
        }));

        // Sync to DB in background (non-blocking)
        syncReputationToDb(walletAddress, data.score, data.tier).catch(() => { });
    } catch (err) {
        console.error('[wallet] Reputation fetch failed, trying DB cache:', err);

        // Fallback: read cached score from Supabase
        const cached = await getCachedReputation(walletAddress);
        if (cached) {
            user.update(u => ({
                ...u,
                fairScore: cached.score,
                tier: cached.tier,
                reputationLoading: false,
                reputationError: 'Using cached score'
            }));
        } else {
            user.update(u => ({
                ...u,
                reputationLoading: false,
                reputationError: 'Unable to fetch reputation'
            }));
        }
    }
}

/**
 * Manually refresh the current wallet's reputation.
 */
export async function refreshReputation(): Promise<void> {
    let address: string | null = null;
    wallet.subscribe(w => { address = w.address; })();
    if (address) {
        await fetchAndSetReputation(address);
    }
}

/**
 * Start auto-refreshing reputation every 30 seconds.
 */
function startAutoRefresh(walletAddress: string): void {
    stopAutoRefresh();
    refreshInterval = setInterval(() => {
        fetchAndSetReputation(walletAddress);
    }, 30_000);
}

/**
 * Stop the auto-refresh interval.
 */
function stopAutoRefresh(): void {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Actions
export function connectWallet() {
    // Mock connection for now - will integrate with Solana Wallet Adapter
    const mockAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';

    wallet.set({
        connected: true,
        address: mockAddress,
        shortAddress: `${mockAddress.slice(0, 4)}...${mockAddress.slice(-4)}`,
        balance: {
            sol: 2.45,
            usdc: 1250.00
        }
    });

    // Fetch live reputation instead of hardcoded mock
    fetchAndSetReputation(mockAddress);
    startAutoRefresh(mockAddress);
}

export function disconnectWallet() {
    stopAutoRefresh();
    wallet.set(initialWalletState);
    user.set(initialUserState);
}

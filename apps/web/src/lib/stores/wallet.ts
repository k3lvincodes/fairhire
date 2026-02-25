import { writable, derived, get } from 'svelte/store';
import { syncReputationToDb, getCachedReputation } from '$lib/services/reputation';
import { supabase } from '$lib/supabase';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import type { Adapter } from '@solana/wallet-adapter-base';
import bs58 from 'bs58';

// Types
export interface WalletState {
    connected: boolean;
    address: string | null;
    shortAddress: string | null;
    email: string | null;
    emailVerified: boolean;
    balance: {
        sol: number;
        usdc: number;
    };
    connecting: boolean;
    adapterName: string | null;
}

export interface UserState {
    fairScore: number;
    tier: 'alpha' | 'trusted' | 'builder';
    reputationLoading: boolean;
    reputationError: string | null;
}

export type OnboardingState = 'idle' | 'checking' | 'email_prompt' | 'email_otp' | 'username' | 'fairscore' | 'done';

// Initial states
const initialWalletState: WalletState = {
    connected: false,
    address: null,
    shortAddress: null,
    email: null,
    emailVerified: false,
    balance: { sol: 0, usdc: 0 },
    connecting: false,
    adapterName: null,
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
export const onboardingState = writable<OnboardingState>('idle');
export const showWalletModal = writable<boolean>(false);

// Derived stores
export const isConnected = derived(wallet, $wallet => $wallet.connected);
export const userTier = derived(user, $user => $user.tier);
export const reputationLoading = derived(user, $user => $user.reputationLoading);
export const reputationError = derived(user, $user => $user.reputationError);

// Wallet Adapters
export const availableAdapters: Adapter[] = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
];

let activeAdapter: Adapter | null = null;
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function calculateTier(score: number): 'alpha' | 'trusted' | 'builder' {
    if (score >= 85) return 'alpha';
    if (score >= 70) return 'trusted';
    return 'builder';
}

export async function fetchAndSetReputation(walletAddress: string): Promise<void> {
    user.update(u => ({ ...u, reputationLoading: true, reputationError: null }));
    try {
        const res = await fetch(`/api/reputation/${encodeURIComponent(walletAddress)}`);
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        user.update(u => ({ ...u, fairScore: data.score, tier: data.tier, reputationLoading: false, reputationError: null }));
        syncReputationToDb(walletAddress, data.score, data.tier).catch(() => { });
    } catch (err) {
        console.error('[wallet] Reputation fetch failed, trying DB cache:', err);
        const cached = await getCachedReputation(walletAddress);
        if (cached) {
            user.update(u => ({ ...u, fairScore: cached.score, tier: cached.tier, reputationLoading: false, reputationError: 'Using cached score' }));
        } else {
            user.update(u => ({ ...u, reputationLoading: false, reputationError: 'Unable to fetch reputation' }));
        }
    }
}

export async function selectAndConnectWallet(adapterName: string) {
    if (get(wallet).connecting) return;

    wallet.update(w => ({ ...w, connecting: true }));
    try {
        const adapter = availableAdapters.find(a => a.name === adapterName);
        if (!adapter) throw new Error('Adapter not found');

        // Disconnect active adapter if different
        if (activeAdapter && activeAdapter.name !== adapterName) {
            await activeAdapter.disconnect().catch(console.error);
        }

        if (adapter.readyState === 'Installed' || adapter.readyState === 'Loadable') {
            if (!adapter.connected && !adapter.connecting) {
                await adapter.connect();
            }
            activeAdapter = adapter;

            if (!adapter.publicKey) throw new Error('No public key found after connection');

            const address = adapter.publicKey.toBase58();

            // 2. Prompt for SIWS
            const messageStr = `Sign in to FairHire\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`;
            const messageBytes = new TextEncoder().encode(messageStr);

            if (!('signMessage' in adapter)) {
                throw new Error('Wallet does not support message signing');
            }

            const signature = await (adapter as any).signMessage(messageBytes);

            // Encode the signature securely
            const encodedSignature = bs58.encode(signature);

            // 3. Verify on backend
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    publicKey: address,
                    signature: encodedSignature,
                    message: messageStr
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'SIWS verification failed');

            // 4. Set Supabase Session
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: result.token,
                refresh_token: result.token,
            });

            if (sessionError) throw sessionError;

            wallet.update(w => ({
                ...w,
                connected: true,
                address,
                shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
                connecting: false,
                adapterName: adapter.name
            }));

            showWalletModal.set(false);
            checkUserOnboarding(address);
            fetchAndSetReputation(address);

        } else {
            // Usually NotDetected
            window.open(adapter.url, '_blank');
            throw new Error(`Please install ${adapter.name}`);
        }
    } catch (e) {
        console.error('Connection error:', e);
        wallet.update(w => ({ ...initialWalletState }));
        if (activeAdapter) activeAdapter.disconnect().catch(() => console.error);
        activeAdapter = null;
        throw e;
    }
}

export async function disconnectWallet() {
    stopAutoRefresh();
    if (activeAdapter) {
        await activeAdapter.disconnect().catch(console.error);
        activeAdapter = null;
    }
    await supabase.auth.signOut();
    wallet.set(initialWalletState);
    user.set(initialUserState);
    onboardingState.set('idle');
}

export function openWalletModal() {
    showWalletModal.set(true);
}

// Check if user is fully onboarded or needs to start flow
export async function checkUserOnboarding(walletAddress: string) {
    onboardingState.set('checking');
    try {
        const { data: userData, error } = await supabase
            .from('users')
            .select('username, email, email_verified')
            .eq('wallet_address', walletAddress)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user:', error);
            onboardingState.set('email_prompt');
            return;
        }

        if (!userData) {
            // New user missing everything
            onboardingState.set('email_prompt');
        } else if (!userData.email_verified) {
            // Exists but email not verified
            wallet.update(w => ({ ...w, email: userData.email || null, emailVerified: false }));
            onboardingState.set('email_prompt');
        } else if (!userData.username || userData.username.trim() === '') {
            // Email verified but no username
            wallet.update(w => ({ ...w, email: userData.email, emailVerified: true }));
            onboardingState.set('username');
        } else {
            // Fully onboarded
            wallet.update(w => ({ ...w, email: userData.email, emailVerified: true }));
            onboardingState.set('done');
        }
    } catch (err) {
        console.error('Error in checkUserOnboarding:', err);
        onboardingState.set('email_prompt');
    }
}

function startAutoRefresh(walletAddress: string): void {
    stopAutoRefresh();
    refreshInterval = setInterval(() => fetchAndSetReputation(walletAddress), 30_000);
}

function stopAutoRefresh(): void {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

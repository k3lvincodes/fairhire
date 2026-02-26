import { writable, derived, get } from 'svelte/store';
import { getCachedReputation } from '$lib/services/reputation';

// Types
export interface WalletState {
    connected: boolean;
    address: string | null;
    shortAddress: string | null;
    username: string | null;
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
    username: null,
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

// Native provider reference (no adapter layer, no SES lockdown)
let activeProvider: any = null;
let refreshInterval: ReturnType<typeof setInterval> | null = null;

// Session persistence
const SESSION_KEY = 'fairhire_wallet_session';
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

interface WalletSession {
    address: string;
    adapterName: string;
    connectedAt: number;
}

function saveSession(address: string, adapterName: string) {
    try {
        const session: WalletSession = { address, adapterName, connectedAt: Date.now() };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch { /* localStorage unavailable */ }
}

function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
}

function getSavedSession(): WalletSession | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session: WalletSession = JSON.parse(raw);
        // Check expiry
        if (Date.now() - session.connectedAt > SESSION_TTL_MS) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

/** Get the native Phantom Solana provider from window */
function getPhantomProvider(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).phantom?.solana ?? (window as any).solana ?? null;
}

/** Get the native Solflare provider from window */
function getSolflareProvider(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).solflare ?? null;
}

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
        // Score is synced to DB server-side in the reputation endpoint
        user.update(u => ({ ...u, fairScore: data.score, tier: data.tier, reputationLoading: false, reputationError: null }));
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

/**
 * Connect to a wallet using the NATIVE browser provider (window.phantom.solana / window.solflare).
 * This bypasses the @solana/wallet-adapter layer entirely, avoiding SES lockdown issues
 * and making the popup open instantly.
 */
export async function selectAndConnectWallet(adapterName: string) {
    if (get(wallet).connecting) return;

    wallet.update(w => ({ ...w, connecting: true }));
    try {
        let provider: any = null;

        if (adapterName === 'Phantom') {
            provider = getPhantomProvider();
            if (!provider) {
                window.open('https://phantom.app/', '_blank');
                throw new Error('Phantom wallet is not installed. Please install it and refresh.');
            }
        } else if (adapterName === 'Solflare') {
            provider = getSolflareProvider();
            if (!provider) {
                window.open('https://solflare.com/', '_blank');
                throw new Error('Solflare wallet is not installed. Please install it and refresh.');
            }
        } else {
            throw new Error(`Unknown wallet: ${adapterName}`);
        }

        // Disconnect previous provider if switching wallets
        if (activeProvider && activeProvider !== provider) {
            try { await activeProvider.disconnect(); } catch { /* ignore */ }
        }

        // 1. Connect — triggers extension popup instantly
        console.log('[wallet] Step 1: Calling provider.connect()...');
        const resp = await provider.connect();
        const publicKey = resp.publicKey ?? provider.publicKey;
        console.log('[wallet] Step 1 done. publicKey:', publicKey?.toBase58?.());

        if (!publicKey) throw new Error('No public key returned after connection');

        const address = publicKey.toBase58();
        activeProvider = provider;

        // 2. Sign message (SIWS) — second quick popup
        console.log('[wallet] Step 2: Requesting signMessage...');
        const message = `Sign in to FairHire\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signResult = await provider.signMessage(encodedMessage, 'utf8');
        console.log('[wallet] Step 2 done. Signature received:', !!signResult?.signature);

        // 3. Verify signature on server (no JWT, just validate & upsert user)
        console.log('[wallet] Step 3: Sending verify request to server...');
        const verifyRes = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: address,
                signature: Array.from(signResult.signature),
                message
            })
        });
        console.log('[wallet] Step 3 done. verify status:', verifyRes.status);

        if (!verifyRes.ok) {
            const err = await verifyRes.json().catch(() => ({ error: 'Verification failed' }));
            throw new Error(err.error || 'Signature verification failed');
        }

        wallet.update(w => ({
            ...w,
            connected: true,
            address,
            shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
            connecting: false,
            adapterName
        }));

        showWalletModal.set(false);
        console.log('[wallet] Connection complete! Address:', address);

        // Save session for auto-reconnect
        saveSession(address, adapterName);

        // Fire-and-forget: onboarding check + reputation fetch (don't block UI)
        checkUserOnboarding(address);
        fetchAndSetReputation(address);

    } catch (e) {
        console.error('[wallet] Connection error:', e);
        wallet.update(w => ({ ...initialWalletState }));
        activeProvider = null;
        throw e;
    }
}

export async function disconnectWallet() {
    stopAutoRefresh();
    clearSession();
    if (activeProvider) {
        try { await activeProvider.disconnect(); } catch { /* ignore */ }
        activeProvider = null;
    }
    wallet.set(initialWalletState);
    user.set(initialUserState);
    onboardingState.set('idle');
}

/**
 * Restore a saved wallet session on page load.
 * Silently reconnects if a valid, non-expired session exists.
 * No signature popup — previously authorized wallets auto-approve .connect().
 */
export async function restoreSession(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (get(wallet).connected || get(wallet).connecting) return;

    const session = getSavedSession();
    if (!session) return;

    try {
        let provider: any = null;
        if (session.adapterName === 'Phantom') {
            provider = getPhantomProvider();
        } else if (session.adapterName === 'Solflare') {
            provider = getSolflareProvider();
        }
        if (!provider) {
            clearSession();
            return;
        }

        // .connect() on a previously authorized site won't show a popup
        const resp = await provider.connect({ onlyIfTrusted: true });
        const publicKey = resp.publicKey ?? provider.publicKey;
        if (!publicKey) {
            clearSession();
            return;
        }

        const address = publicKey.toBase58();

        // Verify it's the same address we saved
        if (address !== session.address) {
            clearSession();
            return;
        }

        activeProvider = provider;

        wallet.update(w => ({
            ...w,
            connected: true,
            address,
            shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
            connecting: false,
            adapterName: session.adapterName
        }));

        console.log('[wallet] Session restored for:', address);

        // Restore onboarding + reputation
        checkUserOnboarding(address);
        fetchAndSetReputation(address);

    } catch (e) {
        // Silent fail — user just needs to reconnect manually
        console.warn('[wallet] Session restore failed:', e);
        clearSession();
    }
}

export function openWalletModal() {
    showWalletModal.set(true);
}

// Check if user is fully onboarded or needs to start flow
export async function checkUserOnboarding(walletAddress: string) {
    onboardingState.set('checking');
    try {
        const res = await fetch(`/api/user/check?wallet=${encodeURIComponent(walletAddress)}`);
        if (!res.ok) {
            console.error('Error fetching user:', res.status);
            onboardingState.set('email_prompt');
            return;
        }

        const { user: userData } = await res.json();

        if (!userData) {
            // New user missing everything
            onboardingState.set('email_prompt');
        } else if (!userData.email_verified) {
            // Exists but email not verified
            wallet.update(w => ({ ...w, username: userData.username || null, email: userData.email || null, emailVerified: false }));
            onboardingState.set('email_prompt');
        } else if (!userData.username || userData.username.trim() === '') {
            // Email verified but no username
            wallet.update(w => ({ ...w, username: null, email: userData.email, emailVerified: true }));
            onboardingState.set('username');
        } else {
            // Fully onboarded
            wallet.update(w => ({ ...w, username: userData.username, email: userData.email, emailVerified: true }));
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

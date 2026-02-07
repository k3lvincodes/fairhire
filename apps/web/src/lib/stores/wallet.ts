import { writable, derived } from 'svelte/store';

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
    tier: 'builder'
};

// Stores
export const wallet = writable<WalletState>(initialWalletState);
export const user = writable<UserState>(initialUserState);

// Derived stores
export const isConnected = derived(wallet, $wallet => $wallet.connected);
export const userTier = derived(user, $user => $user.tier);

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

    // Set mock FairScore
    user.set({
        fairScore: 92,
        tier: 'alpha'
    });
}

export function disconnectWallet() {
    wallet.set(initialWalletState);
    user.set(initialUserState);
}

// Calculate tier from score
export function calculateTier(score: number): 'alpha' | 'trusted' | 'builder' {
    if (score >= 85) return 'alpha';
    if (score >= 70) return 'trusted';
    return 'builder';
}

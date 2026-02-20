import { env } from '$env/dynamic/private';
import { calculateTier } from '$lib/stores/wallet';

const FAIRSCALE_API_KEY = env.FAIRSCALE_API_KEY ?? '';
const FAIRSCALE_MOCK = env.FAIRSCALE_MOCK ?? 'true';

// ── Types ──────────────────────────────────────────────────────────────

export interface FairScaleBadge {
	id: string;
	label: string;
	description: string;
	tier: string;
}

export interface FairScaleFeatures {
	lst_percentile_score?: number;
	major_percentile_score?: number;
	native_sol_percentile?: number;
	tx_count?: number;
	active_days?: number;
	wallet_age_days?: number;
}

/** Raw response from GET https://api.fairscale.xyz/score?wallet=ADDR */
export interface FairScaleResponse {
	wallet: string;
	fairscore_base: number;
	social_score: number;
	fairscore: number; // 0–100 decimal
	tier: string; // FairScale tier (bronze/silver/gold/platinum) — we ignore this
	badges: FairScaleBadge[];
	actions: unknown[];
	timestamp: string;
	features: FairScaleFeatures;
}

/** Normalized score returned by our service */
export interface FairHireScore {
	score: number; // 0–100 integer
	tier: 'alpha' | 'trusted' | 'builder';
	badges: FairScaleBadge[];
	lastUpdated: string;
	cached: boolean;
}

// ── In-memory TTL Cache ────────────────────────────────────────────────

interface CacheEntry {
	data: FairHireScore;
	expiresAt: number;
}

const CACHE_TTL_MS = 30_000; // 30 seconds
const cache = new Map<string, CacheEntry>();

function getCached(wallet: string): FairHireScore | null {
	const entry = cache.get(wallet);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(wallet);
		return null;
	}
	return { ...entry.data, cached: true };
}

function setCache(wallet: string, data: FairHireScore): void {
	cache.set(wallet, {
		data,
		expiresAt: Date.now() + CACHE_TTL_MS
	});
}

// ── Mock Mode ──────────────────────────────────────────────────────────

function generateMockScore(wallet: string): FairHireScore {
	// Deterministic score from wallet address hash
	let hash = 0;
	for (let i = 0; i < wallet.length; i++) {
		hash = (hash * 31 + wallet.charCodeAt(i)) & 0x7fffffff;
	}
	const score = 50 + (hash % 51); // Range: 50–100

	return {
		score,
		tier: calculateTier(score),
		badges: [],
		lastUpdated: new Date().toISOString(),
		cached: false
	};
}

// ── Retry Helper ───────────────────────────────────────────────────────

async function fetchWithRetry(url: string, headers: Record<string, string>, maxAttempts = 2): Promise<Response> {
	let lastError: Error | null = null;

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const res = await fetch(url, { headers });
			if (res.ok) return res;
			// Don't retry client errors (4xx)
			if (res.status >= 400 && res.status < 500) {
				throw new Error(`FairScale API error: ${res.status} ${res.statusText}`);
			}
			lastError = new Error(`FairScale API error: ${res.status}`);
		} catch (err) {
			lastError = err instanceof Error ? err : new Error(String(err));
		}

		// Exponential backoff: 1s, 2s
		if (attempt < maxAttempts - 1) {
			await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
		}
	}

	throw lastError ?? new Error('FairScale API request failed');
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Fetch a wallet's FairScore from FairScale and normalize it for FairHire.
 *
 * - Checks in-memory cache first (30s TTL)
 * - In mock mode, returns deterministic score without API call
 * - Retries once with exponential backoff on server errors
 */
export async function fetchScore(walletAddress: string): Promise<FairHireScore> {
	// 1. Check cache
	const cached = getCached(walletAddress);
	if (cached) return cached;

	// 2. Mock mode
	const isMock = FAIRSCALE_MOCK === 'true';
	if (isMock) {
		const mock = generateMockScore(walletAddress);
		setCache(walletAddress, mock);
		return mock;
	}

	// 3. Real API call
	if (!FAIRSCALE_API_KEY) {
		throw new Error('FAIRSCALE_API_KEY is not configured');
	}

	const url = `https://api.fairscale.xyz/score?wallet=${encodeURIComponent(walletAddress)}`;
	const res = await fetchWithRetry(url, { fairkey: FAIRSCALE_API_KEY });
	const data: FairScaleResponse = await res.json();

	// 4. Convert score: fairscore is already 0-100 decimal, round to int
	const score = Math.round(data.fairscore);

	const result: FairHireScore = {
		score,
		tier: calculateTier(score),
		badges: data.badges ?? [],
		lastUpdated: data.timestamp ?? new Date().toISOString(),
		cached: false
	};

	setCache(walletAddress, result);
	return result;
}

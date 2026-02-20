# Reputation Fetching from FairScale — Implementation Plan

## Context

FairHire's core value proposition is **reputation-gated payments** — a worker's FairScore determines whether they get instant-pay, fast-track, or standard escrow. Today the app uses a **hardcoded mock** (`fairScore: 92` in `wallet.ts`). This plan replaces that with real FairScale API integration.

### Current State

| Area | Status |
|---|---|
| DB schema | `cached_fair_score` + `cached_tier` columns on `users` table |
| Frontend | 15+ components consume `$user.fairScore` from the Svelte store |
| API layer | No FairScale proxy route exists (`routes/api/` only has `waitlist/`) |
| Mock | Hardcoded `fairScore: 92, tier: 'alpha'` in `wallet.ts` |

---

## FairScale API — Verified Details

> Researched from [docs.fairscale.xyz](https://docs.fairscale.xyz) on 2026-02-20

### Base URL
```
https://api.fairscale.xyz
```

### Authentication
All endpoints require an API key via the `fairkey` header:
```
fairkey: YOUR_API_KEY
```

### Available Endpoints

| Endpoint | Returns | Use Case |
|---|---|---|
| `GET /score?wallet=ADDR` | Full analysis: fairscore, tier, badges, features | Rich profile data |
| `GET /fairScore?wallet=ADDR` | `{ "fair_score": 272 }` | Quick score-only lookup |
| `GET /walletScore?wallet=ADDR` | `{ "wallet_score": 134 }` | On-chain activity only |

### Score Scale Analysis

**There are two different score formats:**

| Endpoint | Field | Example Value | Likely Scale |
|---|---|---|---|
| `/score` | `fairscore` | `65.3` | **0–100** (decimal) |
| `/fairScore` | `fair_score` | `272` | **0–1000** (integer) |

The `/score` endpoint also returns `fairscore_base` (wallet-only, e.g. `58.1`) and `social_score` (e.g. `36.0`), plus a `tier` field.

### FairScale Tiers (from `/score` response)

FairScale uses its own tier system:
| Tier | Level |
|---|---|
| `bronze` | Lowest |
| `silver` | – |
| `gold` | – |
| `platinum` | Highest |

**FairHire has a different tier system:**
| FairHire Tier | FairHire Score | Settlement |
|---|---|---|
| `builder` | < 70 | Standard Escrow |
| `trusted` | 70–84 | Fast Track (12hr) |
| `alpha` | 85+ | Instant Auto-Pay |

### Full `/score` Example Response
```json
{
  "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "fairscore_base": 58.1,
  "social_score": 36.0,
  "fairscore": 65.3,
  "tier": "gold",
  "badges": [
    {
      "id": "diamond_hands",
      "label": "Diamond Hands",
      "description": "Long-term holder with conviction",
      "tier": "platinum"
    }
  ],
  "actions": [],
  "timestamp": "2026-01-21T13:13:53.608725Z",
  "features": {
    "lst_percentile_score": 0.75,
    "major_percentile_score": 0.82,
    "native_sol_percentile": 0.68,
    "tx_count": 1250,
    "active_days": 180,
    "wallet_age_days": 365
  }
}
```

---

## Confirmed Decisions

1. **Endpoint**: Use `/score` (Option A) — the `fairscore` field is already 0–100 decimal, convert with `Math.round(fairscore)`.
2. **Tiers**: Ignore FairScale's tier (`bronze/silver/gold/platinum`). Calculate FairHire tier from the converted score using existing `calculateTier()`:
   - `85+` → alpha (Instant Auto-Pay)
   - `70–84` → trusted (Fast Track 12hr)
   - `< 70` → builder (Standard Escrow)
3. **Sync strategy**: Lazy Sync for V1 (fetch on wallet connect + 30s auto-refresh).
4. **API key**: Required — `fairkey` header. Need key from [sales.fairscale.xyz](https://sales.fairscale.xyz). Env var: `FAIRSCALE_API_KEY`.
5. **Mock mode**: `FAIRSCALE_MOCK=true` for dev/staging.

---

## Proposed Changes

### 1. FairScale API Service Layer

**New file:** `src/lib/services/fairscale.ts`

- `fetchScore(walletAddress: string)` — calls FairScale API
- Score conversion: normalizes FairScale score → FairHire 0–100 int
- Tier calculation: uses existing `calculateTier()` (ignores FairScale's tier)
- In-memory TTL cache (30s)
- Retry with exponential backoff (2 attempts)
- Mock mode: `FAIRSCALE_MOCK=true` returns deterministic score per wallet
- Types for FairScale response

### 2. SvelteKit Server-Side Proxy Route

**New file:** `src/routes/api/reputation/[wallet]/+server.ts`

- `GET /api/reputation/[wallet]` — keeps API key server-side
- Validates wallet address format (Solana base58, 32-44 chars)
- Calls FairScale service
- Returns: `{ score, tier, badges?, lastUpdated, cached }`
- Auth header: `fairkey: FAIRSCALE_API_KEY` (env var, never exposed to client)

### 3. Database Cache Sync

**New file:** `src/lib/services/reputation.ts`

- `syncReputationToDb(wallet, score, tier)` — upserts `cached_fair_score` + `cached_tier` on `users` table
- Only writes if score changed
- Called after each successful FairScale fetch

### 4. Frontend Store Integration

**Modify:** `src/lib/stores/wallet.ts`

- Replace hardcoded `fairScore: 92` with live fetch on wallet connect
- `fetchAndSetReputation(wallet)` — calls `/api/reputation/[wallet]`, updates store + DB
- `refreshReputation()` — exported for manual refresh
- Auto-refresh every 30s while connected
- Add `reputationLoading` + `reputationError` to `UserState`
- Fallback to `cached_fair_score` from Supabase if API fails

### 5. UI Loading & Error States

**Modify:** `FairScoreBadge.svelte` — add loading skeleton + error state (`?`)
**Modify:** `ClaimTaskModal.svelte` — disable Claim while reputation loading

### 6. Environment Configuration

**Modify:** `.env.example`
```env
FAIRSCALE_API_KEY=
FAIRSCALE_MOCK=true
```

---

## Architecture Flow

```
User connects wallet
    │
    ▼
SvelteKit App ──GET──▶ /api/reputation/[wallet]
                            │
                            ├── Validate wallet format
                            │
                     ┌──────┴──────┐
                     │ Mock Mode?  │
                     └──────┬──────┘
                      yes   │   no
                      ▼     │    ▼
              Generate      │   GET api.fairscale.xyz/score?wallet=...
              mock score    │   Header: fairkey: API_KEY
                      │     │    │
                      └─────┴────┘
                            │
                            ▼
              Convert score → FairHire 0-100
              Calculate tier (builder/trusted/alpha)
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
          Update user store    Upsert DB cache
          (fairScore, tier)    (cached_fair_score)
                  │
                  ▼
          Render FairScoreBadge
                  │
          Auto-refresh every 30s
```

---

## File Summary

| Action | File | Purpose |
|---|---|---|
| **NEW** | `src/lib/services/fairscale.ts` | FairScale API client with cache, retry, mock |
| **NEW** | `src/routes/api/reputation/[wallet]/+server.ts` | Server-side proxy route |
| **NEW** | `src/lib/services/reputation.ts` | DB cache sync logic |
| **MODIFY** | `src/lib/stores/wallet.ts` | Replace mock with live fetch + auto-refresh |
| **MODIFY** | `src/lib/components/FairScoreBadge.svelte` | Loading/error states |
| **MODIFY** | `src/lib/components/ClaimTaskModal.svelte` | Gate claims on live score |
| **MODIFY** | `.env.example` | Add FairScale env vars |

---

## Verification Plan

1. **Mock mode** — `FAIRSCALE_MOCK=true`, connect wallet → badge shows deterministic score, not 0 or hardcoded 92
2. **Loading states** — brief skeleton on FairScoreBadge before score populates
3. **Error handling** — invalid API URL + `MOCK=false` → badge shows `?`, app doesn't crash
4. **API route** — `GET /api/reputation/{wallet}` returns JSON; `/api/reputation/invalid` returns 400
5. **Claim gating** — Claim button disabled while loading, gates correctly on score vs `minScore`
6. **DB sync** — check Supabase `users` table → `cached_fair_score` + `cached_tier` updated

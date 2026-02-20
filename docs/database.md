# FairHire Database Design (Hybrid On-Chain/Off-Chain)

This document outlines the database strategy for FairHire. While the core "truth" of reputation, payments, and agreements lives on the Solana blockchain, we need a robust off-chain database (Supabase/PostgreSQL) for rich metadata, discovery, and user experience.

## Philosophy: "Chain for Truth, Database for Speed & Context"

*   **On-Chain (Solana)**: Settlements, Escrow state, FairScore (the value itself), Dispute resolution outcomes.
*   **Off-Chain (Supabase)**: User profiles, Task descriptions, Search indexing, Messaging, Notifications.
*   **File Storage (Cloudinary)**: User avatars, Task attachments, Deliverable proofs (images, videos, documents).

---

## Proposed Schema

### 1. Users (Public Profiles)
Mirroring and extending on-chain identity.

```sql
create table users (
  wallet_address text primary key, -- The source of truth
  username text unique,
  display_name text,
  bio text,
  avatar_url text, -- Cloudinary URL
  skills text[], -- Array of strings e.g. ['rust', 'svelte', 'design']
  role text default 'user' not null, -- 'user', 'super_admin'
  
  -- Cached On-Chain Data (for sorting/filtering without RPC calls)
  cached_fair_score int default 0,
  cached_tier text default 'builder', -- 'alpha', 'trusted', 'builder'
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 2. Tasks (Gigs/Bounties)
Rich metadata for tasks that are settled on-chain.

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  creator_wallet text references users(wallet_address),
  
  -- Core Metadata
  title text not null,
  description text not null, -- Markdown allowed
  tags text[],
  budget_amount numeric, -- Display only, actual allowed amount is on-chain
  budget_token text, -- 'SOL', 'USDC'
  
  -- Status Tracking
  status text default 'draft', -- 'draft', 'open', 'in_progress', 'review', 'completed', 'cancelled'
  
  -- On-Chain References
  solana_escrow_address text, -- Populated once deployed on-chain
  transaction_signature text,
  
  created_at timestamptz default now(),
  deadline timestamptz
);
```

### 3. Applications / Proposals
Off-chain negotiation before the on-chain agreement.

```sql
create table applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id),
  applicant_wallet text references users(wallet_address),
  cover_letter text,
  bid_amount numeric,
  
  status text default 'pending', -- 'pending', 'accepted', 'rejected'
  
  created_at timestamptz default now()
);
```

### 4. Deliverables & Proofs
Evidence of work that might be too large for chain (images, zip files, etc).
Files are stored on **Cloudinary** and referenced by URL.

```sql
create table deliverables (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id),
  worker_wallet text references users(wallet_address),
  
  comment text,
  attachment_urls text[], -- Cloudinary URLs
  
  submitted_at timestamptz default now()
);
```

### 5. Indexing & Syncing
We need a strategy to keep `cached_fair_score` and `status` in sync with the blockchain.
*   **Webhook Approach**: Helius/Shyft webhooks hitting our API -> Updates DB.
*   **Lazy Sync**: When a user logs in, frontend checks on-chain score and updates DB if different.

---

## Decisions Made
1.  ~~**IPFS vs Centralized Storage**~~ → **Cloudinary** for V1. Handles avatars, task images, and deliverable attachments. Can revisit IPFS/Arweave later for permanent on-chain proofs.
2.  ~~**Privacy**~~ → **Applications are private.** Only the applicant and the task creator can see a proposal's details. The public only sees the **proposal count** per task (e.g. "12 proposals"). This will be enforced via Supabase Row Level Security (RLS).
3.  ~~**Search**~~ → **Yes, Postgres Full Text Search (pg_trgm).** Enables fuzzy, relevance-ranked search on `tasks.title` and `tasks.description` directly in Supabase — no external search service needed.

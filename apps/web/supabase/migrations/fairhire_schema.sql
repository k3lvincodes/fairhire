-- ============================================================
-- FairHire Core Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- This migration is idempotent and safe to re-run.
-- ============================================================

-- Enable pg_trgm extension for full-text search
create extension if not exists pg_trgm;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
create table if not exists users (
  wallet_address text primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  skills text[] default '{}',
  role text default 'user' not null,

  -- Cached on-chain data (avoids RPC calls for sorting/filtering)
  cached_fair_score int default 0,
  cached_tier text default 'builder',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on row changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at
  before update on users
  for each row execute function update_updated_at();

-- RLS: Public read, owner-only write
alter table users enable row level security;

drop policy if exists "Users are publicly readable" on users;
create policy "Users are publicly readable"
  on users for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can insert their own profile" on users;
create policy "Users can insert their own profile"
  on users for insert
  to authenticated
  with check (auth.jwt() ->> 'sub' = wallet_address);

drop policy if exists "Users can update their own profile" on users;
create policy "Users can update their own profile"
  on users for update
  to authenticated
  using (auth.jwt() ->> 'sub' = wallet_address);

-- ============================================================
-- 2. TASKS TABLE
-- ============================================================
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  creator_wallet text references users(wallet_address),

  -- Core metadata
  title text not null,
  description text not null,
  tags text[] default '{}',
  budget_amount numeric,
  budget_token text,

  -- Status tracking
  status text default 'draft',

  -- On-chain references
  solana_escrow_address text,
  transaction_signature text,

  created_at timestamptz default now(),
  deadline timestamptz
);

-- Full-text search index on title and description
create index if not exists tasks_title_trgm_idx on tasks using gin (title gin_trgm_ops);
create index if not exists tasks_desc_trgm_idx on tasks using gin (description gin_trgm_ops);

-- Indexes for common queries
create index if not exists tasks_creator_idx on tasks (creator_wallet);
create index if not exists tasks_status_idx on tasks (status);

-- RLS: Public read, creator-only write
alter table tasks enable row level security;

drop policy if exists "Tasks are publicly readable" on tasks;
create policy "Tasks are publicly readable"
  on tasks for select
  to anon, authenticated
  using (true);

drop policy if exists "Creators can insert tasks" on tasks;
create policy "Creators can insert tasks"
  on tasks for insert
  to authenticated
  with check (auth.jwt() ->> 'sub' = creator_wallet);

drop policy if exists "Creators can update their tasks" on tasks;
create policy "Creators can update their tasks"
  on tasks for update
  to authenticated
  using (auth.jwt() ->> 'sub' = creator_wallet);

-- ============================================================
-- 3. APPLICATIONS TABLE (Private)
-- ============================================================
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  applicant_wallet text references users(wallet_address),
  cover_letter text,
  bid_amount numeric,

  status text default 'pending',

  created_at timestamptz default now()
);

create index if not exists applications_task_idx on applications (task_id);
create index if not exists applications_applicant_idx on applications (applicant_wallet);

-- RLS: Only applicant + task creator can see
alter table applications enable row level security;

drop policy if exists "Applicant can see own applications" on applications;
create policy "Applicant can see own applications"
  on applications for select
  to authenticated
  using (auth.jwt() ->> 'sub' = applicant_wallet);

drop policy if exists "Task creator can see applications" on applications;
create policy "Task creator can see applications"
  on applications for select
  to authenticated
  using (
    exists (
      select 1 from tasks
      where tasks.id = applications.task_id
      and tasks.creator_wallet = auth.jwt() ->> 'sub'
    )
  );

drop policy if exists "Authenticated users can submit applications" on applications;
create policy "Authenticated users can submit applications"
  on applications for insert
  to authenticated
  with check (auth.jwt() ->> 'sub' = applicant_wallet);

drop policy if exists "Task creator can update application status" on applications;
create policy "Task creator can update application status"
  on applications for update
  to authenticated
  using (
    exists (
      select 1 from tasks
      where tasks.id = applications.task_id
      and tasks.creator_wallet = auth.jwt() ->> 'sub'
    )
  );

-- ============================================================
-- 4. DELIVERABLES TABLE
-- ============================================================
create table if not exists deliverables (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  worker_wallet text references users(wallet_address),

  comment text,
  attachment_urls text[] default '{}',

  submitted_at timestamptz default now()
);

create index if not exists deliverables_task_idx on deliverables (task_id);

-- RLS: Visible to task creator + worker only
alter table deliverables enable row level security;

drop policy if exists "Worker can see own deliverables" on deliverables;
create policy "Worker can see own deliverables"
  on deliverables for select
  to authenticated
  using (auth.jwt() ->> 'sub' = worker_wallet);

drop policy if exists "Task creator can see deliverables" on deliverables;
create policy "Task creator can see deliverables"
  on deliverables for select
  to authenticated
  using (
    exists (
      select 1 from tasks
      where tasks.id = deliverables.task_id
      and tasks.creator_wallet = auth.jwt() ->> 'sub'
    )
  );

drop policy if exists "Workers can submit deliverables" on deliverables;
create policy "Workers can submit deliverables"
  on deliverables for insert
  to authenticated
  with check (auth.jwt() ->> 'sub' = worker_wallet);

-- ============================================================
-- 5. PUBLIC PROPOSAL COUNTS (Security Definer — bypasses RLS safely)
-- ============================================================
-- This function runs with elevated privileges but ONLY returns
-- the count per task — no private application data is exposed.
create or replace function get_proposal_count(p_task_id uuid)
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from applications where task_id = p_task_id;
$$;

-- Grant execute to anon so unauthenticated users can see counts
grant execute on function get_proposal_count(uuid) to anon;
grant execute on function get_proposal_count(uuid) to authenticated;

-- ============================================================
-- Done! All tables created with RLS enforced.
-- ============================================================

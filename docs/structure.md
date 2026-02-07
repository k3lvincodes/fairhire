apps/
  web/                # SvelteKit frontend (the dApp UI)
  api/                # Backend API (auth, FairScore proxy, webhooks)
  indexer/            # Off-chain indexer + event workers (Solana -> DB)
  admin/              # Optional: internal moderation dashboard

programs/
  fairhire_vault/     # Solana Anchor program (smart contract)
  sdk/                # Shared TS client for contract calls + helpers

packages/
  ui/                 # Shared UI components/design system (optional)
  config/             # Shared lint/tsconfig/tailwind configs
  types/              # Shared types (Task, VaultState, events, DTOs)
  utils/              # Shared utility functions (formatting, time, etc.)

infra/
  supabase/           # DB migrations, policies, seed scripts
  vercel/             # deployment config (if needed)
  docker/             # docker compose for local dev (optional)
  scripts/            # dev scripts (reset db, seed, run localnet)

docs/
  product/            # PRD, UX flows, user stories
  architecture/       # system design, diagrams, data models
  contracts/          # program specs, account schema, audits checklist
  api/                # REST/GraphQL docs, endpoints, auth flow
  runbooks/           # deployment + incident procedures
  decisions/          # ADRs (architecture decision records)

tests/
  e2e/                # Playwright/Cypress UI tests
  integration/        # API + indexer integration tests
  contracts/          # Anchor tests (or keep under programs)

.github/
  workflows/          # CI/CD pipelines

tooling/
  mocks/              # mock FairScale API, fake RPC, test fixtures
  fixtures/           # seed data: tasks, users, events

README.md
LICENSE

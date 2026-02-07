# FairHire

## 1. Executive Summary
FairHire is a reputation-gated task marketplace built on Solana. It fundamentally reimagines freelance economics by replacing slow, distrustful escrow models with reputation-backed instant liquidity.
By integrating FairScale’s FairScore, FairHire allows high-reputation workers to bypass escrow delays entirely. If you have a proven on-chain reputation, you get paid the second you complete the work. If you don't, you wait.
Mission: To make trust a transactable asset, enabling instant, friction-free work for the Web3 economy.

## 2. The Problem: The Escrow Trap
Current freelance platforms (Upwork, Bounties, Fiverr) operate on a "Low Trust" default.
Slow Liquidity: Workers wait days or weeks for funds to be released from escrow.
High Friction: Every transaction requires manual approval, disputes, and middleman intervention.
Zero Carry-Over: A worker’s reputation is trapped in a silo (e.g., Upwork stars don’t help you on Bounties).
In Web3, we have the technology to verify trust instantly, yet we still use Web2 escrow models.

## 3. The Solution: Smart Escrow
FairHire introduces a Dynamic Settlement Engine that adjusts payment terms based on the worker’s FairScore.

| Worker Tier | FairScore | Payment Terms |
| :--- | :--- | :--- |
| **The Alpha (Sovereign)** | 85+ | **Instant Auto-Pay**<br>Reputation acts as collateral. Funds release immediately upon submission. |
| **Trusted** | 70–84 | **Fast Track**<br>12-hour automated dispute window. |
| **Builder** | < 70 | **Standard Escrow**<br>Funds locked until manual approval by the poster. |

This model incentivizes users to maintain a high FairScore across the entire Solana ecosystem, creating a positive feedback loop for the FairScale protocol.

## 4. How It Works (The Flow)
### Step 1: The Deposit (Poster)
A Task Poster creates a bounty (e.g., "Fix this Rust error") and deposits USDC into the FairHire Smart Vault.
Constraint: The task must have a fixed price and a strict time limit.

### Step 2: The Gate (FairScale API)
A worker connects their wallet. FairHire queries the FairScale API to fetch their real-time FairScore.
Logic: If FairScore is below the task minimum, the worker is blocked from claiming.

### Step 3: The Execution (Worker)
**Scenario A (High Score):** The worker submits the deliverable (e.g., a PR link). The smart contract checks the auto_release flag and instantly transfers the USDC to the worker’s wallet.
**Scenario B (Low Score):** The worker submits the deliverable. The funds remain in the vault. The poster is notified to review and manually sign the release transaction.

### Step 4: The Accountability
If a high-score worker abuses the instant-pay system (e.g., spam submissions):
Severe Reputation Slash: The worker’s FairScore is heavily reduced via a negative signal sent to FairScale.
Platform Ban: The wallet is blacklisted from FairHire.

## 5. Technical Architecture
FairHire is a production-grade dApp optimized for speed and security on Solana.
- **Blockchain:** Solana Mainnet
- **Smart Contracts:** Rust (Anchor Framework)
  - Core Program: `fairhire_vault` — handles deposits, locking, and conditional releases
- **Identity & Reputation:**
  - FairScale API — real-time FairScore lookup
  - Wallets — Phantom, Backpack (via Solana Wallet Adapter)
- **Frontend:** Next.js + Tailwind CSS (hosted on Vercel)
- **Backend (Off-Chain Indexer):** Supabase (PostgreSQL)
  - Stores task metadata to reduce on-chain rent costs
  - Indexes TaskEvents for analytics and dashboards

## 6. Core Use Cases
### 🟢 The “Whale” Developer (Instant Fixes)
**User:** Alice (FairScore: 92)
**Need:** Urgent bug fix for a DeFi protocol
**Behavior:** Alice sees a $500 bounty, fixes it in 20 minutes, submits the PR, and receives USDC instantly.
**Value:** Speed and dignity for senior talent.

### 🟡 The “Grinder” (Trust Building)
**User:** Bob (FairScore: 45)
**Need:** Build a reputation
**Behavior:** Bob completes smaller tasks under escrow. As he succeeds, his FairScore rises, eventually unlocking instant pay.
**Value:** A clear, gamified path to professional freedom.

## 7. Business Model & Sustainability
- **Revenue:** 5% protocol fee on all completed task payouts
- **Token Utility:** Users can stake FAIR tokens to temporarily boost their trust tier, creating demand for the FairScale token

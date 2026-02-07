# FairHire Frontend Design Spec (SvelteKit)

This document defines the exact, production-ready frontend specification for FairHire. All items listed are required unless explicitly stated otherwise. There are no optional paths in this version.

---

## 0) Frontend Principles

### 0.1 Wallet = Account

* A connected wallet is the sole identity mechanism.
* No email, password, or username flows exist.
* Off-chain authentication is established via message signing only.
* Signing is never used to move funds.

**UI Rules**

* Public pages are accessible without a wallet.
* All `/app/*` routes must render one of two states:

  * Disconnected: clear “Connect Wallet” call-to-action.
  * Connected: wallet address (shortened) and FairScore visible.
* Message-signing modal appears only when required for:

  * saving preferences
  * submitting work
  * enabling notifications

**Copy Rules**

* Every signing prompt must state:

  * Signing is free
  * No spending permission is granted

---

### 0.2 Reputation Always Visible

* FairScore is treated as a primary navigation element.
* Users must immediately understand eligibility for any task.

**Requirements**

* FairScore must appear in:

  * Top navigation
  * Task cards
  * Task detail action panel
  * Claim task modal (score snapshot at claim time)

**Components**

* `FairScoreBadge` with tooltip
* `TierBadge` with plain-language explanation

**Locked-State Rules**

* Any locked action must display:

  * Required FairScore
  * User’s current FairScore
  * Exact reason for restriction

---

### 0.3 Stateful and Explainable Actions

* All actions transition a task between explicit states.
* The current state and next possible state must always be visible.

**Task State Timeline**

* Created
* Claimed
* Submitted
* In Review / Dispute Window
* Released / Disputed / Expired

**Button Rules**

* No action button may appear without:

  * a clear enable/disable reason
  * a visible description of what will happen next

---

### 0.4 Settlement Terms Are Explicit

* Settlement rules must be visible before a claim is possible.
* Posters must confirm settlement behavior during task creation.

**Required Component**

* `SettlementTermsCard` rendered in:

  * Task card (summary)
  * Task detail page (full)
  * Claim task modal (confirmation)
  * Post task flow (poster confirmation)

**Language**

* Instant Auto-Pay: funds release immediately upon submission
* Fast Track: 12-hour challenge window before release
* Escrow: manual approval required

---

### 0.5 Optimistic UI with Confirmation

* UI updates immediately after user action.
* Blockchain confirmation status is shown clearly and truthfully.

**Transaction Flow**

* Immediate optimistic UI update
* Toast lifecycle:

  * Sent
  * Confirmed
  * Finalized

**Failure Handling**

* Optimistic changes are reverted
* Error modal displays:

  * readable explanation
  * retry option
  * common recovery steps

---

## 1) App Structure

### 1.1 Routes

* `/` — Marketing landing page
* `/app` — Authenticated app shell
* `/app/tasks` — Task feed and discovery
* `/app/tasks/[id]` — Task detail and lifecycle actions
* `/app/post` — Create task and deposit funds
* `/app/dashboard` — Worker and poster dashboards
* `/app/profile` — Reputation and identity
* `/app/settings` — Preferences and notifications
* `/app/admin` — Moderation and dispute resolution

---

### 1.2 Layout Layers

**Public Layout (`+layout.svelte`)**

* Minimal header and footer
* No wallet requirement

**App Layout (`/app/+layout.svelte`)**

* Loads:

  * wallet state
  * FairScore
  * signed session
  * notification count
* Provides:

  * top navigation
  * side or bottom navigation
  * global modal portal
  * global toaster

---

## 2) Global UI Shell

### 2.1 Top Navigation

**Left**

* FairHire logo linking to `/app/tasks`
* Network badge with tooltip

**Center**

* Search input with debounced query

**Right**

* FairScoreBadge
* Wallet connect button or wallet menu
* Notification bell

**Wallet Menu**

* Wallet address (copyable)
* USDC and SOL balance
* View profile
* Switch network
* Disconnect wallet

---

### 2.2 Navigation

**Desktop Side Navigation**

* Tasks
* Post Task
* Dashboard
* Profile
* Settings
* Admin (authorized users only)

**Mobile Bottom Navigation**

* Tasks
* Post Task (primary action)
* Dashboard
* Profile

---

## 3) Core Pages

### 3.1 Landing Page

**Purpose**

* Communicate value proposition in under 15 seconds

**Sections**

* Hero with headline and launch CTA
* Three pillars: Instant Pay, Dynamic Escrow, On-chain Proof
* Four-step workflow explanation
* Tier system overview
* Security and anti-abuse guarantees
* Footer with documentation and legal links

---

### 3.2 Task Feed

**Layout**

* Filters panel (left)
* Task list (center)
* User status panel (right)

**Task Card Requirements**

* Title and short description
* Price and fee preview
* Settlement badge
* Deadline countdown
* Minimum FairScore
* Claim button with gated states

---

### 3.3 Task Detail

**Core Sections**

* Task header with settlement badge and pricing
* Settlement terms card
* Description and acceptance checklist
* Activity timeline
* Sticky action panel

**Action Panel Logic**

* Actions vary by role, task state, and settlement model
* Only valid actions are shown

---

### 3.4 Post Task

**Form Sections**

* Basic task details
* Fixed-price and deadline enforcement
* Reputation gate selection
* Description and acceptance criteria
* USDC deposit flow

---

### 3.5 Dashboard

**Worker View**

* Active tasks
* Submitted tasks
* Completed tasks
* Reputation impact log

**Poster View**

* Active and claimed tasks
* Review and dispute queues
* Completion analytics

---

### 3.6 Profile

* FairScore gauge and tier
* Reputation history
* Work statistics
* Flags and restrictions

---

### 3.7 Settings

* Notification rules
* Display preferences
* Wallet preferences
* Safety controls

---

## 4) Modals

All modals are mandatory where applicable:

* Wallet connection and signing
* Claim task confirmation
* Submission flow
* Deposit and approval
* Dispute and release
* Transaction confirmation and errors

---

## 5) Component Library

Components are grouped into:

* Reputation
* Settlement
* Task
* System

Each component must be reusable and state-driven.

---

## 6) UI State Rules

* Every button state must be explainable
* Locked states must show required conditions
* Instant-pay abuse warnings are mandatory

---

## 7) Data and State Management

* Wallet, session, FairScore, tasks, and transactions are isolated state domains
* FairScore caching: 10–30 seconds
* Task feed caching: 30–60 seconds
* Real-time updates via Supabase subscriptions

---

## 8) Mobile Requirements

* Bottom navigation always visible
* Sticky action panels
* Full-screen modals
* No desktop-only interactions

---

## 9) Visual Design

* Dark neutral base
* Clear status colors per settlement type
* Numeric values use tabular typography

---

## 10) Completion Criteria

The frontend is complete when:

* All task states are represented
* All settlement tiers function end-to-end
* Gating logic is consistent across all views
* Error handling is reliable and understandable
* Mobile experience is fully functional

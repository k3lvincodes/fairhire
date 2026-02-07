<script lang="ts">
  import { page } from '$app/stores';
  
  // Mock task data
  let task = {
    id: $page.params.id,
    title: 'Fix Rust compilation error in DeFi protocol',
    description: 'We need someone to debug and fix a compilation error in our Solana program. The error occurs when building with anchor build. Must have experience with Anchor framework.',
    price: 500,
    settlement: 'instant',
    deadline: '2 hours remaining',
    minScore: 85,
    poster: '0x12...3456',
    status: 'open',
    requirements: [
      'Fix compilation error',
      'Ensure all tests pass',
      'Submit PR with fix'
    ]
  };
</script>

<div class="max-w-4xl mx-auto">
  <!-- Back Button -->
  <a href="/app/tasks" class="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    Back to Tasks
  </a>
  
  <!-- Task Header -->
  <div class="bg-neutral-800/50 rounded-xl p-6 border border-neutral-800 mb-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">{task.title}</h1>
        <div class="flex items-center gap-3 mt-2 text-neutral-400">
          <span>Posted by {task.poster}</span>
          <span>•</span>
          <span>{task.deadline}</span>
        </div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-white">${task.price}</div>
        {#if task.settlement === 'instant'}
          <span class="px-3 py-1 text-sm font-medium bg-emerald-500/20 text-emerald-400 rounded-full">Instant Pay</span>
        {:else if task.settlement === 'fast'}
          <span class="px-3 py-1 text-sm font-medium bg-amber-500/20 text-amber-400 rounded-full">Fast Track</span>
        {:else}
          <span class="px-3 py-1 text-sm font-medium bg-neutral-500/20 text-neutral-400 rounded-full">Escrow</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Settlement Terms Card -->
  <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-6">
    <div class="flex items-center gap-3 mb-3">
      <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      <h3 class="font-semibold text-emerald-400">Instant Auto-Pay</h3>
    </div>
    <p class="text-sm text-neutral-300">
      Your FairScore of <strong>92</strong> qualifies for instant payment. Funds will be released immediately upon submission.
    </p>
  </div>

  <!-- Description -->
  <section class="mb-6">
    <h2 class="text-lg font-semibold mb-3">Description</h2>
    <p class="text-neutral-300 leading-relaxed">{task.description}</p>
  </section>

  <!-- Requirements -->
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-3">Acceptance Criteria</h2>
    <ul class="space-y-2">
      {#each task.requirements as req}
        <li class="flex items-center gap-3 text-neutral-300">
          <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
          {req}
        </li>
      {/each}
    </ul>
  </section>

  <!-- Action Panel -->
  <div class="sticky bottom-4 md:bottom-6 bg-neutral-900/95 backdrop-blur-sm border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
    <div>
      <div class="text-sm text-neutral-400">Minimum FairScore Required</div>
      <div class="font-semibold">{task.minScore}+ (Your score: 92 ✓)</div>
    </div>
    <button class="px-6 py-3 bg-white text-neutral-900 font-bold rounded-lg hover:bg-neutral-200 transition-colors">
      Claim Task
    </button>
  </div>
</div>

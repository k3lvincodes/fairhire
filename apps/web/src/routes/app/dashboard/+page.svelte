<h1 class="text-2xl font-bold mb-6">Dashboard</h1>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Worker View -->
  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-neutral-300">My Work</h2>
    
    <!-- Active Task -->
    <div class="bg-neutral-800/50 rounded-xl border border-neutral-800 p-5">
      <div class="flex items-center gap-2 text-sm text-amber-400 mb-3">
        <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        In Progress
      </div>
      <h3 class="font-medium mb-2">Fix Rust compilation error in DeFi protocol</h3>
      <div class="flex items-center justify-between text-sm">
        <span class="text-neutral-400">1h 45m remaining</span>
        <span class="font-semibold">$500</span>
      </div>
      <button class="w-full mt-4 py-2 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-200 transition-colors">
        Submit Work
      </button>
    </div>

    <!-- Empty State -->
    <div class="bg-neutral-800/30 p-6 rounded-xl border border-dashed border-neutral-700 text-center">
      <p class="text-neutral-500 mb-3">Looking for more work?</p>
      <a href="/app/tasks" class="inline-flex items-center gap-2 text-white hover:underline">
        Browse Tasks
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
    </div>
  </section>

  <!-- Poster View -->
  <section class="space-y-4">
    <h2 class="text-xl font-semibold text-neutral-300">My Bounties</h2>
    
    <!-- Pending Review -->
    <div class="bg-neutral-800/50 rounded-xl border border-neutral-800 p-5">
      <div class="flex items-center gap-2 text-sm text-cyan-400 mb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        Awaiting Review
      </div>
      <h3 class="font-medium mb-2">Design landing page for NFT marketplace</h3>
      <div class="flex items-center justify-between text-sm mb-4">
        <span class="text-neutral-400">Submitted by 0xAB...CD12</span>
        <span class="font-semibold">$1,200</span>
      </div>
      <div class="flex gap-2">
        <button class="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
          Approve
        </button>
        <button class="flex-1 py-2 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition-colors">
          Dispute
        </button>
      </div>
    </div>

    <!-- Create New -->
    <a href="/app/post" class="block bg-neutral-800/30 p-6 rounded-xl border border-dashed border-neutral-700 text-center hover:border-neutral-600 transition-colors">
      <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-800 flex items-center justify-center">
        <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      </div>
      <p class="text-white font-medium">Post New Task</p>
    </a>
  </section>
</div>

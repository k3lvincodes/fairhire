<script lang="ts">
  import { user } from '$lib/stores/wallet';
  import ClaimTaskModal from '$lib/components/ClaimTaskModal.svelte';
  
  // Filter state
  let showFilters = false;
  let filters = {
    settlement: 'all',
    minPrice: 0,
    maxPrice: 10000,
    eligible: false
  };
  let sortBy = 'newest';
  
  // Modal state
  let claimModalOpen = false;
  let selectedTask: typeof tasks[0] | null = null;
  
  // Placeholder for task data - will be replaced with store
  let tasks = [
    { id: '1', title: 'Fix Rust compilation error in DeFi protocol', price: 500, settlement: 'instant' as const, deadline: '2h', minScore: 85, poster: '0x12...3456' },
    { id: '2', title: 'Design landing page for NFT marketplace', price: 1200, settlement: 'fast' as const, deadline: '3d', minScore: 70, poster: '0xAB...CD12' },
    { id: '3', title: 'Write unit tests for Solana program', price: 300, settlement: 'escrow' as const, deadline: '1d', minScore: 50, poster: '0x34...5678' },
    { id: '4', title: 'Audit smart contract for vulnerabilities', price: 2000, settlement: 'instant' as const, deadline: '5d', minScore: 90, poster: '0x99...EF01' },
    { id: '5', title: 'Create Discord bot for NFT alerts', price: 150, settlement: 'escrow' as const, deadline: '2d', minScore: 40, poster: '0x56...7890' },
  ];
  
  $: filteredTasks = tasks.filter(task => {
    if (filters.settlement !== 'all' && task.settlement !== filters.settlement) return false;
    if (task.price < filters.minPrice || task.price > filters.maxPrice) return false;
    if (filters.eligible && task.minScore > $user.fairScore) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'price-low') return a.price - b.price;
    return 0; // newest - keep original order
  });
  
  function openClaimModal(task: typeof tasks[0]) {
    selectedTask = task;
    claimModalOpen = true;
  }
</script>

<div class="flex gap-6">
  <!-- Filters Panel (Desktop) -->
  <aside class="w-64 flex-shrink-0 hidden lg:block">
    <div class="sticky top-4 space-y-6">
      <!-- Settlement Filter -->
      <div>
        <h3 class="text-sm font-medium text-neutral-400 mb-3">Settlement Type</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" bind:group={filters.settlement} value="all" class="text-white" />
            <span class="text-sm">All Types</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" bind:group={filters.settlement} value="instant" class="text-emerald-500" />
            <span class="text-sm text-emerald-400">Instant Pay</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" bind:group={filters.settlement} value="fast" class="text-amber-500" />
            <span class="text-sm text-amber-400">Fast Track</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" bind:group={filters.settlement} value="escrow" class="text-neutral-500" />
            <span class="text-sm text-neutral-400">Escrow</span>
          </label>
        </div>
      </div>
      
      <!-- Price Range -->
      <div>
        <h3 class="text-sm font-medium text-neutral-400 mb-3">Price Range</h3>
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <span class="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
            <input 
              type="number" 
              bind:value={filters.minPrice}
              class="w-full bg-neutral-800 rounded-lg pl-6 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
              placeholder="Min"
            />
          </div>
          <span class="text-neutral-500">-</span>
          <div class="relative flex-1">
            <span class="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
            <input 
              type="number" 
              bind:value={filters.maxPrice}
              class="w-full bg-neutral-800 rounded-lg pl-6 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      
      <!-- Eligible Only -->
      <label class="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={filters.eligible} class="rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500" />
        <div>
          <div class="text-sm font-medium">Eligible Only</div>
          <div class="text-xs text-neutral-500">Score ≥ minimum required</div>
        </div>
      </label>
      
      <button 
        on:click={() => { filters = { settlement: 'all', minPrice: 0, maxPrice: 10000, eligible: false }; }}
        class="w-full py-2 text-sm text-neutral-400 hover:text-white transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex-1">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold">Task Feed</h1>
        <span class="text-sm text-neutral-500">{filteredTasks.length} tasks</span>
      </div>
      <div class="flex items-center gap-2">
        <button 
          on:click={() => showFilters = !showFilters}
          class="lg:hidden px-3 py-1.5 text-sm bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          Filters
        </button>
        <select 
          bind:value={sortBy}
          class="px-3 py-1.5 text-sm bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>
    </div>

    <!-- User Status Panel -->
    <div class="mb-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-800 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold">
          {$user.fairScore}
        </div>
        <div>
          <div class="font-medium">Your FairScore: {$user.fairScore}</div>
          <div class="text-sm text-neutral-400 capitalize">{$user.tier} Tier - {$user.tier === 'alpha' ? 'Instant Pay eligible' : $user.tier === 'trusted' ? 'Fast Track eligible' : 'Escrow only'}</div>
        </div>
      </div>
      <a href="/app/profile" class="text-sm text-neutral-400 hover:text-white transition-colors">View Profile →</a>
    </div>

    <!-- Task Grid -->
    <div class="grid gap-4">
      {#each filteredTasks as task}
        <div class="p-5 border border-neutral-800 rounded-xl hover:border-neutral-700 hover:bg-neutral-800/30 transition-all">
          <div class="flex items-start justify-between gap-4">
            <a href="/app/tasks/{task.id}" class="flex-1 block">
              <h3 class="font-medium text-lg hover:text-white transition-colors">{task.title}</h3>
              <div class="flex items-center gap-3 mt-2 text-sm text-neutral-400">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {task.deadline}
                </span>
                <span>•</span>
                <span class="{task.minScore <= $user.fairScore ? 'text-emerald-400' : 'text-red-400'}">
                  Min Score: {task.minScore} {task.minScore <= $user.fairScore ? '✓' : '✗'}
                </span>
                <span>•</span>
                <span>5% fee: ${(task.price * 0.05).toFixed(0)}</span>
              </div>
            </a>
            <div class="text-right">
              <div class="text-xl font-bold text-white">${task.price}</div>
              <div class="mt-1">
                {#if task.settlement === 'instant'}
                  <span class="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">Instant Pay</span>
                {:else if task.settlement === 'fast'}
                  <span class="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full">Fast Track</span>
                {:else}
                  <span class="px-2 py-0.5 text-xs font-medium bg-neutral-500/20 text-neutral-400 rounded-full">Escrow</span>
                {/if}
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-neutral-700"></div>
              <span class="text-sm text-neutral-500">Posted by {task.poster}</span>
            </div>
            <button 
              on:click|preventDefault={() => openClaimModal(task)}
              disabled={task.minScore > $user.fairScore}
              class="px-4 py-1.5 text-sm font-medium bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {task.minScore > $user.fairScore ? 'Not Eligible' : 'Claim'}
            </button>
          </div>
        </div>
      {/each}
      
      {#if filteredTasks.length === 0}
        <div class="text-center py-12 text-neutral-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <p>No tasks match your filters</p>
          <button 
            on:click={() => { filters = { settlement: 'all', minPrice: 0, maxPrice: 10000, eligible: false }; }}
            class="mt-2 text-sm text-white hover:underline"
          >
            Clear filters
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if selectedTask}
  <ClaimTaskModal bind:open={claimModalOpen} task={selectedTask} />
{/if}

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
    <div class="sticky top-4 space-y-8">
      <!-- Settlement Filter -->
      <div>
        <h3 class="text-xs font-bold font-display uppercase tracking-wider text-brand-white/50 mb-4">Settlement Type</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer group">
            <input type="radio" bind:group={filters.settlement} value="all" class="text-brand-purple focus:ring-brand-purple bg-brand-black border-brand-white/20" />
            <span class="text-sm text-brand-white group-hover:text-brand-purple transition-colors">All Types</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input type="radio" bind:group={filters.settlement} value="instant" class="text-emerald-500 focus:ring-emerald-500 bg-brand-black border-brand-white/20" />
            <span class="text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors">Instant Pay</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input type="radio" bind:group={filters.settlement} value="fast" class="text-amber-500 focus:ring-amber-500 bg-brand-black border-brand-white/20" />
            <span class="text-sm text-amber-400 group-hover:text-amber-300 transition-colors">Fast Track</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input type="radio" bind:group={filters.settlement} value="escrow" class="text-brand-white/40 focus:ring-brand-white/40 bg-brand-black border-brand-white/20" />
            <span class="text-sm text-brand-white/60 group-hover:text-brand-white transition-colors">Escrow</span>
          </label>
        </div>
      </div>
      
      <!-- Price Range -->
      <div>
        <h3 class="text-xs font-bold font-display uppercase tracking-wider text-brand-white/50 mb-4">Price Range</h3>
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/30 text-sm">$</span>
            <input 
              type="number" 
              bind:value={filters.minPrice}
              class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg pl-6 pr-2 py-2 text-sm text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30"
              placeholder="Min"
            />
          </div>
          <span class="text-brand-white/30">-</span>
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/30 text-sm">$</span>
            <input 
              type="number" 
              bind:value={filters.maxPrice}
              class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg pl-6 pr-2 py-2 text-sm text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      
      <!-- Eligible Only -->
      <label class="flex items-center gap-3 cursor-pointer group p-3 rounded-lg bg-brand-white/5 border border-brand-white/5 hover:border-brand-white/10 transition-colors">
        <input type="checkbox" bind:checked={filters.eligible} class="rounded bg-brand-black border-brand-white/20 text-emerald-500 focus:ring-emerald-500" />
        <div>
          <div class="text-sm font-medium text-brand-white">Eligible Only</div>
          <div class="text-[10px] text-brand-white/40 uppercase tracking-wide">Score ≥ minimum required</div>
        </div>
      </label>
      
      <button 
        on:click={() => { filters = { settlement: 'all', minPrice: 0, maxPrice: 10000, eligible: false }; }}
        class="w-full py-2.5 text-sm text-brand-white/40 hover:text-brand-white hover:bg-brand-white/5 rounded-lg transition-all font-medium border border-transparent hover:border-brand-white/5"
      >
        Clear Filters
      </button>
    </div>
  </aside>

  <!-- Mobile Filters Overlay -->
  {#if showFilters}
    <div class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div class="absolute inset-0 bg-brand-black/80 backdrop-blur-sm" on:click={() => showFilters = false}></div>
      <div class="absolute inset-y-0 right-0 max-w-xs w-full bg-brand-black border-l border-brand-white/10 shadow-2xl p-6 overflow-y-auto">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-bold font-display text-brand-white">Filters</h2>
          <button on:click={() => showFilters = false} class="text-brand-white/50 hover:text-brand-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-8">
          <!-- Settlement Filter -->
          <div>
            <h3 class="text-xs font-bold font-display uppercase tracking-wider text-brand-white/50 mb-4">Settlement Type</h3>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" bind:group={filters.settlement} value="all" class="text-brand-purple focus:ring-brand-purple bg-brand-black border-brand-white/20" />
                <span class="text-sm text-brand-white">All Types</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" bind:group={filters.settlement} value="instant" class="text-emerald-500 focus:ring-emerald-500 bg-brand-black border-brand-white/20" />
                <span class="text-sm text-emerald-400">Instant Pay</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" bind:group={filters.settlement} value="fast" class="text-amber-500 focus:ring-amber-500 bg-brand-black border-brand-white/20" />
                <span class="text-sm text-amber-400">Fast Track</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" bind:group={filters.settlement} value="escrow" class="text-brand-white/40 focus:ring-brand-white/40 bg-brand-black border-brand-white/20" />
                <span class="text-sm text-brand-white/60">Escrow</span>
              </label>
            </div>
          </div>
          
          <!-- Price Range -->
          <div>
            <h3 class="text-xs font-bold font-display uppercase tracking-wider text-brand-white/50 mb-4">Price Range</h3>
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/30 text-sm">$</span>
                <input 
                  type="number" 
                  bind:value={filters.minPrice}
                  class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg pl-6 pr-2 py-2 text-sm text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30"
                  placeholder="Min"
                />
              </div>
              <span class="text-brand-white/30">-</span>
              <div class="relative flex-1">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/30 text-sm">$</span>
                <input 
                  type="number" 
                  bind:value={filters.maxPrice}
                  class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg pl-6 pr-2 py-2 text-sm text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          
          <!-- Eligible Only -->
          <label class="flex items-center gap-3 cursor-pointer group p-3 rounded-lg bg-brand-white/5 border border-brand-white/5">
            <input type="checkbox" bind:checked={filters.eligible} class="rounded bg-brand-black border-brand-white/20 text-emerald-500 focus:ring-emerald-500" />
            <div>
              <div class="text-sm font-medium text-brand-white">Eligible Only</div>
              <div class="text-[10px] text-brand-white/40 uppercase tracking-wide">Score ≥ minimum required</div>
            </div>
          </label>
          
          <button 
            on:click={() => { filters = { settlement: 'all', minPrice: 0, maxPrice: 10000, eligible: false }; showFilters = false; }}
            class="w-full py-3 text-sm text-brand-brand-black bg-brand-white hover:bg-brand-white/90 rounded-lg transition-all font-bold"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="flex-1">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <h1 class="text-3xl font-bold font-display text-brand-white">Task Feed</h1>
        <span class="px-2 py-1 bg-brand-white/10 rounded text-xs text-brand-white/60 font-mono">{filteredTasks.length} tasks</span>
      </div>
      <div class="flex items-center gap-2">
        <button 
          on:click={() => showFilters = !showFilters}
          class="lg:hidden px-3 py-1.5 text-sm bg-brand-white/5 rounded-lg hover:bg-brand-white/10 transition-colors flex items-center gap-2 text-brand-white"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          Filters
        </button>
        <select 
          bind:value={sortBy}
          class="px-4 py-2 text-sm bg-brand-white/5 border border-brand-white/10 rounded-lg hover:bg-brand-white/10 transition-colors focus:outline-none text-brand-white focus:border-brand-purple/50 appearance-none cursor-pointer"
        >
          <option value="newest" class="bg-brand-black">Newest</option>
          <option value="price-high" class="bg-brand-black">Price: High to Low</option>
          <option value="price-low" class="bg-brand-black">Price: Low to High</option>
        </select>
      </div>
    </div>

    <!-- User Status Panel -->
    <div class="mb-8 p-5 bg-brand-white/5 rounded-xl border border-brand-white/10 flex items-center justify-between backdrop-blur-sm">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(108,59,170,0.5)] border-2 border-brand-white/10">
          {$user.fairScore}
        </div>
        <div>
          <div class="font-bold text-brand-white text-lg">Your FairScore: {$user.fairScore}</div>
          <div class="text-sm text-brand-white/50 space-x-2">
            <span class="font-mono text-emerald-400">{$user.tier} Tier</span>
            <span>•</span>
            <span class="italic">{$user.tier === 'alpha' ? 'Instant Pay eligible' : $user.tier === 'trusted' ? 'Fast Track eligible' : 'Escrow only'}</span>
          </div>
        </div>
      </div>
      <a href="/app/profile" class="text-sm font-medium text-brand-white/60 hover:text-brand-purple transition-colors flex items-center gap-1 group">
        View Profile 
        <span class="group-hover:translate-x-0.5 transition-transform">→</span>
      </a>
    </div>

    <!-- Task Grid -->
    <div class="grid gap-4">
      {#each filteredTasks as task}
        <div class="p-6 border border-brand-white/5 rounded-xl bg-brand-white/[0.02] hover:bg-brand-white/[0.04] hover:border-brand-white/10 transition-all group relative overflow-hidden">
          <!-- Hover Glow Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-brand-purple/0 via-brand-purple/5 to-brand-purple/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <div class="relative flex items-start justify-between gap-6">
            <a href="/app/tasks/{task.id}" class="flex-1 block">
              <h3 class="font-bold text-xl text-brand-white group-hover:text-brand-purple transition-colors font-display tracking-tight">{task.title}</h3>
              <div class="flex items-center gap-4 mt-3 text-sm text-brand-white/50">
                <span class="flex items-center gap-1.5 bg-brand-white/5 px-2 py-0.5 rounded text-xs font-mono">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {task.deadline}
                </span>
                <span class="flex items-center gap-1.5 {task.minScore <= $user.fairScore ? 'text-emerald-400' : 'text-red-400'} bg-brand-white/5 px-2 py-0.5 rounded text-xs font-mono">
                  Score: {task.minScore} {task.minScore <= $user.fairScore ? '✓' : '✗'}
                </span>
                <span class="text-xs">Est. Fee: <span class="text-brand-white/70 font-mono">${(task.price * 0.05).toFixed(0)}</span></span>
              </div>
            </a>
            <div class="text-right flex flex-col items-end">
              <div class="text-2xl font-bold font-mono text-brand-white">${task.price}</div>
              <div class="mt-2">
                {#if task.settlement === 'instant'}
                  <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Instant Pay</span>
                {:else if task.settlement === 'fast'}
                  <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">Fast Track</span>
                {:else}
                  <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-white/5 text-brand-white/40 border border-brand-white/10 rounded-full">Escrow</span>
                {/if}
              </div>
            </div>
          </div>
          <div class="mt-5 pt-5 border-t border-brand-white/5 flex items-center justify-between relative">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-white/10 to-brand-white/5 border border-brand-white/10 flex items-center justify-center text-xs font-bold text-brand-white/40">
                {task.poster.substring(0, 2)}
              </div>
              <span class="text-xs font-mono text-brand-white/40">Posted by <span class="text-brand-white/60">{task.poster}</span></span>
            </div>
            <button 
              on:click|preventDefault={() => openClaimModal(task)}
              disabled={task.minScore > $user.fairScore}
              class="px-5 py-2 text-sm font-bold bg-brand-white text-brand-black rounded-lg hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {task.minScore > $user.fairScore ? 'Score Too Low' : 'Claim Task'}
            </button>
          </div>
        </div>
      {/each}
      
      {#if filteredTasks.length === 0}
        <div class="text-center py-20 text-brand-white/30 bg-brand-white/[0.02] rounded-xl border border-dashed border-brand-white/10">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-white/5 flex items-center justify-center">
            <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p class="text-lg font-medium text-brand-white/50">No tasks match your filters</p>
          <button 
            on:click={() => { filters = { settlement: 'all', minPrice: 0, maxPrice: 10000, eligible: false }; }}
            class="mt-4 text-sm text-brand-purple hover:text-brand-purple-hover hover:underline transition-colors font-medium"
          >
            Clear all filters
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

{#if selectedTask}
  <ClaimTaskModal bind:open={claimModalOpen} task={selectedTask} />
{/if}

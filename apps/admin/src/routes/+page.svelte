<script lang="ts">
  // Mock dispute data
  let disputes = [
    { 
      id: '1', 
      taskId: 'T-001', 
      taskTitle: 'Fix Rust compilation error', 
      poster: '0x12...3456',
      worker: '0xAB...CD12',
      amount: 500,
      status: 'pending',
      createdAt: '2 hours ago',
      reason: 'Worker submitted incomplete work that does not meet requirements'
    },
    { 
      id: '2', 
      taskId: 'T-015', 
      taskTitle: 'Design landing page mockups', 
      poster: '0x78...90EF',
      worker: '0x34...5678',
      amount: 1200,
      status: 'under_review',
      createdAt: '1 day ago',
      reason: 'Poster claims design does not match specifications'
    }
  ];
  
  let flaggedUsers = [
    { address: '0xBA..SPAM', reason: 'Multiple spam submissions', reports: 5, fairScore: 23 },
    { address: '0x99..SCAM', reason: 'Suspected payment fraud', reports: 3, fairScore: 45 }
  ];
  
  let stats = {
    totalDisputes: 24,
    pendingReview: 8,
    resolvedToday: 5,
    flaggedUsers: 12
  };
</script>

<div class="min-h-screen bg-neutral-950 text-white">
  <!-- Admin Header -->
  <header class="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="font-bold text-xl">FairHire</span>
        <span class="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">ADMIN</span>
      </div>
      <nav class="flex items-center gap-6 text-sm">
        <a href="/" class="text-white">Dashboard</a>
        <a href="/disputes" class="text-neutral-400 hover:text-white transition-colors">Disputes</a>
        <a href="/users" class="text-neutral-400 hover:text-white transition-colors">Users</a>
        <a href="/settings" class="text-neutral-400 hover:text-white transition-colors">Settings</a>
      </nav>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-8">
    <h1 class="text-2xl font-bold mb-8">Admin Dashboard</h1>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
        <div class="text-3xl font-bold">{stats.totalDisputes}</div>
        <div class="text-sm text-neutral-400">Total Disputes</div>
      </div>
      <div class="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
        <div class="text-3xl font-bold text-amber-400">{stats.pendingReview}</div>
        <div class="text-sm text-neutral-400">Pending Review</div>
      </div>
      <div class="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
        <div class="text-3xl font-bold text-emerald-400">{stats.resolvedToday}</div>
        <div class="text-sm text-neutral-400">Resolved Today</div>
      </div>
      <div class="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
        <div class="text-3xl font-bold text-red-400">{stats.flaggedUsers}</div>
        <div class="text-sm text-neutral-400">Flagged Users</div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Active Disputes -->
      <div class="col-span-2">
        <h2 class="text-lg font-semibold mb-4">Active Disputes</h2>
        <div class="bg-neutral-900 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
          {#each disputes as dispute}
            <div class="p-5">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-mono text-neutral-500">{dispute.taskId}</span>
                    {#if dispute.status === 'pending'}
                      <span class="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded">Pending</span>
                    {:else}
                      <span class="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded">Under Review</span>
                    {/if}
                  </div>
                  <h3 class="font-medium">{dispute.taskTitle}</h3>
                </div>
                <div class="text-right">
                  <div class="font-semibold">${dispute.amount}</div>
                  <div class="text-xs text-neutral-500">{dispute.createdAt}</div>
                </div>
              </div>
              <p class="text-sm text-neutral-400 mb-4">{dispute.reason}</p>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-4 text-neutral-500">
                  <span>Poster: <span class="text-neutral-300 font-mono">{dispute.poster}</span></span>
                  <span>Worker: <span class="text-neutral-300 font-mono">{dispute.worker}</span></span>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-1.5 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                    View Details
                  </button>
                  <button class="px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Flagged Users -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Flagged Users</h2>
        <div class="bg-neutral-900 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
          {#each flaggedUsers as user}
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-sm">{user.address}</span>
                <span class="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">{user.reports} reports</span>
              </div>
              <p class="text-sm text-neutral-400 mb-2">{user.reason}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-neutral-500">FairScore: {user.fairScore}</span>
                <button class="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Ban User
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>
</div>

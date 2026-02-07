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

<div>
    <h1 class="text-2xl font-bold font-display mb-8 text-brand-white">Admin Dashboard</h1>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="p-5 bg-brand-white/5 rounded-xl border border-brand-white/10 hover:bg-brand-white/[0.07] transition-colors">
        <div class="text-3xl font-bold font-mono mb-1">{stats.totalDisputes}</div>
        <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Total Disputes</div>
      </div>
      <div class="p-5 bg-brand-white/5 rounded-xl border border-brand-white/10 hover:bg-brand-white/[0.07] transition-colors">
        <div class="text-3xl font-bold font-mono text-amber-400 mb-1">{stats.pendingReview}</div>
        <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Pending Review</div>
      </div>
      <div class="p-5 bg-brand-white/5 rounded-xl border border-brand-white/10 hover:bg-brand-white/[0.07] transition-colors">
        <div class="text-3xl font-bold font-mono text-emerald-400 mb-1">{stats.resolvedToday}</div>
        <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Resolved Today</div>
      </div>
      <div class="p-5 bg-brand-white/5 rounded-xl border border-brand-white/10 hover:bg-brand-white/[0.07] transition-colors">
        <div class="text-3xl font-bold font-mono text-red-400 mb-1">{stats.flaggedUsers}</div>
        <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Flagged Users</div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Active Disputes -->
      <div class="col-span-2">
        <h2 class="text-lg font-bold font-display mb-4 text-brand-white">Active Disputes</h2>
        <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 divide-y divide-brand-white/5 overflow-hidden">
          {#each disputes as dispute}
            <div class="p-5 hover:bg-brand-white/[0.02] transition-colors group">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-xs font-mono text-brand-white/40 bg-brand-white/5 px-1.5 py-0.5 rounded border border-brand-white/5">{dispute.taskId}</span>
                    {#if dispute.status === 'pending'}
                      <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">Pending</span>
                    {:else}
                      <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">Under Review</span>
                    {/if}
                  </div>
                  <h3 class="font-bold text-brand-white text-lg font-display">{dispute.taskTitle}</h3>
                </div>
                <div class="text-right">
                  <div class="font-bold font-mono text-brand-white">${dispute.amount}</div>
                  <div class="text-xs text-brand-white/40 mt-1">{dispute.createdAt}</div>
                </div>
              </div>
              <p class="text-sm text-brand-white/70 mb-4 bg-brand-black/30 p-3 rounded-lg border border-brand-white/5 font-mono">{dispute.reason}</p>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-4 text-brand-white/50 text-xs">
                  <span>Poster: <span class="text-brand-white font-mono bg-brand-white/10 px-1.5 py-0.5 rounded">{dispute.poster}</span></span>
                  <span>Worker: <span class="text-brand-white font-mono bg-brand-white/10 px-1.5 py-0.5 rounded">{dispute.worker}</span></span>
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="px-3 py-1.5 bg-brand-white/5 text-brand-white border border-brand-white/10 rounded-lg hover:bg-brand-white/10 transition-colors text-xs font-bold uppercase tracking-wider">
                    Details
                  </button>
                  <button class="px-3 py-1.5 bg-emerald-500 text-brand-black font-bold rounded-lg hover:bg-emerald-400 transition-colors text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20">
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
        <h2 class="text-lg font-bold font-display mb-4 text-brand-white">Flagged Users</h2>
        <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 divide-y divide-brand-white/5 overflow-hidden">
          {#each flaggedUsers as user}
            <div class="p-4 hover:bg-brand-white/[0.02] transition-colors">
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-xs text-brand-white font-bold">{user.address}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">{user.reports} reports</span>
              </div>
              <p class="text-xs text-brand-white/60 mb-3">{user.reason}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-brand-white/40 font-mono">FairScore: <span class="text-brand-white">{user.fairScore}</span></span>
                <button class="text-xs font-bold text-red-400 hover:text-red-300 transition-colors hover:underline">
                  Review & Ban
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

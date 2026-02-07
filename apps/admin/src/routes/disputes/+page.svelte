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
    },
    { 
      id: '3', 
      taskId: 'T-022', 
      taskTitle: 'Audit smart contract', 
      poster: '0x99...EF01',
      worker: '0x56...7890',
      amount: 2500,
      status: 'pending',
      createdAt: '3 hours ago',
      reason: 'Worker claims payment was not released after work approval'
    }
  ];
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold font-display text-brand-white">Disputes</h1>
    <div class="flex gap-2">
      <button class="px-4 py-2 bg-brand-white/5 border border-brand-white/10 rounded-lg text-sm font-bold text-brand-white hover:bg-brand-white/10 transition-colors">
        Export CSV
      </button>
      <button class="px-4 py-2 bg-brand-white text-brand-black rounded-lg text-sm font-bold hover:bg-brand-white/90 transition-colors">
        Filter
      </button>
    </div>
  </div>

  <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-brand-white/10 bg-brand-white/[0.02]">
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">ID</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Task</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Amount</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Parties</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Status</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-brand-white/5">
        {#each disputes as dispute}
          <tr class="group hover:bg-brand-white/[0.02] transition-colors">
            <td class="p-4 font-mono text-sm text-brand-white/60">{dispute.id}</td>
            <td class="p-4">
              <div class="font-bold text-brand-white">{dispute.taskTitle}</div>
              <div class="text-xs text-brand-white/40 font-mono mt-1">{dispute.taskId} • {dispute.createdAt}</div>
            </td>
            <td class="p-4 font-mono font-bold text-brand-white">${dispute.amount}</td>
            <td class="p-4">
              <div class="flex flex-col gap-1 text-xs">
                <span class="text-brand-white/60">Poster: <span class="font-mono text-brand-white">{dispute.poster}</span></span>
                <span class="text-brand-white/60">Worker: <span class="font-mono text-brand-white">{dispute.worker}</span></span>
              </div>
            </td>
            <td class="p-4">
              {#if dispute.status === 'pending'}
                <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">Pending</span>
              {:else}
                <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">Under Review</span>
              {/if}
            </td>
            <td class="p-4">
              <button class="px-3 py-1.5 bg-brand-white/5 border border-brand-white/10 rounded-lg text-xs font-bold text-brand-white hover:bg-brand-white/10 hover:border-brand-purple/50 transition-all">
                Review
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

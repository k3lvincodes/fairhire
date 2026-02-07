<script lang="ts">
  let protocolFee = 5;
  let disputeWindow = 24;
  let minStake = 100;
  
  let admins = [
    { address: '0xAD...MIN1', role: 'Super Admin', added: '1 year ago' },
    { address: '0xAD...MIN2', role: 'Moderator', added: '6 months ago' }
  ];
</script>

<div class="max-w-3xl">
  <h1 class="text-3xl font-bold font-display text-brand-white mb-8">Settings</h1>

  <!-- Protocol Parameters -->
  <section class="mb-10">
    <h2 class="text-lg font-bold font-display text-brand-white mb-4">Protocol Parameters</h2>
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-6 space-y-6">
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-bold text-brand-white/80">Protocol Fee (%)</label>
          <div class="relative">
            <input type="number" bind:value={protocolFee} class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all font-mono" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-white/30">%</span>
          </div>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-bold text-brand-white/80">Dispute Window (Hours)</label>
          <div class="relative">
            <input type="number" bind:value={disputeWindow} class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all font-mono" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-white/30">hrs</span>
          </div>
        </div>
      </div>
      
      <div class="pt-4 border-t border-brand-white/5 flex justify-end">
        <button class="px-6 py-2 bg-brand-white text-brand-black rounded-lg font-bold hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Save Changes
        </button>
      </div>
    </div>
  </section>

  <!-- Admin Management -->
  <section>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold font-display text-brand-white">Admin Management</h2>
      <button class="text-sm font-bold text-brand-purple hover:text-brand-purple-hover transition-colors">
        + Add Admin
      </button>
    </div>
    
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 overflow-hidden">
      {#each admins as admin}
        <div class="p-4 border-b border-brand-white/5 last:border-0 flex items-center justify-between hover:bg-brand-white/[0.02] transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-brand-white/10 flex items-center justify-center text-xs font-bold font-mono">
              AD
            </div>
            <div>
              <div class="font-bold text-brand-white font-mono">{admin.address}</div>
              <div class="text-xs text-brand-white/40">{admin.role} • Added {admin.added}</div>
            </div>
          </div>
          <button class="text-brand-white/40 hover:text-red-400 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      {/each}
    </div>
  </section>
</div>

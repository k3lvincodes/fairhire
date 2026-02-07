<script lang="ts">
  // Mock users data
  let users = [
    { address: '0x12...3456', role: 'poster', fairScore: 92, tier: 'alpha', joined: '2 months ago', reports: 0 },
    { address: '0xAB...CD12', role: 'worker', fairScore: 88, tier: 'trusted', joined: '1 month ago', reports: 0 },
    { address: '0xBA...SPAM', role: 'worker', fairScore: 23, tier: 'builder', joined: '1 week ago', reports: 5 },
    { address: '0x99...EF01', role: 'mixed', fairScore: 75, tier: 'trusted', joined: '3 months ago', reports: 1 },
    { address: '0x56...7890', role: 'worker', fairScore: 45, tier: 'builder', joined: '2 weeks ago', reports: 2 }
  ];
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold font-display text-brand-white">Users</h1>
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input type="search" placeholder="Search by address..." class="bg-brand-white/5 border border-brand-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30 w-64" />
    </div>
  </div>

  <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-brand-white/10 bg-brand-white/[0.02]">
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">User</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Role</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">FairScore</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Reports</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Joined</th>
          <th class="p-4 text-xs font-bold text-brand-white/40 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-brand-white/5">
        {#each users as user}
          <tr class="group hover:bg-brand-white/[0.02] transition-colors">
            <td class="p-4 font-mono text-sm font-bold text-brand-white">{user.address}</td>
            <td class="p-4">
              <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-white/5 text-brand-white/60 border border-brand-white/10 rounded">{user.role}</span>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span class="font-bold text-brand-white">{user.fairScore}</span>
                <span class="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border 
                  {user.tier === 'alpha' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                   user.tier === 'trusted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                   'bg-brand-white/5 text-brand-white/40 border-brand-white/10'}">
                  {user.tier}
                </span>
              </div>
            </td>
            <td class="p-4">
              {#if user.reports > 0}
                <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">{user.reports} Reports</span>
              {:else}
                <span class="text-brand-white/20">-</span>
              {/if}
            </td>
            <td class="p-4 text-sm text-brand-white/40">{user.joined}</td>
            <td class="p-4">
              <button class="text-brand-white/40 hover:text-brand-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

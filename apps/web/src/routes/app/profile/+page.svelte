<script lang="ts">
  import { user } from '$lib/stores/wallet';
  import FairScoreBadge from '$lib/components/FairScoreBadge.svelte';
  import TierBadge from '$lib/components/TierBadge.svelte';

  // Mock data for profile stats
  const stats = {
    tasksCompleted: 42,
    earnings: 12500,
    disputes: 0,
    successRate: 98
  };

  const skills = [
    'Rust', 'Solana', 'TypeScript', 'SvelteKit', 'Smart Contracts', 'Auditing'
  ];

  const recentActivity = [
    { id: '1', action: 'completed', task: 'Fix Rust compilation error', amount: 500, date: '2h ago' },
    { id: '2', action: 'claimed', task: 'Design landing page', amount: 1200, date: '1d ago' },
    { id: '3', action: 'payout', task: 'Audit smart contract', amount: 2000, date: '3d ago' }
  ];
</script>

<div class="max-w-5xl mx-auto pb-12">
  <div class="flex flex-col md:flex-row gap-8 items-start">
    <!-- Profile Card -->
    <div class="w-full md:w-1/3 space-y-6">
      <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-8 backdrop-blur-sm text-center relative overflow-hidden group">
        <!-- Background Glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div class="relative z-10">
          <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-purple to-cyan-500 p-1 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <div class="w-full h-full rounded-full bg-brand-black flex items-center justify-center text-3xl font-bold font-display text-brand-white">
              SK
            </div>
          </div>
          
          <h1 class="text-2xl font-bold font-display text-brand-white mb-1">Skynet User</h1>
          <div class="font-mono text-sm text-brand-white/50 mb-4 bg-brand-white/5 px-3 py-1 rounded-full inline-block">
            0x7xKX...Josg
          </div>

          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="flex flex-col items-center">
              <span class="text-xs font-bold text-brand-white/40 uppercase tracking-wider mb-1">FairScore</span>
              <FairScoreBadge score={$user.fairScore} size="lg" loading={$user.reputationLoading} error={$user.reputationError} />
            </div>
            <div class="w-px h-12 bg-brand-white/10"></div>
            <div class="flex flex-col items-center">
              <span class="text-xs font-bold text-brand-white/40 uppercase tracking-wider mb-1">Tier</span>
              <TierBadge tier={$user.tier} showLabel={true} />
            </div>
          </div>

          <button class="w-full py-2 bg-brand-white/5 border border-brand-white/10 rounded-lg text-sm font-bold text-brand-white hover:bg-brand-white/10 hover:border-brand-purple/50 transition-all">
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Skills -->
      <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-6 backdrop-blur-sm">
        <h3 class="text-sm font-bold font-display uppercase tracking-wider text-brand-white/50 mb-4">Skills</h3>
        <div class="flex flex-wrap gap-2">
          {#each skills as skill}
            <span class="px-3 py-1 bg-brand-white/5 border border-brand-white/10 rounded-lg text-xs font-medium text-brand-white hover:border-brand-purple/30 transition-colors cursor-default">
              {skill}
            </span>
          {/each}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 space-y-6 w-full">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-brand-white/5 border border-brand-white/10 rounded-xl p-5 text-center hover:bg-brand-white/[0.07] transition-colors">
          <div class="text-2xl font-bold font-mono text-brand-white mb-1">{stats.tasksCompleted}</div>
          <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Tasks Done</div>
        </div>
        <div class="bg-brand-white/5 border border-brand-white/10 rounded-xl p-5 text-center hover:bg-brand-white/[0.07] transition-colors">
          <div class="text-2xl font-bold font-mono text-emerald-400 mb-1">${(stats.earnings / 1000).toFixed(1)}k</div>
          <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Earnings</div>
        </div>
        <div class="bg-brand-white/5 border border-brand-white/10 rounded-xl p-5 text-center hover:bg-brand-white/[0.07] transition-colors">
          <div class="text-2xl font-bold font-mono text-brand-white mb-1">{stats.successRate}%</div>
          <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Success Rate</div>
        </div>
        <div class="bg-brand-white/5 border border-brand-white/10 rounded-xl p-5 text-center hover:bg-brand-white/[0.07] transition-colors">
          <div class="text-2xl font-bold font-mono text-brand-white mb-1">{stats.disputes}</div>
          <div class="text-xs font-bold text-brand-white/40 uppercase tracking-wider">Disputes</div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 overflow-hidden">
        <div class="p-6 border-b border-brand-white/10 flex items-center justify-between">
          <h3 class="font-bold text-lg font-display text-brand-white">Recent Activity</h3>
          <button class="text-xs font-bold text-brand-purple hover:text-brand-purple-hover uppercase tracking-wider transition-colors">View All</button>
        </div>
        <div class="divide-y divide-brand-white/5">
          {#each recentActivity as activity}
            <div class="p-5 flex items-center justify-between hover:bg-brand-white/[0.02] transition-colors group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-brand-white/5 border border-brand-white/10 group-hover:border-brand-purple/30 transition-colors">
                  {#if activity.action === 'completed'}
                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  {:else if activity.action === 'claimed'}
                    <svg class="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  {:else}
                    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {/if}
                </div>
                <div>
                  <div class="font-bold text-brand-white text-sm">{activity.task}</div>
                  <div class="text-xs text-brand-white/40 font-mono capitalize">{activity.action} • {activity.date}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold font-mono text-brand-white {activity.action === 'payout' ? 'text-emerald-400' : ''}">
                  {activity.action === 'payout' ? '+' : ''}${activity.amount}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

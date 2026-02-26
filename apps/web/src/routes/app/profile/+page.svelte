<script lang="ts">
  import { onMount } from 'svelte';
  import { wallet, user } from '$lib/stores/wallet';
  import FairScoreBadge from '$lib/components/FairScoreBadge.svelte';
  import TierBadge from '$lib/components/TierBadge.svelte';
  import EditProfileModal from '$lib/components/EditProfileModal.svelte';

  // Profile data from server
  let profile: any = null;
  let stats = { tasksCompleted: 0, tasksPosted: 0, earnings: 0, disputes: 0, successRate: 0 };
  let recentActivity: any[] = [];
  let loading = true;
  let showEditModal = false;

  // Derived from wallet/user stores
  $: initials = ($wallet.address) 
    ? (profile?.username ? profile.username.slice(0, 2).toUpperCase() : $wallet.shortAddress?.slice(0, 2).toUpperCase() ?? '??') 
    : '??';
  $: displayName = profile?.display_name || profile?.username || $wallet.shortAddress || 'Anonymous';

  async function fetchProfile() {
    if (!$wallet.address) return;
    try {
      const res = await fetch(`/api/user/profile?wallet=${encodeURIComponent($wallet.address)}`);
      if (res.ok) {
        const data = await res.json();
        profile = data.profile;
        stats = data.stats;
        recentActivity = data.recentActivity;
      }
    } catch (err) {
      console.error('[profile] Failed to fetch profile:', err);
    }
  }

  onMount(async () => {
    await fetchProfile();
    loading = false;
  });

  function handleEditSaved() {
    showEditModal = false;
    fetchProfile();
  }

  function formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function formatEarnings(amount: number): string {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
    return `$${amount}`;
  }
</script>

<div class="max-w-5xl mx-auto pb-12">
  {#if loading}
    <div class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-2 border-brand-white/20 border-t-brand-purple rounded-full animate-spin"></div>
    </div>
  {:else if !$wallet.connected}
    <div class="text-center py-20">
      <p class="text-brand-white/50 text-lg">Connect your wallet to view your profile.</p>
    </div>
  {:else}
    <div class="flex flex-col md:flex-row gap-8 items-start">
      <!-- Profile Card -->
      <div class="w-full md:w-1/3 space-y-6">
        <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-8 backdrop-blur-sm text-center relative overflow-hidden group">
          <!-- Background Glow -->
          <div class="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="relative z-10">
            <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-purple to-cyan-500 p-1 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              {#if profile?.avatar_url}
                <img src={profile.avatar_url} alt="Avatar" class="w-full h-full rounded-full object-cover" />
              {:else}
                <div class="w-full h-full rounded-full bg-brand-black flex items-center justify-center text-3xl font-bold font-display text-brand-white">
                  {initials}
                </div>
              {/if}
            </div>
            
            <h1 class="text-2xl font-bold font-display text-brand-white mb-1">{displayName}</h1>
            {#if profile?.username}
              <div class="text-sm text-brand-white/40 mb-1">@{profile.username}</div>
            {/if}
            <div class="font-mono text-sm text-brand-white/50 mb-4 bg-brand-white/5 px-3 py-1 rounded-full inline-block">
              {$wallet.shortAddress}
            </div>

            {#if profile?.bio}
              <p class="text-sm text-brand-white/60 mb-4">{profile.bio}</p>
            {/if}

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

            <button
              on:click={() => showEditModal = true}
              class="w-full py-2 bg-brand-white/5 border border-brand-white/10 rounded-lg text-sm font-bold text-brand-white hover:bg-brand-white/10 hover:border-brand-purple/50 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <!-- Skills -->
        <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-6 backdrop-blur-sm">
          <h3 class="text-sm font-bold font-display uppercase tracking-wider text-brand-white/50 mb-4">Skills</h3>
          <div class="flex flex-wrap gap-2">
            {#if profile?.skills && profile.skills.length > 0}
              {#each profile.skills as skill}
                <span class="px-3 py-1 bg-brand-white/5 border border-brand-white/10 rounded-lg text-xs font-medium text-brand-white hover:border-brand-purple/30 transition-colors cursor-default">
                  {skill}
                </span>
              {/each}
            {:else}
              <p class="text-brand-white/30 text-sm">No skills added yet. Edit your profile to add skills.</p>
            {/if}
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
            <div class="text-2xl font-bold font-mono text-emerald-400 mb-1">{formatEarnings(stats.earnings)}</div>
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
            <a href="/app/tasks" class="text-xs font-bold text-brand-purple hover:text-brand-purple-hover uppercase tracking-wider transition-colors">View All</a>
          </div>
          <div class="divide-y divide-brand-white/5">
            {#if recentActivity.length > 0}
              {#each recentActivity as activity}
                <div class="p-5 flex items-center justify-between hover:bg-brand-white/[0.02] transition-colors group">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center bg-brand-white/5 border border-brand-white/10 group-hover:border-brand-purple/30 transition-colors">
                      {#if activity.action === 'completed'}
                        <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      {:else if activity.action === 'claimed' || activity.action === 'accepted'}
                        <svg class="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      {:else if activity.action === 'payout'}
                        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {:else}
                        <svg class="w-5 h-5 text-brand-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                      {/if}
                    </div>
                    <div>
                      <div class="font-bold text-brand-white text-sm">{activity.task}</div>
                      <div class="text-xs text-brand-white/40 font-mono capitalize">{activity.action} • {formatTimeAgo(activity.date)}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold font-mono text-brand-white {activity.action === 'payout' || activity.action === 'completed' ? 'text-emerald-400' : ''}">
                      {activity.action === 'payout' || activity.action === 'completed' ? '+' : ''}${activity.amount}
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="p-8 text-center">
                <p class="text-brand-white/30 text-sm">No activity yet. Start by browsing available tasks!</p>
                <a href="/app/tasks" class="inline-block mt-3 text-brand-purple hover:text-brand-purple-hover text-sm font-bold transition-colors">Browse Tasks →</a>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

{#if showEditModal}
  <EditProfileModal
    {profile}
    on:saved={handleEditSaved}
    on:close={() => showEditModal = false}
  />
{/if}

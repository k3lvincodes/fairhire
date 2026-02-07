<script lang="ts">
  export let settlement: 'instant' | 'fast' | 'escrow' = 'escrow';
  export let userScore: number = 0;
  export let variant: 'compact' | 'full' = 'compact';
  
  const settlementConfig = {
    instant: {
      title: 'Instant Auto-Pay',
      description: 'Funds release immediately upon submission. Your reputation acts as collateral.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    fast: {
      title: 'Fast Track',
      description: '12-hour automated dispute window before auto-release.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    escrow: {
      title: 'Standard Escrow',
      description: 'Funds remain locked until the poster manually approves release.',
      color: 'text-neutral-400',
      bg: 'bg-neutral-500/10',
      border: 'border-neutral-500/30',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    }
  };
  
  $: config = settlementConfig[settlement];
</script>

{#if variant === 'compact'}
  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium {config.bg} {config.color}">
    {config.title}
  </span>
{:else}
  <div class="{config.bg} border {config.border} rounded-lg p-5 backdrop-blur-sm">
    <div class="flex items-center gap-3 mb-3">
      <div class="p-2 rounded-lg bg-black/20">
        <svg class="w-5 h-5 {config.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{config.icon}"/>
        </svg>
      </div>
      <h3 class="font-bold font-display {config.color}">{config.title}</h3>
    </div>
    <p class="text-sm text-brand-white/70 leading-relaxed">{config.description}</p>
    {#if userScore > 0}
      <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span class="text-xs text-brand-white/50 uppercase tracking-widest font-semibold">Your FairScore</span>
        <strong class="text-brand-white font-mono">{userScore}</strong>
      </div>
    {/if}
  </div>
{/if}

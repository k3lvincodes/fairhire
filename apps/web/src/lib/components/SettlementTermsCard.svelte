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
  <div class="{config.bg} border {config.border} rounded-xl p-5">
    <div class="flex items-center gap-3 mb-3">
      <svg class="w-5 h-5 {config.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{config.icon}"/>
      </svg>
      <h3 class="font-semibold {config.color}">{config.title}</h3>
    </div>
    <p class="text-sm text-neutral-300">{config.description}</p>
    {#if userScore > 0}
      <p class="text-sm text-neutral-400 mt-2">
        Your FairScore: <strong class="text-white">{userScore}</strong>
      </p>
    {/if}
  </div>
{/if}

<script lang="ts">
  export let tier: 'alpha' | 'trusted' | 'builder' = 'builder';
  export let showLabel: boolean = true;
  
  const tierConfig = {
    alpha: {
      label: 'Alpha',
      sublabel: 'Sovereign',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30'
    },
    trusted: {
      label: 'Trusted',
      sublabel: '70-84',
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30'
    },
    builder: {
      label: 'Builder',
      sublabel: '<70',
      color: 'text-brand-white/40',
      bg: 'bg-brand-white/5',
      border: 'border-brand-white/10'
    }
  };
  
  $: config = tierConfig[tier];
</script>

<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium {config.bg} {config.color} border {config.border}">
  {#if tier === 'alpha'}
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
  {:else if tier === 'trusted'}
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  {:else}
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
  {/if}
  {#if showLabel}
    {config.label}
  {/if}
</span>

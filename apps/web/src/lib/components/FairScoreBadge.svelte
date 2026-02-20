<script lang="ts">
  export let score: number = 0;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let loading: boolean = false;
  export let error: string | null = null;
  
  $: tier = (score >= 85 ? 'alpha' : score >= 70 ? 'trusted' : 'builder') as 'alpha' | 'trusted' | 'builder';
  $: tierLabel = score >= 85 ? 'Alpha' : score >= 70 ? 'Trusted' : 'Builder';
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  };
  
  const tierGradients = {
    alpha: 'from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    trusted: 'from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    builder: 'from-brand-white/20 to-brand-white/5 border border-brand-white/10'
  };
</script>

{#if loading}
  <!-- Loading skeleton -->
  <div 
    class="rounded-full bg-brand-white/10 flex items-center justify-center {sizeClasses[size]} animate-pulse"
    title="Loading FairScore..."
  >
    <div class="w-3/5 h-1 bg-brand-white/20 rounded-full"></div>
  </div>
{:else if error && score === 0}
  <!-- Error state -->
  <div 
    class="rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold {sizeClasses[size]}"
    title="FairScore unavailable: {error}"
  >
    <span class="text-red-400">?</span>
  </div>
{:else}
  <!-- Normal state -->
  <div 
    class="rounded-full bg-gradient-to-br {tierGradients[tier]} flex items-center justify-center font-bold {sizeClasses[size]}"
    title="FairScore: {score} ({tierLabel} Tier){error ? ` — ${error}` : ''}"
  >
    {score}
  </div>
{/if}

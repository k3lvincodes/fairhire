<script lang="ts">
  export let score: number = 0;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  $: tier = score >= 85 ? 'alpha' : score >= 70 ? 'trusted' : 'builder';
  $: tierLabel = score >= 85 ? 'Alpha' : score >= 70 ? 'Trusted' : 'Builder';
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  };
  
  const tierGradients = {
    alpha: 'from-emerald-500 to-cyan-500',
    trusted: 'from-amber-500 to-orange-500',
    builder: 'from-neutral-600 to-neutral-500'
  };
</script>

<div 
  class="rounded-full bg-gradient-to-br {tierGradients[tier]} flex items-center justify-center font-bold {sizeClasses[size]}"
  title="FairScore: {score} ({tierLabel} Tier)"
>
  {score}
</div>

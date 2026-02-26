<script lang="ts">
  import { user, onboardingState } from '$lib/stores/wallet';
  import { goto } from '$app/navigation';

  function completeOnboarding() {
    onboardingState.set('done');
    goto('/app/dashboard');
  }

  // Derived variables for styling based on tier
  $: isAlpha = $user.tier === 'alpha';
  $: isTrusted = $user.tier === 'trusted';
  
  $: tierColor = isAlpha ? 'text-emerald-400' : isTrusted ? 'text-amber-400' : 'text-brand-white/40';
  $: tierBg = isAlpha ? 'bg-emerald-500/10' : isTrusted ? 'bg-amber-500/20' : 'bg-brand-white/20';
  $: tierBorder = isAlpha ? 'border-emerald-500/30' : isTrusted ? 'border-amber-500/30' : 'border-brand-white/10';
  $: shadowColor = isAlpha ? 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' : isTrusted ? 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' : '';
</script>

<div class="fixed inset-0 z-[60] flex items-center justify-center bg-brand-black/95 backdrop-blur-md p-4">
  <div class="w-full max-w-sm bg-gradient-to-br from-brand-white/5 to-transparent border border-brand-white/10 rounded-2xl p-6 relative overflow-hidden">
    
    <!-- Background Glow -->
    <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-50">
      <div class="w-48 h-48 bg-brand-purple rounded-full blur-[80px]"></div>
    </div>

    <div class="relative z-10 text-center">
      <h2 class="text-2xl font-bold font-display text-brand-white mb-1">Your FairScore</h2>
      <p class="text-brand-white/60 mb-6 text-sm max-w-xs mx-auto">
        Your on-chain reputation unlocks dynamic escrow terms.
      </p>

      <div class={`relative mx-auto w-36 h-36 rounded-full ${tierBg} flex items-center justify-center border ${tierBorder} mb-6 ${shadowColor}`}>
        <div class="absolute inset-0 rounded-full border border-brand-white/10 m-1.5"></div>
        {#if $user.reputationLoading}
          <div class="w-8 h-8 border-3 border-white/20 border-t-brand-purple rounded-full animate-spin"></div>
        {:else}
          <div class="text-center">
            <div class="text-5xl font-bold font-display text-white mb-0.5">{$user.fairScore}</div>
            <div class={`text-xs font-bold uppercase tracking-wider ${tierColor}`}>
              {$user.tier} Tier
            </div>
          </div>
        {/if}
      </div>

      {#if $user.reputationError}
        <p class="text-sm text-amber-400/80 mb-6 bg-amber-400/10 py-2 px-4 rounded-lg inline-block">
           {$user.reputationError}
        </p>
      {/if}

      <div class="bg-brand-black/50 border border-brand-white/5 rounded-lg p-3 mb-6 text-left">
        <h4 class="font-bold text-brand-white mb-1 text-sm flex items-center gap-2">
          {#if isAlpha}
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Instant Pay Enabled
          {:else if isTrusted}
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Fast Track Enabled
          {:else}
             <svg class="w-4 h-4 text-brand-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Standard Escrow
          {/if}
        </h4>
        <p class="text-brand-white/50 text-xs leading-relaxed">
          {#if isAlpha}
            You have unlocked 0-wait time payments. Funds release immediately upon submission.
          {:else if isTrusted}
            You have a 12-hour automated dispute window before release.
          {:else}
            Manual approval is required from the task poster before funds release.
          {/if}
        </p>
      </div>

      <button 
        on:click={completeOnboarding}
        class="w-full py-3 bg-brand-white text-brand-black rounded-lg font-bold hover:bg-brand-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        Enter Dashboard
      </button>
    </div>
  </div>
</div>

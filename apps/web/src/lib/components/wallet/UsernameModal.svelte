<script lang="ts">
  import { wallet, onboardingState } from '$lib/stores/wallet';
  import { supabase } from '$lib/supabase';

  let username = '';
  let isLoading = false;
  let errorMsg = '';

  $: isUsernameValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);
  $: isFormValid = isUsernameValid;

  async function saveProfile() {
    if (!isFormValid || !$wallet.address) return;

    isLoading = true;
    errorMsg = '';

    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          wallet_address: $wallet.address,
          email: $wallet.email || null,
          username: username.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'wallet_address' 
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          errorMsg = 'Username is already taken.';
        } else {
          errorMsg = `Error saving profile: ${error.message}`;
        }
        isLoading = false;
        return;
      }

      // Transition to FairScore modal
      onboardingState.set('fairscore');
    } catch (err: any) {
      console.error(err);
      errorMsg = err.message || 'An unexpected error occurred.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/90 backdrop-blur-sm p-4">
  <div class="w-full max-w-md bg-brand-white/5 border border-brand-white/10 rounded-2xl p-8 shadow-2xl">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-purple/30">
        <svg class="w-8 h-8 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      </div>
      <h2 class="text-2xl font-bold font-display text-brand-white mb-2">Claim Your Handle</h2>
      <p class="text-brand-white/60 text-sm">
        Welcome to FairHire. Set up your profile to get started.
      </p>
    </div>

    <form on:submit|preventDefault={saveProfile} class="space-y-4">
      <!-- Username Field -->
      <div>
        <label for="username" class="block text-sm font-medium text-brand-white/80 mb-1">Username</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/40 font-mono">@</span>
          <input 
            type="text" 
            id="username"
            bind:value={username}
            placeholder="satoshi_123"
            class="w-full bg-brand-black/50 border border-brand-white/10 rounded-lg pl-8 pr-4 py-3 text-brand-white focus:outline-none focus:border-brand-purple/50 focus:bg-brand-white/5 transition-all font-mono"
            disabled={isLoading}
            autocomplete="off"
            spellcheck="false"
          />
        </div>
        
        <div class="mt-2 flex items-center justify-between text-xs">
          <span class="text-brand-white/40">3-20 chars, letters, numbers, _</span>
          {#if username.length > 0}
            <span class={isUsernameValid ? 'text-emerald-400' : 'text-red-400'}>
              {isUsernameValid ? 'Valid format' : 'Invalid format'}
            </span>
          {/if}
        </div>
      </div>

      {#if errorMsg}
        <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {errorMsg}
        </div>
      {/if}

      <button 
        type="submit" 
        disabled={!isFormValid || isLoading}
        class="w-full py-3 bg-brand-purple text-white rounded-lg font-bold hover:bg-brand-purple-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_15px_rgba(108,59,170,0.3)]"
      >
        {#if isLoading}
          <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        {:else}
          Continue
        {/if}
      </button>
    </form>
  </div>
</div>

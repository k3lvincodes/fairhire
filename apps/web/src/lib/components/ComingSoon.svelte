<script lang="ts">
  import { onMount } from 'svelte';

  let email = '';
  let submitted = false;

  let loading = false;
  let message = '';
  let error = false;

  async function handleSubmit() {
    if (!email) return;

    loading = true;
    error = false;
    message = '';

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        submitted = true;
        // Don't auto-reset email or submitted state so the success view persists
      } else {
        error = true;
        message = data.message || 'Something went wrong.';
      }
    } catch (e) {
      error = true;
      message = 'Failed to submit. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-brand-black text-brand-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
  <!-- Background Elements -->
  <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
  <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10"></div>

  <a href="/" class="absolute top-4 left-4 md:top-6 md:left-6 inline-flex items-center gap-2 text-brand-white/40 hover:text-brand-white transition-colors text-sm font-medium z-50">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
    <span class="hidden sm:inline">Back to Home</span>
    <span class="sm:hidden">Home</span>
  </a>

  <!-- Content -->
  <div class="max-w-2xl w-full text-center relative z-10">
    <div class="mb-8 flex justify-center">
      <div class="w-16 h-16 bg-brand-white/5 rounded-2xl flex items-center justify-center border border-brand-white/10 shadow-2xl backdrop-blur-sm">
        <img src="/logo.png" alt="FairHire" class="w-10 h-10 object-contain" />
      </div>
    </div>

    <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-white/5 border border-brand-white/10 rounded-full text-brand-white/60 text-sm mb-8 font-mono backdrop-blur-sm">
      <span class="w-2 h-2 bg-brand-purple rounded-full animate-pulse"></span>
      Under Construction
    </div>

    <h1 class="text-4xl md:text-7xl font-bold font-display mb-6 tracking-tight leading-tight">
      Building the Future of <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-white to-brand-white/50">Fair Hiring</span>
    </h1>

    <p class="text-lg md:text-xl text-brand-white/60 mb-12 max-w-lg mx-auto leading-relaxed px-4">
      We're crafting a revolutionary reputation-based work marketplace. Join the waitlist to be the first to know when we launch.
    </p>

    <!-- Email Form -->
    <!-- Email Form / Success State -->
    <div class="bg-brand-white/5 p-2 rounded-xl border border-brand-white/10 backdrop-blur-md max-w-md mx-auto mb-12 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-brand-purple/50 focus-within:ring-1 focus-within:ring-brand-purple/50 relative overflow-hidden mx-4 sm:mx-auto">
      {#if submitted}
        <div class="w-full h-full flex flex-col items-center justify-center py-4 animate-fade-in text-center">
            <h3 class="text-xl font-bold text-emerald-400 mb-2">You're on the list! 🎉</h3>
            <p class="text-brand-white/60 text-sm mb-4">Share the revolution with your friends.</p>
            
            <button 
                on:click={() => {
                    navigator.clipboard.writeText('https://fairhire.sbs/waitlist');
                    message = 'Link copied to clipboard!';
                    setTimeout(() => message = '', 2000);
                }}
                class="px-6 py-2 bg-brand-white/10 hover:bg-brand-white/20 text-brand-white rounded-lg font-bold transition-all flex items-center gap-2 text-sm border border-brand-white/10"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                Copy Link
            </button>
        </div>
      {:else}
        <input 
          type="email" 
          bind:value={email}
          placeholder="Enter your email address" 
          class="bg-transparent border-none text-brand-white placeholder-brand-white/30 focus:ring-0 w-full px-4 py-3 outline-none"
        />
        <button 
          on:click={handleSubmit}
          class="px-6 py-3 bg-brand-white text-brand-black font-bold rounded-lg hover:bg-brand-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px]"
          disabled={!email || loading}
        >
          {#if loading}
            <svg class="animate-spin h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {:else}
            Notify Me
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          {/if}
        </button>
      {/if}
    </div>
    {#if message}
      <p class="text-sm mt-4 {error ? 'text-red-400' : 'text-emerald-400'} font-medium animate-fade-in absolute bottom-0 left-0 right-0 translate-y-full pb-4">
        {message}
      </p>
    {/if}
  </div>

  <div class="absolute bottom-8 text-brand-white/20 text-xs text-center w-full">
    &copy; 2026 FairHire. All rights reserved.
  </div>
</div>

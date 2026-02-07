<script lang="ts">
  import Modal from './Modal.svelte';
  import SettlementTermsCard from './SettlementTermsCard.svelte';
  import { user } from '$lib/stores/wallet';
  import { toasts } from '$lib/stores/toast';
  import { createEventDispatcher } from 'svelte';
  
  export let open = false;
  export let task: {
    id: string;
    title: string;
    price: number;
    settlement: 'instant' | 'fast' | 'escrow';
    minScore: number;
    deadline: string;
  };
  
  const dispatch = createEventDispatcher();
  
  $: eligible = $user.fairScore >= task.minScore;
  
  async function handleClaim() {
    if (!eligible) return;
    
    // Start transaction toast
    const tx = toasts.transaction('Claiming task...', 'mock-signature-12345');
    
    // Simulate transaction
    await new Promise(r => setTimeout(r, 1000));
    tx.confirm();
    await new Promise(r => setTimeout(r, 1000));
    tx.finalize();
    
    dispatch('claim', { taskId: task.id });
    open = false;
  }
</script>

<Modal bind:open title="Claim Task">
  <div class="space-y-6">
    <!-- Task Summary -->
    <div>
      <h3 class="font-bold text-xl mb-2 text-brand-white font-display">{task.title}</h3>
      <div class="flex items-center gap-4 text-sm text-brand-white/50">
        <span class="font-bold text-brand-white text-lg font-mono">${task.price}</span>
        <span>•</span>
        <span class="font-mono">{task.deadline}</span>
      </div>
    </div>
    
    <!-- Settlement Terms -->
    <SettlementTermsCard settlement={task.settlement} userScore={$user.fairScore} variant="full" />
    
    <!-- Eligibility Check -->
    <div class="p-5 rounded-xl {eligible ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}">
      <div class="flex items-center gap-4">
        {#if eligible}
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <div class="font-bold text-emerald-400">You're eligible</div>
            <div class="text-sm text-brand-white/80">Your FairScore ({$user.fairScore}) meets the minimum ({task.minScore})</div>
          </div>
        {:else}
          <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <div class="font-bold text-red-400">Not eligible</div>
            <div class="text-sm text-brand-white/80">Your FairScore ({$user.fairScore}) is below the minimum ({task.minScore})</div>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Warning for Instant Pay -->
    {#if task.settlement === 'instant'}
      <div class="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <div class="flex items-start gap-4">
          <div class="mt-0.5 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="text-sm">
            <div class="font-bold text-amber-400 mb-1">Instant Pay Agreement</div>
            <p class="text-brand-white/80 leading-relaxed">Submitting low-quality or spam work will result in a severe FairScore penalty and potential platform ban.</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <div slot="footer" class="flex items-center justify-end gap-3">
    <button 
      on:click={() => open = false}
      class="px-5 py-2.5 text-brand-white/60 hover:text-brand-white transition-colors font-medium hover:bg-brand-white/5 rounded-lg"
    >
      Cancel
    </button>
    <button 
      on:click={handleClaim}
      disabled={!eligible}
      class="px-6 py-2.5 bg-brand-white text-brand-black rounded-lg font-bold hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
    >
      Claim Task
    </button>
  </div>
</Modal>

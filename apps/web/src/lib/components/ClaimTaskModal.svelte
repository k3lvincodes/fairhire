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
      <h3 class="font-medium text-lg mb-2">{task.title}</h3>
      <div class="flex items-center gap-4 text-sm text-neutral-400">
        <span class="font-semibold text-white text-lg">${task.price}</span>
        <span>•</span>
        <span>{task.deadline}</span>
      </div>
    </div>
    
    <!-- Settlement Terms -->
    <SettlementTermsCard settlement={task.settlement} userScore={$user.fairScore} variant="full" />
    
    <!-- Eligibility Check -->
    <div class="p-4 rounded-xl {eligible ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}">
      <div class="flex items-center gap-3">
        {#if eligible}
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <div class="font-medium text-emerald-400">You're eligible</div>
            <div class="text-sm text-neutral-300">Your FairScore ({$user.fairScore}) meets the minimum ({task.minScore})</div>
          </div>
        {:else}
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <div class="font-medium text-red-400">Not eligible</div>
            <div class="text-sm text-neutral-300">Your FairScore ({$user.fairScore}) is below the minimum ({task.minScore})</div>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Warning for Instant Pay -->
    {#if task.settlement === 'instant'}
      <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div class="text-sm">
            <div class="font-medium text-amber-400 mb-1">Instant Pay Agreement</div>
            <p class="text-neutral-300">Submitting low-quality or spam work will result in a severe FairScore penalty and potential platform ban.</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <div slot="footer" class="flex items-center justify-end gap-3">
    <button 
      on:click={() => open = false}
      class="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
    >
      Cancel
    </button>
    <button 
      on:click={handleClaim}
      disabled={!eligible}
      class="px-6 py-2 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Claim Task
    </button>
  </div>
</Modal>

<script lang="ts">
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { toasts } from '$lib/stores/toast';

  export let open = false;
  export let task: {
    id: string;
    title: string;
  };

  let reason = '';
  let disputing = false;

  const dispatch = createEventDispatcher();

  async function handleDispute() {
    if (!reason.trim()) return;
    
    disputing = true;
    
    // Simulate transaction
    const tx = toasts.transaction('Raising dispute...', 'mock-tx-dispute');
    await new Promise(r => setTimeout(r, 1500));
    tx.confirm();
    await new Promise(r => setTimeout(r, 1000));
    tx.finalize();
    
    dispatch('dispute', { taskId: task.id, reason });
    disputing = false;
    open = false;
    reason = '';
  }
</script>

<Modal bind:open title="Raise Dispute">
  <div class="space-y-6">
    <div class="p-4 bg-brand-white/5 rounded-xl border border-brand-white/10">
      <h3 class="font-bold text-brand-white mb-1">{task.title}</h3>
      <p class="text-sm text-brand-white/50">Disputing work submission.</p>
    </div>

    <div class="space-y-2">
      <label for="reason" class="block text-sm font-bold text-brand-white/80">Reason for Dispute</label>
      <textarea 
        id="reason"
        bind:value={reason}
        rows="5" 
        class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30"
        placeholder="Explain why the work does not meet the criteria..."
      ></textarea>
    </div>

    <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <div class="text-sm">
        <div class="font-bold text-red-500 mb-1">Warning</div>
        <p class="text-brand-white/70">Frivolous disputes can lead to a reduction in your FairScore. Moderators will review the evidence.</p>
      </div>
    </div>
  </div>

  <div slot="footer" class="flex items-center justify-end gap-3">
    <button 
      on:click={() => open = false}
      class="px-5 py-2.5 text-brand-white/60 hover:text-brand-white transition-colors font-medium hover:bg-brand-white/5 rounded-lg"
    >
      Cancel
    </button>
    <button 
      on:click={handleDispute}
      disabled={!reason.trim() || disputing}
      class="px-6 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
    >
      {disputing ? 'Processing...' : 'Raise Dispute'}
    </button>
  </div>
</Modal>

<script lang="ts">
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { toasts } from '$lib/stores/toast';

  export let open = false;
  export let task: {
    id: string;
    title: string;
  };

  let submission = '';
  let submitting = false;

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    if (!submission.trim()) return;
    
    submitting = true;
    
    // Simulate transaction
    const tx = toasts.transaction('Submitting work...', 'mock-tx-submit');
    await new Promise(r => setTimeout(r, 1500));
    tx.confirm();
    await new Promise(r => setTimeout(r, 1000));
    tx.finalize();
    
    dispatch('submit', { taskId: task.id, proof: submission });
    submitting = false;
    open = false;
    submission = '';
  }
</script>

<Modal bind:open title="Submit Work">
  <div class="space-y-6">
    <div class="p-4 bg-brand-white/5 rounded-xl border border-brand-white/10">
      <h3 class="font-bold text-brand-white mb-1">{task.title}</h3>
      <p class="text-sm text-brand-white/50">Provide proof of work for the reviewer.</p>
    </div>

    <div class="space-y-2">
      <label for="proof" class="block text-sm font-bold text-brand-white/80">Submission Proof</label>
      <textarea 
        id="proof"
        bind:value={submission}
        rows="5" 
        class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30"
        placeholder="Enter links to PRs, designs, or other proof..."
      ></textarea>
    </div>

    <div class="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex items-start gap-3">
      <svg class="w-5 h-5 text-brand-purple mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <div class="text-sm">
        <div class="font-bold text-brand-purple mb-1">Quality Assurance</div>
        <p class="text-brand-white/70">Ensure your work meets all acceptance criteria. Low-quality submissions may be disputed and affect your FairScore.</p>
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
      on:click={handleSubmit}
      disabled={!submission.trim() || submitting}
      class="px-6 py-2.5 bg-brand-white text-brand-black rounded-lg font-bold hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
    >
      {submitting ? 'Submitting...' : 'Submit Work'}
    </button>
  </div>
</Modal>

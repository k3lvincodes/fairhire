<script lang="ts">
  import { page } from '$app/stores';
  import { user } from '$lib/stores/wallet';
  import ClaimTaskModal from '$lib/components/ClaimTaskModal.svelte';
  import SubmitWorkModal from '$lib/components/SubmitWorkModal.svelte';
  import DisputeModal from '$lib/components/DisputeModal.svelte';
  import SettlementTermsCard from '$lib/components/SettlementTermsCard.svelte';
  import TaskStateTimeline from '$lib/components/TaskStateTimeline.svelte';

  // Mock task data
  let task = {
    id: $page.params.id,
    title: 'Fix Rust compilation error in DeFi protocol',
    description: 'We need someone to debug and fix a compilation error in our Solana program. The error occurs when building with anchor build. Must have experience with Anchor framework.',
    price: 500,
    settlement: 'instant' as const,
    deadline: '2 hours remaining',
    minScore: 85,
    poster: '0x12...3456',
    status: 'created' as 'created' | 'claimed' | 'submitted' | 'review' | 'released' | 'disputed',
    requirements: [
      'Fix compilation error',
      'Ensure all tests pass',
      'Submit PR with fix'
    ]
  };

  let claimModalOpen = false;
  let submitModalOpen = false;
  let disputeModalOpen = false;

  $: eligible = $user.fairScore >= task.minScore;

  function handleClaim() {
    task.status = 'claimed';
  }

  function handleSubmit() {
    task.status = 'review'; // or submitted depending on flow, let's say review for now
  }

  function handleDispute() {
    task.status = 'disputed';
  }
</script>

<div class="max-w-4xl mx-auto pb-24">
  <!-- Back Button -->
  <a href="/app/tasks" class="inline-flex items-center gap-2 text-brand-white/50 hover:text-brand-white mb-6 transition-colors font-medium group">
    <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    Back to Tasks
  </a>
  
  <!-- Task Header -->
  <div class="bg-brand-white/5 rounded-xl p-8 border border-brand-white/10 mb-8 backdrop-blur-sm relative overflow-hidden">
    <div class="relative z-10 flex items-start justify-between gap-6">
      <div class="flex-1">
        <h1 class="text-3xl font-bold font-display text-brand-white mb-4 leading-tight">{task.title}</h1>
        <div class="flex items-center gap-4 text-brand-white/50 text-sm">
          <span class="font-mono bg-brand-white/5 px-2 py-1 rounded text-xs border border-brand-white/5">Posted by {task.poster}</span>
          <span>•</span>
          <span class="flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{task.deadline}</span>
        </div>
      </div>
      <div class="text-right flex flex-col items-end">
        <div class="text-4xl font-bold font-mono text-brand-white tracking-tight">${task.price}</div>
        <div class="mt-3">
          {#if task.settlement === 'instant'}
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Instant Pay</span>
          {:else if task.settlement === 'fast'}
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">Fast Track</span>
          {:else}
            <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-brand-white/10 text-brand-white/60 border border-brand-white/10 rounded-full">Escrow</span>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    <!-- Main Content -->
    <div class="md:col-span-2 space-y-8">
      <!-- Description -->
      <section>
        <h2 class="text-xl font-bold font-display mb-4 text-brand-white">Description</h2>
        <div class="text-brand-white/80 leading-relaxed whitespace-pre-line bg-brand-white/[0.02] p-6 rounded-xl border border-brand-white/5">
          {task.description}
        </div>
      </section>

      <!-- Requirements -->
      <section>
        <h2 class="text-xl font-bold font-display mb-4 text-brand-white">Acceptance Criteria</h2>
        <ul class="space-y-3">
          {#each task.requirements as req}
            <li class="flex items-start gap-4 p-4 rounded-xl bg-brand-white/[0.02] border border-brand-white/5 group hover:border-brand-purple/20 transition-colors">
              <div class="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-purple/20 transition-colors">
                <svg class="w-3.5 h-3.5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              </div>
              <span class="text-brand-white/80 font-medium">{req}</span>
            </li>
          {/each}
        </ul>
      </section>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Terms -->
      <div>
        <h3 class="text-xs font-bold font-display uppercase tracking-wider text-brand-white/40 mb-3">Settlement Terms</h3>
        <SettlementTermsCard settlement={task.settlement} userScore={$user.fairScore} />
      </div>

      <!-- Timeline -->
      <div>
        <h3 class="text-xs font-bold font-display uppercase tracking-wider text-brand-white/40 mb-3">Task Status</h3>
        <div class="bg-brand-white/[0.02] p-5 rounded-xl border border-brand-white/5">
          <TaskStateTimeline currentState={task.status} compact={false} />
        </div>
      </div>
    </div>
  </div>

  <!-- Action Panel -->
  <div class="sticky bottom-6 bg-brand-black/80 backdrop-blur-xl border border-brand-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 shadow-2xl z-40 max-w-4xl mx-auto ring-1 ring-brand-white/5">
    <div class="flex items-center gap-4">
      <div>
        <div class="text-xs text-brand-white/40 font-bold uppercase tracking-wider mb-1">Status</div>
        <div class="font-bold font-display text-brand-white capitalize">{task.status.replace('-', ' ')}</div>
      </div>
      {#if task.status === 'created'}
        <div class="h-8 w-px bg-brand-white/10 hidden sm:block"></div>
        <div class="hidden sm:block">
          <div class="text-xs text-brand-white/40 font-bold uppercase tracking-wider mb-1">Requirements</div>
          <div class="font-bold text-brand-white text-sm flex items-center gap-2">
            FairScore {task.minScore}+ 
            {#if eligible}
               <span class="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Eligible</span>
            {:else}
               <span class="text-red-400 text-xs font-mono bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">Low Score</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <div class="flex items-center gap-3">
      {#if task.status === 'created'}
        <button 
          on:click={() => claimModalOpen = true}
          disabled={!eligible}
          class="px-8 py-3 bg-brand-white text-brand-black font-bold rounded-xl hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          Claim Task
        </button>
      {:else if task.status === 'claimed'}
        <button 
          on:click={() => submitModalOpen = true}
          class="px-8 py-3 bg-brand-white text-brand-black font-bold rounded-xl hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Submit Work
        </button>
      {:else if task.status === 'submitted' || task.status === 'review'}
        <button 
          on:click={() => disputeModalOpen = true}
          class="px-6 py-3 bg-brand-white/5 text-brand-white border border-brand-white/10 font-bold rounded-xl hover:bg-brand-white/10 transition-all"
        >
          Raise Dispute
        </button>
      {/if}
    </div>
  </div>
</div>

<ClaimTaskModal bind:open={claimModalOpen} {task} on:claim={handleClaim} />
<SubmitWorkModal bind:open={submitModalOpen} {task} on:submit={handleSubmit} />
<DisputeModal bind:open={disputeModalOpen} {task} on:dispute={handleDispute} />

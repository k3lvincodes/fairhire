<script lang="ts">
  export let currentState: 'created' | 'claimed' | 'submitted' | 'review' | 'released' | 'disputed' | 'expired' = 'created';
  export let compact = false;
  
  const states = [
    { id: 'created', label: 'Created', icon: 'M12 4v16m8-8H4' },
    { id: 'claimed', label: 'Claimed', icon: 'M5 13l4 4L19 7' },
    { id: 'submitted', label: 'Submitted', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'review', label: 'In Review', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'released', label: 'Released', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];
  
  const stateIndex = {
    created: 0,
    claimed: 1,
    submitted: 2,
    review: 3,
    released: 4,
    disputed: 4,
    expired: 4
  };
  
  $: currentIndex = stateIndex[currentState];
</script>

{#if compact}
  <!-- Compact horizontal timeline -->
  <div class="flex items-center gap-2">
    {#each states as state, i}
      <div class="flex items-center">
        <div 
          class="w-6 h-6 rounded-full flex items-center justify-center text-xs
            {i < currentIndex ? 'bg-emerald-500 text-white' : 
             i === currentIndex ? 'bg-white text-neutral-900' : 
             'bg-neutral-700 text-neutral-500'}"
        >
          {i + 1}
        </div>
        {#if i < states.length - 1}
          <div class="w-4 h-0.5 {i < currentIndex ? 'bg-emerald-500' : 'bg-neutral-700'}"></div>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <!-- Full vertical timeline -->
  <div class="space-y-4">
    {#each states as state, i}
      <div class="flex items-start gap-4">
        <div class="flex flex-col items-center">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center
              {i < currentIndex ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' : 
               i === currentIndex ? 'bg-white text-neutral-900' : 
               'bg-neutral-800 text-neutral-500 border border-neutral-700'}"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={state.icon}/>
            </svg>
          </div>
          {#if i < states.length - 1}
            <div class="w-0.5 h-8 {i < currentIndex ? 'bg-emerald-500' : 'bg-neutral-700'}"></div>
          {/if}
        </div>
        <div class="pt-2">
          <div class="font-medium {i <= currentIndex ? 'text-white' : 'text-neutral-500'}">
            {state.label}
          </div>
          {#if i === currentIndex}
            <div class="text-sm text-emerald-400">Current</div>
          {:else if i < currentIndex}
            <div class="text-sm text-neutral-500">Completed</div>
          {/if}
        </div>
      </div>
    {/each}
    
    {#if currentState === 'disputed'}
      <div class="flex items-start gap-4 -mt-4">
        <div class="w-10 h-10 rounded-full bg-red-500/20 text-red-400 border-2 border-red-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="pt-2">
          <div class="font-medium text-red-400">Disputed</div>
          <div class="text-sm text-neutral-500">Under review by moderators</div>
        </div>
      </div>
    {:else if currentState === 'expired'}
      <div class="flex items-start gap-4 -mt-4">
        <div class="w-10 h-10 rounded-full bg-neutral-500/20 text-neutral-400 border-2 border-neutral-500 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="pt-2">
          <div class="font-medium text-neutral-400">Expired</div>
          <div class="text-sm text-neutral-500">Task deadline passed</div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<script lang="ts">
  import { toasts, type Toast } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
  
  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    transaction: 'M13 10V3L4 14h7v7l9-11h-7z'
  };
  
  const colors = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    info: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
    transaction: 'bg-brand-purple/20 border-brand-purple/30 text-brand-purple'
  };
  
  const statusLabels = {
    sent: 'Sending...',
    confirmed: 'Confirming...',
    finalized: 'Finalized',
    failed: 'Failed'
  };
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
  {#each $toasts as toast (toast.id)}
    <div 
      class="p-4 rounded-xl border backdrop-blur-sm shadow-lg {colors[toast.type]}"
      transition:fly={{ x: 100, duration: 200 }}
    >
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icons[toast.type]}/>
        </svg>
        <div class="flex-1 min-w-0">
          <div class="font-medium">{toast.title}</div>
          {#if toast.message}
            <div class="text-sm opacity-80 mt-0.5">{toast.message}</div>
          {/if}
          {#if toast.type === 'transaction' && toast.status}
            <div class="flex items-center gap-2 mt-2">
              {#if toast.status === 'sent' || toast.status === 'confirmed'}
                <div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              {/if}
              <span class="text-sm">{statusLabels[toast.status]}</span>
              {#if toast.txSignature}
                <a 
                  href="https://solscan.io/tx/{toast.txSignature}" 
                  target="_blank" 
                  rel="noopener"
                  class="text-sm underline opacity-70 hover:opacity-100"
                >
                  View
                </a>
              {/if}
            </div>
          {/if}
        </div>
        <button 
          on:click={() => toasts.remove(toast.id)}
          class="opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  {/each}
</div>

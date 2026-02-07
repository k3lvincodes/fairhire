<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  
  export let open = false;
  export let title = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  const dispatch = createEventDispatcher();
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };
  
  function close() {
    open = false;
    dispatch('close');
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    transition:fade={{ duration: 150 }}
    on:click={handleBackdropClick}
  >
    <div 
      class="w-full {sizeClasses[size]} bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
      transition:scale={{ duration: 150, start: 0.95 }}
    >
      <!-- Header -->
      {#if title}
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 class="text-lg font-semibold">{title}</h2>
          <button 
            on:click={close}
            class="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      {/if}
      
      <!-- Content -->
      <div class="p-6">
        <slot />
      </div>
      
      <!-- Footer -->
      {#if $$slots.footer}
        <div class="px-6 py-4 border-t border-neutral-800 bg-neutral-800/30">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<script lang="ts">
  import '../app.css';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import { browser } from '$app/environment';
  import CustomWalletModal from '$lib/components/wallet/CustomWalletModal.svelte';
  import OnboardingManager from '$lib/components/wallet/OnboardingManager.svelte';
  import { Buffer } from 'buffer';

  // Polyfill Buffer for @solana/web3.js and wallet adapters
  if (browser) {
    window.Buffer = window.Buffer || Buffer;
  }
</script>

{#if browser}
  <CustomWalletModal />
  <OnboardingManager />
{/if}

<slot />
<ToastContainer />

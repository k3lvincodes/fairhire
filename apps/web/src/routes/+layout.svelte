<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import { browser } from '$app/environment';
  import CustomWalletModal from '$lib/components/wallet/CustomWalletModal.svelte';
  import OnboardingManager from '$lib/components/wallet/OnboardingManager.svelte';
  import { restoreSession } from '$lib/stores/wallet';

  onMount(() => {
    restoreSession();
  });
</script>

{#if browser}
  <CustomWalletModal />
  <OnboardingManager />
{/if}

<slot />
<ToastContainer />

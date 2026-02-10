<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import ToastContainer from '$lib/components/ToastContainer.svelte';
  import ComingSoon from '$lib/components/ComingSoon.svelte';
</script>

{#if $page.url.pathname === '/' || $page.url.pathname === '/waitlist'}
  <slot />
{:else}
  <ComingSoon />
{/if}
<ToastContainer />

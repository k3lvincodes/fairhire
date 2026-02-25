<script lang="ts">
  import { onboardingState } from '$lib/stores/wallet';
  import EmailPromptModal from './EmailPromptModal.svelte';
  import EmailOtpModal from './EmailOtpModal.svelte';
  import UsernameModal from './UsernameModal.svelte';
  import FairScoreModal from './FairScoreModal.svelte';
</script>

{#if $onboardingState === 'email_prompt'}
  <EmailPromptModal />
{:else if $onboardingState === 'email_otp'}
  <EmailOtpModal />
{:else if $onboardingState === 'username'}
  <UsernameModal />
{:else if $onboardingState === 'fairscore'}
  <FairScoreModal />
{/if}

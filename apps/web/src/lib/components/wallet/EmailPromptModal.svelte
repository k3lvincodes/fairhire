<script lang="ts">
    import { wallet, onboardingState } from '$lib/stores/wallet';
    import { fade, scale } from 'svelte/transition';

    let email = '';
    let loading = false;
    let localError: string | null = null;

    async function handleSendOtp() {
        if (!email || !email.includes('@')) {
            localError = 'Please enter a valid email address';
            return;
        }

        loading = true;
        localError = null;

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Failed to send code' }));
                throw new Error(err.error || 'Failed to send verification code');
            }

            wallet.update(w => ({ ...w, email }));
            onboardingState.set('email_otp');

        } catch (err: any) {
            console.error('OTP Send Error:', err);
            localError = err.message || 'Failed to send verification code. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md"
    transition:fade={{ duration: 200 }}
>
    <!-- Non-dismissible: no close button, propagation stops clicks -->
    <div 
        class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        on:click|stopPropagation
        transition:scale={{ start: 0.95, duration: 250 }}
    >
        <div class="mb-8 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">What's your email?</h2>
            <p class="mt-2 text-sm text-zinc-400">We use this for notifications and account recovery. We'll send a code to verify it.</p>
        </div>

        <form class="space-y-4" on:submit|preventDefault={handleSendOtp}>
            <div>
                <label for="email" class="sr-only">Email address</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email}
                    disabled={loading}
                    placeholder="you@example.com"
                    class="block w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                />
            </div>

            {#if localError}
                <div class="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400 border border-red-500/20" transition:fade>
                    {localError}
                </div>
            {/if}

            <button 
                type="submit"
                disabled={loading}
                class="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-500 p-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
                {#if loading}
                    <div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {:else}
                    Send Verification Code
                {/if}
            </button>
        </form>
    </div>
</div>

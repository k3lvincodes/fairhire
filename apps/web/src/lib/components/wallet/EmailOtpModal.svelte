<script lang="ts">
    import { createClient } from '@supabase/supabase-js';
    import { env } from '$env/dynamic/public';
    import { wallet, onboardingState } from '$lib/stores/wallet';
    import { supabase } from '$lib/supabase';
    import { fade, scale } from 'svelte/transition';

    let code = '';
    let loading = false;
    let localError: string | null = null;
    let email = $wallet.email || '';

    // Isolated client so we don't overwrite the main wallet session
    const otpSupabase = createClient(
        env.PUBLIC_SUPABASE_URL, 
        env.PUBLIC_SUPABASE_ANON_KEY, 
        { auth: { persistSession: false } }
    );

    async function handleVerifyOtp() {
        if (!code || code.length < 6) {
            localError = 'Please enter a valid 6-digit code';
            return;
        }

        loading = true;
        localError = null;

        try {
            const { error: verifyError } = await otpSupabase.auth.verifyOtp({
                email,
                token: code,
                type: 'email'
            });

            if (verifyError) throw verifyError;

            // Verified successfully! Now save it to public.users using our primary SIWS session
            const { error: dbError } = await supabase
                .from('users')
                .update({ email, email_verified: true })
                .eq('wallet_address', $wallet.address);

            if (dbError) throw dbError;

            wallet.update(w => ({ ...w, emailVerified: true }));
            onboardingState.set('username');

        } catch (err: any) {
            console.error('OTP Verify Error:', err);
            localError = err.message || 'Invalid code or failed to update profile. Please try again.';
        } finally {
            loading = false;
        }
    }

    function goBack() {
        if (!loading) {
            onboardingState.set('email_prompt');
            localError = null;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    transition:fade={{ duration: 200 }}
>
    <!-- Non-dismissible modal -->
    <div 
        class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        on:click|stopPropagation
        transition:scale={{ start: 0.95, duration: 250 }}
    >
        <button 
            on:click={goBack}
            aria-label="Go back"
            class="absolute left-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            disabled={loading}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
        </button>

        <div class="mb-8 text-center mt-2">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Check your email</h2>
            <p class="mt-2 text-sm text-zinc-400">We sent a 6-digit verification code to <span class="text-zinc-200 font-medium">{email}</span></p>
        </div>

        <form class="space-y-4" on:submit|preventDefault={handleVerifyOtp}>
            <div>
                <label for="code" class="sr-only">Verification Code</label>
                <input 
                    type="text" 
                    id="code" 
                    bind:value={code}
                    disabled={loading}
                    placeholder="000000"
                    maxlength="6"
                    class="block w-full text-center tracking-widest text-2xl font-mono rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
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
                    Verify Email
                {/if}
            </button>
        </form>
    </div>
</div>

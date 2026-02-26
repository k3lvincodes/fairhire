<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { showWalletModal, selectAndConnectWallet, wallet } from '$lib/stores/wallet';

    // Premium UI states
    let localConnectingTo: string | null = null;
    let localError: string | null = null;

    async function handleConnect(adapterName: string) {
        localConnectingTo = adapterName;
        localError = null;
        try {
            // Step 1: Check if provider exists
            const phantom = (window as any).phantom?.solana ?? (window as any).solana;
            console.log('[MODAL] Phantom provider:', phantom);
            console.log('[MODAL] window.phantom:', (window as any).phantom);
            console.log('[MODAL] window.solana:', (window as any).solana);

            if (!phantom && adapterName === 'Phantom') {
                localError = 'Phantom not detected on window. Is the extension installed and enabled?';
                return;
            }

            console.log('[MODAL] Calling selectAndConnectWallet...');
            await selectAndConnectWallet(adapterName);
            console.log('[MODAL] Connection successful');
        } catch (err: any) {
            console.error('[MODAL] Connection error:', err);
            localError = err.message || 'Connection failed';
        } finally {
            localConnectingTo = null;
        }
    }

    function close() {
        if (!localConnectingTo) {
            showWalletModal.set(false);
            localError = null;
        }
    }
</script>

{#if $showWalletModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300"
        on:click={close}
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
            on:click|stopPropagation
            transition:scale={{ start: 0.95, duration: 250 }}
        >
            <button 
                on:click={close}
                aria-label="Close"
                class="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                disabled={!!localConnectingTo}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>

            <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                    <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold tracking-tight text-white">Connect Wallet</h2>
                <p class="mt-2 text-sm text-zinc-400">Securely sign in using your Solana wallet</p>
            </div>

            <div class="space-y-3">
                <button 
                    on:click={() => handleConnect('Phantom')}
                    disabled={!!localConnectingTo}
                    class="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                >
                    <div class="flex items-center gap-4 relative z-10">
                        <!-- Phantom Icon -->
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#AB9FF2]">
                            <svg class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.996 0C5.372 0 0 5.372 0 11.996c0 6.626 5.372 12.004 11.996 12.004 6.626 0 12.004-5.378 12.004-12.004C24 5.372 18.622 0 11.996 0zm0 4.545c4.116 0 7.451 3.336 7.451 7.451 0 4.117-3.335 7.456-7.451 7.456-4.117 0-7.456-3.339-7.456-7.456 0-4.115 3.339-7.451 7.456-7.451z"/>
                                <!-- Note: Phantom logo simplified for space -->
                            </svg>
                        </div>
                        <span class="text-base font-semibold text-white">Phantom</span>
                    </div>
                    {#if localConnectingTo === 'Phantom'}
                        <div class="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                    {:else}
                        <div class="text-sm font-medium text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">Connect &rarr;</div>
                    {/if}
                </button>

                <button 
                    on:click={() => handleConnect('Solflare')}
                    disabled={!!localConnectingTo}
                    class="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-orange-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                >
                    <div class="flex items-center gap-4 relative z-10">
                        <!-- Solflare Icon Placeholder -->
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#fc6f15] to-[#FFA300]">
                            <span class="text-xl font-bold text-white tracking-widest leading-none">SF</span>
                        </div>
                        <span class="text-base font-semibold text-white">Solflare</span>
                    </div>
                    {#if localConnectingTo === 'Solflare'}
                        <div class="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                    {:else}
                        <div class="text-sm font-medium text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">Connect &rarr;</div>
                    {/if}
                </button>
            </div>

            {#if localError}
                <div class="mt-6 rounded-lg bg-red-500/10 p-4 text-center text-sm text-red-400 border border-red-500/20" transition:fade>
                    {localError}
                </div>
            {/if}

            <div class="mt-8 text-center">
                <p class="text-xs text-zinc-500">
                    By connecting a wallet, you agree to our <a href="/terms" class="text-zinc-300 hover:text-white underline decoration-zinc-600 transition-colors">Terms of Service</a>
                </p>
            </div>
        </div>
    </div>
{/if}

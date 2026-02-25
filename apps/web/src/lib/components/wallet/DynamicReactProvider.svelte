<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import React, { useEffect } from 'react';
  import { DynamicContextProvider, useDynamicContext } from '@dynamic-labs/sdk-react-core';
  import { SolanaWalletConnectors } from '@dynamic-labs/solana';
  import { env } from '$env/dynamic/public';
  import { wallet, fetchAndSetReputation } from '$lib/stores/wallet';

  let container: HTMLDivElement;
  let root: any;

  // We create a tiny React component that uses the Dynamic hook
  // to listen for connection events and bridge them back to Svelte
  const DynamicSvelteBridge = () => {
    const { setShowAuthFlow, handleLogOut } = useDynamicContext();

    useEffect(() => {
      const openModal = () => setShowAuthFlow(true);
      const doLogout = () => handleLogOut();

      document.addEventListener('open-dynamic-modal', openModal);
      document.addEventListener('logout-dynamic-wallet', doLogout);

      return () => {
        document.removeEventListener('open-dynamic-modal', openModal);
        document.removeEventListener('logout-dynamic-wallet', doLogout);
      };
    }, [setShowAuthFlow, handleLogOut]);

    return null;
  };

  onMount(() => {
    root = createRoot(container);
    
    // In production, users should set PUBLIC_DYNAMIC_ENVIRONMENT_ID
    const projectId = env.PUBLIC_DYNAMIC_ENVIRONMENT_ID || '2762a57b-faa4-41ce-9f16-abff9300e2c9'; // Fallback dummy ID

    const providerProps = {
      settings: {
        environmentId: projectId,
        walletConnectors: [SolanaWalletConnectors],
        events: {
          onAuthSuccess: (args: any) => {
            console.log('Dynamic Auth Success', args);
            const user = args.user;
            const primaryWallet = args.primaryWallet;
            
            if (primaryWallet) {
              const address = primaryWallet.address;
              wallet.set({
                connected: true,
                address,
                shortAddress: `${address.slice(0, 4)}...${address.slice(-4)}`,
                email: user?.email ?? null,
                balance: { sol: 0, usdc: 0 } // Fetch real balance later if needed
              });
              
              // This triggers the onboarding flow via OnboardingManager
              // We also fetch reputation eagerly
              fetchAndSetReputation(address);
            }
          },
          onLogout: () => {
            console.log('Dynamic Logout');
            // Disconnect handled by the store
            wallet.set({
              connected: false,
              address: null,
              shortAddress: null,
              email: null,
              balance: { sol: 0, usdc: 0 }
            });
          }
        }
      },
      children: React.createElement(DynamicSvelteBridge)
    };

    root.render(
      React.createElement(DynamicContextProvider, providerProps)
    );
  });

  onDestroy(() => {
    if (root) {
      setTimeout(() => root.unmount(), 0);
    }
  });
</script>

<div bind:this={container} class="hidden"></div>

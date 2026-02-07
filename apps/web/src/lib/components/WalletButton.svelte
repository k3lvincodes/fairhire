<script lang="ts">
  import { wallet, user, connectWallet, disconnectWallet } from '$lib/stores/wallet';
  
  let showMenu = false;
  
  function handleConnect() {
    connectWallet();
  }
  
  function handleDisconnect() {
    disconnectWallet();
    showMenu = false;
  }
  
  function toggleMenu() {
    showMenu = !showMenu;
  }
  
  function copyAddress() {
    if ($wallet.address) {
      navigator.clipboard.writeText($wallet.address);
    }
  }
</script>

{#if $wallet.connected}
  <div class="relative">
    <button 
      on:click={toggleMenu}
      class="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
    >
      <div class="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
        {$user.fairScore}
      </div>
      <span class="text-sm font-medium">{$wallet.shortAddress}</span>
      <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    
    {#if showMenu}
      <div class="absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
        <!-- Wallet Info -->
        <div class="p-4 border-b border-neutral-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold">
              {$user.fairScore}
            </div>
            <div>
              <div class="font-medium">FairScore: {$user.fairScore}</div>
              <div class="text-xs text-emerald-400 capitalize">{$user.tier} Tier</div>
            </div>
          </div>
          <button 
            on:click={copyAddress}
            class="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <span class="font-mono">{$wallet.shortAddress}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
        
        <!-- Balances -->
        <div class="p-4 border-b border-neutral-800 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-400">SOL</span>
            <span class="font-medium">{$wallet.balance.sol.toFixed(2)}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-400">USDC</span>
            <span class="font-medium">${$wallet.balance.usdc.toFixed(2)}</span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="p-2">
          <a href="/app/profile" class="block px-3 py-2 text-sm hover:bg-neutral-800 rounded-lg transition-colors">
            View Profile
          </a>
          <a href="/app/settings" class="block px-3 py-2 text-sm hover:bg-neutral-800 rounded-lg transition-colors">
            Settings
          </a>
          <button 
            on:click={handleDisconnect}
            class="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <button 
    on:click={handleConnect}
    class="px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 text-sm font-semibold transition-colors"
  >
    Connect Wallet
  </button>
{/if}

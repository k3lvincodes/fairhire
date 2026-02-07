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
      class="flex items-center gap-2 px-3 py-2 bg-brand-white/5 border border-brand-white/10 rounded-lg hover:bg-brand-white/10 transition-colors"
    >
      <div class="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(108,59,170,0.5)]">
        {$user.fairScore}
      </div>
      <span class="text-sm font-medium font-mono text-brand-white">{$wallet.shortAddress}</span>
      <svg class="w-4 h-4 text-brand-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    
    {#if showMenu}
      <div class="absolute right-0 top-full mt-2 w-72 bg-brand-black border border-brand-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
        <!-- Wallet Info -->
        <div class="p-5 border-b border-brand-white/10">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-lg font-bold text-white shadow-[0_0_15px_rgba(108,59,170,0.5)]">
              {$user.fairScore}
            </div>
            <div>
              <div class="font-bold text-brand-white text-lg">FairScore: {$user.fairScore}</div>
              <div class="text-xs text-brand-purple font-medium uppercase tracking-wider">{$user.tier} Tier</div>
            </div>
          </div>
          <button 
            on:click={copyAddress}
            class="flex items-center gap-2 text-sm text-brand-white/60 hover:text-brand-white transition-colors w-full bg-brand-white/5 p-2 rounded-lg border border-brand-white/5 hover:border-brand-white/20"
          >
            <span class="font-mono">{$wallet.shortAddress}</span>
            <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
        
        <!-- Balances -->
        <div class="p-5 border-b border-brand-white/10 space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-brand-white/60">SOL</span>
            <span class="font-mono font-medium">{$wallet.balance.sol.toFixed(2)}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-brand-white/60">USDC</span>
            <span class="font-mono font-medium text-brand-white">${$wallet.balance.usdc.toFixed(2)}</span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="p-2 bg-brand-white/5">
          <a href="/app/profile" class="block px-3 py-2.5 text-sm hover:bg-brand-white/10 rounded-lg transition-colors text-brand-white/80 hover:text-white">
            View Profile
          </a>
          <a href="/app/settings" class="block px-3 py-2.5 text-sm hover:bg-brand-white/10 rounded-lg transition-colors text-brand-white/80 hover:text-white">
            Settings
          </a>
          <button 
            on:click={handleDisconnect}
            class="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
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
    class="px-5 py-2.5 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-hover text-sm font-bold transition-all shadow-[0_0_20px_rgba(108,59,170,0.3)] hover:shadow-[0_0_25px_rgba(108,59,170,0.5)]"
  >
    Connect Wallet
  </button>
{/if}

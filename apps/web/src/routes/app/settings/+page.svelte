<script lang="ts">
  import { wallet, user } from '$lib/stores/wallet';
  
  let notifications = {
    taskClaimed: true,
    taskSubmitted: true,
    disputeOpened: true,
    paymentReceived: true,
    marketingEmails: false
  };
  
  let display = {
    darkMode: true,
    compactView: false,
    showBalances: true
  };
  
  let safety = {
    requireSigningForWithdraw: true,
    autoLockTimeout: 15
  };
</script>

<div class="max-w-2xl mx-auto pb-24">
  <h1 class="text-3xl font-bold font-display mb-8 text-brand-white">Settings</h1>
  
  <!-- Notification Settings -->
  <section class="mb-10">
    <h2 class="text-lg font-bold font-display mb-4 flex items-center gap-2 text-brand-white">
      <svg class="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
      Notifications
    </h2>
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/5 divide-y divide-brand-white/5 overflow-hidden">
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Task Claimed</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">When someone claims your posted task</div>
        </div>
        <input type="checkbox" bind:checked={notifications.taskClaimed} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Task Submitted</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">When work is submitted for your review</div>
        </div>
        <input type="checkbox" bind:checked={notifications.taskSubmitted} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Dispute Opened</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">When a dispute is filed on your task</div>
        </div>
        <input type="checkbox" bind:checked={notifications.disputeOpened} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Payment Received</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">When you receive payment for completed work</div>
        </div>
        <input type="checkbox" bind:checked={notifications.paymentReceived} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
    </div>
  </section>

  <!-- Display Preferences -->
  <section class="mb-10">
    <h2 class="text-lg font-bold font-display mb-4 flex items-center gap-2 text-brand-white">
      <svg class="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      Display
    </h2>
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/5 divide-y divide-brand-white/5 overflow-hidden">
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Dark Mode</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">Use dark theme (recommended)</div>
        </div>
        <input type="checkbox" bind:checked={display.darkMode} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Compact View</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">Show more tasks per page</div>
        </div>
        <input type="checkbox" bind:checked={display.compactView} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Show Balances</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">Display wallet balances in header</div>
        </div>
        <input type="checkbox" bind:checked={display.showBalances} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
    </div>
  </section>

  <!-- Wallet Preferences -->
  <section class="mb-10">
    <h2 class="text-lg font-bold font-display mb-4 flex items-center gap-2 text-brand-white">
      <svg class="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
      Wallet
    </h2>
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/5 p-5">
      {#if $wallet.connected}
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="text-sm text-brand-white/50 mb-1">Connected Wallet</div>
            <div class="font-mono text-brand-white bg-brand-black px-3 py-1 rounded border border-brand-white/10 font-medium">{$wallet.address}</div>
          </div>
          <button class="px-4 py-2 text-sm bg-brand-white/10 rounded-lg hover:bg-brand-white/20 transition-colors text-brand-white font-medium">
            Copy
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="p-4 bg-brand-black rounded-xl border border-brand-white/5">
            <div class="text-sm text-brand-white/50 mb-1">SOL Balance</div>
            <div class="text-lg font-bold font-mono text-brand-white">{$wallet.balance.sol.toFixed(4)}</div>
          </div>
          <div class="p-4 bg-brand-black rounded-xl border border-brand-white/5">
            <div class="text-sm text-brand-white/50 mb-1">USDC Balance</div>
            <div class="text-lg font-bold font-mono text-brand-white">${$wallet.balance.usdc.toFixed(2)}</div>
          </div>
        </div>
        <div class="text-sm text-brand-white/40 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          Network: <span class="text-brand-white/70">Solana Mainnet</span>
        </div>
      {:else}
        <p class="text-brand-white/40 italic">No wallet connected</p>
      {/if}
    </div>
  </section>

  <!-- Safety Controls -->
  <section class="mb-10">
    <h2 class="text-lg font-bold font-display mb-4 flex items-center gap-2 text-brand-white">
      <svg class="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      Safety
    </h2>
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/5 divide-y divide-brand-white/5 overflow-hidden">
      <label class="flex items-center justify-between p-5 cursor-pointer hover:bg-brand-white/5 transition-colors group">
        <div>
          <div class="font-medium text-brand-white">Require Signing for Withdrawals</div>
          <div class="text-sm text-brand-white/50 group-hover:text-brand-white/70 transition-colors">Extra confirmation for fund movements</div>
        </div>
        <input type="checkbox" bind:checked={safety.requireSigningForWithdraw} class="w-5 h-5 rounded bg-brand-white/10 border-brand-white/20 text-brand-purple focus:ring-brand-purple focus:ring-offset-brand-black transition-all" />
      </label>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-brand-white">Auto-Lock Timeout</div>
            <div class="text-sm text-brand-white/50">Disconnect after inactivity</div>
          </div>
          <select bind:value={safety.autoLockTimeout} class="bg-brand-black border border-brand-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple text-brand-white">
            <option value={5}>5 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
            <option value={0}>Never</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <!-- Danger Zone -->
  <section>
    <h2 class="text-lg font-bold font-display mb-4 text-red-500 flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      Danger Zone
    </h2>
    <div class="bg-red-500/5 border border-red-500/20 rounded-xl p-5 backdrop-blur-sm">
      <p class="text-sm text-brand-white/60 mb-4">Clear all local data and disconnect wallet. This action cannot be undone.</p>
      <button class="px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium text-sm">
        Clear All Data
      </button>
    </div>
  </section>
</div>

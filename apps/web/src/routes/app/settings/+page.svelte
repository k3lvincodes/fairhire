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

<div class="max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-8">Settings</h1>
  
  <!-- Notification Settings -->
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
      Notifications
    </h2>
    <div class="bg-neutral-800/50 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Task Claimed</div>
          <div class="text-sm text-neutral-400">When someone claims your posted task</div>
        </div>
        <input type="checkbox" bind:checked={notifications.taskClaimed} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Task Submitted</div>
          <div class="text-sm text-neutral-400">When work is submitted for your review</div>
        </div>
        <input type="checkbox" bind:checked={notifications.taskSubmitted} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Dispute Opened</div>
          <div class="text-sm text-neutral-400">When a dispute is filed on your task</div>
        </div>
        <input type="checkbox" bind:checked={notifications.disputeOpened} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Payment Received</div>
          <div class="text-sm text-neutral-400">When you receive payment for completed work</div>
        </div>
        <input type="checkbox" bind:checked={notifications.paymentReceived} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
    </div>
  </section>

  <!-- Display Preferences -->
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      Display
    </h2>
    <div class="bg-neutral-800/50 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Dark Mode</div>
          <div class="text-sm text-neutral-400">Use dark theme (recommended)</div>
        </div>
        <input type="checkbox" bind:checked={display.darkMode} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Compact View</div>
          <div class="text-sm text-neutral-400">Show more tasks per page</div>
        </div>
        <input type="checkbox" bind:checked={display.compactView} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Show Balances</div>
          <div class="text-sm text-neutral-400">Display wallet balances in header</div>
        </div>
        <input type="checkbox" bind:checked={display.showBalances} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
    </div>
  </section>

  <!-- Wallet Preferences -->
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
      Wallet
    </h2>
    <div class="bg-neutral-800/50 rounded-xl border border-neutral-800 p-4">
      {#if $wallet.connected}
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm text-neutral-400">Connected Wallet</div>
            <div class="font-mono">{$wallet.address}</div>
          </div>
          <button class="px-3 py-1.5 text-sm bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors">
            Copy
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="p-3 bg-neutral-900 rounded-lg">
            <div class="text-sm text-neutral-400">SOL Balance</div>
            <div class="text-lg font-semibold">{$wallet.balance.sol.toFixed(4)}</div>
          </div>
          <div class="p-3 bg-neutral-900 rounded-lg">
            <div class="text-sm text-neutral-400">USDC Balance</div>
            <div class="text-lg font-semibold">${$wallet.balance.usdc.toFixed(2)}</div>
          </div>
        </div>
        <div class="text-sm text-neutral-500">
          Network: <span class="text-neutral-300">Solana Mainnet</span>
        </div>
      {:else}
        <p class="text-neutral-400">No wallet connected</p>
      {/if}
    </div>
  </section>

  <!-- Safety Controls -->
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      Safety
    </h2>
    <div class="bg-neutral-800/50 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
      <label class="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors">
        <div>
          <div class="font-medium">Require Signing for Withdrawals</div>
          <div class="text-sm text-neutral-400">Extra confirmation for fund movements</div>
        </div>
        <input type="checkbox" bind:checked={safety.requireSigningForWithdraw} class="w-5 h-5 rounded bg-neutral-700 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900" />
      </label>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">Auto-Lock Timeout</div>
            <div class="text-sm text-neutral-400">Disconnect after inactivity (minutes)</div>
          </div>
          <select bind:value={safety.autoLockTimeout} class="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-500">
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
    <h2 class="text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
    <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
      <p class="text-sm text-neutral-300 mb-4">Clear all local data and disconnect wallet. This action cannot be undone.</p>
      <button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
        Clear All Data
      </button>
    </div>
  </section>
</div>

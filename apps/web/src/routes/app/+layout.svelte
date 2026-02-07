<script lang="ts">
  import { page } from '$app/stores';
  import WalletButton from '$lib/components/WalletButton.svelte';
  import { user } from '$lib/stores/wallet';
</script>

<div class="flex h-screen bg-neutral-900 text-neutral-100">
  <!-- Sidebar (Desktop) -->
  <aside class="w-64 border-r border-neutral-800 p-4 hidden md:flex flex-col">
    <a href="/app/tasks" class="mb-8 px-2 font-bold text-xl text-white hover:text-neutral-300 transition-colors">FairHire</a>
    <nav class="space-y-1 flex-1">
      <a href="/app/tasks" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors {$page.url.pathname.startsWith('/app/tasks') ? 'bg-neutral-800 text-white' : 'text-neutral-400'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        Tasks
      </a>
      <a href="/app/post" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors {$page.url.pathname === '/app/post' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/></svg>
        Post Task
      </a>
      <a href="/app/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors {$page.url.pathname === '/app/dashboard' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        Dashboard
      </a>
      <a href="/app/profile" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors {$page.url.pathname === '/app/profile' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        Profile
      </a>
      <a href="/app/settings" class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors {$page.url.pathname === '/app/settings' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        Settings
      </a>
    </nav>
    <!-- FairScore Badge (Desktop) -->
    <div class="mt-auto pt-4 border-t border-neutral-800">
      <div class="flex items-center gap-3 px-3 py-2 bg-neutral-800/50 rounded-lg">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm">{$user.fairScore}</div>
        <div>
          <div class="text-sm font-medium">FairScore</div>
          <div class="text-xs text-emerald-400 capitalize">{$user.tier} Tier</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="h-16 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-900/80 backdrop-blur-sm">
      <a href="/app/tasks" class="md:hidden font-bold text-lg">FairHire</a>
      <div class="flex-1 max-w-xl mx-4 hidden md:block">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="search" placeholder="Search tasks..." class="w-full bg-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600 placeholder-neutral-500" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Mobile FairScore -->
        <div class="md:hidden flex items-center gap-2 px-2 py-1 bg-neutral-800 rounded-full">
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs">{$user.fairScore}</div>
        </div>
        <!-- Notification Bell -->
        <button class="p-2 hover:bg-neutral-800 rounded-lg transition-colors relative">
          <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <!-- Connect Wallet Button -->
        <WalletButton />
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-4 md:p-6">
      <slot />
    </div>

    <!-- Bottom Nav (Mobile) -->
    <nav class="md:hidden border-t border-neutral-800 h-16 flex items-center justify-around bg-neutral-900 safe-area-inset-bottom">
      <a href="/app/tasks" class="flex flex-col items-center gap-1 {$page.url.pathname.startsWith('/app/tasks') ? 'text-white' : 'text-neutral-500'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <span class="text-xs">Tasks</span>
      </a>
      <a href="/app/post" class="flex flex-col items-center gap-1 {$page.url.pathname === '/app/post' ? 'text-white' : 'text-neutral-500'}">
        <div class="w-10 h-10 -mt-4 bg-white rounded-full flex items-center justify-center text-neutral-900">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        </div>
        <span class="text-xs -mt-1">Post</span>
      </a>
      <a href="/app/dashboard" class="flex flex-col items-center gap-1 {$page.url.pathname === '/app/dashboard' ? 'text-white' : 'text-neutral-500'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        <span class="text-xs">Dash</span>
      </a>
      <a href="/app/profile" class="flex flex-col items-center gap-1 {$page.url.pathname === '/app/profile' ? 'text-white' : 'text-neutral-500'}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span class="text-xs">Profile</span>
      </a>
    </nav>
  </main>
</div>

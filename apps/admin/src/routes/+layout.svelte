<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import WalletButton from '$lib/components/WalletButton.svelte';
</script>

<div class="min-h-screen bg-brand-black text-brand-white font-sans selection:bg-brand-purple selection:text-white">
  <!-- Admin Header -->
  <header class="border-b border-brand-white/10 bg-brand-black/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img src="/logo.png" alt="FairHire Admin" class="h-8 w-8 rounded-lg" />
        <span class="font-bold text-xl font-display tracking-tight">FairHire</span>
        <span class="px-2 py-0.5 text-xs font-bold font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded uppercase tracking-wider">ADMIN</span>
      </div>
      <nav class="flex items-center gap-8 text-sm font-medium">
        <a href="/" class="transition-colors { $page.url.pathname === '/' ? 'text-brand-white' : 'text-brand-white/60 hover:text-brand-white' }">Dashboard</a>
        <a href="/disputes" class="transition-colors { $page.url.pathname.startsWith('/disputes') ? 'text-brand-white' : 'text-brand-white/60 hover:text-brand-white' }">Disputes</a>
        <a href="/users" class="transition-colors { $page.url.pathname.startsWith('/users') ? 'text-brand-white' : 'text-brand-white/60 hover:text-brand-white' }">Users</a>
        <a href="/settings" class="transition-colors { $page.url.pathname.startsWith('/settings') ? 'text-brand-white' : 'text-brand-white/60 hover:text-brand-white' }">Settings</a>
      </nav>
      <div class="flex items-center gap-4">
        <WalletButton />
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-8">
    <slot />
  </main>
</div>

<script lang="ts">
  // Landing page - public, no wallet required
</script>

<div class="min-h-screen bg-neutral-950 text-white">
  <!-- Hero Section -->
  <header class="border-b border-neutral-800">
    <nav class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="font-bold text-2xl">FairHire</div>
      <div class="flex items-center gap-4">
        <a href="/app/tasks" class="text-neutral-400 hover:text-white transition-colors">Browse Tasks</a>
        <a href="/app/tasks" class="px-5 py-2.5 bg-white text-neutral-900 rounded-lg font-semibold hover:bg-neutral-200 transition-colors">
          Launch App
        </a>
      </div>
    </nav>
  </header>

  <!-- Hero -->
  <section class="max-w-7xl mx-auto px-6 py-24 md:py-32">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-6">
        <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        Built on Solana
      </div>
      <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
        Get Paid Instantly.<br/>
        <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Reputation is Collateral.</span>
      </h1>
      <p class="text-xl text-neutral-400 mb-8 leading-relaxed">
        The first reputation-gated task marketplace on Solana. High FairScore? Skip escrow and get paid the second you submit.
      </p>
      <div class="flex flex-wrap gap-4">
        <a href="/app/tasks" class="px-8 py-4 bg-white text-neutral-900 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-colors">
          Start Earning
        </a>
        <a href="/app/post" class="px-8 py-4 bg-neutral-800 text-white rounded-xl font-bold text-lg hover:bg-neutral-700 transition-colors border border-neutral-700">
          Post a Task
        </a>
      </div>
    </div>
  </section>

  <!-- Three Pillars -->
  <section class="border-t border-neutral-800 py-24">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-center mb-16">Why FairHire?</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Pillar 1 -->
        <div class="p-8 bg-neutral-900 rounded-2xl border border-neutral-800">
          <div class="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="text-xl font-bold mb-3">Instant Pay</h3>
          <p class="text-neutral-400 leading-relaxed">
            Top performers with 85+ FairScore get paid immediately upon submission. No waiting, no approval needed.
          </p>
        </div>
        <!-- Pillar 2 -->
        <div class="p-8 bg-neutral-900 rounded-2xl border border-neutral-800">
          <div class="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h3 class="text-xl font-bold mb-3">Dynamic Escrow</h3>
          <p class="text-neutral-400 leading-relaxed">
            Settlement terms adjust based on your reputation. Build trust, unlock faster payments.
          </p>
        </div>
        <!-- Pillar 3 -->
        <div class="p-8 bg-neutral-900 rounded-2xl border border-neutral-800">
          <div class="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="text-xl font-bold mb-3">On-chain Proof</h3>
          <p class="text-neutral-400 leading-relaxed">
            Your FairScore is portable across the Solana ecosystem. Take your reputation anywhere.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Tier System -->
  <section class="border-t border-neutral-800 py-24">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-center mb-4">Reputation Tiers</h2>
      <p class="text-neutral-400 text-center mb-16 max-w-xl mx-auto">Your FairScore determines your payment terms. Higher score = faster money.</p>
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Alpha -->
        <div class="p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/30">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center font-bold">α</div>
            <div>
              <div class="font-bold text-lg">Alpha (Sovereign)</div>
              <div class="text-sm text-emerald-400">FairScore 85+</div>
            </div>
          </div>
          <p class="text-neutral-300 mb-4">Instant Auto-Pay. Funds release immediately upon submission.</p>
          <div class="text-emerald-400 font-semibold">⚡ 0 wait time</div>
        </div>
        <!-- Trusted -->
        <div class="p-6 bg-neutral-900 rounded-2xl border border-neutral-800">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center font-bold text-amber-400">T</div>
            <div>
              <div class="font-bold text-lg">Trusted</div>
              <div class="text-sm text-amber-400">FairScore 70-84</div>
            </div>
          </div>
          <p class="text-neutral-300 mb-4">Fast Track. 12-hour automated dispute window before release.</p>
          <div class="text-amber-400 font-semibold">⏱ 12 hour window</div>
        </div>
        <!-- Builder -->
        <div class="p-6 bg-neutral-900 rounded-2xl border border-neutral-800">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center font-bold text-neutral-400">B</div>
            <div>
              <div class="font-bold text-lg">Builder</div>
              <div class="text-sm text-neutral-400">FairScore &lt;70</div>
            </div>
          </div>
          <p class="text-neutral-300 mb-4">Standard Escrow. Manual approval required from poster.</p>
          <div class="text-neutral-400 font-semibold">🔒 Manual release</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="border-t border-neutral-800 py-24">
    <div class="max-w-3xl mx-auto px-6 text-center">
      <h2 class="text-4xl font-bold mb-6">Ready to earn on your terms?</h2>
      <p class="text-xl text-neutral-400 mb-8">Connect your wallet and start building your on-chain reputation today.</p>
      <a href="/app/tasks" class="inline-flex px-8 py-4 bg-white text-neutral-900 rounded-xl font-bold text-lg hover:bg-neutral-200 transition-colors">
        Launch FairHire
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-neutral-800 py-12">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="font-bold text-xl">FairHire</div>
      <div class="flex items-center gap-6 text-neutral-400 text-sm">
        <a href="#" class="hover:text-white transition-colors">Documentation</a>
        <a href="#" class="hover:text-white transition-colors">GitHub</a>
        <a href="#" class="hover:text-white transition-colors">Discord</a>
        <a href="#" class="hover:text-white transition-colors">Terms</a>
      </div>
      <div class="text-neutral-500 text-sm">© 2026 FairHire. All rights reserved.</div>
    </div>
  </footer>
</div>

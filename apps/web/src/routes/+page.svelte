<script lang="ts">
  // Landing page - public, no wallet required
  import viewport from '$lib/actions/viewport';
  import Typewriter from '$lib/components/Typewriter.svelte';
  import HeroBackground from '$lib/components/HeroBackground.svelte';
  import ParticleBackground from '$lib/components/ParticleBackground.svelte';
</script>

<div class="min-h-screen bg-brand-black text-brand-white selection:bg-brand-purple selection:text-white">
  <!-- Hero Section -->
  <header class="border-b border-brand-white/10 backdrop-blur-md sticky top-0 z-50 bg-brand-black/80">
    <nav class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="/" class="font-bold text-2xl font-display tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="FairHire" class="w-8 h-8 rounded-lg" />
        FairHire
      </a>
      <div class="flex items-center gap-6">
        <a href="/app/tasks" class="hidden md:block text-brand-white/70 hover:text-brand-white transition-colors font-medium">Browse Tasks</a>
        <a href="/app/dashboard" class="px-5 py-2.5 bg-brand-white text-brand-black rounded-lg font-bold hover:bg-brand-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] whitespace-nowrap">
          Launch App
        </a>
      </div>
    </nav>
  </header>

  <!-- Hero -->
  <section class="min-h-screen flex items-center max-w-7xl mx-auto px-6 py-24 md:py-32 relative overflow-hidden">
    <!-- WebGL Background -->
    <div class="absolute inset-0 z-0">
        <HeroBackground />
        <!-- Gradient Overlay for readability -->
        <div class="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-transparent to-brand-black pointer-events-none"></div>
    </div>
    
    <div class="max-w-4xl relative z-10">
      <div 
        use:viewport 
        class="animate-on-scroll inline-flex items-center gap-2 px-3 py-1 bg-brand-white/5 border border-brand-white/10 rounded-full text-brand-white/80 text-sm mb-6 font-mono backdrop-blur-sm"
      >
        <span class="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></span>
        Built on Solana
      </div>
      <h1 
        use:viewport 
        class="animate-on-scroll delay-100 text-4xl md:text-7xl font-bold leading-tight mb-8 font-display tracking-tight min-h-[160px] md:min-h-[220px]"
      >
        <Typewriter 
          lines={[
            { text: 'Get Paid Instantly.', class: 'text-brand-white' },
            { text: 'Reputation is Collateral.', class: 'text-brand-purple' }
          ]}
          waitTime={2500}
        />
      </h1>
      <p 
        use:viewport 
        class="animate-on-scroll delay-200 text-lg md:text-2xl text-brand-white/60 mb-10 leading-relaxed max-w-2xl font-light"
      >
        The first reputation-gated work marketplace. High FairScore? Skip escrow and get paid the second you submit.
      </p>
      <div 
        use:viewport 
        class="animate-on-scroll delay-300 flex flex-wrap gap-4"
      >
        <a href="/app/dashboard" class="w-full md:w-auto px-8 py-4 bg-brand-white text-brand-black rounded-lg font-bold text-lg hover:bg-brand-white/90 transition-all shadow-lg flex items-center justify-center gap-2">
          Start Earning
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
        <a href="/app/post" class="w-full md:w-auto px-8 py-4 bg-brand-white/5 text-brand-white rounded-lg font-bold text-lg hover:bg-brand-white/10 transition-colors border border-brand-white/10 backdrop-blur-sm text-center">
          Post a Task
        </a>
      </div>
    </div>
  </section>

  <!-- Content Sections Wrapper -->
  <div class="relative overflow-hidden">
    <!-- Particle Background -->
    <div class="absolute inset-0 z-0">
        <ParticleBackground />
        <!-- Slight overlay to ensure contrast if needed, or let particles shine -->
    </div>

    <!-- Three Pillars -->
    <section class="border-t border-brand-white/10 py-24 bg-transparent relative z-10">
      <div class="max-w-7xl mx-auto px-6">
        <h2 
          use:viewport 
          class="animate-on-scroll text-3xl font-bold font-display mb-16 flex items-center gap-4"
        >
          <span class="w-8 h-1 bg-brand-purple rounded-full"></span>
          Why FairHire?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Pillar 1 -->
          <div 
            use:viewport 
            class="animate-on-scroll delay-100 p-8 bg-brand-white/5 rounded-xl border border-brand-white/5 hover:border-brand-purple/50 transition-colors group"
          >
            <div class="w-14 h-14 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <svg class="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="text-xl font-bold mb-3 font-display">Instant Pay</h3>
            <p class="text-brand-white/60 leading-relaxed">
              Top performers with 85+ FairScore get paid immediately upon submission. No waiting, no approval needed.
            </p>
          </div>
          <!-- Pillar 2 -->
          <div 
            use:viewport 
            class="animate-on-scroll delay-200 p-8 bg-brand-white/5 rounded-xl border border-brand-white/5 hover:border-brand-purple/50 transition-colors group"
          >
            <div class="w-14 h-14 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
              <svg class="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h3 class="text-xl font-bold mb-3 font-display">Dynamic Escrow</h3>
            <p class="text-brand-white/60 leading-relaxed">
              Settlement terms adjust based on your reputation. Build trust, unlock faster payments.
            </p>
          </div>
          <!-- Pillar 3 -->
          <div 
            use:viewport 
            class="animate-on-scroll delay-300 p-8 bg-brand-white/5 rounded-xl border border-brand-white/5 hover:border-brand-purple/50 transition-colors group"
          >
            <div class="w-14 h-14 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-6 border border-brand-purple/20 group-hover:bg-brand-purple/20 transition-colors">
              <svg class="w-7 h-7 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="text-xl font-bold mb-3 font-display">On-chain Proof</h3>
            <p class="text-brand-white/60 leading-relaxed">
              Your FairScore is portable across the Solana ecosystem. Take your reputation anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tier System -->
    <section class="border-t border-brand-white/10 py-24 bg-transparent relative z-10">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-brand-purple/5 opacity-50 -z-10"></div>
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center mb-16">
          <h2 
            use:viewport 
            class="animate-on-scroll text-3xl font-bold font-display mb-4"
          >
            Reputation Tiers
          </h2>
          <p 
            use:viewport 
            class="animate-on-scroll delay-100 text-brand-white/60 max-w-xl mx-auto"
          >
            Your FairScore determines your payment terms. Higher score = faster money.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Alpha -->
          <div 
            use:viewport 
            class="animate-on-scroll delay-200 p-8 bg-gradient-to-br from-brand-white/5 to-brand-white/0 rounded-xl border border-brand-white/10 hover:border-brand-white/20 transition-all shadow-2xl relative overflow-hidden group"
          >
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div class="flex items-center gap-4 mb-6 relative">
              <div class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]">α</div>
              <div>
                <div class="font-bold text-lg font-display">Alpha (Sovereign)</div>
                <div class="text-sm text-emerald-400 font-mono">FairScore 85+</div>
              </div>
            </div>
            <p class="text-brand-white/70 mb-6">Instant Auto-Pay. Funds release immediately upon submission.</p>
            <div class="text-emerald-400 font-bold flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              0 wait time
            </div>
          </div>
          <!-- Trusted -->
          <div 
            use:viewport 
            class="animate-on-scroll delay-300 p-8 bg-brand-white/5 rounded-xl border border-brand-white/10 hover:border-brand-white/20 transition-all"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center font-bold text-amber-400 text-xl border border-amber-500/30">T</div>
              <div>
                <div class="font-bold text-lg font-display">Trusted</div>
                <div class="text-sm text-amber-400 font-mono">FairScore 70-84</div>
              </div>
            </div>
            <p class="text-brand-white/70 mb-6">Fast Track. 12-hour automated dispute window before release.</p>
            <div class="text-amber-400 font-bold flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              12 hour window
            </div>
          </div>
          <!-- Builder -->
          <div 
            use:viewport 
            class="animate-on-scroll delay-400 p-8 bg-brand-white/5 rounded-xl border border-brand-white/10 hover:border-brand-white/20 transition-all"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-brand-white/20 rounded-lg flex items-center justify-center font-bold text-brand-white/60 text-xl border border-brand-white/10">B</div>
              <div>
                <div class="font-bold text-lg font-display">Builder</div>
                <div class="text-sm text-brand-white/40 font-mono">FairScore &lt;70</div>
              </div>
            </div>
            <p class="text-brand-white/70 mb-6">Standard Escrow. Manual approval required from poster.</p>
            <div class="text-brand-white/40 font-bold flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Manual release
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-brand-white/10 py-24 bg-transparent relative z-10">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 
          use:viewport 
          class="animate-on-scroll text-4xl font-bold mb-6 font-display"
        >
          Ready to earn on your terms?
        </h2>
        <p 
          use:viewport 
          class="animate-on-scroll delay-100 text-xl text-brand-white/60 mb-10"
        >
          Connect your wallet and start building your on-chain reputation today.
        </p>
        <a 
          use:viewport 
          href="/app/dashboard" 
          class="animate-on-scroll delay-200 inline-flex px-8 py-4 bg-brand-white text-brand-black rounded-lg font-bold text-lg hover:bg-brand-white/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          Launch FairHire
        </a>
      </div>
    </section>

  </div>

  <!-- Footer -->
  <footer class="border-t border-brand-white/10 py-12 bg-brand-black/90 relative z-10">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <a href="/" class="font-bold text-xl font-display flex items-center gap-2 hover:opacity-80 transition-opacity">
         <img src="/logo.png" alt="FairHire" class="w-6 h-6 grayscale hover:grayscale-0 transition-all" />
         FairHire
      </a>
      <div class="flex items-center gap-8 text-brand-white/40 text-sm font-medium">
        <a href="#" class="hover:text-brand-white transition-colors">Documentation</a>
        <a href="#" class="hover:text-brand-white transition-colors">GitHub</a>
        <a href="#" class="hover:text-brand-white transition-colors">Discord</a>
        <a href="#" class="hover:text-brand-white transition-colors">Terms</a>
      </div>
      <div class="text-brand-white/20 text-sm">© 2026 FairHire. All rights reserved.</div>
    </div>
  </footer>
</div>

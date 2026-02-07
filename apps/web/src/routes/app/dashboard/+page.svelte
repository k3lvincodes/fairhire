<h1 class="text-3xl font-bold mb-8 font-display text-brand-white">Dashboard</h1>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Worker View -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-brand-white/80 font-display">My Work</h2>
    
    <!-- Active Task -->
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-6 backdrop-blur-sm hover:bg-brand-white/[0.07] transition-all">
      <div class="flex items-center gap-2 text-sm text-amber-400 mb-3 font-mono">
        <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        In Progress
      </div>
      <h3 class="font-bold text-lg mb-2 text-brand-white font-display">Fix Rust compilation error in DeFi protocol</h3>
      <div class="flex items-center justify-between text-sm mb-6">
        <span class="text-brand-white/50 font-mono">1h 45m remaining</span>
        <span class="font-bold text-brand-white font-mono text-lg">$500</span>
      </div>
      <button class="w-full py-3 bg-brand-white text-brand-black rounded-lg font-bold hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
        Submit Work
      </button>
    </div>

    <!-- Empty State -->
    <div class="bg-brand-white/[0.02] p-8 rounded-xl border border-dashed border-brand-white/10 text-center hover:bg-brand-white/[0.04] transition-colors">
      <p class="text-brand-white/40 mb-3 font-medium">Looking for more work?</p>
      <a href="/app/tasks" class="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple-hover font-bold transition-colors">
        Browse Tasks
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
    </div>
  </section>

  <!-- Poster View -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-brand-white/80 font-display">My Bounties</h2>
    
    <!-- Pending Review -->
    <div class="bg-brand-white/5 rounded-xl border border-brand-white/10 p-6 backdrop-blur-sm hover:bg-brand-white/[0.07] transition-all">
      <div class="flex items-center gap-2 text-sm text-cyan-400 mb-3 font-mono">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        Awaiting Review
      </div>
      <h3 class="font-bold text-lg mb-2 text-brand-white font-display">Design landing page for NFT marketplace</h3>
      <div class="flex items-center justify-between text-sm mb-6">
        <span class="text-brand-white/50">Submitted by <span class="font-mono text-brand-white/70">0xAB...CD12</span></span>
        <span class="font-bold text-brand-white font-mono text-lg">$1,200</span>
      </div>
      <div class="flex gap-3">
        <button class="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/20">
          Approve
        </button>
        <button class="flex-1 py-2.5 bg-brand-white/10 text-brand-white rounded-lg font-bold hover:bg-brand-white/20 transition-colors">
          Dispute
        </button>
      </div>
    </div>

    <!-- Create New -->
    <a href="/app/post" class="block bg-brand-white/[0.02] p-8 rounded-xl border border-dashed border-brand-white/10 text-center hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all group">
      <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-white/5 flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors border border-brand-white/10">
        <svg class="w-6 h-6 text-brand-white/40 group-hover:text-brand-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      </div>
      <p class="text-brand-white font-bold group-hover:text-brand-purple transition-colors">Post New Task</p>
    </a>
  </section>
</div>

<div class="max-w-2xl mx-auto pb-12">
  <h1 class="text-3xl font-bold font-display mb-8 text-brand-white">Create New Task</h1>
  
  <form class="space-y-6">
    <div class="space-y-2">
      <label for="title" class="block text-sm font-bold text-brand-white/80">Task Title</label>
      <input id="title" type="text" class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30" placeholder="e.g. Fix Rust compilation error" />
    </div>
    
    <div class="space-y-2">
      <label for="description" class="block text-sm font-bold text-brand-white/80">Description</label>
      <textarea id="description" rows="5" class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30" placeholder="Describe the task details, requirements, and acceptance criteria..."></textarea>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="bounty" class="block text-sm font-bold text-brand-white/80">Bounty (USDC)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/40 font-mono">$</span>
          <input id="bounty" type="number" class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 pl-8 text-brand-white font-mono focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all placeholder-brand-white/30" placeholder="0.00" />
        </div>
      </div>
      <div class="space-y-2">
        <label for="deadline" class="block text-sm font-bold text-brand-white/80">Time Limit</label>
        <select id="deadline" class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg p-3 text-brand-white focus:outline-none focus:bg-brand-white/10 focus:border-brand-purple/50 transition-all appearance-none cursor-pointer">
          <option class="bg-brand-black">24 Hours</option>
          <option class="bg-brand-black">3 Days</option>
          <option class="bg-brand-black">1 Week</option>
        </select>
      </div>
    </div>

    <div class="space-y-3">
      <label class="block text-sm font-bold text-brand-white/80">Minimum FairScore Required</label>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button type="button" class="p-4 border border-brand-white/10 rounded-xl hover:border-brand-purple/50 hover:bg-brand-white/5 transition-all text-left bg-brand-white/[0.02]">
          <div class="font-bold text-lg text-brand-white">85+</div>
          <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">Instant Pay</div>
        </button>
        <button type="button" class="p-4 border-2 border-amber-500/50 rounded-xl bg-amber-500/10 text-left relative overflow-hidden">
          <div class="font-bold text-lg text-amber-500">70+</div>
          <div class="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1">Fast Track</div>
          <div class="absolute inset-0 border-2 border-amber-500/20 rounded-xl pointer-events-none"></div>
        </button>
        <button type="button" class="p-4 border border-brand-white/10 rounded-xl hover:border-brand-purple/50 hover:bg-brand-white/5 transition-all text-left bg-brand-white/[0.02]">
          <div class="font-bold text-lg text-brand-white">Any</div>
          <div class="text-xs text-brand-white/40 font-bold uppercase tracking-wider mt-1">Escrow</div>
        </button>
      </div>
    </div>

    <!-- Settlement Preview -->
    <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-4">
      <div class="p-2 bg-amber-500/10 rounded-lg flex-shrink-0">
        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <div>
        <h3 class="font-bold text-amber-400 text-sm mb-1 uppercase tracking-wide">Fast Track Settlement</h3>
        <p class="text-sm text-brand-white/80 leading-relaxed">Workers with 70+ FairScore will have a 12-hour dispute window before funds are auto-released.</p>
      </div>
    </div>

    <button type="submit" class="w-full bg-brand-white text-brand-black font-bold py-4 rounded-xl hover:bg-brand-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg">
      Deposit & Post Task
    </button>

    <p class="text-xs text-center text-brand-white/40 font-mono">5% protocol fee will be deducted upon task completion</p>
  </form>
</div>

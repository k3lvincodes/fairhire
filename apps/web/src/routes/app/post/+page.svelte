<div class="max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Create New Task</h1>
  
  <form class="space-y-6">
    <div class="space-y-2">
      <label for="title" class="block text-sm font-medium text-neutral-400">Task Title</label>
      <input id="title" type="text" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500" placeholder="e.g. Fix Rust compilation error" />
    </div>
    
    <div class="space-y-2">
      <label for="description" class="block text-sm font-medium text-neutral-400">Description</label>
      <textarea id="description" rows="5" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500" placeholder="Describe the task details, requirements, and acceptance criteria..."></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label for="bounty" class="block text-sm font-medium text-neutral-400">Bounty (USDC)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
          <input id="bounty" type="number" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 pl-8 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500" placeholder="0.00" />
        </div>
      </div>
      <div class="space-y-2">
        <label for="deadline" class="block text-sm font-medium text-neutral-400">Time Limit</label>
        <select id="deadline" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500">
          <option>24 Hours</option>
          <option>3 Days</option>
          <option>1 Week</option>
        </select>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-neutral-400">Minimum FairScore Required</label>
      <div class="grid grid-cols-3 gap-3">
        <button type="button" class="p-3 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors text-left">
          <div class="font-semibold">85+</div>
          <div class="text-xs text-emerald-400">Instant Pay</div>
        </button>
        <button type="button" class="p-3 border-2 border-amber-500 rounded-lg bg-amber-500/10 text-left">
          <div class="font-semibold">70+</div>
          <div class="text-xs text-amber-400">Fast Track</div>
        </button>
        <button type="button" class="p-3 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors text-left">
          <div class="font-semibold">Any</div>
          <div class="text-xs text-neutral-400">Escrow</div>
        </button>
      </div>
    </div>

    <!-- Settlement Preview -->
    <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="font-medium text-amber-400">Fast Track Settlement</span>
      </div>
      <p class="text-sm text-neutral-300">Workers with 70+ FairScore will have a 12-hour dispute window before auto-release.</p>
    </div>

    <button type="submit" class="w-full bg-white text-neutral-900 font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors">
      Deposit & Post Task
    </button>

    <p class="text-xs text-center text-neutral-500">5% protocol fee will be deducted upon task completion</p>
  </form>
</div>

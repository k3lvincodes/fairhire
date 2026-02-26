<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { wallet } from '$lib/stores/wallet';
  import { fade, scale, fly } from 'svelte/transition';

  export let profile: any = null;

  const dispatch = createEventDispatcher();

  let displayName = profile?.display_name || '';
  let username = profile?.username || '';
  let bio = profile?.bio || '';
  let skills: string[] = [...(profile?.skills ?? [])];
  let saving = false;
  let errorMsg = '';
  let successMsg = '';

  // Skill picker state
  let allSkills: string[] = [];
  let skillSearch = '';
  let showSkillDropdown = false;
  let skillInputEl: HTMLInputElement;
  let dropdownEl: HTMLDivElement;

  $: isUsernameValid = !username || /^[a-zA-Z0-9_]{3,20}$/.test(username);

  // Filter skills based on search, exclude already selected, limit results for perf
  $: filteredSkills = (() => {
    const query = skillSearch.toLowerCase().trim();
    const selected = new Set(skills.map(s => s.toLowerCase()));
    let results = allSkills.filter(s => !selected.has(s.toLowerCase()));
    if (query) {
      // Prioritize starts-with, then contains
      const startsWith = results.filter(s => s.toLowerCase().startsWith(query));
      const contains = results.filter(s => !s.toLowerCase().startsWith(query) && s.toLowerCase().includes(query));
      results = [...startsWith, ...contains];
    }
    return results.slice(0, 50); // Show max 50 for performance
  })();

  onMount(async () => {
    try {
      const res = await fetch('/data/skills.json');
      if (res.ok) {
        allSkills = await res.json();
      }
    } catch (e) {
      console.error('Failed to load skills:', e);
    }

    // Close dropdown on outside click
    function handleGlobalClick(e: MouseEvent) {
      if (dropdownEl && !dropdownEl.contains(e.target as Node) && 
          skillInputEl && !skillInputEl.contains(e.target as Node)) {
        showSkillDropdown = false;
      }
    }
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  });

  function addSkill(skill: string) {
    if (!skills.includes(skill) && skills.length < 15) {
      skills = [...skills, skill];
    }
    skillSearch = '';
    showSkillDropdown = false;
  }

  function removeSkill(index: number) {
    skills = skills.filter((_, i) => i !== index);
  }

  function handleSkillInputFocus() {
    showSkillDropdown = true;
  }

  function handleSkillKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      showSkillDropdown = false;
    } else if (e.key === 'Backspace' && !skillSearch && skills.length > 0) {
      // Remove last skill tag on backspace in empty input
      skills = skills.slice(0, -1);
    }
  }

  async function handleSave() {
    if (!$wallet.address) return;
    if (username && !isUsernameValid) {
      errorMsg = 'Username must be 3-20 chars: letters, numbers, underscore only.';
      return;
    }

    saving = true;
    errorMsg = '';
    successMsg = '';

    try {
      const updates: Record<string, any> = {
        wallet_address: $wallet.address,
        display_name: displayName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        skills
      };

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to save' }));
        errorMsg = err.error || 'Failed to save profile.';
        return;
      }

      successMsg = 'Profile updated!';
      // Update the store so nav reflects the new username immediately
      if (username.trim()) {
        wallet.update(w => ({ ...w, username: username.trim() }));
      }
      setTimeout(() => {
        dispatch('saved');
      }, 600);

    } catch (err: any) {
      errorMsg = err.message || 'An unexpected error occurred.';
    } finally {
      saving = false;
    }
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
  transition:fade={{ duration: 150 }}
  on:click={handleClose}
>
  <div
    class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-brand-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
    on:click|stopPropagation
    transition:scale={{ start: 0.95, duration: 200 }}
  >
    <!-- Header -->
    <div class="sticky top-0 z-10 flex items-center justify-between p-6 pb-4 border-b border-brand-white/10 bg-zinc-950/95 backdrop-blur-xl">
      <h2 class="text-xl font-bold font-display text-brand-white">Edit Profile</h2>
      <button
        on:click={handleClose}
        class="p-2 rounded-lg text-brand-white/40 hover:text-brand-white hover:bg-brand-white/10 transition-colors"
        aria-label="Close"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <form on:submit|preventDefault={handleSave} class="p-6 space-y-5">

      <!-- Display Name -->
      <div>
        <label for="displayName" class="block text-sm font-medium text-brand-white/70 mb-1.5">Display Name</label>
        <input
          type="text"
          id="displayName"
          bind:value={displayName}
          placeholder="Your public name"
          maxlength="50"
          disabled={saving}
          class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg px-4 py-3 text-brand-white placeholder-brand-white/30 focus:outline-none focus:border-brand-purple/50 focus:bg-brand-white/[0.07] transition-all disabled:opacity-50"
        />
      </div>

      <!-- Username -->
      <div>
        <label for="editUsername" class="block text-sm font-medium text-brand-white/70 mb-1.5">
          Username
          <span class="text-brand-white/30 text-xs ml-1">(can only be changed once every 14 days)</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-white/30 font-mono">@</span>
          <input
            type="text"
            id="editUsername"
            bind:value={username}
            placeholder="your_handle"
            maxlength="20"
            disabled={saving}
            autocomplete="off"
            spellcheck="false"
            class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg pl-8 pr-4 py-3 text-brand-white font-mono placeholder-brand-white/30 focus:outline-none focus:border-brand-purple/50 focus:bg-brand-white/[0.07] transition-all disabled:opacity-50"
          />
        </div>
        {#if username && !isUsernameValid}
          <p class="mt-1 text-xs text-red-400">3-20 chars: letters, numbers, underscore</p>
        {/if}
      </div>

      <!-- Bio -->
      <div>
        <label for="bio" class="block text-sm font-medium text-brand-white/70 mb-1.5">Bio</label>
        <textarea
          id="bio"
          bind:value={bio}
          placeholder="Tell people about yourself, your expertise, and what you're looking for..."
          maxlength="280"
          rows="3"
          disabled={saving}
          class="w-full bg-brand-white/5 border border-brand-white/10 rounded-lg px-4 py-3 text-brand-white placeholder-brand-white/30 focus:outline-none focus:border-brand-purple/50 focus:bg-brand-white/[0.07] transition-all disabled:opacity-50 resize-none"
        ></textarea>
        <div class="mt-1 text-xs text-brand-white/30 text-right">{bio.length}/280</div>
      </div>

      <!-- Skills Picker -->
      <div>
        <label class="block text-sm font-medium text-brand-white/70 mb-1.5">
          Skills <span class="text-brand-white/30">({skills.length}/15)</span>
        </label>
        
        <!-- Skills input with tags -->
        <div class="relative">
          <div
            class="flex flex-wrap items-center gap-1.5 min-h-[48px] bg-brand-white/5 border border-brand-white/10 rounded-lg px-3 py-2 cursor-text transition-all {showSkillDropdown ? 'border-brand-purple/50 bg-brand-white/[0.07]' : ''}"
            on:click={() => { skillInputEl?.focus(); showSkillDropdown = true; }}
          >
            <!-- Selected skill tags -->
            {#each skills as skill, i}
              <span
                class="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-purple/15 border border-brand-purple/25 rounded-md text-xs font-medium text-brand-purple"
                transition:scale={{ start: 0.8, duration: 150 }}
              >
                {skill}
                <button
                  type="button"
                  on:click|stopPropagation={() => removeSkill(i)}
                  class="text-brand-purple/50 hover:text-red-400 transition-colors ml-0.5"
                  aria-label="Remove {skill}"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            {/each}

            <!-- Search input -->
            {#if skills.length < 15}
              <input
                type="text"
                bind:this={skillInputEl}
                bind:value={skillSearch}
                on:focus={handleSkillInputFocus}
                on:keydown={handleSkillKeydown}
                placeholder={skills.length === 0 ? 'Search and add skills...' : 'Add more...'}
                disabled={saving}
                class="flex-1 min-w-[120px] bg-transparent text-sm text-brand-white placeholder-brand-white/30 focus:outline-none disabled:opacity-50 py-1"
              />
            {/if}
          </div>

          <!-- Dropdown -->
          {#if showSkillDropdown && filteredSkills.length > 0}
            <div
              bind:this={dropdownEl}
              class="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-brand-white/10 bg-zinc-900/98 shadow-xl backdrop-blur-xl z-20"
              transition:fly={{ y: -8, duration: 150 }}
            >
              {#each filteredSkills as skill}
                <button
                  type="button"
                  on:click={() => addSkill(skill)}
                  class="w-full text-left px-4 py-2.5 text-sm text-brand-white/80 hover:bg-brand-purple/15 hover:text-brand-white transition-colors flex items-center justify-between group"
                >
                  <span>
                    {#if skillSearch}
                      <!-- Highlight matching text -->
                      {@html skill.replace(
                        new RegExp(`(${skillSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                        '<span class="text-brand-purple font-semibold">$1</span>'
                      )}
                    {:else}
                      {skill}
                    {/if}
                  </span>
                  <svg class="w-4 h-4 text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              {/each}
            </div>
          {:else if showSkillDropdown && skillSearch && filteredSkills.length === 0}
            <div
              class="absolute left-0 right-0 top-full mt-1 rounded-lg border border-brand-white/10 bg-zinc-900/98 shadow-xl backdrop-blur-xl z-20 p-4 text-center"
              transition:fly={{ y: -8, duration: 150 }}
            >
              <p class="text-brand-white/40 text-sm">No matching skills found</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Messages -->
      {#if errorMsg}
        <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm" transition:fade>
          {errorMsg}
        </div>
      {/if}

      {#if successMsg}
        <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm" transition:fade>
          ✓ {successMsg}
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <button
          type="button"
          on:click={handleClose}
          disabled={saving}
          class="flex-1 py-3 bg-brand-white/5 border border-brand-white/10 rounded-lg text-sm font-bold text-brand-white/70 hover:bg-brand-white/10 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || (username !== '' && !isUsernameValid)}
          class="flex-1 py-3 bg-brand-purple text-white rounded-lg text-sm font-bold hover:bg-brand-purple-hover transition-all shadow-[0_0_15px_rgba(108,59,170,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if saving}
            <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          {:else}
            Save Changes
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

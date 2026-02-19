<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let lines: { text: string; class?: string }[] = [];
  export let typeSpeed = 50;
  export let deleteSpeed = 30;
  export let waitTime = 2000;

  let currentLineIndex = 0;
  let displayedLines: string[] = [];
  let isDeleting = false;
  let timer: ReturnType<typeof setTimeout>;

  // Initialize displayedLines with empty strings
  $: if (lines.length > 0 && displayedLines.length === 0) {
    displayedLines = lines.map(() => '');
  }

  function loop() {
    const currentLineFullText = lines[currentLineIndex].text;
    const currentLineDisplayed = displayedLines[currentLineIndex];

    if (!isDeleting) {
      // Typing phase
      if (currentLineDisplayed.length < currentLineFullText.length) {
        displayedLines[currentLineIndex] = currentLineFullText.substring(0, currentLineDisplayed.length + 1);
        timer = setTimeout(loop, typeSpeed);
      } else {
        // Line finished typing
        if (currentLineIndex < lines.length - 1) {
            // Move to next line
            currentLineIndex++;
            timer = setTimeout(loop, typeSpeed);
        } else {
            // All lines finished, wait before deleting
            timer = setTimeout(() => {
                isDeleting = true;
                loop();
            }, waitTime);
        }
      }
    } else {
      // Deleting phase
      if (currentLineDisplayed.length > 0) {
        displayedLines[currentLineIndex] = currentLineFullText.substring(0, currentLineDisplayed.length - 1);
        timer = setTimeout(loop, deleteSpeed);
      } else {
        // Line finished deleting
        if (currentLineIndex > 0) {
            // Move to previous line
            currentLineIndex--;
            timer = setTimeout(loop, deleteSpeed);
        } else {
            // All lines deleted, restart typing
            isDeleting = false;
            currentLineIndex = 0;
            timer = setTimeout(loop, 500);
        }
      }
    }
  }

  onMount(() => {
    if (lines.length > 0) {
      displayedLines = lines.map(() => '');
      loop();
    }
  });

  onDestroy(() => {
    clearTimeout(timer);
  });
</script>

<div class="flex flex-col items-start justify-center">
    {#each lines as line, i}
        <div class="min-h-[1.2em] {line.class || ''} flex items-center">
            {displayedLines[i] || ''}
            {#if i === currentLineIndex}
                <span class="ml-1 w-1 h-[1em] bg-current animate-pulse inline-block align-middle"></span>
            {/if}
        </div>
    {/each}
</div>

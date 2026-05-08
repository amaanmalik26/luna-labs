<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * Each line has its own content and a colour "type" for syntax highlighting.
   * Separating data from presentation means adding a new line is one array entry.
   */
  type LineType = 'keyword' | 'import' | 'call' | 'comment' | 'status';

  interface CodeLine {
    text: string;
    type: LineType;
  }

  const lines: CodeLine[] = [
    { text: "const agency = 'Luna Labs';",            type: 'keyword' },
    { text: "import { precision } from 'luna-arch';", type: 'import'  },
    { text: "await agency.build({ scale: true });",   type: 'call'    },
    { text: "// Systems that flow...",                 type: 'comment' },
    { text: "» Status: Architecting Digital Arcs",    type: 'status'  },
  ];

  const TYPE_COLOURS: Record<LineType, string> = {
    keyword: 'text-luna-text-muted',
    import:  'text-luna-gold/80',
    call:    'text-luna-text-muted',
    comment: 'text-luna-purple/80',
    status:  'text-luna-neon',
  };

  /**
   * STATE MODEL
   * -----------
   * completedLines  — lines that are fully typed (static, no cursor).
   * currentLineIdx  — index of the line currently being typed (0-based).
   * currentText     — portion of the current line typed so far.
   * done            — true once all lines complete; shows idle prompt.
   *
   * Animation loop:
   *   1. Type one char of current line every CHAR_DELAY ms.
   *   2. When line complete, pause LINE_PAUSE ms then advance to next line.
   *   3. Repeat until all lines done.
   */
  let completedLines = $state<CodeLine[]>([]);
  let currentLineIdx = $state(0);
  let currentText    = $state('');
  let done           = $state(false);

  const CHAR_DELAY = 42;   // ms per character — fast typist feel
  const LINE_PAUSE = 380;  // ms pause between lines

  onMount(() => {
    let charIdx = 0;
    let lineIdx = 0;
    let timerId: ReturnType<typeof setTimeout>;

    function typeNextChar() {
      if (lineIdx >= lines.length) {
        done = true;
        return;
      }

      const line = lines[lineIdx];

      if (charIdx <= line.text.length) {
        currentText    = line.text.slice(0, charIdx);
        currentLineIdx = lineIdx;
        charIdx++;
        timerId = setTimeout(typeNextChar, CHAR_DELAY);
      } else {
        // Line complete — commit to completedLines, reset for next
        completedLines = [...completedLines, line];
        currentText    = '';
        charIdx        = 0;
        lineIdx++;
        currentLineIdx = lineIdx;
        timerId = setTimeout(typeNextChar, LINE_PAUSE);
      }
    }

    // Short initial delay before typing begins
    timerId = setTimeout(typeNextChar, 700);

    return () => clearTimeout(timerId);
  });
</script>

<div
  class="luna-glass p-6 rounded-xl font-mono text-[11px] lg:text-[13px] shadow-2xl min-h-[240px] select-none"
  role="region"
  aria-label="Luna Labs code terminal"
>
  <!-- macOS traffic light dots + tab title — decorative -->
  <div class="flex items-center gap-2 mb-5" aria-hidden="true">
    <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
    <div class="w-3 h-3 rounded-full bg-yellow-400/50"></div>
    <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
    <span class="ml-3 text-white/20 text-[10px] tracking-widest uppercase">luna-arch — zsh</span>
  </div>

  <div class="space-y-2.5">

    <!-- Completed lines — fully typed, no cursor -->
    {#each completedLines as line, i (i)}
      <div class="flex gap-4 items-start leading-relaxed">
        <span class="text-white/15 w-5 shrink-0 tabular-nums text-right">{i + 1}</span>
        <span class={TYPE_COLOURS[line.type]}>{line.text}</span>
      </div>
    {/each}

    <!-- Currently typing line — partial text + blinking block cursor -->
    {#if !done && currentLineIdx < lines.length}
      <div class="flex gap-4 items-start leading-relaxed">
        <span class="text-white/15 w-5 shrink-0 tabular-nums text-right">
          {completedLines.length + 1}
        </span>
        <span class={TYPE_COLOURS[lines[currentLineIdx].type]}>
          <!--
            Cursor is an inline-block span sitting directly after the last
            typed character. step-end blink gives the classic terminal feel.
          -->
          {currentText}<span class="cursor" aria-hidden="true"></span>
        </span>
      </div>
    {/if}

    <!-- Idle prompt after all lines complete -->
    {#if done}
      <div class="flex gap-4 items-start leading-relaxed mt-1">
        <span class="text-white/15 w-5 shrink-0 tabular-nums text-right">
          {lines.length + 1}
        </span>
        <span class="text-luna-gold/40">▸ <span class="cursor cursor--idle" aria-hidden="true"></span></span>
      </div>
    {/if}

  </div>
</div>

<style>
  /*
   * Block cursor — sits inline immediately after the last typed character.
   * inline-block + vertical-align: middle means it sits on the text baseline
   * without needing absolute positioning.
   * Width is 0.55em so it matches the monospace character width.
   */
  .cursor {
    display: inline-block;
    width: 0.55em;
    height: 1.05em;
    background-color: var(--color-luna-gold);
    vertical-align: middle;
    margin-left: 1px;
    animation: blink 1s step-end infinite;
  }

  .cursor--idle {
    background-color: rgba(var(--color-luna-gold), 0.4);
    opacity: 0.4;
  }

  /* step-end = snaps between visible/invisible, classic terminal blink */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  /* Respect reduced-motion preference — cursor stays visible, no blink */
  @media (prefers-reduced-motion: reduce) {
    .cursor,
    .cursor--idle {
      animation: none;
      opacity: 1;
    }
  }
</style>
<script lang="ts">
  /**
   * SectionLabel — small uppercase eyebrow label used above h2 headings.
   * Accepts a colour variant so Services uses neon, Portfolio uses gold, etc.
   *
   * Props:
   *   label   — the text to display
   *   variant — 'neon' | 'gold' | 'purple'  (default: 'neon')
   */
  type Variant = 'neon' | 'gold' | 'purple';

  let {
    label,
    variant = 'neon' as Variant,
  }: { label: string; variant?: Variant } = $props();

  const colours: Record<Variant, string> = {
    neon:   'text-luna-neon   border-luna-neon/30   bg-luna-neon/5',
    gold:   'text-luna-gold   border-luna-gold/30   bg-luna-gold/5',
    purple: 'text-luna-purple border-luna-purple/30 bg-luna-purple/5',
  };
</script>

<span
  class="
    inline-flex items-center gap-2
    text-[10px] font-bold uppercase tracking-[0.35em]
    px-3 py-1.5 rounded-full border
    {colours[variant]}
  "
>
  <span class="w-1 h-1 rounded-full bg-current" aria-hidden="true"></span>
  {label}
</span>
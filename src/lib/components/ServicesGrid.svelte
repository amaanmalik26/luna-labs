<script lang="ts">
  import { fly } from 'svelte/transition';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  /**
   * Each service maps directly to a real Luna Labs offering.
   * Keeping the data here (not in +page.svelte) means this component is
   * self-contained — drop it anywhere and it renders correctly.
   *
   * Fields:
   *   icon       — emoji used as the card's visual anchor (no external deps)
   *   title      — service name, rendered as h3
   *   tagline    — one-line value proposition
   *   description — fuller explanation, 2 sentences max (scannable)
   *   tags       — 3-4 short capability tags shown as pills
   *   accent     — which brand colour to use for the glow + tag pill
   */
  interface Service {
    icon:        string;
    title:       string;
    tagline:     string;
    description: string;
    tags:        string[];
    accent:      'neon' | 'purple' | 'gold';
  }

  const services: Service[] = [
    {
      icon:        '⚡',
      title:       'Web Systems',
      tagline:     'Full-stack platforms built to scale.',
      description: 'From marketing sites to complex SaaS products, we architect and ship fast, SEO-ready web systems using SvelteKit and Supabase. Every project is designed for performance from day one.',
      tags:        ['SvelteKit', 'Supabase', 'PostgreSQL', 'Vercel'],
      accent:      'neon',
    },
    {
      icon:        '✦',
      title:       'UI / UX Design',
      tagline:     'Interfaces that convert, not just impress.',
      description: 'We translate business goals into pixel-precise, accessible interfaces. Our design process combines conversion-rate thinking with premium aesthetics — every component earns its place.',
      tags:        ['Figma', 'Design Systems', 'CRO', 'Accessibility'],
      accent:      'purple',
    },
    {
      icon:        '◈',
      title:       'Custom SaaS',
      tagline:     'Your idea. Productised and shipped.',
      description: 'Got a tool, workflow, or product idea? We scope, design, and build lightweight SaaS MVPs with auth, billing hooks, and a dashboard — ready for your first paying users.',
      tags:        ['MVP', 'Auth', 'Dashboards', 'API-first'],
      accent:      'gold',
    },
  ];

  const ACCENT_GLOW: Record<Service['accent'], string> = {
    neon:   'rgba(0, 240, 255, 0.12)',
    purple: 'rgba(138, 43, 226, 0.14)',
    gold:   'rgba(212, 175, 55, 0.12)',
  };
  const ACCENT_TAG: Record<Service['accent'], string> = {
    neon:   'bg-luna-neon/10   text-luna-neon   border-luna-neon/20',
    purple: 'bg-luna-purple/10 text-luna-purple border-luna-purple/20',
    gold:   'bg-luna-gold/10   text-luna-gold   border-luna-gold/20',
  };
  const ACCENT_ICON: Record<Service['accent'], string> = {
    neon:   'text-luna-neon',
    purple: 'text-luna-purple',
    gold:   'text-luna-gold',
  };
</script>

<section
  id="services"
  class="relative px-6 lg:px-32 py-32"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-labelledby="services-heading"
>
  <!-- Ambient background orb -->
  <div
    class="absolute left-[-15%] top-[20%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
    style="background: radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 70%);"
    aria-hidden="true"
  ></div>

  <!-- ── Section Header ──────────────────────────────────────────── -->
  <div class="max-w-7xl mx-auto">
    <div class="mb-16 space-y-4 max-w-2xl">
      <SectionLabel label="What We Build" variant="neon" />

      <h2
        id="services-heading"
        class="text-5xl lg:text-6xl font-black tracking-tight"
      >
        Precision-built
        <span class="text-luna-gradient"> solutions.</span>
      </h2>

      <p class="text-luna-text-muted text-lg leading-relaxed">
        Every engagement starts with architecture. We don't just build features —
        we build systems that hold up as your business scales.
      </p>
    </div>

    <!-- ── Service Cards Grid ──────────────────────────────────────── -->
    <!--
      Three equal columns on lg+, single column on mobile.
      gap-6 keeps card spacing tight and premium-feeling.
    -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {#each services as service, i}
        <!--
          fly() transition: each card flies in from below with a staggered
          delay based on its index. Svelte's transition directive handles
          this automatically when the element enters the DOM.

          The hover glow uses a CSS custom property set inline so each card
          gets its own accent colour without duplicating CSS classes.
        -->
        <article
          class="service-card luna-glass rounded-2xl p-8 flex flex-col gap-6 group cursor-default"
          style="--glow-colour: {ACCENT_GLOW[service.accent]};"
          in:fly={{ y: 40, duration: 500, delay: i * 120 }}
        >
          <!-- Icon -->
          <div
            class="text-4xl w-14 h-14 flex items-center justify-center rounded-xl luna-glass {ACCENT_ICON[service.accent]}"
            aria-hidden="true"
          >
            {service.icon}
          </div>

          <!-- Text content -->
          <div class="space-y-3 flex-1">
            <h3 class="text-xl font-black tracking-tight">{service.title}</h3>
            <p class="text-luna-gold text-xs font-bold uppercase tracking-widest">
              {service.tagline}
            </p>
            <p class="text-luna-text-muted text-sm leading-relaxed">
              {service.description}
            </p>
          </div>

          <!-- Capability tags -->
          <div class="flex flex-wrap gap-2" role="list" aria-label="Technologies">
            {#each service.tags as tag}
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border {ACCENT_TAG[service.accent]}"
                role="listitem"
              >
                {tag}
              </span>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  /*
   * Hover glow effect — uses the --glow-colour CSS custom property set
   * inline on each card so every card glows in its own accent colour.
   *
   * We animate box-shadow rather than a pseudo-element because:
   * 1. box-shadow is GPU-composited (no layout repaint).
   * 2. It respects border-radius automatically.
   * transition is set on the element itself so both in and out animate.
   */
  .service-card {
    transition:
      box-shadow 0.4s ease,
      transform  0.3s ease,
      border-color 0.3s ease;
  }

  .service-card:hover {
    box-shadow: 0 0 60px var(--glow-colour), 0 20px 60px rgba(0,0,0,0.3);
    transform: translateY(-4px);
    border-color: var(--color-luna-border-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    .service-card {
      transition: none;
    }
    .service-card:hover {
      transform: none;
    }
  }
</style>
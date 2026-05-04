<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  /**
   * Portfolio projects — mix of real concept work and planned case studies.
   * Status badge communicates honesty: 'concept' means spec/demo work,
   * 'live' means shipped, 'in progress' means actively building.
   *
   * Fields:
   *   title       — project name
   *   category    — service area this showcases
   *   description — 1-2 sentence elevator pitch for the project
   *   stack       — technologies used (shown on hover)
   *   status      — 'live' | 'concept' | 'in-progress'
   *   gradient    — CSS gradient string for the card visual placeholder
   *                 (replace with real screenshots once available)
   *   year        — project year
   */
  interface Project {
    title:       string;
    category:    string;
    description: string;
    stack:       string[];
    status:      'live' | 'concept' | 'in-progress';
    gradient:    string;
    year:        string;
  }

  const projects: Project[] = [
    {
      title:       'Luna Labs',
      category:    'Brand & Web System',
      description: 'The very site you\'re on. A premium agency marketing platform with lead capture, Discord integration, and a Supabase-powered admin hub.',
      stack:       ['SvelteKit', 'Supabase', 'Tailwind 4', 'Vercel'],
      status:      'in-progress',
      gradient:    'linear-gradient(135deg, #0066FF 0%, #8A2BE2 50%, #00F0FF 100%)',
      year:        '2025',
    },
    {
      title:       'Orion Dashboard',
      category:    'SaaS / Admin UI',
      description: 'A concept B2B analytics dashboard with real-time data tables, chart components, and a multi-tenant role system built on Supabase RLS.',
      stack:       ['SvelteKit', 'Supabase Realtime', 'Chart.js', 'PostgreSQL'],
      status:      'concept',
      gradient:    'linear-gradient(135deg, #1E143C 0%, #0066FF 60%, #00F0FF 100%)',
      year:        '2025',
    },
    {
      title:       'Meridian Commerce',
      category:    'E-Commerce Platform',
      description: 'A high-conversion e-commerce front-end concept for a fashion brand — product grid, cart state, and a one-page checkout flow with full mobile optimisation.',
      stack:       ['SvelteKit', 'Stripe', 'Tailwind', 'Sanity CMS'],
      status:      'concept',
      gradient:    'linear-gradient(135deg, #D4AF37 0%, #8A2BE2 70%, #0B0914 100%)',
      year:        '2025',
    },
    {
      title:       'Pulse CRM',
      category:    'Internal Tool',
      description: 'A lightweight lead and client management tool for small agencies. Full CRUD, status tracking, and email-thread association — built in a single weekend sprint.',
      stack:       ['SvelteKit', 'Supabase', 'Resend', 'Zod'],
      status:      'concept',
      gradient:    'linear-gradient(135deg, #00F0FF 0%, #0066FF 50%, #1E143C 100%)',
      year:        '2025',
    },
  ];

  const STATUS_CONFIG = {
    'live':        { label: 'Live',        class: 'bg-green-500/20  text-green-400  border-green-500/30'  },
    'concept':     { label: 'Concept',     class: 'bg-luna-gold/15  text-luna-gold  border-luna-gold/30'  },
    'in-progress': { label: 'In Progress', class: 'bg-luna-neon/10  text-luna-neon  border-luna-neon/20'  },
  };

  /**
   * Hover state — tracks which card is hovered so we can show the
   * stack overlay. Using an index rather than a boolean on each project
   * object keeps the projects array as pure data with no UI state mixed in.
   */
  let hoveredIdx = $state<number | null>(null);
</script>

<section
  id="portfolio"
  class="relative px-6 lg:px-32 py-32"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-labelledby="portfolio-heading"
>
  <!-- Ambient orb — right side, gold tint -->
  <div
    class="absolute right-[-10%] top-[15%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
    style="background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);"
    aria-hidden="true"
  ></div>

  <div class="max-w-7xl mx-auto">

    <!-- ── Section Header ────────────────────────────────────────── -->
    <div class="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
      <div class="space-y-4 max-w-2xl">
        <SectionLabel label="Concept Portfolio" variant="gold" />

        <h2
          id="portfolio-heading"
          class="text-5xl lg:text-6xl font-black tracking-tight"
        >
          Work that
          <span class="text-gold-gradient"> speaks.</span>
        </h2>

        <p class="text-luna-text-muted text-lg leading-relaxed">
          A curated mix of shipped projects and high-fidelity concept builds.
          Every card is a real spec — not a wireframe.
        </p>
      </div>

      <!-- Honesty note — builds trust with potential clients -->
      <div
        class="luna-glass rounded-2xl px-5 py-4 max-w-xs text-xs text-luna-text-muted leading-relaxed shrink-0"
      >
        <span class="text-luna-gold font-bold block mb-1">About concept work</span>
        Concept projects are fully designed and built to production quality —
        they're used to demonstrate capability, not as client deliverables.
      </div>
    </div>

    <!-- ── Project Cards Grid ───────────────────────────────────── -->
    <!--
      Asymmetric grid: first card spans 2 columns on lg, rest are single.
      This gives the featured project (Luna Labs itself) more visual weight.
      lg:grid-cols-2 with the first card using lg:col-span-2.
    -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {#each projects as project, i}
        <article
          class="portfolio-card luna-glass rounded-2xl overflow-hidden group"
          class:lg:col-span-2={i === 0}
          in:fly={{ y: 50, duration: 550, delay: i * 100 }}
          onmouseenter={() => hoveredIdx = i}
          onmouseleave={() => hoveredIdx = null}
          role="article"
          aria-label="{project.title} — {project.category}"
        >
          <!-- ── Visual Placeholder (gradient) ──────────────────── -->
          <!--
            Replace style background with an <img> or <picture> element
            once real screenshots are available. The aspect-ratio keeps
            the card height consistent regardless of content below.
          -->
          <div
            class="relative w-full overflow-hidden"
            style="aspect-ratio: {i === 0 ? '21/6' : '16/7'};"
          >
            <!-- Gradient visual -->
            <div
              class="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
              style="background: {project.gradient};"
            ></div>

            <!-- Dark overlay for readability -->
            <div class="absolute inset-0 bg-luna-base/30"></div>

            <!-- Stack overlay — fades in on hover -->
            {#if hoveredIdx === i}
              <div
                class="absolute inset-0 bg-luna-base/80 backdrop-blur-sm flex items-center justify-center gap-3 flex-wrap p-6"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 150 }}
              >
                {#each project.stack as tech}
                  <span class="text-xs font-bold text-luna-neon bg-luna-neon/10 border border-luna-neon/20 px-3 py-1.5 rounded-full">
                    {tech}
                  </span>
                {/each}
              </div>
            {/if}

            <!-- Status badge — top-right corner -->
            <div class="absolute top-4 right-4">
              <span
                class="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border {STATUS_CONFIG[project.status].class}"
              >
                {STATUS_CONFIG[project.status].label}
              </span>
            </div>

            <!-- Year badge — top-left -->
            <div class="absolute top-4 left-4">
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                {project.year}
              </span>
            </div>
          </div>

          <!-- ── Card Body ───────────────────────────────────────── -->
          <div class="p-6 lg:p-8 space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[10px] text-luna-text-muted uppercase tracking-widest font-bold mb-1">
                  {project.category}
                </p>
                <h3 class="text-xl font-black tracking-tight">{project.title}</h3>
              </div>
              <!-- Arrow link indicator — purely decorative until project pages exist -->
              <span
                class="text-luna-text-muted group-hover:text-luna-neon transition-colors mt-1 shrink-0 text-xl"
                aria-hidden="true"
              >↗</span>
            </div>

            <p class="text-luna-text-muted text-sm leading-relaxed">
              {project.description}
            </p>
          </div>
        </article>
      {/each}
    </div>

    <!-- ── Bottom CTA ─────────────────────────────────────────── -->
    <div class="mt-16 text-center space-y-4">
      <p class="text-luna-text-muted text-sm">
        Have a project in mind? Let's scope it together.
      </p>
      <a href="#quote" class="btn-luna-primary inline-block">
        Start a Conversation
      </a>
    </div>

  </div>
</section>

<style>
  .portfolio-card {
    transition:
      box-shadow  0.35s ease,
      border-color 0.35s ease;
  }

  .portfolio-card:hover {
    box-shadow: 0 0 50px rgba(0, 240, 255, 0.06), 0 20px 60px rgba(0,0,0,0.4);
    border-color: var(--color-luna-border-hover);
  }

  @media (prefers-reduced-motion: reduce) {
    .portfolio-card { transition: none; }
  }
</style>
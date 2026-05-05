<script lang="ts">
  import { fade } from 'svelte/transition';
  import SectionLabel from '$lib/components/SectionLabel.svelte';
  import ScrollReveal from '$lib/components/ScrollReveal.svelte';

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
      description: 'A high-conversion e-commerce front-end concept — product grid, cart state, and a one-page checkout flow with full mobile optimisation.',
      stack:       ['SvelteKit', 'Stripe', 'Tailwind', 'Sanity CMS'],
      status:      'concept',
      gradient:    'linear-gradient(135deg, #D4AF37 0%, #8A2BE2 70%, #0B0914 100%)',
      year:        '2025',
    },
    {
      title:       'Pulse CRM',
      category:    'Internal Tool',
      description: 'A lightweight lead and client management tool for small agencies. Full CRUD, status tracking, and email-thread association.',
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

  let hoveredIdx = $state<number | null>(null);
</script>

<section
  id="portfolio"
  class="relative px-6 lg:px-32 py-32"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-labelledby="portfolio-heading"
>
  <div
    class="absolute right-[-10%] top-[15%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
    style="background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);"
    aria-hidden="true"
  ></div>

  <div class="max-w-7xl mx-auto">

    <!-- Header -->
    <ScrollReveal>
      <div class="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div class="space-y-4 max-w-2xl">
          <SectionLabel label="Concept Portfolio" variant="gold" />
          <h2 id="portfolio-heading" class="text-5xl lg:text-6xl font-black tracking-tight">
            Work that
            <span class="text-gold-gradient"> speaks.</span>
          </h2>
          <p class="text-luna-text-muted text-lg leading-relaxed">
            A curated mix of shipped projects and high-fidelity concept builds.
            Every card is a real spec — not a wireframe.
          </p>
        </div>
        <div class="luna-glass rounded-2xl px-5 py-4 max-w-xs text-xs text-luna-text-muted leading-relaxed shrink-0">
          <span class="text-luna-gold font-bold block mb-1">About concept work</span>
          Concept projects are fully designed and built to production quality —
          they demonstrate capability, not client deliverables.
        </div>
      </div>
    </ScrollReveal>

    <!-- Project grid — cards stagger with increasing delay -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {#each projects as project, i}
        <ScrollReveal delay={i * 100} distance={48}>
          <article
            class="portfolio-card luna-glass rounded-2xl overflow-hidden group h-full"
            class:lg:col-span-2={i === 0}
            onmouseenter={() => hoveredIdx = i}
            onmouseleave={() => hoveredIdx = null}
            role="article"
            aria-label="{project.title} — {project.category}"
          >
            <!-- Visual -->
            <div
              class="relative w-full overflow-hidden"
              style="aspect-ratio: {i === 0 ? '21/6' : '16/7'};"
            >
              <div
                class="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style="background: {project.gradient};"
              ></div>
              <div class="absolute inset-0 bg-luna-base/30"></div>

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

              <div class="absolute top-4 right-4">
                <span class="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border {STATUS_CONFIG[project.status].class}">
                  {STATUS_CONFIG[project.status].label}
                </span>
              </div>
              <div class="absolute top-4 left-4">
                <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">{project.year}</span>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 lg:p-8 space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-[10px] text-luna-text-muted uppercase tracking-widest font-bold mb-1">{project.category}</p>
                  <h3 class="text-xl font-black tracking-tight">{project.title}</h3>
                </div>
                <span class="text-luna-text-muted group-hover:text-luna-neon transition-colors mt-1 shrink-0 text-xl" aria-hidden="true">↗</span>
              </div>
              <p class="text-luna-text-muted text-sm leading-relaxed">{project.description}</p>
            </div>
          </article>
        </ScrollReveal>
      {/each}
    </div>

    <!-- CTA -->
    <ScrollReveal delay={200}>
      <div class="mt-16 text-center space-y-4">
        <p class="text-luna-text-muted text-sm">Have a project in mind? Let's scope it together.</p>
        <a href="#quote" class="btn-luna-primary inline-block">Start a Conversation</a>
      </div>
    </ScrollReveal>

  </div>
</section>

<style>
  .portfolio-card {
    transition: box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .portfolio-card:hover {
    box-shadow: 0 0 50px rgba(0, 240, 255, 0.06), 0 20px 60px rgba(0,0,0,0.4);
    border-color: var(--color-luna-border-hover);
  }
  @media (prefers-reduced-motion: reduce) {
    .portfolio-card { transition: none; }
  }
</style>
<script lang="ts">
  import SectionLabel from '$lib/components/SectionLabel.svelte';
  import ScrollReveal from '$lib/components/ScrollReveal.svelte';
  import {
    defaultPortfolioProjects,
    sortPortfolioProjects,
    type PortfolioProject,
  } from '$lib/portfolio';
  import type { ProjectStatus } from '$lib/types/database';

  let { projects = defaultPortfolioProjects }: { projects?: PortfolioProject[] } = $props();

  const sortedProjects = $derived(sortPortfolioProjects(projects));
  const featured = $derived(sortedProjects.find((project) => project.featured) ?? sortedProjects[0] ?? null);
  const supportingProjects = $derived(
    featured ? sortedProjects.filter((project) => project.id !== featured.id) : [],
  );

  const STATUS_CONFIG: Record<ProjectStatus, { label: string; class: string }> = {
    live: { label: 'Live', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    concept: { label: 'Concept', class: 'bg-luna-gold/15 text-luna-gold border-luna-gold/30' },
    'in-progress': {
      label: 'In Progress',
      class: 'bg-luna-neon/10 text-luna-neon border-luna-neon/20',
    },
  };

  function projectHref(project: PortfolioProject): string {
    return project.website_url || '#quote';
  }

  function externalTarget(project: PortfolioProject): '_blank' | undefined {
    return project.website_url ? '_blank' : undefined;
  }

  function externalRel(project: PortfolioProject): 'noopener noreferrer' | undefined {
    return project.website_url ? 'noopener noreferrer' : undefined;
  }

  function initials(title: string): string {
    return title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('');
  }
</script>

<section
  id="portfolio"
  class="relative overflow-hidden px-6 lg:px-32 py-32"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-labelledby="portfolio-heading"
>
  <div
    class="absolute right-[-10%] top-[15%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
    style="background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);"
    aria-hidden="true"
  ></div>

  <div class="max-w-7xl mx-auto">
    <ScrollReveal>
      <div class="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div class="space-y-4 max-w-2xl">
          <SectionLabel label="Concept Portfolio" variant="gold" />
          <h2 id="portfolio-heading" class="text-5xl lg:text-6xl font-black tracking-tight">
            Work that <span class="text-gold-gradient">speaks.</span>
          </h2>
          <p class="text-luna-text-muted text-lg leading-relaxed">
            A curated mix of shipped projects and high-fidelity concept builds.
            Every card is a real spec - not a wireframe.
          </p>
        </div>
        <div class="luna-glass rounded-2xl px-5 py-4 max-w-xs text-xs text-luna-text-muted leading-relaxed shrink-0">
          <span class="text-luna-gold font-bold block mb-1">About concept work</span>
          Concept projects are fully designed and built to production quality -
          they demonstrate capability, not client deliverables.
        </div>
      </div>
    </ScrollReveal>

    {#if featured}
      <ScrollReveal distance={40} duration={700}>
        <a
          href={projectHref(featured)}
          target={externalTarget(featured)}
          rel={externalRel(featured)}
          class="portfolio-card luna-glass block rounded-2xl overflow-hidden group w-full mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luna-neon"
          aria-label={`${featured.title} - ${featured.category}`}
        >
          <div class="logo-stage featured-logo-stage">
            <div class="absolute top-4 right-4">
              <span class="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border {STATUS_CONFIG[featured.status].class}">
                {STATUS_CONFIG[featured.status].label}
              </span>
            </div>
            <div class="absolute top-4 left-4">
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">{featured.year}</span>
            </div>

            {#if featured.logo_url}
              <img
                src={featured.logo_url}
                alt={`${featured.title} logo`}
                class="max-h-28 max-w-[70%] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-105"
              />
            {:else}
              <div class="logo-fallback text-4xl">{initials(featured.title)}</div>
            {/if}
          </div>

          <div class="p-8 lg:p-10 space-y-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[10px] text-luna-text-muted uppercase tracking-widest font-bold mb-1.5">
                  {featured.category}
                </p>
                <h3 class="text-3xl font-black tracking-tight">{featured.title}</h3>
              </div>
              <span
                class="text-luna-text-muted group-hover:text-luna-neon transition-colors shrink-0 text-2xl mt-1"
                aria-hidden="true"
              >
                &#8599;
              </span>
            </div>
            <p class="text-luna-text-muted leading-relaxed max-w-3xl">
              {featured.description}
            </p>
            <div class="flex flex-wrap gap-2" aria-label={`${featured.title} technology stack`}>
              {#each featured.stack as tech}
                <span class="text-xs font-bold text-luna-neon bg-luna-neon/10 border border-luna-neon/20 px-3 py-1.5 rounded-full">
                  {tech}
                </span>
              {/each}
            </div>
          </div>
        </a>
      </ScrollReveal>
    {:else}
      <div class="luna-glass rounded-2xl p-10 text-center text-luna-text-muted">
        Portfolio work is being curated.
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {#each supportingProjects as project, i}
        <ScrollReveal delay={i * 120} distance={40} duration={600}>
          <a
            href={projectHref(project)}
            target={externalTarget(project)}
            rel={externalRel(project)}
            class="portfolio-card luna-glass block rounded-2xl overflow-hidden group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luna-neon"
            aria-label={`${project.title} - ${project.category}`}
          >
            <div class="logo-stage">
              <div class="absolute top-4 right-4">
                <span class="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border {STATUS_CONFIG[project.status].class}">
                  {STATUS_CONFIG[project.status].label}
                </span>
              </div>
              <div class="absolute top-4 left-4">
                <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">{project.year}</span>
              </div>

              {#if project.logo_url}
                <img
                  src={project.logo_url}
                  alt={`${project.title} logo`}
                  class="max-h-20 max-w-[68%] object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.42)] transition-transform duration-500 group-hover:scale-105"
                />
              {:else}
                <div class="logo-fallback text-3xl">{initials(project.title)}</div>
              {/if}
            </div>

            <div class="p-6 lg:p-8 space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-[10px] text-luna-text-muted uppercase tracking-widest font-bold mb-1">{project.category}</p>
                  <h3 class="text-xl font-black tracking-tight">{project.title}</h3>
                </div>
                <span class="text-luna-text-muted group-hover:text-luna-neon transition-colors shrink-0 text-xl mt-1" aria-hidden="true">
                  &#8599;
                </span>
              </div>
              <p class="text-luna-text-muted text-sm leading-relaxed">{project.description}</p>
              <div class="flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
                {#each project.stack as tech}
                  <span class="text-[10px] font-bold text-luna-neon bg-luna-neon/10 border border-luna-neon/20 px-2.5 py-1 rounded-full">
                    {tech}
                  </span>
                {/each}
              </div>
            </div>
          </a>
        </ScrollReveal>
      {/each}
    </div>

    <ScrollReveal delay={200} duration={600}>
      <div class="mt-16 text-center space-y-4">
        <p class="text-luna-text-muted text-sm">Have a project in mind? Let's scope it together.</p>
        <a href="#quote" class="btn-luna-primary inline-block">Start a Conversation</a>
      </div>
    </ScrollReveal>
  </div>
</section>

<style>
  .portfolio-card {
    transition: box-shadow 0.35s ease, border-color 0.35s ease, transform 0.3s ease;
  }
  .portfolio-card:hover {
    box-shadow: 0 0 50px rgba(0,240,255,0.06), 0 20px 60px rgba(0,0,0,0.4);
    border-color: var(--color-luna-border-hover);
    transform: translateY(-2px);
  }
  .logo-stage {
    position: relative;
    display: flex;
    min-height: 210px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015)),
      radial-gradient(circle at 50% 45%, rgba(0,240,255,0.08), transparent 58%),
      rgba(11,9,20,0.7);
  }
  .featured-logo-stage {
    min-height: 280px;
  }
  .logo-fallback {
    display: flex;
    width: 96px;
    height: 96px;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    border: 1px solid var(--color-luna-border-hover);
    background: rgba(255,255,255,0.04);
    color: var(--color-luna-gold);
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  @media (prefers-reduced-motion: reduce) {
    .portfolio-card { transition: none; }
    .portfolio-card:hover { transform: none; }
  }
</style>

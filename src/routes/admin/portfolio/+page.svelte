<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';
  import { PROJECT_STATUS_OPTIONS } from '$lib/validation/project';

  let { data, form }: { data: PageData; form: ActionData } = $props();
  const projects = $derived(data.projects);

  const statusLabels = {
    live: 'Live',
    concept: 'Concept',
    'in-progress': 'In Progress',
  };

  function stackValue(stack: string[]): string {
    return stack.join(', ');
  }

  function logoPreview(logoUrl: string | null): string {
    return logoUrl || '/favicon.ico';
  }
</script>

<div class="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
  <div>
    <h1 class="font-black text-lg tracking-tight">Portfolio</h1>
    <p class="text-luna-text-muted text-xs">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
  </div>

  {#if form?.success}
    <div class="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-400">
      Portfolio saved.
    </div>
  {/if}
</div>

{#if data.loadError}
  <div class="mb-6 rounded-2xl border border-luna-gold/25 bg-luna-gold/10 p-5 text-sm text-luna-text-muted">
    <p class="font-bold text-luna-gold">Projects table unavailable.</p>
    <p class="mt-1">Run <span class="font-mono text-white">src/lib/types/002_create_projects_table.sql</span> in Supabase, then reload this page.</p>
  </div>
{/if}

{#if form?.error}
  <div class="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-sm text-red-300">
    {form.error}
  </div>
{/if}

<div class="grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,390px)_1fr]">
  <section class="luna-glass h-fit rounded-2xl p-6">
    <div class="mb-5">
      <h2 class="text-sm font-black tracking-tight">Add Project</h2>
      <p class="mt-1 text-xs text-luna-text-muted">Use a PNG logo URL for the public portfolio card.</p>
    </div>

    <form method="POST" action="?/create" use:enhance class="space-y-4">
      <div class="field-group">
        <label for="new-title" class="field-label">Title</label>
        <input id="new-title" name="title" class="field-input" required />
      </div>

      <div class="field-group">
        <label for="new-category" class="field-label">Category</label>
        <input id="new-category" name="category" class="field-input" required />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="field-group">
          <label for="new-status" class="field-label">Status</label>
          <select id="new-status" name="status" class="field-input">
            {#each PROJECT_STATUS_OPTIONS as status}
              <option value={status} selected={status === 'concept'}>{statusLabels[status]}</option>
            {/each}
          </select>
        </div>

        <div class="field-group">
          <label for="new-year" class="field-label">Year</label>
          <input id="new-year" name="year" class="field-input" value={new Date().getFullYear()} required />
        </div>
      </div>

      <div class="field-group">
        <label for="new-website" class="field-label">Website URL</label>
        <input id="new-website" name="website_url" type="url" class="field-input" placeholder="https://client-site.com" />
      </div>

      <div class="field-group">
        <label for="new-logo" class="field-label">Logo PNG URL</label>
        <input id="new-logo" name="logo_url" type="url" class="field-input" placeholder="https://client-site.com/logo.png" />
      </div>

      <div class="field-group">
        <label for="new-stack" class="field-label">Stack</label>
        <input id="new-stack" name="stack" class="field-input" placeholder="SvelteKit, Supabase, Stripe" required />
      </div>

      <div class="field-group">
        <label for="new-description" class="field-label">Description</label>
        <textarea id="new-description" name="description" rows="5" class="field-input field-textarea" required></textarea>
      </div>

      <div class="flex flex-wrap gap-4">
        <label class="toggle-label">
          <input type="checkbox" name="featured" class="toggle-input" />
          Feature on homepage
        </label>
        <label class="toggle-label">
          <input type="checkbox" name="is_published" class="toggle-input" checked />
          Show on website
        </label>
      </div>

      <input type="hidden" name="sort_order" value={projects.length * 10 + 10} />

      {#if form?.intent === 'create' && form?.errors}
        <div class="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          {Object.values(form.errors)[0]}
        </div>
      {/if}

      <button type="submit" class="btn-luna-primary w-full py-3 text-xs uppercase tracking-wider" disabled={data.tableMissing}>
        Add Project
      </button>
    </form>
  </section>

  <section class="space-y-4">
    {#each projects as project (project.id)}
      <article class="luna-glass rounded-2xl p-5">
        <form method="POST" action="?/update" use:enhance class="space-y-5">
          <input type="hidden" name="id" value={project.id} />

          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <h2 class="truncate text-base font-black tracking-tight">{project.title}</h2>
              <p class="text-xs text-luna-text-muted">{project.category}</p>
            </div>

            <div class="logo-preview">
              <img src={logoPreview(project.logo_url)} alt="" class="max-h-10 max-w-36 object-contain" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="field-group">
              <label for={`title-${project.id}`} class="field-label">Title</label>
              <input id={`title-${project.id}`} name="title" class="field-input" value={project.title} required />
            </div>

            <div class="field-group">
              <label for={`category-${project.id}`} class="field-label">Category</label>
              <input id={`category-${project.id}`} name="category" class="field-input" value={project.category} required />
            </div>

            <div class="field-group">
              <label for={`status-${project.id}`} class="field-label">Status</label>
              <select id={`status-${project.id}`} name="status" class="field-input">
                {#each PROJECT_STATUS_OPTIONS as status}
                  <option value={status} selected={status === project.status}>{statusLabels[status]}</option>
                {/each}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="field-group">
                <label for={`year-${project.id}`} class="field-label">Year</label>
                <input id={`year-${project.id}`} name="year" class="field-input" value={project.year} required />
              </div>
              <div class="field-group">
                <label for={`sort-${project.id}`} class="field-label">Order</label>
                <input id={`sort-${project.id}`} name="sort_order" type="number" min="0" max="999" class="field-input" value={project.sort_order} />
              </div>
            </div>

            <div class="field-group">
              <label for={`website-${project.id}`} class="field-label">Website URL</label>
              <input id={`website-${project.id}`} name="website_url" type="url" class="field-input" value={project.website_url ?? ''} placeholder="https://client-site.com" />
            </div>

            <div class="field-group">
              <label for={`logo-${project.id}`} class="field-label">Logo PNG URL</label>
              <input id={`logo-${project.id}`} name="logo_url" type="url" class="field-input" value={project.logo_url ?? ''} placeholder="https://client-site.com/logo.png" />
            </div>
          </div>

          <div class="field-group">
            <label for={`stack-${project.id}`} class="field-label">Stack</label>
            <input id={`stack-${project.id}`} name="stack" class="field-input" value={stackValue(project.stack)} required />
          </div>

          <div class="field-group">
            <label for={`description-${project.id}`} class="field-label">Description</label>
            <textarea id={`description-${project.id}`} name="description" rows="4" class="field-input field-textarea" required>{project.description}</textarea>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap gap-4">
              <label class="toggle-label">
                <input type="checkbox" name="featured" class="toggle-input" checked={project.featured} />
                Feature on homepage
              </label>
              <label class="toggle-label">
                <input type="checkbox" name="is_published" class="toggle-input" checked={project.is_published} />
                Show on website
              </label>
            </div>

            <button type="submit" class="btn-luna-gold py-2.5 text-xs uppercase tracking-wider" disabled={data.tableMissing}>
              Save Changes
            </button>
          </div>

          {#if form?.intent === 'update' && form?.id === project.id && form?.errors}
            <div class="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
              {Object.values(form.errors)[0]}
            </div>
          {/if}
        </form>

        <form
          method="POST"
          action="?/delete"
          use:enhance
          class="mt-3 flex justify-end"
          onsubmit={(event) => {
            if (!confirm(`Delete ${project.title}?`)) event.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={project.id} />
          <button
            type="submit"
            class="rounded-full border border-red-500/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500/10"
            disabled={data.tableMissing}
          >
            Delete
          </button>
        </form>
      </article>
    {:else}
      <div class="luna-glass rounded-2xl p-10 text-center text-sm text-luna-text-muted">
        No portfolio projects yet.
      </div>
    {/each}
  </section>
</div>

<style>
  .field-group {
    display: flex;
    flex-direction: column;
  }

  .field-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-luna-text-muted);
    margin-bottom: 6px;
  }

  .field-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--color-luna-border);
    border-radius: 10px;
    padding: 10px 12px;
    color: #fff;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field-input:focus {
    border-color: rgba(0, 240, 255, 0.35);
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.08);
  }

  .field-input option {
    background: #1E143C;
    color: #fff;
  }

  .field-textarea {
    min-height: 112px;
    resize: vertical;
  }

  .toggle-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-luna-text-muted);
    font-size: 12px;
    font-weight: 700;
  }

  .toggle-input {
    border-radius: 6px;
    border-color: var(--color-luna-border);
    background: rgba(255, 255, 255, 0.04);
    color: var(--color-luna-blue);
  }

  .logo-preview {
    display: flex;
    min-height: 48px;
    width: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 1px solid var(--color-luna-border);
    background: rgba(255, 255, 255, 0.035);
  }

  @media (min-width: 1024px) {
    .logo-preview {
      width: 224px;
    }
  }
</style>

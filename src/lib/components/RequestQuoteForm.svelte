<script lang="ts">
  import { leadSchema, SERVICE_OPTIONS, type LeadFormData, type LeadFormErrors } from '$lib/validation/lead';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  // ── Form state ──────────────────────────────────────────────────────
  let formData = $state<LeadFormData>({
    name:              '',
    email:             '',
    business:          '',
    service_requested: 'Web Systems',
    message:           '',
  });

  let errors      = $state<LeadFormErrors>({});
  let touched     = $state<Partial<Record<keyof LeadFormData, boolean>>>({});
  let isLoading   = $state(false);
  let submitState = $state<'idle' | 'success' | 'error'>('idle');
  let serverError = $state('');

  // ── Per-field validation (runs on blur) ─────────────────────────────
  /**
   * Validate a single field by parsing only that key through Zod.
   * safeParse returns { success, error } — never throws.
   * We use .pick() to create a sub-schema for just the one field
   * so the user only sees errors for fields they've interacted with.
   */
  function validateField(field: keyof LeadFormData) {
    touched[field] = true;

    const fieldSchema = leadSchema.pick({ [field]: true } as any);
    const result = fieldSchema.safeParse({ [field]: formData[field] });

    if (!result.success) {
      const fieldError = result.error.errors[0];
      errors = { ...errors, [field]: fieldError?.message ?? 'Invalid value.' };
    } else {
      const { [field]: _, ...rest } = errors;
      errors = rest as LeadFormErrors;
    }
  }

  // ── Full form validation (runs on submit) ───────────────────────────
  function validateAll(): boolean {
    const result = leadSchema.safeParse(formData);
    if (result.success) {
      errors = {};
      return true;
    }

    const newErrors: LeadFormErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof LeadFormData;
      if (!newErrors[field]) {
        newErrors[field] = issue.message;
      }
    }
    errors = newErrors;

    // Mark all fields as touched so errors show immediately
    const allTouched = {} as typeof touched;
    (Object.keys(formData) as (keyof LeadFormData)[]).forEach(k => {
      allTouched[k] = true;
    });
    touched = allTouched;

    return false;
  }

  // ── Submit handler ───────────────────────────────────────────────────
  async function handleSubmit() {
    if (!validateAll()) return;

    isLoading   = true;
    submitState = 'idle';
    serverError = '';

    try {
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        submitState = 'error';
        serverError = json.message ?? 'Something went wrong. Please try again.';
      } else {
        submitState = 'success';
        // Reset form on success
        formData = {
          name:              '',
          email:             '',
          business:          '',
          service_requested: 'Web Systems',
          message:           '',
        };
        errors  = {};
        touched = {};
      }
    } catch {
      submitState = 'error';
      serverError = 'Network error — please check your connection and try again.';
    } finally {
      isLoading = false;
    }
  }

  // ── Character count for message field ───────────────────────────────
  const MESSAGE_MAX = 2000;
  let messageChars = $derived(formData.message.length);
</script>

<section
  id="quote"
  class="relative px-6 lg:px-32 py-32"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-labelledby="quote-heading"
>
  <!-- Ambient orb -->
  <div
    class="absolute left-[40%] top-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-30"
    style="background: radial-gradient(circle, rgba(138,43,226,0.15) 0%, transparent 70%);"
    aria-hidden="true"
  ></div>

  <div class="max-w-7xl mx-auto">
    <div class="grid lg:grid-cols-2 gap-20 items-start">

      <!-- ── Left: Pitch copy ──────────────────────────────────── -->
      <div class="space-y-8 lg:sticky lg:top-32">
        <div class="space-y-4">
          <SectionLabel label="Start a Project" variant="purple" />
          <h2
            id="quote-heading"
            class="text-5xl lg:text-6xl font-black tracking-tight"
          >
            Let's build
            <span class="text-luna-gradient"> something real.</span>
          </h2>
          <p class="text-luna-text-muted text-lg leading-relaxed">
            Tell us about your project. We'll come back within 24 hours
            with a scoped proposal — no generic templates, no obligation.
          </p>
        </div>

        <!-- Trust signals -->
        <div class="space-y-4">
          {#each [
            { icon: '⚡', label: 'Response within 24 hours' },
            { icon: '🎯', label: 'Scoped proposal, not a sales pitch' },
            { icon: '🔒', label: 'Your info is never shared or sold' },
          ] as signal}
            <div class="flex items-center gap-3 text-sm text-luna-text-muted">
              <span class="text-base" aria-hidden="true">{signal.icon}</span>
              {signal.label}
            </div>
          {/each}
        </div>
      </div>

      <!-- ── Right: Form ────────────────────────────────────────── -->
      <div>

        <!-- ── Success state ────────────────────────────────────── -->
        {#if submitState === 'success'}
          <div
            class="luna-glass rounded-2xl p-10 text-center space-y-4"
            role="alert"
            aria-live="polite"
          >
            <div class="text-5xl" aria-hidden="true">🌙</div>
            <h3 class="text-2xl font-black">Message received.</h3>
            <p class="text-luna-text-muted leading-relaxed">
              We'll review your project details and get back to you
              within 24 hours with a scoped proposal.
            </p>
            <button
              onclick={() => submitState = 'idle'}
              class="btn-luna-primary mt-4 inline-block text-sm"
            >
              Send another message
            </button>
          </div>

        <!-- ── Form ─────────────────────────────────────────────── -->
        {:else}
          <form
            onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            class="luna-glass rounded-2xl p-8 lg:p-10 space-y-6"
            novalidate
            aria-label="Project enquiry form"
          >

            <!-- Name + Email row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Name -->
              <div class="field-group">
                <label for="name" class="field-label">
                  Full name <span class="text-luna-neon" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  autocomplete="name"
                  placeholder="Ahmad Malik"
                  bind:value={formData.name}
                  onblur={() => validateField('name')}
                  class="field-input"
                  class:field-input--error={touched.name && errors.name}
                  aria-required="true"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {#if touched.name && errors.name}
                  <p id="name-error" class="field-error" role="alert">{errors.name}</p>
                {/if}
              </div>

              <!-- Email -->
              <div class="field-group">
                <label for="email" class="field-label">
                  Email <span class="text-luna-neon" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@company.com"
                  bind:value={formData.email}
                  onblur={() => validateField('email')}
                  class="field-input"
                  class:field-input--error={touched.email && errors.email}
                  aria-required="true"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {#if touched.email && errors.email}
                  <p id="email-error" class="field-error" role="alert">{errors.email}</p>
                {/if}
              </div>
            </div>

            <!-- Business name -->
            <div class="field-group">
              <label for="business" class="field-label">
                Business / Brand name
                <span class="text-luna-text-muted text-[10px] ml-1">(optional)</span>
              </label>
              <input
                id="business"
                type="text"
                autocomplete="organization"
                placeholder="Acme Corp"
                bind:value={formData.business}
                onblur={() => validateField('business')}
                class="field-input"
                class:field-input--error={touched.business && errors.business}
                aria-describedby={errors.business ? 'business-error' : undefined}
              />
              {#if touched.business && errors.business}
                <p id="business-error" class="field-error" role="alert">{errors.business}</p>
              {/if}
            </div>

            <!-- Service select -->
            <div class="field-group">
              <label for="service" class="field-label">
                Service needed <span class="text-luna-neon" aria-hidden="true">*</span>
              </label>
              <select
                id="service"
                bind:value={formData.service_requested}
                onblur={() => validateField('service_requested')}
                class="field-input field-select"
                aria-required="true"
              >
                {#each SERVICE_OPTIONS as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            </div>

            <!-- Message -->
            <div class="field-group">
              <div class="flex justify-between items-baseline mb-1.5">
                <label for="message" class="field-label !mb-0">
                  Project brief <span class="text-luna-neon" aria-hidden="true">*</span>
                </label>
                <span
                  class="text-[10px] tabular-nums"
                  class:text-luna-text-muted={messageChars < MESSAGE_MAX * 0.8}
                  class:text-luna-gold={messageChars >= MESSAGE_MAX * 0.8 && messageChars < MESSAGE_MAX}
                  class:text-red-400={messageChars >= MESSAGE_MAX}
                >
                  {messageChars}/{MESSAGE_MAX}
                </span>
              </div>
              <textarea
                id="message"
                rows="5"
                placeholder="Describe your project, goals, timeline, and any specific requirements..."
                bind:value={formData.message}
                onblur={() => validateField('message')}
                class="field-input field-textarea"
                class:field-input--error={touched.message && errors.message}
                aria-required="true"
                aria-describedby={errors.message ? 'message-error' : undefined}
              ></textarea>
              {#if touched.message && errors.message}
                <p id="message-error" class="field-error" role="alert">{errors.message}</p>
              {/if}
            </div>

            <!-- Server error -->
            {#if submitState === 'error'}
              <div
                class="rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                role="alert"
                aria-live="assertive"
              >
                {serverError}
              </div>
            {/if}

            <!-- Submit -->
            <button
              type="submit"
              class="btn-luna-primary w-full py-4 text-sm uppercase tracking-wider relative"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {#if isLoading}
                <span class="flex items-center justify-center gap-3">
                  <span class="loading-dot"></span>
                  <span class="loading-dot" style="animation-delay: 0.15s;"></span>
                  <span class="loading-dot" style="animation-delay: 0.30s;"></span>
                </span>
              {:else}
                Send Project Brief →
              {/if}
            </button>

            <p class="text-center text-[10px] text-luna-text-muted">
              By submitting, you agree that we may contact you about your project.
            </p>
          </form>
        {/if}

      </div>
    </div>
  </div>
</section>

<style>
  /* ── Field layout ──────────────────────────────────────────────── */
  .field-group {
    display: flex;
    flex-direction: column;
  }

  .field-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-luna-text-muted);
    margin-bottom: 6px;
  }

  /* ── Input base — overrides @tailwindcss/forms defaults ─────── */
  .field-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--color-luna-border);
    border-radius: 10px;
    padding: 12px 14px;
    color: #fff;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .field-input::placeholder {
    color: rgba(160, 155, 186, 0.4);
  }

  .field-input:focus {
    border-color: rgba(0, 240, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.08);
  }

  .field-input--error {
    border-color: rgba(239, 68, 68, 0.5);
  }
  .field-input--error:focus {
    border-color: rgba(239, 68, 68, 0.7);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A09BBA' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .field-select option {
    background: #1E143C;
    color: #fff;
  }

  .field-textarea {
    resize: vertical;
    min-height: 120px;
  }

  .field-error {
    font-size: 11px;
    color: #f87171;
    margin-top: 5px;
  }

  /* ── Loading dots ─────────────────────────────────────────── */
  .loading-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
    animation: dot-bounce 0.6s ease-in-out infinite alternate;
  }

  @keyframes dot-bounce {
    from { transform: translateY(0);    opacity: 0.4; }
    to   { transform: translateY(-5px); opacity: 1;   }
  }

  /* Disabled state */
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-input, .loading-dot { transition: none; animation: none; }
  }
</style>
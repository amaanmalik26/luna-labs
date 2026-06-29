<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import { siteDetails } from '$lib/data/site';
	import {
		leadSchema,
		SERVICE_OPTIONS,
		type LeadFormData,
		type LeadFormErrors
	} from '$lib/validation/lead';

	const emptyForm = (): LeadFormData => ({
		name: '',
		email: '',
		business: '',
		service_requested: 'Web Systems',
		message: ''
	});

	let form = $state<LeadFormData>(emptyForm());
	let errors = $state<LeadFormErrors>({});
	let touched = $state<Partial<Record<keyof LeadFormData, boolean>>>({});
	let submitting = $state(false);
	let submitState = $state<'idle' | 'success' | 'error'>('idle');
	let serverError = $state('');
	let companyWebsite = $state('');

	const fieldClass =
		'w-full bg-transparent border-0 border-b border-zinc-800 py-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors duration-300 text-sm select-text cursor-text';
	const labelClass = 'text-[10px] tracking-[0.4em] text-zinc-700 uppercase mb-2 block';

	function validateField(field: keyof LeadFormData) {
		touched[field] = true;
		const result = leadSchema.safeParse(form);
		const issue = result.success
			? undefined
			: result.error.issues.find((item) => item.path[0] === field);

		if (issue) {
			errors = { ...errors, [field]: issue.message };
			return;
		}

		const nextErrors = { ...errors };
		delete nextErrors[field];
		errors = nextErrors;
	}

	function validateForm() {
		const result = leadSchema.safeParse(form);
		if (result.success) {
			errors = {};
			return true;
		}

		const nextErrors: LeadFormErrors = {};
		for (const issue of result.error.issues) {
			const field = issue.path[0] as keyof LeadFormData;
			if (!nextErrors[field]) nextErrors[field] = issue.message;
		}

		errors = nextErrors;
		touched = Object.fromEntries(
			(Object.keys(form) as (keyof LeadFormData)[]).map((field) => [field, true])
		) as Partial<Record<keyof LeadFormData, boolean>>;
		return false;
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!validateForm()) return;

		submitting = true;
		submitState = 'idle';
		serverError = '';

		try {
			const response = await fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...form, company_website: companyWebsite })
			});
			const result = (await response.json()) as {
				message?: string;
				errors?: LeadFormErrors;
			};

			if (!response.ok) {
				errors = result.errors ?? errors;
				serverError = result.message ?? 'Something went wrong. Please try again.';
				submitState = 'error';
				return;
			}

			form = emptyForm();
			companyWebsite = '';
			errors = {};
			touched = {};
			submitState = 'success';
		} catch {
			serverError = 'Network error. Please check your connection and try again.';
			submitState = 'error';
		} finally {
			submitting = false;
		}
	}
</script>

<section id="contact" class="relative px-12 py-32 md:px-20">
	<div class="mx-auto max-w-5xl">
		<div class="mb-20 flex items-baseline justify-between">
			<p
				use:reveal={{ duration: 0.7 }}
				class="text-[10px] tracking-[0.45em] text-zinc-600 uppercase"
				style:font-family="'Barlow', sans-serif"
			>
				Get in Touch
			</p>
		</div>

		<div class="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-32">
			<div use:reveal={{ y: 20, duration: 0.7 }} class="space-y-8">
				<h2
					class="text-3xl leading-snug text-zinc-100 md:text-4xl"
					style:font-family="'Barlow', sans-serif"
					style:font-weight="700"
				>
					Let's build
					<br />
					something worth
					<br />
					shipping.
				</h2>

				<div class="space-y-6 pt-4">
					<div>
						<p class={labelClass} style:font-family="'Barlow', sans-serif">Email</p>
						<a
							href={`mailto:${siteDetails.email}`}
							class="cursor-pointer text-sm text-zinc-400 transition-colors select-text hover:text-zinc-100"
						>
							{siteDetails.email}
						</a>
					</div>
					<div>
						<p class={labelClass} style:font-family="'Barlow', sans-serif">Location</p>
						<p class="text-sm text-zinc-400">{siteDetails.location}</p>
					</div>
					<div>
						<p class={labelClass} style:font-family="'Barlow', sans-serif">Office Hours</p>
						<p class="text-sm text-zinc-400">{siteDetails.officeHours}</p>
					</div>
				</div>
			</div>

			<div use:reveal={{ y: 20, duration: 0.7, delay: 0.1 }}>
				{#if submitState === 'success'}
					<div class="pt-8" role="status" aria-live="polite">
						<p
							class="mb-2 text-lg text-zinc-300"
							style:font-family="'Barlow', sans-serif"
							style:font-weight="600"
						>
							Project request received.
						</p>
						<p class="max-w-md text-sm leading-relaxed text-zinc-600">
							Your request was saved and the Luna Labs team has been notified. We will reply within
							one business day.
						</p>
						<button
							type="button"
							class="mt-8 text-[10px] tracking-widest text-zinc-500 uppercase transition-colors hover:text-zinc-100"
							onclick={() => (submitState = 'idle')}
						>
							Send another request
						</button>
					</div>
				{:else}
					<form
						class="space-y-8"
						style:font-family="'Barlow', sans-serif"
						onsubmit={handleSubmit}
						novalidate
					>
						<div class="sr-only" aria-hidden="true">
							<label for="contact-company-website">Company website</label>
							<input
								id="contact-company-website"
								name="company_website"
								type="text"
								tabindex="-1"
								autocomplete="off"
								bind:value={companyWebsite}
							/>
						</div>

						<div class="grid gap-8 sm:grid-cols-2">
							<div>
								<label for="contact-name" class={labelClass}>Name</label>
								<input
									id="contact-name"
									name="name"
									type="text"
									autocomplete="name"
									bind:value={form.name}
									onblur={() => validateField('name')}
									placeholder="Your name"
									required
									class={fieldClass}
									class:border-red-400={touched.name && errors.name}
								/>
								{#if touched.name && errors.name}<p class="mt-2 text-xs text-red-400">
										{errors.name}
									</p>{/if}
							</div>

							<div>
								<label for="contact-email" class={labelClass}>Email</label>
								<input
									id="contact-email"
									name="email"
									type="email"
									autocomplete="email"
									bind:value={form.email}
									onblur={() => validateField('email')}
									placeholder="your@email.com"
									required
									class={fieldClass}
									class:border-red-400={touched.email && errors.email}
								/>
								{#if touched.email && errors.email}<p class="mt-2 text-xs text-red-400">
										{errors.email}
									</p>{/if}
							</div>
						</div>

						<div class="grid gap-8 sm:grid-cols-2">
							<div>
								<label for="contact-business" class={labelClass}>Business / Brand</label>
								<input
									id="contact-business"
									name="business"
									type="text"
									autocomplete="organization"
									bind:value={form.business}
									onblur={() => validateField('business')}
									placeholder="Optional"
									class={fieldClass}
								/>
							</div>

							<div>
								<label for="contact-service" class={labelClass}>Service</label>
								<select
									id="contact-service"
									name="service_requested"
									bind:value={form.service_requested}
									onblur={() => validateField('service_requested')}
									class={`${fieldClass} bg-[#0d0d0e]`}
								>
									{#each SERVICE_OPTIONS as option (option)}<option value={option}>{option}</option
										>{/each}
								</select>
							</div>
						</div>

						<div>
							<label for="contact-message" class={labelClass}>Message</label>
							<textarea
								id="contact-message"
								name="message"
								bind:value={form.message}
								onblur={() => validateField('message')}
								placeholder="Tell us about your project..."
								required
								rows={4}
								class={`${fieldClass} resize-none`}
								class:border-red-400={touched.message && errors.message}
							></textarea>
							{#if touched.message && errors.message}<p class="mt-2 text-xs text-red-400">
									{errors.message}
								</p>{/if}
						</div>

						{#if submitState === 'error'}
							<p class="text-sm text-red-400" role="alert">{serverError}</p>
						{/if}

						<button
							type="submit"
							disabled={submitting}
							class="group flex items-center gap-3 pt-2 text-sm text-zinc-400 transition-colors duration-300 hover:text-zinc-100 disabled:cursor-wait disabled:opacity-50"
						>
							<span class="text-[11px] tracking-widest uppercase">
								{submitting ? 'Sending...' : 'Send project request'}
							</span>
							<ArrowRight
								size={14}
								class="transition-transform duration-300 group-hover:translate-x-1.5"
							/>
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

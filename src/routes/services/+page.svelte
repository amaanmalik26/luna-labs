<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- hashes are appended to resolved routes */
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		Code2,
		LayoutDashboard,
		PanelsTopLeft,
		Smartphone,
		UtensilsCrossed,
		UsersRound,
		Wrench,
		type Icon
	} from 'lucide-svelte';
	import { primaryServices, studioServices } from '$lib/data/services';
	import { siteDetails } from '$lib/data/site';

	const secondaryServices = studioServices.filter((service) => !service.primary);
	const icons: Record<string, typeof Icon> = {
		'01': Code2,
		'02': Smartphone,
		'03': LayoutDashboard,
		'04': PanelsTopLeft,
		'05': UtensilsCrossed,
		'06': UsersRound,
		'07': Wrench
	};
</script>

<svelte:head>
	<title>Services | Luna Labs</title>
	<meta
		name="description"
		content="Luna Labs designs and develops websites, mobile applications, dashboards, ordering systems, and digital platforms for modern businesses."
	/>
	<link rel="canonical" href={`${siteDetails.url}/services`} />
</svelte:head>

<div class="px-6 pt-36 pb-24 sm:px-10 md:px-16 md:pt-44">
	<header class="mx-auto max-w-6xl border-b border-zinc-800/70 pb-20 md:pb-28">
		<div class="mb-10 flex items-center justify-between gap-6">
			<p class="section-label">Services</p>
			<p class="mono-label">Digital design + development</p>
		</div>
		<h1>Systems made clear.</h1>
		<div class="mt-10 grid gap-8 md:grid-cols-[1fr_0.68fr] md:items-end">
			<p class="max-w-2xl text-lg leading-9 text-zinc-400">
				From the public interface to the operational logic behind it, Luna Labs builds digital
				products that are easier to understand, use, and maintain.
			</p>
			<p class="text-sm leading-7 text-zinc-600 md:text-right">
				New builds, focused rebuilds, and long-term technical support for businesses that need
				structure rather than another template.
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-6xl">
		<section class="py-20 md:py-28">
			<div class="mb-16 flex items-end justify-between gap-8">
				<div>
					<p class="section-label mb-5">Core capabilities</p>
					<h2>Built from the foundation up.</h2>
				</div>
				<p class="mono-label hidden md:block">02 primary disciplines</p>
			</div>

			<div class="border-t border-zinc-800/70">
				{#each primaryServices as service (service.number)}
					{@const ServiceIcon = icons[service.number]}
					<article class="primary-service">
						<div class="service-index">
							<span>{service.number}</span>
							<ServiceIcon size={30} strokeWidth={1.2} />
						</div>
						<div>
							<h3>{service.name}</h3>
							<p class="mt-6 max-w-xl text-base leading-8 text-zinc-500">
								{service.description}
							</p>
						</div>
						<div>
							<p class="section-label mb-5">Typical scope</p>
							<ul class="deliverable-list">
								{#each service.deliverables as deliverable (deliverable)}
									<li>{deliverable}</li>
								{/each}
							</ul>
							<p class="mt-8 text-sm leading-7 text-zinc-600">{service.bestFor}</p>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<section class="border-t border-zinc-800/70 py-20 md:py-28">
			<div class="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
				<div>
					<p class="section-label mb-5">Specialist systems</p>
					<h2>Focused around the operation.</h2>
				</div>
				<p class="max-w-lg text-sm leading-7 text-zinc-600 md:justify-self-end">
					The right system depends on the work it needs to support. These focused capabilities can
					stand alone or connect to a wider build.
				</p>
			</div>

			<div class="service-list">
				{#each secondaryServices as service (service.number)}
					{@const ServiceIcon = icons[service.number]}
					<article>
						<span class="mono-label">{service.number}</span>
						<ServiceIcon size={22} strokeWidth={1.2} />
						<div>
							<h3>{service.name}</h3>
							<p>{service.description}</p>
						</div>
						<ul>
							{#each service.deliverables.slice(0, 3) as deliverable (deliverable)}
								<li>{deliverable}</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</section>

		<section class="border-t border-zinc-800/70 py-20 md:py-28">
			<p class="section-label mb-12">Ways to work together</p>
			<div class="engagement-grid">
				<div>
					<span>01</span>
					<h3>New build</h3>
					<p>Plan and deliver a website or system from a clean foundation.</p>
				</div>
				<div>
					<span>02</span>
					<h3>Focused rebuild</h3>
					<p>Replace a weak interface or workflow without rebuilding what already works.</p>
				</div>
				<div>
					<span>03</span>
					<h3>Ongoing support</h3>
					<p>Maintain, improve, and extend an existing Luna Labs or third-party build.</p>
				</div>
			</div>
		</section>

		<section class="border-t border-zinc-800/70 pt-20 md:pt-28">
			<p class="section-label mb-7">Start with the problem</p>
			<div class="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
				<h2 class="max-w-3xl">Tell us what needs to work better.</h2>
				<a href={`${resolve('/')}#contact`} class="contact-link">
					Start a project <ArrowRight size={14} strokeWidth={1.5} />
				</a>
			</div>
		</section>
	</main>
</div>

<style>
	.section-label,
	.mono-label,
	.engagement-grid span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.23em;
		text-transform: uppercase;
	}

	.section-label {
		color: rgb(161 161 170);
	}
	.mono-label,
	.engagement-grid span {
		color: rgb(82 82 91);
	}

	h1 {
		max-width: 980px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(3.8rem, 9vw, 8.6rem);
		font-weight: 650;
		line-height: 0.88;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	h2 {
		max-width: 700px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(2.6rem, 5.4vw, 5.2rem);
		font-weight: 600;
		line-height: 0.96;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	.primary-service {
		display: grid;
		gap: 40px;
		padding: 64px 0;
		border-bottom: 1px solid rgb(39 39 42 / 0.72);
	}

	.service-index {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		color: rgb(113 113 122);
	}

	.service-index span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.2em;
	}
	.primary-service h3 {
		max-width: 560px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(2.4rem, 4.8vw, 4.7rem);
		font-weight: 600;
		line-height: 0.96;
		color: #f4f4f5;
	}

	.deliverable-list {
		border-top: 1px solid rgb(63 63 70 / 0.7);
	}
	.deliverable-list li {
		padding: 12px 0;
		border-bottom: 1px solid rgb(63 63 70 / 0.7);
		font-size: 13px;
		color: rgb(161 161 170);
	}

	.service-list {
		border-top: 1px solid rgb(39 39 42 / 0.72);
	}
	.service-list article {
		display: grid;
		align-items: start;
		gap: 24px;
		padding: 36px 0;
		border-bottom: 1px solid rgb(39 39 42 / 0.72);
	}
	.service-list article > :global(svg) {
		color: rgb(113 113 122);
	}
	.service-list h3 {
		font-family: 'Barlow', sans-serif;
		font-size: 28px;
		font-weight: 550;
		color: #e4e4e7;
	}
	.service-list p {
		max-width: 500px;
		margin-top: 8px;
		font-size: 14px;
		line-height: 1.8;
		color: rgb(113 113 122);
	}
	.service-list ul {
		display: grid;
		gap: 8px;
		font-size: 12px;
		color: rgb(82 82 91);
	}
	.service-list li::before {
		content: '-';
		margin-right: 10px;
	}

	.engagement-grid {
		display: grid;
		gap: 1px;
		border: 1px solid rgb(39 39 42 / 0.72);
		background: rgb(39 39 42 / 0.72);
	}
	.engagement-grid div {
		min-height: 230px;
		padding: 28px;
		background: #111113;
	}
	.engagement-grid h3 {
		margin-top: 64px;
		font-family: 'Barlow', sans-serif;
		font-size: 26px;
		font-weight: 550;
		color: #e4e4e7;
	}
	.engagement-grid p {
		margin-top: 12px;
		font-size: 13px;
		line-height: 1.8;
		color: rgb(113 113 122);
	}

	.contact-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		flex: 0 0 auto;
		background: #f4f4f5;
		padding: 14px 18px;
		font-family: 'Barlow', sans-serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.18em;
		color: #111113;
		text-transform: uppercase;
	}

	@media (min-width: 768px) {
		.primary-service {
			grid-template-columns: 90px minmax(0, 1.1fr) minmax(260px, 0.7fr);
			gap: 52px;
		}
		.service-list article {
			grid-template-columns: 54px 36px minmax(0, 1fr) minmax(240px, 0.7fr);
		}
		.engagement-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, Code2, Smartphone } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import { primaryServices } from '$lib/data/services';

	const serviceIcons = {
		code: Code2,
		mobile: Smartphone
	} as const;
</script>

<section id="services" class="relative px-12 py-32 md:px-20">
	<div class="mx-auto max-w-5xl">
		<div class="mb-20 flex items-baseline justify-between">
			<p
				use:reveal={{ duration: 0.7 }}
				class="text-[10px] tracking-[0.45em] text-zinc-600 uppercase"
				style:font-family="'Barlow', sans-serif"
			>
				Services
			</p>
			<span
				use:reveal={{ duration: 0.7, delay: 0.1 }}
				class="text-[10px] tracking-widest text-zinc-700"
				style:font-family="'JetBrains Mono', monospace"
			>
				02 primary
			</span>
		</div>

		<div class="grid gap-7 md:grid-cols-2">
			{#each primaryServices as service, i (service.number)}
				{@const Icon = serviceIcons[service.icon]}
				<div
					use:reveal={{ y: 22, duration: 0.7, delay: i * 0.08 }}
					class="service-panel group grid min-h-[360px] content-between gap-12 p-9 transition-colors duration-300 md:p-11"
				>
					<div class="flex items-start justify-between gap-8">
						<span class="text-[10px] text-zinc-700" style:font-family="'JetBrains Mono', monospace">
							{service.number}
						</span>
						<div class="service-mark flex h-24 w-36 items-center justify-center">
							<Icon
								size={32}
								strokeWidth={1.15}
								class="text-zinc-600 transition-colors duration-300 group-hover:text-zinc-200"
							/>
						</div>
					</div>

					<div class="max-w-xl">
						<h3
							class="mb-6 text-4xl leading-[1] text-zinc-200 transition-colors duration-300 group-hover:text-zinc-100 md:text-5xl"
							style:font-family="'Barlow', sans-serif"
							style:font-weight="650"
						>
							{service.name}
						</h3>
						<p
							class="max-w-lg text-sm leading-relaxed text-zinc-600 transition-colors duration-300 group-hover:text-zinc-500 md:text-base"
						>
							{service.description}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<div>
			<a
				href={resolve('/services')}
				use:reveal={{ y: 12, duration: 0.6, delay: 0.18 }}
				class="group mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.35em] text-zinc-500 uppercase transition-colors hover:text-zinc-100"
				style:font-family="'Barlow', sans-serif"
			>
				View more services
				<ArrowRight
					size={14}
					strokeWidth={1.4}
					class="transition-transform duration-300 group-hover:translate-x-1.5"
				/>
			</a>
		</div>
	</div>
</section>

<style>
	.service-mark {
		background:
			linear-gradient(90deg, rgb(39 39 42 / 0.3) 1px, transparent 1px),
			linear-gradient(rgb(39 39 42 / 0.22) 1px, transparent 1px);
		background-size: 18px 18px;
		border: 1px solid rgb(39 39 42 / 0.45);
	}

	.service-panel {
		border-top: 1px solid rgb(39 39 42 / 0.58);
		border-bottom: 1px solid rgb(39 39 42 / 0.58);
		background:
			linear-gradient(135deg, rgb(39 39 42 / 0.22), transparent 34%),
			linear-gradient(180deg, rgb(24 24 27 / 0.48), rgb(9 9 11 / 0.2));
	}

	.service-panel:hover {
		border-color: rgb(113 113 122 / 0.72);
	}

	@media (min-width: 768px) {
		.service-panel + .service-panel {
			border-left: 1px solid rgb(39 39 42 / 0.42);
			padding-left: 3rem;
		}
	}
</style>

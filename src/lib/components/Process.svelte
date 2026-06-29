<script lang="ts">
	import { onMount } from 'svelte';
	import { Code2, Rocket, Search, SquarePen } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import { processSteps } from '$lib/data/process';

	const processIcons = {
		research: Search,
		prototype: SquarePen,
		development: Code2,
		deploy: Rocket
	} as const;

	let timeline: HTMLDivElement;
	let started = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0]?.isIntersecting) return;
				started = true;
				observer.disconnect();
			},
			{ threshold: 0.28 }
		);

		if (timeline) observer.observe(timeline);

		return () => observer.disconnect();
	});
</script>

<section id="process" class="relative px-12 py-32 md:px-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-24 flex items-baseline justify-between">
			<p
				use:reveal={{ duration: 0.7 }}
				class="text-[10px] tracking-[0.45em] text-zinc-600 uppercase"
				style:font-family="'Barlow', sans-serif"
			>
				Process
			</p>
			<span
				use:reveal={{ duration: 0.7, delay: 0.1 }}
				class="text-[10px] tracking-widest text-zinc-700"
				style:font-family="'JetBrains Mono', monospace"
			>
				animated timeline
			</span>
		</div>

		<div bind:this={timeline} class="process-map" class:started>
			<div class="process-line" aria-hidden="true">
				<span></span>
			</div>

			{#each processSteps as step, i (step.number)}
				{@const Icon = processIcons[step.icon]}
				<article
					class="process-card"
					style:--step-delay={`${0.35 + i * 0.88}s`}
					style:--step-index={i}
				>
					<div class="process-dot" aria-hidden="true">
						<span></span>
					</div>

					<p class="process-num">{step.number}</p>
					<div class="process-icon">
						<Icon size={22} strokeWidth={1.35} />
					</div>
					<h3>{step.name}</h3>
					<p class="process-copy">{step.description}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.process-map {
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 42px;
		padding-top: 66px;
	}

	.process-line {
		position: absolute;
		top: 20px;
		right: 6%;
		left: 6%;
		height: 2px;
		overflow: hidden;
		background: rgb(39 39 42 / 0.72);
	}

	.process-line span {
		display: block;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, rgb(113 113 122), rgb(244 244 245), rgb(113 113 122));
		transform: scaleX(0);
		transform-origin: left;
	}

	.process-card {
		position: relative;
		min-height: 330px;
		padding: 36px 30px 32px;
		border: 1px solid rgb(39 39 42 / 0.52);
		background:
			linear-gradient(180deg, rgb(24 24 27 / 0.74), rgb(9 9 11 / 0.34)),
			linear-gradient(90deg, rgb(39 39 42 / 0.2) 1px, transparent 1px),
			linear-gradient(rgb(39 39 42 / 0.13) 1px, transparent 1px);
		background-size:
			auto,
			24px 24px,
			24px 24px;
		opacity: 0;
		transform: translateY(26px) scale(0.96);
	}

	.process-dot {
		position: absolute;
		top: -58px;
		left: 50%;
		display: grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 1px solid rgb(63 63 70);
		background: #0d0d0e;
		opacity: 0.48;
		transform: translateX(-50%) scale(0.82);
	}

	.process-dot span {
		width: 8px;
		height: 8px;
		background: rgb(113 113 122);
	}

	.process-num {
		margin-bottom: 28px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		color: rgb(113 113 122);
	}

	.process-icon {
		display: flex;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		margin-bottom: 40px;
		border: 1px solid rgb(63 63 70 / 0.72);
		background: rgb(244 244 245 / 0.045);
		color: rgb(212 212 216 / 0.86);
	}

	.process-card h3 {
		margin-bottom: 20px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(1.7rem, 2.15vw, 2.45rem);
		font-weight: 650;
		line-height: 1.03;
		color: rgb(244 244 245);
		text-transform: none;
	}

	.process-copy {
		font-size: 14px;
		line-height: 1.8;
		color: rgb(113 113 122);
	}

	.process-map.started .process-line span {
		animation: process-fill 3.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.process-map.started .process-dot {
		animation: process-dot-hit 0.48s cubic-bezier(0.22, 1, 0.36, 1) var(--step-delay) forwards;
	}

	.process-map.started .process-card {
		animation: process-card-pop 0.64s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--step-delay) + 0.16s)
			forwards;
	}

	@keyframes process-fill {
		to {
			transform: scaleX(1);
		}
	}

	@keyframes process-dot-hit {
		50% {
			opacity: 1;
			transform: translateX(-50%) scale(1.18);
		}

		to {
			border-color: rgb(244 244 245 / 0.78);
			opacity: 1;
			transform: translateX(-50%) scale(1);
		}
	}

	@keyframes process-card-pop {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (max-width: 1180px) {
		.process-map {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 70px 34px;
		}

		.process-line {
			display: none;
		}

		.process-card {
			opacity: 1;
			transform: none;
		}

		.process-dot {
			opacity: 1;
			transform: translateX(-50%) scale(1);
		}
	}

	@media (max-width: 760px) {
		.process-map {
			display: block;
			padding-top: 0;
			padding-left: 32px;
		}

		.process-line {
			top: 0;
			bottom: 0;
			left: 0;
			width: 2px;
			height: auto;
		}

		.process-line span {
			transform: scaleY(0);
			transform-origin: top;
		}

		.process-card {
			min-height: auto;
			margin-bottom: 22px;
			padding: 30px 24px;
		}

		.process-dot {
			top: 28px;
			left: -32px;
		}

		.process-map.started .process-line span {
			animation-name: process-fill-mobile;
		}
	}

	@keyframes process-fill-mobile {
		to {
			transform: scaleY(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.process-line span,
		.process-dot,
		.process-card {
			animation: none !important;
			opacity: 1;
			transform: none;
		}

		.process-dot {
			transform: translateX(-50%);
		}
	}
</style>

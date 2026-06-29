<script lang="ts">
	import firebaseLogo from '$lib/assets/svg/Firebase.svg';
	import githubLogo from '$lib/assets/svg/GitHub.svg';
	import javascriptLogo from '$lib/assets/svg/JavaScript.svg';
	import nodeLogo from '$lib/assets/svg/Node.js.svg';
	import postgresLogo from '$lib/assets/svg/PostgresSQL.svg';
	import svelteLogo from '$lib/assets/svg/Svelte.svg';
	import tailwindLogo from '$lib/assets/svg/Tailwind-CSS.svg';
	import typescriptLogo from '$lib/assets/svg/TypeScript.svg';
	import vercelLogo from '$lib/assets/svg/Vercel.svg';
	import viteLogo from '$lib/assets/svg/Vite.js.svg';
	import { reveal } from '$lib/actions/reveal';

	const stack = [
		{ name: 'SvelteKit', logo: svelteLogo },
		{ name: 'TypeScript', logo: typescriptLogo },
		{ name: 'Tailwind', logo: tailwindLogo },
		{ name: 'Node.js', logo: nodeLogo },
		{ name: 'Vite', logo: viteLogo },
		{ name: 'Postgres', logo: postgresLogo },
		{ name: 'Firebase', logo: firebaseLogo },
		{ name: 'Vercel', logo: vercelLogo },
		{ name: 'GitHub', logo: githubLogo },
		{ name: 'JavaScript', logo: javascriptLogo }
	];
</script>

<section id="stack" class="relative px-12 py-28 md:px-20">
	<div use:reveal={{ y: 16, duration: 0.65 }} class="mx-auto max-w-6xl">
		<div class="mb-14 flex items-end justify-between gap-10">
			<div>
				<p
					class="mb-5 text-[10px] tracking-[0.45em] text-zinc-700 uppercase"
					style:font-family="'Barlow', sans-serif"
				>
					Tech Stack
				</p>
				<h2
					class="max-w-2xl text-4xl leading-[1] text-zinc-100 uppercase md:text-5xl"
					style:font-family="'Barlow', sans-serif"
					style:font-weight="650"
				>
					The tools behind the build.
				</h2>
			</div>

			<p
				class="hidden max-w-xs text-right text-sm leading-relaxed text-zinc-600 md:block"
				style:font-family="'Barlow', sans-serif"
			>
				Modern frontend, backend, deployment, and data tools used to ship practical digital systems.
			</p>
		</div>

		<div class="tech-window">
			<div class="tech-marquee">
				{#each [...stack, ...stack] as item, i (`${item.name}-${i}`)}
					<div class="tech-item">
						<div class="tech-logo">
							<img src={item.logo} alt={`${item.name} logo`} loading="lazy" />
						</div>
						<p>{item.name}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.tech-window {
		position: relative;
		overflow: hidden;
		padding: 28px 0;
		background:
			linear-gradient(90deg, #0d0d0e, transparent 16%, transparent 84%, #0d0d0e),
			linear-gradient(180deg, rgb(24 24 27 / 0.62), rgb(9 9 11 / 0.22));
	}

	.tech-marquee {
		display: flex;
		min-width: max-content;
		gap: 18px;
		animation: stack-slide 34s linear infinite;
	}

	.tech-item {
		display: grid;
		width: 142px;
		min-height: 132px;
		place-items: center;
		gap: 16px;
		border: 1px solid rgb(39 39 42 / 0.58);
		background: rgb(12 12 14 / 0.78);
	}

	.tech-logo {
		display: flex;
		width: 58px;
		height: 58px;
		align-items: center;
		justify-content: center;
		opacity: 1;
		transition: transform 0.25s ease;
	}

	.tech-logo img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.tech-item:hover .tech-logo {
		transform: translateY(-2px);
	}

	.tech-item p {
		font-family: 'Barlow', sans-serif;
		font-size: 10px;
		letter-spacing: 0.26em;
		color: rgb(113 113 122);
		text-align: center;
		text-transform: uppercase;
	}

	@keyframes stack-slide {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(calc(-50% - 9px));
		}
	}

	@media (max-width: 768px) {
		.tech-item {
			width: 118px;
			min-height: 112px;
		}

		.tech-logo {
			width: 46px;
			height: 46px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-marquee {
			animation: none;
			flex-wrap: wrap;
		}
	}
</style>

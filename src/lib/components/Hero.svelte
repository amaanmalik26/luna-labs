<script lang="ts">
	import { onMount } from 'svelte';
	import SocialIcon from './SocialIcon.svelte';

	const CONSOLE_LINES = [
		'$ npx create-luna-app@latest my-project',
		'',
		'  Creating a new Luna Labs project...',
		'  ✓ Template scaffolded',
		'  ✓ Dependencies installed (3.2s)',
		'',
		'$ cd my-project && npm run dev',
		'',
		'  ▲ LUNA LABS  v3.1.0  ready in 291ms',
		'',
		'  ➜  Local:    http://localhost:3000',
		'  ➜  Network:  http://192.168.0.1:3000',
		'',
		'$ git push origin main',
		'  ✓ Build compiled  (1.8s)',
		'  ✓ Deployed to production',
		'  ✓  https://my-project.lunalabs.dev'
	];

	const socials = [
		{ icon: 'twitter', label: 'Twitter' },
		{ icon: 'linkedin', label: 'LinkedIn' },
		{ icon: 'github', label: 'GitHub' }
	] as const;

	const codeBits = [
		{ text: 'const flow = build();', x: '15%', y: '27%', delay: '0.4s' },
		{ text: '<system ready />', x: '70%', y: '25%', delay: '1.8s' },
		{ text: 'deploy --prod', x: '22%', y: '64%', delay: '3.2s' },
		{ text: 'route("/contact")', x: '77%', y: '58%', delay: '2.6s' },
		{ text: '{ services: true }', x: '38%', y: '18%', delay: '4.4s' },
		{ text: 'pnpm run dev', x: '58%', y: '73%', delay: '5.2s' },
		{ text: 'api.status = 200', x: '11%', y: '48%', delay: '6.1s' },
		{ text: '</>', x: '84%', y: '39%', delay: '0.9s' },
		{ text: 'function launch() {}', x: '18%', y: '39%', delay: '5.8s' },
		{ text: 'npm run build', x: '66%', y: '66%', delay: '6.7s' },
		{ text: '<main />', x: '47%', y: '82%', delay: '3.9s' }
	] as const;

	const symbolBits = [
		{ text: '{}', x: '28%', y: '22%', delay: '1.1s' },
		{ text: '</>', x: '73%', y: '44%', delay: '2.1s' },
		{ text: '=>', x: '18%', y: '72%', delay: '0.6s' },
		{ text: '[]', x: '88%', y: '30%', delay: '4.7s' },
		{ text: '#', x: '61%', y: '16%', delay: '3.3s' },
		{ text: '01', x: '34%', y: '69%', delay: '6.2s' }
	] as const;

	let phase = $state(0);
	let introVisible = $state(false);
	let showSocial = $state(false);
	let showTagline = $state(false);
	let showConsole = $state(false);
	let typedLines = $state<string[]>([]);
	let lineIdx = $state(0);
	let charIdx = $state(0);

	const currentPartial = $derived(
		showConsole && lineIdx < CONSOLE_LINES.length ? CONSOLE_LINES[lineIdx].slice(0, charIdx) : ''
	);

	onMount(() => {
		const timers: number[] = [];

		timers.push(window.setTimeout(() => (introVisible = true), 0));
		timers.push(window.setTimeout(() => (phase = 1), 1000));
		timers.push(
			window.setTimeout(() => {
				showSocial = true;
				showTagline = true;
			}, 2500)
		);
		timers.push(window.setTimeout(() => (showConsole = true), 3300));

		return () => {
			for (const timer of timers) window.clearTimeout(timer);
		};
	});

	$effect(() => {
		if (!showConsole) return;
		if (lineIdx >= CONSOLE_LINES.length) return;

		const line = CONSOLE_LINES[lineIdx];
		let timer: number;

		if (charIdx < line.length) {
			const speed = line.startsWith('$') ? 55 : 22;
			timer = window.setTimeout(() => (charIdx += 1), speed);
		} else {
			const pause = line.includes('✓') ? 70 : line === '' ? 100 : 380;
			timer = window.setTimeout(() => {
				typedLines = [...typedLines, line];
				lineIdx += 1;
				charIdx = 0;
			}, pause);
		}

		return () => window.clearTimeout(timer);
	});

	const lineClass = (line: string) => {
		if (line.startsWith('$')) return 'text-emerald-400';
		if (line.includes('✓')) return 'text-green-400';
		if (line.startsWith('  ▲') || line.startsWith('  ➜')) return 'text-zinc-300';
		if (line === '') return 'text-transparent';
		return 'text-zinc-500';
	};
</script>

<section class="relative h-screen overflow-hidden bg-[#0d0d0e]">
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_45%,#1b1b1e_0%,#0d0d0e_75%)]"
	></div>

	<div class="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
		{#each codeBits as bit (bit.text)}
			<span
				class="hero-code-bit"
				style:--bit-x={bit.x}
				style:--bit-y={bit.y}
				style:--bit-delay={bit.delay}
			>
				{bit.text}
			</span>
		{/each}
		{#each symbolBits as bit (`symbol-${bit.text}-${bit.x}`)}
			<span
				class="hero-symbol-bit"
				style:--bit-x={bit.x}
				style:--bit-y={bit.y}
				style:--bit-delay={bit.delay}
			>
				{bit.text}
			</span>
		{/each}
	</div>

	<div
		class="hero-social absolute top-1/2 left-8 z-20 flex -translate-y-1/2 flex-col gap-5"
		class:visible={showSocial}
	>
		{#each socials as social (social.label)}
			<a
				href="#top"
				aria-label={social.label}
				class="text-zinc-500 transition-colors hover:text-zinc-100"
			>
				<SocialIcon name={social.icon} size={16} strokeWidth={1.8} />
			</a>
		{/each}
	</div>

	<div
		class="hero-social absolute top-1/2 right-8 z-20 flex -translate-y-1/2 items-center"
		class:visible={showSocial}
	>
		<span
			class="text-[9px] tracking-[0.4em] text-zinc-700 uppercase"
			style:writing-mode="vertical-rl"
			style:transform="rotate(180deg)"
			style:font-family="'Barlow', sans-serif"
		>
			Scroll
		</span>
	</div>

	<div class="hero-stage absolute inset-0 z-20 flex flex-col items-center justify-center">
		<p
			class="hero-kicker mb-5 text-[11px] font-medium tracking-[0.55em] text-zinc-400 uppercase"
			class:visible={introVisible}
			style:font-family="'Barlow', sans-serif"
		>
			We Are
		</p>

		<h1
			class="hero-title leading-none tracking-tight text-zinc-100 uppercase select-none"
			class:visible={introVisible}
			style:font-family="'Barlow', sans-serif"
			style:font-weight="800"
			style:font-size={phase >= 1 ? '7vw' : '18vw'}
		>
			Luna Labs
		</h1>
	</div>

	<div
		class="hero-tagline absolute right-12 bottom-14 z-20 text-right"
		class:visible={showTagline}
		style:font-family="'Barlow', sans-serif"
	>
		<p class="text-[11px] leading-loose font-light tracking-[0.22em] text-zinc-400 uppercase">
			Building Systems
			<br />
			that Flow
		</p>
	</div>

	<div
		class="hero-console absolute bottom-20 left-1/2 z-20 w-full max-w-xl px-6 md:bottom-24"
		class:visible={showConsole}
	>
		<div
			class="overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-950/80 shadow-2xl backdrop-blur-md"
		>
			<div class="flex items-center gap-1.5 border-b border-zinc-800/60 bg-zinc-900/60 px-4 py-2.5">
				<div class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80"></div>
				<div class="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80"></div>
				<div class="h-2.5 w-2.5 rounded-full bg-[#28c840]/80"></div>
				<span
					class="ml-3 text-[9px] tracking-widest text-zinc-600 uppercase"
					style:font-family="'JetBrains Mono', monospace"
				>
					~/luna-terminal
				</span>
			</div>

			<div
				class="h-40 overflow-hidden px-4 py-3 text-[11px] leading-[1.65]"
				style:font-family="'JetBrains Mono', monospace"
			>
				{#each typedLines as line, i (`${line}-${i}`)}
					<div class={lineClass(line)}>{line === '' ? '\u00A0' : line}</div>
				{/each}
				{#if lineIdx < CONSOLE_LINES.length}
					<div
						class={CONSOLE_LINES[lineIdx].startsWith('$') ? 'text-emerald-400' : 'text-zinc-500'}
					>
						{currentPartial}
						<span class="animate-[pulse_0.9s_ease-in-out_infinite] opacity-90">▋</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.hero-stage {
		transform: translateY(-7.5vh);
	}

	.hero-code-bit {
		position: absolute;
		top: var(--bit-y);
		left: var(--bit-x);
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.14em;
		color: rgb(161 161 170 / 0.44);
		opacity: 0;
		text-transform: uppercase;
		transform: translateY(8px);
		animation: code-pop 7.6s ease-in-out infinite;
		animation-delay: var(--bit-delay);
	}

	.hero-symbol-bit {
		position: absolute;
		top: var(--bit-y);
		left: var(--bit-x);
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(1.2rem, 2.1vw, 2.5rem);
		font-weight: 400;
		color: rgb(161 161 170 / 0.16);
		opacity: 0;
		transform: scale(0.88) translateY(10px);
		animation: symbol-pop 8.8s ease-in-out infinite;
		animation-delay: var(--bit-delay);
	}

	@keyframes code-pop {
		0%,
		28%,
		100% {
			opacity: 0;
			transform: translateY(8px);
		}

		38%,
		62% {
			opacity: 0.58;
			transform: translateY(0);
		}
	}

	@keyframes symbol-pop {
		0%,
		34%,
		100% {
			opacity: 0;
			transform: scale(0.88) translateY(10px);
		}

		44%,
		68% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.hero-social {
		opacity: 0;
		transition: opacity 0.9s ease;
	}

	.hero-social.visible {
		opacity: 1;
	}

	.hero-kicker {
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.8s ease 0.25s,
			transform 0.8s ease 0.25s;
	}

	.hero-kicker.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-title {
		opacity: 0;
		transition:
			opacity 0.55s ease 0.1s,
			font-size 1.7s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hero-title.visible {
		opacity: 1;
	}

	.hero-tagline {
		opacity: 0;
		transform: translateY(12px) scale(0.65);
		transition:
			opacity 1s cubic-bezier(0.22, 1, 0.36, 1),
			transform 1s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hero-tagline.visible {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.hero-console {
		opacity: 0;
		transform: translate(-50%, 56px);
		transition:
			opacity 0.95s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.95s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hero-console.visible {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	@media (max-width: 768px) {
		.hero-stage {
			transform: translateY(-9vh);
		}

		.hero-code-bit {
			font-size: 9px;
		}

		.hero-symbol-bit {
			font-size: 1.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-code-bit,
		.hero-symbol-bit {
			animation: none;
			opacity: 0.18;
			transform: none;
		}
	}
</style>

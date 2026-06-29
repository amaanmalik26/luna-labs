<script lang="ts">
	import { onMount } from 'svelte';

	let x = $state(-200);
	let y = $state(-200);
	let hovering = $state(false);
	let visible = $state(false);

	const ring = $derived(hovering ? 40 : 28);

	onMount(() => {
		const onMove = (event: MouseEvent) => {
			x = event.clientX;
			y = event.clientY;
			visible = true;
		};
		const onEnter = () => (hovering = true);
		const onLeave = () => (hovering = false);

		const attached = new WeakSet<Element>();
		const attach = () => {
			document.querySelectorAll('a, button, input, textarea, [data-cursor]').forEach((element) => {
				if (attached.has(element)) return;
				attached.add(element);
				element.addEventListener('mouseenter', onEnter);
				element.addEventListener('mouseleave', onLeave);
			});
		};

		window.addEventListener('mousemove', onMove);
		attach();

		const observer = new MutationObserver(attach);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener('mousemove', onMove);
			observer.disconnect();
		};
	});
</script>

<div
	class="site-cursor pointer-events-none fixed z-[9999] rounded-full bg-zinc-100"
	style:width="5px"
	style:height="5px"
	style:opacity={visible ? 1 : 0}
	style:transform={`translate3d(${x - 2.5}px, ${y - 2.5}px, 0) scale(${hovering ? 1.6 : 1})`}
></div>
<div
	class="site-cursor site-cursor-ring pointer-events-none fixed z-[9998] rounded-full"
	style:border={hovering ? '1px solid rgba(244,244,245,0.55)' : '1px solid rgba(244,244,245,0.22)'}
	style:width={`${ring}px`}
	style:height={`${ring}px`}
	style:opacity={visible ? 1 : 0}
	style:transform={`translate3d(${x - ring / 2}px, ${y - ring / 2}px, 0)`}
></div>

<style>
	.site-cursor {
		transition: opacity 120ms linear;
	}

	.site-cursor-ring {
		transition:
			transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
			width 220ms cubic-bezier(0.22, 1, 0.36, 1),
			height 220ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 220ms ease,
			opacity 120ms linear;
	}
</style>

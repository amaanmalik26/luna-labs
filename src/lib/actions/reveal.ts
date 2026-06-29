import { animate, inView } from 'motion';
import type { Action } from 'svelte/action';

type RevealOptions = {
	delay?: number;
	duration?: number;
	y?: number;
	amount?: number;
};

export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
	if (typeof window === 'undefined') return;

	const { delay = 0, duration = 0.7, y = 0, amount = 0.2 } = options;
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reducedMotion) return;

	node.style.opacity = '0';
	if (y !== 0) node.style.transform = `translateY(${y}px)`;

	const stop = inView(
		node,
		() => {
			animate(
				node,
				{
					opacity: [0, 1],
					transform: y === 0 ? undefined : [`translateY(${y}px)`, 'translateY(0px)']
				},
				{
					delay,
					duration,
					ease: [0.22, 1, 0.36, 1]
				}
			);
		},
		{ amount }
	);

	return {
		destroy() {
			stop();
		}
	};
};

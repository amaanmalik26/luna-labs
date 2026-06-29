<script lang="ts">
	import { base } from '$app/paths';

	let {
		variant = 'wordmark',
		class: className = ''
	}: {
		variant?: 'mark' | 'wordmark';
		class?: string;
	} = $props();

	const source = $derived(
		variant === 'mark' ? `${base}/brand/luna-labs-mark.svg` : `${base}/brand/luna-labs-logo.svg`
	);
</script>

<img src={source} alt="Luna Labs" class={className} />

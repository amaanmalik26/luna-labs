<script lang="ts">
	import { ChevronLeft, ChevronRight, Quote, Star, UserRound } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import { testimonials } from '$lib/data/testimonials';

	let scroller: HTMLDivElement;

	function moveTestimonials(direction: -1 | 1) {
		if (!scroller) return;
		scroller.scrollBy({
			left: direction * scroller.clientWidth,
			behavior: 'smooth'
		});
	}
</script>

<section id="testimonials" class="relative px-12 py-32 md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-20 flex items-baseline justify-between gap-8">
			<p
				use:reveal={{ duration: 0.7 }}
				class="text-[10px] tracking-[0.45em] text-zinc-600 uppercase"
				style:font-family="'Barlow', sans-serif"
			>
				Testimonials
			</p>

			{#if testimonials.length > 3}
				<div use:reveal={{ duration: 0.7, delay: 0.1 }} class="flex items-center gap-3">
					<button
						type="button"
						aria-label="Previous testimonials"
						class="testimonial-arrow"
						onclick={() => moveTestimonials(-1)}
					>
						<ChevronLeft size={17} strokeWidth={1.4} />
					</button>
					<button
						type="button"
						aria-label="Next testimonials"
						class="testimonial-arrow"
						onclick={() => moveTestimonials(1)}
					>
						<ChevronRight size={17} strokeWidth={1.4} />
					</button>
				</div>
			{/if}
		</div>

		<div bind:this={scroller} use:reveal={{ y: 16, duration: 0.7 }} class="testimonial-track">
			{#each testimonials as testimonial (testimonial.name)}
				<article class="testimonial-card">
					<div class="testimonial-head">
						<div class="testimonial-stars" aria-label="Five star testimonial">
							{#each Array.from({ length: 5 }, (_, star) => star) as star (star)}
								<Star size={14} fill="currentColor" strokeWidth={0} />
							{/each}
						</div>
						<Quote size={40} strokeWidth={1.05} />
					</div>

					<blockquote class="mb-14 text-lg leading-relaxed text-zinc-300">
						"{testimonial.quote}"
					</blockquote>

					<div class="testimonial-rule"></div>

					<div class="flex items-center gap-4">
						<div class="testimonial-avatar">
							<UserRound size={17} strokeWidth={1.35} />
						</div>
						<div>
							<p
								class="mb-1 text-sm tracking-[0.18em] text-zinc-200 uppercase"
								style:font-family="'Barlow', sans-serif"
								style:font-weight="600"
							>
								{testimonial.name}
							</p>
							<p
								class="text-[10px] tracking-[0.3em] text-zinc-700 uppercase"
								style:font-family="'Barlow', sans-serif"
							>
								{testimonial.role}
							</p>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.testimonial-track {
		display: grid;
		grid-auto-columns: calc((100% - 32px) / 3);
		grid-auto-flow: column;
		gap: 16px;
		overflow-x: auto;
		scroll-behavior: smooth;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}

	.testimonial-track::-webkit-scrollbar {
		display: none;
	}

	.testimonial-card {
		position: relative;
		min-height: 390px;
		padding: 34px;
		border: 1px solid rgb(39 39 42 / 0.55);
		background:
			linear-gradient(135deg, rgb(63 63 70 / 0.18), transparent 42%),
			linear-gradient(180deg, rgb(24 24 27 / 0.82), rgb(9 9 11 / 0.44));
		scroll-snap-align: start;
		transition:
			border-color 0.25s ease,
			transform 0.25s ease;
	}

	.testimonial-card::after {
		position: absolute;
		right: 22px;
		bottom: 22px;
		width: 74px;
		height: 74px;
		pointer-events: none;
		content: '';
		background:
			linear-gradient(90deg, rgb(63 63 70 / 0.28) 1px, transparent 1px),
			linear-gradient(rgb(63 63 70 / 0.2) 1px, transparent 1px);
		background-size: 12px 12px;
		opacity: 0.5;
	}

	.testimonial-card:hover {
		border-color: rgb(113 113 122 / 0.72);
		transform: translateY(-3px);
	}

	.testimonial-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 32px;
		color: rgb(244 244 245 / 0.14);
	}

	.testimonial-stars {
		display: flex;
		gap: 4px;
		color: rgb(244 244 245 / 0.82);
	}

	.testimonial-rule {
		height: 1px;
		margin-bottom: 24px;
		background: linear-gradient(90deg, rgb(63 63 70 / 0.75), transparent);
	}

	.testimonial-avatar {
		display: flex;
		width: 40px;
		height: 40px;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(63 63 70 / 0.7);
		background: rgb(244 244 245 / 0.05);
		color: rgb(161 161 170);
	}

	.testimonial-arrow {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(39 39 42 / 0.75);
		color: rgb(113 113 122);
		transition:
			border-color 0.25s ease,
			color 0.25s ease,
			transform 0.25s ease;
	}

	.testimonial-arrow:hover {
		border-color: rgb(113 113 122 / 0.9);
		color: rgb(244 244 245);
		transform: translateY(-1px);
	}

	@media (max-width: 900px) {
		.testimonial-track {
			grid-auto-columns: 82%;
		}
	}
</style>

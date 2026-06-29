export interface Testimonial {
	quote: string;
	name: string;
	role: string;
}

export const testimonials: Testimonial[] = [
	{
		quote:
			'Luna Labs gave our website a much cleaner structure and made the enquiry flow easier for customers to use.',
		name: 'Signature Fitness',
		role: 'Gym Website'
	},
	{
		quote:
			'The ordering experience became easier to understand, from menu browsing to checkout and delivery planning.',
		name: 'TOT by RHS',
		role: 'Restaurant Ordering'
	},
	{
		quote:
			'They helped turn a scattered community workflow into something organized, usable, and ready to grow.',
		name: 'Virtual PAF',
		role: 'Community Platform'
	},
	{
		quote:
			'The internal systems work brought leads, projects, quotations, and delivery into a clearer process.',
		name: 'Luna Labs Systems',
		role: 'Internal Operations'
	}
];

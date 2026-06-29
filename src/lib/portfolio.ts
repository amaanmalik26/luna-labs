import type { ProjectStatus } from '$lib/types/database';

export interface PortfolioProject {
	id: string;
	title: string;
	category: string;
	description: string;
	stack: string[];
	status: ProjectStatus;
	website_url: string | null;
	logo_url: string | null;
	year: string;
	featured: boolean;
	sort_order: number;
	is_published: boolean;
}

export const defaultPortfolioProjects: PortfolioProject[] = [
	{
		id: '11111111-1111-4111-8111-111111111111',
		title: 'Signature Fitness',
		category: 'Gym Website',
		description:
			'A premium fitness website built around programs, memberships, location clarity, and WhatsApp lead generation.',
		stack: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Vercel'],
		status: 'live',
		website_url: 'https://signature-fitness-alpha.vercel.app/',
		logo_url: null,
		year: '2026',
		featured: true,
		sort_order: 0,
		is_published: true
	},
	{
		id: '22222222-2222-4222-8222-222222222222',
		title: 'Motornity Store',
		category: 'E-Commerce',
		description:
			'A motorcycle gear storefront with product discovery, cart flow, brand-heavy visuals, and commerce structure.',
		stack: ['WordPress', 'WooCommerce', 'JavaScript', 'CSS'],
		status: 'live',
		website_url: 'https://motornity.pk/',
		logo_url: null,
		year: '2026',
		featured: false,
		sort_order: 10,
		is_published: true
	},
	{
		id: '33333333-3333-4333-8333-333333333333',
		title: 'NY212 Orders',
		category: 'Restaurant Ordering',
		description:
			'A restaurant ordering experience for menu browsing, cart, checkout, delivery flow, and customer ordering clarity.',
		stack: ['Web Ordering', 'Responsive UI', 'Checkout Flow'],
		status: 'live',
		website_url: 'https://orders.ny-212.com/',
		logo_url: null,
		year: '2026',
		featured: false,
		sort_order: 20,
		is_published: true
	}
];

export function sortPortfolioProjects(projects: PortfolioProject[]): PortfolioProject[] {
	return [...projects].sort((a, b) => {
		if (a.featured !== b.featured) return a.featured ? -1 : 1;
		if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
		return a.title.localeCompare(b.title);
	});
}

export function normalisePortfolioProject(project: PortfolioProject): PortfolioProject {
	return {
		...project,
		stack: Array.isArray(project.stack) ? project.stack.filter(Boolean) : [],
		website_url: project.website_url?.trim() || null,
		logo_url: project.logo_url?.trim() || null,
		year: project.year || String(new Date().getFullYear())
	};
}

export function projectSlug(project: Pick<PortfolioProject, 'title'>): string {
	return project.title
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function projectHost(url: string | null): string {
	if (!url) return 'Preview unavailable';

	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}

const EMBED_ALLOWED_HOSTS = new Set(['signature-fitness-alpha.vercel.app', 'motornity.pk']);

export function projectCanEmbed(project: Pick<PortfolioProject, 'website_url'>): boolean {
	if (!project.website_url) return false;
	return EMBED_ALLOWED_HOSTS.has(projectHost(project.website_url));
}

export function projectStatusLabel(status: ProjectStatus): string {
	if (status === 'in-progress') return 'In progress';
	return status.charAt(0).toUpperCase() + status.slice(1);
}

export interface StudioService {
	number: string;
	name: string;
	description: string;
	icon: 'code' | 'mobile';
	primary: boolean;
	deliverables: string[];
	bestFor: string;
}

export const studioServices: StudioService[] = [
	{
		number: '01',
		name: 'Web & Software Development',
		description:
			'Websites, dashboards, landing pages, and software systems built with clean structure, performance, and business clarity.',
		icon: 'code',
		primary: true,
		deliverables: [
			'Marketing websites',
			'Business dashboards',
			'Custom web applications',
			'CMS integration'
		],
		bestFor: 'Brands and teams replacing fragmented tools or building a serious digital presence.'
	},
	{
		number: '02',
		name: 'Mobile Applications',
		description:
			'Modern mobile experiences for service brands, communities, ordering flows, and internal business tools.',
		icon: 'mobile',
		primary: true,
		deliverables: [
			'Responsive product design',
			'Cross-platform applications',
			'Customer portals',
			'Operational tools'
		],
		bestFor: 'Businesses that need core workflows available wherever their customers or teams work.'
	},
	{
		number: '03',
		name: 'Business Systems',
		description: 'Dashboards, ordering systems, internal tools, and workflows for operations.',
		icon: 'code',
		primary: false,
		deliverables: [
			'Internal dashboards',
			'Lead management',
			'Quotation workflows',
			'Reporting views'
		],
		bestFor: 'Teams moving important operations out of spreadsheets and disconnected inboxes.'
	},
	{
		number: '04',
		name: 'Landing Pages',
		description: 'Focused campaign and offer pages designed to move visitors toward action.',
		icon: 'code',
		primary: false,
		deliverables: [
			'Campaign pages',
			'Offer positioning',
			'Conversion flows',
			'Analytics-ready builds'
		],
		bestFor: 'Focused offers, launches, and campaigns that need one clear path to action.'
	},
	{
		number: '05',
		name: 'Restaurant Ordering Systems',
		description:
			'Menu, cart, checkout, delivery flow, and admin-ready systems for food businesses.',
		icon: 'mobile',
		primary: false,
		deliverables: ['Digital menus', 'Cart and checkout', 'Delivery zones', 'Admin-ready structure'],
		bestFor: 'Restaurants that need a direct, brand-owned ordering experience.'
	},
	{
		number: '06',
		name: 'Community Platforms',
		description:
			'Member portals, applications, role-based tools, and digital systems for communities.',
		icon: 'code',
		primary: false,
		deliverables: ['Member portals', 'Applications', 'Role-based access', 'Events and operations'],
		bestFor: 'Communities that have outgrown chat-only operations and need structure.'
	},
	{
		number: '07',
		name: 'Maintenance & Support',
		description: 'Updates, fixes, improvements, and technical care after launch.',
		icon: 'code',
		primary: false,
		deliverables: ['Routine updates', 'Bug fixes', 'Performance reviews', 'Feature improvements'],
		bestFor: 'Teams that want a dependable technical partner after launch.'
	}
];

export const primaryServices = studioServices.filter((service) => service.primary);

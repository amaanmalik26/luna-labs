export interface ProcessStep {
	number: string;
	name: string;
	description: string;
	icon: 'research' | 'prototype' | 'development' | 'deploy';
}

export const processSteps: ProcessStep[] = [
	{
		number: '01',
		name: 'Research',
		description:
			'We understand the business, audience, goals, competitors, and the digital flow the project needs.',
		icon: 'research'
	},
	{
		number: '02',
		name: 'Prototyping',
		description:
			'We map the structure, content, screens, and user actions before development starts.',
		icon: 'prototype'
	},
	{
		number: '03',
		name: 'Development',
		description:
			'We build the website or system with clean code, responsive layouts, and maintainable logic.',
		icon: 'development'
	},
	{
		number: '04',
		name: 'Deploy',
		description:
			'We test, optimize, launch, and prepare the build for real users and future iteration.',
		icon: 'deploy'
	}
];
